import { useState } from 'react'

function StatusTag({ status }) {
  return status === 'live' || status === 'active'
    ? <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-400">Live</span>
    : <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400">Paused</span>
}

function ProviderTag({ label }) {
  const styles = {
    Deepgram:    'bg-teal-500/10 text-teal-300',
    'Google STT':'bg-blue-500/10 text-blue-300',
    'Azure STT': 'bg-blue-400/10 text-blue-300',
    ElevenLabs:  'bg-orange-500/10 text-orange-300',
    Navana:      'bg-green-500/10 text-green-300',
    Gemini:      'bg-indigo-500/10 text-indigo-300',
    AwaazDe:     'bg-purple-500/10 text-purple-300',
  }
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded ${styles[label] ?? 'bg-slate-500/10 text-slate-300'}`}>
      {label}
    </span>
  )
}

export default function AgentListPanel({ agents, selectedId, onSelect, isStaging = false, headerRight }) {
  const [search, setSearch] = useState('')

  const filtered = agents.filter(a => a.name.toLowerCase().includes(search.toLowerCase()))

  const borderAccent = isStaging ? 'border-app-amber' : 'border-app-accent'
  const bgAccent     = isStaging ? 'bg-app-amber/10' : 'bg-app-accent/10'
  const hoverBg      = isStaging ? 'hover:bg-amber-500/[0.04]' : 'hover:bg-app-accent/[0.06]'

  return (
    <div className="w-[280px] flex-shrink-0 bg-app-panel border-r border-app-border flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-app-border">
        <span className="text-xs font-semibold text-app-text">
          {isStaging ? 'Staging Agents' : 'Production Agents'}
        </span>
        {headerRight ?? (
          <span className="text-[11px] text-app-muted">{agents.length} total</span>
        )}
      </div>

      <div className="mx-3 my-2.5">
        <input
          type="text"
          placeholder="🔍  Search agents..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-app-card border border-app-border2 rounded-md px-2.5 py-1.5 text-xs text-app-text outline-none focus:border-app-accent"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.map(agent => {
          const selected = agent.id === selectedId
          return (
            <div
              key={agent.id}
              onClick={() => onSelect(agent.id)}
              className={`px-3.5 py-3 border-b border-app-border/50 cursor-pointer transition-colors
                ${selected ? `${bgAccent} border-l-[3px] ${borderAccent} pl-[11px]` : `${hoverBg}`}`}
            >
              <div className="text-[13px] font-medium text-app-text mb-1.5">{agent.name}</div>
              {agent.schema && (
                <div className="text-[10px] text-app-muted font-mono mb-1.5">schema: {agent.schema}</div>
              )}
              <div className="flex gap-1.5 flex-wrap">
                <ProviderTag label={agent.stt} />
                <ProviderTag label={agent.tts} />
                {agent.nlu && agent.nlu !== 'AwaazDe' && <ProviderTag label={agent.nlu} />}
                {agent.lang && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-300">{agent.lang}</span>
                )}
                <StatusTag status={agent.status} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
