export function SummaryCard({
  partnerTotal,
  periodLabel,
}: {
  partnerTotal: number;
  periodLabel: string;
}) {
  return (
    <div className="from-primary to-primary/80 flex flex-col items-center gap-1 rounded-2xl bg-gradient-to-br p-6 text-center shadow-sm">
      <p className="text-primary-foreground/90 text-sm leading-tight font-medium">
        あなたが立て替えた分
        <br />
        相手の支払予定額
      </p>
      <p className="text-primary-foreground text-4xl font-bold">
        ¥{partnerTotal.toLocaleString()}
      </p>
      <p className="text-primary-foreground/80 text-xs">{periodLabel}</p>
    </div>
  );
}
