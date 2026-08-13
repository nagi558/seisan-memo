export type DonutSegment = {
  key: string;
  percent: number;
  color: string;
};

const RADIUS = 40;
const STROKE_WIDTH = 16;

export function DonutChart({ segments }: { segments: DonutSegment[] }) {
  if (segments.length === 0) {
    return (
      <svg viewBox="0 0 100 100" className="size-40" aria-hidden="true">
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          className="stroke-muted"
          strokeWidth={STROKE_WIDTH}
        />
      </svg>
    );
  }

  const offsets: number[] = [];
  for (let index = 0; index < segments.length; index += 1) {
    offsets.push(index === 0 ? 0 : offsets[index - 1] + segments[index - 1].percent);
  }

  return (
    <svg viewBox="0 0 100 100" className="size-40 -rotate-90" aria-hidden="true">
      {segments.map((segment, index) => (
        <circle
          key={segment.key}
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          stroke={segment.color}
          strokeWidth={STROKE_WIDTH}
          pathLength={100}
          strokeDasharray={`${segment.percent} ${100 - segment.percent}`}
          strokeDashoffset={-offsets[index]}
        />
      ))}
    </svg>
  );
}
