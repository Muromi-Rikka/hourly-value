import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Info } from "lucide-react";

import { AnimatedContent } from "@/components/react-bits/AnimatedContent/AnimatedContent";
import { METHOD_NOTES } from "@/data/methodology";

interface MethodNotesProperties {
  /**
   * 只显示进入首页精选的四张，其余在「关于」页看全
   */
  featuredOnly?: boolean;
  title?: string;
}

/**
 * 首页用的精选口径卡（带入场动效）
 */
export function FeaturedMethodNotes() {
  return (
    <AnimatedContent delay={0.1} distance={40} duration={0.6} threshold={0.1}>
      <MethodNotes featuredOnly />
    </AnimatedContent>
  );
}

/**
 * 口径说明卡：把「这些数字能不能横向比」讲清楚。
 * 首页与「关于」页共用同一份文案（`@/data/methodology`）。
 */
export function MethodNotes({ featuredOnly = false, title = "三分钟读懂口径" }: MethodNotesProperties) {
  const notes = featuredOnly ? METHOD_NOTES.filter(note => note.featured) : METHOD_NOTES;

  return (
    <section>
      <div className="rule-top mb-6" />
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium tracking-wider text-muted-foreground">数据口径</p>
          <h2 className="mt-2 font-display text-[clamp(1.6rem,3vw,2.2rem)] font-normal leading-tight tracking-[-0.02em]">
            {title}
          </h2>
        </div>
        {featuredOnly
          ? (
              <Link
                className="group inline-flex items-center gap-1 text-sm text-primary hover:underline underline-offset-2"
                to="/about"
              >
                全部方法论
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            )
          : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {notes.map(note => (
          <div className="rounded-xl border bg-card p-5" key={note.title}>
            <p className="flex items-start gap-2 text-sm font-medium">
              <Info aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              {note.title}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{note.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
