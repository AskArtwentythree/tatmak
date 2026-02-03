"use client";

import { useEffect, useState } from "react";
import { openTelegramLink, openLink } from "@tma.js/sdk-react";
import { useWebAppReady, useHaptic } from "@/hooks/useTelegramWebApp";

// URL вашей основной мини-аппки Quetlink
//
// ВАРИАНТ 1 (рекомендуемый): Direct Link Mini App
// Формат: https://t.me/BOT_USERNAME/APP_NAME?startapp=PARAMS
// Пример: https://t.me/your_bot/quetlink?startapp=test
//
// ВАРИАНТ 2: Прямой URL (для тестирования без бота)
// Формат: https://your-domain.com
// Пример: https://quetlink-mfkh.vercel.app
//
// ВАРИАНТ 3: Main Mini App (если настроен в BotFather)
// Формат: https://t.me/BOT_USERNAME?startapp=PARAMS
// Пример: https://t.me/your_bot?startapp=test
const QUETLINK_APP_URL = "https://t.me/QLinkLinkbot/QL?startapp=test";

export default function HomePage() {
  const haptic = useHaptic();
  const [initDataStr, setInitDataStr] = useState<string>("");
  const [launchInfo, setLaunchInfo] = useState<{
    platform?: string;
    version?: string;
  }>({});

  useWebAppReady();

  useEffect(() => {
    // Безопасное получение launch params из window (не падает вне Telegram)
    if (typeof window !== "undefined") {
      try {
        // Пытаемся получить из URL hash (Telegram передаёт параметры туда)
        const hash = window.location.hash.slice(1);
        const params = new URLSearchParams(hash);
        const platform = params.get("tgWebAppPlatform") || undefined;
        const version = params.get("tgWebAppVersion") || undefined;

        if (platform || version) {
          setLaunchInfo({ platform, version });
        }
      } catch {
        // Игнорируем ошибки
      }
    }

    // Получаем initData для отображения (только для демо, не использовать в продакшене!)
    if (typeof window !== "undefined" && window.Telegram?.WebApp?.initData) {
      setInitDataStr(window.Telegram.WebApp.initData);
    }
  }, []);

  const handleOpenQuetlink = () => {
    haptic.impactOccurred("medium");

    try {
      // Проверяем, является ли URL Telegram deep link (t.me)
      if (QUETLINK_APP_URL.startsWith("https://t.me/")) {
        // Открываем через Telegram deep link (передаст initData автоматически)
        openTelegramLink(QUETLINK_APP_URL);
      } else {
        // Если это прямой URL, используем openLink (откроет в браузере/WebView)
        // ВАЖНО: для white-label лучше использовать t.me ссылку для передачи initData!
        openLink(QUETLINK_APP_URL);
      }
    } catch (error) {
      console.error("Ошибка при открытии Quetlink:", error);
      // Fallback: открываем в браузере
      if (typeof window !== "undefined") {
        window.open(QUETLINK_APP_URL, "_blank");
      }
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Тестовая Mini App</h1>
      <p className="app-description">
        Это тестовая мини-аппка для проверки открытия Quetlink через web_app
        кнопку
      </p>

      <button className="open-button" onClick={handleOpenQuetlink}>
        Открыть Quetlink
      </button>

      <div className="info-section">
        <div className="info-title">Информация о запуске:</div>
        <div className="info-text">
          <div>Platform: {launchInfo.platform || "unknown"}</div>
          <div>Version: {launchInfo.version || "unknown"}</div>
          {initDataStr && (
            <div style={{ marginTop: "8px", wordBreak: "break-all" }}>
              initData: {initDataStr.substring(0, 100)}...
            </div>
          )}
        </div>
      </div>

      <div className="info-section">
        <div className="info-title">Как это работает:</div>
        <div className="info-text">
          При нажатии на кнопку вызывается <code>openTelegramLink()</code>,
          который открывает вашу основную мини-аппку Quetlink. Telegram передаст
          в Quetlink все необходимые параметры (initData, user, query_id),
          которые можно будет валидировать на бэкенде.
        </div>
      </div>
    </div>
  );
}
