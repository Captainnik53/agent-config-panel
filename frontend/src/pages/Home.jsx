import AppLayout from '../components/layout/AppLayout'
import { recentChanges } from '../data/mockData'

const insights = [
  { label: 'STT — Deepgram',      val: '72%', sub: '13 of 18 active agents',      icon: '🎤', barW: '72%', color: '#2dd4bf', bar: 'linear-gradient(90deg,#00d4b1,#06b6d4)', top: 'linear-gradient(90deg,#00d4b1,#06b6d4)' },
  { label: 'TTS — ElevenLabs',    val: '68%', sub: '11 of 16 TTS-enabled agents', icon: '🔊', barW: '68%', color: '#fb923c', bar: 'linear-gradient(90deg,#f97316,#ef4444)', top: 'linear-gradient(90deg,#f97316,#ef4444)' },
  { label: 'Production Agents',   val: '15',  sub: 'All live · 0 errors today',   icon: '⚡', barW: '100%', color: '#a5b4fc', bar: 'linear-gradient(90deg,#6366f1,#8b5cf6)', top: 'linear-gradient(90deg,#6366f1,#8b5cf6)' },
  { label: 'Staging Agents',      val: '8',   sub: '6 active · 2 paused',         icon: '🧪', barW: '53%', color: '#fbbf24', bar: 'linear-gradient(90deg,#f59e0b,#f97316)', top: 'linear-gradient(90deg,#f59e0b,#f97316)' },
]

const providers = {
  stt: [
    { name: '🟢 Deepgram', pct: 72,  barColor: 'linear-gradient(90deg,#00d4b1,#06b6d4)', textColor: '#2dd4bf'  },
    { name: '🔵 Google STT',pct: 20, barColor: 'linear-gradient(90deg,#4285f4,#0f9d58)', textColor: '#60a5fa'  },
    { name: '🟣 Azure STT', pct: 8,  barColor: 'linear-gradient(90deg,#0078d4,#005fa3)', textColor: '#93c5fd'  },
  ],
  tts: [
    { name: '🟠 ElevenLabs', pct: 68, barColor: 'linear-gradient(90deg,#f97316,#ef4444)', textColor: '#fb923c'  },
    { name: '🔵 Azure TTS',  pct: 32, barColor: 'linear-gradient(90deg,#0078d4,#005fa3)', textColor: '#93c5fd'  },
  ],
  nlu: [
    { name: '🟣 AwaazDe', pct: 87, barColor: 'linear-gradient(90deg,#8b5cf6,#6366f1)', textColor: '#c4b5fd'  },
    { name: '🔵 Gemini',  pct: 13, barColor: 'linear-gradient(90deg,#4285f4,#9c27b0)', textColor: '#93c5fd'  },
  ],
}

function ProviderBar({ name, pct, barColor, textColor }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="text-xs text-app-soft w-28 flex-shrink-0">{name}</span>
      <div className="flex-1 h-2 rounded bg-white/[0.06] overflow-hidden">
        <div className="h-full rounded" style={{ width: `${pct}%`, background: barColor }} />
      </div>
      <span className="text-xs font-semibold w-8 text-right" style={{ color: textColor }}>{pct}%</span>
    </div>
  )
}

export default function Home() {
  const topbar = (
    <>
      <span className="text-[15px] font-semibold text-app-text">Dashboard</span>
      <span className="text-xs text-app-muted ml-1">Agent Fleet Overview</span>
      <div className="flex-1" />
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-app-border bg-app-card text-xs text-app-muted">
        🔍 &nbsp;Search agents...
      </div>
      <div className="w-8 h-8 rounded-lg border border-app-border bg-app-card flex items-center justify-center text-sm cursor-pointer">🔔</div>
    </>
  )

  return (
    <AppLayout topbar={topbar}>
      <div className="h-full overflow-y-auto p-6">
        {/* Insight cards */}
        <div className="text-[11px] font-semibold text-app-muted uppercase tracking-wider mb-3.5">Fleet Insights</div>
        <div className="grid grid-cols-4 gap-3.5 mb-6">
          {insights.map(c => (
            <div key={c.label} className="bg-app-card border border-app-border rounded-xl p-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl" style={{ background: c.top }} />
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs text-app-soft font-medium">{c.label}</span>
                <span className="text-xl">{c.icon}</span>
              </div>
              <div className="text-[32px] font-bold leading-none mb-1.5" style={{ color: c.color }}>{c.val}</div>
              <div className="text-[11px] text-app-muted">{c.sub}</div>
              <div className="h-1 rounded bg-white/[0.07] mt-3">
                <div className="h-full rounded" style={{ width: c.barW, background: c.bar }} />
              </div>
            </div>
          ))}
        </div>

        {/* Provider breakdown + recent changes */}
        <div className="grid gap-3.5 mb-6" style={{ gridTemplateColumns: '1fr 320px' }}>
          {/* Provider distribution */}
          <div className="bg-app-card border border-app-border rounded-xl p-5">
            <div className="text-[13px] font-semibold text-app-text mb-4">Provider Distribution — All Agents</div>

            <div className="text-[11px] text-app-muted mb-3">STT Providers</div>
            {providers.stt.map(p => <ProviderBar key={p.name} {...p} />)}

            <div className="text-[11px] text-app-muted mb-3 mt-4">TTS Providers</div>
            {providers.tts.map(p => <ProviderBar key={p.name} {...p} />)}

            <div className="text-[11px] text-app-muted mb-3 mt-4">NLU Providers</div>
            {providers.nlu.map(p => <ProviderBar key={p.name} {...p} />)}
          </div>

          {/* Recent changes */}
          <div className="bg-app-card border border-app-border rounded-xl p-5">
            <div className="text-[13px] font-semibold text-app-text mb-4">Recent Changes</div>
            <div className="flex flex-col divide-y divide-app-border">
              {recentChanges.map((c, i) => (
                <div key={i} className="flex items-start gap-2.5 py-2.5 first:pt-0 last:pb-0">
                  <div className="w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ background: c.color }} />
                  <div>
                    <div className="text-xs text-app-soft leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: c.text.replace(/^(\S+ \S+)/, '<strong style="color:#e2e8f0">$1</strong>') }} />
                    <div className="text-[10px] text-app-muted mt-0.5">{c.time} · {c.user}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
