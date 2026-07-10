export default function AmbientBackground({ weather }) {
  const isStorm = weather === 'STORM';
  const isRain = weather === 'RAIN';
  const isFog = weather === 'FOGGY';

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Base ambient orbs */}
      <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-amber-500/[0.03] blur-[150px] animate-pulse-slow" />
      <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-sky-500/[0.03] blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      
      {/* Weather overlays */}
      {isStorm && (
        <div className="absolute inset-0 animate-lightning bg-white/5" />
      )}
      
      {isFog && (
        <div className="absolute inset-0 bg-gradient-to-b from-slate-400/5 to-transparent animate-fog" />
      )}

      {/* Rain drops */}
      {(isRain || isStorm) && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div key={i}
              className="absolute w-px bg-sky-400/20 animate-rain"
              style={{
                left: `${5 + (i * 4.7) % 90}%`,
                height: `${10 + (i % 3) * 5}px`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${0.5 + (i % 3) * 0.2}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(148,163,184,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.8) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }}
      />

      {/* Floating dust particles */}
      {[...Array(8)].map((_, i) => (
        <div key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-amber-400/30 animate-float"
          style={{
            left: `${15 + (i * 11) % 70}%`,
            top: `${20 + (i * 17) % 60}%`,
            animationDelay: `${i * 0.7}s`,
            animationDuration: `${5 + (i % 4)}s`
          }}
        />
      ))}
    </div>
  );
}