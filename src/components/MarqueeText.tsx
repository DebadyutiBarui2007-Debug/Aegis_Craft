import React from 'react';

export interface MarqueeTextProps {
  className?: string;
  speedSeconds?: number;
}

export const MarqueeText: React.FC<MarqueeTextProps> = ({
  className = '',
  speedSeconds = 42,
}) => {
  const marqueeItems = [
    'Discover Local Services',
    'Connect with Skilled Workers',
    'Transparent Offers',
    'Real-Time Job Updates',
    'Built for India',
    'PostGIS Radar: Bengaluru Sector 4 (12.9784° N, 77.6408° E)',
    'SSE Live Sync: Connected (14ms)',
    'INR Escrow: Bank-Guaranteed Vault',
    'IST Node Online',
    'Police Verification: Passed',
  ];

  return (
    <div
      className={`w-full overflow-hidden relative z-20 py-2.5 bg-[#0a1628]/90 backdrop-blur-md border-y border-[#10b981]/20 shadow-lg ${className}`}
      aria-label="Platform Highlights Marquee"
    >
      <div
        className="flex w-max animate-marquee whitespace-nowrap items-center gap-6 md:gap-10 hover:[animation-play-state:paused]"
        style={{ animationDuration: `${speedSeconds}s` }}
      >
        {/* Quadruple duplication to ensure smooth, seamless infinite loop without gaps */}
        {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((text, idx) => (
          <div key={idx} className="flex items-center gap-3 shrink-0 transform-gpu">
            <span className="text-xs md:text-sm font-semibold tracking-wide font-mono text-[#a7f3d0] marquee-glow-text">
              {text}
            </span>
            <span className="text-[#f59e0b] text-xs font-bold px-1 select-none">
              ✦
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
