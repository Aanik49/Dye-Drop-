import React, {useMemo, useState} from 'react';
import {Camera, Check, Copy, Lock, Sparkles, X} from 'lucide-react';
import {audio} from '../game/audio';
import {formatLayeredRecipeText, formatRecipeText, getRecipeRgb, rgbToHex} from '../game/colorEngine';
import {
  LEVELS_BY_TYPE,
  LEVEL_TYPES,
  LEVEL_TYPE_ORDER,
  PACK_BOOK_BONUS_DIAMONDS,
  getPaletteById,
} from '../game/data';
import {countRecipeBookPackEntries} from '../game/storage';
import type {LevelDef, LevelTypeId, RecipeBookEntry, SavedGameState} from '../game/types';
import {generateSnapshotCardDataUrl} from '../game/vesselRenderer';
import {ComicStarIcon, DiamondIcon, RecipeBookOpenIcon, VesselSvgIcon} from './ComicIcons';

interface RecipeBookModalProps {
  gameState: SavedGameState;
  initialType: LevelTypeId;
  onClaimPackBonus: (typeId: LevelTypeId) => void;
  onSnapshotDownloaded: (hexLabel: string) => void;
  onToast: (message: string) => void;
  onClose: () => void;
}

function buildFallbackEntry(lvl: LevelDef, gameState: SavedGameState): RecipeBookEntry | null {
  const saved = gameState.recipeBook[lvl.id];
  if (saved) return saved;
  const prog = gameState.levelProgress[lvl.id];
  if (!prog?.completed) return null;

  const palette = getPaletteById(gameState.equippedPalette);
  if (lvl.isLayered && lvl.bottomRecipe && lvl.topRecipe) {
    const botHex = rgbToHex(getRecipeRgb(lvl.bottomRecipe, palette));
    const topHex = rgbToHex(getRecipeRgb(lvl.topRecipe, palette));
    return {
      levelId: lvl.id,
      typeId: lvl.typeId,
      levelNumber: lvl.number,
      levelName: lvl.name,
      isLayered: true,
      hexCode: topHex,
      topHexCode: topHex,
      bottomHexCode: botHex,
      recipeText: formatLayeredRecipeText(lvl.topRecipe, lvl.bottomRecipe, palette),
      drops: [...lvl.bottomRecipe, ...lvl.topRecipe],
      bottomDrops: [...lvl.bottomRecipe],
      topDrops: [...lvl.topRecipe],
      stars: prog.bestStars || 1,
      matchPercent: prog.bestStars === 3 ? 98 : prog.bestStars === 2 ? 92 : 86,
      vesselId: gameState.equippedVessel,
      paletteId: gameState.equippedPalette,
      solvedAt: '',
    };
  }

  const hex = rgbToHex(getRecipeRgb(lvl.recipe, palette));
  return {
    levelId: lvl.id,
    typeId: lvl.typeId,
    levelNumber: lvl.number,
    levelName: lvl.name,
    isLayered: false,
    hexCode: hex,
    recipeText: formatRecipeText(lvl.recipe, palette),
    drops: [...lvl.recipe],
    stars: prog.bestStars || 1,
    matchPercent: prog.bestStars === 3 ? 98 : prog.bestStars === 2 ? 92 : 86,
    vesselId: gameState.equippedVessel,
    paletteId: gameState.equippedPalette,
    solvedAt: '',
  };
}

