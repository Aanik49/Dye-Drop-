import React, {useRef} from 'react';
import {Check, ChevronLeft, ChevronRight, Download, Lock, Play, Plus} from 'lucide-react';
import {LEVEL_TYPES, LEVEL_TYPE_ORDER} from '../game/data';
import {
  canClaimDailyLogin,
  countRecipeBookPackEntries,
  hasClaimableRecipeBookBonus,
} from '../game/storage';
import type {LevelTypeId, SavedGameState} from '../game/types';
import {
  DailyLoginCardIcon,
  DailyTaskClipboardIcon,
  DiamondIcon,
  DyeDropHeroLogo,
  LevelTypeIcon,
  LobbyHeroFlask,
  MusicComicIcon,
  RecipeBookOpenIcon,
  SoundComicIcon,
  StudioShopIcon,
} from './ComicIcons';
import {PastelNatureBackdrop} from './PastelNatureBackdrop';

interface LobbyScreenProps {
  gameState: SavedGameState;
  onSelectType: (typeId: LevelTypeId) => void;
  onOpenLevels: (typeId?: LevelTypeId) => void;
  onPlay: () => void;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  onOpenStreak: () => void;
  onOpenDailyTasks: () => void;
  onOpenStudio: (tab?: 'vessels' | 'palettes') => void;
  onOpenRecipeBook: () => void;
  onLockedTap: (typeId: LevelTypeId) => void;
  canInstallPWA?: boolean;
  onInstallPWA?: () => void;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({
  gameState,
  onSelectType,
  onOpenLevels,
  onPlay,
  onToggleSound,
  onToggleMusic,
  onOpenStreak,
  onOpenDailyTasks,
  onOpenStudio,
  onOpenRecipeBook,
  onLockedTap,
  canInstallPWA = false,
  onInstallPWA,
}) => {
  const isTypeUnlocked = gameState.unlockedTypes.includes(gameState.selectedType);
  const hasBookBonus = hasClaimableRecipeBookBonus(gameState);
  const hasClaimableTask = gameState.dailyTasks.some(
    (task) => !task.claimed && task.progress >= task.target
  );
  const hasLoginReward = canClaimDailyLogin(gameState);

  // Dedicated Left-Right Swipe & Mouse-Drag Support ONLY for the Level Type Strip
  const stripRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<{
    active: boolean;
    startX: number;
    startScrollLeft: number;
    didDrag: boolean;
  }>({active: false, startX: 0, startScrollLeft: 0, didDrag: false});

  const handleStripPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = stripRef.current;
    if (!el || e.pointerType === 'touch') return;
    dragStateRef.current = {
      active: true,
      startX: e.clientX,
      startScrollLeft: el.scrollLeft,
      didDrag: false,
    };
  };

