export const productionAgents = [
  { id: 'agent_0042', name: 'Tala Pre-due DPD-7',   stt: 'Deepgram',   tts: 'ElevenLabs', status: 'live',   templateId: 'tpl_tala_predpd', lang: 'es' },
  { id: 'agent_0031', name: 'BFL DPD-30 Agent',      stt: 'Deepgram',   tts: 'ElevenLabs', status: 'live',   templateId: 'tpl_bfl_30',     lang: 'hi' },
  { id: 'agent_0027', name: 'HDFC Collections 7',    stt: 'Deepgram',   tts: 'ElevenLabs', status: 'live',   templateId: 'tpl_hdfc_7',     lang: 'hi' },
  { id: 'agent_0019', name: 'CreditBee DPD-60',      stt: 'Google STT', tts: 'ElevenLabs', status: 'paused', templateId: 'tpl_cb_60',      lang: 'hi' },
  { id: 'agent_0015', name: 'Moneyview Reminder',    stt: 'Deepgram',   tts: 'ElevenLabs', status: 'live',   templateId: 'tpl_mv_rem',     lang: 'hi' },
  { id: 'agent_0012', name: 'KreditBee NTC',         stt: 'Azure STT',  tts: 'ElevenLabs', status: 'live',   templateId: 'tpl_kb_ntc',     lang: 'hi' },
  { id: 'agent_0009', name: 'Muthoot Finance',       stt: 'Deepgram',   tts: 'ElevenLabs', status: 'live',   templateId: 'tpl_muthoot',    lang: 'hi' },
  { id: 'agent_0006', name: 'IDFC DPD-14',           stt: 'Deepgram',   tts: 'ElevenLabs', status: 'live',   templateId: 'tpl_idfc_14',    lang: 'hi' },
]

export const stagingAgents = [
  { id: 'stg_0001', name: 'Tala Pre-due DPD-7', schema: 'ad_abcdef', stt: 'Deepgram',   tts: 'ElevenLabs', nlu: 'AwaazDe', status: 'active', lang: 'es' },
  { id: 'stg_0002', name: 'BFL Stage Agent',     schema: 'ad_bflstg', stt: 'Deepgram',   tts: 'ElevenLabs', nlu: 'AwaazDe', status: 'active', lang: 'hi' },
  { id: 'stg_0003', name: 'HDFC Test v2',        schema: 'ad_hdfc02', stt: 'Google STT', tts: 'ElevenLabs', nlu: 'AwaazDe', status: 'paused', lang: 'hi' },
  { id: 'stg_0004', name: 'CreditBee Gemini',    schema: 'ad_cb_gem', stt: 'Deepgram',   tts: 'ElevenLabs', nlu: 'Gemini',  status: 'active', lang: 'en' },
  { id: 'stg_0005', name: 'Moneyview Stage',     schema: 'ad_mvstg',  stt: 'Deepgram',   tts: 'ElevenLabs', nlu: 'AwaazDe', status: 'paused', lang: 'hi' },
]

export const defaultProductionConfig = {
  // Template level
  callingWindowStart: '09:00',
  callingWindowEnd:   '20:00',
  backupAttempts:     3,
  messageStartTime:   '09:30',
  messageStopTime:    '19:30',
  followUpDuration:   24,
  // Engine
  sttEngine:        'Deepgram',
  ttsEngine:        'ElevenLabs',
  fillerAudioPath:  'edited_page-turning-66432.wav, edited_a-small-library-in-korea-17716.wav',
  // Toggles
  fillerAudio:      true,
  detectVoiceMail:  true,
  bargeIn:          true,
  openSocketTts:    true,
  utteranceEnd:     true,
  // NLU
  llmModel:    'gemini-flash-2',
  nluUuid:     '12',
  agentId:     '27',
  nluEnvId:    '',
  // STT params
  deepgramModel: 'nova-2',
  utteranceEndMs: 1000,
  endpointingMs:  1000,
  autoPunctuation: 'True',
  // TTS params
  voice:       'Maria',
  speed:       1,
  stability:   0.5,
  similarity:  0.9,
}

export const defaultStagingConfig = {
  name:            'Tala Pre due loan DPD-7',
  schema:          'ad_abcdef',
  language:        'es',
  environmentType: 'staging',
  startupText:     'hola?',
  // Toggles
  enableTts:       true,
  bargeIn:         true,
  utteranceEnd:    true,
  fillerAudio:     true,
  openSocketTts:   true,
  autoPunctuation: true,
  // Engine
  sttEngine:       'Deepgram',
  ttsEngine:       'ElevenLabs',
  fillerAudioPath: 'edited_page-turning-66432.wav, edited_a-small-library-in-korea-17716.wav',
  // NLU
  llmModel:        'gemini-flash-2',
  nluUuid:         '8',
  agentId:         '40',
  environmentId:   'staging',
  assistantName:   'Maria',
  customerName:    'Sophie Farah',
  clientName:      'Tala',
  organization:    'Tala',
  loanAmount:      2250,
  year:            2026,
  month:           'April',
  dayOfMonth:      2,
  // STT params
  deepgramModel:   'nova-2',
  utteranceEndMs:  1000,
  endpointingMs:   1000,
  // TTS params
  voice:           'Maria',
  speed:           1,
  stability:       0.5,
  similarity:      0.9,
  // Notifications
  emails: ['anurag@awaaz.de', 'nikunj@awaaz.de', 'nirja@awaaz.de', 'harsh@awaaz.de', 'sophie@awaaz.de', 'ishan@awaaz.de'],
}

export const recentChanges = [
  { color: '#10b981', text: 'Tala Pre-due STT switched to Deepgram nova-2',    time: '2 min ago',  user: 'nikunj@awaaz.de' },
  { color: '#6366f1', text: 'BFL DPD-30 filler audio updated',                 time: '1 hr ago',   user: 'anurag@awaaz.de' },
  { color: '#f59e0b', text: 'HDFC Agent 7 calling window changed 09:00–18:00', time: '3 hrs ago',  user: 'harsh@awaaz.de'  },
  { color: '#10b981', text: 'Staging — Sophie barge-in enabled',               time: 'Yesterday',  user: 'sophie@awaaz.de' },
  { color: '#ef4444', text: 'CreditBee Agent 2 voice mail detection off',      time: '2 days ago', user: 'ishan@awaaz.de'  },
]
