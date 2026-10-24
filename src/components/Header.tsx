import React from 'react';
import { User } from '../types/index.ts';

interface HeaderProps {
  currentUser: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSos: () => void;
  onRoleSwitch: (role: 'customer' | 'worker_pro') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenSos,
  onRoleSwitch,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#060e20]/80 backdrop-blur-2xl shadow-[0_4px_24px_rgba(0,0,0,0.45)] border-b border-white/5">
      <div className="h-20 max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 flex items-center justify-between gap-4">
        {/* Brand Emblem */}
        <div className="flex items-center gap-4">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setActiveTab('discovery')}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#0ea5e9] to-[#4edea3] flex items-center justify-center text-[#060e20] shadow-[0_0_16px_rgba(78,222,163,0.4)]">
              <span className="material-symbols-outlined text-xl font-bold">shield</span>
            </div>
            <span className="font-title-screen text-2xl font-bold tracking-tight text-white group-hover:text-[#89ceff] transition-colors">
              AegisCraft
            </span>
          </div>

          <div className="hidden xl:flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#4edea3]/15 text-[#4edea3] font-caption-caps text-[11px] font-semibold tracking-wider uppercase border border-[#4edea3]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
              KYC Verified Network
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ffb95f]/15 text-[#ffb95f] font-caption-caps text-[11px] font-semibold tracking-wider uppercase border border-[#ffb95f]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffb95f] shadow-[0_0_8px_rgba(255,185,95,0.8)]"></span>
              Dispatch Live
            </div>
          </div>
        </div>

        {/* Role Switcher Pill */}
        <div className="hidden lg:flex items-center p-1 rounded-full bg-[#222a3d]/90 border border-white/10">
          <button
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              currentUser.role === 'customer'
                ? 'bg-[#171f33] text-[#89ceff] shadow-[0_2px_8px_rgba(0,0,0,0.3)]'
                : 'text-[#bec8d2] hover:text-white'
            }`}
            onClick={() => onRoleSwitch('customer')}
            type="button"
          >
            Customer View
          </button>
          <button
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              currentUser.role === 'worker_pro'
                ? 'bg-[#171f33] text-[#4edea3] shadow-[0_2px_8px_rgba(0,0,0,0.3)]'
                : 'text-[#bec8d2] hover:text-white'
            }`}
            onClick={() => onRoleSwitch('worker_pro')}
            type="button"
          >
            <span className="w-2 h-2 rounded-full bg-[#4edea3]"></span>
            Worker Pro Terminal
          </button>
        </div>

        {/* Nav tabs */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => setActiveTab('discovery')}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'discovery'
                ? 'bg-[#222a3d] text-[#89ceff] shadow-[0_0_16px_rgba(14,165,233,0.25)] border border-[#89ceff]/20'
                : 'text-[#bec8d2] hover:text-white hover:bg-white/5'
            }`}
          >
            Service Discovery
          </button>
          <button
            onClick={() => setActiveTab('radar')}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'radar'
                ? 'bg-[#222a3d] text-[#89ceff] shadow-[0_0_16px_rgba(14,165,233,0.25)] border border-[#89ceff]/20'
                : 'text-[#bec8d2] hover:text-white hover:bg-white/5'
            }`}
          >
            Radar Matching &amp; Jobs
          </button>
          <button
            onClick={() => setActiveTab('bidding')}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'bidding'
                ? 'bg-[#222a3d] text-[#89ceff] shadow-[0_0_16px_rgba(14,165,233,0.25)] border border-[#89ceff]/20'
                : 'text-[#bec8d2] hover:text-white hover:bg-white/5'
            }`}
          >
            Live Bidding &amp; Negotiation
          </button>
          <button
            onClick={() => setActiveTab('tracking')}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'tracking'
                ? 'bg-[#222a3d] text-[#89ceff] shadow-[0_0_16px_rgba(14,165,233,0.25)] border border-[#89ceff]/20'
                : 'text-[#bec8d2] hover:text-white hover:bg-white/5'
            }`}
          >
            Active Job &amp; GPS Tracking
          </button>
          <button
            onClick={() => setActiveTab('mcp')}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'mcp'
                ? 'bg-[#222a3d] text-[#ffb95f] shadow-[0_0_16px_rgba(255,185,95,0.25)] border border-[#ffb95f]/30'
                : 'text-[#bec8d2] hover:text-[#ffb95f] hover:bg-white/5'
            }`}
          >
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">smart_toy</span>
              MCP Studio
            </span>
          </button>
        </nav>

        {/* SOS Action & Profile */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSos}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#93000a]/40 text-[#ffb4ab] border border-[#ffb4ab]/30 hover:bg-[#93000a]/70 transition-colors shadow-[0_0_12px_rgba(255,180,171,0.3)] active:scale-95"
            type="button"
          >
            <span className="w-2 h-2 rounded-full bg-[#ffb4ab] animate-ping"></span>
            <span className="text-xs font-bold uppercase tracking-wider">SOS Ready</span>
          </button>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#d88a00]/15 text-[#ffb95f] text-xs font-medium border border-[#ffb95f]/20">
            <span className="material-symbols-outlined text-sm">support_agent</span>
            24/7 Hotline
          </div>

          <div className="flex items-center gap-2 pl-2 border-l border-white/10">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-semibold text-white">{currentUser.name}</span>
              <span className="text-[10px] text-[#4edea3]">
                {currentUser.role === 'worker_pro' ? 'Master Tech • Online' : 'Client • Springfield'}
              </span>
            </div>
            <div className="relative">
              <img
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#4edea3]/50"
                src={currentUser.avatar}
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#4edea3] ring-2 ring-[#060e20]"></span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Telemetry Bar */}
      <div className="w-full bg-[#060e20]/95 backdrop-blur-md px-4 md:px-8 lg:px-12 py-1.5 border-t border-white/5">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between text-[#bec8d2] text-xs overflow-x-auto whitespace-nowrap gap-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[#4edea3]">
              <span className="material-symbols-outlined text-sm">radar</span>
              PostGIS Query: Active (3.2 km radius)
            </span>
            <span className="text-[#3e4850]">•</span>
            <span className="flex items-center gap-1 text-[#89ceff]">
              <span className="material-symbols-outlined text-sm">bolt</span>
              SSE Live Sync: Connected
            </span>
            <span className="text-[#3e4850]">•</span>
            <span className="flex items-center gap-1 text-[#ffb95f]">
              <span className="material-symbols-outlined text-sm">satellite_alt</span>
              High-Precision GPS: Synchronized (±1.4m)
            </span>
          </div>
          <div className="hidden lg:flex items-center gap-3 text-[#88929b]">
            <span>Latency: 14ms</span>
            <span>•</span>
            <span className="text-[#4edea3]">Escrow Vault: Guaranteed</span>
          </div>
        </div>
      </div>
    </header>
  );
};