  const handleStripPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = stripRef.current;
    const ds = dragStateRef.current;
    if (!el || !ds.active) return;
    const dx = e.clientX - ds.startX;
    if (Math.abs(dx) > 6) {
      ds.didDrag = true;
      el.scrollLeft = ds.startScrollLeft - dx;
    }
  };

  const handleStripPointerUp = () => {
    dragStateRef.current.active = false;
  };

  const scrollStripBy = (delta: number) => {
    stripRef.current?.scrollBy({left: delta, behavior: 'smooth'});
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden select-none">
      {/* Full-bleed Illustrated Pastel Mountain-Lake Scenery */}
      <PastelNatureBackdrop variant="lobby" />

      {/* Main Lobby Content (No vertical scroll; ONLY the Level Types strip swipes left/right) */}
      <div className="relative z-10 flex-1 min-h-0 flex flex-col justify-between px-3 pt-2.5 pb-2.5 overflow-hidden">
        {/* 1. TOP BAR: Dark-Teal Diamond Pill (Left) & Music/Sound Circles (Right) */}
        <header className="flex items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onOpenStudio('vessels')}
            title="Diamonds — Tap to open Studio"
            className="pastel-teal-pill rounded-full pl-1 pr-1.5 py-0.5 flex items-center gap-2 cursor-pointer active:scale-95 transition"
          >
            <DiamondIcon className="w-7 h-6 -ml-1.5 drop-shadow-[0_2px_4px_rgba(10,50,74,0.38)]" />
            <span className="font-display font-bold text-base text-white font-mono-num leading-none tracking-tight">
              {gameState.diamonds}
            </span>
            <span className="w-6 h-6 rounded-full bg-gradient-to-b from-[#6EF59E] to-[#24BE66] border border-[#145842] flex items-center justify-center shadow-xs">
              <Plus className="w-3.5 h-3.5 text-white stroke-[3.4]" />
            </span>
          </button>

          <div className="flex items-center gap-2 shrink-0">
            {canInstallPWA && onInstallPWA && (
              <button
                type="button"
                onClick={onInstallPWA}
                aria-label="Install Dye Drop"
                className="w-10 h-10 rounded-full pastel-teal-circle flex items-center justify-center text-white cursor-pointer"
              >
                <Download className="w-4 h-4 stroke-[2.6]" />
              </button>
            )}
            <button
              type="button"
              onClick={onToggleMusic}
              aria-label={gameState.musicEnabled ? 'Mute Music' : 'Enable Music'}
              className="w-10 h-10 rounded-full pastel-teal-circle flex items-center justify-center cursor-pointer"
            >
              <MusicComicIcon muted={!gameState.musicEnabled} tone="light" className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={onToggleSound}
              aria-label={gameState.soundEnabled ? 'Mute Sound' : 'Enable Sound'}
              className="w-10 h-10 rounded-full pastel-teal-circle flex items-center justify-center cursor-pointer"
            >
              <SoundComicIcon muted={!gameState.soundEnabled} tone="light" className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* 2. HERO STACKED "Dye Drop" LOGO + TAGLINE */}
        <div className="flex flex-col items-center justify-center -mt-1 shrink-0">
          <DyeDropHeroLogo className="w-[214px] h-[106px] sm:w-[240px] sm:h-[118px] drop-shadow-[0_6px_10px_rgba(12,68,78,0.2)]" />
          <p className="font-display font-bold text-xs sm:text-[13px] tracking-wide text-[#134D59] -mt-1">
            Mix · Match · Complete
          </p>
        </div>

        {/* 3. SCENIC CENTER STAGE: Daily Login (Left) · Hero Layered Flask (Center) · Daily Task (Right) */}
        <div className="relative flex items-center justify-between px-1 sm:px-2 -my-1 shrink-0">
          {/* Left Floating Tilted Daily Login Calendar (Slightly Larger) */}
          <button
            type="button"
            onClick={onOpenStreak}
            aria-label="Daily Login Streak"
            className="relative -rotate-6 hover:rotate-0 active:scale-95 transition-transform cursor-pointer shrink-0"
          >
            <DailyLoginCardIcon className="w-[74px] h-[80px] sm:w-[82px] sm:h-[88px] drop-shadow-[0_6px_12px_rgba(12,60,64,0.28)]" />
            {hasLoginReward && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#EE3D4F] border-2 border-white text-white text-[10px] font-black flex items-center justify-center shadow-sm animate-bounce">
                !
              </span>
            )}
          </button>

          {/* Center Layered Hero Erlenmeyer Flask on Lakeside Meadow */}
          <button
            type="button"
            onClick={() => onOpenStudio('vessels')}
            aria-label="Open Studio Vessels"
            className="relative cursor-pointer active:scale-95 transition-transform animate-float-slow"
          >
            <LobbyHeroFlask className="w-[122px] h-[132px] sm:w-[140px] sm:h-[150px]" />
          </button>

          {/* Right Floating Daily Task Button — Playfully Tilted like Daily Login, Green Icon Border & Green Text Pill */}
          <button
            type="button"
            onClick={onOpenDailyTasks}
            aria-label="Daily Tasks"
            className="relative rotate-6 hover:rotate-0 flex flex-col items-center justify-center bg-transparent cursor-pointer active:scale-95 transition-transform shrink-0"
          >
            <div className="relative">
              <DailyTaskClipboardIcon className="w-[54px] h-[60px] sm:w-[60px] sm:h-[66px] drop-shadow-[0_5px_10px_rgba(10,56,48,0.28)]" />
              {hasClaimableTask && (
                <span className="absolute -top-1 -right-1.5 w-5 h-5 rounded-full bg-[#EE3D4F] border-2 border-white text-white text-[10px] font-black flex items-center justify-center shadow-sm animate-bounce">
                  !
                </span>
              )}
            </div>
            <span className="-mt-1 px-2.5 py-0.5 rounded-full bg-gradient-to-b from-[#34D97B] to-[#1AA858] border-2 border-[#115E35] shadow-[0_3px_0_#0D4A29] font-display font-bold text-[10.5px] sm:text-[11px] leading-tight text-white whitespace-nowrap">
              Daily Task
            </span>
          </button>
        </div>

        {/* 4. PRIMARY GLOSSY EMERALD "Play" BUTTON WITH ANIMATED YELLOW ACCENT DASHES */}
        <div className="flex items-center justify-center gap-3 px-4 shrink-0">
          <svg viewBox="0 0 24 28" className="w-5 h-6 shrink-0" fill="none" aria-hidden="true">
            <path d="M5 7L18 11" stroke="#FFD63A" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M5 21L18 17" stroke="#FFD63A" strokeWidth="4.5" strokeLinecap="round" />
          </svg>

          <button
            type="button"
            onClick={() => {
              if (!isTypeUnlocked) {
                onLockedTap(gameState.selectedType);
              } else {
                onPlay();
              }
            }}
            className="relative flex-1 max-w-[238px] h-[54px] sm:h-[58px] rounded-full pastel-play-btn flex items-center justify-center gap-3 cursor-pointer overflow-hidden"
          >
            <span className="pointer-events-none absolute top-1.5 left-6 w-12 h-2 rounded-full bg-white/50" />
            <Play className="w-7 h-7 text-white fill-white drop-shadow-[0_2px_0_rgba(12,84,54,0.5)]" />
            <span className="font-display font-bold text-[27px] sm:text-[29px] text-white tracking-wide cartoon-text-shadow leading-none">
              Play
            </span>
          </button>

          <svg viewBox="0 0 24 28" className="w-5 h-6 shrink-0" fill="none" aria-hidden="true">
            <path d="M19 7L6 11" stroke="#FFD63A" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M19 21L6 17" stroke="#FFD63A" strokeWidth="4.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* 5. SELECT LEVEL TYPE SECTION — Title (Non-Clickable) + All 6 Types in Left/Right Swipe Strip */}
        <section className="shrink-0 space-y-1.5">
          {/* Static Section Title */}
          <div className="flex items-center gap-2 px-1">
            <div className="h-[1.5px] flex-1 bg-[#49B09E]/55 rounded-full" />
            <div className="px-4 py-0.5 rounded-full bg-[#10534F]/85 border border-[#6FE2CE]/25 font-display font-bold text-[11px] sm:text-xs text-white tracking-wide shadow-xs">
              Select Level Type
            </div>
            <div className="h-[1.5px] flex-1 bg-[#49B09E]/55 rounded-full" />
          </div>

          {/* Dedicated Left-Right Swipeable Carousel of All 6 Level Types */}
          <div className="relative flex items-center gap-1">
            <button
              type="button"
              onClick={() => scrollStripBy(-160)}
              aria-label="Scroll Level Types Left"
              className="w-6 h-12 rounded-full bg-[#10534F]/75 border border-[#7AE6D4]/30 text-white flex items-center justify-center shrink-0 cursor-pointer active:scale-90 transition"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.8]" />
            </button>

            <div
              ref={stripRef}
              onPointerDown={handleStripPointerDown}
              onPointerMove={handleStripPointerMove}
              onPointerUp={handleStripPointerUp}
              onPointerLeave={handleStripPointerUp}
              className="flex-1 min-w-0 flex items-stretch gap-2 overflow-x-auto no-scrollbar snap-x snap-mandatory touch-pan-x pt-3 pb-2.5 px-1.5 cursor-grab active:cursor-grabbing"
            >
              {LEVEL_TYPE_ORDER.map((typeId) => {
                const t = LEVEL_TYPES[typeId];
                const isSelected = gameState.selectedType === typeId;
                const unlocked = gameState.unlockedTypes.includes(typeId);
                const solvedCount = countRecipeBookPackEntries(gameState, typeId);

                return (
                  <button
                    key={typeId}
                    type="button"
                    onClick={() => {
                      if (dragStateRef.current.didDrag) {
                        dragStateRef.current.didDrag = false;
                        return;
                      }
                      if (!unlocked) {
                        onSelectType(typeId);
                        onLockedTap(typeId);
                        return;
                      }
                      // Clicking any unlocked level type immediately opens its 10-level list!
                      onOpenLevels(typeId);
                    }}
                    className={`relative shrink-0 snap-start w-[74px] sm:w-[78px] rounded-[16px] pastel-type-card py-2 px-1 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                      isSelected
                        ? 'ring-[2.5px] ring-[#42EB82] -translate-y-0.5'
                        : unlocked
                        ? 'opacity-96 hover:opacity-100'
                        : 'opacity-80'
                    }`}
                  >
                    {isSelected && unlocked && (
                      <span className="absolute -top-2 -right-1.5 w-5 h-5 rounded-full bg-[#24CE6B] border-2 border-white flex items-center justify-center shadow-xs z-10">
                        <Check className="w-2.5 h-2.5 text-white stroke-[3.5]" />
                      </span>
                    )}
                    {!unlocked && (
                      <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#18495A]/85 flex items-center justify-center">
                        <Lock className="w-2.5 h-2.5 text-white stroke-[2.8]" />
                      </span>
                    )}

                    <LevelTypeIcon typeId={typeId} className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" />
                    <span className="font-display font-bold text-[10.5px] sm:text-[11px] text-[#154453] leading-tight mt-1 whitespace-nowrap">
                      {t.name}
                    </span>
                    <span className="text-[9px] font-bold text-[#4B7985] leading-tight whitespace-nowrap">
                      {solvedCount > 0 ? `${solvedCount}/10 Done` : '10 Levels'}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => scrollStripBy(160)}
              aria-label="Scroll Level Types Right"
              className="w-6 h-12 rounded-full bg-[#10534F]/75 border border-[#7AE6D4]/30 text-white flex items-center justify-center shrink-0 cursor-pointer active:scale-90 transition"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.8]" />
            </button>
          </div>
        </section>

        {/* 6. BOTTOM WIDE GLOSSY CARDS: STUDIO & RECIPE BOOK (With Overhanging Icons) */}
        <section className="grid grid-cols-2 gap-3 px-2 pt-3 shrink-0">
          <button
            type="button"
            onClick={() => onOpenStudio('vessels')}
            className="relative pastel-wide-card rounded-[22px] pt-3 pb-2.5 px-3 text-center flex flex-col items-center justify-center cursor-pointer"
          >
            <div className="absolute -top-5 left-2.5 pointer-events-none">
              <StudioShopIcon className="w-12 h-11 sm:w-14 sm:h-12 drop-shadow-[0_4px_6px_rgba(14,56,66,0.22)]" />
            </div>
            <span className="font-display font-bold text-sm sm:text-[15px] text-[#144353] leading-tight pl-6">
              Studio
            </span>
            <span className="text-[10px] font-bold text-[#457282] leading-tight mt-0.5">
              Get items &amp; tools
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenRecipeBook}
            className="relative pastel-wide-card rounded-[22px] pt-3 pb-2.5 px-3 text-center flex flex-col items-center justify-center cursor-pointer"
          >
            {hasBookBonus && (
              <span className="absolute -top-2 -right-1.5 w-5 h-5 rounded-full bg-[#EE3D4F] border-2 border-white text-white text-[10px] font-black flex items-center justify-center shadow-sm animate-bounce z-10">
                !
              </span>
            )}
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 pointer-events-none">
              <RecipeBookOpenIcon className="w-14 h-10 sm:w-15 sm:h-11 drop-shadow-[0_4px_6px_rgba(14,56,66,0.22)]" />
            </div>
            <span className="font-display font-bold text-sm sm:text-[15px] text-[#144353] leading-tight mt-2">
              Recipe Book
            </span>
            <span className="text-[10px] font-bold text-[#457282] leading-tight mt-0.5">
              View your progress
            </span>
          </button>
        </section>

        {/* 7. QUIET FOOTER VERSION LINE */}
        <footer className="flex items-center justify-center gap-3 pt-1 shrink-0">
          <span className="h-[1px] w-8 bg-[#8AE6D4]/45 rounded-full" />
          <span className="text-[10px] font-bold text-[#B8F5E8]/80 tracking-wide">
            Dye Drop &nbsp;v1.0.0
          </span>
          <span className="h-[1px] w-8 bg-[#8AE6D4]/45 rounded-full" />
        </footer>
      </div>
    </div>
  );
};
