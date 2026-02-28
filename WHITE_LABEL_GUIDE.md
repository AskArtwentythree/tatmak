# White-Label интеграция Quetlink

## Как это работает asd

### Вариант A: Рекомендуемый — через Telegram Web App кнопку

**Как это работает:**

1. **Host (сторонняя мини-аппка)** добавляет в свой UI кнопку, которая вызывает `web_app` (InlineKeyboardButton / menu button) с URL на вашу мини-аппку Quetlink.

2. При открытии Telegram вставит в WebView подписанные параметры:
   - `tgWebAppData` / `initData` — подписанные данные пользователя
   - `query_id` — уникальный идентификатор сессии
   - `user` — данные пользователя Telegram

3. **На фронте Quetlink:**
   - Получаете `window.Telegram.WebApp.initData` (и/или `initDataUnsafe`)
   - **НЕ доверяете** `initData` на клиенте
   - Отправляете её на ваш бэкенд

4. **На бэкенде Quetlink:**
   - Валидируете подпись (HMAC-SHA256)
   - Получаете `user.id`, `auth_date` и т.д.
   - Создаёте/настраиваете сессию (JWT) и возвращаете безопасный сессионный токен фронту

5. Всё взаимодействие (история, избранное) храните на своём бэкенде, привязанное к `telegram_user_id`.

---

## Настройка для Host (сторонней мини-аппки)

### Способ 1: Inline Keyboard Button (рекомендуется)

В коде бота Host добавьте inline keyboard с кнопкой типа `web_app`:

```python
from telegram import InlineKeyboardButton, InlineKeyboardMarkup

# Создаём кнопку, которая откроет Quetlink
keyboard = [
    [InlineKeyboardButton(
        "🎁 Подобрать подарок",
        web_app=WebAppInfo(url="https://quetlink-mfkh.vercel.app")
    )]
]
reply_markup = InlineKeyboardMarkup(keyboard)

# Отправляем сообщение с кнопкой
bot.send_message(
    chat_id=chat_id,
    text="Выберите действие:",
    reply_markup=reply_markup
)
```

### Способ 2: Menu Button

В @BotFather настройте Menu Button:

```
/setmenubutton
Выберите бота
Button text: 🎁 Подобрать подарок
Web App URL: https://quetlink-mfkh.vercel.app
```

### Способ 3: Из мини-аппки Host (как в тестовой аппке)

В коде мини-аппки Host используйте `openTelegramLink()`:

```typescript
import { openTelegramLink } from "@tma.js/sdk-react";

// Direct Link Mini App (рекомендуется)
const quetlinkUrl = "https://t.me/YOUR_BOT/quetlink?startapp=host_id_123";
openTelegramLink(quetlinkUrl);

// Или прямой URL (менее предпочтительно, не передаёт initData автоматически)
const quetlinkUrl = "https://quetlink-mfkh.vercel.app";
openLink(quetlinkUrl);
```

---

## Настройка Quetlink для приёма initData

### На фронте (Quetlink)

В `src/app/layout.tsx` или при инициализации:

```typescript
"use client";

import { useEffect } from "react";

export default function QuetlinkLayout() {
  useEffect(() => {
    // Получаем initData для отправки на бэкенд
    if (typeof window !== "undefined" && window.Telegram?.WebApp?.initData) {
      const initData = window.Telegram.WebApp.initData;

      // Отправляем на бэкенд для валидации
      fetch("/api/auth/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initData }),
      })
        .then((res) => res.json())
        .then((data) => {
          // Сохраняем сессионный токен
          localStorage.setItem("session_token", data.token);
        });
    }
  }, []);

  // ... остальной код
}
```

### На бэкенде (Quetlink)

Пример валидации `initData` на Python:

