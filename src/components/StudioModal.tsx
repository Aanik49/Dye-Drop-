import React, {useState} from 'react';
import {Check, X} from 'lucide-react';
import {PALETTES, VESSELS} from '../game/data';
import type {PaletteId, SavedGameState, VesselId} from '../game/types';
import {DiamondIcon, PaletteTrayIcon, StudioShopIcon, VesselSvgIcon} from './ComicIcons';

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
  onBuyOrEquipVessel,
  onBuyOrEquipPalette,
  onClose,
}) => {
  const [tab, setTab] = useState<'vessels' | 'palettes'>(initialTab);

  return (
    <div className="fixed inset-0 z-50 bg-[#0B3338]/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-[420px] max-h-[88dvh] pastel-modal rounded-[30px] flex flex-col overflow-hidden animate-pop-in">
        {/* Pastel Cartoon Studio Header */}
        <div className="bg-gradient-to-b from-[#9FE8FF] to-[#6DD3FB] border-b-[2.5px] border-[#18495A] px-4 py-3 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <StudioShopIcon className="w-11 h-10 shrink-0 drop-shadow-[0_3px_4px_rgba(14,62,74,0.2)]" />
            <div className="min-w-0">
              <h2 className="font-display font-bold text-xl text-[#144353] leading-tight">
                Studio Collection
              </h2>
              <p className="text-[11px] font-bold text-[#1E5C70]">
                Collect glass vessels &amp; pigment palettes
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="pastel-teal-pill rounded-full px-2.5 py-1 flex items-center gap-1">
              <DiamondIcon className="w-4 h-4" />
              <span className="font-display font-bold text-sm font-mono-num text-white">
                {gameState.diamonds}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Studio"
              className="w-9 h-9 rounded-xl pastel-white-sq-btn flex items-center justify-center text-[#164454] cursor-pointer"
            >
              <X className="w-4.5 h-4.5 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Segmented Tabs */}
        <div className="px-4 pt-3 pb-2 flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setTab('vessels')}
            className={`flex-1 py-2 px-3 rounded-full font-display font-bold text-sm cursor-pointer transition ${
              tab === 'vessels'
                ? 'pastel-blue-pill text-[#144353]'
                : 'pastel-silver-btn text-[#467282] opacity-85'
            }`}
          >
            Vessels ({VESSELS.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('palettes')}
            className={`flex-1 py-2 px-3 rounded-full font-display font-bold text-sm cursor-pointer transition ${
              tab === 'palettes'
                ? 'pastel-blue-pill text-[#144353]'
                : 'pastel-silver-btn text-[#467282] opacity-85'
            }`}
          >
            Pigment Palettes ({PALETTES.length})
          </button>
        </div>

        {/* Scrollable Catalog Content */}
        <div className="flex-1 overflow-y-auto pastel-scroll px-4 pb-4 pt-1">
          {tab === 'vessels' ? (
            <div className="grid grid-cols-2 gap-3">
              {VESSELS.map((vessel) => {
                const owned = gameState.ownedVessels.includes(vessel.id);
                const equipped = gameState.equippedVessel === vessel.id;
                const canAfford = gameState.diamonds >= vessel.price;

                return (
                  <div
                    key={vessel.id}
                    className={`relative rounded-[22px] p-3 flex flex-col items-center text-center transition ${
                      equipped
                        ? 'bg-[#E2FAF0] border-[2.5px] border-[#1EAE62] shadow-[0_4px_0_#9CE3BF]'
                        : 'pastel-subcard'
                    }`}
                  >
                    {equipped && (
                      <span className="absolute -top-2.5 right-2 px-2 py-0.5 rounded-full bg-[#24C466] border-2 border-[#144353] text-[9px] font-extrabold text-white uppercase">
                        Equipped
                      </span>
                    )}

                    <div className="h-16 flex items-center justify-center my-1">
                      <VesselSvgIcon
                        vesselId={vessel.id}
                        liquidColor={equipped ? '#32D980' : '#3AB5FA'}
                        className="w-16 h-16"
                      />
                    </div>

                    <div className="font-display font-bold text-sm text-[#144353] leading-tight mt-1">
                      {vessel.name}
                    </div>
                    <div className="text-[11px] font-semibold text-[#457282] leading-tight mt-0.5 mb-2.5">
                      {vessel.desc}
                    </div>

                    <button
                      type="button"
                      onClick={() => onBuyOrEquipVessel(vessel.id)}
                      className={`mt-auto w-full py-2 px-2 rounded-full font-display font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition ${
                        equipped
                          ? 'bg-[#164454] border-2 border-[#0E313D] text-white'
                          : owned
                          ? 'pastel-lime-btn text-[#12452B]'
                          : canAfford
                          ? 'pastel-coral-btn text-white cartoon-text-shadow'
                          : 'bg-[#DCECEE] border-2 border-[#B1CFD5] text-[#608490]'
                      }`}
                    >
                      {equipped ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Selected</span>
                        </>
                      ) : owned ? (
                        <span>Equip</span>
                      ) : (
                        <>
                          <span>Buy</span>
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
                    className={`relative rounded-[22px] p-3 flex items-center justify-between gap-3 transition ${
                      equipped
                        ? 'bg-[#E2FAF0] border-[2.5px] border-[#1EAE62] shadow-[0_4px_0_#9CE3BF]'
                        : 'pastel-subcard'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <PaletteTrayIcon palette={pal} className="w-20 h-14 shrink-0" />
                      <div className="min-w-0">
                        <div className="font-display font-bold text-sm text-[#144353] truncate">
                          {pal.name}
                        </div>
                        <div className="text-[11px] font-semibold text-[#457282] leading-snug">
                          {pal.desc}
                        </div>
                        <div className="text-[10px] font-extrabold text-[#1E5C70] mt-1">
                          {pal.names.B} · {pal.names.Y} · {pal.names.R}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onBuyOrEquipPalette(pal.id)}
                      className={`shrink-0 py-2.5 px-3 rounded-full font-display font-bold text-xs flex items-center justify-center gap-1 cursor-pointer min-w-[88px] transition ${
                        equipped
                          ? 'bg-[#164454] border-2 border-[#0E313D] text-white'
                          : owned
                          ? 'pastel-lime-btn text-[#12452B]'
                          : canAfford
                          ? 'pastel-coral-btn text-white cartoon-text-shadow'
                          : 'bg-[#DCECEE] border-2 border-[#B1CFD5] text-[#608490]'
                      }`}
                    >
                      {equipped ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Active</span>
                        </>
                      ) : owned ? (
                        <span>Equip</span>
                      ) : (
                        <>
                          <span>Buy</span>
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
