const fs = require('node:fs')
const path = require('node:path')
const express = require('express')

const PORT = 4000
const DATA = path.join(__dirname, 'data')
const SEED = path.join(__dirname, '..', 'public', 'db')

// ─── Данные ──────────────────────────────────────────────
// Своя локальная псевдо-БД у каждого: папка data/ в .gitignore,
// при первом старте заполняется копиями моков из public/db/.
if (!fs.existsSync(DATA)) fs.mkdirSync(DATA)
for (const name of ['users', 'skills']) {
  const file = path.join(DATA, `${name}.json`)
  if (!fs.existsSync(file)) fs.copyFileSync(path.join(SEED, `${name}.json`), file)
}

const users = JSON.parse(fs.readFileSync(path.join(DATA, 'users.json'), 'utf-8'))
const skills = JSON.parse(fs.readFileSync(path.join(DATA, 'skills.json'), 'utf-8'))

// Популярность — это входящие лайки: likes у юзера хранит, КОГО лайкнул он сам.
// Считаем один раз при старте, до рестарта это константа. Появится ручка «лайкнуть» —
// индекс придётся обновлять вместе с массивом likes.
const likesReceived = new Map()
for (const user of users) {
  for (const id of user.likes) likesReceived.set(id, (likesReceived.get(id) || 0) + 1)
}

/** Пишет массив на диск. Синхронно — чтобы два запроса не перекрыли запись друг друга */
const save = (name, arr) =>
  fs.writeFileSync(path.join(DATA, `${name}.json`), JSON.stringify(arr, null, 2))

// ─── Хелперы ─────────────────────────────────────────────
/**
 * Срезает пароль и подставляет счётчик входящих лайков: наружу пользователь
 * уходит только через эту функцию. Счётчик не хранится в JSON намеренно —
 * он выводится из likes и разошёлся бы с ними при ручной правке моков.
 */
const publicUser = ({ password: _password, ...rest }) => ({
  ...rest,
  likesReceived: likesReceived.get(rest.id) || 0,
})

// Сортировка перед нарезкой обязательна и всегда одна и та же, иначе вторая
// страница может повторить элемент с первой. Для навыков порядок произвольный,
// важно лишь, что он детерминированный: id склеен с датой как запасной ключ.
const byDate = (a, b) => (a.createdAt + a.id).localeCompare(b.createdAt + b.id)

/** Нарезает массив на страницу. hasMore нужен фронту, чтобы остановить infinite scroll */
function paginate(req, all) {
  const page = Math.max(1, Number(req.query.page) || 1)
  const limit = Math.min(Math.max(1, Number(req.query.limit) || 10), 100)
  const start = (page - 1) * limit
  const items = all.slice(start, start + limit)
  return { items, page, limit, total: all.length, hasMore: start + items.length < all.length }
}

// ─── Сортировки пользователей ────────────────────────────
/** FNV-1a. Один и тот же сид даёт один и тот же порядок, другой сид — другой */
const hash = (str) => {
  let h = 2166136261
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// Запасной ключ: у большинства юзеров лайков поровну (ноль), и без него sort
// вправе переставить их как угодно — вторая страница повторит кого-то с первой
const byId = (a, b) => a.id.localeCompare(b.id)

const USER_SORTS = {
  new: () => (a, b) => b.createdAt.localeCompare(a.createdAt) || byId(a, b),
  popular: () => (a, b) =>
    (likesReceived.get(b.id) || 0) - (likesReceived.get(a.id) || 0) || byId(a, b),
  // Перестановка, а не перемешивание: порядок — чистая функция от сида и id
  random: (seed) => (a, b) => hash(seed + a.id) - hash(seed + b.id) || byId(a, b),
}

/** Сид «рекомендуем»: общий для всех, меняется раз в сутки, переживает рестарт */
const daySeed = () => new Date().toISOString().slice(0, 10)

const app = express()
app.use(express.json())

// CORS нужен только если фронт ходит на :4000 мимо Vite-прокси
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})

