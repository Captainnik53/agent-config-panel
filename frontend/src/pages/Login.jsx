import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    navigate('/home')
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#080d1a' }}>
      {/* ── LEFT PANEL ── */}
      <div className="w-1/2 relative flex flex-col justify-center px-16 overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#0a0f1f 0%,#0f1635 40%,#111b40 100%)' }}>
        {/* Glow blobs */}
        <div className="absolute -top-28 -left-28 w-[460px] h-[460px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(99,102,241,0.18) 0%,transparent 70%)' }} />
        <div className="absolute -bottom-20 -right-20 w-[360px] h-[360px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(6,182,212,0.12) 0%,transparent 70%)' }} />

        {/* Logo */}
        <div className="absolute top-8 left-14 flex items-center gap-3">
          <div className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[16px]"
            style={{ background: 'linear-gradient(135deg,#6366f1,#06b6d4)' }}>🎙️</div>
          <div>
            <div className="text-[14px] font-semibold text-app-text">Voice AI Command Center</div>
            <div className="text-[11px] text-app-muted">by awaaz.de</div>
          </div>
        </div>

        {/* Hero */}
        <div className="relative z-10 mt-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-6 text-xs text-indigo-300"
            style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}>
            <span style={{ fontSize: 8, color: '#6366f1' }}>●</span>
            Internal Tool · v2.4
          </div>

          <h1 className="text-[40px] font-bold leading-[1.2] mb-4" style={{ lineHeight: 1.2 }}>
            <span className="gradient-text">Agent Config<br />Panel</span>
          </h1>

          <p className="text-[15px] text-app-soft leading-relaxed max-w-[400px] mb-10">
            Configure production and staging voice agents — switch STT, TTS, and NLU providers,
            tune call windows, and manage parameters without touching code.
          </p>

          <ul className="flex flex-col gap-3">
            {[
              'Production & staging environments',
              'Per-agent engine switching (Deepgram, ElevenLabs, AwaazDe)',
              'Template and agent-level config overrides',
              'Calling windows, backup attempts, filler audio',
            ].map(item => (
              <li key={item} className="flex items-center gap-2.5 text-[13px] text-app-soft">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#6366f1,#06b6d4)' }} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="w-1/2 flex items-center justify-center px-10"
        style={{ background: '#0e1428', borderLeft: '1px solid #1e2d4d' }}>
        <div className="w-full max-w-[360px]">
          <div className="mb-8">
            <h2 className="text-[24px] font-bold text-app-text mb-2">Welcome back</h2>
            <p className="text-sm text-app-muted">Sign in to manage your agent configurations</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-app-soft uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-app-muted text-sm">✉</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@awaaz.de"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm outline-none transition-all"
                  style={{
                    background: '#131c35',
                    border: '1px solid #1e2d4d',
                    color: '#e2e8f0',
                  }}
                  onFocus={e => e.target.style.borderColor = '#6366f1'}
                  onBlur={e => e.target.style.borderColor = '#1e2d4d'}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-app-soft uppercase tracking-wider">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-app-muted text-sm">🔒</span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm outline-none transition-all"
                  style={{
                    background: '#131c35',
                    border: '1px solid #1e2d4d',
                    color: '#e2e8f0',
                  }}
                  onFocus={e => e.target.style.borderColor = '#6366f1'}
                  onBlur={e => e.target.style.borderColor = '#1e2d4d'}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-[13px] text-app-soft cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  className="accent-app-accent"
                />
                Remember me
              </label>
              <a href="#" className="text-[13px] text-app-accent hover:underline">Forgot password?</a>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg text-sm font-semibold text-white tracking-wide transition-all hover:opacity-90 active:scale-[0.99]"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
            >
              Sign In to Command Center
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
