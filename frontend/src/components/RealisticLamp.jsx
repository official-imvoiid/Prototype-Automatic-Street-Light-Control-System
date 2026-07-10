import { useEffect, useState, useRef } from 'react';

export default function RealisticLamp({ status, brightness, weather, health }) {
  const isActive = status === 'NIGHT_ACTIVE' || status === 'EMERGENCY';
  const isIdle = status === 'NIGHT_IDLE' || status === 'FOGGY' || status === 'STORM';
  const isOn = isActive || isIdle || brightness > 0;
  const isFaulty = health < 30;

  const [particles, setParticles] = useState([]);
  const [moths, setMoths] = useState([]);
  const idRef = useRef(0);

  useEffect(() => {
    if (!isOn) { setParticles([]); setMoths([]); return; }
    
    const iv = setInterval(() => {
      idRef.current += 1;
      setParticles(p => [...p.slice(-6), {
        id: idRef.current,
        x: 25 + Math.random() * 50,
        delay: Math.random() * 0.5,
        size: 0.3 + Math.random() * 0.5
      }]);
      
      if (Math.random() < 0.3) {
        setMoths(m => [...m.slice(-3), {
          id: idRef.current + '_moth',
          startX: 20 + Math.random() * 60,
          delay: Math.random() * 0.3
        }]);
      }
    }, 600);
    return () => clearInterval(iv);
  }, [isOn]);

  const getColor = () => {
    if (status === 'EMERGENCY') return '#f43f5e';
    if (status === 'STORM') return '#fbbf24';
    if (status === 'FOGGY') return '#fcd34d';
    if (isActive) return '#f59e0b';
    if (isIdle) return '#fbbf24';
    return '#64748b';
  };

  const color = getColor();
  const beamOpacity = isActive ? 0.5 : isIdle ? 0.2 : 0;
  const bulbGlow = isFaulty ? 0.3 : 1;

  return (
    <div className="relative w-full h-44 mb-3 rounded-xl overflow-hidden bg-slate-950/50 border border-slate-800/40">
      {/* Weather overlay inside lamp */}
      {weather === 'RAIN' && (
        <div className="absolute inset-0 opacity-10">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="absolute w-px h-4 bg-sky-400 animate-rain"
              style={{ left: `${10 + i * 12}%`, animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      )}
      {weather === 'FOGGY' && (
        <div className="absolute inset-0 bg-slate-400/5 animate-fog" />
      )}

      <svg viewBox="0 0 120 90" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id={`lg-${status}-${brightness}`} cx="50%" cy="8%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity={isOn ? 0.7 * bulbGlow : 0} />
            <stop offset="40%" stopColor={color} stopOpacity={isOn ? 0.25 * bulbGlow : 0} />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`lb-${status}`} x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={beamOpacity * bulbGlow} />
            <stop offset="60%" stopColor={color} stopOpacity={beamOpacity * 0.3 * bulbGlow} />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
          <filter id="lampGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient glow halo */}
        {isOn && (
          <ellipse cx="60" cy="8" rx="50" ry="22" fill={`url(#lg-${status}-${brightness})`} 
            className={isFaulty ? 'animate-flicker' : 'animate-pulse-slow'} />
        )}

        {/* Main light beam - dual head */}
        {isOn && (
          <>
            <polygon points="42,8 52,8 68,75 28,75" fill={`url(#lb-${status})`} 
              style={{ animation: isFaulty ? 'beamFlicker 2s infinite' : 'beamPulse 3s infinite' }} />
            <polygon points="68,8 78,8 92,75 52,75" fill={`url(#lb-${status})`} 
              style={{ animation: isFaulty ? 'beamFlicker 2.5s infinite' : 'beamPulse 3.5s infinite' }} />
          </>
        )}

        {/* Lamp pole */}
        <rect x="57" y="8" width="6" height="78" fill="#3d4f5f" rx="1" />
        <rect x="52" y="82" width="16" height="5" fill="#1e293b" rx="1" />
        
        {/* Pole texture lines */}
        <line x1="59" y1="15" x2="59" y2="80" stroke="#4a5568" strokeWidth="0.5" opacity="0.3" />
        <line x1="61" y1="15" x2="61" y2="80" stroke="#4a5568" strokeWidth="0.5" opacity="0.3" />

        {/* Cross arm */}
        <rect x="25" y="6" width="70" height="4" fill="#3d4f5f" rx="2" />
        
        {/* Mounting brackets */}
        <rect x="38" y="4" width="3" height="8" fill="#475569" rx="0.5" />
        <rect x="79" y="4" width="3" height="8" fill="#475569" rx="0.5" />

        {/* Lamp housings - left */}
        <ellipse cx="40" cy="5" rx="14" ry="5" fill="#1e293b" />
        <ellipse cx="40" cy="5" rx="12" ry="4" fill="#0f172a" />
        
        {/* Lamp housings - right */}
        <ellipse cx="80" cy="5" rx="14" ry="5" fill="#1e293b" />
        <ellipse cx="80" cy="5" rx="12" ry="4" fill="#0f172a" />

        {/* Reflectors */}
        <ellipse cx="40" cy="5.5" rx="10" ry="3" fill="#334155" />
        <ellipse cx="80" cy="5.5" rx="10" ry="3" fill="#334155" />

        {/* LED arrays / bulbs */}
        <circle cx="35" cy="5" r="2" fill={isOn ? color : '#1e293b'} 
          filter={isOn ? `drop-shadow(0 0 3px ${color})` : ''}
          className={isOn && !isFaulty ? 'animate-pulse' : ''}
          opacity={bulbGlow} />
        <circle cx="40" cy="4.5" r="2.5" fill={isOn ? color : '#1e293b'} 
          filter={isOn ? `drop-shadow(0 0 4px ${color})` : ''}
          className={isOn && !isFaulty ? 'animate-pulse' : ''}
          opacity={bulbGlow} />
        <circle cx="45" cy="5" r="2" fill={isOn ? color : '#1e293b'} 
          filter={isOn ? `drop-shadow(0 0 3px ${color})` : ''}
          className={isOn && !isFaulty ? 'animate-pulse' : ''}
          opacity={bulbGlow} />

        <circle cx="75" cy="5" r="2" fill={isOn ? color : '#1e293b'} 
          filter={isOn ? `drop-shadow(0 0 3px ${color})` : ''}
          className={isOn && !isFaulty ? 'animate-pulse' : ''}
          opacity={bulbGlow} />
        <circle cx="80" cy="4.5" r="2.5" fill={isOn ? color : '#1e293b'} 
          filter={isOn ? `drop-shadow(0 0 4px ${color})` : ''}
          className={isOn && !isFaulty ? 'animate-pulse' : ''}
          opacity={bulbGlow} />
        <circle cx="85" cy="5" r="2" fill={isOn ? color : '#1e293b'} 
          filter={isOn ? `drop-shadow(0 0 3px ${color})` : ''}
          className={isOn && !isFaulty ? 'animate-pulse' : ''}
          opacity={bulbGlow} />

        {/* Light particles rising */}
        {particles.map(p => (
          <circle key={p.id} cx={p.x} cy="72" r={p.size} fill={color} opacity="0.4">
            <animate attributeName="cy" from="72" to="5" dur="3s" begin={`${p.delay}s`} fill="freeze" />
            <animate attributeName="opacity" from="0.4" to="0" dur="3s" begin={`${p.delay}s`} fill="freeze" />
          </circle>
        ))}

        {/* Moths around light */}
        {moths.map(m => (
          <g key={m.id}>
            <circle cx={m.startX} cy="8" r="0.8" fill="#e2e8f0" opacity="0.6">
              <animateTransform attributeName="transform" type="translate"
                values={`0,0; 3,-4; -2,-7; 4,-3; 0,0`} dur="2s" begin={`${m.delay}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}

        {/* Health indicator - crack effect when low */}
        {isFaulty && (
          <>
            <line x1="35" y1="3" x2="42" y2="7" stroke="#f43f5e" strokeWidth="0.5" opacity="0.6" />
            <line x1="78" y1="4" x2="83" y2="6" stroke="#f43f5e" strokeWidth="0.5" opacity="0.6" />
          </>
        )}
      </svg>

      {/* Status badge */}
      <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider"
        style={{ 
          backgroundColor: isOn ? `${color}20` : '#1e293b80',
          color: isOn ? color : '#64748b',
          border: `1px solid ${isOn ? color + '40' : '#334155'}`
        }}>
        {status.replace('_', ' ')}
      </div>
    </div>
  );
}