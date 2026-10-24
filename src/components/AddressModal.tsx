import React, { useState } from 'react';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAddress: string;
  onSaveAddress: (newAddress: string) => void;
}

const PRESET_LOCALITIES = [
  '742 12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru 560038',
  'Building 18, 80 Feet Road, 4th Block, Koramangala, Bengaluru 560034',
  'Tower C, EPIP Zone, Whitefield, Bengaluru 560066',
  '27th Main Road, Sector 1, HSR Layout, Bengaluru 560102',
  '77 Old Airport Road, Kodihalli, Domlur, Bengaluru 560008',
];

export const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  onClose,
  currentAddress,
  onSaveAddress,
}) => {
  const [address, setAddress] = useState(currentAddress);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#060e20]/80 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#131b2e] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#89ceff] text-2xl">location_on</span>
            <h3 className="text-lg font-bold text-white">Update Service Location (Bengaluru)</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#171f33] text-[#bec8d2] hover:text-white flex items-center justify-center cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] uppercase tracking-wider text-[#bec8d2] font-semibold font-mono">
              Street Address &amp; Indian PIN Code
            </label>
            <input
              className="h-11 bg-[#222a3d] border border-white/10 rounded-lg px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#89ceff]/50"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 742 12th Main Road, Indiranagar, Bengaluru 560038"
              type="text"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Quick Preset Localities</span>
            <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto">
              {PRESET_LOCALITIES.map((loc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAddress(loc)}
                  className="text-left text-xs text-slate-300 hover:text-emerald-400 p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors truncate cursor-pointer"
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#4edea3]/10 p-2.5 rounded-lg text-[#4edea3] text-xs font-mono">
            <span className="material-symbols-outlined text-base">gps_fixed</span>
            RTK Satellite: 12.9784° N • 77.6408° E (±1.4m accuracy)
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-11 rounded-lg bg-[#171f33] text-[#bec8d2] hover:text-white text-sm font-medium cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onSaveAddress(address);
              onClose();
            }}
            className="flex-1 h-11 rounded-lg bg-[#0ea5e9] hover:bg-[#89ceff] hover:text-[#00344d] text-white text-sm font-bold shadow-lg shadow-[#0ea5e9]/20 cursor-pointer"
          >
            Lock Pin &amp; Recalculate
          </button>
        </div>
      </div>
    </div>
  );
};
