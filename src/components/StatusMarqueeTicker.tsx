import React from 'react';

export const StatusMarqueeTicker: React.FC = () => {
  const tickerItems = [
    { icon: 'radar', color: 'text-[#4edea3]', label: 'PostGIS Radar: Bengaluru Sector 4 (12.9784° N, 77.6408° E)' },
    { icon: 'bolt', color: 'text-[#89ceff]', label: 'SSE Live Sync: Connected (14ms latency)' },
    { icon: 'account_balance_wallet', color: 'text-[#ffb95f]', label: 'INR Escrow: Bank-Guaranteed Vault (₹25k Warranty)' },
    { icon: 'schedule', color: 'text-[#4edea3]', label: 'IST Node Online & Synchronized' },
    { icon: 'verified', color: 'text-[#6ffbbe]', label: 'Police Verification: 100% Passed' },
    { icon: 'satellite_alt', color: 'text-[#89ceff]', label: '5G RTK Vector Telemetry Active' },
    { icon: 'emergency', color: 'text-[#ffb4ab]', label: '112 ERSS National Interconnect Ready' },
  ];

  return (
    <div className="w-full bg-[#0d162d]/90 border-y border-white/10 overflow-hidden relative z-20 py-2 shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)]">
      <div className="flex w-max animate-marquee whitespace-nowrap items-center gap-8 px-4">
        {/* Render multiple times for seamless infinite marquee loop */}
        {[...tickerItems, ...tickerItems, ...tickerItems].map((item, index) => (
          <div key={index} className="flex items-center gap-2.5 shrink-0 px-3 py-1 rounded-lg bg-[#171f33]/60 border border-white/5 shadow-sm">
            <span className={`material-symbols-outlined text-base ${item.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>
              {item.icon}
            </span>
            <span className="text-xs font-medium text-[#dae2fd] tracking-wide font-mono">
              {item.label}
            </span>
            <span className="text-white/20 mx-2">•</span>
          </div>
        ))}
      </div>
    </div>
  );
};
