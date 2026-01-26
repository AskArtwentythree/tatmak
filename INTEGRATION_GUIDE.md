# Руководство по интеграции White Label Mini App

## Проблема

Когда Telegram Mini App встраивается в iframe внутри другого Mini App, он не получает параметры запуска от Telegram, так как iframe работает вне прямого контекста Telegram клиента.

## Решение

Родительское приложение передает параметры Telegram Web App API в iframe через:
1. **URL параметры** - для базовых параметров
2. **postMessage API** - для полных данных и обновлений в реальном времени

## Модификация встроенного сервиса

Ваш сервис `quetlink-five.vercel.app` должен быть модифицирован для приема параметров от родительского окна.

### Вариант 1: Модификация существующего кода (рекомендуется)

Добавьте в начало вашего приложения (перед инициализацией tma-js-bridge):

```javascript
// Проверяем, запущены ли мы в iframe
const isInIframe = window.self !== window.top;

if (isInIframe) {
  // Слушаем сообщения от родительского окна
  window.addEventListener('message', (event) => {
    // Проверяем источник (опционально, для безопасности)
    // if (event.origin !== 'https://your-parent-app.vercel.app') return;

    if (event.data && event.data.type === 'TELEGRAM_WEB_APP_DATA') {
      const telegramData = event.data.data;
      
      // Сохраняем данные в localStorage для tma-js-bridge
      if (telegramData.initData) {
        localStorage.setItem('tgWebAppData', telegramData.initData);
      }
      
      // Создаем объект window.Telegram.WebApp если его нет
      if (!window.Telegram) {
        window.Telegram = {};
      }
      if (!window.Telegram.WebApp) {
        window.Telegram.WebApp = {
          initData: telegramData.initData || '',
          initDataUnsafe: telegramData.initDataUnsafe || {},
          version: telegramData.version || '6.0',
          platform: telegramData.platform || 'unknown',
          colorScheme: telegramData.colorScheme || 'light',
          themeParams: telegramData.themeParams || {},
          isExpanded: telegramData.isExpanded || true,
          viewportHeight: telegramData.viewportHeight || window.innerHeight,
          viewportStableHeight: telegramData.viewportStableHeight || window.innerHeight,
          headerColor: telegramData.headerColor || '#ffffff',
          backgroundColor: telegramData.backgroundColor || '#ffffff',
          isClosingConfirmationEnabled: telegramData.isClosingConfirmationEnabled || false,
          
          // Методы
          ready: () => {},
          expand: () => {},
          close: () => {},
          setHeaderColor: () => {},
          setBackgroundColor: () => {},
          
          // BackButton
          BackButton: {
            isVisible: telegramData.BackButton?.isVisible || false,
            show: () => {},
            hide: () => {},
            onClick: () => {}
          },
          
          // MainButton
          MainButton: {
            text: telegramData.MainButton?.text || 'Continue',
            color: telegramData.MainButton?.color || '#3390ec',
            textColor: telegramData.MainButton?.textColor || '#ffffff',
            isVisible: telegramData.MainButton?.isVisible || false,
            isActive: telegramData.MainButton?.isActive || true,
            isProgressVisible: telegramData.MainButton?.isProgressVisible || false,
            setText: () => {},
            show: () => {},
            hide: () => {},
            enable: () => {},
            disable: () => {},
            onClick: () => {}
          },
          
          // HapticFeedback
          HapticFeedback: {
            impactOccurred: () => {},
            notificationOccurred: () => {},
            selectionChanged: () => {}
          },
          
          // События
          onEvent: () => {},
          offEvent: () => {}
        };
      }
      
      // Обновляем данные при получении
      Object.assign(window.Telegram.WebApp, {
        initData: telegramData.initData || window.Telegram.WebApp.initData,
        initDataUnsafe: telegramData.initDataUnsafe || window.Telegram.WebApp.initDataUnsafe,
        version: telegramData.version || window.Telegram.WebApp.version,
        platform: telegramData.platform || window.Telegram.WebApp.platform,
        colorScheme: telegramData.colorScheme || window.Telegram.WebApp.colorScheme,
        themeParams: telegramData.themeParams || window.Telegram.WebApp.themeParams
      });
      
      // Уведомляем родительское окно, что мы готовы
      window.parent.postMessage({
        type: 'IFRAME_READY',
        ready: true
      }, '*');
    }
    
    // Обработка изменения темы
    if (event.data && event.data.type === 'TELEGRAM_THEME_CHANGED') {
      if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.colorScheme = event.data.colorScheme;
        window.Telegram.WebApp.themeParams = event.data.themeParams;
        
        // Вызываем обработчики изменения темы
        if (window.Telegram.WebApp._themeHandlers) {
          window.Telegram.WebApp._themeHandlers.forEach(handler => handler());
        }
      }
    }
  });
  
  // Также проверяем URL параметры
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('tgWebAppData')) {
    const initData = decodeURIComponent(urlParams.get('tgWebAppData'));
    localStorage.setItem('tgWebAppData', initData);
  }
  
  // Запрашиваем данные у родительского окна при загрузке
  window.addEventListener('load', () => {
    window.parent.postMessage({
      type: 'REQUEST_TELEGRAM_DATA'
    }, '*');
  });
}
```

