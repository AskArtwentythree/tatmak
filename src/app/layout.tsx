import type { PropsWithChildren } from "react";
import type { Metadata } from "next";
import Script from "next/script";

import { Root } from "@/components/Root";

import "normalize.css/normalize.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Тестовая Mini App - Quetlink SDK",
  description: "Тестовая мини-аппка для проверки интеграции Quetlink SDK",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js?59"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <Root>{children}</Root>
      </body>
    </html>
  );
}
