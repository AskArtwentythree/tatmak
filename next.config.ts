import type { NextConfig } from "next";
import path from "path";
import { copyFileSync, mkdirSync, existsSync, readdirSync, statSync } from "fs";

// Копируем статические файлы из quetlink/public в public перед запуском
const quetlinkPublicPath = path.resolve(__dirname, "../quetlink/public");
const testPublicPath = path.resolve(__dirname, "public");

function copyDir(src: string, dest: string) {
  if (!existsSync(dest)) {
    mkdirSync(dest, { recursive: true });
  }
  const entries = readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

if (existsSync(quetlinkPublicPath)) {
  try {
    copyDir(quetlinkPublicPath, testPublicPath);
  } catch (error) {
    console.warn("Не удалось скопировать статические файлы:", error);
  }
}

const nextConfig: NextConfig = {
  output: "standalone",
  // Пустая turbopack-конфигурация, чтобы Turbopack не ругался на кастомный webpack-конфиг
  turbopack: {},
};

export default nextConfig;
