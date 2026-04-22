import { useState, useEffect, useCallback } from 'react'
import AppLayout from '../components/layout/AppLayout'
import AgentListPanel from '../components/agents/AgentListPanel'
import ConfigSection from '../components/ui/ConfigSection'
import Toggle from '../components/ui/Toggle'
import RadioPicker from '../components/ui/RadioPicker'

const STT_OPTIONS = [
  { value: 'Deepgram',   label: 'Deepgram'   },
  { value: 'Navana',     label: 'Navana',     badge: 'New'  },
  { value: 'Google STT', label: 'Google STT' },
  { value: 'Azure STT',  label: 'Azure STT'  },
  { value: 'Sarvam',     label: 'Sarvam',     badge: 'Beta' },
]

const TTS_OPTIONS = [
  { value: 'ElevenLabs', label: 'ElevenLabs' },
  { value: 'Cartesia',   label: 'Cartesia',   badge: 'New'  },
  { value: 'Azure TTS',  label: 'Azure TTS'  },
  { value: 'Google TTS', label: 'Google TTS' },
  { value: 'Murf',       label: 'Murf',       badge: 'Beta' },
  { value: 'Sarvam',     label: 'Sarvam',     badge: 'Beta' },
]

const LANGUAGES = [
  { value: 'hi', label: 'hi — Hindi'   },
  { value: 'en', label: 'en — English' },
  { value: 'es', label: 'es — Español' },
  { value: 'tl', label: 'tl — Filipino'},
]

const DEEPGRAM_MODELS = ['nova-2', 'nova-3', 'nova', 'enhanced', 'base']

// ── small UI atoms ────────────────────────────────────────────────────────────

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
      value={value ?? ''}
      onChange={e => onChange(e.target.value)}
      className="rounded-lg px-3 py-2 text-sm outline-none transition-all"
      style={{ background: '#0e1428', border: '1px solid #243047', color: '#e2e8f0', ...style }}
      onFocus={e => { e.target.style.borderColor = '#f59e0b' }}
      onBlur={e => { e.target.style.borderColor = '#243047' }}
      {...rest}
    />
  )
}

function Select({ value, onChange, options }) {
  return (
    <select
      value={value ?? ''}
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
      <span onClick={onRemove} className="cursor-pointer text-[10px] hover:text-red-400" style={{ color: '#64748b' }}>✕</span>
    </span>
  )
}

// ── API helpers ───────────────────────────────────────────────────────────────

function apiToState(data) {
  return {
    name:            data.name            ?? '',
    schema:          data.schema          ?? '',
    language:        data.language        ?? 'en',
    environmentType: data.environment_type ?? 'demo',
    startupText:     data.startup_text    ?? '',
    enableTts:       data.enable_tts      ?? false,
    bargeIn:         data.barge_in_enabled ?? false,
    utteranceEnd:    data.enable_utterance_end ?? false,
    fillerAudio:     data.filler_audio    ?? false,
    openSocketTts:   data.open_socket_tts ?? false,
    sttEngine:       data.stt_engine      ?? 'Deepgram',
    ttsEngine:       data.tts_engine      ?? 'ElevenLabs',
    fillerAudioPath: data.filler_audio_path ?? '',
    deepgramModel:   data.deepgram_model  ?? 'nova-2',
    utteranceEndMs:  data.utterance_end_ms ?? '1000',
    endpointingMs:   data.endpointing_ms  ?? '',
    ttsVoice:        data.tts_voice       ?? '',
    nluModel:        data.nlu_model       ?? '',
    nluUuid:         data.nlu_uuid        ?? '',
    agentId:         data.agent_id        ?? '',
    environmentId:   data.environment_id  ?? '',
    assistantName:   data.assistant_name  ?? '',
    customerName:    data.customer_name   ?? '',
    clientName:      data.client_name     ?? '',
    loanAmount:      data.loan_amount     ?? '',
    year:            data.year            ?? '',
    month:           data.month           ?? '',
    dayOfMonth:      data.day_of_month    ?? '',
    emails:          data.emails          ?? [],
  }
}

