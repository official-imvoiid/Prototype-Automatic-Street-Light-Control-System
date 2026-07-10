import { TrendingDown } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function SavingsRing({ savings }) {
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (Math.min(savings, 100) / 100) * circumference

  const getColor = (val) => {
    if (val >= 50) return '#10b981'
    if (val >= 30) return '#f59e0b'
    return '#f43f5e'
  }

  const color = getColor(savings)
  const [animatedOffset, setAnimatedOffset] = useState(circumference);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimatedOffset(strokeDashoffset), 100);
    return () => clearTimeout(timeout);
  }, [strokeDashoffset]);

  return (
    <div className="glass-panel p-5 animate-slide-up flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full blur-2xl opacity-10"
        style={{ backgroundColor: color, animation: 'pulse 3s ease-in-out infinite' }}
      />

      <span className="metric-label mb-3 relative z-10">Energy Saved</span>
      <div className="relative h-24 w-24">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#1e293b" strokeWidth="6" />
          <circle
            cx="50" cy="50" r={radius} fill="none" stroke={color} strokeWidth="6"
            strokeLinecap="round" strokeDasharray={circumference}
            strokeDashoffset={animatedOffset}
            className="transition-all ease-out"
            style={{ transitionDuration: '1500ms', filter: `drop-shadow(0 0 8px ${color}60)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold font-mono text-slate-100">{savings.toFixed(0)}</span>
          <span className="text-[10px] text-slate-500 font-mono">%</span>
        </div>

        <div className="absolute inset-0 animate-spin-slow" style={{ animationDuration: '8s' }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }} />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1 mt-2 text-xs relative z-10" style={{ color }}>
        <TrendingDown className="h-3 w-3" />
        <span className="font-mono">{savings.toFixed(1)}% efficiency</span>
      </div>
    </div>
  )
}
