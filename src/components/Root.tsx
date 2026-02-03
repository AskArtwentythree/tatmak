"use client";

import { type PropsWithChildren } from "react";
import { AppRoot } from "@telegram-apps/telegram-ui";
import { useDidMount } from "@/hooks/useDidMount";
import { useWebAppReady } from "@/hooks/useTelegramWebApp";

function RootInner({ children }: PropsWithChildren) {
  // Для тестовой мини‑аппки нам не критично знать реальные launch params.
  // Делаем максимально безопасную обёртку, которая не падает вне Telegram.
  useWebAppReady();

  return (
    <AppRoot appearance="light" platform="base">
      <div style={{ minHeight: "100vh" }}>{children}</div>
    </AppRoot>
  );
}

export function Root(props: PropsWithChildren) {
  const didMount = useDidMount();

  return didMount ? <RootInner {...props} /> : <div>Loading...</div>;
}
