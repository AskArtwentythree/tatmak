"use client";

import { useState } from "react";
import { QuetlinkProvider, GiftAssistant } from "telegram-gifts-sdk";
import "telegram-gifts-sdk/dist/index.css";

type Tab = "home" | "assistant";

export default function HomePage() {
  const [tab, setTab] = useState<Tab>("home");

  return (
    <div className="app-root">
      {/* Сайдбар */}
      <aside className="sidebar">
        <button
          className={
            tab === "home"
              ? "sidebar-item sidebar-item--active"
              : "sidebar-item"
          }
          type="button"
          onClick={() => setTab("home")}
        >
          Главная
        </button>
        <button
          className={
            tab === "assistant"
              ? "sidebar-item sidebar-item--active"
              : "sidebar-item"
          }
          type="button"
          onClick={() => setTab("assistant")}
        >
          ИИ‑помощник в подарках
        </button>
      </aside>

      {/* Контент */}
      <main className="content">
        {tab === "home" && (
          <div>
            <h1 className="app-title">Тестовая Mini App (хост)</h1>
            <p className="app-description">
              Здесь может быть основной функционал хостовой мини‑аппки.
            </p>
          </div>
        )}

        {tab === "assistant" && (
          <QuetlinkProvider>
            <GiftAssistant />
          </QuetlinkProvider>
        )}
      </main>
    </div>
  );
}
