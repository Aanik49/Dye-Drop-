import {
  DAILY_LOGIN_REWARDS,
  LEVELS_BY_TYPE,
  LEVEL_TYPE_ORDER,
  PACK_BOOK_BONUS_DIAMONDS,
  generateDailyTasksForDate,
  getNextLevelType,
  getTodayDateString,
} from './data';
import type {
  BackgroundThemeId,
  DailyTaskKind,
  LevelTypeId,
  LiquidFinishId,
  PaletteId,
  RecipeBookEntry,
  RushRunSummary,
  SavedGameState,
  VesselId,
} from './types';

const STORAGE_KEY = 'dye_drop_save_v1';

export function createInitialState(): SavedGameState {
  const today = getTodayDateString();
  return {
    diamonds: 100, // Instruction 7: After installing, user gets 100 diamonds
    soundEnabled: true,
    musicEnabled: true,
    unlockedTypes: ['crimson'], // Instruction 11: Initially unlock all 10 levels of Crimson
    levelProgress: {},
    ownedVessels: ['tumbler'], // Vessel 1 default unlocked & selected
    equippedVessel: 'tumbler',
    ownedPalettes: ['watercolor'], // Pigment 1 default unlocked & selected
    equippedPalette: 'watercolor',
    ownedFinishes: ['classic'],
    equippedFinish: 'classic',
    ownedThemes: ['mint_meadow'],
    equippedTheme: 'mint_meadow',
    rushBestScore: 0,
    rushBestStreak: 0,
    rushBestMatches: 0,
    streakDay: 1,
    lastLoginClaimDate: null,
    dailyTasksDate: today,
    dailyTasks: generateDailyTasksForDate(today),
    selectedType: 'crimson',
    selectedLevelNumber: 1,
    recipeBook: {},
    claimedBookBonuses: [],
  };
}

export function loadSavedState(): SavedGameState {
  const fallback = createInitialState();
  if (typeof window === 'undefined') return fallback;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<SavedGameState>;
    const today = getTodayDateString();

    const dailyTasks =
      parsed.dailyTasksDate === today && Array.isArray(parsed.dailyTasks) && parsed.dailyTasks.length === 2
        ? parsed.dailyTasks
        : generateDailyTasksForDate(today);

    const unlockedTypes: LevelTypeId[] =
      Array.isArray(parsed.unlockedTypes) && parsed.unlockedTypes.length > 0
        ? (parsed.unlockedTypes.filter((t): t is LevelTypeId =>
            LEVEL_TYPE_ORDER.includes(t as LevelTypeId)
          ) as LevelTypeId[])
        : ['crimson'];

    if (!unlockedTypes.includes('crimson')) {
      unlockedTypes.unshift('crimson');
    }

    return {
      ...fallback,
      ...parsed,
      unlockedTypes,
      ownedVessels:
        Array.isArray(parsed.ownedVessels) && parsed.ownedVessels.length > 0
          ? (parsed.ownedVessels as VesselId[])
          : ['tumbler'],
      ownedPalettes:
        Array.isArray(parsed.ownedPalettes) && parsed.ownedPalettes.length > 0
          ? (parsed.ownedPalettes as PaletteId[])
          : ['watercolor'],
      ownedFinishes:
        Array.isArray(parsed.ownedFinishes) && parsed.ownedFinishes.length > 0
          ? (parsed.ownedFinishes as LiquidFinishId[])
          : ['classic'],
      equippedFinish: (parsed.equippedFinish as LiquidFinishId) || 'classic',
      ownedThemes:
        Array.isArray(parsed.ownedThemes) && parsed.ownedThemes.length > 0
          ? (parsed.ownedThemes as BackgroundThemeId[])
          : ['mint_meadow'],
      equippedTheme: (parsed.equippedTheme as BackgroundThemeId) || 'mint_meadow',
      rushBestScore: typeof parsed.rushBestScore === 'number' ? parsed.rushBestScore : 0,
      rushBestStreak: typeof parsed.rushBestStreak === 'number' ? parsed.rushBestStreak : 0,
      rushBestMatches: typeof parsed.rushBestMatches === 'number' ? parsed.rushBestMatches : 0,
      recipeBook: parsed.recipeBook && typeof parsed.recipeBook === 'object' ? parsed.recipeBook : {},
      claimedBookBonuses: Array.isArray(parsed.claimedBookBonuses)
        ? (parsed.claimedBookBonuses.filter((t): t is LevelTypeId =>
            LEVEL_TYPE_ORDER.includes(t as LevelTypeId)
          ) as LevelTypeId[])
        : [],
      dailyTasksDate: today,
      dailyTasks,
    };
  } catch {
    return fallback;
  }
}

