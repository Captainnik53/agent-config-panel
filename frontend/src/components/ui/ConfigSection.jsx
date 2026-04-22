import { useState } from 'react'

export default function ConfigSection({ icon, title, subtitle, badge, badgeVariant = 'agent', defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen)

  const badgeStyle = {
    agent:    'bg-indigo-500/20 text-indigo-300',
    template: 'bg-indigo-500/20 text-indigo-300',
    staging:  'bg-amber-500/20 text-amber-300',
    stt:      'bg-indigo-500/20 text-indigo-300',
    tts:      'bg-indigo-500/20 text-indigo-300',
  }

  return (
    <div className="bg-app-card border border-app-border rounded-xl mb-4 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2.5 px-5 py-3.5 border-b border-app-border text-left hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-base">{icon}</span>
        <span className="text-[13px] font-semibold text-app-text flex-1">{title}</span>
        {subtitle && <span className="text-[11px] text-app-muted hidden sm:block">{subtitle}</span>}
        {badge && (
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeStyle[badgeVariant] ?? badgeStyle.agent}`}>
            {badge}
          </span>
        )}
        <span className={`text-app-muted text-xs transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>
      {open && <div className="p-5">{children}</div>}
    </div>
  )
}