function stateToApi(phoneNumber, cfg) {
  return {
    phone_number:       phoneNumber,
    name:               cfg.name,
    schema:             cfg.schema,
    language:           cfg.language,
    environment_type:   cfg.environmentType,
    startup_text:       cfg.startupText,
    enable_tts:         cfg.enableTts,
    barge_in_enabled:   cfg.bargeIn,
    enable_utterance_end: cfg.utteranceEnd,
    filler_audio:       cfg.fillerAudio,
    open_socket_tts:    cfg.openSocketTts,
    stt_engine:         cfg.sttEngine,
    tts_engine:         cfg.ttsEngine,
    filler_audio_path:  cfg.fillerAudioPath,
    deepgram_model:     cfg.deepgramModel,
    utterance_end_ms:   cfg.utteranceEndMs,
    endpointing_ms:     cfg.endpointingMs,
    tts_voice:          cfg.ttsVoice,
    nlu_model:          cfg.nluModel,
    nlu_uuid:           cfg.nluUuid,
    agent_id:           cfg.agentId,
    environment_id:     cfg.environmentId,
    assistant_name:     cfg.assistantName,
    customer_name:      cfg.customerName,
    client_name:        cfg.clientName,
    loan_amount:        cfg.loanAmount,
    year:               cfg.year,
    month:              cfg.month,
    day_of_month:       cfg.dayOfMonth,
    emails:             cfg.emails,
  }
}

const EMPTY_CFG = apiToState({})

// ── main component ────────────────────────────────────────────────────────────

