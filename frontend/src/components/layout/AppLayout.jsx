import Sidebar from './Sidebar'

export default function AppLayout({ children, topbar }) {
  return (
    <div className="flex h-screen bg-app-bg overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {topbar && (
          <header className="h-14 flex-shrink-0 flex items-center gap-2 px-6 border-b border-app-border bg-app-panel">
            {topbar}
          </header>
        )}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
