# SkillSwap
SkillSwap — это платформа для обмена навыками, построенная на принципах взаимовыгодного сотрудничества (менторинга).

Ключевые возможности платформы:

Умный подбор: Алгоритмы предлагают пользователю «точные совпадения» и «рекомендации», основываясь на его интересах и текущих навыках.

Гибкая фильтрация: Поиск единомышленников по категориям, конкретным навыкам, городам и форматам обучения.

Личный кабинет: Удобный профиль, где можно указать, чему вы можете научить, и чему хотите научиться, а также настроить личные данные.

Система избранного: Возможность сохранять понравившиеся карточки пользователей, чтобы вернуться к ним позже.

Мгновенные обмены: Встроенная система уведомлений и предложений обмена (например, «Олег принял ваш обмен»), которая помогает не упустить важные договоренности.

По сути, SkillSwap помогает найти людей, с которыми можно обменяться полезными навыками без финансовых затрат.

---

## Быстрый старт

```bash
npm install
npm run dev
```

Открой [http://localhost:5173](http://localhost:5173)

---

 Запуск сервера (Mock API)
В соседнем терминале перейдите в папку server и запустите сервер (подробная инструкция также лежит в server/README.md):

```bash
cd server
npm install
npm run start
```
Сервер будет доступен по адресу: http://localhost:3000 (по умолчанию).
Для работы с API и тестирования авторизации вы можете использовать готовую коллекцию Postman, которая лежит в server/postman/skillswap.postman_collection.json.

---

## Технологический стек
React 18 + TypeScript

Vite (сборщик)

Redux Toolkit (State management)

React Router v6 (Роутинг)

CSS Modules + CSS-переменные (Стилизация)

Jest + React Testing Library (Юнит-тесты)

Storybook (Документация UI-компонентов)

---

## State management

Проект использует **Redux Toolkit**. Store настроен в `src/store/index.ts`.

Для работы со store используй типизированные хуки из `src/store/hooks.ts` — `useAppDispatch` и `useAppSelector` вместо оригинальных из react-redux.

---

## Структура проекта

```
src/
├── api/                  # fetch-функции для загрузки JSON-моков
├── app/
│   ├── providers/        # StoreProvider, RouterProvider
│   └── styles/           # global.css с CSS-переменными
├── entities/             # Доменные модели: Skill, User, Request
│   ├── skill/
│   ├── user/
│   └── request/
├── features/             # Фичи: auth, skills, favorites, requests
├── pages/                # Страницы приложения
├── shared/
│   ├── hooks/            # useDebounce, useLocalStorage
│   ├── lib/              # constants, helpers
│   ├── types/            # общие TypeScript-типы
│   └── ui/               # атомарные компоненты
├── store/                # Redux store и типизированные хуки
└── widgets/              # Составные блоки: Header, SkillCard, FiltersBar

public/
└── db/
    ├── skills.json       # Добавь сюда моки навыков
    └── users.json        # Добавь сюда моки пользователей
```

---

## Моки данных

Файлы `public/db/skills.json` и `public/db/users.json` **пустые**.

Структура объектов описана в `src/shared/types/index.ts`.

---

## Доступные скрипты

| Скрипт | Что делает |
|--------|------------|
| `npm run dev` | Запуск dev-сервера |
| `npm run build` | Сборка для продакшена |
| `npm run lint` | Проверка ESLint + Stylelint |
| `npm run lint:fix` | Автоисправление lint-ошибок |
| `npm run format` | Форматирование через Prettier |
| `npm run test` | Запуск тестов |
| `npm run test:watch` | Тесты в watch-режиме |
| `npm run test:coverage` | Покрытие (цель ≥ 70%) |
| `npm run storybook` | Запуск Storybook для просмотра UI-компонентов
---

## Роутинг

Маршруты объявлены в `src/shared/lib/constants.ts` → `ROUTES`.

Lazy-загрузка уже настроена в `src/app/providers/RouterProvider.tsx`.

Для защищённых маршрутов добавь компонент `PrivateRoute` в `src/features/auth/ui/`.

---

## Переменные окружения

Создай `.env.local` для локальных настроек (в `.gitignore` уже исключён):

```
VITE_APP_TITLE=SkillSwap
VITE_API_URL=/api
```

Доступ в коде: `import.meta.env.VITE_APP_TITLE`

---

## Git-процесс

```
main        ← только стабильный код, не трогаем напрямую
└── develop ← основная ветка разработки, PR только сюда
    └── feature/catalog-filters   ← твоя задача
        └── → PR → code review → merge в develop
```

Перед началом каждой задачи:
```bash
git checkout develop
git pull
git checkout -b feature/название-задачи
```

После завершения:
```bash
git add (и изиененнае файлы)
git commit -m "feat: описание сделанной задачи"
git push -u origin feature/название-задачи
# открываешь PR из своей ветки → в develop
```

Ветки называй: `feature/`, `fix/`, `refactor/`, `docs/`, `chore/`

Коммиты по [Conventional Commits](https://www.conventionalcommits.org/ru/):
```
feat: добавить фильтр по категориям
fix: исправить отображение карточки на мобильном
refactor: вынести логику избранного в хук
```

PR — не больше ~200 строк изменений. Вливает только тимлид или его заместитель. `--force` и `merge --no-ff` в `develop` запрещены.

---

## CI

GitHub Actions запускается на каждый push и PR:
- `npm run lint`
- `tsc --noEmit`
- `npm run test`
- `npm run build`

Если CI красный — PR не мержится.

## Документация

- [Архитектура проекта (FSD)](docs/ARCHITECTURE.md) — описание слоёв, стора, правил импортов и нейминга.
- [Мок-сервер и работа с API](server/README.md) — запуск, авторизация, регистрация и импорт документации в Postman.
- [Коллекция Postman](server/postman/skillswap.postman_collection.json) — справочник запросов, примеры ответов и проверки API.

