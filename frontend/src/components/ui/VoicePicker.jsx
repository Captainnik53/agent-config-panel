const VOICES = [
  { id: 'Maria',  emoji: '👩', bg: 'rgba(249,115,22,0.15)',  desc: 'Warm · Female',        langs: 'es / hi' },
  { id: 'Sofia',  emoji: '👩', bg: 'rgba(99,102,241,0.15)',  desc: 'Expressive · Female',   langs: 'es'      },
  { id: 'Arjun',  emoji: '👨', bg: 'rgba(6,182,212,0.15)',   desc: 'Clear · Male',          langs: 'hi / en' },
  { id: 'James',  emoji: '👨', bg: 'rgba(16,185,129,0.15)',  desc: 'Professional · Male',   langs: 'en'      },
  { id: 'Priya',  emoji: '👩', bg: 'rgba(139,92,246,0.15)',  desc: 'Friendly · Female',     langs: 'hi / en' },
  { id: 'Custom', emoji: '✏️', bg: 'rgba(100,116,139,0.15)', desc: 'Enter voice ID manually', langs: null     },
]

export default function VoicePicker({ value, onChange, layout = 'grid', selectedBg = 'border-app-accent bg-app-accent/10', selectedText = 'text-indigo-300' }) {
  if (layout === 'list') {
    return (
      <div className="flex flex-col gap-1.5">
        {VOICES.map(v => {
          const selected = value === v.id
          return (
            <div
              key={v.id}
              onClick={() => onChange(v.id)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border cursor-pointer transition-all
                ${selected ? selectedBg : 'border-app-border2 bg-app-panel hover:border-app-accent'}`}
            >
              <div className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-sm flex-shrink-0"
                style={{ background: v.bg }}>
                {v.emoji}
              </div>
              <span className={`text-xs font-medium flex-1 ${selected ? selectedText : 'text-app-text'}`}>{v.id}</span>
              <span className="text-[10px] text-app-muted">{v.desc}</span>
              {v.langs && (
                <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(6,182,212,0.12)', color: '#67e8f9' }}>
                  {v.langs}
                </span>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {VOICES.map(v => {
        const selected = value === v.id
        return (
          <div
            key={v.id}
            onClick={() => onChange(v.id)}
            className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition-all
              ${selected ? selectedBg : 'border-app-border2 bg-app-panel hover:border-app-accent'}`}
          >
            <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-sm flex-shrink-0"
              style={{ background: v.bg }}>
              {v.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-xs font-semibold mb-0.5 ${selected ? selectedText : 'text-app-text'}`}>{v.id}</div>
              <div className="text-[10px] text-app-muted">{v.desc}</div>
              {v.langs && (
                <span className="text-[9px] px-1.5 py-0.5 rounded mt-1 inline-block"
                  style={{ background: 'rgba(6,182,212,0.12)', color: '#67e8f9' }}>
                  {v.langs}
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