export function persistState(state: SavedGameState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors
  }
}

export function isTypeFullyCompleted(state: SavedGameState, typeId: LevelTypeId): boolean {
  const levels = LEVELS_BY_TYPE[typeId];
  return levels.every((lvl) => state.levelProgress[lvl.id]?.completed === true);
}

export function countTypeCompleted(state: SavedGameState, typeId: LevelTypeId): number {
  const levels = LEVELS_BY_TYPE[typeId];
  return levels.filter((lvl) => state.levelProgress[lvl.id]?.completed === true).length;
}

export function countRecipeBookPackEntries(state: SavedGameState, typeId: LevelTypeId): number {
  const levels = LEVELS_BY_TYPE[typeId];
  return levels.filter(
    (lvl) => Boolean(state.recipeBook[lvl.id]) || state.levelProgress[lvl.id]?.completed === true
  ).length;
}

export function hasClaimableRecipeBookBonus(state: SavedGameState): boolean {
  return LEVEL_TYPE_ORDER.some(
    (typeId) =>
      countRecipeBookPackEntries(state, typeId) >= 10 &&
      !state.claimedBookBonuses.includes(typeId)
  );
}

export function claimRecipeBookBonus(
  state: SavedGameState,
  typeId: LevelTypeId
): {nextState: SavedGameState; awarded: number} {
  if (
    countRecipeBookPackEntries(state, typeId) < 10 ||
    state.claimedBookBonuses.includes(typeId)
  ) {
    return {nextState: state, awarded: 0};
  }
  const awarded = PACK_BOOK_BONUS_DIAMONDS;
  return {
    nextState: {
      ...state,
      diamonds: state.diamonds + awarded,
      claimedBookBonuses: [...state.claimedBookBonuses, typeId],
    },
    awarded,
  };
}

export function canClaimDailyLogin(state: SavedGameState): boolean {
  const today = getTodayDateString();
  return state.lastLoginClaimDate !== today;
}

