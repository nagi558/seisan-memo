export type LegendSegment = {
  key: string;
  name: string;
  amountTotal: number;
  percent: number;
  color: string;
};

export function CategoryLegend({ segments }: { segments: LegendSegment[] }) {
  return (
    <ul className="flex w-full flex-col gap-2">
      {segments.map((segment) => (
        <li key={segment.key} className="flex items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: segment.color }}
              aria-hidden="true"
            />
            <span className="text-foreground text-sm font-medium">{segment.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs">{segment.percent}%</span>
            <span className="text-foreground w-20 text-right text-sm font-semibold">
              ¥{segment.amountTotal.toLocaleString()}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