```python
import hmac
import hashlib
import json
from urllib.parse import parse_qs

def validate_init_data(init_data: str, bot_token: str) -> dict:
    """
    Валидирует initData от Telegram Mini App.

    Returns:
        dict с данными пользователя: {'user_id': int, 'auth_date': int, ...}
    """
    # Парсим query string
    params = {}
    for item in init_data.split('&'):
        if '=' in item:
            key, value = item.split('=', 1)
            params[key] = value

    # Получаем hash
    received_hash = params.pop('hash', '')

    if not received_hash:
        raise ValueError("Missing hash in initData")

    # Создаём data-check-string
    # Все поля кроме hash, отсортированные по алфавиту
    data_check_string = '\n'.join(
        f"{k}={v}"
        for k, v in sorted(params.items())
    )

    # Вычисляем secret_key
    # secret_key = HMAC_SHA256(bot_token, "WebAppData")
    secret_key = hmac.new(
        "WebAppData".encode(),
        bot_token.encode(),
        hashlib.sha256
    ).digest()

    # Проверяем подпись
    # calculated_hash = hex(HMAC_SHA256(data_check_string, secret_key))
    calculated_hash = hmac.new(
        secret_key,
        data_check_string.encode(),
        hashlib.sha256
    ).hexdigest()

    if calculated_hash != received_hash:
        raise ValueError("Invalid signature")

    # Проверяем auth_date (не старше 24 часов)
    auth_date = int(params.get('auth_date', 0))
    import time
    if time.time() - auth_date > 86400:  # 24 часа
        raise ValueError("InitData expired")

    # Парсим user
    user = json.loads(params.get('user', '{}'))

    return {
        'user_id': user.get('id'),
        'username': user.get('username'),
        'first_name': user.get('first_name'),
        'last_name': user.get('last_name'),
        'language_code': user.get('language_code'),
        'auth_date': auth_date,
        'query_id': params.get('query_id'),  # для отправки сообщений обратно
    }
```

Пример на Node.js:

```javascript
const crypto = require("crypto");

function validateInitData(initData, botToken) {
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  params.delete("hash");

  // Создаём data-check-string
  const dataCheckString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("\n");

  // Вычисляем secret_key
  const secretKey = crypto
    .createHmac("sha256", "WebAppData")
    .update(botToken)
    .digest();

  // Проверяем подпись
  const calculatedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  if (calculatedHash !== hash) {
    throw new Error("Invalid signature");
  }

  // Проверяем auth_date
  const authDate = parseInt(params.get("auth_date"), 10);
  if (Date.now() / 1000 - authDate > 86400) {
    throw new Error("InitData expired");
  }

  // Парсим user
  const user = JSON.parse(params.get("user"));

  return {
    userId: user.id,
    username: user.username,
    firstName: user.first_name,
    lastName: user.last_name,
    languageCode: user.language_code,
    authDate,
    queryId: params.get("query_id"),
  };
}
```

---

## Форматы URL для Quetlink

### 1. Direct Link Mini App (рекомендуется)

```
https://t.me/BOT_USERNAME/APP_NAME?startapp=PARAMS
```

**Пример:**

```
https://t.me/quetlink_bot/quetlink?startapp=host_id_123
```

**Преимущества:**

- ✅ Автоматически передаёт `initData`
- ✅ Работает в том же WebView
- ✅ Поддерживает параметры через `startapp`

**Настройка в BotFather:**

```
/newapp
Выберите бота
App name: quetlink
Short name: quetlink
Web App URL: https://quetlink-mfkh.vercel.app
```

### 2. Main Mini App

```
https://t.me/BOT_USERNAME?startapp=PARAMS
```

**Пример:**

```
https://t.me/quetlink_bot?startapp=host_id_123
```

**Настройка в BotFather:**

```
/mybots
Выберите бота
Bot Settings > Main Mini App
Upload demo video/screenshots
Set URL: https://quetlink-mfkh.vercel.app
```

### 3. Прямой URL (менее предпочтительно)

```
https://quetlink-mfkh.vercel.app?host_id=123
```

**Недостатки:**

- ❌ Не передаёт `initData` автоматически
- ❌ Нужно передавать параметры вручную
- ❌ Менее безопасно

---

## Тестирование

1. **Запустите тестовую мини-аппку:**

   ```bash
   cd quetlink-test-miniapp
   pnpm install
   pnpm dev
   ```

2. **Настройте тестового бота:**
   - Создайте бота через @BotFather (test server)
   - Настройте Mini App URL (используйте ngrok/tunnel для локального тестирования)

3. **Откройте тестовую мини-аппку через бота**

4. **Нажмите "Открыть Quetlink"**

5. **Проверьте в Quetlink:**
   - `window.Telegram.WebApp.initData` должен содержать данные
   - Отправьте `initData` на бэкенд для валидации

---

## Безопасность

⚠️ **ВАЖНО:**

1. **НИКОГДА не доверяйте `initData` на клиенте** — всегда валидируйте на бэкенде
2. **Проверяйте `auth_date`** — данные не должны быть старше 24 часов
3. **Используйте HTTPS** для всех запросов
4. **Храните `bot_token` в секретах** — никогда не коммитьте в репозиторий

---

## Дополнительные ресурсы

- [Telegram Mini Apps Documentation](https://core.telegram.org/bots/webapps)
- [Validating data received via the Mini App](https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app)
- [@tma.js/sdk Documentation](https://docs.telegram-mini-apps.com/platform/methods)
