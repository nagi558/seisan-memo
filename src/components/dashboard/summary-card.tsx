import type { ReactNode } from "react";

export function SummaryCard({
  label,
  amount,
  caption,
}: {
  label: ReactNode;
  amount: number;
  caption?: ReactNode;
}) {
  return (
    <div className="from-primary to-primary/80 flex flex-col items-center gap-1 rounded-2xl bg-gradient-to-br p-6 text-center shadow-sm">
      <p className="text-primary-foreground/90 text-sm leading-tight font-medium">{label}</p>
      <p className="text-primary-foreground text-4xl font-bold">¥{amount.toLocaleString()}</p>
      {caption ? <p className="text-primary-foreground/80 text-xs">{caption}</p> : null}
    </div>
  );
}
