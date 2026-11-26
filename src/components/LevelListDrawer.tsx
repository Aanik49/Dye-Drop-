import React from 'react';
import {X} from 'lucide-react';
import {getRecipeRgb, rgbToHex} from '../game/colorEngine';
import {LEVELS_BY_TYPE, LEVEL_TYPES, getPaletteById} from '../game/data';
import type {LevelDef, LevelTypeId, PaletteDef, SavedGameState} from '../game/types';
import {ComicStarIcon, LevelTypeIcon} from './ComicIcons';

interface LevelListDrawerProps {
  gameState: SavedGameState;
  typeId: LevelTypeId;
  currentLevelNumber: number;
  onSelectLevel: (levelNumber: number) => void;
  onGoToLobby: () => void;
  onClose: () => void;
}

function getLevelTileVisual(
  lvl: LevelDef,
  palette: PaletteDef
): {style: React.CSSProperties; darkText: boolean} {
  if (lvl.isLayered && lvl.topRecipe && lvl.bottomRecipe) {
    const topRgb = getRecipeRgb(lvl.topRecipe, palette);
    const botRgb = getRecipeRgb(lvl.bottomRecipe, palette);
    const topHex = rgbToHex(topRgb);
    const botHex = rgbToHex(botRgb);
    const avgLum =
      (0.299 * (topRgb[0] + botRgb[0]) * 0.5 +
        0.587 * (topRgb[1] + botRgb[1]) * 0.5 +
        0.114 * (topRgb[2] + botRgb[2]) * 0.5) /
      255;
    return {
      style: {
        backgroundImage: `linear-gradient(180deg, ${topHex} 0%, ${topHex} 50%, ${botHex} 50%, ${botHex} 100%)`,
      },
      darkText: avgLum > 0.72,
    };
  }

  const rgb = getRecipeRgb(lvl.recipe, palette);
  const hex = rgbToHex(rgb);
  const lum = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
  return {
    style: {backgroundColor: hex},
    darkText: lum > 0.72,
  };
}

export const LevelListDrawer: React.FC<LevelListDrawerProps> = ({
  gameState,
  typeId,
  currentLevelNumber,
  onSelectLevel,
  onGoToLobby,
  onClose,
}) => {
  const theme = LEVEL_TYPES[typeId];
  const levels = LEVELS_BY_TYPE[typeId];
  const activePalette = getPaletteById(gameState.equippedPalette);

  return (
    <div className="fixed inset-0 z-50 bg-[#0B3338]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-[382px] pastel-modal rounded-[30px] overflow-hidden animate-pop-in">
        {/* Pastel Cartoon Header */}
        <div className="bg-gradient-to-b from-[#9FE8FF] to-[#6DD3FB] border-b-[2.5px] border-[#18495A] px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white border-2 border-[#18495A] flex items-center justify-center shrink-0">
              <LevelTypeIcon typeId={typeId} className="w-7 h-7" />
            </div>
            <div className="min-w-0">
              <h2 className="font-display font-bold text-xl text-[#144353] leading-tight truncate">
                {theme.name} Levels
              </h2>
              <p className="text-[11px] font-bold text-[#1E5C70]">
                Pick any level to mix &amp; match
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Level List"
            className="w-9 h-9 rounded-xl pastel-white-sq-btn flex items-center justify-center text-[#164454] cursor-pointer shrink-0"
          >
            <X className="w-4.5 h-4.5 stroke-[3]" />
          </button>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-5 gap-2">
            {levels.map((lvl) => {
              const prog = gameState.levelProgress[lvl.id];
              const stars = prog?.bestStars || 0;
              const isCurrent = lvl.number === currentLevelNumber;
              const tileVisual = getLevelTileVisual(lvl, activePalette);

              return (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => onSelectLevel(lvl.number)}
                  className={`relative rounded-[16px] py-2 px-1 flex flex-col items-center justify-center pastel-level-tile cursor-pointer ${
                    isCurrent ? 'ring-[3px] ring-[#FFE15A] scale-105 z-10' : ''
                  }`}
                  style={tileVisual.style}
                >
                  <span
                    className={`font-display font-bold text-lg leading-none ${
                      tileVisual.darkText ? 'text-[#144353]' : 'text-white cartoon-text-shadow'
                    }`}
                  >
                    {lvl.number}
                  </span>
                  <div className="flex items-center gap-0.2 mt-1">
                    {[0, 1, 2].map((s) => (
                      <ComicStarIcon key={s} filled={s < stars} className="w-2.5 h-2.5" />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onGoToLobby}
            className="mt-4 w-full py-2.5 px-4 rounded-full pastel-silver-btn font-display font-bold text-sm text-[#18495A] cursor-pointer"
          >
            See All Level Types in Lobby ➔
          </button>
        </div>
      </div>
    </div>
  );
};
