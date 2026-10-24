import React, { useState } from 'react';
import { User } from '../types/index.ts';

interface HeaderProps {
  currentUser: User | null;
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isCustomer = currentUser?.role === 'customer';
  const isWorker = currentUser?.role === 'worker_pro';

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#060e20]/95 backdrop-blur-2xl shadow-[0_4px_24px_rgba(0,0,0,0.45)] border-b border-white/10">
      <div className="h-16 md:h-20 max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 flex items-center justify-between gap-3">
        {/* Zone 1: Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            className="flex items-center gap-2 cursor-pointer group shrink-0"
            onClick={() => handleNavClick(isWorker ? 'worker' : 'discovery')}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#0ea5e9] to-[#4edea3] flex items-center justify-center text-[#060e20] shadow-[0_0_16px_rgba(78,222,163,0.4)] shrink-0">
              <span className="material-symbols-outlined text-xl font-bold">shield</span>
            </div>
            <div className="flex flex-col shrink-0">
              <span className="font-title-screen text-base md:text-xl font-bold tracking-tight text-white group-hover:text-[#89ceff] transition-colors leading-none whitespace-nowrap">
                AegisCraft
              </span>
              <span className="text-[9px] md:text-[10px] text-[#4edea3] font-mono tracking-wider whitespace-nowrap">
                BHARAT {isWorker ? 'WORKER PRO' : 'CUSTOMER'}
              </span>
            </div>
          </div>
        </div>

        {/* Zone 2: Desktop Navigation Links (Visible on 2XL >= 1400px to prevent any overcrowding) */}
        <nav className="hidden 2xl:flex items-center gap-1 shrink-0">
          {(!currentUser || isCustomer) && (
            <>
              <button
                onClick={() => handleNavClick('discovery')}
                className={`px-3 py-2 text-xs xl:text-sm font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'discovery'
                    ? 'bg-[#222a3d] text-[#89ceff] shadow-[0_0_16px_rgba(14,165,233,0.25)] border border-[#89ceff]/20 font-bold'
                    : 'text-[#bec8d2] hover:text-white hover:bg-white/5'
                }`}
              >
                Service Discovery
              </button>
              <button
                onClick={() => handleNavClick('radar')}
                className={`px-3 py-2 text-xs xl:text-sm font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'radar'
                    ? 'bg-[#222a3d] text-[#89ceff] shadow-[0_0_16px_rgba(14,165,233,0.25)] border border-[#89ceff]/20 font-bold'
                    : 'text-[#bec8d2] hover:text-white hover:bg-white/5'
                }`}
              >
                Radar Matching
              </button>
              <button
                onClick={() => handleNavClick('bidding')}
                className={`px-3 py-2 text-xs xl:text-sm font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'bidding'
                    ? 'bg-[#222a3d] text-[#89ceff] shadow-[0_0_16px_rgba(14,165,233,0.25)] border border-[#89ceff]/20 font-bold'
                    : 'text-[#bec8d2] hover:text-white hover:bg-white/5'
                }`}
              >
                Live Bidding
              </button>
            </>
          )}

          {isWorker && (
            <button
              onClick={() => handleNavClick('worker')}
              className={`px-3 py-2 text-xs xl:text-sm font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'worker'
                  ? 'bg-[#222a3d] text-[#4edea3] shadow-[0_0_16px_rgba(78,222,163,0.25)] border border-[#4edea3]/30 font-bold'
                  : 'text-[#bec8d2] hover:text-white hover:bg-white/5'
              }`}
            >
              Worker Pro Terminal
            </button>
          )}

          <button
            onClick={() => handleNavClick('tracking')}
            className={`px-3 py-2 text-xs xl:text-sm font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'tracking'
                ? 'bg-[#222a3d] text-[#89ceff] shadow-[0_0_16px_rgba(14,165,233,0.25)] border border-[#89ceff]/20 font-bold'
                : 'text-[#bec8d2] hover:text-white hover:bg-white/5'
            }`}
          >
            Active Job &amp; GPS
          </button>
          <button
            onClick={() => handleNavClick('mcp')}
            className={`px-3 py-2 text-xs xl:text-sm font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'mcp'
                ? 'bg-[#222a3d] text-[#ffb95f] shadow-[0_0_16px_rgba(255,185,95,0.25)] border border-[#ffb95f]/30 font-bold'
                : 'text-[#bec8d2] hover:text-[#ffb95f] hover:bg-white/5'
            }`}
          >
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">smart_toy</span>
              MCP Studio
            </span>
          </button>
        </nav>

        {/* Zone 3: Actions & Account Profile */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Emergency SOS */}
          <button
            onClick={onOpenSos}
            className="flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 rounded-full bg-[#93000a]/50 text-[#ffb4ab] border border-[#ffb4ab]/40 hover:bg-[#93000a]/80 transition-colors shadow-[0_0_14px_rgba(255,180,171,0.35)] active:scale-95 cursor-pointer shrink-0"
            type="button"
            title="Emergency SOS (112 India Dispatched)"
          >
            <span className="w-2 h-2 rounded-full bg-[#ffb4ab] animate-ping"></span>
            <span className="text-[11px] md:text-xs font-bold uppercase tracking-wider whitespace-nowrap">112 SOS</span>
          </button>

