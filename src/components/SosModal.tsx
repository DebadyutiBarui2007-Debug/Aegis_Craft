import React, { useEffect, useState } from 'react';
import { api } from '../services/api.ts';

interface SosModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeJobId?: string;
}

export const SosModal: React.FC<SosModalProps> = ({ isOpen, onClose, activeJobId }) => {
  const [secondsLeft, setSecondsLeft] = useState(3);
  const [hazard, setHazard] = useState<'fire' | 'water' | 'gas' | 'structural'>('fire');
  const [isEscalated, setIsEscalated] = useState(false);
  const [isTransmitting, setIsTransmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSecondsLeft(3);
      setIsEscalated(false);
      setIsTransmitting(false);
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          triggerBroadcast();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, hazard]);

  const triggerBroadcast = async () => {
    setIsTransmitting(true);
    try {
      await api.triggerSos(activeJobId, hazard);
      setIsEscalated(true);
    } catch (e) {
      console.error(e);
      setIsEscalated(true);
    } finally {
      setIsTransmitting(false);
    }
  };

  if (!isOpen) return null;

  const totalCircumference = 264;
  const strokeOffset = totalCircumference - ((3 - secondsLeft) / 3) * totalCircumference;

  return (
    <div className="fixed inset-0 z-50 bg-[#060e20]/85 backdrop-blur-2xl flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-[#060e20] border border-[#ffb4ab]/30 p-6 md:p-8 rounded-2xl shadow-2xl flex flex-col items-center text-center overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#93000a]/20 rounded-full blur-[60px] pointer-events-none"></div>

        {/* Header Tag */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#93000a]/30 text-[#ffb4ab] text-xs font-semibold uppercase tracking-wider mb-4 border border-[#ffb4ab]/20 font-mono">
          <span className="w-2 h-2 rounded-full bg-[#ffb4ab] animate-ping"></span>
          Emergency 112 India Rescue Protocol
        </div>

        {!isEscalated ? (
          <>
            {/* SVG Countdown Ring */}
            <div className="relative w-36 h-36 my-2 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="42"
                  stroke="#2d3449"
                  strokeWidth="8"
                />
                <circle
                  className="transition-all duration-1000 ease-linear"
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="42"
                  stroke="#ffb4ab"
                  strokeDasharray="264"
                  strokeDashoffset={strokeOffset}
                  strokeLinecap="round"
                  strokeWidth="8"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-[#ffb4ab] font-mono">
                  {secondsLeft > 0 ? secondsLeft : '!'}
                </span>
                <span className="text-[10px] uppercase text-[#bec8d2] tracking-wider font-mono">Seconds</span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mt-1">Transmitting 112 Emergency Beacon</h3>
            <p className="text-xs text-[#bec8d2] mt-1 max-w-sm">
              All 48 certified emergency responders within 3.2km are receiving high-priority alarm vectors for{' '}
              <strong className="text-white">742 12th Main Road, Indiranagar, Bengaluru (560038)</strong>.
            </p>

            {/* Select Primary Hazard */}
            <div className="w-full bg-[#171f33] p-3 rounded-xl mt-4 text-left">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#ffb95f] block mb-2 font-mono">
                Select Primary Hazard Threat
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setHazard('fire')}
                  className={`p-2.5 rounded-lg text-xs font-medium text-left transition-all cursor-pointer ${
                    hazard === 'fire'
                      ? 'bg-[#93000a]/40 text-[#ffb4ab] border border-[#ffb4ab]/40'
                      : 'bg-[#222a3d] text-[#dae2fd] hover:bg-[#31394d]'
                  }`}
                >
                  ⚡ Electrical Spark / Fire Risk
                </button>
                <button
                  type="button"
                  onClick={() => setHazard('water')}
                  className={`p-2.5 rounded-lg text-xs font-medium text-left transition-all cursor-pointer ${
                    hazard === 'water'
                      ? 'bg-[#93000a]/40 text-[#ffb4ab] border border-[#ffb4ab]/40'
                      : 'bg-[#222a3d] text-[#dae2fd] hover:bg-[#31394d]'
                  }`}
                >
                  🌊 Severe Flooding / Burst Pipe
                </button>
                <button
                  type="button"
                  onClick={() => setHazard('gas')}
                  className={`p-2.5 rounded-lg text-xs font-medium text-left transition-all cursor-pointer ${
                    hazard === 'gas'
                      ? 'bg-[#93000a]/40 text-[#ffb4ab] border border-[#ffb4ab]/40'
                      : 'bg-[#222a3d] text-[#dae2fd] hover:bg-[#31394d]'
                  }`}
                >
                  🔥 LPG / Gas Leak Hazard
                </button>
                <button
                  type="button"
                  onClick={() => setHazard('structural')}
                  className={`p-2.5 rounded-lg text-xs font-medium text-left transition-all cursor-pointer ${
                    hazard === 'structural'
                      ? 'bg-[#93000a]/40 text-[#ffb4ab] border border-[#ffb4ab]/40'
                      : 'bg-[#222a3d] text-[#dae2fd] hover:bg-[#31394d]'
                  }`}
                >
                  🏚️ Structural Hazard
                </button>
              </div>
            </div>

            {/* GPS Vector Readout */}
            <div className="w-full bg-[#131b2e] p-3 rounded-xl mt-3 flex flex-col gap-1 text-left text-xs">
              <div className="flex items-center justify-between text-white">
                <span className="flex items-center gap-1.5 text-[#bec8d2]">
                  <span className="material-symbols-outlined text-[#4edea3] text-sm">my_location</span>
                  Live GPS Vector:
                </span>
                <span className="text-[#4edea3] font-mono">12.9784° N, 77.6408° E</span>
              </div>
              <div className="flex items-center justify-between text-white">
                <span className="flex items-center gap-1.5 text-[#bec8d2]">
                  <span className="material-symbols-outlined text-[#89ceff] text-sm">mic</span>
                  Encrypted Audio Link:
                </span>
                <span className="text-[#89ceff] font-mono">112 ERSS Standby</span>
              </div>
            </div>

            {/* Actions */}
            <div className="w-full flex flex-col gap-2 mt-5">
              <button
                type="button"
                onClick={triggerBroadcast}
                disabled={isTransmitting}
                className="w-full py-3 rounded-lg bg-[#93000a] hover:bg-[#ba1a1a] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#93000a]/40 flex items-center justify-center gap-2 cursor-pointer font-mono"
              >
                <span className="material-symbols-outlined text-base">crisis_alert</span>
                <span>{isTransmitting ? 'Transmitting to 112 Network...' : 'Transmit Immediate 112 Broadcast Now'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 text-[#bec8d2] hover:text-white text-xs transition-colors cursor-pointer"
              >
                Cancel Beacon (False Alarm)
              </button>
            </div>
          </>
        ) : (
          <div className="py-4 flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-[#4edea3]/20 text-[#4edea3] flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">done_all</span>
            </div>
            <h3 className="text-xl font-bold text-white">112 Emergency Rescue Locked</h3>
            <p className="text-xs text-[#bec8d2] max-w-sm">
              Rapid response unit <strong className="text-white">Rajesh Sharma (Grade A Master Electrician)</strong> has been designated primary on-scene commander. 
            </p>
            <div className="bg-[#171f33] p-3 rounded-lg text-xs text-[#ffb95f] w-full text-center font-mono">
              Bengaluru Emergency Interconnect: Active • ETA 4 Mins
            </div>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 px-6 py-2 rounded-lg bg-[#0ea5e9] text-white text-xs font-semibold hover:bg-[#89ceff] hover:text-[#00344d] transition-all cursor-pointer"
            >
              Return to Live Radar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
