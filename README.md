# 全球最低工资对比

以人民币购买力为统一基准，可视化对比 13 个国家/地区的最低时薪购买力差异。支持 iPhone、巨无霸、基本物资、Model Y 四大指数交叉分析。

## 技术栈

- **React 19** + TypeScript 6
- **Tailwind CSS v4**（CSS-based theme）
- **Rsbuild 2**（rspack bundler）
- **Recharts 3**（数据可视化）
- **TanStack Router** + **TanStack Table v9**
- **shadcn/ui** 组件模式

## 开发

```bash
pnpm dev        # 开发服务器（热更新）
pnpm build      # 生产构建
pnpm preview    # 预览生产构建
pnpm lint       # ESLint 检查（零警告）
```

## 数据来源

13 个国家/地区的 2025-2026 年官方最低工资标准数据，来源包括各国政府劳动部门、官方公报等权威渠道。详见 `docs/薪资.md`。

## License

MIT © 2025 Muromi-Rikka
