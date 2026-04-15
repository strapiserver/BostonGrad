# Instagram Bot (ig)

Бот на webhook для Instagram Messaging API.

## Запуск
```bash
cd ig
yarn
yarn dev
```

## Верификация webhook
Meta вызывает `GET /webhook` с `hub.verify_token`.
Токен должен совпадать с `IG_VERIFY_TOKEN`.

## Переменные окружения (минимум)
- `IG_VERIFY_TOKEN`
- `IG_ACCESS_TOKEN`
- `IG_ACCOUNT_ID`
- `STRAPI_AUTH_IDENTIFIER`
- `STRAPI_AUTH_PASSWORD`

## Начало опроса
Пользователь отправляет сообщение: `START <code>`
