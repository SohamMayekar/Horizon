export default function Card({ children, className = "", accent, ...rest }) {
  return (
    <div
      className={`relative bg-[#0E1118] rounded-2xl border border-[#1C2030] p-6 overflow-hidden ${className}`}
      {...rest}
    >
      {/* subtle top-edge accent line */}
      {accent ? (
        <div
          className="absolute top-0 left-6 right-6 h-px rounded-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${accent}60, transparent)`,
          }}
        />
      ) : null}
      {children}
    </div>
  );
}

export function CardHeader({ title, description, action }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-5">
      <div className="flex flex-col gap-0.5">
        <h3 className="text-sm font-semibold text-slate-200 tracking-tight">
          {title}
        </h3>
        {description ? (
          <p className="text-xs text-slate-500 font-normal">{description}</p>
        ) : null}
      </div>
      {action ? <div className="flex-shrink-0">{action}</div> : null}
    </div>
  );
}
