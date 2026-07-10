import { MapPin, Moon, Sun } from 'lucide-react'
import { useMemo } from 'react'

export default function StreetLightMap({ lights, isDay }) {
  const gridPositions = useMemo(() => [
    { x: 15, y: 20 }, { x: 45, y: 15 }, { x: 75, y: 25 }, { x: 25, y: 50 },
    { x: 55, y: 45 }, { x: 85, y: 55 }, { x: 20, y: 75 }, { x: 50, y: 80 },
    { x: 80, y: 70 }, { x: 40, y: 35 }, { x: 70, y: 40 }, { x: 35, y: 60 },
  ], []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'NIGHT_ACTIVE': return 'bg-amber-400 shadow-glow'
      case 'NIGHT_IDLE': return 'bg-amber-400/40'
      case 'DAY': return 'bg-sky-400/30'
      default: return 'bg-slate-600'
    }
  }

  const getStatusRing = (status) => {
    switch (status) {
      case 'NIGHT_ACTIVE': return 'ring-2 ring-amber-400/50 animate-pulse'
      case 'NIGHT_IDLE': return 'ring-1 ring-amber-400/20'
      case 'DAY': return 'ring-1 ring-sky-400/20'
      default: return ''
    }
  }

  const connections = useMemo(() => {
    const conns = [];
    for (let i = 0; i < lights.length; i++) {
      for (let j = i + 1; j < lights.length; j++) {
        const p1 = gridPositions[i % gridPositions.length];
        const p2 = gridPositions[j % gridPositions.length];
        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        if (dist < 45) {
          conns.push({ from: i, to: j, x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y });
        }
      }
    }
    return conns;
  }, [lights.length, gridPositions]);

  return (
    <div className="glass-panel p-5 animate-slide-up glow-border relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.4), transparent)', animation: 'radarSweep 4s ease-in-out infinite' }}
      />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-violet-500/10">
            <MapPin className="h-4 w-4 text-violet-400" />
          </div>
          <h3 className="text-sm font-semibold text-slate-200">Network Topology</h3>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-400 shadow-glow-sm" />
            <span className="text-slate-500">Active</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-400/40" />
            <span className="text-slate-500">Idle</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-sky-400/30" />
            <span className="text-slate-500">Day</span>
          </div>
        </div>
      </div>

      <div className="relative h-[280px] rounded-xl bg-slate-950/50 border border-slate-800/50 overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(148,163,184,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />

        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {connections.map((conn, i) => (
            <line key={i}
              x1={`${conn.x1}%`} y1={`${conn.y1}%`}
              x2={`${conn.x2}%`} y2={`${conn.y2}%`}
              stroke="rgba(148,163,184,0.08)" strokeWidth="0.3"
            />
          ))}

          {connections.map((conn, i) => {
            const light1 = lights[conn.from];
            const light2 = lights[conn.to];
            if (light1?.status === 'NIGHT_ACTIVE' && light2?.status === 'NIGHT_ACTIVE') {
              return (
                <line key={`energy-${i}`}
                  x1={`${conn.x1}%`} y1={`${conn.y1}%`}
                  x2={`${conn.x2}%`} y2={`${conn.y2}%`}
                  stroke="rgba(245,158,11,0.35)" strokeWidth="0.8"
                  strokeDasharray="2 4" strokeDashoffset="0"
                  className="animate-dash"
                />
              );
            }
            return null;
          })}
        </svg>

        {lights.map((light, i) => {
          const pos = gridPositions[i % gridPositions.length]
          const offsetX = ((light.id * 7) % 10) - 5
          const offsetY = ((light.id * 13) % 10) - 5

          return (
            <div
              key={light.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{
                left: `${pos.x + offsetX}%`,
                top: `${pos.y + offsetY}%`,
                animationDelay: `${i * 100}ms`
              }}
            >
              {light.status === 'NIGHT_ACTIVE' && (
                <>
                  <div className="absolute inset-0 -m-6 rounded-full border border-amber-400/20 animate-energy-pulse" />
                  <div className="absolute inset-0 -m-4 rounded-full bg-amber-400/10 animate-pulse" />
                </>
              )}

              <div className={`relative transition-all duration-500 ${getStatusColor(light.status)} ${getStatusRing(light.status)}`}>
                {light.status === 'NIGHT_ACTIVE' && (
                  <div className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-30" />
                )}

                <div className="relative w-4 h-4 flex items-center justify-center">
                  <div className={`w-2.5 h-3 rounded-t-full ${light.status === 'DAY' ? 'bg-sky-400/50' : light.status === 'NIGHT_IDLE' ? 'bg-amber-400/60' : 'bg-amber-300'} ${light.status === 'NIGHT_ACTIVE' ? 'shadow-glow' : ''}`} />
                  <div className="absolute bottom-0 w-3 h-0.5 bg-slate-600 rounded-full" />
                </div>
              </div>

              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <div className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-lg">
                  <p className="text-[10px] font-semibold text-slate-200">{light.location}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{light.brightness}% &bull; {light.status.replace('_', ' ')}</p>
                </div>
              </div>
            </div>
          )
        })}

        <div className="absolute top-3 right-3">
          <div className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-mono ${
            isDay
              ? 'bg-sky-500/10 border-sky-500/20 text-sky-400'
              : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
          }`}>
            {isDay ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
            {isDay ? 'Daytime' : 'Night'}
          </div>
        </div>
      </div>
    </div>
  )
}
