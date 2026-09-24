# 全球最低工资对比

以人民币购买力为统一基准，把 22 个国家/地区的法定最低时薪拉到同一把尺子上；再用 iPhone、巨无霸、基础物资、Tesla Model Y 四类消费品交叉验证，看清「工资数字」背后的真实购买力差异。

## 5 大指数

| 指数 | 口径 | 亮点 |
|---|---|---|
| 最低工资 | 各国法定时薪折合人民币 | 最高 澳大利亚 ¥114/h，最低 印度 ¥6/h，约 18.8 倍差距 |
| iPhone 指数 | 买一台 iPhone 18 Pro 所需工时 | 澳大利亚 87.3h ~ 印度 1925.5h |
| 巨无霸指数 | 货币相对美元的购买力估值 | 比利时 +13.8% 最高估，印度 −60.6% 最低估 |
| 物资指数 | 基础生活物资篮所需工时 | 爱尔兰最少 3.97h，泰国最多 44.95h |
| Model Y 指数 | 买一辆 Tesla Model Y 所需天数 | 澳大利亚 291 天 ~ 印度 7428 天 |

每个指数都配有可排序表格与图表两种视图，支持按区域筛选。

## 快速开始

```bash
pnpm install
pnpm dev        # 开发服务器（热更新）
```

| 命令 | 作用 |
|---|---|
| `pnpm build` | 生产构建 |
| `pnpm preview` | 预览生产构建 |
| `pnpm lint` | ESLint 检查（零警告） |

## 数据说明

- 覆盖 22 个国家/地区、4 大区域的 2025–2026 年官方最低工资标准。
- 每条数据附官方来源、生效日期与口径注释（如美国、加拿大取各省/州中位数，西班牙按月薪折算时薪）。
- 商品价格来源：Apple 官方商城（iPhone）、GlobalProductPrices.com（物资篮子）、The Economist Big Mac Data（巨无霸）、Tesla 官网（Model Y）。
- 人民币折算汇率于每次构建时自动拉取 Frankfurter（欧洲央行 ECB 参考汇率），详见站内「关于」页。
- 完整数据与来源见 `src/data/wages.ts`，站内「关于」页有方法论与全部数据来源清单。

## 技术栈

**React 19** · **TypeScript 6** · **Tailwind CSS v4** · **Rsbuild 2**（rspack）· **Recharts 3** · **TanStack Router** · **TanStack Table v9** · **shadcn/ui** 组件模式

## License

MIT © 2025 Muromi-Rikka