export const RecipeBookModal: React.FC<RecipeBookModalProps> = ({
  gameState,
  initialType,
  onClaimPackBonus,
  onSnapshotDownloaded,
  onToast,
  onClose,
}) => {
  const [activeType, setActiveType] = useState<LevelTypeId>(initialType);
  const [selectedEntry, setSelectedEntry] = useState<RecipeBookEntry | null>(null);

  const activeTheme = LEVEL_TYPES[activeType];
  const packLevels = LEVELS_BY_TYPE[activeType];
  const packSolvedCount = countRecipeBookPackEntries(gameState, activeType);
  const isBonusClaimed = gameState.claimedBookBonuses.includes(activeType);
  const canClaimPackBonus = packSolvedCount >= 10 && !isBonusClaimed;

  const totalSolved = useMemo(
    () =>
      LEVEL_TYPE_ORDER.reduce(
        (acc, t) => acc + countRecipeBookPackEntries(gameState, t),
        0
      ),
    [gameState]
  );

  const handleDownloadPolaroid = (entry: RecipeBookEntry) => {
    const entryTheme = LEVEL_TYPES[entry.typeId];
    const entryPalette = getPaletteById(entry.paletteId);
    const dataUrl = generateSnapshotCardDataUrl({
      vesselId: entry.vesselId,
      palette: entryPalette,
      drops: entry.drops,
      isLayered: entry.isLayered,
      bottomDrops: entry.bottomDrops,
      topDrops: entry.topDrops,
      overMix: 0.08,
      levelName: entry.levelName,
      typeName: entryTheme.name,
      hexCode: entry.hexCode,
      topHexCode: entry.topHexCode,
      bottomHexCode: entry.bottomHexCode,
      matchPercent: entry.matchPercent,
      recipeText: entry.recipeText,
      stageBg: entryTheme.gameplayStageBg,
      accentColor: entryTheme.gameplayAccent,
    });
    if (!dataUrl) return;
    const hexTag =
      entry.isLayered && entry.topHexCode && entry.bottomHexCode
        ? `${entry.topHexCode.replace('#', '')}-${entry.bottomHexCode.replace('#', '')}`
        : entry.hexCode.replace('#', '');
    const link = document.createElement('a');
    link.download = `dye-drop-${entry.levelName.toLowerCase().replace(/\s+/g, '-')}-${hexTag}.png`;
    link.href = dataUrl;
    link.click();
    audio.playClick();
    onSnapshotDownloaded(
      entry.isLayered && entry.topHexCode && entry.bottomHexCode
        ? `${entry.topHexCode} / ${entry.bottomHexCode}`
        : entry.hexCode
    );
  };

  const handleCopyEntryRecipe = (entry: RecipeBookEntry) => {
    const hexPart =
      entry.isLayered && entry.topHexCode && entry.bottomHexCode
        ? `Top ${entry.topHexCode} / Bottom ${entry.bottomHexCode}`
        : entry.hexCode;
    const text = `Dye Drop — ${entry.levelName} (${hexPart}) | Recipe: ${entry.recipeText}`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
      } catch {
        // Ignore fallback copy failure
      }
      document.body.removeChild(ta);
    }
    audio.playClick();
    onToast('Color HEX & recipe copied!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0B3338]/60 backdrop-blur-sm flex items-center justify-center p-3">
      <div className="relative w-full max-w-[398px] max-h-[90dvh] pastel-modal rounded-[30px] overflow-hidden flex flex-col animate-pop-in">
        {/* Pastel Cartoon Swatch Book Header */}
        <div className="bg-gradient-to-b from-[#9FE8FF] to-[#6DD3FB] border-b-[2.5px] border-[#18495A] px-3.5 py-3 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <RecipeBookOpenIcon className="w-12 h-9 shrink-0 drop-shadow-[0_2px_4px_rgba(14,62,74,0.22)]" />
            <div className="min-w-0">
              <h2 className="font-display font-bold text-lg sm:text-xl text-[#144353] leading-none truncate">
                Recipe Book
              </h2>
              <div className="text-[11px] font-bold text-[#1E5C70] mt-0.5 font-mono-num">
                {totalSolved}/60 Swatches Collected
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <div className="pastel-teal-pill rounded-full px-2.5 py-1 flex items-center gap-1">
              <DiamondIcon className="w-4 h-4" />
              <span className="font-display font-bold text-xs text-white font-mono-num">
                {gameState.diamonds}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Recipe Book"
              className="w-9 h-9 rounded-xl pastel-white-sq-btn flex items-center justify-center text-[#164454] cursor-pointer"
            >
              <X className="w-4.5 h-4.5 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* 6 Horizontally Scrollable Pack Tabs */}
        <div className="px-3 pt-2.5 pb-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 border-b-2 border-[#18495A]/20 bg-[#7FE9D8]/55">
          {LEVEL_TYPE_ORDER.map((typeId) => {
            const t = LEVEL_TYPES[typeId];
            const count = countRecipeBookPackEntries(gameState, typeId);
            const claimable = count >= 10 && !gameState.claimedBookBonuses.includes(typeId);
            const isSelected = activeType === typeId;

            return (
              <button
                key={typeId}
                type="button"
                onClick={() => {
                  audio.playClick();
                  setActiveType(typeId);
                }}
                className={`relative px-3 py-1.5 rounded-full font-display font-bold text-xs shrink-0 transition cursor-pointer flex items-center gap-1 border-2 ${
                  isSelected
                    ? 'border-[#18495A] shadow-[0_3px_0_#18495A] scale-[1.03]'
                    : 'border-[#18495A]/45 opacity-80 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: t.tabColor,
                  color: t.tabTextColor,
                }}
              >
                <span className="cartoon-text-shadow">{t.name}</span>
                <span className="text-[10px] font-mono-num opacity-95">{count}/10</span>
                {claimable && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#24C466] border border-[#144353] text-white text-[9px] font-black flex items-center justify-center animate-bounce">
                    !
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Pack Swatch Bonus Banner */}
        <div className="px-3 pt-2.5 shrink-0">
          <div className="rounded-[20px] pastel-subcard p-2.5 flex items-center justify-between gap-2.5">
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <span className="font-display font-bold text-xs text-[#144353]">
                  {activeTheme.name} Album Bonus
                </span>
                <span className="font-mono-num text-[11px] font-extrabold text-[#3E6F80]">
                  {packSolvedCount}/10
                </span>
              </div>
              <div className="mt-1.5 h-3 rounded-full pastel-track overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${(packSolvedCount / 10) * 100}%`,
                    backgroundColor: packSolvedCount >= 10 ? '#28C96D' : activeTheme.tabColor,
                  }}
                />
              </div>
            </div>

            {isBonusClaimed ? (
              <div className="px-2.5 py-1.5 rounded-full bg-[#24C466] border-2 border-[#144353] font-display font-bold text-[11px] text-white flex items-center gap-1 shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Claimed</span>
              </div>
            ) : canClaimPackBonus ? (
              <button
                type="button"
                onClick={() => onClaimPackBonus(activeType)}
                className="px-3 py-1.5 rounded-full pastel-lime-btn font-display font-bold text-xs text-[#12452B] flex items-center gap-1 shrink-0 cursor-pointer animate-pulse"
              >
                <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>+{PACK_BOOK_BONUS_DIAMONDS}</span>
                <DiamondIcon className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="px-2.5 py-1.5 rounded-full bg-[#E3F6F7] border border-[#B2DCE2] font-display font-bold text-[11px] text-[#144353] flex items-center gap-1 shrink-0">
                <DiamondIcon className="w-3.5 h-3.5" />
                <span className="font-mono-num">+{PACK_BOOK_BONUS_DIAMONDS}</span>
              </div>
            )}
          </div>
        </div>

        {/* 2-Column Polaroid Swatch Grid */}
        <div className="p-3 overflow-y-auto pastel-scroll grid grid-cols-2 gap-2.5">
          {packLevels.map((lvl) => {
            const entry = buildFallbackEntry(lvl, gameState);

            if (!entry) {
              return (
                <div
                  key={lvl.id}
                  className="bg-white/60 rounded-[20px] border-2 border-dashed border-[#4A9EA8] p-2.5 flex flex-col justify-between min-h-[154px] backdrop-blur-[2px]"
                >
                  <div className="h-20 rounded-2xl bg-[#D2F4F2]/85 flex flex-col items-center justify-center relative">
                    <Lock className="w-5 h-5 text-[#4D8B96] stroke-[2.4]" />
                  </div>
                  <div className="mt-2">
                    <div className="font-display font-bold text-xs text-[#3C7682] truncate">
                      Lvl {lvl.number} · Locked
                    </div>
                    <div className="font-mono-num text-[10px] font-bold text-[#6199A4] mt-0.5">
                      #??????
                    </div>
                  </div>
                </div>
              );
            }

            const isLayered = entry.isLayered && entry.topHexCode && entry.bottomHexCode;

            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => {
                  audio.playClick();
                  setSelectedEntry(entry);
                }}
                className="text-left pastel-subcard rounded-[20px] p-2 flex flex-col justify-between cursor-pointer min-h-[154px] active:scale-[0.98] transition-transform"
              >
                {/* Mini Swatch Window (50/50 split for layered levels, no 2-TONE text) */}
                <div
                  className="relative h-20 rounded-2xl pastel-level-tile overflow-hidden flex items-center justify-center"
                  style={
                    isLayered
                      ? {
                          backgroundImage: `linear-gradient(180deg, ${entry.topHexCode} 0%, ${entry.topHexCode} 50%, ${entry.bottomHexCode} 50%, ${entry.bottomHexCode} 100%)`,
                        }
                      : {backgroundColor: entry.hexCode}
                  }
                >
                  <VesselSvgIcon
                    vesselId={entry.vesselId}
                    liquidColor={isLayered ? entry.bottomHexCode : entry.hexCode}
                    className="w-12 h-12 drop-shadow-[0_3px_5px_rgba(14,52,64,0.3)]"
                  />

                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-full bg-white/95 border border-[#18495A]/40 font-mono-num text-[9px] font-extrabold text-[#144353]">
                    #{lvl.number}
                  </span>
                </div>

                {/* Polaroid Caption */}
                <div className="mt-1.5">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-display font-bold text-xs text-[#144353] truncate">
                      {entry.levelName}
                    </span>
                    <div className="flex items-center shrink-0">
                      {[0, 1, 2].map((s) => (
                        <ComicStarIcon
                          key={s}
                          filled={s < entry.stars}
                          className="w-3 h-3"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mt-1 flex items-center gap-1 flex-wrap">
                    {isLayered ? (
                      <>
                        <span className="px-1.5 py-0.5 rounded-full bg-[#144353] font-mono-num text-[9px] font-extrabold text-white tracking-wide">
                          {entry.topHexCode?.toUpperCase()}
                        </span>
                        <span className="px-1.5 py-0.5 rounded-full bg-[#144353] font-mono-num text-[9px] font-extrabold text-white tracking-wide">
                          {entry.bottomHexCode?.toUpperCase()}
                        </span>
                      </>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-[#144353] font-mono-num text-[10px] font-extrabold text-white tracking-wide">
                        {entry.hexCode.toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="text-[10px] font-bold text-[#497685] truncate mt-0.5">
                    {entry.recipeText}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Enlarged Polaroid Detail Overlay */}
        {selectedEntry && (
          <div className="absolute inset-0 z-30 bg-[#0B3338]/65 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-[336px] pastel-modal rounded-[28px] p-4 space-y-3 animate-pop-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span
                    className="px-2.5 py-0.5 rounded-full border-2 border-[#18495A] font-display font-bold text-[11px]"
                    style={{
                      backgroundColor: LEVEL_TYPES[selectedEntry.typeId].tabColor,
                      color: LEVEL_TYPES[selectedEntry.typeId].tabTextColor,
                    }}
                  >
                    {LEVEL_TYPES[selectedEntry.typeId].name} #{selectedEntry.levelNumber}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    audio.playClick();
                    setSelectedEntry(null);
                  }}
                  aria-label="Close Polaroid Preview"
                  className="w-8 h-8 rounded-xl pastel-white-sq-btn flex items-center justify-center text-[#164454] cursor-pointer"
                >
                  <X className="w-4 h-4 stroke-[3]" />
                </button>
              </div>

              {/* Large Swatch Stage */}
              <div
                className="h-44 rounded-[22px] pastel-level-tile flex flex-col items-center justify-center relative overflow-hidden"
                style={
                  selectedEntry.isLayered && selectedEntry.topHexCode && selectedEntry.bottomHexCode
                    ? {
                        backgroundImage: `linear-gradient(180deg, ${selectedEntry.topHexCode} 0%, ${selectedEntry.topHexCode} 50%, ${selectedEntry.bottomHexCode} 50%, ${selectedEntry.bottomHexCode} 100%)`,
                      }
                    : {backgroundColor: selectedEntry.hexCode}
                }
              >
                <VesselSvgIcon
                  vesselId={selectedEntry.vesselId}
                  liquidColor={
                    selectedEntry.isLayered && selectedEntry.bottomHexCode
                      ? selectedEntry.bottomHexCode
                      : selectedEntry.hexCode
                  }
                  className="w-24 h-24 drop-shadow-[0_6px_10px_rgba(14,52,64,0.34)]"
                />
                <div className="absolute bottom-2 right-2 bg-white/95 border-2 border-[#18495A] rounded-full px-2.5 py-0.5 font-mono-num text-[11px] font-extrabold text-[#144353]">
                  {selectedEntry.matchPercent}% MATCH
                </div>
              </div>

              {/* Title + Stars + HEX Codes + Recipe */}
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display font-bold text-xl text-[#144353] leading-tight">
                    {selectedEntry.levelName}
                  </h3>
                  <div className="flex items-center gap-0.5">
                    {[0, 1, 2].map((s) => (
                      <ComicStarIcon
                        key={s}
                        filled={s < selectedEntry.stars}
                        className="w-4 h-4"
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                  {selectedEntry.isLayered &&
                  selectedEntry.topHexCode &&
                  selectedEntry.bottomHexCode ? (
                    <>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#144353] border border-[#0D2F3B] font-mono-num text-xs font-extrabold text-white tracking-wide">
                        <span
                          className="w-3 h-3 rounded-full border-[1.5px] border-white"
                          style={{backgroundColor: selectedEntry.topHexCode}}
                        />
                        TOP {selectedEntry.topHexCode.toUpperCase()}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#144353] border border-[#0D2F3B] font-mono-num text-xs font-extrabold text-white tracking-wide">
                        <span
                          className="w-3 h-3 rounded-full border-[1.5px] border-white"
                          style={{backgroundColor: selectedEntry.bottomHexCode}}
                        />
                        BTM {selectedEntry.bottomHexCode.toUpperCase()}
                      </span>
                    </>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#144353] border border-[#0D2F3B] font-mono-num text-xs font-extrabold text-white tracking-wider">
                      <span
                        className="w-3 h-3 rounded-full border-[1.5px] border-white"
                        style={{backgroundColor: selectedEntry.hexCode}}
                      />
                      {selectedEntry.hexCode.toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="mt-2 bg-[#E8F8F8] border border-[#BCE2E6] rounded-2xl px-3 py-1.5 text-xs font-bold text-[#1E5C70]">
                  {selectedEntry.recipeText}
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleDownloadPolaroid(selectedEntry)}
                  className="py-2.5 px-2 rounded-full pastel-play-btn font-display font-bold text-xs text-white cartoon-text-shadow flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Camera className="w-4 h-4 stroke-[2.5]" />
                  <span>Save PNG</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCopyEntryRecipe(selectedEntry)}
                  className="py-2.5 px-2 rounded-full pastel-silver-btn font-display font-bold text-xs text-[#18495A] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-4 h-4 stroke-[2.5] text-[#1D7BB8]" />
                  <span>Copy Recipe</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
