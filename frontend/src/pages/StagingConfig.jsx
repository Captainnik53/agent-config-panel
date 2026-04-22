import { useState } from 'react'
import AppLayout from '../components/layout/AppLayout'
import AgentListPanel from '../components/agents/AgentListPanel'
import ConfigSection from '../components/ui/ConfigSection'
import Toggle from '../components/ui/Toggle'
import RadioPicker from '../components/ui/RadioPicker'
import ModelPicker from '../components/ui/ModelPicker'
import VoicePicker from '../components/ui/VoicePicker'
import { stagingAgents, defaultStagingConfig } from '../data/mockData'

const STT_OPTIONS = [
  { value: 'Deepgram',   label: 'Deepgram'   },
  { value: 'Navana',     label: 'Navana',     badge: 'New'  },
  { value: 'Google STT', label: 'Google STT' },
  { value: 'Azure STT',  label: 'Azure STT'  },
  { value: 'Sarvam',     label: 'Sarvam',     badge: 'Beta' },
]

const TTS_OPTIONS = [
  { value: 'ElevenLabs', label: 'ElevenLabs' },
  { value: 'Azure TTS',  label: 'Azure TTS'  },
  { value: 'Google TTS', label: 'Google TTS' },
  { value: 'Murf',       label: 'Murf',       badge: 'Beta' },
  { value: 'Sarvam',     label: 'Sarvam',     badge: 'New'  },
]

const LANGUAGES = [
  { value: 'es', label: 'es — Español'  },
  { value: 'hi', label: 'hi — Hindi'    },
  { value: 'en', label: 'en — English'  },
  { value: 'tl', label: 'tl — Filipino' },
]

const DEEPGRAM_MODELS = ['nova-2', 'nova', 'enhanced', 'base']

function FieldGroup({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#94a3b8' }}>{label}</span>
      {hint && <span className="text-[10px]" style={{ color: '#64748b' }}>{hint}</span>}
      {children}
    </div>
  )
}

function Input({ type = 'text', value, onChange, style, ...rest }) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="rounded-lg px-3 py-2 text-sm outline-none transition-all"
      style={{ background: '#0e1428', border: '1px solid #243047', color: '#e2e8f0', ...style }}
      onFocus={e => e.target.style.borderColor = '#f59e0b'}
      onBlur={e => e.target.style.borderColor = '#243047'}
      {...rest}
    />
  )
}

function Select({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="rounded-lg px-3 py-2 text-sm outline-none cursor-pointer"
      style={{ background: '#0e1428', border: '1px solid #243047', color: '#e2e8f0' }}
    >
      {options.map(o => (
        <option key={typeof o === 'string' ? o : o.value} value={typeof o === 'string' ? o : o.value}>
          {typeof o === 'string' ? o : o.label}
        </option>
      ))}
    </select>
  )
}

function EmailChip({ email, onRemove }) {
  return (
    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px]"
      style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', color: '#a5b4fc' }}>
      {email}
      <span onClick={onRemove} className="cursor-pointer text-[10px]" style={{ color: '#64748b' }}>✕</span>
    </span>
  )
}

