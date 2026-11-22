import React, {useState} from 'react';
import {PALETTES, VESSELS} from '../game/data';
import type {PaletteId, SavedGameState, VesselId} from '../game/types';
import {DiamondIcon, PaletteTrayIcon, VesselSvgIcon} from './ComicIcons';

interface StudioModalProps {
  gameState: SavedGameState;
  initialTab?: 'vessels' | 'palettes';
  accentColor: string;
  onBuyOrEquipVessel: (vesselId: VesselId) => void;
  onBuyOrEquipPalette: (paletteId: PaletteId) => void;
  onClose: () => void;
}

export const StudioModal: React.FC<StudioModalProps> = ({
  gameState,
  initialTab = 'vessels',
  accentColor,
  onBuyOrEquipVessel,
  onBuyOrEquipPalette,
  onClose,
}) => {
  const [tab, setTab] = useState<'vessels' | 'palettes'>(initialTab);

  return (
    <div className="fixed inset-0 z-50 bg-[#141414]/65 flex items-end sm:items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-[420px] max-h-[88dvh] bg-[#FFF8DB] rounded-3xl comic-box-lg flex flex-col overflow-hidden animate-pop-in">
        {/* Top Studio Folder Header */}
        <div
          className="border-b-[3.5px] border-[#141414] px-4 py-3.5 flex items-center justify-between shrink-0"
          style={{backgroundColor: accentColor}}
        >
          <div>
            <h2 className="font-display font-bold text-xl text-[#141414] leading-tight">
              STUDIO COLLECTION
            </h2>
            <p className="text-[11px] font-extrabold text-[#141414]/80">
              Collect vessels &amp; pigment inks with diamonds
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-[#FFFDF5] comic-box-sm rounded-xl px-2.5 py-1 flex items-center gap-1">
              <DiamondIcon className="w-5 h-4" />
              <span className="font-display font-bold text-sm font-mono-num text-[#141414]">
                {gameState.diamonds}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Studio"
              className="w-9 h-9 rounded-xl bg-[#FFFDF5] comic-btn flex items-center justify-center font-black text-base text-[#141414] cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Segmented Comic Tabs: Vessels (6) / Pigments (4) */}
        <div className="px-4 pt-3 pb-2 flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setTab('vessels')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-display font-bold text-sm cursor-pointer transition ${
              tab === 'vessels'
                ? 'bg-[#FFE047] comic-btn text-[#141414]'
                : 'bg-[#FFFDF5] border-[2.5px] border-[#141414] text-[#141414]/75'
            }`}
          >
            Vessels ({VESSELS.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('palettes')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-display font-bold text-sm cursor-pointer transition ${
              tab === 'palettes'
                ? 'bg-[#FFE047] comic-btn text-[#141414]'
                : 'bg-[#FFFDF5] border-[2.5px] border-[#141414] text-[#141414]/75'
            }`}
          >
            Pigment Palettes ({PALETTES.length})
          </button>
        </div>

        {/* Scrollable Catalog Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 pt-1">
          {tab === 'vessels' ? (
            <div className="grid grid-cols-2 gap-3">
              {VESSELS.map((vessel) => {
                const owned = gameState.ownedVessels.includes(vessel.id);
                const equipped = gameState.equippedVessel === vessel.id;
                const canAfford = gameState.diamonds >= vessel.price;

                return (
                  <div
                    key={vessel.id}
                    className={`relative rounded-2xl p-3 flex flex-col items-center text-center transition ${
                      equipped
                        ? 'bg-[#FFF066] comic-box'
                        : owned
                        ? 'bg-[#FFFDF5] comic-box-sm'
                        : 'bg-[#FFFDF5]/95 comic-box-sm'
                    }`}
                  >
                    {equipped && (
                      <span className="absolute -top-2.5 -right-1.5 rotate-3 px-2 py-0.5 rounded-lg bg-[#B8FF00] border-2 border-[#141414] text-[10px] font-black text-[#141414] uppercase">
                        Equipped
                      </span>
                    )}

                    <div className="h-16 flex items-center justify-center my-1">
                      <VesselSvgIcon
                        vesselId={vessel.id}
                        liquidColor={equipped ? '#FF6B63' : '#4CE4F2'}
                        className="w-16 h-16"
                      />
                    </div>

                    <div className="font-display font-bold text-sm text-[#141414] leading-tight mt-1">
                      {vessel.name}
                    </div>
                    <div className="text-[11px] font-semibold text-[#141414]/70 leading-tight mt-0.5 mb-2.5">
                      {vessel.desc}
                    </div>

                    <button
                      type="button"
                      onClick={() => onBuyOrEquipVessel(vessel.id)}
                      className={`mt-auto w-full py-2 px-2 rounded-xl comic-btn font-display font-bold text-xs flex items-center justify-center gap-1 cursor-pointer ${
                        equipped
                          ? 'bg-[#141414] text-white'
                          : owned
                          ? 'bg-[#B8FF00] text-[#141414]'
                          : canAfford
                          ? 'bg-[#7AE6F5] text-[#141414]'
                          : 'bg-[#E5E0D0] text-[#141414]/65'
                      }`}
                    >
                      {equipped ? (
                        <span>SELECTED ✓</span>
                      ) : owned ? (
                        <span>EQUIP</span>
                      ) : (
                        <>
                          <span>BUY</span>
                          <DiamondIcon className="w-4 h-3.5" />
                          <span className="font-mono-num">{vessel.price}</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              {PALETTES.map((pal) => {
                const owned = gameState.ownedPalettes.includes(pal.id);
                const equipped = gameState.equippedPalette === pal.id;
                const canAfford = gameState.diamonds >= pal.price;

                return (
                  <div
                    key={pal.id}
                    className={`relative rounded-2xl p-3 flex items-center justify-between gap-3 ${
                      equipped ? 'bg-[#FFF066] comic-box' : 'bg-[#FFFDF5] comic-box-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <PaletteTrayIcon palette={pal} className="w-20 h-14 shrink-0" />
                      <div className="min-w-0">
                        <div className="font-display font-bold text-sm text-[#141414] truncate">
                          {pal.name}
                        </div>
                        <div className="text-[11px] font-semibold text-[#141414]/70 leading-snug">
                          {pal.desc}
                        </div>
                        <div className="text-[10px] font-extrabold text-[#141414]/80 mt-1">
                          {pal.names.R} · {pal.names.Y} · {pal.names.B}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onBuyOrEquipPalette(pal.id)}
                      className={`shrink-0 py-2.5 px-3 rounded-xl comic-btn font-display font-bold text-xs flex items-center justify-center gap-1 cursor-pointer min-w-[86px] ${
                        equipped
                          ? 'bg-[#141414] text-white'
                          : owned
                          ? 'bg-[#B8FF00] text-[#141414]'
                          : canAfford
                          ? 'bg-[#7AE6F5] text-[#141414]'
                          : 'bg-[#E5E0D0] text-[#141414]/65'
                      }`}
                    >
                      {equipped ? (
                        <span>ACTIVE ✓</span>
                      ) : owned ? (
                        <span>EQUIP</span>
                      ) : (
                        <>
                          <span>BUY</span>
                          <DiamondIcon className="w-4 h-3.5" />
                          <span className="font-mono-num">{pal.price}</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
