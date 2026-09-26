import { readFileSync, writeFileSync } from "node:fs";

/*
 * 由 assets/og/icon.html（?s=32）截出的 public/favicon-32.png 打包成 public/favicon.ico。
 * ICO 容器：ICONDIR(6) + ICONDIRENTRY(16) + 内嵌 PNG。
 * 图标更新后依次重跑截图与本脚本。
 */
const png = readFileSync(new URL("../public/favicon-32.png", import.meta.url));
const entry = Buffer.alloc(16);
entry.writeUInt8(32, 0); // 宽 32（0 表示 256）
entry.writeUInt8(32, 1); // 高 32
entry.writeUInt8(0, 2); // 调色板颜色数
entry.writeUInt8(0, 3); // 保留
entry.writeUInt16LE(1, 4); // color planes
entry.writeUInt16LE(32, 6); // bits per pixel
entry.writeUInt32LE(png.length, 8);
entry.writeUInt32LE(22, 12); // 图像数据偏移 = 6 + 16

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type = icon
header.writeUInt16LE(1, 4); // count

writeFileSync(new URL("../public/favicon.ico", import.meta.url), Buffer.concat([header, entry, png]));
console.log("favicon.ico", 22 + png.length, "bytes");
