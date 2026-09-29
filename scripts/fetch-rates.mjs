/**
 * 构建/开发前自动拉取最新汇率，写入 src/data/exchange-rates.ts。
 *
 * 主源：Frankfurter（欧洲央行 ECB 参考汇率，免费无 key）
 * 备源：open.er-api.com（ExchangeRate-API 开放端点，免费无 key）
 *
 * 失败降级：两个源都失败时，若已存在生成文件则沿用旧值并告警（exit 0，不中断构建）；
 * 若不存在（全新克隆）则写入内置兜底汇率并告警。
 */
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const OUTPUT_PATH = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../src/data/exchange-rates.ts",
);

const TIMEOUT_MS = 5000;

/**
 * ISO 货币代码 → 数据文件里使用的中文币种名
 */
const CURRENCY_NAMES = {
  AUD: "澳元",
  CAD: "加元",
  CLP: "智利比索",
  CNY: "人民币",
  CZK: "捷克克朗",
  EUR: "欧元",
  GBP: "英镑",
  HUF: "匈牙利福林",
  ILS: "新谢克尔",
  INR: "印度卢比",
  JPY: "日元",
  KRW: "韩元",
  MXN: "墨西哥比索",
  MYR: "马来西亚林吉特",
  NZD: "新西兰元",
  PHP: "菲律宾比索",
  PLN: "波兰兹罗提",
  THB: "泰铢",
  USD: "美元",
};

/**
 * 以 EUR 为基准请求时需要的 symbols（不含 EUR 自身）
 */
const SYMBOLS = Object.keys(CURRENCY_NAMES)
  .filter(code => code !== "EUR")
  .join(",");

/**
 * 内置兜底：已是「1 单位币种 = X 人民币」直换值，2026-09 近似值，
 * 仅在两个源都失败且无既有文件时使用。
 */
const FALLBACK_CNY_PER_UNIT = {
  人民币: 1,
  加元: 5.35,
  匈牙利福林: 0.021,
  印度卢比: 0.076,
  捷克克朗: 0.313,
  新西兰元: 4.35,
  新谢克尔: 2.212,
  日元: 0.048,
  智利比索: 0.007,
  欧元: 7.85,
  波兰兹罗提: 1.749,
  泰铢: 0.201,
  澳元: 4.75,
  美元: 7.25,
  英镑: 9.25,
  菲律宾比索: 0.107,
  韩元: 0.0053,
  马来西亚林吉特: 1.644,
  墨西哥比索: 0.385,
};
const FALLBACK_DATE = "2026-09-23";
const FALLBACK_PROVIDER = "内置兜底汇率（2026-09 近似值）";

/**
 * 汇率必须是「有限的正数」。
 *
 * 不能写成 `typeof x !== "number" || x <= 0`：`typeof NaN === "number"` 而
 * `NaN <= 0` 为 false，NaN/Infinity 会一路通过，最终把 `NaN` 写进生成文件，
 * 全站人民币值变成「¥NaN」。
 */
