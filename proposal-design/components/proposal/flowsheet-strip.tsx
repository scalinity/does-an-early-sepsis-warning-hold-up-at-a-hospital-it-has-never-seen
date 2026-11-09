// One illustrative ICU stay drawn as an hourly flowsheet: each column is a patient-hour.
const HOURS = 36;
const INDEX = 24; // index hour t
const ONSET = 28; // Sepsis-3 onset hour
const HORIZON = 6;
const LABS = [3, 10, 16, 21, 27, 33]; // sparse lab draws
const X0 = 84;
const WIDTH = 740;
const CELL = (WIDTH - X0) / HOURS;
const ROW = { vitals: 31, labs: 45, label: 60 };

const x = (hour: number) => X0 + hour * CELL;
const mid = (hour: number) => x(hour) + CELL / 2;

export function FlowsheetStrip() {
  const tEdge = x(INDEX + 1);
  const hEdge = x(INDEX + 1 + HORIZON);
  return (
    <svg
      viewBox={`0 0 ${WIDTH} 90`}
      className="w-full"
      role="img"
      aria-label="Hourly flowsheet of one illustrative patient showing the index time, the 6-hour horizon, Sepsis-3 onset and when SepsisLabel turns positive"
    >
      <rect x={X0} y={22} width={tEdge - X0} height={32} rx={6} className="fill-background-secondary-default" />
      <text x={0} y={12} className="fill-text-secondary text-caption-1-medium">
        Unit of analysis: one patient-hour per column
      </text>

      {(["Vitals", "Labs", "SepsisLabel"] as const).map((name, i) => (
        <text key={name} x={0} y={[ROW.vitals, ROW.labs, ROW.label][i] + 4} className="fill-text-secondary text-caption-1-medium">
          {name}
        </text>
      ))}

      {Array.from({ length: HOURS }, (_, h) => (
        <circle key={`v${h}`} cx={mid(h)} cy={ROW.vitals} r={2.4} className={h <= INDEX ? "fill-text-secondary" : "fill-text-placeholder"} />
      ))}
      {LABS.map((h) => (
        <circle key={`l${h}`} cx={mid(h)} cy={ROW.labs} r={3.4} className={h <= INDEX ? "fill-text-secondary" : "fill-text-placeholder"} />
      ))}
      {Array.from({ length: HOURS }, (_, h) => (
        <rect
          key={`s${h}`}
          x={x(h) + 1.5}
          y={ROW.label - 6}
          width={CELL - 3}
          height={12}
          rx={3}
          className={h >= ONSET - HORIZON ? "fill-notification-error-foreground" : "fill-none stroke-border-button-default"}
        />
      ))}

      <line x1={tEdge} x2={tEdge} y1={4} y2={74} strokeWidth={1.5} className="stroke-text-primary" />
      <text x={tEdge - 6} y={12} textAnchor="end" className="fill-text-primary text-caption-1-semibold">
        Index time t, every ICU hour
      </text>
      <path d={`M${tEdge} 16 H${hEdge} M${hEdge} 12 V20`} strokeWidth={1.5} className="fill-none stroke-text-primary" />
      <text x={(tEdge + hEdge) / 2} y={11} textAnchor="middle" className="fill-text-primary text-caption-1-semibold">
        6-hour horizon
      </text>

      <line x1={x(ONSET)} x2={x(ONSET)} y1={20} y2={78} strokeWidth={1.5} strokeDasharray="3 3" className="stroke-notification-error-foreground" />
      <text x={x(ONSET) + 4} y={87} className="fill-notification-error-foreground text-caption-1-semibold">
        Sepsis-3 onset
      </text>
      <text x={x(ONSET - HORIZON) - 4} y={87} textAnchor="end" className="fill-notification-error-foreground text-caption-1-medium">
        Label turns 1 six hours before onset
      </text>
      <text x={0} y={87} className="fill-text-secondary text-caption-1-medium">
        Shaded inputs: all the model may use at t
      </text>
    </svg>
  );
}
