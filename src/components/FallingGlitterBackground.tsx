import React, { useMemo } from 'react';

interface Particle {
  id: number;
  type: 'star' | 'glitter' | 'emerald';
  left: number; // percentage
  size: number; // px
  duration: number; // seconds
  delay: number; // seconds
  opacity: number;
  driftX: number; // px horizontal drift
  color: string;
}

export const FallingGlitterBackground: React.FC = () => {
  // Pre-calculate deterministic particle values once to eliminate re-renders
  const particles = useMemo<Particle[]>(() => {
    const list: Particle[] = [];
    const count = 28;

    for (let i = 0; i < count; i++) {
      const isStar = i % 3 === 0;
      const isEmerald = i % 5 === 0 && !isStar;
      const type: 'star' | 'glitter' | 'emerald' = isStar ? 'star' : isEmerald ? 'emerald' : 'glitter';

      let color = '#F59E0B'; // Gold default
      if (type === 'star') color = '#D4B878'; // Champagne Gold
      else if (type === 'emerald') color = '#10B981'; // Emerald

      list.push({
        id: i,
        type,
        left: Math.round((i * 3.5 + (i * 17) % 20) % 96 + 2),
        size: isStar ? 12 + (i % 5) * 2 : 4 + (i % 4) * 2,
        duration: 10 + (i % 7) * 2.2,
        delay: -((i * 3.7) % 18), // Negative delay so particles are immediately spread vertically
        opacity: 0.4 + (i % 5) * 0.12,
        driftX: -25 + (i % 6) * 10,
        color,
      });
    }
    return list;
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Base Shifting Deep Dark Blue-Green Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b1326] via-[#081b29] to-[#041d1a] animate-aurora opacity-95"></div>

      {/* Subtle Aurora Ambient Glows */}
      <div className="absolute -top-20 left-1/4 w-[36rem] h-[36rem] bg-emerald-500/10 rounded-full blur-[140px] animate-float-orb-1"></div>
      <div className="absolute top-1/3 -right-20 w-[32rem] h-[32rem] bg-amber-500/10 rounded-full blur-[150px] animate-float-orb-2"></div>

      {/* GPU-Accelerated Falling Stars & Glitter Particles */}
      <div className="absolute inset-0">
        {particles.map((p) => {
          return (
            <div
              key={p.id}
              className="absolute pointer-events-none will-change-transform"
              style={{
                left: `${p.left}%`,
                top: 0,
                width: `${p.size}px`,
                height: `${p.size}px`,
                color: p.color,
                animation: `fallGlitter ${p.duration}s linear infinite, particleTwinkle 3s ease-in-out infinite`,
                animationDelay: `${p.delay}s, ${p.id * 0.4}s`,
                '--particle-opacity': p.opacity,
                '--drift-x': `${p.driftX}px`,
              } as React.CSSProperties}
            >
              {p.type === 'star' ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-full h-full drop-shadow-[0_0_6px_currentColor]"
                >
                  <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
                </svg>
              ) : p.type === 'emerald' ? (
                <div
                  className="w-full h-full rounded-full bg-[#10B981] drop-shadow-[0_0_8px_#10B981]"
                  style={{ opacity: p.opacity }}
                />
              ) : (
                <div
                  className="w-full h-full rounded-full bg-gradient-to-r from-[#F59E0B] to-[#D4B878] drop-shadow-[0_0_6px_#F59E0B]"
                  style={{ opacity: p.opacity }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Subtle Network Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:36px_36px] opacity-[0.04]"></div>
    </div>
  );
};
