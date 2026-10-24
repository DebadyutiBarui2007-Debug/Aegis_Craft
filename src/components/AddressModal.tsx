import React, { useState } from 'react';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAddress: string;
  onSaveAddress: (newAddress: string) => void;
}

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
            <h3 className="text-lg font-bold text-white">Update Service Location</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#171f33] text-[#bec8d2] hover:text-white flex items-center justify-center"
            type="button"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] uppercase tracking-wider text-[#bec8d2] font-semibold">
              Street Address / Client Site
            </label>
            <input
              className="h-11 bg-[#222a3d] border border-white/10 rounded-lg px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#89ceff]/50"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              type="text"
            />
          </div>

          <div className="flex items-center gap-2 bg-[#4edea3]/10 p-2.5 rounded-lg text-[#4edea3] text-xs">
            <span className="material-symbols-outlined text-base">gps_fixed</span>
            RTK Satellite Coords: 44.0462° N • 123.0220° W (±1.4m accuracy)
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-11 rounded-lg bg-[#171f33] text-[#bec8d2] hover:text-white text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onSaveAddress(address);
              onClose();
            }}
            className="flex-1 h-11 rounded-lg bg-[#0ea5e9] hover:bg-[#89ceff] hover:text-[#00344d] text-white text-sm font-semibold shadow-md shadow-[#0ea5e9]/20 transition-all"
          >
            Save &amp; Recalculate
          </button>
        </div>
      </div>
    </div>
  );
};
