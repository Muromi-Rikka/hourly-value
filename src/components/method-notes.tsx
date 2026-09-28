import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Info } from "lucide-react";

import { AnimatedContent } from "@/components/react-bits/AnimatedContent/AnimatedContent";
import { SectionHeading } from "@/components/section-heading";
import { cardVariants } from "@/components/ui/card";
import { METHOD_NOTES } from "@/data/methodology";
import { cn } from "@/lib/utilities";

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
    <section className="section">
      <SectionHeading
        action={
          featuredOnly
            ? (
                <Link
                  className="group inline-flex items-center gap-1 text-sm text-primary hover:underline underline-offset-2"
                  to="/about"
                >
                  全部方法论
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              )
            : undefined
        }
        eyebrow="数据口径"
        title={title}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {notes.map(note => (
          <div className={cn(cardVariants({ variant: "default" }), "p-5")} key={note.title}>
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Info aria-hidden="true" className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium leading-snug">{note.title}</p>
                <div className="mt-3 border-t border-border/70 pt-3">
                  <p className="text-xs leading-relaxed text-muted-foreground">{note.body}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
