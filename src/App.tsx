import {useCallback, useEffect, useState} from 'react';
import {ChapterUnlockModal} from './components/ChapterUnlockModal';
import {DailyStreakModal} from './components/DailyStreakModal';
import {DailyTasksModal} from './components/DailyTasksModal';
import {GameplayScreen, type GameplayResultPayload} from './components/GameplayScreen';
import {LevelFailedModal} from './components/LevelFailedModal';
import {LevelListDrawer} from './components/LevelListDrawer';
import {LevelSuccessModal} from './components/LevelSuccessModal';
import {LobbyScreen} from './components/LobbyScreen';
import {RecipeBookModal} from './components/RecipeBookModal';
import {RushSummaryModal} from './components/RushSummaryModal';
import {SplashScreen} from './components/SplashScreen';
import {StudioModal} from './components/StudioModal';
import {TimedRushScreen} from './components/TimedRushScreen';
import {audio} from './game/audio';
import {
  LEVELS_BY_TYPE,
  LEVEL_TYPES,
  LEVEL_TYPE_ORDER,
  getBackgroundThemeById,
  getLevelDef,
  getLiquidFinishById,
  getPaletteById,
  getVesselById,
} from './game/data';
import {
  claimDailyLoginReward,
  claimDailyTask,
  claimRecipeBookBonus,
  incrementDailyTaskProgress,
  loadSavedState,
  persistState,
  recordLevelCompletion,
  recordRushResult,
} from './game/storage';
import type {
  BackgroundThemeId,
  LevelTypeId,
  LiquidFinishId,
  PaletteId,
  RecipeBookEntry,
  RushRunSummary,
  SavedGameState,
  ScreenMode,
  StudioTabId,
  VesselId,
} from './game/types';
import {usePWAInstall} from './hooks/usePWAInstall';

interface ActiveSuccessState {
  result: GameplayResultPayload;
  diamondsDelta: number;
  wasStarUpgrade: boolean;
  newlyUnlockedType: LevelTypeId | null;
  completedAllOfCurrentType: boolean;
}

interface ActiveRushSummaryState {
  summary: RushRunSummary;
  diamondsEarned: number;
  isNewBestScore: boolean;
}

