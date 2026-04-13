# WhatsApp Bot (wa)

Бот на webhook для WhatsApp Cloud API.

## Что делает
- Принимает входящие сообщения из WA webhook.
- Ожидает старт-сообщение: `START <code>`.
- Проверяет `code`, связывает WhatsApp-контакт с `lead` (через `lead_contact`).
- Проводит опрос по `questions` из Strapi.
- Сохраняет ответы в `responses`.

## Запуск
```bash
cd wa
yarn
yarn dev
```

## Верификация webhook
Meta вызывает `GET /webhook` с `hub.verify_token`.
Секрет должен совпадать с `WEBHOOK_VERIFY_TOKEN` (или `WA_VERIFY_TOKEN`).

## Переменные окружения (минимум)
- `WEBHOOK_VERIFY_TOKEN` или `WA_VERIFY_TOKEN`
- `PHONE_NUMBER_ID` или `WA_PHONE_NUMBER_ID`
- `WHATSAPP_MARKER` или `WA_ACCESS_TOKEN`
- `STRAPI_AUTH_IDENTIFIER`
- `STRAPI_AUTH_PASSWORD`

## Важно
`LEAD_TELEGRAM_LINK_SECRET` в `wa/.env` должен совпадать с `front/.env.local`.
