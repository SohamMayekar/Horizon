export function OutlinePill({ children, className = "" }) {
  return (
    <span
      className={`bg-[#12151F] border border-[#1C2030] rounded-full px-3 py-1 text-xs text-slate-400 inline-flex items-center gap-1.5 ${className}`}
    >
      {children}
    </span>
  );
}

export function SoftActionPill({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full px-4 py-1.5 text-sm font-medium inline-flex items-center gap-1.5 hover:bg-blue-500/20 hover:border-blue-500/40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080A10] ${className}`}
    >
      {children}
    </button>
  );
}

export function StatusPill({ children, tone = "green", className = "" }) {
  const styles = {
    green: {
      dot: "#10B981",
      bg: "rgba(16,185,129,0.08)",
      border: "rgba(16,185,129,0.2)",
      text: "#34D399",
    },
    orange: {
      dot: "#F59E0B",
      bg: "rgba(245,158,11,0.08)",
      border: "rgba(245,158,11,0.2)",
      text: "#FCD34D",
    },
    red: {
      dot: "#EF4444",
      bg: "rgba(239,68,68,0.08)",
      border: "rgba(239,68,68,0.2)",
      text: "#FCA5A5",
    },
  };
  const s = styles[tone] ?? styles.green;
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium inline-flex items-center gap-1.5 ${className}`}
      style={{
        background: s.bg,
        border: `1px solid ${s.border}`,
        color: s.text,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: s.dot }}
      />
      {children}
    </span>
  );
}