export default function App() {
  const [screen, setScreen] = useState<ScreenMode>('splash');
  const [gameState, setGameState] = useState<SavedGameState>(() => loadSavedState());

  // Modals & overlays
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [showDailyTasksModal, setShowDailyTasksModal] = useState(false);
  const [studioModalTab, setStudioModalTab] = useState<StudioTabId | null>(null);
  const [showRecipeBook, setShowRecipeBook] = useState(false);
  const [successState, setSuccessState] = useState<ActiveSuccessState | null>(null);
  const [failedState, setFailedState] = useState<GameplayResultPayload | null>(null);
  const [showLevelListDrawer, setShowLevelListDrawer] = useState(false);
  const [chapterUnlockState, setChapterUnlockState] = useState<{
    completedType: LevelTypeId;
    unlockedType: LevelTypeId | null;
  } | null>(null);
  const [gameplayResetCounter, setGameplayResetCounter] = useState(0);
  const [rushRunCounter, setRushRunCounter] = useState(0);
  const [rushSummaryState, setRushSummaryState] = useState<ActiveRushSummaryState | null>(null);
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

  const handleLockedTap = (typeId: LevelTypeId) => {
    audio.playLocked();
    const idx = LEVEL_TYPE_ORDER.indexOf(typeId);
    const prevType = idx > 0 ? LEVEL_TYPES[LEVEL_TYPE_ORDER[idx - 1]].name : 'Classic';
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

  const handlePlayRushFromLobby = () => {
    audio.unlock();
    audio.playClick();
    setRushSummaryState(null);
    setRushRunCounter((c) => c + 1);
    setScreen('rush');
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

  const handleClaimRecipeBookBonus = (typeId: LevelTypeId) => {
    const {nextState, awarded} = claimRecipeBookBonus(gameState, typeId);
    if (awarded > 0) {
      audio.playChapterUnlock();
      setGameState(nextState);
      showToast(`${LEVEL_TYPES[typeId].name} Recipe Book Complete! +${awarded} Diamonds!`);
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

  const handleBuyOrEquipFinish = (finishId: LiquidFinishId) => {
    const finish = getLiquidFinishById(finishId);
    if (gameState.ownedFinishes.includes(finishId)) {
      audio.playClick();
      setGameState((prev) => ({...prev, equippedFinish: finishId}));
      showToast(`Equipped ${finish.name}!`);
      return;
    }
    if (gameState.diamonds < finish.price) {
      audio.playLocked();
      showToast(`Need ${finish.price - gameState.diamonds} more Diamonds!`);
      return;
    }
    audio.playBuy();
    setGameState((prev) => ({
      ...prev,
      diamonds: prev.diamonds - finish.price,
      ownedFinishes: [...prev.ownedFinishes, finishId],
      equippedFinish: finishId,
    }));
    showToast(`Purchased & equipped ${finish.name}!`);
  };

  const handleBuyOrEquipTheme = (themeId: BackgroundThemeId) => {
    const bgTheme = getBackgroundThemeById(themeId);
    if (gameState.ownedThemes.includes(themeId)) {
      audio.playClick();
      setGameState((prev) => ({...prev, equippedTheme: themeId}));
      showToast(`Switched scene to ${bgTheme.name}!`);
      return;
    }
    if (gameState.diamonds < bgTheme.price) {
      audio.playLocked();
      showToast(`Need ${bgTheme.price - gameState.diamonds} more Diamonds!`);
      return;
    }
    audio.playBuy();
    setGameState((prev) => ({
      ...prev,
      diamonds: prev.diamonds - bgTheme.price,
      ownedThemes: [...prev.ownedThemes, themeId],
      equippedTheme: themeId,
    }));
    showToast(`Unlocked & activated ${bgTheme.name}!`);
  };

  const handleDropAdded = useCallback(() => {
    setGameState((prev) => incrementDailyTaskProgress(prev, 'use_drops', 1));
  }, []);

  const handleSwirlAction = useCallback(() => {
    setGameState((prev) => incrementDailyTaskProgress(prev, 'swirl_glasses', 1));
  }, []);

  const handleRushPerfectBlend = useCallback(() => {
    setGameState((prev) => incrementDailyTaskProgress(prev, 'perfect_blends', 1));
  }, []);

  const handleRushComplete = useCallback(
    (summary: RushRunSummary) => {
      const outcome = recordRushResult(gameState, summary);
      setGameState(outcome.nextState);
      setRushSummaryState({
        summary,
        diamondsEarned: outcome.diamondsEarned,
        isNewBestScore: outcome.isNewBestScore,
      });
    },
    [gameState]
  );

  const handleGameplayResult = useCallback(
    (result: GameplayResultPayload) => {
      if (!result.passed) {
        setFailedState(result);
        return;
      }

      const lvl = getLevelDef(gameState.selectedType, gameState.selectedLevelNumber);
      const bookEntry: RecipeBookEntry = {
        levelId: lvl.id,
        typeId: gameState.selectedType,
        levelNumber: lvl.number,
        levelName: lvl.name,
        isLayered: result.isLayered,
        hexCode: result.hexCode,
        topHexCode: result.topHexCode,
        bottomHexCode: result.bottomHexCode,
        recipeText: result.recipeText,
        drops: result.dropsUsed,
        bottomDrops: result.bottomDropsUsed,
        topDrops: result.topDropsUsed,
        stars: result.stars,
        matchPercent: result.matchPercent,
        vesselId: gameState.equippedVessel,
        paletteId: gameState.equippedPalette,
        finishId: gameState.equippedFinish,
        solvedAt: new Date().toISOString(),
      };

      const outcome = recordLevelCompletion(
        gameState,
        gameState.selectedType,
        lvl.id,
        result.stars,
        bookEntry
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
    const res = successState.result;
    const hexTag =
      res.isLayered && res.topHexCode && res.bottomHexCode
        ? `${res.topHexCode.replace('#', '')}-${res.bottomHexCode.replace('#', '')}`
        : res.hexCode.replace('#', '');
    const link = document.createElement('a');
    link.download = `dye-drop-${lvl.name.toLowerCase().replace(/\s+/g, '-')}-${hexTag}.png`;
    link.href = res.snapshotDataUrl;
    link.click();
    audio.playClick();
    setGameState((prev) => incrementDailyTaskProgress(prev, 'save_snapshot', 1));
    showToast(
      res.isLayered && res.topHexCode && res.bottomHexCode
        ? `Snapshot saved (${res.topHexCode} / ${res.bottomHexCode})!`
        : `Snapshot saved with code ${res.hexCode}!`
    );
  };

  const handleCopyRecipe = () => {
    if (!successState) return;
    const lvl = getLevelDef(gameState.selectedType, gameState.selectedLevelNumber);
    const res = successState.result;
    const hexPart =
      res.isLayered && res.topHexCode && res.bottomHexCode
        ? `Top ${res.topHexCode} / Bottom ${res.bottomHexCode}`
        : res.hexCode;
    const text = `Dye Drop — ${lvl.name} (${hexPart}) | Recipe: ${res.recipeText}`;
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
    <div className="w-full h-full flex items-center justify-center bg-[#0E3B3A] sm:p-3 overflow-hidden">
      {/* Responsive Mobile Game Shell (Full-bleed on phones, sleek portrait frame on desktop) */}
      <main className="relative w-full h-full sm:max-w-[436px] sm:max-h-[900px] sm:rounded-[38px] sm:border-[5px] sm:border-[#78E6D6]/35 sm:shadow-[0_28px_72px_rgba(4,28,30,0.68)] overflow-hidden flex flex-col">
        {screen === 'splash' && (
          <SplashScreen themeId={gameState.equippedTheme} onComplete={handleEnterFromSplash} />
        )}

        {screen === 'lobby' && (
          <LobbyScreen
            gameState={gameState}
            onSelectType={handleSelectType}
            onOpenLevels={(typeId?: LevelTypeId) => {
              audio.playClick();
              if (typeId) {
                setGameState((prev) => ({
                  ...prev,
                  selectedType: typeId,
                  selectedLevelNumber:
                    prev.selectedType === typeId ? prev.selectedLevelNumber : 1,
                }));
              }
              setShowLevelListDrawer(true);
            }}
            onPlay={handlePlayFromLobby}
            onPlayRush={handlePlayRushFromLobby}
            onToggleSound={handleToggleSound}
            onToggleMusic={handleToggleMusic}
            onOpenStreak={() => {
              audio.playClick();
              setShowStreakModal(true);
            }}
            onOpenDailyTasks={() => {
              audio.playClick();
              setShowDailyTasksModal(true);
            }}
            onOpenStudio={(tab = 'vessels') => {
              audio.playClick();
              setStudioModalTab(tab);
            }}
            onOpenRecipeBook={() => {
              audio.playClick();
              setShowRecipeBook(true);
            }}
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
            onOpenLevels={() => {
              setShowLevelListDrawer(true);
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

        {screen === 'rush' && (
          <TimedRushScreen
            gameState={gameState}
            runCounter={rushRunCounter}
            onBackToLobby={() => {
              audio.playClick();
              setRushSummaryState(null);
              setScreen('lobby');
            }}
            onToggleSound={handleToggleSound}
            onToggleMusic={handleToggleMusic}
            onDropAdded={handleDropAdded}
            onSwirlAction={handleSwirlAction}
            onPerfectBlend={handleRushPerfectBlend}
            onComplete={handleRushComplete}
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

        {/* Daily Tasks Panel (opened via Daily Task icon button in Lobby) */}
        {showDailyTasksModal && (
          <DailyTasksModal
            gameState={gameState}
            accentColor={activeTheme.panelCoral}
            onClaimTask={handleClaimDailyTask}
            onClose={() => {
              audio.playClick();
              setShowDailyTasksModal(false);
            }}
          />
        )}

        {/* Studio Collection Modal (Vessels, Pigment Palettes, Liquid Finishes & Themes) */}
        {studioModalTab && (
          <StudioModal
            gameState={gameState}
            initialTab={studioModalTab}
            accentColor={activeTheme.panelCoral}
            onBuyOrEquipVessel={handleBuyOrEquipVessel}
            onBuyOrEquipPalette={handleBuyOrEquipPalette}
            onBuyOrEquipFinish={handleBuyOrEquipFinish}
            onBuyOrEquipTheme={handleBuyOrEquipTheme}
            onClose={() => {
              audio.playClick();
              setStudioModalTab(null);
            }}
          />
        )}

        {/* 60-Second Timed Rush Summary Modal */}
        {rushSummaryState && (
          <RushSummaryModal
            summary={rushSummaryState.summary}
            diamondsEarned={rushSummaryState.diamondsEarned}
            isNewBestScore={rushSummaryState.isNewBestScore}
            bestScore={gameState.rushBestScore}
            bestStreak={gameState.rushBestStreak}
            onPlayAgain={() => {
              audio.playClick();
              setRushSummaryState(null);
              setRushRunCounter((c) => c + 1);
            }}
            onLobby={() => {
              audio.playClick();
              setRushSummaryState(null);
              setScreen('lobby');
            }}
          />
        )}

        {/* Color Recipe Book Gallery Modal */}
        {showRecipeBook && (
          <RecipeBookModal
            gameState={gameState}
            initialType={gameState.selectedType}
            onClaimPackBonus={handleClaimRecipeBookBonus}
            onSnapshotDownloaded={(hexLabel) => {
              setGameState((prev) => incrementDailyTaskProgress(prev, 'save_snapshot', 1));
              showToast(`Saved Polaroid (${hexLabel})!`);
            }}
            onToast={showToast}
            onClose={() => {
              audio.playClick();
              setShowRecipeBook(false);
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
            isLayered={successState.result.isLayered}
            topHexCode={successState.result.topHexCode}
            bottomHexCode={successState.result.bottomHexCode}
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
            isLayered={failedState.isLayered}
            targetTopHex={failedState.targetTopHex}
            targetBottomHex={failedState.targetBottomHex}
            mixedTopHex={failedState.topHexCode}
            mixedBottomHex={failedState.bottomHexCode}
            overMixedFail={failedState.overMixedFail}
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

        {/* In-Game / Lobby Level List Drawer */}
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
              if (screen === 'lobby') {
                setScreen('gameplay');
              }
            }}
            onGoToLobby={() => {
              audio.playClick();
              setShowLevelListDrawer(false);
              setScreen('lobby');
            }}
            onClose={() => {
              audio.playClick();
              setShowLevelListDrawer(false);
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

        {/* Cartoon Pastel Floating Toast */}
        {toastMsg && (
          <div className="pointer-events-none absolute top-14 left-1/2 -translate-x-1/2 z-[70] max-w-[90%] bg-[#144D5A] text-white px-4 py-2 rounded-full border-2 border-[#7CEAD9] shadow-[0_10px_24px_rgba(9,44,50,0.4)] text-xs font-bold text-center animate-pop-in">
            {toastMsg}
          </div>
        )}
      </main>
    </div>
  );
}
