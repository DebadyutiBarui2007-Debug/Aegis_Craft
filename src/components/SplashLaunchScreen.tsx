import React, { useEffect, useState } from 'react';
import { ShieldCheck, Zap, Radio, MapPin, CheckCircle2 } from 'lucide-react';

interface SplashLaunchScreenProps {
  onComplete: () => void;
}

export const SplashLaunchScreen: React.FC<SplashLaunchScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(15);
  const [statusText, setStatusText] = useState('Initializing Aegis Hyperlocal Protocol...');
  const [isOpeningShutter, setIsOpeningShutter] = useState(false);

  useEffect(() => {
    // 0.5s: Progress to 55%
    const timer1 = setTimeout(() => {
      setProgress(55);
      setStatusText('Establishing Secure SSL / SSE Live Sync Node...');
    }, 500);

    // 1.1s: Progress to 88%
    const timer2 = setTimeout(() => {
      setProgress(88);
      setStatusText('Locking Verified Trade Master Directory & ₹ Escrow Vault...');
    }, 1100);

    // 1.7s: Progress to 100%
    const timer3 = setTimeout(() => {
      setProgress(100);
      setStatusText('Shutter Release • Opening Aegis Dispatch Interface...');
    }, 1700);

    // 1.9s: Trigger Camera Shutter Aperture Release
    const timer4 = setTimeout(() => {
      setIsOpeningShutter(true);
    }, 1900);

    // 2.5s: Complete transition sequence (Max <= 3 seconds)
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden select-none bg-[#060e20] pointer-events-auto">
      {/* Aperture Iris Mask Container */}
      <div
        className={`relative w-full h-full flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${
          isOpeningShutter ? 'scale-125 opacity-0' : 'scale-100 opacity-100'
        }`}
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.18) 0%, transparent 60%),
            radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 20% 80%, rgba(14, 165, 233, 0.10) 0%, transparent 50%)
          `,
        }}
      >
        {/* Shutter Blade Graphic Overlays */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          {/* Radial Aperture Guide Lines */}
          <div
            className={`w-[120vw] h-[120vw] max-w-[1200px] max-h-[1200px] rounded-full border-2 border-emerald-500/20 transition-transform duration-700 ease-out ${
              isOpeningShutter ? 'rotate-90 scale-150 border-emerald-400/80' : 'animate-spin-slow'
            }`}
            style={{ animationDuration: '20s' }}
          />
          <div
            className={`absolute w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full border border-amber-500/20 transition-all duration-700 ease-out ${
              isOpeningShutter ? '-rotate-90 scale-150 border-amber-400/80' : ''
            }`}
          />
          <div className="absolute w-[500px] h-[500px] rounded-full border border-teal-500/25 animate-pulse" />

          {/* 6 Iris Shutter Blades (Opening circularly outward) */}
          <div className="absolute inset-0 flex items-center justify-center">
            {[0, 60, 120, 180, 240, 300].map((angle, idx) => (
              <div
                key={idx}
                className="absolute origin-center transition-transform duration-700 ease-in-out"
                style={{
                  transform: `rotate(${angle}deg) ${
                    isOpeningShutter ? 'translateY(-120vh) scale(0.2)' : 'translateY(0) scale(1)'
                  }`,
                }}
              >
                <div className="w-[300px] h-[600px] bg-gradient-to-b from-slate-900 via-slate-950 to-[#060e20] border-r border-emerald-500/30 opacity-90 shadow-2xl clip-shutter-blade" />
              </div>
            ))}
          </div>
        </div>

        {/* Center Liquid-Glass Shield Branding */}
        <div className="relative z-20 flex flex-col items-center px-6 text-center max-w-lg">
          {/* Aegis Shield Emblem */}
          <div className="relative mb-5">
            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-500 rounded-2xl blur-xl opacity-70 animate-pulse" />
            <div className="relative w-24 h-24 rounded-2xl bg-slate-900/90 border border-emerald-500/50 backdrop-blur-xl flex items-center justify-center shadow-2xl shadow-emerald-950">
              <ShieldCheck className={`w-12 h-12 text-emerald-400 transition-transform duration-500 ${isOpeningShutter ? 'scale-125 text-amber-400' : 'animate-bounce'}`} style={{ animationDuration: '2s' }} />
              <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-amber-400 animate-ping" />
            </div>
          </div>

          {/* Platform Title */}
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-1.5">
            AEGIS<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400">CRAFT</span>
          </h1>
          <p className="text-[11px] uppercase tracking-[0.25em] font-mono text-emerald-400 font-semibold mb-4">
            Hyperlocal Blue-Collar Dispatch Engine
          </p>

          <p className="text-xs text-slate-300 max-w-sm font-sans mb-6 leading-relaxed">
            Real-Time Live Bidding • Bank-Guaranteed Escrow • Verified Professional Matching
          </p>

          {/* Liquid Glass Progress Bar */}
          <div className="w-full bg-slate-900/90 border border-slate-700/80 rounded-full h-2.5 p-0.5 mb-3 overflow-hidden shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 transition-all duration-300 ease-out shadow-md"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Dynamic Telemetry Status */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300 mb-6">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="truncate">{statusText}</span>
          </div>

          {/* Quick Specs Cards */}
          <div className="grid grid-cols-3 gap-2 w-full text-[11px] font-mono text-slate-300">
            <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2 flex flex-col items-center">
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> INR (₹)
              </span>
              <span className="text-[10px] text-slate-400">Escrow Vault</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2 flex flex-col items-center">
              <span className="text-teal-400 font-semibold flex items-center gap-1">
                <Zap className="w-3 h-3" /> Live Bids
              </span>
              <span className="text-[10px] text-slate-400">Real-Time Match</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2 flex flex-col items-center">
              <span className="text-amber-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> KYC Pro
              </span>
              <span className="text-[10px] text-slate-400">Verified Trades</span>
            </div>
          </div>

          {/* Skip button */}
          <button
            onClick={onComplete}
            type="button"
            className="mt-5 text-xs text-slate-400 hover:text-white transition-colors underline underline-offset-4 cursor-pointer"
          >
            Launch Main Interface &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
