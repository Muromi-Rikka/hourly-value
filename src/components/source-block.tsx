import { ExternalLink } from "lucide-react";

interface SourceBlockProperties {
  note?: string;
  sourceName: string;
  sourceUrl: string;
  title?: string;
}

/**
 * 指数落地页底部的「数据来源」区块。
 */
export function SourceBlock({
  note,
  sourceName,
  sourceUrl,
  title = "数据来源",
}: SourceBlockProperties) {
  return (
    <section className="section-minor">
      <h2 className="minor-title mb-3">{title}</h2>
      <a
        className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 decoration-primary/50 underline underline-offset-2 hover:underline"
        href={sourceUrl}
        rel="noopener noreferrer"
        target="_blank"
      >
        {sourceName}
        <ExternalLink className="h-3.5 w-3.5 shrink-0" />
      </a>
      {note && (
        <p className="mt-2 max-w-prose text-xs leading-relaxed text-pretty text-muted-foreground">{note}</p>
      )}
      <p className="mt-2 text-xs text-muted-foreground">
        逐国明细见本页「探索」视图或「关于」页的数据来源清单。
      </p>
    </section>
  );
}
