"use client";

import { useEffect, useRef } from "react";
import { viewport, miniApp, hapticFeedback } from "@tma.js/sdk-react";

/**
 * Уведомляет Telegram, что Mini App готов к показу, и разворачивает на весь экран.
 */
export function useWebAppReady() {
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    try {
      miniApp.ready();
      viewport.expand();
      done.current = true;
    } catch {
      // вне Telegram или SDK не инициализирован
    }
  }, []);
}

/**
 * Возвращает объект с методами тактильной обратной связи (HapticFeedback).
 */
export function useHaptic() {
  return {
    selectionChanged: () => {
      try {
        hapticFeedback.selectionChanged();
      } catch {
        // ignore
      }
    },
    impactOccurred: (
      style: "light" | "medium" | "heavy" | "rigid" | "soft" = "light"
    ) => {
      try {
        hapticFeedback.impactOccurred(style);
      } catch {
        // ignore
      }
    },
    notificationOccurred: (
      type: "error" | "success" | "warning" = "success"
    ) => {
      try {
        hapticFeedback.notificationOccurred(type);
      } catch {
        // ignore
      }
    },
  };
}
