# KAED Mini App frontend

Фронтенд для Telegram Mini App KAED. Бэкенд остаётся отдельным сервисом: этот проект только показывает интерфейс, пишет голос через MediaRecorder и обращается к REST-эндпоинтам сервера.

## Запуск

```bash
npm install
npm run dev
```

Открыть: http://localhost:3000

## Сборка

```bash
npm run build
npm start
```

## Подключение бэкенда

В dev-режиме можно проксировать запросы на готовый сервер:

```bash
API_PROXY_TARGET=http://localhost:8000 npm run dev
```

Или задать базовый адрес API при сборке:

```bash
KAED_API_URL=https://your-backend.example.com npm run build
```

## Что закрывает требования

- SPA на React + Webpack.
- 4 экрана: главная, задачи, голосовой отчёт, Jira.
- Hash-routing через `#home`, `#tasks`, `#voice`, `#jira`.
- REST-запросы к `/auth/telegram`, `/tasks`, `/voice/task`, `/jira/sync`.
- Форма создания задачи на странице «Задачи».
- Состояние приложения через Zustand.
- CSS-in-JS через Emotion styled.
- Семантические `header`, `main`, `section`, `nav`, формы и aria-label для доступности.
