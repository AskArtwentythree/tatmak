import type { PropsWithChildren } from "react";
import type { Metadata } from "next";
import Script from "next/script";

import { Root } from "@/components/Root";

import "@telegram-apps/telegram-ui/dist/styles.css";
import "normalize.css/normalize.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Test Mini App - Quetlink Host",
  description: "Тестовая мини-аппка для проверки открытия Quetlink",
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
