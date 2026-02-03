# Быстрый старт

## 1. Установка зависимостей

```bash
cd quetlink-test-miniapp
pnpm install
```

## 2. Настройка URL Quetlink

Откройте `src/app/page.tsx` и обновите:

```typescript
// Для тестирования с прямым URL (быстро, но без initData)
const QUETLINK_APP_URL = "https://quetlink-mfkh.vercel.app";

// ИЛИ для production с Telegram deep link (рекомендуется)
const QUETLINK_APP_URL = "https://t.me/YOUR_BOT/quetlink?startapp=test";
```

## 3. Запуск локально

```bash
pnpm dev
```

Откройте http://localhost:3000

## 4. Тестирование в Telegram

### Вариант A: Через ngrok (для локального тестирования)

1. Установите ngrok: https://ngrok.com/
2. Запустите:
   ```bash
   ngrok http 3000
   ```
3. Скопируйте HTTPS URL (например: `https://abc123.ngrok.io`)
4. Создайте тестового бота в @BotFather (test server)
5. Настройте Mini App:
   ```
   /newapp
   Выберите бота
   App name: test-host
   Short name: test-host
   Web App URL: https://abc123.ngrok.io
   ```
6. Откройте бота и запустите мини-аппку

### Вариант B: Деплой на Vercel

1. Установите Vercel CLI:

   ```bash
   npm i -g vercel
   ```

2. Задеплойте:

   ```bash
   vercel
   ```

3. Используйте полученный URL в BotFather

## 5. Проверка работы

1. Откройте тестовую мини-аппку через бота
2. Нажмите "Открыть Quetlink"
3. Проверьте в консоли браузера (F12):
   - `window.Telegram.WebApp.initData` должен содержать данные
   - В Quetlink должны быть доступны все параметры Telegram

## Что проверить в Quetlink

После открытия Quetlink из тестовой аппки проверьте:

```javascript
// В консоли браузера в Quetlink:
console.log(window.Telegram?.WebApp?.initData);
console.log(window.Telegram?.WebApp?.initDataUnsafe);
```

Должны быть доступны:

- `user` - данные пользователя
- `query_id` - ID сессии
- `auth_date` - время авторизации
- `hash` - подпись для валидации

## Troubleshooting

### initData пустой или undefined

**Причина:** Используется прямой URL вместо Telegram deep link.

**Решение:** Используйте формат `https://t.me/BOT/APP?startapp=...`

### Ошибка при открытии

**Причина:** URL недоступен или неправильный формат.

**Решение:**

- Проверьте доступность URL
- Убедитесь, что используете правильный формат для Telegram deep link

### Не работает в Telegram Desktop

**Причина:** Некоторые функции могут работать по-разному на разных платформах.

**Решение:** Тестируйте на мобильном приложении Telegram (iOS/Android)
