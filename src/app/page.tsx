"use client";

import { useState } from "react";
import { QuetlinkGiftsApp } from "telegram-gifts-sdk";
import "telegram-gifts-sdk/dist/index.css";

type Tab = "home" | "gifts";

function IconHome({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1V10.5z"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconGift({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect
        x="3" y="8" width="18" height="4" rx="1"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor" strokeWidth="1.8"
      />
      <path d="M12 8v13" stroke={active ? "#fff" : "currentColor"} strokeWidth="1.8" />
      <rect
        x="5" y="12" width="14" height="9" rx="1"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor" strokeWidth="1.8"
      />
      <path
        d="M12 8s0-2-2-3.5C8.5 3.4 7 4 7 5.5 7 7 8.5 8 12 8z"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M12 8s0-2 2-3.5c1.5-1.1 3-.5 3 1C17 7 15.5 8 12 8z"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

const MENU_ITEMS = [
  { name: "Капучино", size: "350 мл", price: "289" },
  { name: "Флэт Уайт", size: "300 мл", price: "319" },
  { name: "Матча Латте", size: "400 мл", price: "349" },
  { name: "Раф Лавандовый", size: "350 мл", price: "369" },
];

export default function HomePage() {
  const [tab, setTab] = useState<Tab>("home");

  return (
    <div className="app-shell">
      <div className={`app-content${tab === "gifts" ? " app-content--sdk" : ""}`}>
        {tab === "home" && (
          <div className="home-screen">
            <header className="home-header">
              <div className="home-header__left">
                <div className="home-header__avatar">M</div>
                <div>
                  <p className="home-header__greeting">Добрый день</p>
                  <p className="home-header__name">Максим</p>
                </div>
              </div>
              <button type="button" className="home-header__bell" aria-label="Уведомления">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="home-header__bell-dot" />
              </button>
            </header>

            <div className="loyalty-card">
              <div className="loyalty-card__top">
                <span className="loyalty-card__label">Баланс бонусов</span>
                <span className="loyalty-card__tier">Gold</span>
              </div>
              <p className="loyalty-card__balance">1 240</p>
              <div className="loyalty-card__progress-wrap">
                <div className="loyalty-card__progress">
                  <div className="loyalty-card__progress-bar" style={{ width: "68%" }} />
                </div>
                <span className="loyalty-card__progress-text">760 до Platinum</span>
              </div>
            </div>

            <div className="actions-row">
              <button type="button" className="action-btn">
                <span className="action-btn__icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="5" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.8"/>
                    <path d="M2 10h20" stroke="currentColor" strokeWidth="1.8"/>
                  </svg>
                </span>
                <span className="action-btn__label">Оплатить</span>
              </button>
              <button type="button" className="action-btn">
                <span className="action-btn__icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/>
                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </span>
                <span className="action-btn__label">История</span>
              </button>
              <button type="button" className="action-btn">
                <span className="action-btn__icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span className="action-btn__label">Акции</span>
              </button>
              <button type="button" className="action-btn" onClick={() => setTab("gifts")}>
                <span className="action-btn__icon action-btn__icon--accent">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="8" width="18" height="4" rx="1" stroke="currentColor" strokeWidth="1.8"/>
                    <rect x="5" y="12" width="14" height="9" rx="1" stroke="currentColor" strokeWidth="1.8"/>
                    <path d="M12 8V21M12 8s0-2-2-3.5C8.5 3.4 7 4 7 5.5 7 7 8.5 8 12 8zM12 8s0-2 2-3.5c1.5-1.1 3-.5 3 1C17 7 15.5 8 12 8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span className="action-btn__label">Подарки</span>
              </button>
            </div>

            <section className="home-section">
              <div className="home-section__head">
                <h2 className="home-section__title">Популярное</h2>
                <button type="button" className="home-section__link">Все</button>
              </div>
              <div className="menu-list">
                {MENU_ITEMS.map((item) => (
                  <div key={item.name} className="menu-item">
                    <div className="menu-item__thumb" />
                    <div className="menu-item__info">
                      <p className="menu-item__name">{item.name}</p>
                      <p className="menu-item__size">{item.size}</p>
                    </div>
                    <span className="menu-item__price">{item.price} P</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="home-section">
              <div className="home-section__head">
                <h2 className="home-section__title">Новости</h2>
              </div>
              <div className="news-card">
                <div className="news-card__badge">Новинка</div>
                <p className="news-card__title">Сезонное меню уже здесь</p>
                <p className="news-card__text">
                  Попробуйте наши новые авторские напитки с сезонными ягодами
                  и домашним сиропом.
                </p>
              </div>
              <div className="news-card news-card--dark">
                <div className="news-card__badge news-card__badge--light">x2 бонусов</div>
                <p className="news-card__title">Двойные бонусы по выходным</p>
                <p className="news-card__text">
                  Каждую субботу и воскресенье начисляем двойные бонусы
                  за любой заказ от 500 P.
                </p>
              </div>
            </section>
          </div>
        )}

        {tab === "gifts" && <QuetlinkGiftsApp botUsername="QLinkLinkBot" />}
      </div>

      <nav className="bottom-nav">
        <div
          className="bottom-nav__indicator"
          style={{ transform: `translateX(${tab === "home" ? "0%" : "100%"})` }}
        />
        <button
          type="button"
          className={`bottom-nav__item ${tab === "home" ? "bottom-nav__item--active" : ""}`}
          onClick={() => setTab("home")}
        >
          <IconHome active={tab === "home"} />
          <span className="bottom-nav__label">Главная</span>
        </button>
        <button
          type="button"
          className={`bottom-nav__item ${tab === "gifts" ? "bottom-nav__item--active" : ""}`}
          onClick={() => setTab("gifts")}
        >
          <IconGift active={tab === "gifts"} />
          <span className="bottom-nav__label">Подарки</span>
        </button>
      </nav>
    </div>
  );
}
