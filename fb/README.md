# Facebook Bot (fb)

Бот на webhook для Facebook Messenger.

## Запуск
```bash
cd fb
yarn
yarn dev
```

## Верификация webhook
Meta вызывает `GET /webhook` с `hub.verify_token`.
Токен должен совпадать с `FB_VERIFY_TOKEN`.

## Переменные окружения (минимум)
- `FB_VERIFY_TOKEN`
- `FB_PAGE_ACCESS_TOKEN`
- `FB_PAGE_ID`
- `STRAPI_AUTH_IDENTIFIER`
- `STRAPI_AUTH_PASSWORD`

## Начало опроса
Пользователь отправляет сообщение: `START <code>`
