import React, { useState } from 'react';
import { WorkerProfile } from '../types/index.ts';
import { formatInr } from '../lib/biddingEngine.ts';

interface RadarMatchingViewProps {
  workers: WorkerProfile[];
  onSelectWorkerForBid: (worker: WorkerProfile, initialRate: number) => void;
  onOpenSos: () => void;
}

export const RadarMatchingView: React.FC<RadarMatchingViewProps> = ({
  workers,
  onSelectWorkerForBid,
  onOpenSos,
}) => {
  const [selectedRadius, setSelectedRadius] = useState<number>(3.2);
  const [selectedCategory, setSelectedCategory] = useState<string>('electrical');
  const [isSimulatedEmpty, setIsSimulatedEmpty] = useState<boolean>(false);
  const [highlightedWorkerId, setHighlightedWorkerId] = useState<string>('worker-rajesh-sharma');
  const [activeModalWorker, setActiveModalWorker] = useState<WorkerProfile | null>(null);
  const [modalBidAmount, setModalBidAmount] = useState<number>(650);
  const [modalScopeNotes, setModalScopeNotes] = useState<string>(
    'Main MCB tripped with burning odor, circuit breaker 30A fault, requires immediate multimeter diagnostics & busbar check.'
  );

  // Filter workers based on radius and simulated empty toggle
  const visibleWorkers = isSimulatedEmpty
    ? []
    : workers.filter((w) => {
        if (selectedCategory !== 'all' && w.tradeCategory !== selectedCategory) return false;
        return w.distanceKm <= selectedRadius;
      });

  const featuredWorker = workers.find((w) => w.id === highlightedWorkerId) || workers[0];

  const handleOpenBidModal = (worker: WorkerProfile) => {
    setActiveModalWorker(worker);
    setModalBidAmount(worker.baseHourlyRate || 650);
  };

  const handleConfirmBidModal = () => {
    if (activeModalWorker) {
      onSelectWorkerForBid(activeModalWorker, modalBidAmount);
      setActiveModalWorker(null);
    }
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-4 flex flex-col gap-4">
      {/* Top Utility & Spatial Telemetry Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#171f33]/60 backdrop-blur-xl p-3.5 rounded-xl shadow-lg border border-white/5">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-[#4edea3]/15 flex items-center justify-center text-[#4edea3] shadow-[0_0_16px_rgba(78,222,163,0.35)] shrink-0">
            <span className="material-symbols-outlined text-2xl">radar</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase text-[#4edea3] tracking-wider font-mono">
                Spatial Indexer ST_Point
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-ping"></span>
              <span className="text-xs text-[#bec8d2]">PostGIS 3.4 Live Cluster • Bengaluru</span>
            </div>
            <p className="text-base font-semibold text-white truncate">
              Rescue Radar: 742 12th Main Road, HAL 2nd Stage, Indiranagar (560038)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-[#222a3d]/80 rounded-lg p-1 border border-white/5">
            <span className="px-3 py-1.5 rounded bg-[#0ea5e9] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm">
              <span className="material-symbols-outlined text-base">map</span>Hybrid Radar
            </span>
            <span className="px-3 py-1.5 rounded text-[#bec8d2] text-xs font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">view_stream</span>Technician Roster
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#222a3d]/60 rounded-lg text-xs text-[#bec8d2] border border-white/5">
            <span className="material-symbols-outlined text-[#ffb95f] text-sm">schedule</span>
            <span>
              Avg ETA: <strong className="text-[#ffb95f] font-semibold">5.8 min</strong>
            </span>
          </div>

          <button
            onClick={() => setIsSimulatedEmpty(!isSimulatedEmpty)}
            className="px-3 py-1.5 rounded-lg bg-[#2d3449]/80 hover:bg-[#3e4850] text-[#bec8d2] hover:text-[#ffb4ab] transition-all text-xs font-medium flex items-center gap-1.5 border border-white/5 cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-base">leak_remove</span>
            <span>{isSimulatedEmpty ? 'Restore Active Pros' : 'Simulate Out-of-Bounds'}</span>
          </button>
        </div>
      </div>

      {/* Main Workspace: Split HUD (Left 7 Cols Map, Right 5 Cols Verified Pros) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* LEFT: Geospatial Radar Map Viewport (7 cols) */}
        <section className="lg:col-span-7 flex flex-col gap-2 relative">
          <div className="relative w-full h-[580px] lg:h-[700px] rounded-xl overflow-hidden bg-[#060e20] shadow-2xl border border-white/10">
            {/* SVG Grid Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="radarGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(137, 206, 255, 0.2)" strokeWidth="0.8" />
                  <circle cx="0" cy="0" r="1.5" fill="rgba(78, 222, 163, 0.5)" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#radarGrid)" />
            </svg>

            {/* Concentric Dynamic Radar Rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="rounded-full bg-[#4edea3]/5 flex items-center justify-center transition-all duration-500 relative"
                style={{
                  width: `${Math.min(620, selectedRadius * 90)}px`,
                  height: `${Math.min(620, selectedRadius * 90)}px`,
                }}
              >
                <span className="absolute top-3 right-1/4 text-[10px] uppercase tracking-widest text-[#4edea3]/80 px-2 py-0.5 rounded bg-[#060e20]/80 border border-[#4edea3]/20 font-mono">
                  {selectedRadius.toFixed(1)} km Radius ST_DWithin
                </span>

                {/* 2km Isochrone */}
                <div className="w-[320px] h-[320px] rounded-full border border-[#89ceff]/20 bg-[#89ceff]/5 flex items-center justify-center">
                  <span className="absolute top-2 left-1/3 text-[10px] uppercase text-[#89ceff]/70 font-mono">
                    2.0 km Isochrone
                  </span>

                  {/* 1km Inner Ring */}
                  <div className="w-[180px] h-[180px] rounded-full border border-[#ffb95f]/25 bg-[#ffb95f]/5 flex items-center justify-center">
                    {/* Spinning Radar Sweep */}
                    <div className="absolute w-[460px] h-[460px] rounded-full overflow-hidden animate-[spin_6s_linear_infinite] origin-center opacity-70">
                      <div className="w-1/2 h-1/2 bg-gradient-to-br from-[#4edea3]/30 via-[#4edea3]/5 to-transparent origin-bottom-right"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Origin Pin */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
              <div className="relative flex items-center justify-center">
                <span className="absolute w-12 h-12 rounded-full bg-[#ffb95f]/25 animate-ping"></span>
                <span className="absolute w-8 h-8 rounded-full bg-[#ffb95f]/40"></span>
                <div className="w-10 h-10 rounded-full bg-[#ffb95f] flex items-center justify-center text-[#472a00] shadow-[0_0_24px_rgba(255,185,95,0.8)] z-10 font-bold">
                  <span className="material-symbols-outlined text-xl">home_repair_service</span>
                </div>
              </div>
              <div className="mt-1 px-2.5 py-1 rounded bg-[#060e20]/95 backdrop-blur-md text-white text-[10px] font-bold shadow-lg border border-white/10 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffb95f]"></span>
                Client Location (Indiranagar)
              </div>
            </div>

            {/* Worker Radar Pins */}
            {!isSimulatedEmpty && (
              <>
                {/* Worker Pin 1: Rajesh Sharma (0.4km North-East) */}
                <button
                  type="button"
                  onClick={() => setHighlightedWorkerId('worker-rajesh-sharma')}
                  className="absolute top-[36%] left-[62%] -translate-x-1/2 -translate-y-1/2 group transition-all z-20 cursor-pointer"
                >
                  <div className="relative flex items-center justify-center">
                    <span className="absolute w-8 h-8 rounded-full bg-[#4edea3]/30 animate-pulse"></span>
                    <div className="w-10 h-10 rounded-full bg-[#171f33] border-2 border-[#4edea3] shadow-[0_0_16px_rgba(78,222,163,0.6)] flex items-center justify-center text-white overflow-hidden">
                      <img
                        alt="Rajesh Sharma"
                        className="w-full h-full object-cover"
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80"
                      />
                    </div>
                  </div>
                  <div className="mt-1 px-2 py-0.5 rounded-full bg-[#060e20]/90 text-white text-[10px] font-semibold flex items-center gap-1 border border-[#4edea3]/40 shadow-md">
                    <span className="text-[#4edea3]">Rajesh S.</span> • 0.4 km (4m)
                  </div>
                </button>

                {/* Worker Pin 2: Priya Patel (1.1km North-West) */}
                <button
                  type="button"
                  onClick={() => setHighlightedWorkerId('worker-priya-patel')}
                  className="absolute top-[32%] left-[34%] -translate-x-1/2 -translate-y-1/2 group transition-all z-20 cursor-pointer"
                >
                  <div className="relative flex items-center justify-center">
                    <div className="w-9 h-9 rounded-full bg-[#171f33] border border-[#89ceff] shadow-[0_0_14px_rgba(137,206,255,0.4)] flex items-center justify-center text-white overflow-hidden">
                      <img
                        alt="Priya Patel"
                        className="w-full h-full object-cover"
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80"
                      />
                    </div>
                  </div>
                  <div className="mt-1 px-2 py-0.5 rounded-full bg-[#060e20]/90 text-[#bec8d2] text-[10px] flex items-center gap-1 border border-white/10 shadow-md">
                    Priya P. • 1.1 km
                  </div>
                </button>

                {/* Worker Pin 3: Amit Verma (1.8km South-West) */}
                <button
                  type="button"
                  onClick={() => setHighlightedWorkerId('worker-amit-verma')}
                  className="absolute top-[68%] left-[28%] -translate-x-1/2 -translate-y-1/2 group transition-all z-20 cursor-pointer"
                >
                  <div className="relative flex items-center justify-center">
                    <div className="w-9 h-9 rounded-full bg-[#222a3d] border border-[#ffb95f]/50 shadow-[0_0_14px_rgba(255,185,95,0.4)] flex items-center justify-center text-white overflow-hidden">
                      <img
                        alt="Amit Verma"
                        className="w-full h-full object-cover"
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80"
                      />
                    </div>
                  </div>
                  <div className="mt-1 px-2 py-0.5 rounded-full bg-[#222a3d]/90 text-[#bec8d2] text-[10px] flex items-center gap-1 border border-white/10 shadow-md">
                    Amit V. • 1.8 km
                  </div>
                </button>

                {/* Worker Pin 4: Vikram Sen (2.5km South-East) */}
                <button
                  type="button"
                  onClick={() => setHighlightedWorkerId('worker-vikram-sen')}
                  className="absolute top-[72%] left-[74%] -translate-x-1/2 -translate-y-1/2 group transition-all z-20 cursor-pointer"
                >
                  <div className="relative flex items-center justify-center">
                    <div className="w-9 h-9 rounded-full bg-[#222a3d] border border-[#ffb95f]/50 shadow-[0_0_14px_rgba(255,185,95,0.4)] flex items-center justify-center text-white overflow-hidden">
                      <img
                        alt="Vikram Sen"
                        className="w-full h-full object-cover"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80"
                      />
                    </div>
                  </div>
                  <div className="mt-1 px-2 py-0.5 rounded-full bg-[#222a3d]/90 text-[#bec8d2] text-[10px] flex items-center gap-1 border border-white/10 shadow-md">
                    Vikram S. • 2.5 km
                  </div>
                </button>
              </>
            )}

            {/* Empty State Overlay */}
            {isSimulatedEmpty && (
              <div className="absolute inset-0 z-30 bg-[#060e20]/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-[#93000a]/20 text-[#ffb4ab] flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-3xl">location_off</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">No Verified Pros within {selectedRadius.toFixed(1)} km</h3>
                <p className="text-xs text-[#bec8d2] max-w-sm mb-4">
                  We couldn't detect active specialists in your immediate grid. Expand your radar threshold or schedule a regional priority broadcast across Bengaluru.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRadius(5.0);
                      setIsSimulatedEmpty(false);
                    }}
                    className="px-4 py-2 rounded-lg bg-[#0ea5e9] text-white text-xs font-semibold hover:bg-[#89ceff] hover:text-[#00344d] transition-all shadow-md cursor-pointer"
                  >
                    Expand to 5.0 km
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRadius(10.0);
                      setIsSimulatedEmpty(false);
                    }}
                    className="px-4 py-2 rounded-lg bg-[#222a3d] text-white text-xs font-semibold hover:bg-[#31394d] transition-all cursor-pointer"
                  >
                    Regional Scan (10 km)
                  </button>
                </div>
              </div>
            )}

            {/* Floating Radar HUD Controls (Top Left) */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#060e20]/80 backdrop-blur-md border border-white/10 shadow-xl">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('electrical')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                    selectedCategory === 'electrical'
                      ? 'bg-[#4edea3]/20 text-[#4edea3] border border-[#4edea3]/30'
                      : 'text-[#bec8d2] hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">electric_bolt</span>Electrical
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('plumbing')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                    selectedCategory === 'plumbing'
                      ? 'bg-[#89ceff]/20 text-[#89ceff] border border-[#89ceff]/30'
                      : 'text-[#bec8d2] hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">plumbing</span>Plumbing
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('hvac')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                    selectedCategory === 'hvac'
                      ? 'bg-[#ffb95f]/20 text-[#ffb95f] border border-[#ffb95f]/30'
                      : 'text-[#bec8d2] hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">mode_fan</span>HVAC
                </button>
              </div>

              {/* Radius Slider Widget */}
              <div className="w-64 p-3 rounded-xl bg-[#060e20]/85 backdrop-blur-md border border-white/10 shadow-xl flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-white text-xs">
                  <span className="text-[10px] font-bold uppercase text-[#bec8d2] tracking-wider font-mono">
                    PostGIS Query Radius
                  </span>
                  <span className="font-bold text-[#4edea3] font-mono">{selectedRadius.toFixed(1)} km</span>
                </div>
                <input
                  className="w-full h-1.5 bg-[#222a3d] rounded-lg appearance-none cursor-pointer accent-[#4edea3]"
                  max={10}
                  min={1}
                  step={0.2}
                  type="range"
                  value={selectedRadius}
                  onChange={(e) => setSelectedRadius(parseFloat(e.target.value))}
                />
                <div className="flex justify-between text-[10px] text-[#88929b] font-mono">
                  <span>1.0 km</span>
                  <span>5.0 km</span>
                  <span>10.0 km</span>
                </div>
              </div>
            </div>

            {/* Coordinates Badge */}
            <div className="absolute bottom-4 left-4 z-20 hidden sm:flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-lg bg-[#060e20]/85 backdrop-blur-md border border-white/10 shadow-xl text-xs text-[#bec8d2] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4edea3]"></span>
                <span>
                  Coordinates: <strong className="text-white font-mono">12.9784° N, 77.6408° E</strong> (Indiranagar)
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT: Verified Technicians Matching Deck (5 cols) */}
        <section className="lg:col-span-5 flex flex-col gap-3">
          <div className="bg-[#171f33]/70 backdrop-blur-xl p-3 rounded-xl shadow-md border border-white/5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4edea3] font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-ping"></span>
                Matched Certified Specialists ({visibleWorkers.length})
              </span>
              <span className="text-[10px] text-[#bec8d2] font-mono">Sorted by ST_Distance</span>
            </div>

            {visibleWorkers.map((w) => (
              <article
                key={w.id}
                onClick={() => setHighlightedWorkerId(w.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-3 ${
                  highlightedWorkerId === w.id
                    ? 'bg-[#1e273d] border-[#4edea3]/50 shadow-lg'
                    : 'bg-[#131b2e]/60 border-white/5 hover:border-white/15'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      alt={w.name}
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-[#4edea3]/40"
                      src={w.avatar}
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-white">{w.name}</h4>
                        <span className="material-symbols-outlined text-xs text-[#4edea3]" title="KYC Verified">
                          verified
                        </span>
                      </div>
                      <p className="text-[11px] text-[#4edea3] font-medium">{w.specialtyTitle}</p>
                      <div className="flex items-center gap-2 text-[10px] text-[#bec8d2] mt-0.5">
                        <span className="text-[#ffb95f] font-bold font-mono">★ {w.rating}</span>
                        <span>•</span>
                        <span>{w.completedJobsCount} jobs completed</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end">
                    <span className="text-base font-bold text-[#ffb95f] font-mono">
                      {formatInr(w.baseHourlyRate)}
                      <span className="text-xs text-[#bec8d2] font-normal">/hr</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono mt-1">
                      {w.distanceKm} km ({w.currentEtaMinutes}m ETA)
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-[#bec8d2] flex items-center justify-between border-t border-white/5 pt-2">
                  <span className="truncate">{w.insuranceCoverage}</span>
                  <span className="font-mono text-slate-400 shrink-0">{w.licenseNumber}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenBidModal(w);
                    }}
                    className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <span className="material-symbols-outlined text-sm">send</span>
                    <span>Direct Dispatch Offer</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setHighlightedWorkerId(w.id);
                    }}
                    className="px-3 py-2 rounded-lg bg-[#060e20] text-[#bec8d2] hover:text-white text-xs font-medium border border-white/5 cursor-pointer"
                  >
                    Locate
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      {/* Dispatch Offer Modal */}
      {activeModalWorker && (
        <div className="fixed inset-0 z-50 bg-[#060e20]/80 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#131b2e] border border-white/10 p-6 md:p-8 shadow-2xl relative">
            <button
              type="button"
              className="absolute top-4 right-4 text-[#bec8d2] hover:text-white cursor-pointer"
              onClick={() => setActiveModalWorker(null)}
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#ffb95f]"></span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#ffb95f] font-mono">
                Guaranteed Dispatch Proposal
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Dispatch Offer to {activeModalWorker.name}</h3>
            <p className="text-xs text-[#bec8d2] mb-4">
              Base Rate {formatInr(activeModalWorker.baseHourlyRate)}/hr • {activeModalWorker.distanceKm} km estimated distance
            </p>

            <div className="p-4 rounded-xl bg-[#060e20]/80 border border-white/5 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#bec8d2]">Proposed Hourly Rate</span>
                <span className="text-2xl font-bold text-[#ffb95f] font-mono">{formatInr(modalBidAmount)}</span>
              </div>
              <input
                className="w-full h-2 bg-[#222a3d] rounded-lg appearance-none cursor-pointer accent-[#ffb95f] mb-3"
                max={2500}
                min={400}
                step={50}
                type="range"
                value={modalBidAmount}
                onChange={(e) => setModalBidAmount(parseInt(e.target.value, 10))}
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setModalBidAmount(activeModalWorker.baseHourlyRate)}
                  className="px-3 py-1 rounded-full bg-[#171f33] text-white text-xs border border-white/5 cursor-pointer"
                >
                  Base Rate
                </button>
                <button
                  type="button"
                  onClick={() => setModalBidAmount(activeModalWorker.baseHourlyRate + 150)}
                  className="px-3 py-1 rounded-full bg-[#171f33] text-[#ffb95f] text-xs border border-[#ffb95f]/20 cursor-pointer"
                >
                  + ₹150 Rush
                </button>
                <button
                  type="button"
                  onClick={() => setModalBidAmount(activeModalWorker.baseHourlyRate + 300)}
                  className="px-3 py-1 rounded-full bg-[#171f33] text-[#ffb95f] text-xs border border-[#ffb95f]/20 cursor-pointer"
                >
                  + ₹300 Urgent SOS
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-white mb-1">
                Brief Scope / Fault Breakdown Description
              </label>
              <textarea
                className="w-full bg-[#060e20] border border-white/10 rounded-lg p-3 text-xs text-white placeholder-[#88929b] focus:outline-none focus:ring-1 focus:ring-[#89ceff]"
                rows={2}
                value={modalScopeNotes}
                onChange={(e) => setModalScopeNotes(e.target.value)}
              />
            </div>

            <div className="flex items-start gap-2 p-3 rounded-lg bg-[#00a572]/10 text-[#4edea3] text-xs mb-6 border border-[#00a572]/20">
              <span className="material-symbols-outlined text-base shrink-0">shield</span>
              <span>
                Funds are held safely in AegisCraft INR Escrow. Technician is only disbursed upon verified dual digital task sign-off.
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleConfirmBidModal}
                className="flex-1 py-3 rounded-lg bg-[#ffb95f] hover:bg-[#ffddb8] text-[#472a00] text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined">send_and_archive</span>
                <span>Submit Escrow Dispatch ({formatInr(modalBidAmount)})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveModalWorker(null)}
                className="px-4 py-3 rounded-lg bg-[#171f33] hover:bg-[#222a3d] text-white text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