// delay 1000 на все запросы
app.use((req, res, next) => {
  if (req.query.delay) {
    return setTimeout(next, Math.min(Math.max(1000, Number(req.query.delay) || 0), 5000))
  }
  return setTimeout(next, 1000)
})

// ─── Навыки ──────────────────────────────────────────────
app.get('/api/skills', (req, res) => {
  const { category, subCategory, type, q } = req.query
  let list = skills
  // Фильтры до нарезки, иначе total и hasMore будут врать
  if (category) list = list.filter((s) => s.category === category)
  if (subCategory) list = list.filter((s) => s.subCategory === subCategory)
  if (type) list = list.filter((s) => s.type === type)
  if (q) list = list.filter((s) => s.title.toLowerCase().includes(String(q).toLowerCase()))
  res.json(paginate(req, [...list].sort(byDate)))
})

app.get('/api/skills/:id', (req, res) => {
  const skill = skills.find((s) => s.id === req.params.id)
  if (!skill) return res.status(404).json({ message: 'Навык не найден' })
  res.json(skill)
})

// ─── Пользователи ────────────────────────────────────────
app.get('/api/users', (req, res) => {
  const sort = String(req.query.sort || 'new')
  const makeComparator = USER_SORTS[sort]
  if (!makeComparator) return res.status(400).json({ message: `Неизвестная сортировка: ${sort}` })

  // Сид считаем один раз на запрос: компаратор вызовется сотни раз
  const { items, ...meta } = paginate(req, [...users].sort(makeComparator(daySeed())))
  res.json({ items: items.map(publicUser), ...meta })
})

app.get('/api/users/:id', (req, res) => {
  const user = users.find((u) => u.id === req.params.id)
  if (!user) return res.status(404).json({ message: 'Пользователь не найден' })
  res.json(publicUser(user))
})

// ─── Авторизация ─────────────────────────────────────────
app.post('/api/auth/register', (req, res) => {
  const { name, email, login, password } = req.body || {}

  if (!name || name.trim().length < 2) return res.status(400).json({ message: 'Укажите имя' })
  if (!/.+@.+\..+/.test(email || '')) return res.status(400).json({ message: 'Некорректный email' })
  if (!login || login.trim().length < 3)
    return res.status(400).json({ message: 'Логин короче 3 символов' })
  if (!password || password.length < 8)
    return res.status(400).json({ message: 'Пароль короче 8 символов' })
  if (users.some((u) => u.login === login))
    return res.status(409).json({ message: 'Этот логин уже занят' })
  if (users.some((u) => u.email === email))
    return res.status(409).json({ message: 'Этот email уже занят' })

  const user = {
    id: `user-${Date.now()}`,
    name,
    email,
    login,
    password,
    avatarUrl: null,
    createdAt: new Date().toISOString(),
    birthDate: '',
    gender: 'female',
    city: '',
    bio: '',
    likes: [],
    // В моках это объект. Фронту на новом юзере понадобится проверка на null.
    canTeach: null,
    wantsToLearn: [],
  }

  users.push(user)
  save('users', users)
  res.status(201).json({ id: user.id, name, email, token: `token-${user.id}` })
})

app.post('/api/auth/login', (req, res) => {
  const { login, password } = req.body || {}
  const user = users.find((u) => u.login === login)
  // Один и тот же ответ на неверный логин и на неверный пароль: иначе форма
  // превращается в способ узнать, какие логины существуют.
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Неправильные логин или пароль' })
  }
  res.json({ id: user.id, name: user.name, email: user.email, token: `token-${user.id}` })
})

app.get('/api/auth/me', (req, res) => {
  const id = (req.headers.authorization || '').replace('Bearer token-', '')
  const user = users.find((u) => u.id === id)
  if (!user) return res.status(401).json({ message: 'Нужна авторизация' })
  res.json(publicUser(user))
})

// ─── Хвост ───────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ message: `Ручки ${req.method} ${req.path} нет` }))

app.listen(PORT, () => {
  console.log(`SkillSwap mock API → http://localhost:${PORT}/api`)
  console.log(`${users.length} пользователей, ${skills.length} навыков`)
})
