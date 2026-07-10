import { Terminal, AlertCircle, CheckCircle2, Info, AlertTriangle, Clock } from 'lucide-react'

const ICONS = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
}

const COLORS = {
  info: 'text-sky-400 bg-sky-500/10',
  success: 'text-emerald-400 bg-emerald-500/10',
  warning: 'text-amber-400 bg-amber-500/10',
  error: 'text-rose-400 bg-rose-500/10',
}

const BORDER_COLORS = {
  info: 'border-sky-500/20',
  success: 'border-emerald-500/20',
  warning: 'border-amber-500/20',
  error: 'border-rose-500/20',
}

export default function SystemLog({ logs }) {
  return (
    <div className="glass-panel p-5 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-slate-800">
            <Terminal className="h-4 w-4 text-slate-400" />
          </div>
          <h3 className="text-sm font-semibold text-slate-200">System Events</h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <Clock className="h-3 w-3" />
          <span className="font-mono">Live</span>
        </div>
      </div>

      <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-1 custom-scroll">
        {logs.length === 0 ? (
          <div className="text-center py-8">
            <div className="h-8 w-8 rounded-full border-2 border-slate-800 border-dashed mx-auto mb-3 animate-spin-slow" />
            <p className="text-xs text-slate-600 font-mono">Waiting for events...</p>
          </div>
        ) : (
          logs.map((log, i) => {
            const Icon = ICONS[log.type] || Info
            const color = COLORS[log.type] || 'text-slate-400 bg-slate-500/10'
            const borderColor = BORDER_COLORS[log.type] || 'border-slate-700/30'

            return (
              <div
                key={log.id}
                className={`flex items-start gap-2.5 text-xs p-2.5 rounded-lg border ${borderColor} bg-slate-950/30 animate-fade-in hover:bg-slate-800/30 transition-colors`}
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div className={`p-1 rounded-md shrink-0 mt-0.5 ${color}`}>
                  <Icon className="h-3 w-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-300 leading-relaxed">{log.message}</p>
                </div>
                <span className="font-mono text-[10px] text-slate-600 shrink-0 mt-0.5">{log.timestamp}</span>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
