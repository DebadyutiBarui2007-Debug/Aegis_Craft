import React from 'react';

export const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
      {/* Base Shifting Aurora Gradient Mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#064e3b]/40 to-[#022c22] animate-aurora opacity-95"></div>

      {/* Floating Emerald Light Field */}
      <div className="absolute top-[-10%] left-[15%] w-[42rem] h-[42rem] bg-gradient-to-br from-[#10b981]/25 via-[#a7f3d0]/15 to-transparent rounded-full blur-[130px] animate-float-orb-1"></div>

      {/* Floating Sky Blue & Champagne Gold Highlight */}
      <div className="absolute top-[35%] right-[5%] w-[38rem] h-[38rem] bg-gradient-to-tr from-[#0ea5e9]/20 via-[#f59e0b]/15 to-transparent rounded-full blur-[150px] animate-float-orb-2"></div>

      {/* Floating Bottom Sage & Forest Mesh */}
      <div className="absolute bottom-[-10%] left-[30%] w-[48rem] h-[48rem] bg-gradient-to-r from-[#10b981]/20 via-[#064e3b]/30 to-[#a7f3d0]/10 rounded-full blur-[160px] animate-float-orb-1"></div>

      {/* Local Connection Circular Radar Ripples */}
      <div className="absolute top-[25%] left-[20%] w-[28rem] h-[28rem] rounded-full border border-[#10b981]/20 animate-ping opacity-25"></div>
      <div className="absolute top-[25%] left-[20%] w-[42rem] h-[42rem] rounded-full border border-[#f59e0b]/15 animate-ping opacity-15" style={{ animationDuration: '6s', animationDelay: '1.5s' }}></div>

      {/* Subtle Liquid Glass Mesh Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.06]"></div>
    </div>
  );
};
