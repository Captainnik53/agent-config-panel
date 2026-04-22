import { useNavigate, useLocation } from 'react-router-dom'

const NAV = [
  { label: 'Home',              icon: '🏠', path: '/home'       },
  { label: 'Production Agents', icon: '⚡', path: '/production', count: 15 },
  { label: 'Staging Agents',    icon: '🧪', path: '/staging',    count: 8  },
]

export default function Sidebar() {
  const navigate  = useNavigate()
  const { pathname } = useLocation()

  return (
    <aside className="w-[220px] flex-shrink-0 bg-app-sidebar border-r border-app-border flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-[18px] py-5 border-b border-app-border">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[15px]"
          style={{ background: 'linear-gradient(135deg,#6366f1,#06b6d4)' }}>
          🎙️
        </div>
        <div>
          <div className="text-[13px] font-semibold text-app-text leading-tight">Voice AI CC</div>
          <div className="text-[10px] text-app-muted">Agent Config Panel</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2.5 py-3 flex flex-col gap-0.5">
        {NAV.map(item => {
          const active = pathname === item.path || (item.path !== '/home' && pathname.startsWith(item.path))
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] transition-all text-left
                ${active
                  ? 'bg-app-accent/[0.18] text-indigo-300 font-medium'
                  : 'text-app-soft hover:bg-white/5 hover:text-app-text'
                }`}
            >
              <span className="w-4 text-center text-sm">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.count && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-app-accent/30 text-indigo-300">
                  {item.count}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* User footer */}
      <div className="px-3.5 py-3.5 border-t border-app-border">
        <div className="flex items-center gap-2.5">
          <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
            NK
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-app-text truncate">Nikunj G.</div>
            <div className="text-[10px] text-app-muted">Admin · awaaz.de</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
