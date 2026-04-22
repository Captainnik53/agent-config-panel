const MODELS = [
  { id: 'gemini-flash-2',  name: 'Gemini Flash 2.0', provider: 'Google DeepMind', badge: 'Fast'  },
  { id: 'gemini-pro-1.5',  name: 'Gemini Pro 1.5',   provider: 'Google DeepMind', badge: 'Smart' },
  { id: 'gpt-4o-mini',     name: 'GPT-4o mini',       provider: 'OpenAI',          badge: 'Cheap' },
  { id: 'gpt-4o',          name: 'GPT-4o',            provider: 'OpenAI',          badge: 'Smart' },
  { id: 'claude-haiku',    name: 'Claude 3.5 Haiku',  provider: 'Anthropic',       badge: 'Fast'  },
  { id: 'custom',          name: 'Custom',             provider: 'via NLU UUID'                    },
]

const BADGE_STYLE = {
  Fast:  'bg-green-500/15 text-green-400',
  Smart: 'bg-indigo-500/15 text-indigo-300',
  Cheap: 'bg-amber-500/12 text-amber-400',
}

export default function ModelPicker({ value, onChange, selectedTextColor = 'text-indigo-300', selectedBg = 'border-app-accent bg-app-accent/10' }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {MODELS.map(m => {
        const selected = value === m.id
        return (
          <div
            key={m.id}
            onClick={() => onChange(m.id)}
            className={`p-3 rounded-lg border cursor-pointer transition-all
              ${selected ? `${selectedBg}` : 'border-app-border2 bg-app-panel hover:border-app-accent'}`}
          >
            <div className={`text-xs font-semibold flex items-center gap-1.5 mb-1 ${selected ? selectedTextColor : 'text-app-text'}`}>
              {m.name}
              {m.badge && (
                <span className={`text-[9px] px-1 py-0.5 rounded ${BADGE_STYLE[m.badge]}`}>{m.badge}</span>
              )}
            </div>
            <div className="text-[10px] text-app-muted">{m.provider}</div>
          </div>
        )
      })}
    </div>
  )
}
