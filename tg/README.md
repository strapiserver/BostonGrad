# Telegram Bot (tg)

## Что делает
- Принимает `/start <code>`.
- Проверяет подпись start-кода и находит lead по `leadId`.
- Создаёт `lead_contact` для Telegram и привязывает его к `lead`.
- Загружает `questions` из Strapi и проводит опрос.
- Сохраняет ответы как `responses` в Strapi.

## Запуск
```bash
cd tg
npm install
npm start
```

## env
См. `tg/.env`.
Обязательно:
- `BOT_TOKEN`
- `STRAPI_AUTH_IDENTIFIER`
- `STRAPI_AUTH_PASSWORD`

Важно: `LEAD_TELEGRAM_LINK_SECRET` должен совпадать с `front` (используется для start-кода).
