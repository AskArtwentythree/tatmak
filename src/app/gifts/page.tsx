"use client";

import { QuetlinkProvider, GiftAssistant } from "telegram-gifts-sdk";
import "telegram-gifts-sdk/dist/index.css";

/**
 * Экран-хост для теста white-label SDK Quetlink внутри сторонней мини-аппки.
 *
 * Теперь использует опубликованный npm-пакет telegram-gifts-sdk.
 * Это именно тот же пакет, который будут использовать сторонние разработчики.
 */
export default function GiftsPage() {
  return (
    <QuetlinkProvider>
      <GiftAssistant />
    </QuetlinkProvider>
  );
}
