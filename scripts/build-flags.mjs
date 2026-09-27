/**
 * 生成 src/data/circle-flags.json —— 只收录本站数据里出现过的国旗（countryCode）。
 *
 * 数据源：devDependency `@iconify/json` 的 circle-flags 全集（纯本地读取，无网络）。
 * 结果提交进仓库；新增国家/地区后重新运行：pnpm flags
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const COLLECTION_PATH = path.join(ROOT, "node_modules/@iconify/json/json/circle-flags.json");
const DATA_DIR = path.join(ROOT, "src/data");
const OUTPUT_PATH = path.join(DATA_DIR, "circle-flags.json");

/**
 * 收集数据文件里出现过的 countryCode（形如 `countryCode: "CN"`），并集去重排序
 */
async function collectCodes() {
  const codes = new Set();
  const names = await fs.readdir(DATA_DIR);
  for (const name of names) {
    if (!name.endsWith(".ts")) {
      continue;
    }
    const text = await fs.readFile(path.join(DATA_DIR, name), "utf8");
    for (const match of text.matchAll(/countryCode: "([A-Z]{2})"/g)) {
      codes.add(match[1].toLowerCase());
    }
  }
  return [...codes].toSorted((a, b) => a.localeCompare(b, "en-US"));
}

async function main() {
  const collection = JSON.parse(await fs.readFile(COLLECTION_PATH, "utf8"));
  const codes = await collectCodes();
  const icons = {};
  const missing = [];

  for (const code of codes) {
    const icon = collection.icons[code];
    if (icon === undefined) {
      missing.push(code);
      continue;
    }
    icons[code] = { body: icon.body };
  }

  if (missing.length > 0) {
    console.warn(`[flags] circle-flags 缺少：${missing.join(", ")}（这些国家/地区会渲染为空白）`);
  }

  // 键必须按 perfectionist/sort-objects 的 en-US 同序排，否则 pnpm lint 报错
  const output = { height: collection.height, icons, prefix: collection.prefix, width: collection.width };
  await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`);
  console.log(`[flags] 写入 ${path.relative(ROOT, OUTPUT_PATH)}：${Object.keys(icons).length} 个国旗`);
}

try {
  await main();
}
catch (error) {
  console.error("[flags] 脚本异常", error);
  process.exitCode = 1;
}
