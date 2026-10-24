import React, { useState } from 'react';
import { JobRequest, BidOffer, ChatMessage } from '../types/index.ts';
import { formatInr } from '../lib/biddingEngine.ts';

interface WorkerTerminalViewProps {
  job: JobRequest;
  bids: BidOffer[];
  messages: ChatMessage[];
  onSubmitCounter: (proposedAmount: number, scopeNotes?: string) => void;
  onAdvancePhase: (phase: number) => void;
  onSendMessage: (content: string) => void;
  onOpenSos: () => void;
  onOpenReviewModal: () => void;
}

export const WorkerTerminalView: React.FC<WorkerTerminalViewProps> = ({
  job,
  bids,
  messages,
  onSubmitCounter,
  onAdvancePhase,
  onSendMessage,
  onOpenSos,
  onOpenReviewModal,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState(
    "I've reviewed the panel photos and can fix the burnt contact within 45 minutes. Replacement 30A Havells MCB breaker is already in my service vehicle."
  );
  const [counterRate, setCounterRate] = useState(850);
  const [chatInput, setChatInput] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleStartVoice = () => {
    setIsRecording(true);
    setStatusMessage('Listening to technician speech input...');
    setTimeout(() => {
      setIsRecording(false);
      setStatusMessage('Voice-to-Text Transcribed & Verified.');
    }, 2000);
  };

  const handleSendCounter = () => {
    onSubmitCounter(counterRate, transcribedText);
    setStatusMessage(`Counteroffer (${formatInr(counterRate)}) transmitted to customer queue.`);
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    onSendMessage(chatInput.trim());
    setChatInput('');
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-4 flex flex-col gap-6">
      {/* Top Banner */}
      <div className="bg-[#171f33]/90 backdrop-blur-2xl p-6 rounded-xl border border-[#4edea3]/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              alt="Rajesh Sharma"
              className="w-16 h-16 rounded-xl object-cover ring-2 ring-[#4edea3]"
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#4edea3] ring-2 ring-[#060e20]"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">Rajesh Sharma (Grade A Master Electrician)</h2>
              <span className="px-2 py-0.5 rounded-full bg-[#4edea3]/20 text-[#4edea3] text-[10px] font-bold uppercase tracking-wider border border-[#4edea3]/30 font-mono">
                PRO TERMINAL ACTIVE
              </span>
            </div>
            <p className="text-xs text-[#bec8d2] mt-0.5 font-mono">
              Karnataka Lic. #KA-EL-8842 • Commercial Bonded ₹10L • Commercial Service Vehicle
            </p>
            <div className="flex items-center gap-3 text-xs text-[#ffb95f] mt-1 font-semibold">
              <span className="font-mono">★ 4.98 Rating (214 Jobs)</span>
              <span className="text-[#3e4850]">•</span>
              <span className="text-[#4edea3] font-mono">GPS RTK Telemetry: Online (Bengaluru Sector 4)</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#131b2e] px-4 py-2 rounded-lg border border-white/5 text-right">
            <span className="text-[10px] uppercase font-bold text-[#bec8d2] block font-mono">Escrow Vault</span>
            <span className="text-xl font-bold text-[#ffb95f] font-mono">{formatInr(job.agreedAmount)} INR</span>
          </div>
          <button
            type="button"
            onClick={onOpenSos}
            className="px-3.5 py-2.5 rounded-lg bg-[#93000a]/50 text-[#ffb4ab] text-xs font-bold uppercase tracking-wider border border-[#ffb4ab]/40 hover:bg-[#93000a] transition-all cursor-pointer font-mono"
          >
            112 SOS Beacon
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="bg-[#4edea3]/10 border border-[#4edea3]/30 text-[#4edea3] px-4 py-2 rounded-lg text-xs flex items-center justify-between">
          <span>{statusMessage}</span>
          <button onClick={() => setStatusMessage('')} className="text-[#4edea3] hover:text-white cursor-pointer">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* Main Grid: Left Bidding & Speech input (7 cols), Right Status & Comms (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Job Request & Speech to Bid (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-[#131b2e]/90 p-6 rounded-xl border border-white/5 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#89ceff] font-mono">
                Active Inbound Dispatch Request
              </span>
              <span className="text-xs text-[#bec8d2] font-mono">420m distance • 742 12th Main Road</span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">{job.title}</h3>
              <p className="text-xs text-[#bec8d2] mt-1">{job.situationSummary}</p>
            </div>

            {/* Voice-First Experience Module */}
            <div className="bg-[#060e20] p-4 rounded-xl border border-white/5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#ffb95f] text-base">mic</span>
                  Voice-to-Text Instant Proposal Generator
                </span>
                <span className="text-[10px] text-[#bec8d2] uppercase font-mono">Hands-Free Driver Mode</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleStartVoice}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    isRecording
                      ? 'bg-[#93000a] text-white animate-pulse'
                      : 'bg-[#ffb95f]/20 text-[#ffb95f] hover:bg-[#ffb95f]/30'
                  }`}
                  title="Speak proposal into mic"
                >
                  <span className="material-symbols-outlined text-2xl font-bold">
                    {isRecording ? 'graphic_eq' : 'mic'}
                  </span>
                </button>
                <div className="flex-1">
                  <textarea
                    className="w-full bg-[#131b2e] border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-[#88929b] focus:outline-none focus:ring-1 focus:ring-[#ffb95f]"
                    rows={2}
                    value={transcribedText}
                    onChange={(e) => setTranscribedText(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Counteroffer Slider */}
            <div className="bg-[#171f33] p-4 rounded-xl border border-white/5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Adjust Pro Counteroffer Rate</span>
                <span className="text-2xl font-bold text-[#ffb95f] font-mono">{formatInr(counterRate)}</span>
              </div>
              <input
                className="w-full h-2 bg-[#222a3d] rounded-lg appearance-none cursor-pointer accent-[#ffb95f]"
                max={2500}
                min={450}
                step={25}
                type="range"
                value={counterRate}
                onChange={(e) => setCounterRate(parseInt(e.target.value, 10))}
              />
              <div className="flex items-center gap-2 font-mono">
                <button
                  type="button"
                  onClick={() => setCounterRate(750)}
                  className="px-3 py-1 rounded bg-[#222a3d] text-xs text-[#bec8d2] hover:text-white cursor-pointer"
                >
                  ₹750 (Labor Base)
                </button>
                <button
                  type="button"
                  onClick={() => setCounterRate(850)}
                  className="px-3 py-1 rounded bg-[#ffb95f]/20 text-xs text-[#ffb95f] border border-[#ffb95f]/30 font-semibold cursor-pointer"
                >
                  ₹850 (Havells Breaker Included)
                </button>
                <button
                  type="button"
                  onClick={() => setCounterRate(1100)}
                  className="px-3 py-1 rounded bg-[#222a3d] text-xs text-[#bec8d2] hover:text-white cursor-pointer"
                >
                  ₹1,100 (Immediate Rush)
                </button>
              </div>

              <button
                type="button"
                onClick={handleSendCounter}
                className="w-full py-3 rounded-lg bg-[#ffb95f] hover:bg-[#ffddb8] text-[#472a00] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all mt-1 cursor-pointer font-mono"
              >
                <span className="material-symbols-outlined text-base">send</span>
                <span>Transmit Counteroffer to {job.customerName} ({formatInr(counterRate)})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Job Progress & Live Dispatch Comms (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-[#131b2e]/90 p-6 rounded-xl border border-white/5 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Technician Workflow Stages</h3>
              <span className="text-xs text-[#4edea3] font-bold font-mono">Phase {job.currentPhase} of 4</span>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => onAdvancePhase(2)}
                className={`p-3 rounded-lg flex items-center justify-between text-left transition-all border cursor-pointer ${
                  job.currentPhase === 2
                    ? 'bg-[#222a3d] border-[#4edea3] text-white shadow-md'
                    : 'bg-[#171f33] border-white/5 text-[#bec8d2] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#4edea3] text-lg">navigation</span>
                  <span className="text-xs font-semibold">1. Start Route (En Route, Broadcast GPS)</span>
                </div>
                {job.currentPhase >= 2 && <span className="text-[#4edea3] text-xs font-bold font-mono">Active</span>}
              </button>

              <button
                type="button"
                onClick={() => onAdvancePhase(3)}
                className={`p-3 rounded-lg flex items-center justify-between text-left transition-all border cursor-pointer ${
                  job.currentPhase === 3
                    ? 'bg-[#222a3d] border-[#ffb95f] text-white shadow-md'
                    : 'bg-[#171f33] border-white/5 text-[#bec8d2] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ffb95f] text-lg">build</span>
                  <span className="text-xs font-semibold">2. Arrived On-Site (Diagnostics &amp; Repair)</span>
                </div>
                {job.currentPhase >= 3 && <span className="text-[#ffb95f] text-xs font-bold font-mono">Active</span>}
              </button>

              <button
                type="button"
                onClick={onOpenReviewModal}
                className="p-3 rounded-lg flex items-center justify-between text-left transition-all border bg-[#00a572]/20 hover:bg-[#00a572]/30 text-[#4edea3] border-[#00a572]/40 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">task_alt</span>
                  <span className="text-xs font-bold">3. Complete Job &amp; Request Escrow Sign-off</span>
                </div>
                <span className="text-xs font-bold font-mono">Dual Sign-off</span>
              </button>
            </div>
          </div>

          {/* Quick Chat with Client */}
          <div className="bg-[#131b2e]/90 p-4 rounded-xl border border-white/5 shadow-xl flex flex-col h-[280px]">
            <span className="text-xs font-bold text-white mb-2">Comms with {job.customerName}</span>
            <div className="flex-1 overflow-y-auto flex flex-col gap-2 py-1 pr-1">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`p-2 rounded-lg text-xs max-w-[85%] ${
                    m.senderRole === 'worker_pro'
                      ? 'self-end bg-[#222a3d] text-white border border-[#4edea3]/20'
                      : 'self-start bg-[#171f33] text-white border border-white/5'
                  }`}
                >
                  <span className="text-[10px] text-[#bec8d2] block mb-0.5 font-mono">
                    {m.senderName} • {m.timestamp}
                  </span>
                  <p>{m.content}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-white/5">
              <input
                className="flex-1 bg-[#222a3d] border border-white/10 px-3 py-1.5 rounded-lg text-xs text-white placeholder-[#88929b] outline-none"
                placeholder={`Message ${job.customerName}...`}
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              />
              <button
                type="button"
                onClick={handleSendChat}
                className="p-2 rounded-lg bg-[#0ea5e9] text-white hover:bg-[#89ceff] hover:text-[#00344d] cursor-pointer"
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
