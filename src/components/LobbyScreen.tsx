import React from 'react';
import {Download} from 'lucide-react';
import {
  APP_ICON_URL,
  LEVELS_BY_TYPE,
  LEVEL_TYPES,
  LEVEL_TYPE_ORDER,
  VESSELS,
  getPaletteById,
  getVesselById,
} from '../game/data';
import {canClaimDailyLogin, countTypeCompleted, getActiveStreakDayToClaim} from '../game/storage';
import type {LevelTypeId, SavedGameState} from '../game/types';
import {
  ChestIcon,
  ComicStarIcon,
  DiamondIcon,
  MusicComicIcon,
  PadlockIcon,
  PaletteTrayIcon,
  SoundComicIcon,
  StarburstSpark,
  StreakCalendarIcon,
  VesselSvgIcon,
} from './ComicIcons';

interface LobbyScreenProps {
  gameState: SavedGameState;
  onSelectType: (typeId: LevelTypeId) => void;
  onSelectLevel: (levelNumber: number) => void;
  onPlay: () => void;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  onOpenStreak: () => void;
  onOpenStudio: (tab?: 'vessels' | 'palettes') => void;
  onClaimTask: (taskId: string) => void;
  onLockedTap: (typeId: LevelTypeId) => void;
  canInstallPWA?: boolean;
  onInstallPWA?: () => void;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({
  gameState,
  onSelectType,
  onSelectLevel,
  onPlay,
  onToggleSound,
  onToggleMusic,
  onOpenStreak,
  onOpenStudio,
  onClaimTask,
  onLockedTap,
  canInstallPWA = false,
  onInstallPWA,
}) => {
  const activeTheme = LEVEL_TYPES[gameState.selectedType];
  const levels = LEVELS_BY_TYPE[gameState.selectedType];
  const isTypeUnlocked = gameState.unlockedTypes.includes(gameState.selectedType);
  const completedCount = countTypeCompleted(gameState, gameState.selectedType);

  const hasLoginReward = canClaimDailyLogin(gameState);
  const displayStreakDay = hasLoginReward
    ? getActiveStreakDayToClaim(gameState)
    : gameState.streakDay;

  const equippedVessel = getVesselById(gameState.equippedVessel);
  const previewVessel =
    VESSELS.find((v) => !gameState.ownedVessels.includes(v.id)) ||
    VESSELS.find((v) => v.id !== gameState.equippedVessel) ||
    VESSELS[1];
  const equippedPalette = getPaletteById(gameState.equippedPalette);

  const prevTypeIdx = Math.max(0, LEVEL_TYPE_ORDER.indexOf(gameState.selectedType) - 1);
  const requiredPrevType = LEVEL_TYPES[LEVEL_TYPE_ORDER[prevTypeIdx]];

  return (
    <div
      className="relative w-full h-full flex flex-col overflow-hidden transition-colors duration-300"
      style={{
        backgroundColor: activeTheme.pageBg,
        ['--dot-color' as string]: activeTheme.halftoneDot,
      }}
    >
      {/* Subtle Comic Halftone Background Overlay */}
      <div className="absolute inset-0 comic-halftone-edge opacity-80 pointer-events-none" />

      {/* Main Responsive Vertical Stack */}
      <div className="relative z-10 flex-1 flex flex-col justify-between px-3 pt-2.5 pb-3 gap-2 min-h-0 overflow-y-auto">
        {/* 1. TOP HEADER BAR (Matches Lobby Mockup Exact Layout) */}
        <header className="flex items-start justify-between gap-1.5 shrink-0">
          {/* Brand Icon + Stacked Comic Burst "DYE DROP" */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl overflow-hidden comic-box-sm bg-[#FFE047] shrink-0">
              <img
                src={APP_ICON_URL}
                alt="Dye Drop Icon"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative leading-none pr-1">
              <div className="font-display font-bold text-[22px] sm:text-[24px] leading-[0.86] text-[#FF6B63] comic-text-stroke tracking-tight">
                DYE
              </div>
              <div className="font-display font-bold text-[22px] sm:text-[24px] leading-[0.88] text-[#FFE047] comic-text-stroke tracking-tight">
                DROP
              </div>
            </div>
          </div>

          {/* Center-Right: Diamonds + Day X Streak + Sound + Music */}
          <div className="flex items-start gap-1.5 sm:gap-2 shrink-0">
            {/* Diamond Counter (Matches Diamond with 100 inside!) */}
            <button
              type="button"
              onClick={() => onOpenStudio('vessels')}
              title="Diamonds — Tap to open Studio"
              className="relative flex items-center justify-center w-13 h-11 sm:w-14 sm:h-12 cursor-pointer active:scale-95 transition"
            >
              <DiamondIcon className="w-full h-full drop-shadow-[2px_3px_0_#141414]" />
              <span className="absolute inset-0 flex items-center justify-center pb-1 font-display font-bold text-[13px] sm:text-sm text-white comic-text-stroke font-mono-num">
                {gameState.diamonds}
              </span>
            </button>

            {/* Daily Login Streak Calendar ("Day X") */}
            <button
              type="button"
              onClick={onOpenStreak}
              aria-label={`Daily Login Streak Day ${displayStreakDay}`}
              className="cursor-pointer active:scale-95 transition -mt-0.5"
            >
              <StreakCalendarIcon
                day={displayStreakDay}
                hasReward={hasLoginReward}
                className="w-11 h-12 sm:w-12 sm:h-13"
              />
            </button>

            {/* Sound Toggle */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={onToggleSound}
                aria-label={gameState.soundEnabled ? 'Mute Sound' : 'Enable Sound'}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#FFF066] comic-btn flex items-center justify-center cursor-pointer"
              >
                <SoundComicIcon muted={!gameState.soundEnabled} className="w-6 h-6" />
              </button>
              <span className="text-[10px] font-extrabold text-[#141414] mt-0.5 leading-none">
                Sound
              </span>
            </div>

            {/* Music Toggle */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={onToggleMusic}
                aria-label={gameState.musicEnabled ? 'Mute Music' : 'Enable Music'}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#FFF066] comic-btn flex items-center justify-center cursor-pointer"
              >
                <MusicComicIcon muted={!gameState.musicEnabled} className="w-6 h-6" />
              </button>
              <span className="text-[10px] font-extrabold text-[#141414] mt-0.5 leading-none">
                Music
              </span>
            </div>

            {/* Optional PWA Install Button when browser fires beforeinstallprompt */}
            {canInstallPWA && onInstallPWA && (
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={onInstallPWA}
                  aria-label="Install Dye Drop"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#B8FF00] comic-btn flex items-center justify-center cursor-pointer"
                >
                  <Download className="w-5 h-5 stroke-[2.8] text-[#141414]" />
                </button>
                <span className="text-[10px] font-extrabold text-[#141414] mt-0.5 leading-none">
                  Install
                </span>
              </div>
            )}
          </div>
        </header>

        {/* 2. DAILY TASKS FOLDER PANEL (Instruction 8: 2 daily tasks, 10 diamonds each) */}
        <section className="relative shrink-0 pt-5">
          {/* Folder Top-Left Tab */}
          <div
            className="absolute top-0 left-0 px-3.5 pt-1 pb-2 rounded-t-2xl border-t-[3px] border-l-[3px] border-r-[3px] border-[#141414] z-10"
            style={{backgroundColor: activeTheme.panelCoral}}
          >
            <span className="font-display font-bold text-sm sm:text-base tracking-wide text-[#141414] leading-none">
              DAILY TASKS
            </span>
          </div>

          {/* Folder Body */}
          <div
            className="relative rounded-2xl rounded-tl-none comic-box p-2 grid grid-cols-2 gap-2"
            style={{backgroundColor: activeTheme.panelCoral}}
          >
            {gameState.dailyTasks.map((task) => {
              const pct = Math.min(100, Math.round((task.progress / task.target) * 100));
              const canClaim = !task.claimed && task.progress >= task.target;

              return (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => canClaim && onClaimTask(task.id)}
                  className={`relative text-left bg-[#FFFDF5] rounded-xl comic-box-sm p-2 flex flex-col justify-between transition ${
                    canClaim ? 'cursor-pointer hover:bg-[#FFF9C4] active:scale-[0.98]' : 'cursor-default'
                  }`}
                >
                  {/* Tilted Comic Sticker Tag */}
                  <span
                    className={`absolute -top-2.5 -right-1 rotate-[12deg] px-1.5 py-0.5 rounded-md border-2 border-[#141414] text-[9px] font-black uppercase leading-none ${
                      task.claimed
                        ? 'bg-[#D9F99D] text-[#141414]'
                        : canClaim
                        ? 'bg-[#B8FF00] text-[#141414] animate-bounce'
                        : 'bg-[#FFF066] text-[#141414]'
                    }`}
                  >
                    {task.claimed ? 'Done ✓' : canClaim ? 'Claim!' : '+10 💎'}
                  </span>

                  <div className="font-bold text-[11px] sm:text-xs text-[#141414] pr-7 leading-tight truncate">
                    {task.title}
                  </div>

                  <div className="flex items-center gap-1.5 mt-1.5">
                    {/* Comic Progress Bar */}
                    <div className="relative flex-1 h-4 rounded-md bg-[#141414] border-2 border-[#141414] overflow-hidden">
                      <div
                        className="h-full transition-all duration-300"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: canClaim ? '#B8FF00' : activeTheme.panelCoral,
                        }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-extrabold text-white drop-shadow-[0_1px_1px_#141414] font-mono-num">
                        {task.progress}/{task.target}
                      </span>
                    </div>

                    {/* Task Icon */}
                    {task.icon === 'chest' ? (
                      <ChestIcon className="w-7 h-6 shrink-0" />
                    ) : (
                      <DiamondIcon className="w-7 h-6 shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. HERO LEVEL FOLDER WITH 6 VERTICAL TABS (Crimson, Marigold, Forest, Ocean, Velvet, Shadow) */}
        <section className="relative flex items-stretch shrink-0 my-auto">
          {/* Left Side 6 Folder Tabs */}
          <div className="flex flex-col justify-center gap-0.5 w-[78px] sm:w-[88px] shrink-0 py-2 z-10">
            {LEVEL_TYPE_ORDER.map((typeId) => {
              const t = LEVEL_TYPES[typeId];
              const isSelected = gameState.selectedType === typeId;
              const unlocked = gameState.unlockedTypes.includes(typeId);

              return (
                <button
                  key={typeId}
                  type="button"
                  onClick={() => onSelectType(typeId)}
                  className={`relative text-left pl-2 pr-1.5 py-2 sm:py-2.5 rounded-l-xl border-t-[3px] border-b-[3px] border-l-[3px] border-[#141414] font-display font-bold text-xs sm:text-[13px] leading-none transition-transform cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'translate-x-[3px] z-20 shadow-[-2px_3px_0_#141414]'
                      : 'border-r-[3px] opacity-92 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: t.tabColor,
                    color: t.tabTextColor,
                  }}
                >
                  <span className="truncate">{t.name}</span>
                  {!unlocked && <span className="text-[10px] ml-0.5" aria-hidden="true">🔒</span>}
                </button>
              );
            })}
          </div>

          {/* Right Main Folder Body */}
          <div className="relative flex-1 flex flex-col">
            {/* Top Folder Tab Ear */}
            <div className="flex items-end justify-between pl-1 pr-2">
              <div
                className="px-3 py-1 rounded-t-xl border-t-[3px] border-l-[3px] border-r-[3px] border-[#141414] flex items-center gap-1.5 -mb-[3px] z-10"
                style={{backgroundColor: activeTheme.folderBg}}
              >
                <span className="font-display font-bold text-xs sm:text-sm text-[#141414]">
                  {activeTheme.name}
                </span>
                <span className="text-[10px] font-extrabold text-[#141414]/75 font-mono-num">
                  {completedCount}/10
                </span>
              </div>
              {!isTypeUnlocked && (
                <span className="text-[10px] font-extrabold text-[#141414]/80 pb-1 truncate">
                  Clear {requiredPrevType.name} to unlock
                </span>
              )}
            </div>

            {/* Folder Interior with All 10 Levels */}
            <div
              className="relative flex-1 rounded-2xl rounded-tl-none comic-box-lg p-2.5 sm:p-3 transition-colors duration-300"
              style={{backgroundColor: activeTheme.folderBg}}
            >
              {/* Decorative Comic Sparkles on Folder Corner */}
              <StarburstSpark
                color="#FFFDF5"
                className="hidden sm:block absolute -top-4 -right-3 w-7 h-7 pointer-events-none"
              />

              {/* Levels 1 - 9 in Signature 3x3 Comic Grid */}
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                {levels.slice(0, 9).map((lvl, idx) => {
                  const prog = gameState.levelProgress[lvl.id];
                  const stars = prog?.bestStars || 0;
                  const isSelected = gameState.selectedLevelNumber === lvl.number;
                  const tileBg = isTypeUnlocked
                    ? activeTheme.tilePalette[idx % activeTheme.tilePalette.length]
                    : '#FFF8D6';

                  return (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => {
                        onSelectLevel(lvl.number);
                        if (!isTypeUnlocked) onLockedTap(gameState.selectedType);
                      }}
                      className={`relative rounded-xl py-1.5 sm:py-2 px-1 flex flex-col items-center justify-center comic-btn cursor-pointer min-h-[58px] sm:min-h-[66px] ${
                        isSelected ? 'scale-[1.03] z-10' : ''
                      }`}
                      style={{backgroundColor: tileBg}}
                    >
                      {/* Selected Level Comic Starbursts (Matches Level 4 in Mockup!) */}
                      {isSelected && isTypeUnlocked && (
                        <>
                          <StarburstSpark
                            color="#FFE047"
                            className="absolute -top-2.5 -right-2.5 w-6 h-6 pointer-events-none animate-sparkle"
                          />
                          <StarburstSpark
                            color="#FFE047"
                            className="absolute -top-2 -left-2 w-4 h-4 pointer-events-none"
                          />
                        </>
                      )}

                      {isTypeUnlocked ? (
                        <>
                          <span className="font-display font-bold text-2xl sm:text-[26px] text-white comic-text-stroke leading-none">
                            {lvl.number}
                          </span>
                          <div className="flex items-center gap-0.5 mt-1">
                            {[0, 1, 2].map((s) => (
                              <ComicStarIcon
                                key={s}
                                filled={s < stars}
                                className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                              />
                            ))}
                          </div>
                        </>
                      ) : (
                        <>
                          <PadlockIcon className="w-6 h-7" />
                          <span className="text-[10px] font-extrabold text-[#141414] leading-none mt-0.5">
                            Locked
                          </span>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Level 10 Finale Bar (All 10 levels clearly accessible!) */}
              {(() => {
                const lvl10 = levels[9];
                const prog10 = gameState.levelProgress[lvl10.id];
                const stars10 = prog10?.bestStars || 0;
                const isSelected10 = gameState.selectedLevelNumber === 10;

                return (
                  <button
                    type="button"
                    onClick={() => {
                      onSelectLevel(10);
                      if (!isTypeUnlocked) onLockedTap(gameState.selectedType);
                    }}
                    className={`relative mt-2 w-full rounded-xl py-2 px-3 flex items-center justify-between comic-btn cursor-pointer ${
                      isSelected10 ? 'scale-[1.01] z-10' : ''
                    }`}
                    style={{
                      backgroundColor: isTypeUnlocked
                        ? activeTheme.tilePalette[3]
                        : '#FFF8D6',
                    }}
                  >
                    {isSelected10 && isTypeUnlocked && (
                      <StarburstSpark
                        color="#FFE047"
                        className="absolute -top-2.5 -right-2 w-6 h-6 pointer-events-none animate-sparkle"
                      />
                    )}

                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-xl text-white comic-text-stroke leading-none">
                        10
                      </span>
                      <div className="text-left leading-tight">
                        <div className="font-display font-bold text-xs text-[#141414]">
                          {isTypeUnlocked ? lvl10.name : 'Level 10 Finale'}
                        </div>
                        <div className="text-[10px] font-extrabold text-[#141414]/75">
                          {isTypeUnlocked ? 'Pack Finale' : 'Locked'}
                        </div>
                      </div>
                    </div>

                    {isTypeUnlocked ? (
                      <div className="flex items-center gap-0.5">
                        {[0, 1, 2].map((s) => (
                          <ComicStarIcon key={s} filled={s < stars10} className="w-4 h-4" />
                        ))}
                      </div>
                    ) : (
                      <PadlockIcon className="w-6 h-6" />
                    )}
                  </button>
                );
              })()}
            </div>
          </div>
        </section>

        {/* 4. STUDIO COLLECTION STACKED FOLDER PANEL (Moved to Lobby per Instruction 1!) */}
        <section className="relative shrink-0 pt-5">
          {/* Folder Top-Left Tab */}
          <div
            className="absolute top-0 left-0 px-3.5 pt-1 pb-2 rounded-t-2xl border-t-[3px] border-l-[3px] border-r-[3px] border-[#141414] z-10"
            style={{backgroundColor: activeTheme.panelCoral}}
          >
            <span className="font-display font-bold text-sm sm:text-base tracking-wide text-[#141414] leading-none">
              STUDIO COLLECTION
            </span>
          </div>

          {/* Stacked Paper Edge Accent behind card */}
          <div className="relative">
            <div
              className="absolute inset-x-2 -bottom-1.5 h-5 rounded-b-2xl border-[3px] border-[#141414]"
              style={{backgroundColor: activeTheme.tabColor}}
            />

            <div
              className="relative rounded-2xl rounded-tl-none comic-box px-2.5 py-2 flex items-center justify-between gap-2"
              style={{backgroundColor: activeTheme.panelCoral}}
            >
              {/* Equipped Vessel Slot */}
              <button
                type="button"
                onClick={() => onOpenStudio('vessels')}
                className="relative flex flex-col items-center flex-1 cursor-pointer group active:scale-95 transition"
              >
                <span className="absolute -top-1.5 right-0 -rotate-6 px-1.5 py-0.5 rounded-md bg-[#FFF066] border-2 border-[#141414] text-[9px] font-black text-[#141414] z-10">
                  Equipped
                </span>
                <VesselSvgIcon
                  vesselId={equippedVessel.id}
                  liquidColor="#FF6B63"
                  className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-[2px_2px_0_#141414] group-hover:scale-105 transition"
                />
                <span className="font-extrabold text-[10px] sm:text-[11px] text-[#141414] leading-tight truncate max-w-[96px]">
                  {equippedVessel.name}
                </span>
              </button>

              {/* Next Unlockable Vessel Preview */}
              <button
                type="button"
                onClick={() => onOpenStudio('vessels')}
                className="relative flex flex-col items-center flex-1 cursor-pointer group active:scale-95 transition"
              >
                <span className="absolute -top-1.5 right-0 rotate-3 px-1.5 py-0.5 rounded-md bg-[#FFF066] border-2 border-[#141414] text-[9px] font-black text-[#141414] z-10">
                  Preview
                </span>
                <VesselSvgIcon
                  vesselId={previewVessel.id}
                  liquidColor="#4CE4F2"
                  className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-[2px_2px_0_#141414] group-hover:scale-105 transition"
                />
                <span className="font-extrabold text-[10px] sm:text-[11px] text-[#141414] leading-tight truncate max-w-[96px]">
                  {previewVessel.name}
                </span>
              </button>

              {/* Pigment Palette Card Preview */}
              <button
                type="button"
                onClick={() => onOpenStudio('palettes')}
                className="relative flex flex-col items-center shrink-0 cursor-pointer group active:scale-95 transition"
              >
                <PaletteTrayIcon
                  palette={equippedPalette}
                  className="w-22 h-15 sm:w-24 sm:h-16 drop-shadow-[3px_3px_0_#141414] rotate-2 group-hover:scale-105 transition"
                />
                <span className="absolute -bottom-1 right-0 px-1.5 py-0.5 rounded-md bg-[#FFF066] border-2 border-[#141414] text-[9px] font-black text-[#141414]">
                  Palettes
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* 5. BOTTOM HERO PLAY CTA BUTTON (Matches Bright Lime Comic Bar in Mockup) */}
        <div className="shrink-0 pt-1">
          <button
            type="button"
            onClick={() => {
              if (!isTypeUnlocked) {
                onLockedTap(gameState.selectedType);
              } else {
                onPlay();
              }
            }}
            className="w-full py-2.5 px-3 rounded-2xl comic-btn flex items-center justify-between cursor-pointer"
            style={{
              backgroundColor: isTypeUnlocked ? activeTheme.playCtaBg : '#E4DFCE',
            }}
          >
            {/* Left Tilted Level Tag */}
            <div className="bg-[#FFF066] border-[2.5px] border-[#141414] rounded-xl px-2.5 py-1 -rotate-2 shadow-[2px_2px_0_#141414] text-left leading-none">
              <div className="font-display font-bold text-[11px] text-[#141414] uppercase">
                {isTypeUnlocked ? 'PLAY' : 'LOCKED'}
              </div>
              <div className="font-display font-bold text-xs text-[#141414] font-mono-num">
                LEVEL {gameState.selectedLevelNumber}
              </div>
            </div>

            {/* Center Bold PLAY Label */}
            <span className="font-display font-bold text-3xl sm:text-4xl text-[#141414] tracking-wide leading-none">
              {isTypeUnlocked ? 'PLAY' : 'LOCKED'}
            </span>

            {/* Right Bold Arrow */}
            <span className="font-display font-bold text-3xl text-[#141414] leading-none pr-1">
              {isTypeUnlocked ? '➔' : '🔒'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
