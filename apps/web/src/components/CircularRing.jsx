export default function CircularRing({
  value = 0,
  size = 52,
  stroke = 3,
  label,
  color = "#3B82F6",
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className="relative inline-flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1C2030"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition:
              "stroke-dashoffset 400ms cubic-bezier(0.22,0.61,0.36,1)",
            filter: `drop-shadow(0 0 4px ${color}80)`,
          }}
        />
      </svg>
      <span className="absolute text-[11px] font-bold text-slate-200 tabular-nums">
        {label ?? `${Math.round(clamped)}%`}
      </span>
    </div>
  );
}
