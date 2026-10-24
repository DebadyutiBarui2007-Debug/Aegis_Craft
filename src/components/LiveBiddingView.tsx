import React, { useState } from 'react';
import { JobRequest, BidOffer } from '../types/index.ts';
import { calculateBidBreakdown } from '../lib/biddingEngine.ts';

interface LiveBiddingViewProps {
  job: JobRequest;
  bids: BidOffer[];
  onSubmitCounter: (proposedAmount: number, scopeNotes?: string) => void;
  onAcceptOffer: (bidId: string) => void;
  onNavigateToTracking: () => void;
}

export const LiveBiddingView: React.FC<LiveBiddingViewProps> = ({
  job,
  bids,
  onSubmitCounter,
  onAcceptOffer,
  onNavigateToTracking,
}) => {
  const [currentBidValue, setCurrentBidValue] = useState<number>(80);
  const [showAgreementSheet, setShowAgreementSheet] = useState<boolean>(true);
  const [isTransmitting, setIsTransmitting] = useState<boolean>(false);
  const [isAccepted, setIsAccepted] = useState<boolean>(false);

  const breakdown = calculateBidBreakdown(currentBidValue, job.tradeCategory, 15);

  const adjustBid = (delta: number) => {
    const nextVal = Math.max(50, Math.min(150, currentBidValue + delta));
    setCurrentBidValue(nextVal);
  };

  const handleTransmitCounter = () => {
    setIsTransmitting(true);
    setTimeout(() => {
      onSubmitCounter(
        currentBidValue,
        `Customer counteroffer proposing $${currentBidValue.toFixed(2)} for on-site diagnostic & parts.`
      );
      setIsTransmitting(false);
    }, 800);
  };

  const handleExecuteAgreement = () => {
    const activePendingBid = bids.find((b) => b.status === 'PENDING') || bids[bids.length - 1];
    if (activePendingBid) {
      onAcceptOffer(activePendingBid.id);
    }
    setIsAccepted(true);
    setTimeout(() => {
      onNavigateToTracking();
    }, 1200);
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-4 flex flex-col gap-6">
      {/* Top Job Summary Glass Banner */}
      <section className="relative w-full rounded-xl bg-[#171f33]/85 backdrop-blur-2xl shadow-xl overflow-hidden p-4 md:p-6 border border-white/5">
        <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full bg-[#ffb95f]/10 blur-[90px] pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-[#4edea3]/10 blur-[80px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex flex-col gap-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-[#222a3d] text-[#89ceff] text-[11px] font-bold uppercase tracking-wider border border-[#89ceff]/20">
                #JOB-8842
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffb95f]/15 text-[#ffb95f] text-[11px] font-bold uppercase tracking-wider border border-[#ffb95f]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffb95f] animate-ping"></span>
                Live Negotiation in Progress • Real-time Socket.IO Synchronized
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#4edea3]/15 text-[#4edea3] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 border border-[#4edea3]/20">
                <span className="material-symbols-outlined text-xs">verified</span>
                Escrow Guaranteed
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight mt-1">
              {job.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#bec8d2]">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#89ceff] text-base">person</span>
                <span>
                  Customer: <strong className="text-white font-medium">{job.customerName}</strong>
                </span>
              </div>
              <span className="text-[#3e4850]">•</span>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#4edea3] text-base">near_me</span>
                <span>
                  {job.location.address} <span className="text-[#4edea3] font-medium">(0.8 km from your unit)</span>
                </span>
              </div>
              <span className="text-[#3e4850]">•</span>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#ffb95f] text-base">timer</span>
                <span>Urgent Dispatch ETA: ~12 Mins</span>
              </div>
            </div>

            <p className="text-xs text-[#bec8d2]/90 mt-1 line-clamp-2 md:line-clamp-none">
              Scope: {job.situationSummary}
            </p>
          </div>

          <div className="flex flex-row xl:flex-col items-center xl:items-end justify-between gap-3 pt-2 xl:pt-0">
            <div className="flex items-center gap-2 bg-[#131b2e]/90 px-3 py-2 rounded-lg border border-white/5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#4edea3] animate-pulse"></div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-[#bec8d2]">Handshake Ping</span>
                <span className="text-xs text-white font-mono font-medium">18ms • Node #US-EAST-4</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="px-3 py-2 rounded-lg bg-[#222a3d] hover:bg-[#31394d] text-white text-xs font-medium flex items-center gap-1.5 transition-colors border border-white/5"
              >
                <span className="material-symbols-outlined text-base">call</span>
                Direct Audio
              </button>
              <button
                type="button"
                className="px-3 py-2 rounded-lg bg-[#222a3d] hover:bg-[#31394d] text-white text-xs font-medium flex items-center gap-1.5 transition-colors border border-white/5"
              >
                <span className="material-symbols-outlined text-base">photo_library</span>
                Photos (3)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Split-Screen Negotiation Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Chronological Bid Stream & Timeline (7 cols) */}
        <section className="lg:col-span-7 flex flex-col gap-4">
          {/* Market Benchmark Widget */}
          <div className="rounded-xl bg-[#131b2e]/95 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#89ceff]/10 flex items-center justify-center text-[#89ceff] shrink-0">
                <span className="material-symbols-outlined text-xl">analytics</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase text-[#89ceff] tracking-wider">
                    PostGIS MCP Pricing Radar
                  </span>
                  <span className="text-xs text-[#bec8d2]">• 42 Nearby Dispatches</span>
                </div>
                <p className="text-sm font-semibold text-white">
                  Regional Fair Market Value: <span className="text-[#4edea3]">$65.00 – $85.00</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#222a3d] text-[#bec8d2] text-xs font-medium border border-white/5 shrink-0">
              <span className="material-symbols-outlined text-sm text-[#4edea3]">trending_flat</span>
              Within Safe Escrow Corridor
            </div>
          </div>

          {/* Bid Stream Timeline */}
          <div className="relative pl-6 md:pl-8 flex flex-col gap-4 before:content-[''] before:absolute before:left-3 md:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-[#2d3449]">
            {/* Event 1: Initial Offer */}
            <div className="relative flex flex-col gap-2 rounded-xl bg-[#171f33]/70 p-4 shadow-sm border border-white/5">
              <div className="absolute -left-6 md:-left-8 top-5 w-3 h-3 rounded-full bg-[#89ceff] ring-4 ring-[#0b1326]"></div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#89ceff]">Initial Customer Offer</span>
                  <span className="text-[10px] uppercase font-bold text-[#bec8d2] px-2 py-0.5 rounded bg-[#060e20]">
                    Step 1
                  </span>
                </div>
                <span className="text-xs text-[#bec8d2]">10:14 AM</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-bold text-white">$70.00</span>
                <span className="text-xs text-[#bec8d2]">Customer Budget Ceiling: $75.00</span>
              </div>
              <p className="text-xs text-[#bec8d2]">
                “Smelled electrical smoke near the main basement circuit. Need technician to diagnose cause promptly.”
              </p>
            </div>

            {/* Event 2: Tech Counteroffer */}
            <div className="relative flex flex-col gap-2 rounded-xl bg-[#222a3d]/90 p-4 shadow-xl border border-[#ffb95f]/30">
              <div className="absolute -left-6 md:-left-8 top-5 w-3.5 h-3.5 rounded-full bg-[#ffb95f] shadow-[0_0_12px_rgba(255,185,95,0.9)] ring-4 ring-[#0b1326]"></div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#ffb95f] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">build</span>
                    Tech Mark J. Pro Counteroffer
                  </span>
                  <span className="text-[10px] uppercase font-bold text-[#ffb95f] bg-[#ffb95f]/15 px-2 py-0.5 rounded-full border border-[#ffb95f]/20">
                    Counter #1
                  </span>
                </div>
                <span className="text-xs text-[#bec8d2]">10:16 AM</span>
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[#ffb95f]">$85.00</span>
                  <span className="text-xs text-[#bec8d2] line-through">$110 Standard</span>
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-[#ffb95f]/10 text-[#ffb95f] border border-[#ffb95f]/20">
                  Includes Eaton Unit
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[#060e20]/80 text-[#bec8d2] text-xs flex flex-col gap-1.5 border border-white/5">
                <div className="flex items-center gap-1 text-white font-medium">
                  <span className="material-symbols-outlined text-sm text-[#ffb95f]">notes</span>
                  Technician Scope Note:
                </div>
                <p className="italic text-[#bec8d2]">
                  “Includes OEM 30A Eaton breaker replacement and FLIR thermal imaging diagnostic to verify panel
                  busbar integrity. Fast on-site turnaround.”
                </p>
              </div>
            </div>

            {/* Event 3: Current Customer Sweetspot */}
            <div className="relative flex flex-col gap-2 rounded-xl bg-[#171f33]/95 p-4 shadow-md border border-[#4edea3]/40">
              <div className="absolute -left-6 md:-left-8 top-5 w-3 h-3 rounded-full bg-[#4edea3] ring-4 ring-[#0b1326] animate-pulse"></div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#4edea3]">Customer Active Counteroffer</span>
                  <span className="text-[10px] uppercase font-bold text-[#4edea3] bg-[#4edea3]/15 px-2 py-0.5 rounded-full border border-[#4edea3]/20">
                    Active Floor
                  </span>
                </div>
                <span className="text-xs text-[#bec8d2]">10:18 AM (2m ago)</span>
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-bold text-white">${currentBidValue.toFixed(2)}</span>
                <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-[#4edea3]/15 text-[#4edea3] border border-[#4edea3]/20">
                  Mutual Sweetspot
                </span>
              </div>
              <p className="text-xs text-[#bec8d2]">
                “Can we meet at ${currentBidValue.toFixed(2)}? Happy to confirm and lock escrow right away so you can dispatch immediately.”
              </p>
            </div>
          </div>

          {/* Live Status Bar */}
          <div className="rounded-xl bg-[#131b2e] p-3 flex items-center justify-between gap-3 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 ring-1 ring-[#4edea3]">
                <img
                  alt="Mark J."
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaz397TpeK9wHKhlQ-LWITbHWEvxV1IXzEAqubiSuS4FoXgI3NYH787ar8yeNsCAQ2p4G7_BwbLN0oIvXu6jKmGZzsRGRjJqncqM0i5M5pxZE9KPNS7XwfIcC_2NkC-vu4dc10rwkp4oHwOYjNiZBCLJc-SEZLU32gkOfyqdj_sCgUaabYnIx--jWI0w5QDr5nCrrfhreXI3xMOJ1yMlBhKNY7pQcGWLqL0m81vYdrINVae5b0M9eJnQ"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white">Mark J.</span>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-bounce"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
                <span className="text-[11px] text-[#bec8d2]">
                  Reviewing your ${currentBidValue.toFixed(2)} counteroffer in dispatch queue...
                </span>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-[#4edea3] text-[10px] font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-sm">wifi_tethering</span>
              Direct Socket Live
            </div>
          </div>

          {/* Visual Signal Graph */}
          <div className="rounded-xl bg-[#171f33]/60 p-4 flex flex-col gap-2 border border-white/5">
            <div className="flex items-center justify-between text-[10px] uppercase font-bold text-[#bec8d2]">
              <span>Dynamic Bidding Convergence Curve</span>
              <span>Spread: -${Math.abs(breakdown.spreadDelta).toFixed(2)} delta</span>
            </div>
            <div className="w-full h-12 flex items-center">
              <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 400 48">
                <path
                  d="M0 40 C 80 40, 100 12, 200 12 C 280 12, 320 22, 400 22"
                  opacity="0.3"
                  stroke="#3e4850"
                  strokeDasharray="4 4"
                  strokeWidth="2"
                />
                <path
                  d="M0 38 C 90 35, 140 28, 220 25 C 280 23, 340 24, 400 24"
                  stroke="#ffb95f"
                  strokeWidth="2"
                />
                <circle cx="220" cy="25" fill="#4edea3" r="4" />
                <circle className="animate-pulse" cx="340" cy="24" fill="#ffb95f" r="5" />
              </svg>
            </div>
            <div className="flex items-center justify-between text-xs text-[#bec8d2]">
              <span>Customer Start ($70)</span>
              <span className="text-[#4edea3] font-semibold">Target Match (${currentBidValue.toFixed(0)})</span>
              <span>Tech Offer ($85)</span>
            </div>
          </div>
        </section>

        {/* Right Column: Counteroffer Control Surface (5 cols) */}
        <section className="lg:col-span-5 flex flex-col gap-4">
          <div className="rounded-xl bg-[#171f33]/90 backdrop-blur-2xl shadow-2xl p-4 md:p-6 flex flex-col gap-4 border border-white/10">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#bec8d2]">
                  Control Surface
                </span>
                <h2 className="text-lg font-bold text-white">Agreed Job Target</h2>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-[#222a3d] text-[#89ceff] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border border-[#89ceff]/20">
                <span className="material-symbols-outlined text-xs">lock</span>
                Protected Escrow
              </div>
            </div>

            {/* Price Display */}
            <div className="rounded-xl bg-[#060e20]/90 p-4 flex flex-col items-center justify-center text-center gap-1 relative overflow-hidden border border-white/5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#bec8d2]">
                Proposed Mutual Total
              </span>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold text-[#ffb95f] font-mono font-display">
                  ${currentBidValue.toFixed(2)}
                </span>
                <span className="text-xs text-[#bec8d2]">USD</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#4edea3] text-[11px] font-semibold mt-1">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Both parties within $5.00 threshold
              </div>
            </div>

            {/* Slider */}
            <div className="flex flex-col gap-1.5 pt-1">
              <div className="flex justify-between items-center text-[10px] uppercase font-bold text-[#bec8d2]">
                <span>Min Escrow ($50)</span>
                <span className="text-[#ffb95f] font-semibold">Market Mean ($75)</span>
                <span>Max Safe ($150)</span>
              </div>
              <input
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-[#222a3d] accent-[#0ea5e9]"
                max={150}
                min={50}
                step={1}
                type="range"
                value={currentBidValue}
                onChange={(e) => setCurrentBidValue(parseInt(e.target.value, 10))}
              />
              <div className="flex justify-between text-xs text-[#bec8d2]">
                <span>$50.00</span>
                <span className="text-[#ffb95f] font-medium">▲ Eaton OEM Tier ($85)</span>
                <span>$150.00</span>
              </div>
            </div>

            {/* Quick Increment Buttons */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-[#bec8d2]">Quick Delta Increment</label>
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => adjustBid(-5)}
                  className="py-2 rounded-lg bg-[#222a3d] hover:bg-[#31394d] text-white text-xs font-semibold transition-all border border-white/5 active:scale-95"
                >
                  -$5
                </button>
                <button
                  type="button"
                  onClick={() => adjustBid(5)}
                  className="py-2 rounded-lg bg-[#222a3d] hover:bg-[#31394d] text-white text-xs font-semibold transition-all border border-white/5 active:scale-95"
                >
                  +$5
                </button>
                <button
                  type="button"
                  onClick={() => adjustBid(10)}
                  className="py-2 rounded-lg bg-[#222a3d] hover:bg-[#31394d] text-white text-xs font-semibold transition-all border border-white/5 active:scale-95"
                >
                  +$10
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentBidValue(85)}
                  className="py-2 rounded-lg bg-[#ffb95f]/20 hover:bg-[#ffb95f]/30 text-[#ffb95f] text-xs font-bold transition-all border border-[#ffb95f]/30 active:scale-95"
                >
                  Match $85
                </button>
              </div>
            </div>

            {/* Breakdown Box */}
            <div className="rounded-xl bg-[#131b2e] p-4 flex flex-col gap-2 border border-white/5">
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-[#bec8d2] pb-1 border-b border-white/5">
                <span>Transparent Itemization</span>
                <span className="text-[#4edea3]">Zero Hidden Fees</span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#bec8d2]">
                <span>Master Electrical Diagnostic &amp; Labor</span>
                <span className="text-white font-medium">${breakdown.laborAmount.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#bec8d2]">
                <span>Hardware Parts Allowance (30A Breaker)</span>
                <span className="text-white font-medium">${breakdown.partsAllowance.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#bec8d2]">
                <span>AegisCraft Escrow Fee (Covered by platform)</span>
                <span className="text-[#4edea3] font-medium">$0.00</span>
              </div>
              <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-sm font-bold text-white">
                <span>Guaranteed Total</span>
                <span className="text-lg text-[#ffb95f] font-mono">${currentBidValue.toFixed(2)}</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={handleExecuteAgreement}
                className="w-full py-3.5 px-4 rounded-lg bg-[#00a572] hover:bg-[#4edea3] hover:text-[#003824] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(78,222,163,0.3)] transition-all"
              >
                <span className="material-symbols-outlined text-lg">verified_user</span>
                Accept Offer (${currentBidValue.toFixed(2)}) &amp; Lock Escrow
              </button>

              <button
                type="button"
                disabled={isTransmitting}
                onClick={handleTransmitCounter}
                className="w-full py-3 px-4 rounded-lg bg-[#0ea5e9]/20 hover:bg-[#0ea5e9]/30 text-[#89ceff] text-xs font-semibold flex items-center justify-center gap-2 transition-all border border-[#0ea5e9]/30"
              >
                <span className="material-symbols-outlined text-base">sync_alt</span>
                {isTransmitting ? 'Transmitting to Mark J...' : 'Transmit Counteroffer to Mark J.'}
              </button>

              <button
                type="button"
                onClick={() => setShowAgreementSheet(false)}
                className="w-full py-2 text-[#bec8d2] hover:text-white text-xs transition-colors"
              >
                Decline &amp; Re-open Radar Dispatch Network
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Binding Service Agreement Confirmation Section */}
      {showAgreementSheet && (
        <section className="relative w-full rounded-xl bg-[#222a3d]/95 backdrop-blur-2xl shadow-2xl p-4 md:p-6 flex flex-col gap-4 border border-[#4edea3]/40 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4edea3] via-[#89ceff] to-[#ffb95f]"></div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-2 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#4edea3]/20 text-[#4edea3] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">gavel</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#4edea3]">
                  Ready for Execution
                </span>
                <h3 className="text-base font-bold text-white">
                  Binding Service Agreement &amp; Auto-Dispatch Protocols
                </h3>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#171f33] text-[#bec8d2] text-[10px] uppercase font-mono border border-white/5">
              Contract #AC-2025-8842-E
            </span>
          </div>

          {/* Voice Quote Transcription */}
          <div className="rounded-xl bg-[#060e20]/90 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 border border-white/5">
            <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 ring-2 ring-[#ffb95f]">
              <img
                alt="Mark J."
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaz397TpeK9wHKhlQ-LWITbHWEvxV1IXzEAqubiSuS4FoXgI3NYH787ar8yeNsCAQ2p4G7_BwbLN0oIvXu6jKmGZzsRGRjJqncqM0i5M5pxZE9KPNS7XwfIcC_2NkC-vu4dc10rwkp4oHwOYjNiZBCLJc-SEZLU32gkOfyqdj_sCgUaabYnIx--jWI0w5QDr5nCrrfhreXI3xMOJ1yMlBhKNY7pQcGWLqL0m81vYdrINVae5b0M9eJnQ"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#4edea3] ring-2 ring-[#060e20]"></span>
            </div>
            <div className="flex flex-col gap-1 w-full">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">Worker Mark J.</span>
                  <span className="text-[10px] uppercase font-bold text-[#ffb95f] bg-[#ffb95f]/15 px-2 py-0.5 rounded-full border border-[#ffb95f]/20 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">mic</span>
                    Voice-to-Text Verified
                  </span>
                </div>
                <span className="text-[11px] text-[#88929b]">Transcribed at 10:16 AM</span>
              </div>
              <p className="text-xs text-white italic">
                “I've reviewed the panel photos and can fix the burnt contact within 45 minutes. Replacement 30A Eaton
                breaker is already in my service van.”
              </p>
            </div>
          </div>

          {/* Binding Escrow Terms */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-[#171f33]/70 border border-white/5 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-[#4edea3] text-xs font-bold">
                <span className="material-symbols-outlined text-base">lock</span>
                Smart Escrow Lock
              </div>
              <p className="text-[11px] text-[#bec8d2]">
                Funds are locked in high-security isolation. The technician is only disbursed upon your physical sign-off.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-[#171f33]/70 border border-white/5 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-[#89ceff] text-xs font-bold">
                <span className="material-symbols-outlined text-base">near_me</span>
                Automated GPS Tracking
              </div>
              <p className="text-[11px] text-[#bec8d2]">
                Upon mutual acceptance, Mark J.'s service van turns live on satellite radar with turn-by-turn proximity.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-[#171f33]/70 border border-white/5 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-[#ffb95f] text-xs font-bold">
                <span className="material-symbols-outlined text-base">shield</span>
                Craftsmanship Warranty
              </div>
              <p className="text-[11px] text-[#bec8d2]">
                Backed by the AegisCraft 30-Day Zero-Fault Protection Guarantee covering parts and labor up to $2,500.
              </p>
            </div>
          </div>

          {/* Execution Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-white/5">
            <div className="flex items-center gap-2 text-xs text-[#bec8d2]">
              <span className="material-symbols-outlined text-base text-[#4edea3]">verified</span>
              <span>Clicking ‘Execute Service Agreement’ locks escrow and triggers vehicle GPS broadcast.</span>
            </div>
            <button
              type="button"
              onClick={handleExecuteAgreement}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#4edea3] text-[#003824] hover:bg-[#6ffbbe] text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(78,222,163,0.4)] transition-all"
            >
              <span className="material-symbols-outlined text-base font-bold">electric_bolt</span>
              <span>Execute Service Agreement ($ {currentBidValue.toFixed(2)})</span>
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