          {/* Account Profile Pill Button */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 p-1 md:p-1.5 md:pl-2.5 rounded-xl bg-[#171f33]/90 hover:bg-[#222a3d] border border-white/10 hover:border-[#4edea3]/40 text-left transition-all cursor-pointer shrink-0"
            type="button"
            title="Account Settings & Role Switcher"
          >
            <div className="hidden sm:flex flex-col text-right max-w-[100px] md:max-w-[120px] leading-tight shrink-0">
              <span className="text-xs font-bold text-white truncate">
                {currentUser?.name || 'Account'}
              </span>
              <span className="text-[10px] text-[#4edea3] truncate font-mono">
                {currentUser ? (isWorker ? 'Worker Pro' : 'Customer') : 'Portal'}
              </span>
            </div>
            <div className="relative w-7 h-7 md:w-8 md:h-8 rounded-lg bg-[#060e20] ring-1 ring-[#4edea3]/50 flex items-center justify-center overflow-hidden shrink-0">
              {currentUser?.avatar ? (
                <img alt={currentUser.name} className="w-full h-full object-cover shrink-0" src={currentUser.avatar} />
              ) : (
                <span className="material-symbols-outlined text-base md:text-lg text-[#4edea3]">person</span>
              )}
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#4edea3] ring-1 ring-[#060e20]"></span>
            </div>
          </button>

          {/* Mobile/Tablet Menu Hamburger Button (< 1400px) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="2xl:hidden p-2 rounded-lg bg-[#171f33] border border-white/10 text-white hover:text-[#4edea3] transition-colors shrink-0 cursor-pointer"
            type="button"
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined text-xl">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile / Tablet / Laptop Slide-Down Navigation Drawer (< 1400px) */}
      {isMobileMenuOpen && (
        <div className="2xl:hidden bg-[#0a1224]/98 backdrop-blur-2xl border-b border-white/10 px-4 py-4 shadow-2xl animate-fade-in space-y-4">
          {/* Quick Role Switcher */}
          {currentUser && (
            <div className="p-1 rounded-xl bg-[#171f33] border border-white/10 flex items-center gap-1">
              <button
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  isCustomer
                    ? 'bg-[#222a3d] text-[#89ceff] shadow-md border border-[#89ceff]/30'
                    : 'text-[#bec8d2] hover:text-white'
                }`}
                onClick={() => {
                  onRoleSwitch('customer');
                  setIsMobileMenuOpen(false);
                }}
              >
                Customer View
              </button>
              <button
                className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  isWorker
                    ? 'bg-[#222a3d] text-[#4edea3] shadow-md border border-[#4edea3]/30'
                    : 'text-[#bec8d2] hover:text-white'
                }`}
                onClick={() => {
                  onRoleSwitch('worker_pro');
                  setIsMobileMenuOpen(false);
                }}
              >
                <span className="w-2 h-2 rounded-full bg-[#4edea3]"></span>
                Worker Pro Terminal
              </button>
            </div>
          )}

          {/* Nav List */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(!currentUser || isCustomer) && (
              <>
                <button
                  onClick={() => handleNavClick('discovery')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'discovery'
                      ? 'bg-[#222a3d] border-[#89ceff]/40 text-[#89ceff]'
                      : 'bg-[#131b2e] border-white/5 text-[#bec8d2] hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">explore</span>
                  <span>Service Discovery</span>
                </button>
                <button
                  onClick={() => handleNavClick('radar')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'radar'
                      ? 'bg-[#222a3d] border-[#89ceff]/40 text-[#89ceff]'
                      : 'bg-[#131b2e] border-white/5 text-[#bec8d2] hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">radar</span>
                  <span>Radar Matching</span>
                </button>
                <button
                  onClick={() => handleNavClick('bidding')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'bidding'
                      ? 'bg-[#222a3d] border-[#89ceff]/40 text-[#89ceff]'
                      : 'bg-[#131b2e] border-white/5 text-[#bec8d2] hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">gavel</span>
                  <span>Live Bidding</span>
                </button>
              </>
            )}

            {isWorker && (
              <button
                onClick={() => handleNavClick('worker')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'worker'
                    ? 'bg-[#222a3d] border-[#4edea3]/40 text-[#4edea3]'
                    : 'bg-[#131b2e] border-white/5 text-[#bec8d2] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-base">terminal</span>
                <span>Worker Terminal</span>
              </button>
            )}

            <button
              onClick={() => handleNavClick('tracking')}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'tracking'
                  ? 'bg-[#222a3d] border-[#89ceff]/40 text-[#89ceff]'
                  : 'bg-[#131b2e] border-white/5 text-[#bec8d2] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-base">navigation</span>
              <span>Active Job &amp; GPS</span>
            </button>

            <button
              onClick={() => handleNavClick('mcp')}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'mcp'
                  ? 'bg-[#222a3d] border-[#ffb95f]/40 text-[#ffb95f]'
                  : 'bg-[#131b2e] border-white/5 text-[#bec8d2] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-base">smart_toy</span>
              <span>MCP Studio</span>
            </button>
          </div>
        </div>
      )}

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