### Вариант 2: Использование URL параметров

Если вы используете библиотеку `@tma-js/sdk` или `tma-js-bridge`, она может автоматически читать параметры из URL:

```javascript
// Библиотека автоматически прочитает tgWebAppData из URL
import { initDataRaw } from '@tma-js/sdk';

// Или для tma-js-bridge:
import { retrieveLaunchParams } from '@tma-js/sdk';

// При запуске в iframe, параметры будут переданы через URL
const launchParams = retrieveLaunchParams();
```

### Вариант 3: Прокси-страница

Создайте промежуточную страницу на вашем домене, которая будет:
1. Принимать параметры от родительского окна
2. Передавать их в ваше основное приложение
3. Инициализировать Telegram Web App API

## Пример полной интеграции

```javascript
// В вашем встроенном сервисе (quetlink-five.vercel.app)
(function() {
  'use strict';
  
  const isInIframe = window.self !== window.top;
  
  if (isInIframe) {
    // Инициализируем Telegram Web App API из сообщений родителя
    let telegramWebApp = null;
    
    // Создаем заглушку для Telegram.WebApp
    if (!window.Telegram) {
      window.Telegram = { WebApp: {} };
    }
    
    // Слушаем сообщения от родителя
    window.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'TELEGRAM_WEB_APP_DATA') {
        const data = event.data.data;
        
        // Инициализируем или обновляем Telegram.WebApp
        window.Telegram.WebApp = {
          ...window.Telegram.WebApp,
          initData: data.initData || '',
          initDataUnsafe: data.initDataUnsafe || {},
          version: data.version || '6.0',
          platform: data.platform || 'unknown',
          colorScheme: data.colorScheme || 'light',
          themeParams: data.themeParams || {},
          // ... остальные свойства
        };
        
        // Если используется tma-js-bridge, обновляем localStorage
        if (data.initData) {
          localStorage.setItem('tgWebAppData', data.initData);
        }
        
        // Уведомляем ваше приложение, что данные готовы
        window.dispatchEvent(new CustomEvent('telegramDataReady', { 
          detail: window.Telegram.WebApp 
        }));
      }
    });
    
    // Запрашиваем данные при загрузке
    window.addEventListener('load', () => {
      window.parent.postMessage({ type: 'REQUEST_TELEGRAM_DATA' }, '*');
    });
  }
})();
```

## Тестирование

1. Откройте родительское приложение в Telegram
2. Перейдите в раздел с встроенным сервисом
3. Проверьте консоль браузера на наличие ошибок
4. Убедитесь, что данные передаются через postMessage

## Безопасность

- Всегда проверяйте `event.origin` при получении сообщений через postMessage
- Валидируйте данные перед использованием
- Не передавайте чувствительные данные без шифрования

## Поддержка

Если у вас возникли проблемы с интеграцией, проверьте:
1. Консоль браузера на наличие ошибок
2. Что сообщения postMessage доходят до iframe
3. Что URL параметры правильно передаются
4. Что localStorage доступен в iframe
