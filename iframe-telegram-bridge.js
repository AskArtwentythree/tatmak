/**
 * Telegram Web App Bridge for iframe integration
 * 
 * Этот файл нужно добавить в ваш встроенный сервис (quetlink-five.vercel.app)
 * Подключите его перед инициализацией вашего приложения:
 * <script src="/iframe-telegram-bridge.js"></script>
 */

(function() {
  'use strict';
  
  // Проверяем, запущены ли мы в iframe
  const isInIframe = window.self !== window.top;
  
  if (!isInIframe) {
    // Если не в iframe, используем стандартный Telegram Web App API
    return;
  }
  
  console.log('[Telegram Bridge] Running in iframe, initializing bridge...');
  
  // Создаем объект Telegram.WebApp если его нет
  if (!window.Telegram) {
    window.Telegram = {};
  }
  
  // Базовая структура Telegram.WebApp
  const createTelegramWebApp = (data) => {
    return {
      initData: data?.initData || '',
      initDataUnsafe: data?.initDataUnsafe || {},
      version: data?.version || '6.0',
      platform: data?.platform || 'unknown',
      colorScheme: data?.colorScheme || 'light',
      themeParams: data?.themeParams || {},
      isExpanded: data?.isExpanded !== undefined ? data.isExpanded : true,
      viewportHeight: data?.viewportHeight || window.innerHeight,
      viewportStableHeight: data?.viewportStableHeight || window.innerHeight,
      headerColor: data?.headerColor || '#ffffff',
      backgroundColor: data?.backgroundColor || '#ffffff',
      isClosingConfirmationEnabled: data?.isClosingConfirmationEnabled || false,
      
      // Методы
      ready: function() {
        console.log('[Telegram Bridge] ready() called');
        // Уведомляем родительское окно
        window.parent.postMessage({ type: 'TELEGRAM_READY' }, '*');
      },
      
      expand: function() {
        console.log('[Telegram Bridge] expand() called');
        window.parent.postMessage({ type: 'TELEGRAM_EXPAND' }, '*');
      },
      
      close: function() {
        console.log('[Telegram Bridge] close() called');
        window.parent.postMessage({ type: 'TELEGRAM_CLOSE' }, '*');
      },
      
      setHeaderColor: function(color) {
        console.log('[Telegram Bridge] setHeaderColor() called:', color);
        window.parent.postMessage({ type: 'TELEGRAM_SET_HEADER_COLOR', color }, '*');
      },
      
      setBackgroundColor: function(color) {
        console.log('[Telegram Bridge] setBackgroundColor() called:', color);
        window.parent.postMessage({ type: 'TELEGRAM_SET_BACKGROUND_COLOR', color }, '*');
      },
      
      // BackButton
      BackButton: {
        isVisible: data?.BackButton?.isVisible || false,
        show: function() {
          window.parent.postMessage({ type: 'TELEGRAM_BACK_BUTTON_SHOW' }, '*');
        },
        hide: function() {
          window.parent.postMessage({ type: 'TELEGRAM_BACK_BUTTON_HIDE' }, '*');
        },
        onClick: function(callback) {
          window.addEventListener('message', function handler(event) {
            if (event.data && event.data.type === 'TELEGRAM_BACK_BUTTON_CLICKED') {
              callback();
              window.removeEventListener('message', handler);
            }
          });
        }
      },
      
      // MainButton
      MainButton: {
        text: data?.MainButton?.text || 'Continue',
        color: data?.MainButton?.color || '#3390ec',
        textColor: data?.MainButton?.textColor || '#ffffff',
        isVisible: data?.MainButton?.isVisible || false,
        isActive: data?.MainButton?.isActive !== undefined ? data.MainButton.isActive : true,
        isProgressVisible: data?.MainButton?.isProgressVisible || false,
        
        setText: function(text) {
          this.text = text;
          window.parent.postMessage({ type: 'TELEGRAM_MAIN_BUTTON_SET_TEXT', text }, '*');
        },
        
        show: function() {
          this.isVisible = true;
          window.parent.postMessage({ type: 'TELEGRAM_MAIN_BUTTON_SHOW' }, '*');
        },
        
        hide: function() {
          this.isVisible = false;
          window.parent.postMessage({ type: 'TELEGRAM_MAIN_BUTTON_HIDE' }, '*');
        },
        
        enable: function() {
          this.isActive = true;
          window.parent.postMessage({ type: 'TELEGRAM_MAIN_BUTTON_ENABLE' }, '*');
        },
        
        disable: function() {
          this.isActive = false;
          window.parent.postMessage({ type: 'TELEGRAM_MAIN_BUTTON_DISABLE' }, '*');
        },
        
        onClick: function(callback) {
          window.addEventListener('message', function handler(event) {
            if (event.data && event.data.type === 'TELEGRAM_MAIN_BUTTON_CLICKED') {
              callback();
            }
          });
        }
      },
      
      // HapticFeedback
      HapticFeedback: {
        impactOccurred: function(style) {
          window.parent.postMessage({ type: 'TELEGRAM_HAPTIC_IMPACT', style }, '*');
        },
        notificationOccurred: function(type) {
          window.parent.postMessage({ type: 'TELEGRAM_HAPTIC_NOTIFICATION', type }, '*');
        },
        selectionChanged: function() {
          window.parent.postMessage({ type: 'TELEGRAM_HAPTIC_SELECTION' }, '*');
        }
      },
      
      // События
      _eventHandlers: {},
      onEvent: function(eventType, handler) {
        if (!this._eventHandlers[eventType]) {
          this._eventHandlers[eventType] = [];
        }
        this._eventHandlers[eventType].push(handler);
      },
      
      offEvent: function(eventType, handler) {
        if (this._eventHandlers[eventType]) {
          this._eventHandlers[eventType] = this._eventHandlers[eventType].filter(h => h !== handler);
        }
      },
      
      _triggerEvent: function(eventType, data) {
        if (this._eventHandlers[eventType]) {
          this._eventHandlers[eventType].forEach(handler => handler(data));
        }
      }
    };
  };
  
  // Инициализируем с пустыми данными
  window.Telegram.WebApp = createTelegramWebApp();
  
  // Слушаем сообщения от родительского окна
  window.addEventListener('message', (event) => {
    // Для безопасности проверяйте origin в продакшене:
    // if (event.origin !== 'https://your-parent-app.vercel.app') return;
    
    if (event.data && event.data.type === 'TELEGRAM_WEB_APP_DATA') {
      const telegramData = event.data.data;
      
      console.log('[Telegram Bridge] Received Telegram data:', telegramData);
      
      // Обновляем Telegram.WebApp с новыми данными
      window.Telegram.WebApp = createTelegramWebApp(telegramData);
      
      // Сохраняем initData в localStorage для совместимости с tma-js-bridge
      if (telegramData.initData) {
        try {
          localStorage.setItem('tgWebAppData', telegramData.initData);
        } catch (e) {
          console.warn('[Telegram Bridge] Could not save to localStorage:', e);
        }
      }
      
      // Уведомляем родительское окно, что мы готовы
      window.parent.postMessage({
        type: 'IFRAME_READY',
        ready: true
      }, '*');
      
      // Вызываем событие для вашего приложения
      window.dispatchEvent(new CustomEvent('telegramDataReady', {
        detail: window.Telegram.WebApp
      }));
    }
    
    // Обработка изменения темы
    if (event.data && event.data.type === 'TELEGRAM_THEME_CHANGED') {
      if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.colorScheme = event.data.colorScheme;
        window.Telegram.WebApp.themeParams = event.data.themeParams;
        window.Telegram.WebApp._triggerEvent('themeChanged');
      }
    }
  });
  
  // Также проверяем URL параметры (для совместимости)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('tgWebAppData')) {
    const initData = decodeURIComponent(urlParams.get('tgWebAppData'));
    try {
      localStorage.setItem('tgWebAppData', initData);
    } catch (e) {
      console.warn('[Telegram Bridge] Could not save URL param to localStorage:', e);
    }
    
    // Парсим initData если возможно
    try {
      const params = new URLSearchParams(initData);
      const userParam = params.get('user');
      if (userParam) {
        window.Telegram.WebApp.initDataUnsafe.user = JSON.parse(userParam);
      }
    } catch (e) {
      console.warn('[Telegram Bridge] Could not parse initData:', e);
    }
  }
  
  // Запрашиваем данные у родительского окна при загрузке
  window.addEventListener('load', () => {
    console.log('[Telegram Bridge] Requesting Telegram data from parent...');
    window.parent.postMessage({
      type: 'REQUEST_TELEGRAM_DATA'
    }, '*');
    
    // Повторяем запрос через небольшую задержку на случай, если родитель еще не готов
    setTimeout(() => {
      window.parent.postMessage({
        type: 'REQUEST_TELEGRAM_DATA'
      }, '*');
    }, 100);
  });
  
  console.log('[Telegram Bridge] Initialized, waiting for data from parent...');
})();
