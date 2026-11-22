import {useCallback, useEffect, useState} from 'react';
import {ChapterUnlockModal} from './components/ChapterUnlockModal';
import {DailyStreakModal} from './components/DailyStreakModal';
import {GameplayScreen, type GameplayResultPayload} from './components/GameplayScreen';
import {LevelFailedModal} from './components/LevelFailedModal';
import {LevelListDrawer} from './components/LevelListDrawer';
import {LevelSuccessModal} from './components/LevelSuccessModal';
import {LobbyScreen} from './components/LobbyScreen';
import {SplashScreen} from './components/SplashScreen';
import {StudioModal} from './components/StudioModal';
import {audio} from './game/audio';
import {
  LEVELS_BY_TYPE,
  LEVEL_TYPES,
  LEVEL_TYPE_ORDER,
  getLevelDef,
  getPaletteById,
  getVesselById,
} from './game/data';
import {
  claimDailyLoginReward,
  claimDailyTask,
  incrementDailyTaskProgress,
  loadSavedState,
  persistState,
  recordLevelCompletion,
} from './game/storage';
import type {LevelTypeId, PaletteId, SavedGameState, ScreenMode, VesselId} from './game/types';
import {usePWAInstall} from './hooks/usePWAInstall';

interface ActiveSuccessState {
  result: GameplayResultPayload;
  diamondsDelta: number;
  wasStarUpgrade: boolean;
  newlyUnlockedType: LevelTypeId | null;
  completedAllOfCurrentType: boolean;
}

