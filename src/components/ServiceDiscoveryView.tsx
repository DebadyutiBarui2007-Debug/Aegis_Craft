import React, { useState } from 'react';
import { ServiceCategory } from '../types/index.ts';

interface ServiceDiscoveryViewProps {
  categories: ServiceCategory[];
  currentAddress: string;
  onOpenEditAddress: () => void;
  onOpenSos: () => void;
  onSelectCategory: (categoryId: string) => void;
  onExecuteDispatchSearch: (category: string, urgency: 'standard' | 'emergency', summary: string) => void;
  onNavigateToTracking: () => void;
}

export const ServiceDiscoveryView: React.FC<ServiceDiscoveryViewProps> = ({
  categories,
  currentAddress,
  onOpenEditAddress,
  onOpenSos,
  onSelectCategory,
  onExecuteDispatchSearch,
  onNavigateToTracking,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'emergency' | 'commercial' | 'low-rate' | 'top-rated'>('all');
  const [selectedTrade, setSelectedTrade] = useState('electrical');
  const [urgency, setUrgency] = useState<'standard' | 'emergency'>('standard');
  const [situationSummary, setSituationSummary] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter categories
  const filteredCategories = categories.filter((cat) => {
    const matchesSearch =
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'emergency') return cat.emergencyReady;
    if (activeFilter === 'commercial') return cat.isCommercial;
    if (activeFilter === 'low-rate') return cat.baseRate <= 45;
    if (activeFilter === 'top-rated') return cat.ratingTier >= 4.9;
    return true;
  });

  const getCategoryRateRange = (catId: string) => {
    const found = categories.find((c) => c.id === catId);
    if (!found) return '$45 - $65';
    return urgency === 'emergency' ? `${found.rateRange} + $35 SOS` : found.rateRange;
  };

  const addTagToSummary = (tagText: string) => {
    if (situationSummary) {
      setSituationSummary((prev) => `${prev}; ${tagText}`);
    } else {
      setSituationSummary(tagText);
    }
  };

  const handleSearchSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onExecuteDispatchSearch(selectedTrade, urgency, situationSummary);
    }, 600);
  };

  return (
    <div className="flex flex-col w-full pb-12">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/4 w-[38rem] h-[38rem] bg-[#4edea3]/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-48 right-10 w-[30rem] h-[30rem] bg-[#ffb95f]/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 flex flex-col gap-6 w-full">
        {/* Top Geolocation Precision Pill Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#222a3d]/60 backdrop-blur-xl p-3 rounded-xl shadow-lg border border-white/5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-[#4edea3]/15 flex items-center justify-center text-[#4edea3] shrink-0">
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                my_location
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase text-[#4edea3] tracking-wider">
                  PostGIS Lock Active
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
                <span className="text-xs text-[#bec8d2] hidden md:inline">
                  RTK Satellite Sync (±1.4m Accuracy)
                </span>
              </div>
              <p className="text-base font-semibold text-white truncate">
                {currentAddress} <span className="text-[#bec8d2] font-normal hidden lg:inline">— Metro Sector 4</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <button
              onClick={onOpenEditAddress}
              className="px-3.5 py-1.5 rounded-lg bg-[#171f33] text-white hover:text-[#89ceff] hover:bg-[#2d3449] transition-all text-xs font-medium flex items-center gap-1.5 shadow-sm border border-white/5"
              type="button"
            >
              <span className="material-symbols-outlined text-base text-[#89ceff]">edit_location_alt</span>
              <span>Edit Pin</span>
            </button>
            <div className="h-6 w-px bg-[#2d3449] mx-1 hidden sm:block"></div>
            <div className="px-3 py-1 rounded-full bg-[#00a572]/20 text-[#4edea3] text-[11px] font-bold uppercase tracking-wider hidden sm:flex items-center gap-1 border border-[#00a572]/30">
              <span className="material-symbols-outlined text-sm">shield</span>
              Geofence Verified
            </div>
          </div>
        </div>

        {/* Hero Header & Emergency SOS Banner Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Main Pitch & Live Telemetry (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-[#131b2e]/70 backdrop-blur-2xl p-6 md:p-8 rounded-xl shadow-xl border border-white/5 relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-56 h-56 bg-[#89ceff]/10 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="flex flex-col gap-3 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171f33] text-[#4edea3] text-[11px] font-bold uppercase tracking-wider w-fit border border-[#4edea3]/20">
                <span className="w-2 h-2 rounded-full bg-[#4edea3] shadow-[0_0_8px_rgba(78,222,163,0.8)]"></span>
                Immediate Dispatch Network • 182 Verified Pro Units
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
                Verified Blue-Collar Professionals at Your Doorstep in{' '}
                <span className="text-[#4edea3]">Minutes</span>.
              </h1>
              <p className="text-sm text-[#bec8d2] max-w-xl leading-relaxed">
                PostGIS-orchestrated rapid dispatch for certified master trades. Secure milestone escrow,
                bi-directional background validation, and real-time radar telemetry.
              </p>
            </div>

            <div className="mt-6 pt-4 flex flex-wrap items-center gap-4 relative z-10 border-t border-white/5">
              <div className="flex items-center gap-3 bg-[#171f33]/60 px-4 py-2.5 rounded-lg border border-white/5 shadow-sm">
                <span className="material-symbols-outlined text-[#89ceff] text-2xl">verified_user</span>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-white">100% Identity Checked</span>
                  <span className="text-[11px] text-[#bec8d2]">State License &amp; Insurance Bonded</span>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-[#171f33]/60 px-4 py-2.5 rounded-lg border border-white/5 shadow-sm">
                <span className="material-symbols-outlined text-[#4edea3] text-2xl">lock</span>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-white">Vault Escrow</span>
                  <span className="text-[11px] text-[#bec8d2]">Funds locked until sign-off</span>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-[#171f33]/60 px-4 py-2.5 rounded-lg border border-white/5 shadow-sm">
                <span className="material-symbols-outlined text-[#ffb95f] text-2xl">avg_time</span>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-white">14 Min Median Arrival</span>
                  <span className="text-[11px] text-[#bec8d2]">PostGIS 3.2km radius</span>
                </div>
              </div>
            </div>
          </div>

          {/* Golden Urgent SOS Rescue Banner (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#d88a00]/25 via-[#222a3d]/90 to-[#060e20] backdrop-blur-2xl p-6 rounded-xl shadow-2xl border border-[#ffb95f]/20 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-[#ffb95f]/15 rounded-full blur-[70px] pointer-events-none"></div>
            <div className="flex flex-col gap-2 relative z-10">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#93000a]/20 text-[#ffb4ab] text-[11px] font-bold uppercase tracking-wider border border-[#ffb4ab]/30">
                  <span className="w-2 h-2 rounded-full bg-[#ffb4ab] animate-ping"></span>
                  Emergency Broadcast Channel
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#ffb95f]">
                  &lt;4 Min Dispatch
                </span>
              </div>
              <h2 className="text-2xl font-bold text-[#ffddb8] tracking-tight mt-1">
                Immediate Rescue Protocol
              </h2>
              <p className="text-xs text-[#bec8d2] leading-relaxed">
                Electrical fire risk, blown main pipes, or dangerous lockout. Bypasses normal quote queue and activates
                all certified tier-1 master units within 3km immediately.
              </p>
            </div>

            <div className="mt-6 pt-2 flex flex-col gap-2 relative z-10">
              <button
                type="button"
                onClick={onOpenSos}
                className="w-full h-14 bg-[#93000a] text-white hover:bg-[#ffb4ab] hover:text-[#690005] rounded-lg text-sm font-bold flex items-center justify-center gap-3 shadow-xl shadow-[#93000a]/30 transition-all active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-2xl animate-pulse">crisis_alert</span>
                <span className="tracking-wide uppercase">Broadcast Emergency SOS Now</span>
              </button>
              <div className="flex items-center justify-between text-[#bec8d2] text-xs px-1">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-[#4edea3]">check_circle</span>
                  Automatic Video Dispatch Ready
                </span>
                <span>Fixed Emergency Surcharge $35</span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Job In-Flight Teaser Strip */}
        <div className="bg-[#171f33]/70 backdrop-blur-xl p-4 rounded-xl shadow-md border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative shrink-0">
              <img
                alt="Mark J."
                className="w-12 h-12 rounded-lg object-cover ring-2 ring-[#4edea3]"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaz397TpeK9wHKhlQ-LWITbHWEvxV1IXzEAqubiSuS4FoXgI3NYH787ar8yeNsCAQ2p4G7_BwbLN0oIvXu6jKmGZzsRGRjJqncqM0i5M5pxZE9KPNS7XwfIcC_2NkC-vu4dc10rwkp4oHwOYjNiZBCLJc-SEZLU32gkOfyqdj_sCgUaabYnIx--jWI0w5QDr5nCrrfhreXI3xMOJ1yMlBhKNY7pQcGWLqL0m81vYdrINVae5b0M9eJnQ"
              />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#4edea3] ring-2 ring-[#222a3d]"></span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase text-[#4edea3]">Active Dispatch Stream</span>
                <span className="text-[#88929b]">•</span>
                <span className="text-xs text-[#ffb95f]">Job #JOB-8842</span>
              </div>
              <p className="text-sm font-semibold text-white truncate">
                Electrical Service Panel Inspection • <span className="text-[#89ceff]">Mark J. (Master Electrician)</span>
              </p>
              <p className="text-xs text-[#bec8d2]">
                En Route in Ford Transit Service Van • 0.8 km away (Est. 4 mins arrival)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
            <button
              type="button"
              onClick={onNavigateToTracking}
              className="px-4 py-2 rounded-lg bg-[#222a3d] hover:bg-[#31394d] text-white text-xs font-semibold transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm text-[#89ceff]">navigation</span>
              Live GPS Track
            </button>
            <button
              type="button"
              onClick={onNavigateToTracking}
              className="px-4 py-2 rounded-lg bg-[#0ea5e9] text-white hover:bg-[#89ceff] hover:text-[#00344d] text-xs font-semibold transition-all flex items-center gap-1.5 shadow-md shadow-[#0ea5e9]/20"
            >
              <span className="material-symbols-outlined text-sm">phone_in_talk</span>
              Contact Pro
            </button>
          </div>
        </div>

        {/* Search & Category Header Area */}
        <div className="flex flex-col gap-3 pt-2">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-[#4edea3] text-[11px] font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm">construction</span>
                Verified Trades Directory
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Select Required Trade Specialty</h2>
            </div>

            {/* Search Input */}
            <div className="w-full md:w-96 relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[#bec8d2]">
                <span className="material-symbols-outlined text-xl">search</span>
              </div>
              <input
                className="w-full h-11 bg-[#222a3d]/70 backdrop-blur-md rounded-lg pl-10 pr-4 text-sm text-white placeholder-[#88929b] focus:outline-none focus:ring-2 focus:ring-[#89ceff]/40 border border-white/5"
                placeholder="Search service (e.g. leaking faucet, rewiring, lock)..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-3 flex items-center text-[#bec8d2] hover:text-white"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-1.5 rounded-full font-medium shrink-0 transition-all ${
                activeFilter === 'all'
                  ? 'bg-[#0ea5e9] text-white shadow-md shadow-[#0ea5e9]/20'
                  : 'bg-[#222a3d] text-[#bec8d2] hover:text-white'
              }`}
            >
              All Specialties ({categories.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('emergency')}
              className={`px-4 py-1.5 rounded-full font-medium shrink-0 transition-all ${
                activeFilter === 'emergency'
                  ? 'bg-[#0ea5e9] text-white shadow-md shadow-[#0ea5e9]/20'
                  : 'bg-[#222a3d] text-[#bec8d2] hover:text-white'
              }`}
            >
              Emergency Ready (6)
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('commercial')}
              className={`px-4 py-1.5 rounded-full font-medium shrink-0 transition-all ${
                activeFilter === 'commercial'
                  ? 'bg-[#0ea5e9] text-white shadow-md shadow-[#0ea5e9]/20'
                  : 'bg-[#222a3d] text-[#bec8d2] hover:text-white'
              }`}
            >
              Commercial Certified
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('low-rate')}
              className={`px-4 py-1.5 rounded-full font-medium shrink-0 transition-all ${
                activeFilter === 'low-rate'
                  ? 'bg-[#0ea5e9] text-white shadow-md shadow-[#0ea5e9]/20'
                  : 'bg-[#222a3d] text-[#bec8d2] hover:text-white'
              }`}
            >
              Under $45/hr
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('top-rated')}
              className={`px-4 py-1.5 rounded-full font-medium shrink-0 transition-all ${
                activeFilter === 'top-rated'
                  ? 'bg-[#0ea5e9] text-white shadow-md shadow-[#0ea5e9]/20'
                  : 'bg-[#222a3d] text-[#bec8d2] hover:text-white'
              }`}
            >
              ★ 4.9+ Master Tier
            </button>
          </div>
        </div>

        {/* 8 Nature-Styled Glass Category Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                setSelectedTrade(cat.id);
                onSelectCategory(cat.id);
              }}
              className="group bg-[#131b2e]/70 hover:bg-[#171f33]/90 backdrop-blur-xl p-4 rounded-xl shadow-lg border border-white/5 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="w-12 h-12 rounded-xl bg-[#ffb95f]/15 text-[#ffb95f] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-2xl font-bold">{cat.icon}</span>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-[#4edea3]/15 text-[#4edea3] text-[11px] font-semibold tracking-wider uppercase flex items-center gap-1 border border-[#4edea3]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
                  {cat.prosOnline} Pros Online
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-base font-semibold text-white group-hover:text-[#89ceff] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#bec8d2] mt-1 line-clamp-2">{cat.description}</p>
              </div>
              <div className="mt-4 pt-2 border-t border-white/5 flex items-center justify-between">
                <span className="text-base font-bold text-[#ffb95f]">
                  From ${cat.baseRate}
                  <span className="text-xs text-[#bec8d2] font-normal">/hr</span>
                </span>
                <span className="text-xs font-semibold text-[#89ceff] flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                  Dispatch
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Live Interactive Map Preview & Fast Dispatch Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-2">
          {/* PostGIS Live Map HUD Panel (7 cols) */}
          <div className="lg:col-span-7 bg-[#131b2e]/80 backdrop-blur-2xl rounded-xl p-4 md:p-6 flex flex-col gap-4 shadow-2xl border border-white/5 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4edea3] animate-ping"></span>
                <span className="text-base font-bold text-white">Live PostGIS Proximity Grid</span>
                <span className="px-2 py-0.5 rounded-full bg-[#171f33] text-[#89ceff] text-[11px] font-semibold">
                  3.2km Radius
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#bec8d2]">
                <span className="material-symbols-outlined text-sm text-[#4edea3]">satellite_alt</span>
                Telemetry Sync: 100%
              </div>
            </div>

            {/* Dark Map HUD Simulation Graphic */}
            <div className="relative w-full h-[380px] rounded-lg overflow-hidden bg-[#060e20] flex items-center justify-center border border-white/10">
              {/* Concentric Proximity Rings */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[340px] h-[340px] rounded-full border border-[#4edea3]/20 animate-pulse"></div>
                <div className="w-[230px] h-[230px] rounded-full border border-[#89ceff]/25 absolute"></div>
                <div className="w-[120px] h-[120px] rounded-full border border-[#ffb95f]/30 absolute"></div>
              </div>

              {/* Grid Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#89ceff" strokeWidth="0.5" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              {/* User Origin Blip */}
              <div className="absolute z-20 flex flex-col items-center">
                <div className="w-5 h-5 rounded-full bg-[#89ceff] flex items-center justify-center shadow-[0_0_16px_rgba(137,206,255,0.9)] animate-bounce">
                  <span className="w-2 h-2 rounded-full bg-[#0b1326]"></span>
                </div>
                <div className="mt-1 px-2 py-0.5 rounded bg-[#060e20]/90 backdrop-blur-md text-white text-[10px] font-semibold shadow-md border border-white/10">
                  Client Site (You)
                </div>
              </div>

              {/* Pro Blip 1: Mark J. (Electrical) */}
              <div className="absolute top-[28%] left-[32%] z-20 flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded-full bg-[#4edea3] flex items-center justify-center shadow-[0_0_12px_rgba(78,222,163,0.9)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#060e20]"></span>
                </div>
                <div className="px-2 py-1 rounded bg-[#222a3d]/90 backdrop-blur-md text-white text-[10px] shadow-md border border-white/10 flex items-center gap-1">
                  <span className="text-[#4edea3] font-semibold">Mark J.</span> • 0.8km (4m)
                </div>
              </div>

              {/* Pro Blip 2: Elena R. (Plumbing) */}
              <div className="absolute bottom-[35%] right-[26%] z-20 flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded-full bg-[#ffb95f] flex items-center justify-center shadow-[0_0_12px_rgba(255,185,95,0.9)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#060e20]"></span>
                </div>
                <div className="px-2 py-1 rounded bg-[#222a3d]/90 backdrop-blur-md text-white text-[10px] shadow-md border border-white/10 flex items-center gap-1">
                  <span className="text-[#ffb95f] font-semibold">Elena R.</span> • 1.4km (11m)
                </div>
              </div>

              {/* Pro Blip 3: Dave C. */}
              <div className="absolute top-[38%] right-[22%] z-20 flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded-full bg-[#4edea3] flex items-center justify-center shadow-[0_0_12px_rgba(78,222,163,0.9)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#060e20]"></span>
                </div>
                <div className="px-2 py-1 rounded bg-[#222a3d]/90 backdrop-blur-md text-white text-[10px] shadow-md border border-white/10 flex items-center gap-1">
                  <span className="text-[#4edea3] font-semibold">David C.</span> • 2.1km (15m)
                </div>
              </div>

              {/* Map Metric Overlay */}
              <div className="absolute bottom-3 left-3 right-3 z-30 bg-[#060e20]/80 backdrop-blur-lg px-3 py-2 rounded-lg flex items-center justify-between text-xs border border-white/5">
                <span className="flex items-center gap-1 text-[#4edea3]">
                  <span className="material-symbols-outlined text-sm">radar</span>
                  18 active dispatchable units in perimeter
                </span>
                <span className="text-white">
                  Average Response: <strong className="text-[#89ceff]">14 mins</strong>
                </span>
              </div>
            </div>

            {/* Bottom Telemetry Badges */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="bg-[#171f33]/60 p-2.5 rounded-lg flex flex-col border border-white/5">
                <span className="text-[10px] font-bold text-[#bec8d2] uppercase tracking-wider">Spatial Query</span>
                <span className="text-sm font-semibold text-[#4edea3] mt-0.5">ST_DWithin</span>
                <span className="text-[10px] text-[#88929b]">Real-time indexed</span>
              </div>
              <div className="bg-[#171f33]/60 p-2.5 rounded-lg flex flex-col border border-white/5">
                <span className="text-[10px] font-bold text-[#bec8d2] uppercase tracking-wider">Backgrounds</span>
                <span className="text-sm font-semibold text-[#89ceff] mt-0.5">100% Passed</span>
                <span className="text-[10px] text-[#88929b]">Checked 7-yr records</span>
              </div>
              <div className="bg-[#171f33]/60 p-2.5 rounded-lg flex flex-col border border-white/5">
                <span className="text-[10px] font-bold text-[#bec8d2] uppercase tracking-wider">Avg Escrow Lock</span>
                <span className="text-sm font-semibold text-[#ffb95f] mt-0.5">$80.00</span>
                <span className="text-[10px] text-[#88929b]">Zero fee dispute vault</span>
              </div>
            </div>
          </div>

          {/* Quick Dispatch Request Form (5 cols) */}
          <div className="lg:col-span-5 bg-[#131b2e]/90 backdrop-blur-2xl rounded-xl p-6 shadow-2xl border border-white/5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#89ceff]/15 text-[#89ceff] flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">bolt</span>
                </div>
                <h3 className="text-base font-bold text-white">Fast Dispatch Terminal</h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#4edea3] bg-[#4edea3]/10 px-2 py-0.5 rounded border border-[#4edea3]/20">
                No Waitlist
              </span>
            </div>

            {/* Trade Dropdown */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold uppercase text-[#bec8d2] tracking-wider">
                Selected Trade Specialty
              </label>
              <select
                className="w-full h-11 bg-[#222a3d] border border-white/10 rounded-lg px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#89ceff]/40 cursor-pointer"
                value={selectedTrade}
                onChange={(e) => setSelectedTrade(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.prosOnline} online)
                  </option>
                ))}
              </select>
            </div>

            {/* Urgency Level Toggles */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold uppercase text-[#bec8d2] tracking-wider">
                Dispatch Urgency
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#171f33] rounded-lg border border-white/5">
                <button
                  type="button"
                  onClick={() => setUrgency('standard')}
                  className={`h-9 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    urgency === 'standard'
                      ? 'bg-[#222a3d] text-white shadow-sm border border-white/10'
                      : 'text-[#bec8d2] hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm text-[#4edea3]">schedule</span>
                  Standard (Today)
                </button>
                <button
                  type="button"
                  onClick={() => setUrgency('emergency')}
                  className={`h-9 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    urgency === 'emergency'
                      ? 'bg-[#93000a]/30 text-[#ffb4ab] shadow-sm border border-[#ffb4ab]/30'
                      : 'text-[#bec8d2] hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm text-[#ffb4ab]">priority_high</span>
                  Immediate (&lt;30m)
                </button>
              </div>
            </div>

            {/* Problem Quick Tags */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold uppercase text-[#bec8d2] tracking-wider">
                Common Issue Tags
              </label>
              <div className="flex flex-wrap gap-1.5">
                {categories
                  .find((c) => c.id === selectedTrade)
                  ?.commonIssues.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => addTagToSummary(tag)}
                      className="px-2.5 py-1 rounded bg-[#222a3d] hover:bg-[#31394d] text-white text-[11px] transition-colors border border-white/5 active:scale-95"
                    >
                      + {tag}
                    </button>
                  ))}
              </div>
            </div>

            {/* Situation Summary Textarea */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold uppercase text-[#bec8d2] tracking-wider">
                Situation Summary
              </label>
              <textarea
                className="w-full bg-[#222a3d] border border-white/10 rounded-lg p-3 text-xs text-white placeholder-[#88929b] focus:outline-none focus:ring-2 focus:ring-[#89ceff]/40 resize-none shadow-inner"
                rows={3}
                placeholder="Describe symptom, equipment model, or safety threat..."
                value={situationSummary}
                onChange={(e) => setSituationSummary(e.target.value)}
              />
            </div>

            {/* Live Quote Calculation Preview */}
            <div className="bg-[#171f33]/80 p-3 rounded-lg flex items-center justify-between border border-white/5">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#bec8d2]">
                  Estimated First Hour
                </span>
                <span className="text-xl font-bold text-[#ffb95f]">
                  {getCategoryRateRange(selectedTrade)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-[#4edea3] uppercase block">Escrow Covered</span>
                <span className="text-[10px] text-[#bec8d2]">Zero upfront platform fees</span>
              </div>
            </div>

            {/* Execute Button */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSearchSubmit}
              className="w-full h-12 rounded-lg bg-[#0ea5e9] hover:bg-[#89ceff] hover:text-[#00344d] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-[#0ea5e9]/25 transition-all active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-lg">radar</span>
              <span>{isSubmitting ? 'Querying PostGIS Proximity...' : 'Execute PostGIS Proximity Search'}</span>
            </button>
          </div>
        </div>

        {/* Trust Credential Band */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="bg-[#131b2e]/60 backdrop-blur-xl p-4 rounded-xl flex items-start gap-3 border border-white/5 shadow-md">
            <div className="w-10 h-10 rounded-lg bg-[#4edea3]/15 text-[#4edea3] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">verified</span>
            </div>
            <div className="flex flex-col">
              <h4 className="text-sm font-semibold text-white">Triple-Layer KYC Verified</h4>
              <p className="text-xs text-[#bec8d2] mt-1 leading-relaxed">
                Every professional submits state licensure, criminal background records, and $2M active liability
                insurance before dispatch privileges.
              </p>
            </div>
          </div>
          <div className="bg-[#131b2e]/60 backdrop-blur-xl p-4 rounded-xl flex items-start gap-3 border border-white/5 shadow-md">
            <div className="w-10 h-10 rounded-lg bg-[#ffb95f]/15 text-[#ffb95f] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
            </div>
            <div className="flex flex-col">
              <h4 className="text-sm font-semibold text-white">Protected Vault Escrow</h4>
              <p className="text-xs text-[#bec8d2] mt-1 leading-relaxed">
                Payment is held safely in automated escrow. Funds are never transferred until work passes dual customer
                sign-off.
              </p>
            </div>
          </div>
          <div className="bg-[#131b2e]/60 backdrop-blur-xl p-4 rounded-xl flex items-start gap-3 border border-white/5 shadow-md">
            <div className="w-10 h-10 rounded-lg bg-[#89ceff]/15 text-[#89ceff] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">fmd_good</span>
            </div>
            <div className="flex flex-col">
              <h4 className="text-sm font-semibold text-white">PostGIS Geofence Guarantee</h4>
              <p className="text-xs text-[#bec8d2] mt-1 leading-relaxed">
                Real-time RTK GPS checks confirm the technician is physically on your premises during billed work
                intervals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
