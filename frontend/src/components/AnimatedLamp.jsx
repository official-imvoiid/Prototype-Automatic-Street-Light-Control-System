import { useEffect, useState, useRef } from 'react';

export default function AnimatedLamp({ status }) {
  const isActive = status === 'NIGHT_ACTIVE';
  const isIdle = status === 'NIGHT_IDLE';
  const isOn = isActive || isIdle;

  const [particles, setParticles] = useState([]);
  const idRef = useRef(0);

  useEffect(() => {
    if (!isOn) { setParticles([]); return; }
    const iv = setInterval(() => {
      idRef.current += 1;
      setParticles(p => [...p.slice(-5), {
        id: idRef.current,
        x: 30 + Math.random() * 40,
        delay: Math.random() * 0.5
      }]);
    }, 700);
    return () => clearInterval(iv);
  }, [isOn]);

  const color = isActive ? '#f59e0b' : isIdle ? '#fbbf24' : '#64748b';
  const beamOp = isActive ? 0.45 : isIdle ? 0.18 : 0;

  return (
    <div className="relative w-full h-36 mb-3 rounded-xl overflow-hidden bg-slate-950/40 border border-slate-800/40">
      <svg viewBox="0 0 100 80" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id={`lg-${status}`} cx="50%" cy="12%" r="45%">
            <stop offset="0%" stopColor={color} stopOpacity={isOn ? 0.6 : 0} />
            <stop offset="50%" stopColor={color} stopOpacity={isOn ? 0.2 : 0} />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`lb-${status}`} x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={beamOp} />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {isOn && (
          <ellipse cx="50" cy="12" rx="38" ry="20" fill={`url(#lg-${status})`} className="animate-pulse-slow" />
        )}

        {isOn && (
          <polygon
            points="44,12 56,12 78,72 22,72"
            fill={`url(#lb-${status})`}
            style={{ animation: 'beamFlicker 3s infinite' }}
          />
        )}

        <rect x="48" y="12" width="4" height="64" fill="#475569" rx="1" />
        <rect x="45" y="74" width="10" height="4" fill="#1e293b" rx="1" />

        <path d="M 30 20 Q 30 12 38 12 L 62 12 Q 70 12 70 20" stroke="#475569" strokeWidth="2" fill="none" />
        <line x1="50" y1="12" x2="50" y2="20" stroke="#475569" strokeWidth="2" />

        <ellipse cx="32" cy="12" rx="4" ry="2.5" fill="#1e293b" />
        <ellipse cx="50" cy="12" rx="5" ry="3" fill="#1e293b" />
        <ellipse cx="68" cy="12" rx="4" ry="2.5" fill="#1e293b" />

        <circle cx="32" cy="12" r="1.8" fill={isOn ? color : '#334155'}
          filter={isOn ? `drop-shadow(0 0 2px ${color})` : ''}
          className={isOn ? 'animate-pulse' : ''}
        />
        <circle cx="50" cy="12" r="2.2" fill={isOn ? color : '#334155'}
          filter={isOn ? `drop-shadow(0 0 3px ${color})` : ''}
          className={isOn ? 'animate-pulse' : ''}
        />
        <circle cx="68" cy="12" r="1.8" fill={isOn ? color : '#334155'}
          filter={isOn ? `drop-shadow(0 0 2px ${color})` : ''}
          className={isOn ? 'animate-pulse' : ''}
        />

        {particles.map(p => (
          <circle key={p.id} cx={p.x} cy="65" r="0.7" fill={color} opacity="0.5">
            <animate attributeName="cy" from="65" to="8" dur="2.5s" begin={`${p.delay}s`} fill="freeze" />
            <animate attributeName="opacity" from="0.5" to="0" dur="2.5s" begin={`${p.delay}s`} fill="freeze" />
          </circle>
        ))}
      </svg>
    </div>
  );
}