export function getActiveStreakDayToClaim(state: SavedGameState): number {
  const today = getTodayDateString();
  if (!state.lastLoginClaimDate) return 1;
  if (state.lastLoginClaimDate === today) return state.streakDay;

  const last = new Date(`${state.lastLoginClaimDate}T00:00:00`);
  const now = new Date(`${today}T00:00:00`);
  const diffDays = Math.round((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 1) {
    return state.streakDay >= 7 ? 1 : state.streakDay + 1;
  }
  return 1;
}

export function claimDailyLoginReward(state: SavedGameState): {
  nextState: SavedGameState;
  awarded: number;
  dayClaimed: number;
} {
  if (!canClaimDailyLogin(state)) {
    return {nextState: state, awarded: 0, dayClaimed: state.streakDay};
  }
  const today = getTodayDateString();
  const dayClaimed = getActiveStreakDayToClaim(state);
  const awarded = DAILY_LOGIN_REWARDS[Math.max(0, Math.min(6, dayClaimed - 1))];

  const nextState: SavedGameState = {
    ...state,
    diamonds: state.diamonds + awarded,
    streakDay: dayClaimed,
    lastLoginClaimDate: today,
  };
  return {nextState, awarded, dayClaimed};
}

export function incrementDailyTaskProgress(
  state: SavedGameState,
  kind: DailyTaskKind,
  amount = 1
): SavedGameState {
  const today = getTodayDateString();
  const baseTasks =
    state.dailyTasksDate === today ? state.dailyTasks : generateDailyTasksForDate(today);

  const updated = baseTasks.map((task) => {
    if (task.kind !== kind || task.claimed) return task;
    return {
      ...task,
      progress: Math.min(task.target, task.progress + amount),
    };
  });

  return {
    ...state,
    dailyTasksDate: today,
    dailyTasks: updated,
  };
}

export function claimDailyTask(
  state: SavedGameState,
  taskId: string
): {nextState: SavedGameState; awarded: number} {
  let awarded = 0;
  const updatedTasks = state.dailyTasks.map((task) => {
    if (task.id === taskId && !task.claimed && task.progress >= task.target) {
      awarded = task.reward; // 10 diamonds
      return {...task, claimed: true};
    }
    return task;
  });

  if (awarded === 0) return {nextState: state, awarded: 0};

  return {
    nextState: {
      ...state,
      diamonds: state.diamonds + awarded,
      dailyTasks: updatedTasks,
    },
    awarded,
  };
}

export function recordLevelCompletion(
  state: SavedGameState,
  typeId: LevelTypeId,
  levelId: string,
  stars: number,
  recipeBookEntry?: RecipeBookEntry
): {
  nextState: SavedGameState;
  diamondsDelta: number;
  wasStarUpgrade: boolean;
  newlyUnlockedType: LevelTypeId | null;
  completedAllOfCurrentType: boolean;
} {
  const prev = state.levelProgress[levelId] || {
    completed: false,
    bestStars: 0,
    diamondsEarned: 0,
  };

  const targetDiamonds = stars >= 3 ? 10 : stars >= 1 ? 5 : 0;
  const diamondsDelta = Math.max(0, targetDiamonds - prev.diamondsEarned);
  const wasStarUpgrade = prev.diamondsEarned > 0 && diamondsDelta > 0;
  const starsGained = Math.max(0, stars - prev.bestStars);

  const wasTypeAlreadyDone = isTypeFullyCompleted(state, typeId);

  const prevBookEntry = state.recipeBook[levelId];
  const nextBook =
    recipeBookEntry && (!prevBookEntry || stars >= prevBookEntry.stars)
      ? {
          ...state.recipeBook,
          [levelId]: {
            ...recipeBookEntry,
            stars: Math.max(prevBookEntry?.stars || 0, stars),
          },
        }
      : state.recipeBook;

  let nextState: SavedGameState = {
    ...state,
    diamonds: state.diamonds + diamondsDelta,
    recipeBook: nextBook,
    levelProgress: {
      ...state.levelProgress,
      [levelId]: {
        completed: true,
        bestStars: Math.max(prev.bestStars, stars),
        diamondsEarned: Math.max(prev.diamondsEarned, targetDiamonds),
      },
    },
  };

  nextState = incrementDailyTaskProgress(nextState, 'complete_levels', 1);
  if (stars >= 3) {
    nextState = incrementDailyTaskProgress(nextState, 'perfect_blends', 1);
  }
  if (stars > 0) {
    nextState = incrementDailyTaskProgress(nextState, 'earn_stars', Math.max(starsGained, stars));
  }

  const isTypeNowDone = isTypeFullyCompleted(nextState, typeId);
  let newlyUnlockedType: LevelTypeId | null = null;
  const completedAllOfCurrentType = !wasTypeAlreadyDone && isTypeNowDone;

  if (isTypeNowDone) {
    const candidateNext = getNextLevelType(typeId);
    if (candidateNext && !nextState.unlockedTypes.includes(candidateNext)) {
      newlyUnlockedType = candidateNext;
      nextState = {
        ...nextState,
        unlockedTypes: [...nextState.unlockedTypes, candidateNext],
      };
    }
  }

  return {
    nextState,
    diamondsDelta,
    wasStarUpgrade,
    newlyUnlockedType,
    completedAllOfCurrentType,
  };
}

export function recordRushResult(
  state: SavedGameState,
  summary: RushRunSummary
): {
  nextState: SavedGameState;
  diamondsEarned: number;
  isNewBestScore: boolean;
  isNewBestStreak: boolean;
} {
  const isNewBestScore = summary.score > state.rushBestScore && summary.score > 0;
  const isNewBestStreak = summary.bestStreak > state.rushBestStreak && summary.bestStreak > 0;
  const streakBonuses = Math.floor(summary.bestStreak / 3) * 5;
  const diamondsEarned = Math.min(45, summary.matches * 2 + streakBonuses);

  const nextState: SavedGameState = {
    ...state,
    diamonds: state.diamonds + diamondsEarned,
    rushBestScore: Math.max(state.rushBestScore, summary.score),
    rushBestStreak: Math.max(state.rushBestStreak, summary.bestStreak),
    rushBestMatches: Math.max(state.rushBestMatches, summary.matches),
  };

  return {
    nextState,
    diamondsEarned,
    isNewBestScore,
    isNewBestStreak,
  };
}