export default function App() {
  const [screen, setScreen] = useState<ScreenMode>('splash');
  const [gameState, setGameState] = useState<SavedGameState>(() => loadSavedState());

  // Modals & overlays
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [studioModalTab, setStudioModalTab] = useState<'vessels' | 'palettes' | null>(null);
  const [successState, setSuccessState] = useState<ActiveSuccessState | null>(null);
  const [failedState, setFailedState] = useState<GameplayResultPayload | null>(null);
  const [showLevelListDrawer, setShowLevelListDrawer] = useState(false);
  const [chapterUnlockState, setChapterUnlockState] = useState<{
    completedType: LevelTypeId;
    unlockedType: LevelTypeId | null;
  } | null>(null);
  const [gameplayResetCounter, setGameplayResetCounter] = useState(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const {isInstallable, install} = usePWAInstall();

  // Sync audio preferences & persist state on every change
  useEffect(() => {
    persistState(gameState);
    audio.setSoundEnabled(gameState.soundEnabled);
    audio.setMusicEnabled(gameState.musicEnabled);
  }, [gameState]);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
  }, []);

  useEffect(() => {
    if (!toastMsg) return;
    const t = window.setTimeout(() => setToastMsg(null), 2400);
    return () => window.clearTimeout(t);
  }, [toastMsg]);

  const handleEnterFromSplash = () => {
    setScreen('lobby');
  };

  const handleToggleSound = () => {
    setGameState((prev) => {
      const next = !prev.soundEnabled;
      audio.setSoundEnabled(next);
      if (next) audio.playClick();
      return {...prev, soundEnabled: next};
    });
  };

  const handleToggleMusic = () => {
    setGameState((prev) => {
      const next = !prev.musicEnabled;
      audio.setMusicEnabled(next);
      if (prev.soundEnabled) audio.playClick();
      return {...prev, musicEnabled: next};
    });
  };

  const handleSelectType = (typeId: LevelTypeId) => {
    audio.playClick();
    setGameState((prev) => ({
      ...prev,
      selectedType: typeId,
      selectedLevelNumber: prev.selectedType === typeId ? prev.selectedLevelNumber : 1,
    }));
  };

  const handleSelectLevel = (levelNumber: number) => {
    audio.playClick();
    setGameState((prev) => ({
      ...prev,
      selectedLevelNumber: levelNumber,
    }));
  };

  const handleLockedTap = (typeId: LevelTypeId) => {
    audio.playLocked();
    const idx = LEVEL_TYPE_ORDER.indexOf(typeId);
    const prevType = idx > 0 ? LEVEL_TYPES[LEVEL_TYPE_ORDER[idx - 1]].name : 'Crimson';
    showToast(`Complete all 10 ${prevType} levels to unlock ${LEVEL_TYPES[typeId].name}!`);
  };

  const handlePlayFromLobby = () => {
    if (!gameState.unlockedTypes.includes(gameState.selectedType)) {
      handleLockedTap(gameState.selectedType);
      return;
    }
    audio.unlock();
    audio.playClick();
    setSuccessState(null);
    setFailedState(null);
    setShowLevelListDrawer(false);
    setScreen('gameplay');
  };

  const handleClaimDailyLogin = () => {
    const {nextState, awarded, dayClaimed} = claimDailyLoginReward(gameState);
    if (awarded > 0) {
      audio.playBuy();
      setGameState(nextState);
      showToast(`Day ${dayClaimed} Bonus: +${awarded} Diamonds!`);
    }
  };

  const handleClaimDailyTask = (taskId: string) => {
    const {nextState, awarded} = claimDailyTask(gameState, taskId);
    if (awarded > 0) {
      audio.playBuy();
      setGameState(nextState);
      showToast(`Daily Task Complete: +${awarded} Diamonds!`);
    }
  };

  const handleBuyOrEquipVessel = (vesselId: VesselId) => {
    const vessel = getVesselById(vesselId);
    if (gameState.ownedVessels.includes(vesselId)) {
      audio.playClick();
      setGameState((prev) => ({...prev, equippedVessel: vesselId}));
      showToast(`Equipped ${vessel.name}!`);
      return;
    }
    if (gameState.diamonds < vessel.price) {
      audio.playLocked();
      showToast(`Need ${vessel.price - gameState.diamonds} more Diamonds!`);
      return;
    }
    audio.playBuy();
    setGameState((prev) => ({
      ...prev,
      diamonds: prev.diamonds - vessel.price,
      ownedVessels: [...prev.ownedVessels, vesselId],
      equippedVessel: vesselId,
    }));
    showToast(`Purchased & equipped ${vessel.name}!`);
  };

  const handleBuyOrEquipPalette = (paletteId: PaletteId) => {
    const pal = getPaletteById(paletteId);
    if (gameState.ownedPalettes.includes(paletteId)) {
      audio.playClick();
      setGameState((prev) => ({...prev, equippedPalette: paletteId}));
      showToast(`Switched to ${pal.name}!`);
      return;
    }
    if (gameState.diamonds < pal.price) {
      audio.playLocked();
      showToast(`Need ${pal.price - gameState.diamonds} more Diamonds!`);
      return;
    }
    audio.playBuy();
    setGameState((prev) => ({
      ...prev,
      diamonds: prev.diamonds - pal.price,
      ownedPalettes: [...prev.ownedPalettes, paletteId],
      equippedPalette: paletteId,
    }));
    showToast(`Purchased & activated ${pal.name}!`);
  };

  const handleDropAdded = useCallback(() => {
    setGameState((prev) => incrementDailyTaskProgress(prev, 'use_drops', 1));
  }, []);

  const handleSwirlAction = useCallback(() => {
    setGameState((prev) => incrementDailyTaskProgress(prev, 'swirl_glasses', 1));
  }, []);

  const handleGameplayResult = useCallback(
    (result: GameplayResultPayload) => {
      if (!result.passed) {
        setFailedState(result);
        return;
      }

      const lvl = getLevelDef(gameState.selectedType, gameState.selectedLevelNumber);
      const outcome = recordLevelCompletion(
        gameState,
        gameState.selectedType,
        lvl.id,
        result.stars
      );
      setGameState(outcome.nextState);
      setSuccessState({
        result,
        diamondsDelta: outcome.diamondsDelta,
        wasStarUpgrade: outcome.wasStarUpgrade,
        newlyUnlockedType: outcome.newlyUnlockedType,
        completedAllOfCurrentType: outcome.completedAllOfCurrentType,
      });
    },
    [gameState]
  );

  const handleSaveSnapshot = () => {
    if (!successState?.result.snapshotDataUrl) return;
    const lvl = getLevelDef(gameState.selectedType, gameState.selectedLevelNumber);
    const link = document.createElement('a');
    link.download = `dye-drop-${lvl.name.toLowerCase().replace(/\s+/g, '-')}-${successState.result.hexCode.replace('#', '')}.png`;
    link.href = successState.result.snapshotDataUrl;
    link.click();
    audio.playClick();
    setGameState((prev) => incrementDailyTaskProgress(prev, 'save_snapshot', 1));
    showToast(`Snapshot saved with code ${successState.result.hexCode}!`);
  };

  const handleCopyRecipe = () => {
    if (!successState) return;
    const lvl = getLevelDef(gameState.selectedType, gameState.selectedLevelNumber);
    const text = `Dye Drop — ${lvl.name} (${successState.result.hexCode}) | Recipe: ${successState.result.recipeText}`;
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
        // Ignore fallback error
      }
      document.body.removeChild(ta);
    }
    audio.playClick();
    showToast('Color code & recipe copied!');
  };

  const handleSuccessNext = () => {
    if (!successState) return;
    const completedAll = successState.completedAllOfCurrentType;
    const unlockedType = successState.newlyUnlockedType;
    const currentType = gameState.selectedType;
    const totalInPack = LEVELS_BY_TYPE[currentType].length;

    setSuccessState(null);

    // Instruction 6: After showing complete level panel, if all 10 levels of this type are now complete,
    // show the unlock panel and insist to go to Lobby!
    if (completedAll) {
      audio.playChapterUnlock();
      setChapterUnlockState({
        completedType: currentType,
        unlockedType,
      });
      return;
    }

    if (gameState.selectedLevelNumber < totalInPack) {
      audio.playClick();
      setGameState((prev) => ({
        ...prev,
        selectedLevelNumber: prev.selectedLevelNumber + 1,
      }));
      setGameplayResetCounter((c) => c + 1);
    } else {
      audio.playClick();
      setScreen('lobby');
    }
  };

  const handleSuccessHome = () => {
    if (successState?.completedAllOfCurrentType) {
      const completedType = gameState.selectedType;
      const unlockedType = successState.newlyUnlockedType;
      setSuccessState(null);
      audio.playChapterUnlock();
      setChapterUnlockState({completedType, unlockedType});
      return;
    }
    audio.playClick();
    setSuccessState(null);
    setScreen('lobby');
  };

  const handleChapterGoToLobby = () => {
    audio.playClick();
    const targetType = chapterUnlockState?.unlockedType || gameState.selectedType;
    setChapterUnlockState(null);
    setGameState((prev) => ({
      ...prev,
      selectedType: targetType,
      selectedLevelNumber: 1,
    }));
    setScreen('lobby');
  };

  const activeTheme = LEVEL_TYPES[gameState.selectedType];
  const currentLevel = getLevelDef(gameState.selectedType, gameState.selectedLevelNumber);

  return (
    <div className="w-full h-full flex items-center justify-center bg-[#181620] sm:p-3 overflow-hidden">
      {/* Responsive Mobile Game Shell (Full-bleed on mobile phones, crisp portrait frame on tablets/desktops) */}
      <main className="relative w-full h-full sm:max-w-[436px] sm:max-h-[900px] sm:rounded-[38px] sm:border-[5px] sm:border-[#141414] sm:shadow-[0_28px_70px_rgba(0,0,0,0.65)] overflow-hidden flex flex-col">
        {screen === 'splash' && <SplashScreen onComplete={handleEnterFromSplash} />}

        {screen === 'lobby' && (
          <LobbyScreen
            gameState={gameState}
            onSelectType={handleSelectType}
            onSelectLevel={handleSelectLevel}
            onPlay={handlePlayFromLobby}
            onToggleSound={handleToggleSound}
            onToggleMusic={handleToggleMusic}
            onOpenStreak={() => {
              audio.playClick();
              setShowStreakModal(true);
            }}
            onOpenStudio={(tab = 'vessels') => {
              audio.playClick();
              setStudioModalTab(tab);
            }}
            onClaimTask={handleClaimDailyTask}
            onLockedTap={handleLockedTap}
            canInstallPWA={isInstallable}
            onInstallPWA={() => {
              audio.playClick();
              install();
            }}
          />
        )}

        {screen === 'gameplay' && (
          <GameplayScreen
            gameState={gameState}
            typeId={gameState.selectedType}
            levelNumber={gameState.selectedLevelNumber}
            resetCounter={gameplayResetCounter}
            onBackToLobby={() => {
              audio.playClick();
              setSuccessState(null);
              setFailedState(null);
              setShowLevelListDrawer(false);
              setScreen('lobby');
            }}
            onChangeLevel={(num) => {
              audio.playClick();
              setSuccessState(null);
              setFailedState(null);
              setGameState((prev) => ({...prev, selectedLevelNumber: num}));
            }}
            onToggleSound={handleToggleSound}
            onToggleMusic={handleToggleMusic}
            onDropAdded={handleDropAdded}
            onSwirlAction={handleSwirlAction}
            onResult={handleGameplayResult}
            onToast={showToast}
          />
        )}

        {/* Daily Login Streak Panel (opened via "Day X" icon in Lobby) */}
        {showStreakModal && (
          <DailyStreakModal
            gameState={gameState}
            onClaim={handleClaimDailyLogin}
            onClose={() => {
              audio.playClick();
              setShowStreakModal(false);
            }}
          />
        )}

        {/* Studio Collection Modal (Vessels & Pigment Palettes shop in Lobby) */}
        {studioModalTab && (
          <StudioModal
            gameState={gameState}
            initialTab={studioModalTab}
            accentColor={activeTheme.panelCoral}
            onBuyOrEquipVessel={handleBuyOrEquipVessel}
            onBuyOrEquipPalette={handleBuyOrEquipPalette}
            onClose={() => {
              audio.playClick();
              setStudioModalTab(null);
            }}
          />
        )}

        {/* Level Success Celebration Modal (07. Color Vial / Gem Crystallize) */}
        {successState && (
          <LevelSuccessModal
            levelNumber={currentLevel.number}
            levelName={currentLevel.name}
            typeName={activeTheme.name}
            stars={successState.result.stars}
            matchPercent={successState.result.matchPercent}
            hexCode={successState.result.hexCode}
            recipeText={successState.result.recipeText}
            diamondsDelta={successState.diamondsDelta}
            wasStarUpgrade={successState.wasStarUpgrade}
            snapshotDataUrl={successState.result.snapshotDataUrl}
            accentColor={activeTheme.panelCoral}
            folderBg={activeTheme.folderBg}
            isFinalUnlocksChapter={successState.completedAllOfCurrentType}
            hasNextLevel={currentLevel.number < LEVELS_BY_TYPE[gameState.selectedType].length}
            onSaveSnapshot={handleSaveSnapshot}
            onCopyRecipe={handleCopyRecipe}
            onReplay={() => {
              audio.playClick();
              setSuccessState(null);
              setGameplayResetCounter((c) => c + 1);
            }}
            onHome={handleSuccessHome}
            onNext={handleSuccessNext}
          />
        )}

        {/* Level Failed Modal (Shown after Swirl if color does not match) */}
        {failedState && (
          <LevelFailedModal
            levelName={currentLevel.name}
            targetHex={failedState.targetHex}
            mixedHex={failedState.hexCode}
            matchPercent={failedState.matchPercent}
            hint={currentLevel.hint}
            onRetry={() => {
              audio.playClick();
              setFailedState(null);
              setGameplayResetCounter((c) => c + 1);
            }}
            onHome={() => {
              audio.playClick();
              setFailedState(null);
              setScreen('lobby');
            }}
            onShowLevels={() => {
              audio.playClick();
              setFailedState(null);
              setShowLevelListDrawer(true);
            }}
          />
        )}

        {/* In-Game Level List Drawer (opened via Levels button in Level Failed panel) */}
        {showLevelListDrawer && (
          <LevelListDrawer
            gameState={gameState}
            typeId={gameState.selectedType}
            currentLevelNumber={gameState.selectedLevelNumber}
            onSelectLevel={(lvlNum) => {
              audio.playClick();
              setShowLevelListDrawer(false);
              setGameState((prev) => ({...prev, selectedLevelNumber: lvlNum}));
              setGameplayResetCounter((c) => c + 1);
            }}
            onGoToLobby={() => {
              audio.playClick();
              setShowLevelListDrawer(false);
              setScreen('lobby');
            }}
            onClose={() => {
              audio.playClick();
              setShowLevelListDrawer(false);
              setGameplayResetCounter((c) => c + 1);
            }}
          />
        )}

        {/* Chapter / Level-Type Unlock Modal (Insists returning to Lobby after completing all 10 levels) */}
        {chapterUnlockState && (
          <ChapterUnlockModal
            completedType={chapterUnlockState.completedType}
            unlockedType={chapterUnlockState.unlockedType}
            onGoToLobby={handleChapterGoToLobby}
          />
        )}

        {/* Comic Floating Toast */}
        {toastMsg && (
          <div className="pointer-events-none absolute top-14 left-1/2 -translate-x-1/2 z-[70] max-w-[90%] bg-[#141414] text-[#FFE047] px-4 py-2 rounded-2xl border-[2.5px] border-[#FFE047] shadow-[3px_3px_0_#141414] text-xs font-extrabold text-center animate-pop-in">
            {toastMsg}
          </div>
        )}
      </main>
    </div>
  );
}
