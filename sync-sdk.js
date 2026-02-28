const fs = require("fs");
const path = require("path");

const SDK_SRC = path.resolve(__dirname, "../quetlink/packages/telegram-gifts");
const SDK_DEST = path.resolve(__dirname, "node_modules/telegram-gifts-sdk");

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.name === "node_modules") continue;
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

if (fs.existsSync(SDK_DEST)) {
  fs.rmSync(SDK_DEST, { recursive: true, force: true });
}

copyDir(SDK_SRC, SDK_DEST);
console.log("SDK synced to node_modules/telegram-gifts-sdk");
