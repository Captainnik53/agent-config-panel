import { useState } from 'react'
import AppLayout from '../components/layout/AppLayout'
import AgentListPanel from '../components/agents/AgentListPanel'
import ConfigSection from '../components/ui/ConfigSection'
import Toggle from '../components/ui/Toggle'
import RadioPicker from '../components/ui/RadioPicker'
import ModelPicker from '../components/ui/ModelPicker'
import VoicePicker from '../components/ui/VoicePicker'
import { productionAgents, defaultProductionConfig } from '../data/mockData'

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

const DEEPGRAM_MODELS = ['nova-2', 'nova', 'enhanced', 'base']

function FieldGroup({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold text-app-soft uppercase tracking-wider">{label}</span>
      {hint && <span className="text-[10px] text-app-muted">{hint}</span>}
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
      style={{
        background: '#0e1428',
        border: '1px solid #243047',
        color: '#e2e8f0',
        ...style,
      }}
      onFocus={e => e.target.style.borderColor = '#6366f1'}
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
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  )
}

export default function ProductionConfig() {
  const [selectedId, setSelectedId] = useState(productionAgents[0].id)
  const [cfg, setCfg]               = useState(defaultProductionConfig)
  const [dirty, setDirty]           = useState(false)

  const agent = productionAgents.find(a => a.id === selectedId)

  function set(key, val) { setCfg(c => ({ ...c, [key]: val })); setDirty(true) }
  function toggle(key)   { set(key, !cfg[key]) }

  const topbar = (
    <>
      <nav className="flex items-center gap-1.5 text-[13px] text-app-muted">
        <span className="cursor-pointer hover:text-app-text">Dashboard</span>
        <span className="text-app-border2">›</span>
        <span className="cursor-pointer hover:text-app-text">Production</span>
        <span className="text-app-border2">›</span>
        <span className="text-app-text font-medium">Agent Configuration</span>
      </nav>
      <div className="flex-1" />
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-indigo-300"
        style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)' }}>
        <span style={{ fontSize: 7, color: '#6366f1' }}>●</span> ⚡ Production Environment
      </div>
    </>
  )

  return (
    <AppLayout topbar={topbar}>
      <div className="flex h-full overflow-hidden">
        <AgentListPanel
          agents={productionAgents}
          selectedId={selectedId}
          onSelect={id => { setSelectedId(id); setDirty(false) }}
        />

        {/* Config panel */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Agent header */}
          <div className="bg-app-card border border-app-border rounded-xl p-5 mb-4 flex items-center gap-4">
            <div className="w-11 h-11 rounded-[10px] flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.3),rgba(139,92,246,0.3))', border: '1px solid rgba(99,102,241,0.3)' }}>
              🤖
            </div>
            <div>
              <div className="text-[17px] font-semibold text-app-text mb-1">{agent?.name}</div>
              <div className="text-xs text-app-muted">
                <span className="text-app-soft mr-3">Template ID: {agent?.templateId}</span>
                <span className="text-app-soft mr-3">Agent ID: {agent?.id}</span>
                <span className="text-app-soft">Lang: {agent?.lang}</span>
              </div>
            </div>
            <div className="ml-auto flex gap-2">
              <button onClick={() => { setCfg(defaultProductionConfig); setDirty(false) }}
                className="px-3.5 py-2 rounded-lg border border-app-border2 text-[13px] text-app-soft hover:border-app-accent hover:text-indigo-300 transition-all">
                Reset
              </button>
              <button onClick={() => setDirty(false)}
                className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                💾 Save Changes
              </button>
            </div>
          </div>

          {/* Unsaved banner */}
          {dirty && (
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg mb-4 text-xs text-amber-300"
              style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}>
              <div className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
              You have unsaved changes — click Save Changes to apply to production.
            </div>
          )}

          {/* Template Level Config */}
          <ConfigSection icon="📋" title="Template Level Config" subtitle="Calling schedule, backup attempts, message windows" badge="TEMPLATE" badgeVariant="template">
            <div className="grid grid-cols-3 gap-4">
              <FieldGroup label="Calling Window Start" hint="Local time (IST)">
                <Input type="time" value={cfg.callingWindowStart} onChange={v => set('callingWindowStart', v)} />
              </FieldGroup>
              <FieldGroup label="Calling Window End" hint="Local time (IST)">
                <Input type="time" value={cfg.callingWindowEnd} onChange={v => set('callingWindowEnd', v)} />
              </FieldGroup>
              <FieldGroup label="Backup Attempts" hint="Max retries per lead">
                <Input type="number" value={cfg.backupAttempts} onChange={v => set('backupAttempts', v)} min={1} max={10} />
              </FieldGroup>
              <FieldGroup label="Message Start Time" hint="Call message begin">
                <Input type="time" value={cfg.messageStartTime} onChange={v => set('messageStartTime', v)} />
              </FieldGroup>
              <FieldGroup label="Message Stop Time" hint="Call message cutoff">
                <Input type="time" value={cfg.messageStopTime} onChange={v => set('messageStopTime', v)} />
              </FieldGroup>
              <FieldGroup label="Follow-up Duration (hrs)" hint="Gap between backup attempts">
                <Input type="number" value={cfg.followUpDuration} onChange={v => set('followUpDuration', v)} min={1} />
              </FieldGroup>
            </div>
          </ConfigSection>

          {/* Engine Providers */}
          <ConfigSection icon="⚙️" title="Engine Providers" subtitle="STT and TTS engine selection" badge="AGENT">
            <div className="flex flex-col gap-5">
              <RadioPicker
                label="STT Engine" hint="Speech-to-text provider"
                options={STT_OPTIONS} value={cfg.sttEngine}
                onChange={v => set('sttEngine', v)}
              />
              <RadioPicker
                label="TTS Engine" hint="Text-to-speech provider"
                options={TTS_OPTIONS} value={cfg.ttsEngine}
                onChange={v => set('ttsEngine', v)}
              />
              <FieldGroup label="Filler Audio Path" hint="Comma-separated .wav files played while agent processes">
                <Input value={cfg.fillerAudioPath} onChange={v => set('fillerAudioPath', v)} style={{ fontSize: 11 }} />
              </FieldGroup>
            </div>
          </ConfigSection>

          {/* Feature Toggles */}
          <ConfigSection icon="🎛️" title="Feature Toggles" subtitle="Enable/disable voice AI features per agent" badge="AGENT">
            {[
              { key: 'fillerAudio',    label: 'Filler Audio',               desc: 'Play ambient audio while agent is processing — reduces silence gaps'   },
              { key: 'detectVoiceMail',label: 'Detect Voice Mail',          desc: 'Automatically detect voicemail and skip/retry the call'                },
              { key: 'bargeIn',        label: 'Barge-In (TTS Interruption)',desc: 'Allow user speech to interrupt agent mid-sentence'                      },
              { key: 'openSocketTts',  label: 'Open Socket TTS',            desc: 'Use persistent WebSocket for lower TTS latency'                        },
              { key: 'utteranceEnd',   label: 'Utterance End Detection',    desc: 'Enable Deepgram utterance-end for more precise turn-taking'             },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between py-3 border-b border-app-border/50 last:border-0">
                <div>
                  <div className="text-[13px] font-medium text-app-text">{label}</div>
                  <div className="text-[11px] text-app-muted mt-0.5">{desc}</div>
                </div>
                <Toggle on={cfg[key]} onChange={() => toggle(key)} />
              </div>
            ))}
          </ConfigSection>

          {/* NLU Parameters */}
          <ConfigSection icon="🧠" title="NLU Parameters" subtitle="LLM model selection, agent identity, environment" badge="AGENT">
            <div className="mb-4">
              <FieldGroup label="LLM Model" hint="Underlying language model powering the NLU engine">
                <div className="mt-2">
                  <ModelPicker value={cfg.llmModel} onChange={v => set('llmModel', v)} />
                </div>
              </FieldGroup>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <FieldGroup label="NLU UUID">
                <Input value={cfg.nluUuid} onChange={v => set('nluUuid', v)} />
              </FieldGroup>
              <FieldGroup label="Agent ID">
                <Input value={cfg.agentId} onChange={v => set('agentId', v)} />
              </FieldGroup>
              <FieldGroup label="NLU Environment ID">
                <Input value={cfg.nluEnvId} onChange={v => set('nluEnvId', v)} placeholder="(empty = default)" />
              </FieldGroup>
            </div>
          </ConfigSection>

          {/* STT Parameters */}
          <ConfigSection icon="🎤" title="STT Parameters" subtitle="Deepgram model, endpointing, utterance detection" badge="AGENT">
            <div className="grid grid-cols-2 gap-4">
              <FieldGroup label="Deepgram Model">
                <Select value={cfg.deepgramModel} onChange={v => set('deepgramModel', v)} options={DEEPGRAM_MODELS} />
              </FieldGroup>
              <FieldGroup label="Utterance End MS">
                <Input type="number" value={cfg.utteranceEndMs} onChange={v => set('utteranceEndMs', v)} />
              </FieldGroup>
              <FieldGroup label="Endpointing MS">
                <Input type="number" value={cfg.endpointingMs} onChange={v => set('endpointingMs', v)} />
              </FieldGroup>
              <FieldGroup label="Auto Punctuation">
                <Select value={cfg.autoPunctuation} onChange={v => set('autoPunctuation', v)} options={['True', 'False']} />
              </FieldGroup>
            </div>
          </ConfigSection>

          {/* TTS Parameters */}
          <ConfigSection icon="🔊" title="TTS Parameters" subtitle="Voice selection, speed, stability, similarity" badge="AGENT">
            <div className="mb-4">
              <FieldGroup label="Voice" hint="Select the synthesised voice for this agent">
                <div className="mt-2">
                  <VoicePicker layout="grid" value={cfg.voice} onChange={v => set('voice', v)} />
                </div>
              </FieldGroup>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <FieldGroup label="Speed">
                <Input type="number" value={cfg.speed} onChange={v => set('speed', v)} step={0.1} min={0.5} max={2} />
              </FieldGroup>
              <FieldGroup label="Stability">
                <Input type="number" value={cfg.stability} onChange={v => set('stability', v)} step={0.1} min={0} max={1} />
              </FieldGroup>
              <FieldGroup label="Similarity Boost">
                <Input type="number" value={cfg.similarity} onChange={v => set('similarity', v)} step={0.1} min={0} max={1} />
              </FieldGroup>
            </div>
          </ConfigSection>
        </div>
      </div>
    </AppLayout>
  )
}