export default function StagingConfig() {
  const [selectedId, setSelectedId] = useState(stagingAgents[0].id)
  const [cfg, setCfg]               = useState(defaultStagingConfig)

  const agent = stagingAgents.find(a => a.id === selectedId)

  function set(key, val) { setCfg(c => ({ ...c, [key]: val })) }
  function toggle(key)   { set(key, !cfg[key]) }
  function removeEmail(email) { set('emails', cfg.emails.filter(e => e !== email)) }

  const topbar = (
    <>
      <nav className="flex items-center gap-1.5 text-[13px] text-app-muted">
        <span className="cursor-pointer hover:text-app-text">Dashboard</span>
        <span className="text-app-border2">›</span>
        <span className="cursor-pointer hover:text-app-text">Staging</span>
        <span className="text-app-border2">›</span>
        <span className="text-app-text font-medium">Agent Configuration</span>
      </nav>
      <div className="flex-1" />
      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-indigo-300 transition-all hover:bg-indigo-500/10"
        style={{ border: '1px solid rgba(99,102,241,0.3)' }}>
        ↗ Promote to Prod
      </button>
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-amber-300"
        style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)' }}>
        <span style={{ fontSize: 7, color: '#f59e0b' }}>●</span> 🧪 Staging Environment
      </div>
    </>
  )

  return (
    <AppLayout topbar={topbar}>
      <div className="flex h-full overflow-hidden">
        <AgentListPanel
          agents={stagingAgents}
          selectedId={selectedId}
          onSelect={setSelectedId}
          isStaging
          headerRight={
            <button className="text-[11px] px-2 py-0.5 rounded text-amber-300 cursor-pointer"
              style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)' }}>
              + New
            </button>
          }
        />

        {/* Config panel */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Agent header */}
          <div className="bg-app-card border border-app-border rounded-xl p-5 mb-4 flex items-start gap-4"
            style={{ borderTop: '3px solid #f59e0b' }}>
            <div className="w-11 h-11 rounded-[10px] flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,rgba(245,158,11,0.25),rgba(249,115,22,0.2))', border: '1px solid rgba(245,158,11,0.3)' }}>
              🧪
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[17px] font-semibold text-app-text mb-1">{agent?.name ?? cfg.name}</div>
              <div className="text-xs text-app-muted mb-2">
                <span className="text-app-soft mr-3">Schema: {agent?.schema}</span>
                <span className="text-app-soft mr-3">Env: staging</span>
                <span className="text-app-soft">Lang: {cfg.language}</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {[agent?.stt, agent?.tts, 'AwaazDe NLU', 'Barge-in ON'].map(b => b && (
                  <span key={b} className="text-[11px] px-2 py-0.5 rounded bg-teal-500/10 text-teal-300">{b}</span>
                ))}
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button className="px-3.5 py-2 rounded-lg border border-app-border2 text-[13px] text-app-soft hover:text-app-text transition-all">
                Reset
              </button>
              <button className="px-3.5 py-2 rounded-lg border text-[13px] text-indigo-300 transition-all hover:bg-indigo-500/10"
                style={{ border: '1px solid rgba(99,102,241,0.4)' }}>
                ↗ Clone to Prod
              </button>
              <button className="px-4 py-2 rounded-lg text-[13px] font-semibold transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg,#f59e0b,#f97316)', color: '#000' }}>
                💾 Save
              </button>
            </div>
          </div>

          {/* Staging warning */}
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg mb-4 text-xs text-amber-300"
            style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
            🧪 <span><strong>Staging environment</strong> — changes here do not affect production. Use "Promote to Prod" to push config upstream.</span>
          </div>

          {/* Identity & Basic Config */}
          <ConfigSection icon="🏷️" title="Identity & Basic Config" subtitle="Name, language, startup text, schema" badge="STAGING" badgeVariant="staging">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <FieldGroup label="Agent Name">
                <Input value={cfg.name} onChange={v => set('name', v)} />
              </FieldGroup>
              <FieldGroup label="Schema Name">
                <Input value={cfg.schema} onChange={v => set('schema', v)} style={{ fontFamily: 'monospace' }} />
              </FieldGroup>
              <FieldGroup label="Language Code">
                <Select value={cfg.language} onChange={v => set('language', v)} options={LANGUAGES} />
              </FieldGroup>
              <FieldGroup label="Environment Type">
                <Select value={cfg.environmentType} onChange={v => set('environmentType', v)} options={['staging', 'production']} />
              </FieldGroup>
              <FieldGroup label="Startup Text" hint="First utterance from agent when call connects">
                <Input value={cfg.startupText} onChange={v => set('startupText', v)} />
              </FieldGroup>
            </div>
          </ConfigSection>

          {/* Feature Toggles */}
          <ConfigSection icon="🎛️" title="Feature Toggles" subtitle="Enable/disable voice pipeline features" badge="AGENT">
            <div className="grid grid-cols-2 gap-0">
              {[
                { key: 'enableTts',      label: 'Enable TTS',              desc: 'Text-to-speech synthesis'           },
                { key: 'bargeIn',        label: 'Barge-In Enabled',        desc: 'User can interrupt agent speech'    },
                { key: 'utteranceEnd',   label: 'Utterance End Detection', desc: 'Deepgram end-of-speech events'      },
                { key: 'fillerAudio',    label: 'Filler Audio',            desc: 'Play audio while processing'        },
                { key: 'openSocketTts',  label: 'Open Socket TTS',         desc: 'Persistent WS for low latency'      },
                { key: 'autoPunctuation',label: 'Auto Punctuation',        desc: 'Deepgram auto punctuation'          },
              ].map(({ key, label, desc }, i) => (
                <div key={key}
                  className={`flex items-center justify-between py-3 border-b border-app-border/50
                    ${i % 2 === 0 ? 'pr-5' : 'pl-5 border-l border-app-border/50'}`}>
                  <div>
                    <div className="text-[13px] font-medium text-app-text">{label}</div>
                    <div className="text-[11px] text-app-muted mt-0.5">{desc}</div>
                  </div>
                  <Toggle on={cfg[key]} onChange={() => toggle(key)} />
                </div>
              ))}
            </div>
          </ConfigSection>

          {/* Engine Providers */}
          <ConfigSection icon="🔌" title="Engine Providers" subtitle="STT and TTS engine selection" badge="AGENT">
            <div className="flex flex-col gap-5">
              <RadioPicker
                label="STT Engine" hint="Speech-to-text provider"
                options={STT_OPTIONS} value={cfg.sttEngine}
                onChange={v => set('sttEngine', v)}
                accentClass="border-app-amber bg-app-amber/10"
              />
              <RadioPicker
                label="TTS Engine" hint="Text-to-speech provider"
                options={TTS_OPTIONS} value={cfg.ttsEngine}
                onChange={v => set('ttsEngine', v)}
                accentClass="border-app-amber bg-app-amber/10"
              />
              <FieldGroup label="Filler Audio Path" hint="Comma-separated .wav filenames">
                <Input value={cfg.fillerAudioPath} onChange={v => set('fillerAudioPath', v)} style={{ fontSize: 11 }} />
              </FieldGroup>
            </div>
          </ConfigSection>

          {/* NLU Context Parameters */}
          <ConfigSection icon="🧠" title="NLU Context Parameters" subtitle="LLM model, agent persona, client context, loan variables" badge="AGENT">
            <div className="mb-4">
              <FieldGroup label="LLM Model" hint="Underlying language model powering the NLU engine">
                <div className="mt-2">
                  <ModelPicker
                    value={cfg.llmModel}
                    onChange={v => set('llmModel', v)}
                    selectedTextColor="text-amber-300"
                    selectedBg="border-app-amber bg-app-amber/10"
                  />
                </div>
              </FieldGroup>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <FieldGroup label="NLU UUID"><Input value={cfg.nluUuid} onChange={v => set('nluUuid', v)} /></FieldGroup>
              <FieldGroup label="Agent ID"><Input value={cfg.agentId} onChange={v => set('agentId', v)} /></FieldGroup>
              <FieldGroup label="Environment ID">
                <Select value={cfg.environmentId} onChange={v => set('environmentId', v)} options={['staging', 'production']} />
              </FieldGroup>
              <FieldGroup label="Assistant Name"><Input value={cfg.assistantName} onChange={v => set('assistantName', v)} /></FieldGroup>
              <FieldGroup label="Customer Name"><Input value={cfg.customerName} onChange={v => set('customerName', v)} /></FieldGroup>
            </div>
            <div className="border-t border-app-border pt-4">
              <div className="text-[11px] text-app-muted uppercase tracking-wider mb-3">Client & Loan Context</div>
              <div className="grid grid-cols-3 gap-4">
                <FieldGroup label="Client Name"><Input value={cfg.clientName} onChange={v => set('clientName', v)} /></FieldGroup>
                <FieldGroup label="Organization"><Input value={cfg.organization} onChange={v => set('organization', v)} /></FieldGroup>
                <FieldGroup label="Loan Amount"><Input type="number" value={cfg.loanAmount} onChange={v => set('loanAmount', v)} /></FieldGroup>
                <FieldGroup label="Year"><Input type="number" value={cfg.year} onChange={v => set('year', v)} /></FieldGroup>
                <FieldGroup label="Month"><Input value={cfg.month} onChange={v => set('month', v)} /></FieldGroup>
                <FieldGroup label="Day of Month"><Input type="number" value={cfg.dayOfMonth} onChange={v => set('dayOfMonth', v)} /></FieldGroup>
              </div>
            </div>
          </ConfigSection>

          {/* STT + TTS side by side */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* STT Params */}
            <div className="bg-app-card border border-app-border rounded-xl overflow-hidden">
              <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-app-border">
                <span className="text-base">🎤</span>
                <span className="text-[13px] font-semibold text-app-text flex-1">STT Params</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">STT</span>
              </div>
              <div className="p-5 flex flex-col gap-3">
                <FieldGroup label="Deepgram Model">
                  <Select value={cfg.deepgramModel} onChange={v => set('deepgramModel', v)} options={DEEPGRAM_MODELS} />
                </FieldGroup>
                <FieldGroup label="Utterance End MS">
                  <Input type="number" value={cfg.utteranceEndMs} onChange={v => set('utteranceEndMs', v)} />
                </FieldGroup>
                <FieldGroup label="Endpointing MS">
                  <Input type="number" value={cfg.endpointingMs} onChange={v => set('endpointingMs', v)} />
                </FieldGroup>
              </div>
            </div>

            {/* TTS Params */}
            <div className="bg-app-card border border-app-border rounded-xl overflow-hidden">
              <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-app-border">
                <span className="text-base">🔊</span>
                <span className="text-[13px] font-semibold text-app-text flex-1">TTS Params</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">TTS</span>
              </div>
              <div className="p-5 flex flex-col gap-3">
                <FieldGroup label="Voice" hint="Synthesised voice for this agent">
                  <div className="mt-1">
                    <VoicePicker
                      layout="list" value={cfg.voice} onChange={v => set('voice', v)}
                      selectedBg="border-app-amber bg-app-amber/10"
                      selectedText="text-amber-300"
                    />
                  </div>
                </FieldGroup>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  <FieldGroup label="Speed"><Input type="number" value={cfg.speed} onChange={v => set('speed', v)} step={0.1} /></FieldGroup>
                  <FieldGroup label="Stability"><Input type="number" value={cfg.stability} onChange={v => set('stability', v)} step={0.1} /></FieldGroup>
                  <FieldGroup label="Similarity"><Input type="number" value={cfg.similarity} onChange={v => set('similarity', v)} step={0.1} /></FieldGroup>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Emails */}
          <ConfigSection icon="📧" title="Notification Emails" subtitle="Alert recipients for this agent" badge="STAGING" badgeVariant="staging">
            <div className="flex flex-wrap gap-2 min-h-[44px] p-2 rounded-lg"
              style={{ background: '#0e1428', border: '1px solid #243047' }}>
              {cfg.emails.map(email => (
                <EmailChip key={email} email={email} onRemove={() => removeEmail(email)} />
              ))}
              <input
                type="text"
                placeholder="+ add email..."
                className="bg-transparent text-xs outline-none min-w-[120px] px-1"
                style={{ color: '#94a3b8' }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && e.target.value) {
                    set('emails', [...cfg.emails, e.target.value])
                    e.target.value = ''
                  }
                }}
              />
            </div>
          </ConfigSection>
        </div>
      </div>
    </AppLayout>
  )
}
