"use client";

export default function SliderRow({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  format = (v) => v,
  hint,
}) {
  const pct = max === min ? 0 : ((value - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col gap-2.5 py-4">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          {label}
        </span>
        <span className="text-sm font-bold text-slate-100 tabular-nums">
          {format(value)}
        </span>
      </div>

      <div className="relative h-5 flex items-center">
        {/* Track background */}
        <div className="absolute inset-x-0 h-[3px] rounded-full" style={{ background: "var(--app-border, #1C2030)" }} />
        {/* Track fill */}
        <div
          className="absolute left-0 h-[3px] rounded-full"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg, #1D4ED8, #3B82F6)",
            boxShadow: "0 0 8px rgba(59,130,246,0.45)",
          }}
        />
        {/* Thumb dot */}
        <div
          className="absolute w-[14px] h-[14px] rounded-full bg-white border-[2px] border-blue-500"
          style={{
            left: `calc(${pct}% - 7px)`,
            boxShadow:
              "0 0 0 3px rgba(59,130,246,0.18), 0 1px 6px rgba(0,0,0,0.5)",
            pointerEvents: "none",
          }}
        />
        {/* Native input — invisible, sits on top */}
        <input
          type="range"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
        />
      </div>

      {hint ? <span className="text-[11px] text-slate-600">{hint}</span> : null}
    </div>
  );
}
