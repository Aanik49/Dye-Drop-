import React, {useState} from 'react';
import {Check, X} from 'lucide-react';
import {BACKGROUND_THEMES, LIQUID_FINISHES, PALETTES, VESSELS} from '../game/data';
import type {
  BackgroundThemeId,
  LiquidFinishId,
  PaletteId,
  SavedGameState,
  StudioTabId,
  VesselId,
} from '../game/types';
import {DiamondIcon, PaletteTrayIcon, StudioShopIcon, VesselSvgIcon} from './ComicIcons';

interface StudioModalProps {
  gameState: SavedGameState;
  initialTab?: StudioTabId;
  accentColor: string;
  onBuyOrEquipVessel: (vesselId: VesselId) => void;
  onBuyOrEquipPalette: (paletteId: PaletteId) => void;
  onBuyOrEquipFinish: (finishId: LiquidFinishId) => void;
  onBuyOrEquipTheme: (themeId: BackgroundThemeId) => void;
  onClose: () => void;
}

const LiquidFinishPreviewIcon: React.FC<{finishId: LiquidFinishId; className?: string}> = ({
  finishId,
  className = 'w-16 h-16',
}) => {
  const uid = `fin-${finishId}`;
  return (
    <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
      <defs>
        <clipPath id={`clip-${uid}`}>
          <path d="M16 18H64C64 46 56 64 40 64C24 64 16 46 16 18Z" />
        </clipPath>
        <linearGradient id={`liq-${uid}`} x1="40" y1="28" x2="40" y2="66" gradientUnits="userSpaceOnUse">
          {finishId === 'pearlescent' ? (
            <>
              <stop offset="0%" stopColor="#F5B8FF" />
              <stop offset="50%" stopColor="#9EE7FF" />
              <stop offset="100%" stopColor="#A9F5D8" />
            </>
          ) : finishId === 'star_confetti' ? (
            <>
              <stop offset="0%" stopColor="#FF7BB8" />
              <stop offset="100%" stopColor="#8E62F5" />
            </>
          ) : finishId === 'boba_pearls' ? (
            <>
              <stop offset="0%" stopColor="#F5CFA0" />
              <stop offset="100%" stopColor="#D69C63" />
            </>
          ) : finishId === 'aurora_bubbles' ? (
            <>
              <stop offset="0%" stopColor="#3EE8C6" />
              <stop offset="55%" stopColor="#589CFF" />
              <stop offset="100%" stopColor="#9A64F8" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#72DDFF" />
              <stop offset="100%" stopColor="#2DA3FA" />
            </>
          )}
        </linearGradient>
      </defs>

      {/* Glass Bowl Back */}
      <path d="M16 18H64C64 46 56 64 40 64C24 64 16 46 16 18Z" fill="#E3FAFF" />

      {/* Liquid + Finish Effect inside bowl clip */}
      <g clipPath={`url(#clip-${uid})`}>
        <path d="M10 32Q26 28 40 32T70 32V68H10V32Z" fill={`url(#liq-${uid})`} />

        {finishId === 'classic' && (
          <g fill="rgba(255,255,255,0.45)" stroke="#FFFFFF" strokeWidth="1.4">
            <circle cx="30" cy="48" r="3.4" />
            <circle cx="48" cy="42" r="4" />
            <circle cx="40" cy="54" r="2.6" />
          </g>
        )}

        {finishId === 'pearlescent' && (
          <>
            <path d="M14 58L44 26H56L26 62Z" fill="rgba(255,255,255,0.52)" />
            <path d="M36 62L60 34H68L44 64Z" fill="rgba(255,230,252,0.48)" />
            <circle cx="28" cy="43" r="2.2" fill="#FFFFFF" />
            <circle cx="51" cy="49" r="2" fill="#FFFFFF" />
            <circle cx="40" cy="39" r="1.8" fill="#FFF7C7" />
          </>
        )}

        {finishId === 'star_confetti' && (
          <g stroke="#174859" strokeWidth="1.1">
            <path d="M30 37L32 41L36 42L33 45L34 49L30 47L26 49L27 45L24 42L28 41Z" fill="#FFF06A" />
            <path d="M49 41L50.8 44.5L54.5 45.2L51.8 47.8L52.4 51.5L49 49.6L45.6 51.5L46.2 47.8L43.5 45.2L47.2 44.5Z" fill="#FFFFFF" />
            <path d="M39 51L40.4 53.8L43.4 54.4L41.2 56.4L41.8 59.4L39 58L36.2 59.4L36.8 56.4L34.6 54.4L37.6 53.8Z" fill="#A6FFEA" />
          </g>
        )}

        {finishId === 'boba_pearls' && (
          <g>
            {[
              {x: 27, y: 56},
              {x: 36, y: 58},
              {x: 45, y: 57},
              {x: 53, y: 54},
              {x: 31, y: 49},
              {x: 41, y: 50},
              {x: 49, y: 48},
            ].map((b, idx) => (
              <g key={idx}>
                <circle cx={b.x} cy={b.y} r="4.8" fill="#3B2016" stroke="#18495A" strokeWidth="1.2" />
                <circle cx={b.x - 1.5} cy={b.y - 1.6} r="1.3" fill="#FFF0DF" />
              </g>
            ))}
          </g>
        )}

        {finishId === 'aurora_bubbles' && (
          <g>
            <path d="M14 44Q32 36 46 44T68 42" stroke="#96FFE0" strokeWidth="5" strokeOpacity="0.45" strokeLinecap="round" />
            <circle cx="30" cy="49" r="5" fill="rgba(134,255,228,0.4)" stroke="#B8FFF0" strokeWidth="1.6" />
            <circle cx="48" cy="42" r="6" fill="rgba(202,164,255,0.4)" stroke="#E3C4FF" strokeWidth="1.6" />
            <circle cx="40" cy="54" r="3.8" fill="rgba(148,216,255,0.45)" stroke="#CCF0FF" strokeWidth="1.4" />
            <circle cx="46" cy="40" r="1.4" fill="#FFFFFF" />
            <circle cx="28.5" cy="47.5" r="1.2" fill="#FFFFFF" />
          </g>
        )}
      </g>

      {/* Bowl Outline & Rim */}
      <path
        d="M16 18H64C64 46 56 64 40 64C24 64 16 46 16 18Z"
        stroke="#174859"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <ellipse cx="40" cy="18" rx="24" ry="4.5" fill="#DBF9FF" stroke="#174859" strokeWidth="2.5" />
      <path d="M23 26C23 41 26 52 31 58" stroke="rgba(255,255,255,0.75)" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
};

const BackgroundThemePreviewThumb: React.FC<{themeId: BackgroundThemeId; className?: string}> = ({
  themeId,
  className = 'w-24 h-16',
}) => {
  const uid = `thm-${themeId}`;
  return (
    <svg viewBox="0 0 120 80" fill="none" className={`${className} rounded-[14px] border-2 border-[#18495A] overflow-hidden shrink-0`} aria-hidden="true">
      {themeId === 'cherry_blossom' ? (
        <>
          <defs>
            <linearGradient id={`bg-${uid}`} x1="60" y1="0" x2="60" y2="80" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFAED0" />
              <stop offset="60%" stopColor="#FFE6F0" />
              <stop offset="100%" stopColor="#F5C7E8" />
            </linearGradient>
          </defs>
          <rect width="120" height="80" fill={`url(#bg-${uid})`} />
          <path d="M0 50L28 24L56 44L88 22L120 46V60H0Z" fill="#F2A4C7" />
          <rect y="50" width="120" height="14" fill="#D5B8FF" />
          <circle cx="16" cy="40" r="14" fill="#FF86B6" />
          <circle cx="104" cy="38" r="15" fill="#FF86B6" />
          <path d="M0 62Q60 52 120 62V80H0Z" fill="#C95A8B" />
          <ellipse cx="46" cy="24" rx="3" ry="1.6" fill="#FFFFFF" transform="rotate(-20 46 24)" />
          <ellipse cx="74" cy="32" rx="2.8" ry="1.5" fill="#FFFFFF" transform="rotate(24 74 32)" />
        </>
      ) : themeId === 'sunset_beach' ? (
        <>
          <defs>
            <linearGradient id={`bg-${uid}`} x1="60" y1="0" x2="60" y2="56" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FF7A70" />
              <stop offset="55%" stopColor="#FFB06E" />
              <stop offset="100%" stopColor="#FFE9A3" />
            </linearGradient>
          </defs>
          <rect width="120" height="80" fill={`url(#bg-${uid})`} />
          <circle cx="60" cy="42" r="18" fill="#FFF7C8" opacity="0.85" />
          <rect y="48" width="120" height="16" fill="#3AB7CF" />
          <rect x="44" y="52" width="32" height="3" rx="1.5" fill="#FFF5BA" />
          <rect x="50" y="57" width="20" height="2.5" rx="1.2" fill="#FFF5BA" />
          <path d="M12 64Q16 44 22 30" stroke="#7A3242" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M108 64Q104 44 98 30" stroke="#7A3242" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="22" cy="28" r="8" fill="#7A3242" />
          <circle cx="98" cy="28" r="8" fill="#7A3242" />
          <path d="M0 62Q60 54 120 62V80H0Z" fill="#DC834B" />
        </>
      ) : themeId === 'starry_forest' ? (
        <>
          <defs>
            <linearGradient id={`bg-${uid}`} x1="60" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#121E4A" />
              <stop offset="60%" stopColor="#1F4275" />
              <stop offset="100%" stopColor="#2A657E" />
            </linearGradient>
          </defs>
          <rect width="120" height="80" fill={`url(#bg-${uid})`} />
          <path d="M0 28Q40 16 74 26T120 20V32Q84 38 42 30T0 36Z" fill="#46F5C4" opacity="0.32" />
          <path d="M98 14A7 7 0 1 0 103 25A5.5 5.5 0 1 1 98 14Z" fill="#FFF5C2" />
          <circle cx="22" cy="16" r="1.4" fill="#FFFBE0" />
          <circle cx="48" cy="12" r="1.6" fill="#FFFBE0" />
          <circle cx="72" cy="18" r="1.3" fill="#FFFBE0" />
          <path d="M0 52L26 28L56 46L86 26L120 48V60H0Z" fill="#183F60" />
          <rect y="50" width="120" height="14" fill="#245C82" />
          <path d="M0 62Q60 54 120 62V80H0Z" fill="#133A4B" />
          <circle cx="32" cy="58" r="2.2" fill="#FFF39E" />
          <circle cx="88" cy="56" r="2.2" fill="#FFF39E" />
        </>
      ) : (
        <>
          <defs>
            <linearGradient id={`bg-${uid}`} x1="60" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#65E5D6" />
              <stop offset="100%" stopColor="#C8FBF1" />
            </linearGradient>
          </defs>
          <rect width="120" height="80" fill={`url(#bg-${uid})`} />
          <path d="M0 50L28 24L58 44L88 22L120 46V60H0Z" fill="#5ED3BF" />
          <rect y="50" width="120" height="14" fill="#7BE4FC" />
          <path d="M12 52L20 34L28 52Z" fill="#228B72" />
          <path d="M92 52L100 32L108 52Z" fill="#228B72" />
          <path d="M0 62Q60 54 120 62V80H0Z" fill="#248B76" />
        </>
      )}
    </svg>
  );
};

export const StudioModal: React.FC<StudioModalProps> = ({
  gameState,
  initialTab = 'vessels',
  onBuyOrEquipVessel,
  onBuyOrEquipPalette,
  onBuyOrEquipFinish,
  onBuyOrEquipTheme,
  onClose,
}) => {
  const [tab, setTab] = useState<StudioTabId>(initialTab);

  const tabs: Array<{id: StudioTabId; label: string; count: number}> = [
    {id: 'vessels', label: 'Vessels', count: VESSELS.length},
    {id: 'palettes', label: 'Palettes', count: PALETTES.length},
    {id: 'finishes', label: 'Finishes', count: LIQUID_FINISHES.length},
    {id: 'themes', label: 'Themes', count: BACKGROUND_THEMES.length},
  ];

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
              <p className="text-[11px] font-bold text-[#1E5C70] truncate">
                Vessels · Palettes · Liquid Finishes · Themes
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

        {/* 4 Single-Line Segmented Tabs */}
        <div className="px-3 pt-3 pb-2 grid grid-cols-4 gap-1.5 shrink-0">
          {tabs.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`py-2 px-1.5 rounded-full font-display font-bold text-[11.5px] sm:text-xs whitespace-nowrap shrink-0 cursor-pointer transition ${
                  active
                    ? 'pastel-blue-pill text-[#144353]'
                    : 'pastel-silver-btn text-[#467282] opacity-85'
                }`}
              >
                {t.label} ({t.count})
              </button>
            );
          })}
        </div>

        {/* Scrollable Catalog Content */}
        <div className="flex-1 overflow-y-auto pastel-scroll px-4 pb-4 pt-1">
          {tab === 'vessels' && (
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
          )}

          {tab === 'palettes' && (
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

          {tab === 'finishes' && (
            <div className="grid grid-cols-2 gap-3">
              {LIQUID_FINISHES.map((finish) => {
                const owned = gameState.ownedFinishes.includes(finish.id);
                const equipped = gameState.equippedFinish === finish.id;
                const canAfford = gameState.diamonds >= finish.price;

                return (
                  <div
                    key={finish.id}
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
                      <LiquidFinishPreviewIcon finishId={finish.id} className="w-16 h-16" />
                    </div>

                    <div className="font-display font-bold text-sm text-[#144353] leading-tight mt-1">
                      {finish.name}
                    </div>
                    <div className="text-[11px] font-semibold text-[#457282] leading-tight mt-0.5 mb-2.5">
                      {finish.desc}
                    </div>

                    <button
                      type="button"
                      onClick={() => onBuyOrEquipFinish(finish.id)}
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
                          <span className="font-mono-num">{finish.price}</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {tab === 'themes' && (
            <div className="space-y-3">
              {BACKGROUND_THEMES.map((bgTheme) => {
                const owned = gameState.ownedThemes.includes(bgTheme.id);
                const equipped = gameState.equippedTheme === bgTheme.id;
                const canAfford = gameState.diamonds >= bgTheme.price;

                return (
                  <div
                    key={bgTheme.id}
                    className={`relative rounded-[22px] p-3 flex items-center justify-between gap-3 transition ${
                      equipped
                        ? 'bg-[#E2FAF0] border-[2.5px] border-[#1EAE62] shadow-[0_4px_0_#9CE3BF]'
                        : 'pastel-subcard'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <BackgroundThemePreviewThumb themeId={bgTheme.id} />
                      <div className="min-w-0">
                        <div className="font-display font-bold text-sm text-[#144353] leading-tight">
                          {bgTheme.name}
                        </div>
                        <div className="text-[11px] font-semibold text-[#457282] leading-snug mt-0.5">
                          {bgTheme.desc}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onBuyOrEquipTheme(bgTheme.id)}
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
                          <span className="font-mono-num">{bgTheme.price}</span>
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
