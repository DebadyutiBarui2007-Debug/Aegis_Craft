import React, { useState } from 'react';
import { JobRequest, ChatMessage } from '../types/index.ts';

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
              <span className="text-base font-bold text-white">JOB #8842 • Active Real-Time Dispatch</span>
              <span className="px-2 py-0.5 rounded-full bg-[#4edea3]/15 text-[#4edea3] text-[10px] font-bold uppercase tracking-wider border border-[#4edea3]/20">
                Telemetry Sync
              </span>
            </div>
            <p className="text-xs text-[#bec8d2]">
              Live Dual-Vector GPS Tracking • PostGIS Spatial Lock • Springfield Sector 4
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#171f33] px-3.5 py-1.5 rounded-full border border-white/5 shadow-sm">
            <span className="material-symbols-outlined text-[#ffb95f] text-sm">lock_clock</span>
            <span className="text-xs text-[#bec8d2]">Escrow Vault:</span>
            <span className="text-xs font-bold text-[#ffb95f]">${job.agreedAmount.toFixed(2)} Guaranteed</span>
          </div>

          <button
            type="button"
            onClick={onOpenSos}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#93000a]/40 text-[#ffb4ab] hover:bg-[#93000a]/70 transition-all border border-[#ffb4ab]/30 shadow-md group"
          >
            <span className="material-symbols-outlined text-sm group-hover:rotate-12 transition-transform">
              emergency
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider">SOS Rescue Armed</span>
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
                <span className="text-[10px] font-bold text-[#4edea3] uppercase tracking-wider">
                  Customer Safe Zone
                </span>
                <span className="text-xs text-white">742 Evergreen Ter, Springfield</span>
              </div>
            </div>

            {/* Mark J. Service Van Marker */}
            <div className="absolute top-16 right-16 md:right-28 flex items-center gap-2 bg-[#2d3449]/95 backdrop-blur-lg p-1.5 pr-4 rounded-full shadow-2xl border border-[#ffb95f]/40">
              <div className="relative">
                <img
                  alt="Mark J."
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[#4edea3]"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaz397TpeK9wHKhlQ-LWITbHWEvxV1IXzEAqubiSuS4FoXgI3NYH787ar8yeNsCAQ2p4G7_BwbLN0oIvXu6jKmGZzsRGRjJqncqM0i5M5pxZE9KPNS7XwfIcC_2NkC-vu4dc10rwkp4oHwOYjNiZBCLJc-SEZLU32gkOfyqdj_sCgUaabYnIx--jWI0w5QDr5nCrrfhreXI3xMOJ1yMlBhKNY7pQcGWLqL0m81vYdrINVae5b0M9eJnQ"
                />
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#4edea3] rounded-full ring-2 ring-[#060e20]"></span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-white">Mark J. (Service Van)</span>
                  <span className="material-symbols-outlined text-[#ffb95f] text-xs">navigation</span>
                </div>
                <span className="text-[10px] text-[#4edea3]">Turning Elm St • 0.4 km away</span>
              </div>
            </div>

            {/* Top Left ETA & Traffic HUD */}
            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 bg-[#060e20]/85 backdrop-blur-md px-3.5 py-2 rounded-full shadow-lg border border-white/10">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4edea3] animate-ping"></span>
                <span className="text-xs font-bold text-white">ETA: 4 Mins</span>
                <span className="text-[#3e4850]">•</span>
                <span className="text-xs text-[#4edea3]">Traffic: Light</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 bg-[#060e20]/85 backdrop-blur-md px-3 py-2 rounded-full shadow-lg border border-white/10">
                <span className="material-symbols-outlined text-[#89ceff] text-sm">satellite_alt</span>
                <span className="text-xs text-[#bec8d2]">RTK GPS: ±1.4m Precision</span>
              </div>
            </div>

            {/* Bottom Right Real-Time Vehicle Speed / Distance / 5G Telemetry */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-[#060e20]/90 backdrop-blur-xl p-2 rounded-xl shadow-2xl border border-white/10">
              <div className="flex flex-col items-center px-2">
                <span className="text-[10px] uppercase font-bold text-[#bec8d2]">Speed</span>
                <span className="text-xs font-bold text-[#89ceff]">
                  32 <span className="text-[10px] font-normal text-[#bec8d2]">km/h</span>
                </span>
              </div>
              <div className="w-px h-6 bg-[#2d3449]"></div>
              <div className="flex flex-col items-center px-2">
                <span className="text-[10px] uppercase font-bold text-[#bec8d2]">Distance</span>
                <span className="text-xs font-bold text-[#4edea3]">
                  420 <span className="text-[10px] font-normal text-[#bec8d2]">m</span>
                </span>
              </div>
              <div className="w-px h-6 bg-[#2d3449]"></div>
              <div className="flex flex-col items-center px-2">
                <span className="text-[10px] uppercase font-bold text-[#bec8d2]">Signal</span>
                <div className="flex items-center gap-0.5 text-[#4edea3]">
                  <span className="material-symbols-outlined text-sm">network_cell</span>
                  <span className="text-[10px] font-bold">5G Safe</span>
                </div>
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
                <span className="text-[10px] uppercase font-bold text-[#4edea3] bg-[#4edea3]/10 px-2.5 py-1 rounded-full border border-[#4edea3]/20">
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
                className={`p-4 rounded-lg flex flex-col gap-1 text-left transition-all border ${
                  job.currentPhase >= 1
                    ? 'bg-[#171f33] border-[#4edea3]/30 shadow-sm'
                    : 'bg-[#171f33]/40 border-white/5 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-[#4edea3]/20 text-[#4edea3] flex items-center justify-center text-xs font-bold">
                    ✓
                  </span>
                  <span className="text-[10px] text-[#4edea3]">10:19 AM</span>
                </div>
                <span className="text-sm font-semibold text-white mt-1">Agreement Lock</span>
                <p className="text-[11px] text-[#bec8d2]">Scope confirmed • Escrow pre-authorized</p>
              </button>

              {/* Stage 2: Technician Dispatched */}
              <button
                type="button"
                onClick={() => onAdvancePhase(2)}
                className={`p-4 rounded-lg flex flex-col gap-1 text-left transition-all border ${
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
                    <span className="text-[10px] uppercase font-bold text-[#4edea3]">En Route</span>
                  </div>
                  <span className="text-[10px] text-[#4edea3]">10:21 AM</span>
                </div>
                <span className="text-sm font-semibold text-[#4edea3] mt-1">Technician Dispatched</span>
                <p className="text-[11px] text-white">Telemetry broadcasting • ETA 4 mins</p>
              </button>

              {/* Stage 3: Diagnostics & Repair */}
              <button
                type="button"
                onClick={() => onAdvancePhase(3)}
                className={`p-4 rounded-lg flex flex-col gap-1 text-left transition-all border ${
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
                  <span className="text-[10px] text-[#88929b]">Stage 3</span>
                </div>
                <span className="text-sm font-semibold text-white mt-1">Diagnostics &amp; Repair</span>
                <p className="text-[11px] text-[#bec8d2]">Digital work log • FLIR thermal test</p>
              </button>

              {/* Stage 4: Escrow Release */}
              <button
                type="button"
                onClick={onOpenReviewModal}
                className={`p-4 rounded-lg flex flex-col gap-1 text-left transition-all border ${
                  job.currentPhase === 4
                    ? 'bg-[#222a3d] border-[#4edea3] shadow-md'
                    : 'bg-[#171f33]/40 border-white/5 opacity-60 hover:opacity-100 hover:border-[#4edea3]/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-[#2d3449] text-[#bec8d2] flex items-center justify-center text-xs font-bold">
                    4
                  </span>
                  <span className="text-[10px] text-[#88929b]">Stage 4</span>
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
              className="whitespace-nowrap px-4 py-2.5 rounded-lg bg-[#222a3d] hover:bg-[#31394d] text-[#89ceff] text-xs font-semibold transition-all border border-[#89ceff]/20 shadow-sm flex items-center gap-2"
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
                    alt="Mark J."
                    className="w-16 h-16 rounded-xl object-cover shadow-md ring-2 ring-[#4edea3]"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaz397TpeK9wHKhlQ-LWITbHWEvxV1IXzEAqubiSuS4FoXgI3NYH787ar8yeNsCAQ2p4G7_BwbLN0oIvXu6jKmGZzsRGRjJqncqM0i5M5pxZE9KPNS7XwfIcC_2NkC-vu4dc10rwkp4oHwOYjNiZBCLJc-SEZLU32gkOfyqdj_sCgUaabYnIx--jWI0w5QDr5nCrrfhreXI3xMOJ1yMlBhKNY7pQcGWLqL0m81vYdrINVae5b0M9eJnQ"
                  />
                  <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-[#4edea3] text-[#003824] text-[9px] font-bold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[10px]">verified</span>
                    PRO
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-bold text-white">Mark J.</span>
                  <span className="text-xs text-[#4edea3]">Master Electrical Specialist</span>
                  <div className="flex items-center gap-1 mt-1 text-[#ffb95f] text-xs">
                    <span className="material-symbols-outlined text-sm">star</span>
                    <span className="font-bold text-white">4.98</span>
                    <span className="text-[#bec8d2]">(214 verified jobs)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Certifications Box */}
            <div className="grid grid-cols-2 gap-2 bg-[#171f33] p-2 rounded-lg text-center border border-white/5">
              <div className="flex flex-col py-1">
                <span className="text-[10px] uppercase font-bold text-[#bec8d2]">Certification</span>
                <span className="text-xs font-medium text-white">State Lic. #EL-8941</span>
              </div>
              <div className="flex flex-col py-1">
                <span className="text-[10px] uppercase font-bold text-[#bec8d2]">Background</span>
                <span className="text-xs font-medium text-[#4edea3]">Clear • Insured $2M</span>
              </div>
            </div>

            {/* Encrypted Call & Chat buttons */}
            <div className="flex items-center gap-2">
              <a
                href="tel:5550192834"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#222a3d] hover:bg-[#31394d] text-white text-xs font-semibold transition-all border border-white/5"
              >
                <span className="material-symbols-outlined text-[#89ceff] text-base">call</span>
                <span>Encrypted Call</span>
              </a>
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#0ea5e9] text-white text-xs font-semibold hover:bg-[#89ceff] hover:text-[#00344d] transition-all shadow-md"
              >
                <span className="material-symbols-outlined text-base">chat</span>
                <span>Live Chat</span>
              </button>
            </div>

            {/* Escrow Locked Rate Display */}
            <div className="bg-[#171f33] p-3 rounded-lg flex items-center justify-between border border-white/5">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase text-[#bec8d2]">Escrow Locked Rate</span>
                <span className="text-xl font-bold text-[#ffb95f]">${job.agreedAmount.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#00a572]/20 text-[#4edea3] text-xs font-medium border border-[#00a572]/30">
                <span className="material-symbols-outlined text-sm">verified_user</span>
                <span>Guaranteed</span>
              </div>
            </div>
          </div>

          {/* Dispatch Comms Chat Stream */}
          <div className="bg-[#131b2e]/95 backdrop-blur-xl p-4 rounded-xl shadow-xl border border-white/10 flex flex-col h-[360px]">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4edea3] text-base">forum</span>
                <span className="text-sm font-bold text-white">Dispatch Comms</span>
              </div>
              <span className="text-[10px] font-bold uppercase text-[#4edea3] bg-[#4edea3]/15 px-2 py-0.5 rounded-full border border-[#4edea3]/20">
                Active
              </span>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-2 py-2 pr-1">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[85%] p-2 rounded-xl text-xs ${
                    msg.senderRole === 'customer'
                      ? 'self-end bg-[#222a3d] text-white rounded-tr-none border border-white/5'
                      : 'self-start bg-[#171f33] text-white rounded-tl-none border border-[#4edea3]/20'
                  }`}
                >
                  <span
                    className={`text-[10px] font-bold mb-0.5 ${
                      msg.senderRole === 'customer' ? 'text-[#89ceff] text-right' : 'text-[#4edea3]'
                    }`}
                  >
                    {msg.senderName} • {msg.timestamp}
                  </span>
                  <p className="leading-relaxed">{msg.content}</p>
                </div>
              ))}
            </div>

            {/* Quick Replies */}
            <div className="flex items-center gap-1 overflow-x-auto py-1.5 whitespace-nowrap">
              <button
                type="button"
                onClick={() => onSendMessage('Where are you?')}
                className="px-2.5 py-1 rounded-full bg-[#171f33] text-[#bec8d2] hover:text-white text-[11px] border border-white/5 transition-colors"
              >
                Where are you?
              </button>
              <button
                type="button"
                onClick={() => onSendMessage('Gate code is 4921')}
                className="px-2.5 py-1 rounded-full bg-[#171f33] text-[#bec8d2] hover:text-white text-[11px] border border-white/5 transition-colors"
              >
                Gate code is 4921
              </button>
              <button
                type="button"
                onClick={() => onSendMessage('Take your time')}
                className="px-2.5 py-1 rounded-full bg-[#171f33] text-[#bec8d2] hover:text-white text-[11px] border border-white/5 transition-colors"
              >
                Take your time
              </button>
            </div>

            {/* Chat Input */}
            <div className="flex items-center gap-2 pt-1 border-t border-white/5">
              <input
                className="flex-1 bg-[#222a3d] border border-white/10 px-3 py-2 rounded-lg text-xs text-white placeholder-[#88929b] outline-none focus:ring-1 focus:ring-[#89ceff]"
                placeholder="Type instructions or safety notes..."
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                type="button"
                onClick={handleSend}
                className="p-2 rounded-lg bg-[#0ea5e9] text-white hover:bg-[#89ceff] hover:text-[#00344d] transition-colors"
              >
                <span className="material-symbols-outlined text-base">send</span>
              </button>
            </div>
          </div>

          {/* Emergency SOS Guard Card */}
          <div className="bg-gradient-to-br from-[#93000a]/40 via-[#131b2e] to-[#060e20] p-4 rounded-xl shadow-2xl border border-[#ffb4ab]/30 relative overflow-hidden">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#93000a]/20 flex items-center justify-center text-[#ffb4ab] shrink-0 animate-pulse">
                <span className="material-symbols-outlined text-2xl">emergency</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-[#ffb4ab]">Emergency SOS Guard</span>
                  <span className="w-2 h-2 rounded-full bg-[#ffb4ab] animate-ping"></span>
                </div>
                <p className="text-xs text-[#bec8d2] mt-1">
                  Platform escalation triggers instant 911 dispatch, continuous ambient audio link, and locked GPS
                  beacon.
                </p>
              </div>
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={onOpenSos}
                className="w-full py-3 px-4 rounded-xl bg-[#93000a] hover:bg-[#ffb4ab] hover:text-[#690005] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-base">fmd_bad</span>
                <span>EMERGENCY SOS: Platform Intervene</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