export default function StagingConfig() {
  const [agents, setAgents]         = useState([])
  const [selectedPhone, setSelectedPhone] = useState(null)
  const [cfg, setCfg]               = useState(EMPTY_CFG)
  const [dirty, setDirty]           = useState(false)
  const [loading, setLoading]       = useState(true)
  const [saving, setSaving]         = useState(false)
  const [error, setError]           = useState(null)
  const [saveMsg, setSaveMsg]       = useState(null)

  // ── load agent list ──
  useEffect(() => {
    setLoading(true)
    fetch('/api/staging/agents/')
      .then(r => r.json())
      .then(data => {
        setAgents(data)
        if (data.length > 0) setSelectedPhone(data[0].phone_number)
        setLoading(false)
      })
      .catch(e => {
        setError('Could not reach backend: ' + e.message)
        setLoading(false)
      })
  }, [])

  // ── load selected agent config ──
  const loadAgent = useCallback((phone) => {
    setLoading(true)
    setError(null)
    fetch(`/api/staging/agents/${phone}/`)
      .then(r => {
        if (!r.ok) return r.json().then(e => Promise.reject(e.error))
        return r.json()
      })
      .then(data => {
        setCfg(apiToState(data))
        setDirty(false)
        setLoading(false)
      })
      .catch(e => {
        setError(String(e))
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (selectedPhone) loadAgent(selectedPhone)
  }, [selectedPhone, loadAgent])

  function set(key, val) { setCfg(c => ({ ...c, [key]: val })); setDirty(true) }
  function toggle(key)   { set(key, !cfg[key]) }
  function removeEmail(email) { set('emails', cfg.emails.filter(e => e !== email)) }

  async function handleSave() {
    if (!selectedPhone) return
    setSaving(true)
    setSaveMsg(null)
    try {
      const res = await fetch(`/api/staging/agents/${selectedPhone}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stateToApi(selectedPhone, cfg)),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')
      setCfg(apiToState(data))
      setDirty(false)
      setSaveMsg('Saved successfully')
      setTimeout(() => setSaveMsg(null), 3000)
      // refresh list (name/stt/tts might have changed)
      fetch('/api/staging/agents/').then(r => r.json()).then(setAgents)
    } catch (e) {
      setSaveMsg('Error: ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  const selectedAgent = agents.find(a => a.phone_number === selectedPhone)

  // ── adapt agent list to AgentListPanel format ──
  const listAgents = agents.map(a => ({
    id:     a.phone_number,
    name:   a.name,
    schema: a.schema,
    stt:    a.stt,
    tts:    a.tts,
    lang:   a.language,
    status: a.status || 'active',
  }))

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
          agents={listAgents}
          selectedId={selectedPhone}
          onSelect={phone => setSelectedPhone(phone)}
          isStaging
          headerRight={
            <span className="text-[11px] text-app-muted">{agents.length} agents</span>
          }
        />

        <div className="flex-1 overflow-y-auto p-6">

          {/* Global error banner */}
          {error && (
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg mb-4 text-xs text-red-300"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
              ⚠ {error}
            </div>
          )}

          {loading && !selectedAgent && (
            <div className="text-sm text-app-muted text-center mt-20">Loading agents…</div>
          )}

          {selectedAgent && (
            <>
              {/* Agent header */}
              <div className="bg-app-card border border-app-border rounded-xl p-5 mb-4 flex items-start gap-4"
                style={{ borderTop: '3px solid #f59e0b' }}>
                <div className="w-11 h-11 rounded-[10px] flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,rgba(245,158,11,0.25),rgba(249,115,22,0.2))', border: '1px solid rgba(245,158,11,0.3)' }}>
                  🧪
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[17px] font-semibold text-app-text mb-1">{cfg.name || selectedAgent.name}</div>
                  <div className="text-xs text-app-muted">
                    <span className="text-app-soft mr-3">📞 {selectedPhone}</span>
                    <span className="text-app-soft mr-3">Schema: {cfg.schema}</span>
                    <span className="text-app-soft">Lang: {cfg.language}</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => loadAgent(selectedPhone)}
                    className="px-3.5 py-2 rounded-lg border border-app-border2 text-[13px] text-app-soft hover:text-app-text transition-all">
                    Reset
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 rounded-lg text-[13px] font-semibold transition-all hover:opacity-90 disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg,#f59e0b,#f97316)', color: '#000' }}>
                    {saving ? '⏳ Saving…' : '💾 Save'}
                  </button>
                </div>
              </div>

              {/* Unsaved / save result banner */}
              {saveMsg && (
                <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg mb-4 text-xs
                  ${saveMsg.startsWith('Error') ? 'text-red-300' : 'text-green-300'}`}
                  style={{
                    background: saveMsg.startsWith('Error') ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.08)',
                    border:     saveMsg.startsWith('Error') ? '1px solid rgba(239,68,68,0.25)' : '1px solid rgba(16,185,129,0.25)',
                  }}>
                  {saveMsg.startsWith('Error') ? '⚠' : '✓'} {saveMsg}
                </div>
              )}
              {dirty && !saveMsg && (
                <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg mb-4 text-xs text-amber-300"
                  style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  🧪 <span><strong>Unsaved changes</strong> — click Save to write to the remote server.</span>
                </div>
              )}

              {/* ── Identity & Basic Config ─────────────────────────── */}
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
                    <Select value={cfg.environmentType} onChange={v => set('environmentType', v)}
                      options={['demo', 'staging', 'production']} />
                  </FieldGroup>
                  <FieldGroup label="Startup Text" hint="First utterance when call connects">
                    <Input value={cfg.startupText} onChange={v => set('startupText', v)} />
                  </FieldGroup>
                </div>
              </ConfigSection>

              {/* ── Feature Toggles ─────────────────────────────────── */}
              <ConfigSection icon="🎛️" title="Feature Toggles" subtitle="Enable/disable voice pipeline features" badge="AGENT">
                <div className="grid grid-cols-2 gap-0">
                  {[
                    { key: 'enableTts',    label: 'Enable TTS',              desc: 'Text-to-speech synthesis'       },
                    { key: 'bargeIn',      label: 'Barge-In Enabled',        desc: 'User can interrupt agent speech' },
                    { key: 'utteranceEnd', label: 'Utterance End Detection', desc: 'Deepgram end-of-speech events'   },
                    { key: 'fillerAudio',  label: 'Filler Audio',            desc: 'Play audio while processing'     },
                    { key: 'openSocketTts',label: 'Open Socket TTS',         desc: 'Persistent WS for low latency'   },
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

              {/* ── Engine Providers ────────────────────────────────── */}
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
                  <FieldGroup label="Filler Audio Path" hint=".wav filename on the remote server">
                    <Input value={cfg.fillerAudioPath} onChange={v => set('fillerAudioPath', v)} style={{ fontSize: 11 }} />
                  </FieldGroup>
                </div>
              </ConfigSection>

              {/* ── NLU Context Parameters ──────────────────────────── */}
              <ConfigSection icon="🧠" title="NLU Context Parameters" subtitle="Model, agent IDs, persona, loan variables" badge="AGENT">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <FieldGroup label="NLU Model" hint="e.g. Open AI (Fine tuned), GDF, Azure (Base model)">
                    <Input value={cfg.nluModel} onChange={v => set('nluModel', v)} />
                  </FieldGroup>
                  <FieldGroup label="NLU UUID">
                    <Input value={cfg.nluUuid} onChange={v => set('nluUuid', v)} />
                  </FieldGroup>
                  <FieldGroup label="Agent ID">
                    <Input value={cfg.agentId} onChange={v => set('agentId', v)} />
                  </FieldGroup>
                  <FieldGroup label="Environment ID" hint="Leave empty for default">
                    <Input value={cfg.environmentId} onChange={v => set('environmentId', v)} placeholder="(empty = default)" />
                  </FieldGroup>
                  <FieldGroup label="Assistant Name">
                    <Input value={cfg.assistantName} onChange={v => set('assistantName', v)} />
                  </FieldGroup>
                  <FieldGroup label="Customer Name">
                    <Input value={cfg.customerName} onChange={v => set('customerName', v)} />
                  </FieldGroup>
                </div>
                <div className="border-t border-app-border pt-4">
                  <div className="text-[11px] text-app-muted uppercase tracking-wider mb-3">Client & Loan Context</div>
                  <div className="grid grid-cols-3 gap-4">
                    <FieldGroup label="Client Name">
                      <Input value={cfg.clientName} onChange={v => set('clientName', v)} />
                    </FieldGroup>
                    <FieldGroup label="Loan Amount">
                      <Input value={cfg.loanAmount} onChange={v => set('loanAmount', v)} />
                    </FieldGroup>
                    <FieldGroup label="Year">
                      <Input value={cfg.year} onChange={v => set('year', v)} />
                    </FieldGroup>
                    <FieldGroup label="Month">
                      <Input value={cfg.month} onChange={v => set('month', v)} />
                    </FieldGroup>
                    <FieldGroup label="Day of Month">
                      <Input value={cfg.dayOfMonth} onChange={v => set('dayOfMonth', v)} />
                    </FieldGroup>
                  </div>
                </div>
              </ConfigSection>

              {/* ── STT + TTS side by side ──────────────────────────── */}
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
                      <select value={cfg.deepgramModel} onChange={e => set('deepgramModel', e.target.value)}
                        className="rounded-lg px-3 py-2 text-sm outline-none cursor-pointer"
                        style={{ background: '#0e1428', border: '1px solid #243047', color: '#e2e8f0' }}>
                        {DEEPGRAM_MODELS.map(m => <option key={m}>{m}</option>)}
                      </select>
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
                    <FieldGroup label="Voice ID" hint="ElevenLabs voice ID, Google voice name, etc.">
                      <Input
                        value={cfg.ttsVoice}
                        onChange={v => set('ttsVoice', v)}
                        placeholder="e.g. mActWQg9kibLro6Z2ouY"
                        style={{ fontFamily: 'monospace', fontSize: 11 }}
                      />
                    </FieldGroup>
                  </div>
                </div>
              </div>

              {/* ── Notification Emails ─────────────────────────────── */}
              <ConfigSection icon="📧" title="Notification Emails" subtitle="Alert recipients for this agent" badge="STAGING" badgeVariant="staging">
                <div className="flex flex-wrap gap-2 min-h-[44px] p-2 rounded-lg"
                  style={{ background: '#0e1428', border: '1px solid #243047' }}>
                  {cfg.emails.map(email => (
                    <EmailChip key={email} email={email} onRemove={() => removeEmail(email)} />
                  ))}
                  <input
                    type="text"
                    placeholder="+ add email, press Enter"
                    className="bg-transparent text-xs outline-none min-w-[160px] px-1"
                    style={{ color: '#94a3b8' }}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        set('emails', [...cfg.emails, e.target.value.trim()])
                        e.target.value = ''
                      }
                    }}
                  />
                </div>
              </ConfigSection>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
