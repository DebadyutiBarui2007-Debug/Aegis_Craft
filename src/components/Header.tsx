import React from 'react';
import { User } from '../types/index.ts';

interface HeaderProps {
  currentUser: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSos: () => void;
  onRoleSwitch: (role: 'customer' | 'worker_pro') => void;
  onOpenAuth?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenSos,
  onRoleSwitch,
  onOpenAuth,
  onLogout,
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
            <div className="flex flex-col">
              <span className="font-title-screen text-xl md:text-2xl font-bold tracking-tight text-white group-hover:text-[#89ceff] transition-colors leading-none">
                AegisCraft
              </span>
              <span className="text-[10px] text-[#4edea3] font-mono tracking-wider">BHARAT HYPERLOCAL</span>
            </div>
          </div>

          <div className="hidden xl:flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#4edea3]/15 text-[#4edea3] font-caption-caps text-[11px] font-semibold tracking-wider uppercase border border-[#4edea3]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
              +91 KYC Network
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ffb95f]/15 text-[#ffb95f] font-caption-caps text-[11px] font-semibold tracking-wider uppercase border border-[#ffb95f]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffb95f] shadow-[0_0_8px_rgba(255,185,95,0.8)]"></span>
              ₹ Escrow Active
            </div>
          </div>
        </div>

        {/* Role Switcher Pill */}
        <div className="hidden lg:flex items-center p-1 rounded-full bg-[#222a3d]/90 border border-white/10">
          <button
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
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
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
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
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
              activeTab === 'discovery'
                ? 'bg-[#222a3d] text-[#89ceff] shadow-[0_0_16px_rgba(14,165,233,0.25)] border border-[#89ceff]/20'
                : 'text-[#bec8d2] hover:text-white hover:bg-white/5'
            }`}
          >
            Service Discovery
          </button>
          <button
            onClick={() => setActiveTab('radar')}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
              activeTab === 'radar'
                ? 'bg-[#222a3d] text-[#89ceff] shadow-[0_0_16px_rgba(14,165,233,0.25)] border border-[#89ceff]/20'
                : 'text-[#bec8d2] hover:text-white hover:bg-white/5'
            }`}
          >
            Radar Matching
          </button>
          <button
            onClick={() => setActiveTab('bidding')}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
              activeTab === 'bidding'
                ? 'bg-[#222a3d] text-[#89ceff] shadow-[0_0_16px_rgba(14,165,233,0.25)] border border-[#89ceff]/20'
                : 'text-[#bec8d2] hover:text-white hover:bg-white/5'
            }`}
          >
            Live Bidding
          </button>
          <button
            onClick={() => setActiveTab('tracking')}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
              activeTab === 'tracking'
                ? 'bg-[#222a3d] text-[#89ceff] shadow-[0_0_16px_rgba(14,165,233,0.25)] border border-[#89ceff]/20'
                : 'text-[#bec8d2] hover:text-white hover:bg-white/5'
            }`}
          >
            Active Job &amp; GPS
          </button>
          <button
            onClick={() => setActiveTab('mcp')}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
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

        {/* Actions & Profile */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenSos}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#93000a]/50 text-[#ffb4ab] border border-[#ffb4ab]/40 hover:bg-[#93000a]/80 transition-colors shadow-[0_0_14px_rgba(255,180,171,0.35)] active:scale-95 cursor-pointer"
            type="button"
            title="Emergency SOS (112 India Dispatched)"
          >
            <span className="w-2 h-2 rounded-full bg-[#ffb4ab] animate-ping"></span>
            <span className="text-xs font-bold uppercase tracking-wider">112 SOS</span>
          </button>

          {/* Auth / Account Switcher Button */}
          {onOpenAuth && (
            <button
              onClick={onOpenAuth}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-slate-200 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
              type="button"
              title="Authentication & Role Management"
            >
              <span className="material-symbols-outlined text-sm text-[#4edea3]">manage_accounts</span>
              <span className="hidden sm:inline">Switch Account</span>
            </button>
          )}

          <div className="flex items-center gap-2 pl-2 border-l border-white/10">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-semibold text-white leading-tight">{currentUser.name}</span>
              <span className="text-[10px] text-[#4edea3]">
                {currentUser.role === 'worker_pro' ? 'Master Tech • Grade A' : 'Bengaluru (560038)'}
              </span>
            </div>
            <div
              className="relative cursor-pointer"
              onClick={onOpenAuth}
              title="Click to view profile or sign in"
            >
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
              PostGIS Radar: Bengaluru Sector 4 (12.9784° N, 77.6408° E)
            </span>
            <span className="text-[#3e4850]">•</span>
            <span className="flex items-center gap-1 text-[#89ceff]">
              <span className="material-symbols-outlined text-sm">bolt</span>
              SSE Live Sync: Connected (14ms)
            </span>
            <span className="text-[#3e4850]">•</span>
            <span className="flex items-center gap-1 text-[#ffb95f]">
              <span className="material-symbols-outlined text-sm">currency_rupee</span>
              INR Escrow: Bank-Guaranteed Vault
            </span>
          </div>
          <div className="hidden lg:flex items-center gap-3 text-[#88929b]">
            <span className="text-emerald-400 font-mono">IST Node Online</span>
            <span>•</span>
            <span className="text-[#4edea3]">Police Verification: Passed</span>
          </div>
        </div>
      </div>
    </header>
  );
};
