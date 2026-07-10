import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Zap, TrendingDown, BarChart3, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'

function useAnimatedValue(target, duration = 1000) {
  const [current, setCurrent] = useState(target);
  const startRef = useRef(0);
  const fromRef = useRef(target);

  useEffect(() => {
    fromRef.current = current;
    startRef.current = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(fromRef.current + (target - fromRef.current) * eased);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration]);

  return current;
}

function MetricCard({ icon: Icon, label, value, unit, color, trend }) {
  const colorClasses = {
    amber: 'text-amber-400 bg-amber-500/10',
    slate: 'text-slate-400 bg-slate-500/10',
    emerald: 'text-emerald-400 bg-emerald-500/10',
  }

  const borderColors = {
    amber: 'border-amber-500/20 hover:border-amber-500/40',
    slate: 'border-slate-700/50 hover:border-slate-600/50',
    emerald: 'border-emerald-500/20 hover:border-emerald-500/40',
  }

  const animatedValue = useAnimatedValue(typeof value === 'number' ? value : 0);

  return (
    <div className={`glass-panel p-5 transition-all duration-300 hover:shadow-card-hover relative overflow-hidden ${borderColors[color]}`}>
      <div className={`absolute -top-10 -right-10 w-20 h-20 rounded-full blur-2xl opacity-20 ${colorClasses[color].split(' ')[1]}`}
        style={{ animation: 'pulse 4s ease-in-out infinite' }}
      />

      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            <Icon className="h-4 w-4" strokeWidth={2} />
          </div>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</span>
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-0.5 text-xs font-mono ${trend > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {trend > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(trend).toFixed(1)}%
          </div>
        )}
      </div>
      <p className="text-2xl font-semibold tracking-tight font-mono text-slate-100 relative z-10">
        {typeof value === 'number' ? animatedValue.toFixed(4) : value}
        <span className="text-sm font-normal text-slate-500 ml-1.5">{unit}</span>
      </p>
    </div>
  )
}

export default function EnergyPanel({ energy, history }) {
  const chartData = history.map(h => ({
    time: h.clock,
    baseline: h.total_baseline_kwh,
    actual: h.total_actual_kwh,
  }))

  const hasData = chartData.length > 0
  const latest = chartData[chartData.length - 1]
  const prev = chartData[chartData.length - 2]
  const trend = latest && prev && prev.actual > 0 ? ((latest.actual - prev.actual) / prev.actual) * 100 : 0

  return (
    <section className="space-y-6 animate-fade-in relative">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard icon={Zap} label="Grid Load" value={energy.total_actual_kwh} unit="kWh" color="amber" trend={trend} />
        <MetricCard icon={BarChart3} label="Baseline" value={energy.total_baseline_kwh} unit="kWh" color="slate" />
        <MetricCard icon={TrendingDown} label="Efficiency" value={parseFloat(energy.savings_percent)} unit="% saved" color="emerald" />
      </div>

      <div className="glass-panel p-6 glow-border relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] bg-amber-500/5 rounded-full blur-[80px] pointer-events-none animate-pulse-slow" />

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-slate-100">Energy Divergence</h3>
              <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 animate-pulse">
                <Activity className="h-2.5 w-2.5" />
                LIVE
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">Actual consumption vs. unmanaged baseline</p>
          </div>

          <div className="flex items-center gap-5 text-xs font-mono bg-slate-950/50 rounded-lg px-4 py-2 border border-slate-800/50">
            <div className="flex items-center gap-2">
              <span className="h-2 w-4 rounded-full bg-slate-600" />
              <span className="text-slate-400">Baseline</span>
            </div>
            <div className="w-px h-3 bg-slate-800" />
            <div className="flex items-center gap-2">
              <span className="h-2 w-4 rounded-full bg-amber-400 shadow-glow-sm" />
              <span className="text-amber-400">Smart System</span>
            </div>
          </div>
        </div>

        <div className="h-[340px] w-full relative z-10">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.25} />
                    <stop offset="50%" stopColor="#fbbf24" stopOpacity={0.08} />
                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="baselineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#475569" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#475569" stopOpacity={0} />
                  </linearGradient>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis
                  dataKey="time"
                  tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={50}
                />
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                  axisLine={false}
                  tickLine={false}
                  width={50}
                  tickFormatter={(val) => val.toFixed(2)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontFamily: 'JetBrains Mono',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                  }}
                  labelStyle={{ color: '#94a3b8', marginBottom: '6px', fontSize: '11px' }}
                  itemStyle={{ padding: '3px 0' }}
                  formatter={(value) => [value.toFixed(4), '']}
                />
                <Area
                  name="Baseline"
                  type="monotone"
                  dataKey="baseline"
                  stroke="#475569"
                  strokeWidth={1.5}
                  strokeDasharray="5 5"
                  fill="url(#baselineGradient)"
                />
                <Area
                  name="Smart System"
                  type="monotone"
                  dataKey="actual"
                  stroke="#fbbf24"
                  strokeWidth={3}
                  filter="url(#glow)"
                  fill="url(#actualGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 text-sm gap-3">
              <div className="h-8 w-8 rounded-full border-2 border-slate-700 border-t-amber-400 animate-spin" />
              <span>Collecting data...</span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
