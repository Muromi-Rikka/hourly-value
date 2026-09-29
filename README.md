# 一小时最低工资购买力

以人民币购买力为统一基准，把各国法定最低时薪放到同一把尺子上；再用巨无霸、基础物资、iPhone、Tesla Model Y 四类消费品交叉验证，回答一个问题：

> **同样工作 1 小时，各国最低工资能买到什么？**

## 数据入口

| 入口 | 口径 | 说明 |
|---|---|---|
| [一小时购买力](/hourly) | 跨五项指标对比 | 选两个国家逐项比较，可只看数据齐备的国家；支持 `?a=CN&b=DE&metric=basketHours` 分享链接 |
| 最低工资 | 各国法定时薪折合人民币 | 税前名义值，按月/按日设定的国家按法定工时折算 |
| 巨无霸指数 | 当地时薪 ÷ 当地汉堡价 | **全程本币相除，不经过汇率**，是最干净的购买力指标 |
| 物资指数 | 基础食品篮总价 ÷ 时薪 | 9 件食品，价格为来源站快照 |
| iPhone 指数 | 官网标价折算后所需工时 | Apple 官方商城，含税口径各国不同 |
| Model Y 指数 | 官网标价折算后所需工时 | 天数只是按每天 8 小时的换算，跨地区以小时为准 |

五项数据齐备的有 23 个国家/地区；其余国家至少缺一项，表格里的 `—` 是真的没有数据，不代表买不起。

## 数据口径

- 覆盖 27 个国家/地区、6 个区域的 2025–2026 年官方最低工资标准，每条附官方来源、生效日期与工时折算说明。
- 工资为**税前**法定值；加拿大、美国、日本、中国、印度、墨西哥、泰国、菲律宾无全国统一标准，取地区中位数或集体协议口径并标记为代理值。
- 人民币折算汇率于每次构建时自动拉取（主源 Frankfurter / ECB，备源 open.er-api.com），**这是市场汇率近似，不等于购买力平价（PPP）**，也不含住房等固定成本。
- 商品价格为各自采集日期的快照，与汇率更新日期不一定一致；方法论全文见站内「关于」页。

## 快速开始

```bash
pnpm install
pnpm dev        # 开发服务器（热更新）
```

| 命令 | 作用 |
|---|---|
| `pnpm dev` | 开发服务器（会先拉取汇率） |
| `pnpm rates` | 单独更新 `src/data/exchange-rates.ts` |
| `pnpm build` | 生产构建（会先拉取汇率） |
| `pnpm preview` | 预览生产构建 |
| `pnpm lint` | ESLint 检查（零警告） |
| `pnpm typecheck` | 类型检查（`tsc --noEmit`，无 flag） |

`tsconfig.json` 已按 TypeScript 6/7 整理：无 `baseUrl`（`paths` 直接写相对路径），并显式固定 `noUncheckedSideEffectImports` / `rootDir` / `types` / `stableTypeOrdering`，因此 `tsc` 在 TS 6 与 TS 7 下都能零 flag 运行。

## 部署

产物是纯静态站点（`dist/`），发布到 Cloudflare Pages → [hourly-value.pages.dev](https://hourly-value.pages.dev)。`dist/` 里**故意不放 `404.html`**：Cloudflare Pages 会因此按 SPA 模式把未知路径回落到 `index.html`，客户端路由才能深链直达。

| Workflow | 触发 | 步骤 |
|---|---|---|
| `.github/workflows/deploy.yml` | push / PR 到 `master`、手动触发 | 门禁（`pnpm lint` + `pnpm typecheck`）→ `pnpm build`（先拉汇率）→ `wrangler pages deploy dist`（PR 只跑门禁与构建，不发布） |

首次启用需在仓库 **Settings → Secrets and variables → Actions** 添加：

| Secret | 说明 |
|---|---|
| `CLOUDFLARE_API_TOKEN` | API Token，权限含 `Cloudflare Pages: Edit` |
| `ACCOUNT_ID` | Cloudflare 账户 ID |

等价的手动发布：

```bash
pnpm build
npx wrangler pages deploy dist --project-name=hourly-value --branch main
```

## 技术栈

**React 19** · **TypeScript 6** · **Tailwind CSS v4** · **Rsbuild 2**（rspack）· **Recharts 3** · **TanStack Router** · **TanStack Table v9** · **shadcn/ui** 组件模式

## License

MIT © 2025 Muromi-Rikka
