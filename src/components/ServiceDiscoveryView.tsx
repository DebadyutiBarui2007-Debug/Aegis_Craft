import React, { useEffect, useState } from 'react';
import { ServiceCategory, ServiceAgency } from '../types/index.ts';
import { formatInr } from '../lib/biddingEngine.ts';
import { api } from '../services/api.ts';

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

  // Nearby Agencies State
  const [agencies, setAgencies] = useState<ServiceAgency[]>([]);
  const [agencyCategoryFilter, setAgencyCategoryFilter] = useState('all');
  const [agencySearchText, setAgencySearchText] = useState('');
  const [loadingAgencies, setLoadingAgencies] = useState(false);

  useEffect(() => {
    const fetchAgencies = async () => {
      setLoadingAgencies(true);
      try {
        const res = await api.getNearbyAgencies(12.9784, 77.6408, 12.0, agencyCategoryFilter, 'Bengaluru');
        setAgencies(res.agencies || []);
      } catch (err) {
        console.error('Failed to load agencies:', err);
      } finally {
        setLoadingAgencies(false);
      }
    };
    fetchAgencies();
  }, [agencyCategoryFilter]);

  // Filter categories
  const filteredCategories = categories.filter((cat) => {
    const matchesSearch =
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'emergency') return cat.emergencyReady;
    if (activeFilter === 'commercial') return cat.isCommercial;
    if (activeFilter === 'low-rate') return cat.baseRate <= 450;
    if (activeFilter === 'top-rated') return cat.ratingTier >= 4.9;
    return true;
  });

  const getCategoryRateRange = (catId: string) => {
    const found = categories.find((c) => c.id === catId);
    if (!found) return '₹450 - ₹650';
    return urgency === 'emergency' ? `${found.rateRange} + ₹250 SOS` : found.rateRange;
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

  // Filtered agencies
  const filteredAgencies = agencies.filter((a) => {
    if (!agencySearchText.trim()) return true;
    const q = agencySearchText.toLowerCase();
    return (
      a.name.toLowerCase().includes(q) ||
      a.locality.toLowerCase().includes(q) ||
      a.pincode.includes(q) ||
      a.address.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/4 w-[38rem] h-[38rem] bg-[#4edea3]/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-48 right-10 w-[30rem] h-[30rem] bg-[#ffb95f]/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 flex flex-col gap-6 w-full">
        {/* Top Geolocation Precision Pill Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#222a3d]/60 backdrop-blur-xl p-3.5 rounded-xl shadow-lg border border-white/5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-[#4edea3]/15 flex items-center justify-center text-[#4edea3] shrink-0">
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                my_location
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase text-[#4edea3] tracking-wider font-mono">
                  PostGIS ST_DWithin Lock Active
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
                <span className="text-xs text-[#bec8d2] hidden md:inline">
                  Bharat RTK Telemetry (12.9784° N, 77.6408° E)
                </span>
              </div>
              <p className="text-sm md:text-base font-semibold text-white truncate">
                {currentAddress} <span className="text-[#bec8d2] font-normal hidden lg:inline">— Bengaluru Central Metro Zone</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <button
              onClick={onOpenEditAddress}
              className="px-3.5 py-1.5 rounded-lg bg-[#171f33] text-white hover:text-[#89ceff] hover:bg-[#2d3449] transition-all text-xs font-medium flex items-center gap-1.5 shadow-sm border border-white/5 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-base text-[#89ceff]">edit_location_alt</span>
              <span>Change PIN / Area</span>
            </button>
            <div className="h-6 w-px bg-[#2d3449] mx-1 hidden sm:block"></div>
            <div className="px-3 py-1 rounded-full bg-[#00a572]/20 text-[#4edea3] text-[11px] font-bold uppercase tracking-wider hidden sm:flex items-center gap-1 border border-[#00a572]/30">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              Geofence Verified
            </div>
          </div>
        </div>

        {/* Hero Header & Live Dispatch Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Main Pitch & Live Telemetry (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-[#131b2e]/70 backdrop-blur-2xl p-6 md:p-8 rounded-xl shadow-xl border border-white/5 relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-56 h-56 bg-[#89ceff]/10 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="flex flex-col gap-3 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171f33] text-[#4edea3] text-[11px] font-bold uppercase tracking-wider w-fit border border-[#4edea3]/20">
                <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
                Real-Time Hyperlocal Blue-Collar Node • Bengaluru
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Autonomous Trade Dispatch &amp; Protected <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400">INR Escrow</span>
              </h1>
              <p className="text-sm text-[#bec8d2] leading-relaxed max-w-xl">
                Match certified electricians, plumbers, HVAC technicians, and trade masters within 3.2km. Every booking locks funds into a secure bank-grade escrow vault, released strictly upon dual digital sign-off.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-6 mt-6 border-t border-white/5 relative z-10">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#bec8d2]">Certified Pros Online</span>
                <span className="text-xl md:text-2xl font-bold text-[#4edea3]">142</span>
                <span className="text-[10px] text-slate-400">Indiranagar &amp; Koramangala</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#bec8d2]">Average Response</span>
                <span className="text-xl md:text-2xl font-bold text-[#ffb95f]">4.2 Min</span>
                <span className="text-[10px] text-slate-400">Rapid Motorcycle / Van Fleet</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#bec8d2]">INR Escrow Protected</span>
                <span className="text-xl md:text-2xl font-bold text-[#89ceff]">100%</span>
                <span className="text-[10px] text-slate-400">₹25,000 30-Day Guarantee</span>
              </div>
            </div>
          </div>

          {/* Fast Dispatch Terminal Form (5 cols) */}
          <div className="lg:col-span-5 bg-[#171f33]/90 backdrop-blur-2xl p-5 md:p-6 rounded-xl shadow-xl border border-white/10 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#0ea5e9]/20 text-[#89ceff] flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">bolt</span>
                </div>
                <h3 className="text-base font-bold text-white">Fast Dispatch Terminal</h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#4edea3] bg-[#4edea3]/10 px-2 py-0.5 rounded border border-[#4edea3]/20 font-mono">
                Active Node
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
                  className={`h-9 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
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
                  className={`h-9 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    urgency === 'emergency'
                      ? 'bg-[#93000a]/40 text-[#ffb4ab] shadow-sm border border-[#ffb4ab]/30'
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
                Common Fault Tags
              </label>
              <div className="flex flex-wrap gap-1.5">
                {categories
                  .find((c) => c.id === selectedTrade)
                  ?.commonIssues.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => addTagToSummary(tag)}
                      className="px-2.5 py-1 rounded bg-[#222a3d] hover:bg-[#31394d] text-white text-[11px] transition-colors border border-white/5 active:scale-95 cursor-pointer"
                    >
                      + {tag}
                    </button>
                  ))}
              </div>
            </div>

            {/* Situation Summary Textarea */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold uppercase text-[#bec8d2] tracking-wider">
                Fault Diagnostics Description
              </label>
              <textarea
                className="w-full bg-[#222a3d] border border-white/10 rounded-lg p-3 text-xs text-white placeholder-[#88929b] focus:outline-none focus:ring-2 focus:ring-[#89ceff]/40 resize-none shadow-inner"
                rows={2}
                placeholder="Describe fault symptom, breaker model, or urgent threat..."
                value={situationSummary}
                onChange={(e) => setSituationSummary(e.target.value)}
              />
            </div>

            {/* Live Quote Calculation Preview */}
            <div className="bg-[#171f33]/80 p-3 rounded-lg flex items-center justify-between border border-white/5">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#bec8d2]">
                  Estimated Benchmark Corridor
                </span>
                <span className="text-lg font-bold text-[#ffb95f] font-mono">
                  {getCategoryRateRange(selectedTrade)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-[#4edea3] uppercase block font-mono">₹ Escrow Locked</span>
                <span className="text-[10px] text-[#bec8d2]">Zero advance fee</span>
              </div>
            </div>

            {/* Execute Button */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSearchSubmit}
              className="w-full h-12 rounded-lg bg-[#0ea5e9] hover:bg-[#89ceff] hover:text-[#00344d] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-[#0ea5e9]/25 transition-all active:scale-[0.98] cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">radar</span>
              <span>{isSubmitting ? 'Querying PostGIS 3.4 Proximity...' : 'Execute PostGIS Proximity Search'}</span>
            </button>
          </div>
        </div>

        {/* Active Job In-Flight Teaser Strip */}
        <div className="bg-[#171f33]/70 backdrop-blur-xl p-4 rounded-xl shadow-md border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative shrink-0">
              <img
                alt="Rajesh Sharma"
                className="w-12 h-12 rounded-lg object-cover ring-2 ring-[#4edea3]"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80"
              />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#4edea3] ring-2 ring-[#222a3d]"></span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase text-[#4edea3] font-mono">Active Dispatch Stream</span>
                <span className="text-[#88929b]">•</span>
                <span className="text-xs text-[#ffb95f] font-mono">Job #JOB-8842</span>
              </div>
              <p className="text-sm font-semibold text-white truncate">
                Electrical Service Panel Diagnostics • <span className="text-[#89ceff]">Rajesh Sharma (Grade A Master Electrician)</span>
              </p>
              <p className="text-xs text-[#bec8d2]">
                En Route in Commercial Service Vehicle • 420m away (Est. 4 mins arrival, Indiranagar 12th Main)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
            <button
              type="button"
              onClick={onNavigateToTracking}
              className="px-4 py-2 rounded-lg bg-[#222a3d] hover:bg-[#31394d] text-white text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm text-[#89ceff]">navigation</span>
              Live GPS Track
            </button>
            <button
              type="button"
              onClick={onNavigateToTracking}
              className="px-4 py-2 rounded-lg bg-[#0ea5e9] text-white hover:bg-[#89ceff] hover:text-[#00344d] text-xs font-semibold transition-all flex items-center gap-1.5 shadow-md shadow-[#0ea5e9]/20 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">phone_in_talk</span>
              Contact Pro
            </button>
          </div>
        </div>

        {/* Categories Section */}
        <div className="flex flex-col gap-3 pt-2">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-[#4edea3] text-[11px] font-bold uppercase tracking-wider font-mono">
                <span className="material-symbols-outlined text-sm">construction</span>
                Verified Trades Directory (Bengaluru)
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
                placeholder="Search trade (e.g. MCB tripping, plumbing, lock)..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-3 flex items-center text-[#bec8d2] hover:text-white cursor-pointer"
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
              className={`px-4 py-1.5 rounded-full font-medium shrink-0 transition-all cursor-pointer ${
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
              className={`px-4 py-1.5 rounded-full font-medium shrink-0 transition-all cursor-pointer ${
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
              className={`px-4 py-1.5 rounded-full font-medium shrink-0 transition-all cursor-pointer ${
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
              className={`px-4 py-1.5 rounded-full font-medium shrink-0 transition-all cursor-pointer ${
                activeFilter === 'low-rate'
                  ? 'bg-[#0ea5e9] text-white shadow-md shadow-[#0ea5e9]/20'
                  : 'bg-[#222a3d] text-[#bec8d2] hover:text-white'
              }`}
            >
              Under ₹500/hr
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('top-rated')}
              className={`px-4 py-1.5 rounded-full font-medium shrink-0 transition-all cursor-pointer ${
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
                <span className="text-base font-bold text-[#ffb95f] font-mono">
                  From {formatInr(cat.baseRate)}
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

        {/* ------------------------------------------------------------- */}
        {/* NEW SECTION: Genuine Nearby Service Agencies & Business Hubs  */}
        {/* ------------------------------------------------------------- */}
        <section className="mt-6 p-6 rounded-2xl bg-gradient-to-b from-[#131b2e]/90 to-[#0e1526]/90 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold font-mono tracking-wider uppercase border border-emerald-500/30">
                  Verified Brand Infrastructure
                </span>
                <span className="text-xs text-slate-400 font-mono">ST_DWithin Spatial Directory</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight mt-1">
                Nearby Service Agencies &amp; Authorized Business Hubs
              </h3>
              <p className="text-xs text-[#bec8d2] max-w-2xl mt-0.5">
                Genuine authorized brand service wings, structural care centers, and certified OEM hubs across Bengaluru (Indiranagar, Koramangala, Domlur).
              </p>
            </div>

            {/* Quick search input for agencies */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search agency, PIN (e.g. 560038) or brand..."
                value={agencySearchText}
                onChange={(e) => setAgencySearchText(e.target.value)}
                className="w-64 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <select
                value={agencyCategoryFilter}
                onChange={(e) => setAgencyCategoryFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="all">All Sectors</option>
                <option value="electrical">Electrical</option>
                <option value="plumbing">Plumbing</option>
                <option value="hvac">HVAC</option>
                <option value="appliance">Appliance</option>
                <option value="locksmith">Locksmith</option>
                <option value="roofing">Roofing/Sealing</option>
                <option value="carpentry">Carpentry</option>
              </select>
            </div>
          </div>

          {/* Agencies Grid */}
          {loadingAgencies ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400">
              <span className="material-symbols-outlined text-3xl animate-spin text-emerald-400">refresh</span>
              <span className="text-xs mt-2 font-mono">Querying Bengaluru Spatial Directory...</span>
            </div>
          ) : filteredAgencies.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No service agencies matched "{agencySearchText}". Try searching by locality or category.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-5">
              {filteredAgencies.map((agency) => (
                <div
                  key={agency.id}
                  className="bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/40 rounded-xl p-4 flex flex-col justify-between transition-all shadow-md group"
                >
                  <div>
                    {/* Top pill bar */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-semibold text-emerald-400 uppercase font-mono tracking-wider flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        {agency.category}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                        {agency.distanceKm} km away
                      </span>
                    </div>

                    {/* Name */}
                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                      {agency.name}
                    </h4>

                    {/* Address & Locality */}
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {agency.address}, {agency.locality} (PIN {agency.pincode})
                    </p>

                    {/* Verified source */}
                    <div className="mt-2 text-[10px] text-slate-500 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-teal-400">verified</span>
                      <span className="truncate">{agency.verifiedSource}</span>
                    </div>

                    {/* Rating & Hours */}
                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-300">
                      <span className="flex items-center gap-1 text-amber-400 font-semibold font-mono">
                        ★ {agency.rating} <span className="text-slate-500 text-[10px]">({agency.reviewCount})</span>
                      </span>
                      <span className="text-[10px] text-slate-400">{agency.openingHours}</span>
                    </div>
                  </div>

                  {/* Actions (Call & Website) */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    {agency.phone ? (
                      <a
                        href={`tel:${agency.phone.replace(/\s+/g, '')}`}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                        title={`Call ${agency.phone}`}
                      >
                        <span className="material-symbols-outlined text-xs">call</span>
                        <span>{agency.phone}</span>
                      </a>
                    ) : (
                      <span className="text-[10px] text-slate-500 italic">No direct phone verified</span>
                    )}

                    {agency.website && (
                      <a
                        href={agency.website}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title={`Visit ${agency.name} official site`}
                      >
                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Trust Credential Band */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="bg-[#131b2e]/60 backdrop-blur-xl p-4 rounded-xl flex items-start gap-3 border border-white/5 shadow-md">
            <div className="w-10 h-10 rounded-lg bg-[#4edea3]/15 text-[#4edea3] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">verified</span>
            </div>
            <div className="flex flex-col">
              <h4 className="text-sm font-semibold text-white">Triple-Layer Indian KYC</h4>
              <p className="text-xs text-[#bec8d2] mt-1 leading-relaxed">
                Technicians provide government photo identity, certified trade licensure, and police background clearance before dispatch privileges.
              </p>
            </div>
          </div>
          <div className="bg-[#131b2e]/60 backdrop-blur-xl p-4 rounded-xl flex items-start gap-3 border border-white/5 shadow-md">
            <div className="w-10 h-10 rounded-lg bg-[#ffb95f]/15 text-[#ffb95f] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
            </div>
            <div className="flex flex-col">
              <h4 className="text-sm font-semibold text-white">Protected ₹ Escrow Vault</h4>
              <p className="text-xs text-[#bec8d2] mt-1 leading-relaxed">
                Payment is held safely in automated escrow. Funds are never released to the technician until work passes dual digital sign-off.
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
                Real-time RTK GPS checks confirm the technician is physically on your premises during billed work intervals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
