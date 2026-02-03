# Quetlink Test Mini App

Тестовая Telegram Mini App для проверки открытия основной мини-аппки Quetlink через web_app кнопку.

## Назначение

Эта мини-аппка имитирует стороннюю мини-аппку (host), которая открывает Quetlink через Telegram Web App API. Это позволяет протестировать white-label интеграцию без необходимости настройки реального бота.

## Установка

```bash
pnpm install
```

## Запуск

```bash
pnpm dev
```

Приложение будет доступно на `http://localhost:3000`

## Настройка

### 1. Обновить URL основной мини-аппки

Откройте `src/app/page.tsx` и обновите `QUETLINK_APP_URL`:

**Вариант A (рекомендуется): Direct Link Mini App**

```typescript
const QUETLINK_APP_URL =
  "https://t.me/YOUR_BOT_USERNAME/YOUR_APP_NAME?startapp=test";
```

**Вариант B: Прямой URL (для быстрого тестирования)**

```typescript
const QUETLINK_APP_URL = "https://quetlink-mfkh.vercel.app";
```

### 2. Настройка тестового бота

**Для тестирования в Telegram:**

1. **Создайте тестового бота:**

   - Откройте Telegram Test Server (iOS: 10 раз нажать на Settings > Test Server)
   - Создайте бота через @BotFather (test server)
   - Получите токен бота

2. **Настройте Mini App:**

   ```
   /newapp
   Выберите бота
   App name: test-host
   Short name: test-host
   Web App URL: https://your-deployment-url.com
   ```

3. **Для локального тестирования используйте ngrok:**

   ```bash
   ngrok http 3000
   # Используйте полученный HTTPS URL в BotFather
   ```

4. **Откройте мини-аппку:**
   - Откройте бота в Telegram
   - Нажмите на кнопку меню или отправьте команду `/start`
   - Откроется ваша тестовая мини-аппка

## Как это работает

### Поток данных:

1. **Пользователь открывает тестовую мини-аппку (Host)**

   - Telegram передаёт в Host: `initData`, `user`, `query_id`

2. **Пользователь нажимает "Открыть Quetlink"**

   - Вызывается `openTelegramLink()` или `openLink()`
   - Telegram открывает Quetlink в том же WebView

3. **Telegram передаёт в Quetlink:**

   - `initData` - подписанные данные пользователя (HMAC-SHA256)
   - `query_id` - уникальный идентификатор сессии (для отправки сообщений обратно)
   - `user` - данные пользователя Telegram (id, username, first_name, etc.)
   - `start_param` - параметр из URL (если используется `?startapp=...`)

4. **В Quetlink:**
   - Получаете `window.Telegram.WebApp.initData`
   - Отправляете на бэкенд для валидации подписи
   - Извлекаете `user.id` и создаёте сессию
   - Привязываете историю/избранное к `telegram_user_id`

## Валидация initData на бэкенде

⚠️ **ВАЖНО:** Валидация должна происходить **только на бэкенде**, никогда не доверяйте `initData` на клиенте!

### В Quetlink:

1. **На фронте:** Получите `initData` и отправьте на бэкенд
2. **На бэкенде:** Валидируйте подпись и извлеките данные пользователя
3. **Создайте сессию:** Привяжите к `telegram_user_id`

Подробные примеры валидации см. в [WHITE_LABEL_GUIDE.md](./WHITE_LABEL_GUIDE.md)

## Структура проекта

```
quetlink-test-miniapp/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout с Telegram SDK
│   │   ├── page.tsx         # Главная страница с кнопкой
│   │   └── globals.css      # Стили
│   ├── components/
│   │   └── Root.tsx         # Обёртка с AppRoot
│   └── hooks/
│       ├── useDidMount.ts
│       └── useTelegramWebApp.ts
├── package.json
├── tsconfig.json
└── next.config.ts
```

## Деплой

Для тестирования можно использовать:

- **Vercel**: `vercel`
- **Netlify**: `netlify deploy`
- **ngrok**: для локального тестирования `ngrok http 3000`

После деплоя обновите URL Mini App в @BotFather.
