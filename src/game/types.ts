export type DyeCode = 'R' | 'Y' | 'B';

export type LevelTypeId = 'crimson' | 'marigold' | 'forest' | 'ocean' | 'velvet' | 'shadow';

export type VesselId = 'tumbler' | 'flask' | 'highball' | 'lotus' | 'chalice' | 'amphora';

export type PaletteId = 'watercolor' | 'pastel' | 'neon' | 'royal';

export type ScreenMode = 'splash' | 'lobby' | 'gameplay';

export interface LevelTypeTheme {
  id: LevelTypeId;
  name: string;
  order: number;
  tabColor: string;
  tabTextColor: string;
  folderBg: string;
  pageBg: string;
  halftoneDot: string;
  panelCoral: string;
  playCtaBg: string;
  gameplayStageBg: string;
  gameplayAccent: string;
  tilePalette: [string, string, string, string];
  tagline: string;
}

export interface LevelDef {
  id: string; // e.g., "crimson-1"
  typeId: LevelTypeId;
  number: number; // 1..10
  name: string;
  recipe: DyeCode[];
  maxDrops: number;
  hint: string;
}

export interface PaletteDef {
  id: PaletteId;
  name: string;
  desc: string;
  price: number; // 0 for default
  names: Record<DyeCode, string>;
  R: [number, number, number];
  Y: [number, number, number];
  B: [number, number, number];
  RY: [number, number, number];
  YB: [number, number, number];
  RB: [number, number, number];
  RYB: [number, number, number];
}

export interface VesselDef {
  id: VesselId;
  name: string;
  desc: string;
  price: number; // 0 for default
}

export type DailyTaskKind =
  | 'complete_levels'
  | 'perfect_blends'
  | 'use_drops'
  | 'swirl_glasses'
  | 'earn_stars'
  | 'save_snapshot';

export interface DailyTask {
  id: string;
  kind: DailyTaskKind;
  title: string;
  target: number;
  progress: number;
  reward: number; // always 10 diamonds
  claimed: boolean;
  icon: 'chest' | 'diamond';
}

export interface LevelProgress {
  completed: boolean;
  bestStars: number; // 0..3
  diamondsEarned: number; // 0, 5, or 10
}

export interface SavedGameState {
  diamonds: number;
  soundEnabled: boolean;
  musicEnabled: boolean;
  unlockedTypes: LevelTypeId[];
  levelProgress: Record<string, LevelProgress>;
  ownedVessels: VesselId[];
  equippedVessel: VesselId;
  ownedPalettes: PaletteId[];
  equippedPalette: PaletteId;
  streakDay: number; // 1..7
  lastLoginClaimDate: string | null; // YYYY-MM-DD
  dailyTasksDate: string; // YYYY-MM-DD
  dailyTasks: DailyTask[];
  selectedType: LevelTypeId;
  selectedLevelNumber: number;
}
