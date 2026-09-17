import "./app.css";

const HOMEPAGE = "https://github.com/Trapar-waves/react-tailwind";
const LOGOS_SET_URL = "https://icon-sets.iconify.design/logos/";

interface TechItem {
  hint: string;
  iconClass: string;
  id: string;
  label: string;
}

const techStack: TechItem[] = [
  { hint: "组件驱动、声明式 UI", iconClass: "icon-[logos--react]", id: "react", label: "React 19" },
  { hint: "静态类型与编辑器体验", iconClass: "icon-[logos--typescript-icon]", id: "ts", label: "TypeScript" },
  { hint: "tailwindcss · @tailwindcss/postcss", iconClass: "icon-[logos--tailwindcss-icon]", id: "tailwind", label: "Tailwind CSS 4" },
  { hint: "@rsbuild/core · @rsbuild/plugin-react", iconClass: "icon-[material-icon-theme--rstack]", id: "rsbuild", label: "Rsbuild" },
  { hint: "@renton/eslint-config-react", iconClass: "icon-[logos--eslint]", id: "eslint", label: "ESLint" },
  { hint: "@iconify/json · @iconify/tailwind4（含 logos）", iconClass: "icon-[logos--markdown]", id: "iconify", label: "Iconify" },
  { hint: "包管理与 CI 缓存", iconClass: "icon-[logos--pnpm]", id: "pnpm", label: "pnpm" },
  { hint: "本地开发与构建", iconClass: "icon-[logos--nodejs-icon]", id: "node", label: "Node.js" },
  { hint: "Release 与 Pages 工作流", iconClass: "icon-[logos--github-icon]", id: "github", label: "GitHub Actions" },
];

const readmeFeatures: string[] = [
  "基于 React 19 的组件化界面。",
  "Tailwind CSS v4 与 @tailwindcss/postcss，工具类优先、易迭代。",
  "Rsbuild 提供极速开发与优化构建。",
  "@iconify/json 与 @iconify/tailwind4，支持 logos 等多集合矢量图标。",
  "TypeScript 贯穿模板代码。",
  "@renton/eslint-config-react 统一代码风格与规则。",
  "Husky 与 lint-staged 在提交前执行检查。",
];

const readmeTechNote = "本模板未内置路由或全局状态；可按业务接入 TanStack Router、Zustand 等，与 README「扩展」章节一致。";

export default function App() {
  return (
    <div className="min-h-dvh bg-[#faf8f5] text-slate-900 font-sans antialiased">
      <a className="skip-link" href="#main">
        跳到主要内容
      </a>
      <div className="hero-grid relative overflow-hidden border-b border-slate-200/80">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-orange-500/15 blur-3xl motion-safe:animate-[pulse_14s_ease-in-out_infinite]"
        />
        <header className="relative mx-auto max-w-5xl px-6 pb-16 pt-14 sm:px-10 sm:pb-20 sm:pt-20">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-orange-700">
            Trapar-waves / react-tailwind
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-normal leading-tight text-slate-950 sm:text-5xl">
            Rsbuild、React 19 与 Tailwind CSS 4 的轻量起点
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
            本页结合 README 特性与
            {" "}
            <a
              className="font-semibold text-orange-800 underline decoration-orange-300 underline-offset-2 hover:text-orange-950"
              href={LOGOS_SET_URL}
              rel="noreferrer"
              target="_blank"
            >
              Iconify logos
            </a>
            {" "}
            集合展示技术栈；保留 @theme 字体、跳过链接与减少动效等可访问实践。
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-slate-900 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
              href={HOMEPAGE}
            >
              查看模板仓库
            </a>
            <span aria-hidden className="icon-[logos--react] text-3xl text-sky-700" />
            <span aria-hidden className="icon-[logos--tailwindcss-icon] text-3xl text-cyan-700" />
            <span aria-hidden className="icon-[material-icon-theme--rstack] text-3xl text-amber-800" />
          </div>
        </header>
      </div>

      <main className="mx-auto max-w-5xl px-6 py-14 sm:px-10" id="main">
        <h2 className="font-display text-2xl text-slate-900">技术栈一览</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          Rsbuild 与 Rspack 生态相关示意使用
          {" "}
          <code className="rounded bg-slate-200/80 px-1.5 py-0.5 text-slate-800">material-icon-theme--rstack</code>
          ；图标集说明见上文链接。
        </p>
        <ul className="mt-8 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {techStack.map(item => (
            <li
              className="flex gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm"
              key={item.id}
            >
              <div aria-hidden className="trapar-tech-icon">
                <span className={item.iconClass} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">{item.label}</h3>
                <p className="mt-1 text-sm leading-snug text-slate-600">{item.hint}</p>
              </div>
            </li>
          ))}
        </ul>

        <h2 className="font-display mt-14 text-2xl text-slate-900">README 特性摘要</h2>
        <ul className="mt-4 max-w-3xl list-disc space-y-2 pl-5 text-slate-700">
          {readmeFeatures.map(line => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p className="mt-4 max-w-3xl text-sm italic text-slate-600">{readmeTechNote}</p>

        <section aria-labelledby="a11y-heading" className="mt-12 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
          <h2 className="font-display text-xl text-slate-900" id="a11y-heading">
            图标与可访问性
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">
            装饰性技术标识使用 Iconify
            <code className="mx-1 rounded bg-slate-100 px-1">logos</code>
            集合的矢量类名（与源码中实际 slug 一致），并配合
            <span className="font-medium text-slate-800"> aria-hidden</span>
            ；主操作区保持约 44px 触控高度与可见焦点环；系统开启「减少动态效果」时装饰动画会缩短。
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <span aria-hidden className="icon-[logos--eslint] text-3xl text-purple-800" />
            <span aria-hidden className="icon-[logos--typescript-icon] text-3xl text-blue-800" />
            <span aria-hidden className="icon-[logos--github-icon] text-3xl text-slate-800" />
          </div>
        </section>

        <h2 className="font-display mt-14 text-2xl text-slate-900">界面骨架示例</h2>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2">
          <li className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition hover:border-orange-200 hover:shadow-md">
            <h3 className="text-lg font-semibold text-slate-900">Tailwind 4 + PostCSS</h3>
            <p className="mt-2 text-slate-600">
              使用 @theme 扩展字体族，配合 @utility 与任意值快速迭代布局与间距体系。
            </p>
          </li>
          <li className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition hover:border-orange-200 hover:shadow-md">
            <h3 className="text-lg font-semibold text-slate-900">Iconify 图标</h3>
            <p className="mt-2 text-slate-600">
              通过 @iconify/tailwind4 以原子类方式引用多集合矢量图标，避免 emoji 替代图标。
            </p>
          </li>
          <li className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition hover:border-orange-200 hover:shadow-md">
            <h3 className="text-lg font-semibold text-slate-900">可访问与动效</h3>
            <p className="mt-2 text-slate-600">
              首跳链接、可见焦点环，以及在 prefers-reduced-motion 下弱化装饰性动画。
            </p>
          </li>
          <li className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition hover:border-orange-200 hover:shadow-md">
            <h3 className="text-lg font-semibold text-slate-900">GitHub Pages</h3>
            <p className="mt-2 text-slate-600">
              通过 BASE_PATH 子路径构建，在推送版本标签时由 Actions 发布静态站点。
            </p>
          </li>
        </ul>
      </main>
      <footer className="border-t border-slate-200/80 bg-white/80 py-8 text-center text-sm text-slate-500">
        MIT · Trapar-waves · 图标致谢 Iconify logos（CC0）
      </footer>
    </div>
  );
}
