const BADGE = {
  New:  'bg-green-500/15 text-green-400',
  Beta: 'bg-amber-500/15 text-amber-400',
}

export default function RadioPicker({ label, hint, options, value, onChange, accentClass = 'border-app-accent bg-app-accent/10' }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold text-app-soft uppercase tracking-wider">{label}</span>
      {hint && <span className="text-[10px] text-app-muted">{hint}</span>}
      <div className="flex gap-2 flex-wrap mt-1">
        {options.map(opt => {
          const selected = value === opt.value
          return (
            <div
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border cursor-pointer text-sm transition-all select-none
                ${selected
                  ? `${accentClass} text-app-text font-medium`
                  : 'border-app-border2 bg-app-panel text-app-soft hover:border-app-accent hover:text-app-text'
                }`}
            >
              <div className={`w-[15px] h-[15px] rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
                ${selected ? 'border-app-accent bg-app-accent' : 'border-app-border2'}`}>
                {selected && <div className="w-[5px] h-[5px] rounded-full bg-white" />}
              </div>
              {opt.label}
              {opt.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded ml-0.5 ${BADGE[opt.badge] ?? ''}`}>
                  {opt.badge}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
