# 一小时最低工资购买力

## Platform
Web

## Stack
- React 19 + TypeScript
- Tailwind CSS 4
- Rsbuild
- shadcn/ui
- Recharts
- TanStack Router

## Users
关注全球劳动权益、薪资对比的研究者、记者、政策制定者、普通劳动者

## Product Purpose
回答「同样工作一小时，各国最低工资能买到什么」：以工时为统一单位，把法定最低工资与四类消费品拉到同一把尺子上横向比较，并提供可分享的两国对比

## Positioning
以人民币为共同基准的小时工资购买力可视化工具；口径为「税前法定最低工资 × 市场汇率折算」的横向近似，不宣称等于 PPP

## Evidence on Hand
`src/data/hourly-power.ts` 联结 27 个国家/地区的工资与四类消费指标，五项齐备的有 23 个；`src/data/wages.ts` 每条附官方来源、生效日期与工时折算口径，并标记代理值

## Non-Goals
- 不合成一个不透明的「综合购买力总分」
- 不提供税后到手时薪（缺少可靠跨国数据）
- 不把商品价格快照称作实时价或 PPP
