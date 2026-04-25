export default function Tabs({ tabs, value, onChange }) {
  return (
    <div className="flex items-center gap-1 p-1 bg-[#080A10] rounded-xl border border-[#1C2030] w-full overflow-x-auto">
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            onClick={() => onChange(t.value)}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              active
                ? "bg-[#0E1118] text-slate-100 shadow-sm border border-[#1C2030]"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
