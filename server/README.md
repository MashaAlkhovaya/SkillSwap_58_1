# Мок-сервер SkillSwap

```bash
npm --prefix server ci
npm --prefix server run dev       # http://localhost:4000/api
npm --prefix server run typecheck
npm --prefix server test
npm --prefix server run reset     # удалить базу и загруженные изображения
```

`start` запускает `index.ts` через `tsx`, `dev` добавляет перезапуск при изменениях.
При первом запуске `server/data` заполняется из `public/db`. После обновления
контракта старую локальную базу нужно сбросить. Типы сущностей и справочники
переиспользуются из `src/shared`, серверные типы находятся в `server/types`.
Проверки входящих запросов выполняются вручную; JSON-база при запуске не валидируется.

## Вход

`POST /api/auth/login`, `Content-Type: application/json`:

```json
{ "email": "anna.smirnova@example.com", "password": "SkillSwapMock2025!" }
```

Почта обрезается по краям и приводится к нижнему регистру. Пароль передаётся
без преобразований. Ответ `200`: `{ id, name, email, token }`.
Некорректное тело — `400`, неверные учётные данные — `401` с одинаковым
сообщением для неизвестной почты и неверного пароля.

## Регистрация

`POST /api/auth/register`, `multipart/form-data`:

- `data`: текстовое поле с JSON формы из примера ниже;
- `images`: от 1 до 5 файлов, каждый отдельной частью с тем же именем поля.

```json
{
  "email": "new@example.com",
  "password": "SkillSwapMock2025!",
  "name": "Анна",
  "birthDate": "1995-02-08T00:00:00.000Z",
  "gender": "female",
  "city": "Москва",
  "wantsToLearn": {
    "categories": ["languages", "art"],
    "subCategories": ["english", "acting"]
  },
  "canTeach": {
    "title": "Уроки рисования",
    "category": "art",
    "subCategory": "illustration",
    "description": "Научу рисовать акварелью"
  }
}
```

Все поля обязательны. Имя — минимум 2 символа, пароль — минимум 8,
название навыка — 3–50, описание — 1–500. Текстовые поля обрезаются по краям,
кроме пароля. Дата рождения — канонический ISO UTC из `Date.toISOString()`,
существующая и не в будущем; минимального возраста нет. Пол — `female | male`,
город — только из `CITIES`.

Оба массива интересов непустые, без повторений. ID берутся из `SKILL_CATEGORIES`.
Для каждой выбранной подкатегории обучения должна быть выбрана родительская
категория. Категория может быть выбрана без собственных подкатегорий, если
общий массив подкатегорий непустой. Подкатегория преподаваемого навыка должна
принадлежать его категории.

Изображения — JPEG, PNG или WebP, до 2 МБ каждое. Сервер проверяет MIME-тип и
сигнатуру. Порядок файлов сохраняется. В браузере запрос формируется так:

```ts
const form = new FormData()
form.append('data', JSON.stringify(data))
images.forEach((file) => form.append('images', file))
await fetch('/api/auth/register', { method: 'POST', body: form })
```

`Content-Type` вручную не задаётся: браузер добавляет multipart boundary.

Регистрация создаёт пользователя и навык `type: 'teach'`, связывает их через
`authorId` и `canTeach.id`. Ответ `201`: `{ id, name, email, token }`.
Ошибка формы или файлов — `400`, занятая почта — `409`.
Все ошибки возвращаются как `{ message: string }`.

Файлы сохраняются в `server/data/uploads/skills/<skillId>/<uuid>.<extension>`.
`GET /api/skills/:id` возвращает только `imageUrls: string[]` для изображений навыка.
Выбор изображения для обложки выполняет фронтенд. Ссылки начинаются с
`/api/uploads/skills/` и доступны как статика, в том числе через Vite-прокси.
В исходных моках без изображений допустим `imageUrls: []`.
При ошибке сохранения регистрации файлы удаляются, запись навыка откатывается.
Две JSON-базы не обеспечивают транзакции при аварийном завершении процесса.

## Профиль и списки

`GET /api/auth/me` принимает `Authorization: Bearer <token>` и возвращает
полный профиль без `password` и `login`, с `likesReceived` и обоими массивами
`wantsToLearn`. Токены и пароли здесь предназначены для локального мока.

Существующие ручки `/api/users`, `/api/users/:id`, `/api/skills`, `/api/skills/:id`
сохраняются. Пагинация возвращает `{ items, page, limit, total, hasMore }`.
Навыки поддерживают фильтры `category`, `subCategory`, `type`, `q`;
пользователи — сортировки `new`, `popular`, `random`.

Имитация: по умолчанию задержка 1000 мс; `?delay=1500` меняет её в пределах
1000–5000 мс. Неизвестные параметры игнорируются. Раздача изображений выполняется
без искусственной задержки.

## Postman

Коллекция: `server/postman/skillswap.postman_collection.json`.
Рабочая папка — корень репозитория, файлы примеров — `server/postman/fixtures`.
В Postman Desktop настройте Working directory на корень проекта. Запускайте
папки целиком по порядку: запросы используют переменные предыдущих ответов.

```bash
postman collection run server/postman/skillswap.postman_collection.json \
  --working-dir . --no-report-events
```

Прогон создаёт тестового пользователя, навык и изображения. Повторный запуск
поддерживается: почта генерируется заново, последняя страница навыков вычисляется
по текущему количеству. При необходимости очистите данные командой `reset`.
