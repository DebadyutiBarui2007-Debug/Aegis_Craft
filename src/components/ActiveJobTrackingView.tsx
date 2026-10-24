import React, { useState } from 'react';
import { JobRequest, ChatMessage } from '../types/index.ts';
import { formatInr } from '../lib/biddingEngine.ts';

interface ActiveJobTrackingViewProps {
  job: JobRequest;
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  onAdvancePhase: (phase: number) => void;
  onOpenSos: () => void;
  onOpenReviewModal: () => void;
}

export const ActiveJobTrackingView: React.FC<ActiveJobTrackingViewProps> = ({
  job,
  messages,
  onSendMessage,
  onAdvancePhase,
  onOpenSos,
  onOpenReviewModal,
}) => {
  const [chatInput, setChatInput] = useState('');

  const handleSend = () => {
    if (!chatInput.trim()) return;
    onSendMessage(chatInput.trim());
    setChatInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-4 flex flex-col gap-6">
      {/* Top Banner */}
      <section className="relative w-full rounded-xl bg-[#131b2e]/80 backdrop-blur-xl p-4 shadow-lg border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#4edea3] animate-ping"></div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white font-mono">JOB #8842 • Active Real-Time Dispatch</span>
              <span className="px-2 py-0.5 rounded-full bg-[#4edea3]/15 text-[#4edea3] text-[10px] font-bold uppercase tracking-wider border border-[#4edea3]/20 font-mono">
                Telemetry Sync
              </span>
            </div>
            <p className="text-xs text-[#bec8d2]">
              Live Dual-Vector GPS Tracking • PostGIS Spatial Lock • Bengaluru Sector 4 (Indiranagar)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#171f33] px-3.5 py-1.5 rounded-full border border-white/5 shadow-sm">
            <span className="material-symbols-outlined text-[#ffb95f] text-sm">lock_clock</span>
            <span className="text-xs text-[#bec8d2]">INR Escrow Vault:</span>
            <span className="text-xs font-bold text-[#ffb95f] font-mono">{formatInr(job.agreedAmount)} Locked</span>
          </div>

          <button
            type="button"
            onClick={onOpenSos}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#93000a]/50 text-[#ffb4ab] hover:bg-[#93000a]/80 transition-all border border-[#ffb4ab]/40 shadow-md group cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm group-hover:rotate-12 transition-transform">
              emergency
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider">112 SOS Rescue Armed</span>
          </button>
        </div>
      </section>

      {/* Main Grid: Left 8 cols GPS Route & Sequence, Right 4 cols Profile & Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Tactical Map Route Viewport */}
          <div className="relative w-full h-[520px] rounded-xl overflow-hidden shadow-2xl bg-[#060e20] border border-white/10">
            {/* Background Map Simulation Grid */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="tacticalGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#89ceff" strokeWidth="0.6" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#tacticalGrid)" />
            </svg>

            {/* Glowing GPS Route Line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="routeGrad" x1="0%" x2="100%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#4edea3" stopOpacity="0.9" />
                  <stop offset="60%" stopColor="#89ceff" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#ffb95f" stopOpacity="1" />
                </linearGradient>
                <filter id="glowRoute" width="140%" height="140%" x="-20%" y="-20%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <path
                d="M 220 380 Q 340 350, 410 260 T 620 190 T 780 140"
                fill="none"
                opacity="0.6"
                stroke="#171f33"
                strokeLinecap="round"
                strokeWidth="12"
              />
              <path
                className="animate-pulse"
                d="M 220 380 Q 340 350, 410 260 T 620 190 T 780 140"
                fill="none"
                filter="url(#glowRoute)"
                stroke="url(#routeGrad)"
                strokeDasharray="10 8"
                strokeLinecap="round"
                strokeWidth="5"
              />
              <circle cx="220" cy="380" r="32" fill="#4edea3" opacity="0.15" className="animate-ping" />
              <circle cx="220" cy="380" r="14" fill="#003824" stroke="#4edea3" strokeWidth="3" />
              <circle cx="220" cy="380" r="5" fill="#4edea3" />

              <circle cx="780" cy="140" r="42" fill="#ffb95f" opacity="0.15" className="animate-pulse" />
              <circle cx="780" cy="140" r="18" fill="#472a00" stroke="#ffb95f" strokeWidth="3" />
              <circle cx="780" cy="140" r="7" fill="#ffb95f" />
            </svg>

            {/* Customer Safe Zone Marker */}
            <div className="absolute bottom-16 left-12 flex items-center gap-2 bg-[#222a3d]/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-xl border border-[#4edea3]/30 pointer-events-none">
              <span className="material-symbols-outlined text-[#4edea3] text-base">home_pin</span>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-[#4edea3] uppercase tracking-wider font-mono">
                  Customer Safe Zone
                </span>
                <span className="text-xs text-white">742 12th Main Rd, Indiranagar</span>
              </div>
            </div>

            {/* Rajesh Sharma Service Van Marker */}
            <div className="absolute top-16 right-16 md:right-28 flex items-center gap-2 bg-[#2d3449]/95 backdrop-blur-lg p-1.5 pr-4 rounded-full shadow-2xl border border-[#ffb95f]/40">
              <div className="relative">
                <img
                  alt="Rajesh Sharma"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[#4edea3]"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80"
                />
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#4edea3] rounded-full ring-2 ring-[#060e20]"></span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-white">Rajesh Sharma (Commercial Pro)</span>
                  <span className="material-symbols-outlined text-[#ffb95f] text-xs">navigation</span>
                </div>
                <span className="text-[10px] text-[#4edea3] font-mono">Crossing 100ft Rd • 420m away</span>
              </div>
            </div>

            {/* Top Left ETA & Traffic HUD */}
            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 bg-[#060e20]/85 backdrop-blur-md px-3.5 py-2 rounded-full shadow-lg border border-white/10">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4edea3] animate-ping"></span>
                <span className="text-xs font-bold text-white font-mono">ETA: 4 Mins</span>
                <span className="text-[#3e4850]">•</span>
                <span className="text-xs text-[#4edea3]">Traffic: Smooth (100ft Rd)</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 bg-[#060e20]/85 backdrop-blur-md px-3 py-2 rounded-full shadow-lg border border-white/10">
                <span className="material-symbols-outlined text-[#89ceff] text-sm">satellite_alt</span>
                <span className="text-xs text-[#bec8d2] font-mono">RTK GPS: ±1.4m Precision</span>
              </div>
            </div>

            {/* Bottom Right Real-Time Vehicle Speed / Distance / 5G Telemetry */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-[#060e20]/90 backdrop-blur-xl p-2 rounded-xl shadow-2xl border border-white/10">
              <div className="flex flex-col items-center px-2">
                <span className="text-[10px] uppercase font-bold text-[#bec8d2]">Speed</span>
                <span className="text-xs font-bold text-[#89ceff] font-mono">
                  32 <span className="text-[10px] font-normal text-[#bec8d2]">km/h</span>
                </span>
              </div>
              <div className="h-6 w-px bg-white/10"></div>
              <div className="flex flex-col items-center px-2">
                <span className="text-[10px] uppercase font-bold text-[#bec8d2]">Distance</span>
                <span className="text-xs font-bold text-[#4edea3] font-mono">420 m</span>
              </div>
              <div className="h-6 w-px bg-white/10"></div>
              <div className="flex items-center gap-1.5 px-2">
                <span className="material-symbols-outlined text-xs text-[#4edea3]">cell_tower</span>
                <span className="text-[10px] uppercase font-bold text-[#4edea3] font-mono">5G Safe</span>
              </div>
            </div>
          </div>

          {/* Execution Sequence Stepper */}
          <div className="bg-[#131b2e]/90 backdrop-blur-xl p-6 rounded-xl shadow-xl border border-white/5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#89ceff] text-lg">alt_route</span>
                <span className="text-base font-bold text-white">Execution Sequence</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-[#4edea3] bg-[#4edea3]/10 px-2.5 py-1 rounded-full border border-[#4edea3]/20 font-mono">
                  Phase {job.currentPhase} Active
                </span>
                <span className="text-xs text-[#bec8d2] hidden sm:inline">• Click stage to simulate workflow</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Stage 1: Agreement Lock */}
              <button
                type="button"
                onClick={() => onAdvancePhase(1)}
                className={`p-4 rounded-lg flex flex-col gap-1 text-left transition-all border cursor-pointer ${
                  job.currentPhase >= 1
                    ? 'bg-[#171f33] border-[#4edea3]/30 shadow-sm'
                    : 'bg-[#171f33]/40 border-white/5 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-[#4edea3]/20 text-[#4edea3] flex items-center justify-center text-xs font-bold">
                    ✓
                  </span>
                  <span className="text-[10px] text-[#4edea3] font-mono">10:19 AM</span>
                </div>
                <span className="text-sm font-semibold text-white mt-1">Agreement Lock</span>
                <p className="text-[11px] text-[#bec8d2]">Scope confirmed • INR Escrow funded</p>
              </button>

              {/* Stage 2: Technician Dispatched */}
              <button
                type="button"
                onClick={() => onAdvancePhase(2)}
                className={`p-4 rounded-lg flex flex-col gap-1 text-left transition-all border cursor-pointer ${
                  job.currentPhase === 2
                    ? 'bg-[#222a3d] border-[#4edea3] ring-1 ring-[#4edea3] shadow-md'
                    : job.currentPhase > 2
                    ? 'bg-[#171f33] border-[#4edea3]/30'
                    : 'bg-[#171f33]/40 border-white/5 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#4edea3] animate-ping"></span>
                    <span className="text-[10px] uppercase font-bold text-[#4edea3] font-mono">En Route</span>
                  </div>
                  <span className="text-[10px] text-[#4edea3] font-mono">10:21 AM</span>
                </div>
                <span className="text-sm font-semibold text-[#4edea3] mt-1">Technician Dispatched</span>
                <p className="text-[11px] text-white">Telemetry broadcasting • ETA 4 mins</p>
              </button>

              {/* Stage 3: Diagnostics & Repair */}
              <button
                type="button"
                onClick={() => onAdvancePhase(3)}
                className={`p-4 rounded-lg flex flex-col gap-1 text-left transition-all border cursor-pointer ${
                  job.currentPhase === 3
                    ? 'bg-[#222a3d] border-[#ffb95f] ring-1 ring-[#ffb95f] shadow-md'
                    : job.currentPhase > 3
                    ? 'bg-[#171f33] border-[#4edea3]/30'
                    : 'bg-[#171f33]/40 border-white/5 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-[#2d3449] text-[#bec8d2] flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                  <span className="text-[10px] text-[#88929b] font-mono">Stage 3</span>
                </div>
                <span className="text-sm font-semibold text-white mt-1">Diagnostics &amp; Repair</span>
                <p className="text-[11px] text-[#bec8d2]">Digital work log • FLIR thermal test</p>
              </button>

              {/* Stage 4: Escrow Release */}
              <button
                type="button"
                onClick={onOpenReviewModal}
                className={`p-4 rounded-lg flex flex-col gap-1 text-left transition-all border cursor-pointer ${
                  job.currentPhase === 4
                    ? 'bg-[#222a3d] border-[#4edea3] shadow-md'
                    : 'bg-[#171f33]/40 border-white/5 opacity-60 hover:opacity-100 hover:border-[#4edea3]/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-[#2d3449] text-[#bec8d2] flex items-center justify-center text-xs font-bold">
                    4
                  </span>
                  <span className="text-[10px] text-[#88929b] font-mono">Stage 4</span>
                </div>
                <span className="text-sm font-semibold text-white mt-1">Escrow Release</span>
                <p className="text-[11px] text-[#bec8d2]">Dual sign-off • Verified review</p>
              </button>
            </div>
          </div>

          {/* Mutual Guarantee Card */}
          <div className="bg-gradient-to-r from-[#171f33] to-[#131b2e] p-4 rounded-xl shadow-lg border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#4edea3]/15 flex items-center justify-center text-[#4edea3]">
                <span className="material-symbols-outlined text-2xl">rate_review</span>
              </div>
              <div>
                <span className="text-sm font-bold text-white">Mutual Satisfaction &amp; Credential Guarantee</span>
                <p className="text-xs text-[#bec8d2]">
                  Both parties review upon physical job completion to maintain 100% KYC platform trust.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenReviewModal}
              className="whitespace-nowrap px-4 py-2.5 rounded-lg bg-[#222a3d] hover:bg-[#31394d] text-[#89ceff] text-xs font-semibold transition-all border border-[#89ceff]/20 shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <span>Review Flow Preview</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Pro Headshot & Credentials Card */}
          <div className="bg-[#131b2e]/95 backdrop-blur-2xl p-6 rounded-xl shadow-xl border border-white/10 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <div className="relative">
                  <img
                    alt="Rajesh Sharma"
                    className="w-16 h-16 rounded-xl object-cover shadow-md ring-2 ring-[#4edea3]"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80"
                  />
                  <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-[#4edea3] text-[#003824] text-[9px] font-bold flex items-center gap-0.5 font-mono">
                    <span className="material-symbols-outlined text-[10px]">verified</span>
                    PRO
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-bold text-white">Rajesh Sharma</span>
                  <span className="text-xs text-[#4edea3]">Grade A Master Electrician</span>
                  <div className="flex items-center gap-1 mt-1 text-[#ffb95f] text-xs">
                    <span className="material-symbols-outlined text-sm">star</span>
                    <span className="font-bold text-white font-mono">4.98</span>
                    <span className="text-[#bec8d2]">(214 verified jobs)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Certifications Box */}
            <div className="grid grid-cols-2 gap-2 bg-[#171f33] p-2 rounded-lg text-center border border-white/5">
              <div className="flex flex-col py-1">
                <span className="text-[10px] uppercase font-bold text-[#bec8d2]">Licensure</span>
                <span className="text-xs font-medium text-white font-mono">KA Lic. #EL-8842</span>
              </div>
              <div className="flex flex-col py-1">
                <span className="text-[10px] uppercase font-bold text-[#bec8d2]">Background</span>
                <span className="text-xs font-medium text-[#4edea3]">Police Cleared • Bonded ₹10L</span>
              </div>
            </div>

            {/* Encrypted Call & Chat buttons */}
            <div className="flex items-center gap-2">
              <a
                href="tel:+919845188421"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#222a3d] hover:bg-[#31394d] text-white text-xs font-semibold transition-all border border-white/5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[#89ceff] text-base">call</span>
                <span>Encrypted Call</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById('chatInputRef');
                  input?.focus();
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#0ea5e9] text-white text-xs font-semibold hover:bg-[#89ceff] hover:text-[#00344d] transition-all shadow-md cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">chat</span>
                <span>Open Radio</span>
              </button>
            </div>
          </div>

          {/* Secure Dispatch Chat Stream */}
          <div className="bg-[#131b2e]/95 backdrop-blur-2xl rounded-xl shadow-xl border border-white/10 flex flex-col h-[400px]">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
                <span className="text-xs font-bold text-white">Direct Dispatch Comms</span>
              </div>
              <span className="text-[10px] text-[#bec8d2] font-mono">End-to-End Encrypted</span>
            </div>

            {/* Message list */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {messages.map((m) => {
                const isCustomer = m.senderRole === 'customer';
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col max-w-[85%] ${isCustomer ? 'self-end items-end' : 'self-start items-start'}`}
                  >
                    <span className="text-[10px] text-[#bec8d2] mb-0.5 font-mono">
                      {m.senderName} • {m.timestamp}
                    </span>
                    <div
                      className={`p-3 rounded-xl text-xs leading-relaxed ${
                        isCustomer
                          ? 'bg-[#0ea5e9] text-white rounded-br-none shadow-md'
                          : 'bg-[#222a3d] text-[#dae2fd] rounded-bl-none border border-white/5 shadow-md'
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input bar */}
            <div className="p-3 border-t border-white/5 bg-[#171f33]/80 flex items-center gap-2">
              <input
                id="chatInputRef"
                type="text"
                placeholder="Message technician on route..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-[#222a3d] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-[#88929b] focus:outline-none focus:ring-1 focus:ring-[#89ceff]"
              />
              <button
                type="button"
                onClick={handleSend}
                className="p-2 rounded-lg bg-[#0ea5e9] text-white hover:bg-[#89ceff] hover:text-[#00344d] transition-all cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-base">send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
