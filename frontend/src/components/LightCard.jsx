import { useState } from 'react'
import { Trash2, MapPin, Zap, Timer, Sun, CloudFog, CloudRain, CloudLightning, Wrench, AlertTriangle, Settings2, Gauge, Users, Car } from 'lucide-react'
import RealisticLamp from './RealisticLamp.jsx'

const STATUS_CONFIG = {
  DAY: { label: 'Day Mode', color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20', bar: '#38bdf8', glow: '', icon: Sun },
  NIGHT_IDLE: { label: 'Standby', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', bar: '#fbbf24', glow: 'shadow-glow-sm', icon: Timer },
  NIGHT_ACTIVE: { label: 'Active', color: 'text-amber-300', bg: 'bg-amber-500/15', border: 'border-amber-500/30', bar: '#f59e0b', glow: 'shadow-glow animate-glow-pulse', icon: Zap },
  FOGGY: { label: 'Fog Mode', color: 'text-slate-300', bg: 'bg-slate-500/15', border: 'border-slate-500/30', bar: '#94a3b8', glow: 'shadow-glow-sm', icon: CloudFog },
  STORM: { label: 'Storm Alert', color: 'text-violet-300', bg: 'bg-violet-500/15', border: 'border-violet-500/30', bar: '#a78bfa', glow: 'shadow-glow-lg', icon: CloudLightning },
  MAINTENANCE: { label: 'Fault', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', bar: '#f43f5e', glow: '', icon: AlertTriangle },
  EMERGENCY: { label: 'Emergency', color: 'text-rose-300', bg: 'bg-rose-500/20', border: 'border-rose-500/40', bar: '#fb7185', glow: 'shadow-glow-rose animate-glow-pulse', icon: Zap },
}

const MODE_OPTIONS = ['AUTO', 'MANUAL', 'ECO', 'EMERGENCY']

const WEATHER_ICONS = { CLEAR: Sun, FOGGY: CloudFog, RAIN: CloudRain, STORM: CloudLightning }

const TRAFFIC_CONFIG = {
  LOW: { label: 'Low', color: 'text-emerald-400' },
  MEDIUM: { label: 'Medium', color: 'text-amber-400' },
  HIGH: { label: 'High', color: 'text-rose-400' },
}

export default function LightCard({ light, onRemove, onModeChange, onBrightnessChange, onService }) {
  const meta = STATUS_CONFIG[light.status] || STATUS_CONFIG.DAY
  const StatusIcon = meta.icon
  const isActive = light.status === 'NIGHT_ACTIVE' || light.status === 'EMERGENCY'
  const isFaulty = light.health < 30 || !light.operational
  const [showControls, setShowControls] = useState(false)
  const [localBrightness, setLocalBrightness] = useState(light.manual_brightness ?? 50)

  const WeatherIcon = WEATHER_ICONS[light.weather] || Sun
  const traffic = TRAFFIC_CONFIG[light.traffic_density] || TRAFFIC_CONFIG.LOW
  const isManual = light.mode === 'MANUAL'

  const handleModeClick = (mode) => {
    if (mode === light.mode) return
    onModeChange?.(light.id, mode)
  }

  const handleSliderChange = (e) => {
    const val = Number(e.target.value)
    setLocalBrightness(val)
    onBrightnessChange?.(light.id, val)
  }

  return (
    <div className={`group relative rounded-xl border bg-slate-900/40 p-4 transition-all duration-500 hover:bg-slate-800/60 hover:border-slate-600/50 hover:-translate-y-0.5 ${meta.border} ${meta.glow} overflow-hidden`}>

      {/* Rotating gradient border for active */}
      {isActive && (
        <div className="absolute inset-0 rounded-xl opacity-15 pointer-events-none animate-rotate-glow"
          style={{ background: 'conic-gradient(from 0deg, transparent, rgba(245,158,11,0.5), transparent, rgba(245,158,11,0.5), transparent)' }} />
      )}

      {/* Fault indicator */}
      {isFaulty && (
        <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-500/20 border border-rose-500/30 text-rose-400 text-[9px] font-bold font-mono uppercase animate-pulse z-20">
          <AlertTriangle className="h-2.5 w-2.5" />
          Fault
        </div>
      )}

      {/* Top glow line */}
      {isActive && <div className="absolute inset-x-4 -top-px h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />}

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3 relative z-10">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${meta.bg} ${isActive ? 'animate-pulse-slow' : ''}`}>
            <StatusIcon className={`h-5 w-5 ${meta.color}`} />
            {isActive && <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-amber-400 animate-ping" />}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3 text-slate-600" />
              <h4 className="font-semibold text-sm text-slate-200 truncate">{light.location}</h4>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className={`h-2 w-2 rounded-full ${isActive ? 'bg-amber-400 animate-pulse' : 'bg-slate-500'}`} />
              <span className={`text-xs font-bold font-mono uppercase tracking-wider ${meta.color}`}>{meta.label}</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                {light.mode}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => setShowControls(!showControls)}
            title="Toggle controls"
            className={`rounded-lg p-2 transition-all ${showControls ? 'bg-slate-700 text-slate-200' : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800'}`}>
            <Settings2 className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => onRemove?.(light.id)}
            title="Remove node"
            className="opacity-0 group-hover:opacity-100 transition-all rounded-lg p-2 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Lamp visual */}
      <RealisticLamp status={light.status} brightness={light.brightness} weather={light.weather} health={light.health} />

      {/* Live sensor readouts */}
      <div className="grid grid-cols-3 gap-2 mb-3 text-[10px] font-mono">
        <div className="flex items-center gap-1 rounded-md bg-slate-950/40 border border-slate-800/60 px-2 py-1">
          <WeatherIcon className="h-3 w-3 text-slate-400" />
          <span className="text-slate-400 truncate">{light.weather}</span>
        </div>
        <div className="flex items-center gap-1 rounded-md bg-slate-950/40 border border-slate-800/60 px-2 py-1">
          <Car className={`h-3 w-3 ${traffic.color}`} />
          <span className={traffic.color}>{traffic.label}</span>
        </div>
        <div className="flex items-center gap-1 rounded-md bg-slate-950/40 border border-slate-800/60 px-2 py-1">
          <Gauge className="h-3 w-3 text-slate-400" />
          <span className="text-slate-400">{light.brightness}%</span>
        </div>
      </div>

      {/* Health bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-1">
          <span>Health</span>
          <span className={isFaulty ? 'text-rose-400' : 'text-slate-400'}>{light.health}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div className={`h-full rounded-full transition-all ${isFaulty ? 'bg-rose-500' : 'bg-emerald-500'}`}
            style={{ width: `${Math.max(0, Math.min(100, light.health))}%` }} />
        </div>
      </div>

      {/* Expandable controls */}
      {showControls && (
        <div className="space-y-3 pt-3 border-t border-slate-800/60 animate-fade-in">
          {/* Mode selector */}
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1.5">Control Mode</div>
            <div className="grid grid-cols-4 gap-1">
              {MODE_OPTIONS.map(mode => (
                <button
                  key={mode}
                  onClick={() => handleModeClick(mode)}
                  className={`rounded-md py-1.5 text-[10px] font-bold font-mono uppercase transition-all ${
                    light.mode === mode
                      ? 'bg-amber-500 text-slate-950 shadow-glow-sm'
                      : 'bg-slate-800/60 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Manual brightness slider - only meaningful in MANUAL mode */}
          <div className={isManual ? '' : 'opacity-40 pointer-events-none'}>
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1.5">
              <span>Manual Brightness</span>
              <span className="text-amber-400">{localBrightness}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={localBrightness}
              onChange={handleSliderChange}
              disabled={!isManual}
              className="w-full h-1.5 rounded-full appearance-none bg-slate-800 accent-amber-400 cursor-pointer disabled:cursor-not-allowed"
            />
            {!isManual && (
              <p className="text-[9px] text-slate-600 mt-1">Switch to MANUAL to override brightness.</p>
            )}
          </div>

          {/* Service button */}
          <button
            onClick={() => onService?.(light.id)}
            disabled={light.health >= 100 && light.operational}
            className="w-full flex items-center justify-center gap-1.5 rounded-md py-2 text-xs font-bold font-mono uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Wrench className="h-3.5 w-3.5" />
            Service Node
          </button>
        </div>
      )}
    </div>
  )
}