function isPositiveFinite(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

/**
 * 生成文件里 `ratesUpdatedAt` 必须是 `YYYY-MM-DD`。
 * `JSON.stringify(undefined)` 返回 undefined（不是字符串），
 * 模板会写出 `export const ratesUpdatedAt = undefined;`。
 */
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * 交叉汇率：1 单位币种 = X 人民币（以 EUR 基准换算）。
 *
 * @throws {Error} 源数据缺少 CNY 或所需币种的汇率时抛出。
 */
function buildCnyPerUnit(rates, sourceLabel) {
  if (rates === null || typeof rates !== "object" || Array.isArray(rates)) {
    throw new Error(`${sourceLabel} 返回的 rates 不是对象`);
  }
  const cnyPerEur = rates.CNY;
  if (!isPositiveFinite(cnyPerEur)) {
    throw new Error(`${sourceLabel} 返回缺少 CNY 汇率`);
  }
  const result = {};
  for (const [code, name] of Object.entries(CURRENCY_NAMES)) {
    if (code === "CNY") {
      result[name] = 1;
      continue;
    }
    const perEur = code === "EUR" ? 1 : rates[code];
    if (!isPositiveFinite(perEur)) {
      throw new Error(`${sourceLabel} 返回缺少 ${code} 汇率`);
    }
    result[name] = round6(cnyPerEur / perEur);
  }
  return result;
}

/**
 * 备源：open.er-api.com，基准 EUR
 */
async function fetchErApi() {
  const data = await fetchJson("https://open.er-api.com/v6/latest/EUR");
  // time_last_update_utc 形如 "Thu, 24 Sep 2026 00:02:32 +0000"，
  // 直接 slice(0, 10) 会截成 "Thu, 24 Se"，因此优先用 unix 时间戳解析。
  const parsed = typeof data.time_last_update_unix === "number"
    ? new Date(data.time_last_update_unix * 1000)
    : new Date(data.time_last_update_utc ?? NaN);
  const date = Number.isNaN(parsed.getTime())
    ? FALLBACK_DATE
    : parsed.toISOString().slice(0, 10);
  return {
    date,
    provider: "open.er-api.com（ExchangeRate-API 备用源）",
    rates: data.rates,
  };
}

/**
 * 主源：Frankfurter，基准 EUR，返回 ECB 最近工作日参考汇率
 */
async function fetchFrankfurter() {
  const data = await fetchJson(
    `https://api.frankfurter.app/latest?from=EUR&to=${SYMBOLS}`,
  );
  return {
    date: data.date,
    provider: "Frankfurter（欧洲央行 ECB 参考汇率）",
    rates: data.rates,
  };
}

/**
 * 拉取 JSON，5 秒超时，非 2xx 视为失败。
 *
 * @throws {Error} 网络失败、超时或 HTTP 非 2xx 时抛出。
 */
async function fetchJson(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} — ${url}`);
  }
  return response.json();
}

/**
 * 判断生成文件是否已存在（作为离线兜底快照）。
 */
async function fileExists() {
  try {
    await fs.access(OUTPUT_PATH);
    return true;
  }
  catch {
    return false;
  }
}

/**
 * 依次尝试主源与备源；全部失败时降级处理。
 */
async function main() {
  const sources = [
    ["Frankfurter", fetchFrankfurter],
    ["open.er-api.com", fetchErApi],
  ];

  for (const [label, fetcher] of sources) {
    try {
      const { date, provider, rates } = await fetcher();
      const cnyPerUnit = buildCnyPerUnit(rates, label);
      await fs.writeFile(
        OUTPUT_PATH,
        renderFile({ cnyPerUnit, date, provider }),
        "utf8",
      );
      console.log(`[rates] 已更新汇率（${provider}，数据日期 ${date}）→ ${path.relative(process.cwd(), OUTPUT_PATH)}`);
      return;
    }
    catch (error) {
      console.warn(`[rates] ${label} 拉取失败：${error instanceof Error ? error.message : error}`);
    }
  }

  if (await fileExists()) {
    console.warn("[rates] 所有汇率源均失败，沿用已存在的 src/data/exchange-rates.ts");
    return;
  }

  await fs.writeFile(
    OUTPUT_PATH,
    renderFile({
      cnyPerUnit: FALLBACK_CNY_PER_UNIT,
      date: FALLBACK_DATE,
      provider: FALLBACK_PROVIDER,
    }),
    "utf8",
  );
  console.warn("[rates] 所有汇率源均失败且无既有文件，已写入内置兜底汇率");
}

/**
 * 渲染生成文件内容。
 *
 * @throws {Error} 日期、汇率表或数值不合法时抛出。
 */
function renderFile({ cnyPerUnit, date, provider }) {
  if (typeof date !== "string" || !ISO_DATE.test(date)) {
    throw new Error(`汇率数据日期不合法：${String(date)}`);
  }
  const entries = Object.entries(cnyPerUnit);
  if (entries.length === 0) {
    throw new Error("汇率表为空，拒绝生成文件");
  }
  for (const [name, value] of entries) {
    if (!isPositiveFinite(value)) {
      throw new Error(`汇率 ${name} 不是有限正数：${String(value)}`);
    }
  }
  // eslint perfectionist/sort-objects 默认 locales: 'en-US'，必须同序，否则 pnpm lint 报错
  const keys = Object.keys(cnyPerUnit).toSorted((a, b) => a.localeCompare(b, "en-US"));
  const lines = keys.map(key => `  ${key}: ${cnyPerUnit[key]},`);
  return `// AUTO-GENERATED by scripts/fetch-rates.mjs — do not edit manually.
// 重新生成：pnpm rates
export const ratesUpdatedAt = ${JSON.stringify(date)};
export const ratesProvider = ${JSON.stringify(provider)};
export const cnyPerUnit: Record<string, number> = {
${lines.join("\n")}
};
`;
}

function round6(value) {
  return Math.round(value * 1e6) / 1e6;
}

try {
  await main();
}
catch (error) {
  console.error("[rates] 脚本异常：", error);
  process.exitCode = 1;
}
