import React, { useEffect, useState } from 'react';
import { ShieldCheck, Zap, Radio, MapPin, CheckCircle2 } from 'lucide-react';

interface SplashLaunchScreenProps {
  onComplete: () => void;
}

export const SplashLaunchScreen: React.FC<SplashLaunchScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(15);
  const [statusText, setStatusText] = useState('Initializing Aegis Quantum Protocol...');
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setProgress(45);
      setStatusText('Syncing PostGIS Hyperlocal Radar (Bengaluru 12.9784° N, 77.6408° E)...');
    }, 600);

    const timer2 = setTimeout(() => {
      setProgress(80);
      setStatusText('Locking Verified Trade Master Directory & INR Escrow Vault...');
    }, 1300);

    const timer3 = setTimeout(() => {
      setProgress(100);
      setStatusText('AegisCraft Core Engine Ready • Dispatch Online');
    }, 2000);

    const fadeTimer = setTimeout(() => {
      setFadingOut(true);
    }, 2400);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 transition-opacity duration-500 overflow-hidden select-none ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        backgroundImage: `
          radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.14) 0%, transparent 60%),
          radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.10) 0%, transparent 50%),
          radial-gradient(circle at 20% 80%, rgba(6, 182, 212, 0.08) 0%, transparent 50%)
        `,
      }}
    >
      {/* Background Animated Ripples */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute w-[240px] h-[240px] rounded-full border border-emerald-500/30 animate-ping opacity-25" style={{ animationDuration: '2.5s' }} />
        <div className="absolute w-[420px] h-[420px] rounded-full border border-emerald-500/20 animate-pulse opacity-40" />
        <div className="absolute w-[600px] h-[600px] rounded-full border border-amber-500/15" />
        <div className="absolute w-[800px] h-[800px] rounded-full border border-slate-800/80" />
      </div>

      {/* Center Liquid-Glass Shield Branding */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center max-w-lg">
        {/* Glow emblem */}
        <div className="relative mb-6">
          <div className="absolute -inset-3 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-2xl blur-xl opacity-60 animate-pulse" />
          <div className="relative w-24 h-24 rounded-2xl bg-slate-900/90 border border-emerald-500/40 backdrop-blur-xl flex items-center justify-center shadow-2xl shadow-emerald-950/80">
            <ShieldCheck className="w-12 h-12 text-emerald-400 animate-bounce" style={{ animationDuration: '2s' }} />
            <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-amber-400 animate-ping" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
          AEGIS<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400">CRAFT</span>
        </h1>
        <p className="text-xs uppercase tracking-[0.25em] font-mono text-emerald-400/90 font-semibold mb-4">
          Autonomous Blue-Collar Management Platform
        </p>

        <p className="text-xs text-slate-400 max-w-sm font-sans mb-7 leading-relaxed">
          Bharat Hyperlocal ST_DWithin Radar • Dynamic ₹ Escrow Vault • Dual-Signoff Protocol
        </p>

        {/* Liquid Glass Progress Bar */}
        <div className="w-full bg-slate-900/80 border border-slate-800 rounded-full h-2 p-0.5 mb-3 overflow-hidden shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 transition-all duration-500 ease-out shadow-sm"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Dynamic Telemetry Status */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-6">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="truncate">{statusText}</span>
        </div>

        {/* Quick specs pill */}
        <div className="grid grid-cols-3 gap-2 w-full text-[11px] font-mono text-slate-400">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-2 flex flex-col items-center">
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> INR (₹)
            </span>
            <span className="text-[10px] text-slate-500">Live Escrow</span>
          </div>
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-2 flex flex-col items-center">
            <span className="text-teal-400 font-semibold flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Bengaluru
            </span>
            <span className="text-[10px] text-slate-500">PostGIS ST_DWithin</span>
          </div>
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-2 flex flex-col items-center">
            <span className="text-amber-400 font-semibold flex items-center gap-1">
              <Zap className="w-3 h-3" /> +91 KYC
            </span>
            <span className="text-[10px] text-slate-500">Verified Pros</span>
          </div>
        </div>

        {/* Skip button if in a rush */}
        <button
          onClick={onComplete}
          className="mt-6 text-xs text-slate-500 hover:text-slate-300 transition-colors underline underline-offset-4 cursor-pointer"
        >
          Skip Launch Sequence &rarr;
        </button>
      </div>
    </div>
  );
};
