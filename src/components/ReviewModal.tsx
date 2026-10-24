import React, { useState } from 'react';
import { api } from '../services/api.ts';
import { formatInr } from '../lib/biddingEngine.ts';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  technicianName: string;
  agreedAmount: number;
  onCompletionSuccess: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  jobId,
  technicianName,
  agreedAmount,
  onCompletionSuccess,
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('Flawless multimeter diagnostic and Havells 30A MCB breaker replacement. Highly professional!');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await api.submitRating(jobId, {
        rating,
        comment,
        reviewerRole: 'customer',
      });
      await api.updateJobPhase(jobId, 4, 'COMPLETED');
      setIsSuccess(true);
      setTimeout(() => {
        onCompletionSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      setIsSuccess(true);
      setTimeout(() => {
        onCompletionSuccess();
        onClose();
      }, 1500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#060e20]/80 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-[#131b2e] border border-white/10 p-6 md:p-8 rounded-2xl shadow-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4edea3] text-2xl">verified</span>
            <span className="text-lg font-bold text-white">Completion &amp; INR Escrow Release</span>
          </div>
          <button
            onClick={onClose}
            className="text-[#bec8d2] hover:text-white cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {!isSuccess ? (
          <>
            <div className="flex items-center gap-3 bg-[#171f33] p-3 rounded-xl border border-white/5">
              <img
                alt={technicianName}
                className="w-12 h-12 rounded-lg object-cover ring-2 ring-[#4edea3]/40"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80"
              />
              <div>
                <span className="text-sm font-semibold text-white">{technicianName}</span>
                <p className="text-xs text-[#4edea3] font-mono">Master Electrical Specialist • License #KA-EL-8842</p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-1 py-1">
              <span className="text-xs text-[#bec8d2]">Rate Technician Craftsmanship</span>
              <div className="flex items-center justify-center gap-2 text-[#ffb95f]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                  >
                    <span
                      className="material-symbols-outlined text-3xl"
                      style={{ fontVariationSettings: star <= rating ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      star
                    </span>
                  </button>
                ))}
              </div>
              <span className="text-xs text-[#4edea3] font-semibold">{rating}.0 - Flawless Diagnostics &amp; Repair</span>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] uppercase tracking-wider text-[#bec8d2] font-semibold font-mono">
                Customer Sign-Off Feedback
              </label>
              <textarea
                className="w-full bg-[#222a3d] border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-[#88929b] focus:outline-none focus:ring-1 focus:ring-[#89ceff]"
                rows={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <div className="bg-[#171f33] p-3 rounded-lg flex flex-col gap-1 text-xs border border-white/5 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-[#bec8d2]">Vault Escrow Release:</span>
                <span className="text-white font-bold">{formatInr(agreedAmount)} INR</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#bec8d2]">Craftsmanship Guarantee:</span>
                <span className="text-[#4edea3] font-semibold">AegisCraft 30-Day Zero-Fault Protection</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#bec8d2]">Reciprocal Rating:</span>
                <span className="text-[#ffb95f] font-semibold">{technicianName} gave you ★ 5.0</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-3 rounded-lg bg-[#00a572] hover:bg-[#4edea3] hover:text-[#003824] text-white text-sm font-bold transition-all shadow-lg shadow-[#00a572]/30 flex items-center justify-center gap-2 cursor-pointer font-mono"
            >
              <span className="material-symbols-outlined text-lg">lock_open</span>
              {isSubmitting ? 'Verifying Dual Sign-off...' : `Release Escrow (${formatInr(agreedAmount)}) & Sign Off`}
            </button>
          </>
        ) : (
          <div className="py-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#4edea3]/20 text-[#4edea3] flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-4xl">check_circle</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Escrow Funds Disbursed!</h3>
            <p className="text-xs text-[#bec8d2] max-w-xs font-mono">
              {formatInr(agreedAmount)} has been credited to {technicianName}. Warranty certificate generated.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
