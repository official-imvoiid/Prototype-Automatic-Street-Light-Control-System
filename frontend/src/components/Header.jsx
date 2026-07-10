import { Sun, Moon, Cloud, CloudRain, CloudLightning, CloudFog, Gauge, Thermometer } from 'lucide-react'

const SPEED_OPTIONS = [
  { label: '1x', minutes: 1 },
  { label: '6x', minutes: 6 },
  { label: '30x', minutes: 30 },
  { label: '90x', minutes: 90 },
]

const WEATHER_ICONS = {
  CLEAR: Sun,
  FOGGY: CloudFog,
  RAIN: CloudRain,
  STORM: CloudLightning,
}

const WEATHER_COLORS = {
  CLEAR: 'text-amber-400',
  FOGGY: 'text-slate-400',
  RAIN: 'text-sky-400',
  STORM: 'text-violet-400',
}

export default function Header({ clock, dayCount, isDay, weather, temperature, minutesPerTick, onSpeedChange, connected, stats }) {
  const WeatherIcon = WEATHER_ICONS[weather] || Sun;
  const weatherColor = WEATHER_COLORS[weather] || 'text-amber-400';

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-2xl">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">

          <div className="flex items-center gap-3">
            <div className={`relative flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-700 ${
              isDay
                ? 'border-sky-500/30 bg-sky-500/10 text-sky-400 shadow-glow-sky'
                : 'border-amber-500/30 bg-amber-500/10 text-amber-400 shadow-glow'
            }`}>
              {isDay ? <Sun className="h-5 w-5 animate-spin-slow" /> : <Moon className="h-5 w-5 animate-float" />}
              {weather === 'STORM' && <div className="absolute inset-0 rounded-xl animate-lightning bg-white/10" />}
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-100">Night Grid <span className="text-amber-500">Pro</span></h1>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                <span>Day {dayCount}</span>
                <span className="text-slate-700">|</span>
                <span className={isDay ? 'text-sky-400' : 'text-amber-400'}>{clock}</span>
                <span className="text-slate-700">|</span>
                <span className="flex items-center gap-1">
                  <WeatherIcon className={`h-3 w-3 ${weatherColor}`} />
                  <span className={weatherColor}>{weather}</span>
                </span>
                <span className="text-slate-700">|</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Thermometer className="h-3 w-3" />
                  {temperature}°C
                </span>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <StatusPill label="Active" value={stats.active} color="amber" active={stats.active > 0} />
            <StatusPill label="Idle" value={stats.idle} color="slate" />
            <StatusPill label="Eco" value={stats.eco} color="emerald" />
            <StatusPill label="Fault" value={stats.faulty} color="rose" active={stats.faulty > 0} />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-slate-500 hidden sm:block" />
              <div className="flex rounded-lg border border-slate-800 bg-slate-900/50 p-0.5">
                {SPEED_OPTIONS.map((opt) => (
                  <button
                    key={opt.minutes}
                    onClick={() => onSpeedChange(opt.minutes)}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                      minutesPerTick === opt.minutes
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-glow-sm'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 ${
              connected
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            }`}>
              <div className={`h-1.5 w-1.5 rounded-full ${connected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
              <span className="text-[10px] font-mono uppercase tracking-wider hidden sm:inline">
                {connected ? 'Live' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

function StatusPill({ label, value, color, active }) {
  const colorMap = {
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    slate: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  }

  return (
    <div className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${colorMap[color]} ${active ? 'shadow-glow-sm' : ''}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${active ? 'animate-pulse' : ''} ${color === 'amber' ? 'bg-amber-400' : color === 'emerald' ? 'bg-emerald-400' : color === 'rose' ? 'bg-rose-400' : 'bg-slate-400'}`} />
      <span className="font-mono font-bold">{value}</span>
      <span className="opacity-70">{label}</span>
    </div>
  )
}