import type {
  DailyTask,
  LevelDef,
  LevelTypeId,
  LevelTypeTheme,
  PaletteDef,
  PaletteId,
  VesselDef,
  VesselId,
} from './types';

export const APP_ICON_URL = '/src/assets/images/dye_drop_app_icon_1795363014968.jpg';

export const DAILY_LOGIN_REWARDS = [5, 10, 15, 20, 25, 30, 50] as const;

export const LEVEL_TYPE_ORDER: LevelTypeId[] = [
  'crimson',
  'marigold',
  'forest',
  'ocean',
  'velvet',
  'shadow',
];

export const LEVEL_TYPES: Record<LevelTypeId, LevelTypeTheme> = {
  crimson: {
    id: 'crimson',
    name: 'Crimson',
    order: 0,
    tabColor: '#E13863',
    tabTextColor: '#141414',
    folderBg: '#FF8A9E',
    pageBg: '#FFF3F0',
    halftoneDot: 'rgba(225, 56, 99, 0.25)',
    panelCoral: '#FF7D78',
    playCtaBg: '#B8FF00',
    gameplayStageBg: '#FFE9E6',
    gameplayAccent: '#E13863',
    tilePalette: ['#4CE4F2', '#FF9248', '#52DC89', '#FF6FB7'],
    tagline: 'Warm berry, citrus & ruby studio mixes',
  },
  marigold: {
    id: 'marigold',
    name: 'Marigold',
    order: 1,
    tabColor: '#F5C42F',
    tabTextColor: '#141414',
    folderBg: '#FFF066',
    pageBg: '#FFF9DF',
    halftoneDot: 'rgba(245, 184, 52, 0.36)',
    panelCoral: '#FF857A',
    playCtaBg: '#B8FF00',
    gameplayStageBg: '#FFF5CA',
    gameplayAccent: '#F5A623',
    tilePalette: ['#4CE4F2', '#FF9248', '#52DC89', '#FF6FB7'],
    tagline: 'Sunlit golden honey & tropical nectar tones',
  },
  forest: {
    id: 'forest',
    name: 'Forest',
    order: 2,
    tabColor: '#359B62',
    tabTextColor: '#141414',
    folderBg: '#8CEB9F',
    pageBg: '#EFFCEF',
    halftoneDot: 'rgba(53, 155, 98, 0.27)',
    panelCoral: '#63D494',
    playCtaBg: '#FFE047',
    gameplayStageBg: '#E1F7E3',
    gameplayAccent: '#2B8A56',
    tilePalette: ['#FFE047', '#4CE4F2', '#FF9B6A', '#A8E05F'],
    tagline: 'Botanical fern, moss & jade infusions',
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean',
    order: 3,
    tabColor: '#3B8CE2',
    tabTextColor: '#141414',
    folderBg: '#8BD3FF',
    pageBg: '#EEF8FF',
    halftoneDot: 'rgba(59, 140, 226, 0.26)',
    panelCoral: '#66B7FF',
    playCtaBg: '#B8FF00',
    gameplayStageBg: '#DFF1FF',
    gameplayAccent: '#2678D3',
    tilePalette: ['#FFE047', '#FF857A', '#5CE1E6', '#A78BFA'],
    tagline: 'Deep lagoon, reef & tidal azure blends',
  },
  velvet: {
    id: 'velvet',
    name: 'Velvet',
    order: 4,
    tabColor: '#9C6CE0',
    tabTextColor: '#141414',
    folderBg: '#CFA8FF',
    pageBg: '#F6F0FF',
    halftoneDot: 'rgba(156, 108, 224, 0.26)',
    panelCoral: '#C18BFF',
    playCtaBg: '#B8FF00',
    gameplayStageBg: '#EDE2FF',
    gameplayAccent: '#8250D1',
    tilePalette: ['#FFE047', '#FF7CA8', '#4CE4F2', '#7CE6A2'],
    tagline: 'Plum, orchid & royal twilight pigments',
  },
  shadow: {
    id: 'shadow',
    name: 'Shadow',
    order: 5,
    tabColor: '#7A7280',
    tabTextColor: '#141414',
    folderBg: '#C5BFC9',
    pageBg: '#F4F1F5',
    halftoneDot: 'rgba(107, 98, 114, 0.26)',
    panelCoral: '#A99DB3',
    playCtaBg: '#FFE047',
    gameplayStageBg: '#E9E4ED',
    gameplayAccent: '#585060',
    tilePalette: ['#FFE047', '#FF857A', '#5CE1E6', '#B8FF00'],
    tagline: 'Master alchemist earthen & dusk formulas',
  },
};

// 60 Handcrafted Levels (10 per Level Type)
export const LEVELS_BY_TYPE: Record<LevelTypeId, LevelDef[]> = {
  crimson: [
    {id: 'crimson-1', typeId: 'crimson', number: 1, name: 'Pure Ruby', recipe: ['R'], maxDrops: 2, hint: '1 drop · Bright red'},
    {id: 'crimson-2', typeId: 'crimson', number: 2, name: 'Sunset Tangerine', recipe: ['R', 'Y'], maxDrops: 3, hint: '2 drops · Warm citrus'},
    {id: 'crimson-3', typeId: 'crimson', number: 3, name: 'Royal Berry', recipe: ['R', 'B'], maxDrops: 3, hint: '2 drops · Rich plum'},
    {id: 'crimson-4', typeId: 'crimson', number: 4, name: 'Coral Peach', recipe: ['R', 'R', 'Y'], maxDrops: 4, hint: '3 drops · Extra red warmth'},
    {id: 'crimson-5', typeId: 'crimson', number: 5, name: 'Crimson Mulberry', recipe: ['R', 'R', 'B'], maxDrops: 4, hint: '3 drops · Deep wine tint'},
    {id: 'crimson-6', typeId: 'crimson', number: 6, name: 'Meadow Mint', recipe: ['Y', 'B'], maxDrops: 3, hint: '2 drops · Cool leaf green'},
    {id: 'crimson-7', typeId: 'crimson', number: 7, name: 'Spiced Apricot', recipe: ['R', 'Y', 'Y'], maxDrops: 4, hint: '3 drops · Golden orange'},
    {id: 'crimson-8', typeId: 'crimson', number: 8, name: 'Cinnamon Bark', recipe: ['R', 'R', 'Y', 'B'], maxDrops: 5, hint: '4 drops · Warm earthy red'},
    {id: 'crimson-9', typeId: 'crimson', number: 9, name: 'Garnet Velvet', recipe: ['R', 'R', 'R', 'B'], maxDrops: 5, hint: '4 drops · Intense berry'},
    {id: 'crimson-10', typeId: 'crimson', number: 10, name: 'Scarlet Flame', recipe: ['R', 'R', 'R', 'Y'], maxDrops: 5, hint: '4 drops · Fiery finale'},
  ],
  marigold: [
    {id: 'marigold-1', typeId: 'marigold', number: 1, name: 'Lemon Sun', recipe: ['Y'], maxDrops: 2, hint: '1 drop · Pure sunshine'},
    {id: 'marigold-2', typeId: 'marigold', number: 2, name: 'Honey Marigold', recipe: ['R', 'Y', 'Y'], maxDrops: 4, hint: '3 drops · Sunny gold'},
    {id: 'marigold-3', typeId: 'marigold', number: 3, name: 'Lime Zest', recipe: ['Y', 'Y', 'B'], maxDrops: 4, hint: '3 drops · Tangy citrus'},
    {id: 'marigold-4', typeId: 'marigold', number: 4, name: 'Mango Sorbet', recipe: ['R', 'Y', 'Y', 'Y'], maxDrops: 5, hint: '4 drops · Sweet tropical'},
    {id: 'marigold-5', typeId: 'marigold', number: 5, name: 'Chartreuse Pop', recipe: ['Y', 'Y', 'Y', 'B'], maxDrops: 5, hint: '4 drops · Electric pear'},
    {id: 'marigold-6', typeId: 'marigold', number: 6, name: 'Saffron Glow', recipe: ['R', 'R', 'Y', 'Y'], maxDrops: 5, hint: '4 drops · Balanced amber'},
    {id: 'marigold-7', typeId: 'marigold', number: 7, name: 'Ochre Harvest', recipe: ['R', 'Y', 'Y', 'B'], maxDrops: 5, hint: '4 drops · Golden moss'},
    {id: 'marigold-8', typeId: 'marigold', number: 8, name: 'Amber Nectar', recipe: ['R', 'R', 'Y', 'Y', 'Y'], maxDrops: 6, hint: '5 drops · Deep golden orange'},
    {id: 'marigold-9', typeId: 'marigold', number: 9, name: 'Olive Gold', recipe: ['R', 'Y', 'Y', 'Y', 'B'], maxDrops: 6, hint: '5 drops · Warm sunlit olive'},
    {id: 'marigold-10', typeId: 'marigold', number: 10, name: 'Solar Crown', recipe: ['R', 'Y', 'Y', 'B', 'Y'], maxDrops: 6, hint: '5 drops · Radiant finale'},
  ],
  forest: [
    {id: 'forest-1', typeId: 'forest', number: 1, name: 'Spring Leaf', recipe: ['Y', 'B'], maxDrops: 3, hint: '2 drops · Fresh balance'},
    {id: 'forest-2', typeId: 'forest', number: 2, name: 'Clover Dew', recipe: ['Y', 'Y', 'B'], maxDrops: 4, hint: '3 drops · Bright meadow'},
    {id: 'forest-3', typeId: 'forest', number: 3, name: 'Pine Needle', recipe: ['Y', 'B', 'B'], maxDrops: 4, hint: '3 drops · Cool evergreen'},
    {id: 'forest-4', typeId: 'forest', number: 4, name: 'Forest Moss', recipe: ['R', 'Y', 'Y', 'B'], maxDrops: 5, hint: '4 drops · Earthy woodland'},
    {id: 'forest-5', typeId: 'forest', number: 5, name: 'Jade Canopy', recipe: ['Y', 'Y', 'B', 'B'], maxDrops: 5, hint: '4 drops · Rich emerald'},
    {id: 'forest-6', typeId: 'forest', number: 6, name: 'Spruce Mist', recipe: ['Y', 'B', 'B', 'B'], maxDrops: 5, hint: '4 drops · Deep teal pine'},
    {id: 'forest-7', typeId: 'forest', number: 7, name: 'Sage Herb', recipe: ['R', 'Y', 'B', 'B'], maxDrops: 5, hint: '4 drops · Muted coastal sage'},
    {id: 'forest-8', typeId: 'forest', number: 8, name: 'Fern Hollow', recipe: ['Y', 'Y', 'Y', 'B', 'B'], maxDrops: 6, hint: '5 drops · Lush sunlit fern'},
    {id: 'forest-9', typeId: 'forest', number: 9, name: 'Cedar Lichen', recipe: ['R', 'Y', 'Y', 'B', 'B'], maxDrops: 6, hint: '5 drops · Deep mossy green'},
    {id: 'forest-10', typeId: 'forest', number: 10, name: 'Emerald Heart', recipe: ['Y', 'Y', 'B', 'B', 'B'], maxDrops: 6, hint: '5 drops · Jewel forest finale'},
  ],
  ocean: [
    {id: 'ocean-1', typeId: 'ocean', number: 1, name: 'Pure Cobalt', recipe: ['B'], maxDrops: 2, hint: '1 drop · Clear sea blue'},
    {id: 'ocean-2', typeId: 'ocean', number: 2, name: 'Seafoam Reef', recipe: ['Y', 'B', 'B'], maxDrops: 4, hint: '3 drops · Cool turquoise'},
    {id: 'ocean-3', typeId: 'ocean', number: 3, name: 'Indigo Tide', recipe: ['R', 'B', 'B'], maxDrops: 4, hint: '3 drops · Twilight wave'},
    {id: 'ocean-4', typeId: 'ocean', number: 4, name: 'Lagoon Teal', recipe: ['Y', 'B', 'B', 'B'], maxDrops: 5, hint: '4 drops · Deep aqua'},
    {id: 'ocean-5', typeId: 'ocean', number: 5, name: 'Sapphire Swell', recipe: ['R', 'B', 'B', 'B'], maxDrops: 5, hint: '4 drops · Midnight blue'},
    {id: 'ocean-6', typeId: 'ocean', number: 6, name: 'Storm Surf', recipe: ['R', 'Y', 'B', 'B'], maxDrops: 5, hint: '4 drops · Misty blue-grey'},
    {id: 'ocean-7', typeId: 'ocean', number: 7, name: 'Coral Atoll', recipe: ['Y', 'Y', 'B', 'B', 'B'], maxDrops: 6, hint: '5 drops · Tropical bay'},
    {id: 'ocean-8', typeId: 'ocean', number: 8, name: 'Abyssal Slate', recipe: ['R', 'Y', 'B', 'B', 'B'], maxDrops: 6, hint: '5 drops · Deep ocean floor'},
    {id: 'ocean-9', typeId: 'ocean', number: 9, name: 'Marina Violet', recipe: ['R', 'R', 'B', 'B', 'B'], maxDrops: 6, hint: '5 drops · Sunset harbor'},
    {id: 'ocean-10', typeId: 'ocean', number: 10, name: 'Poseidon Crest', recipe: ['R', 'B', 'B', 'B', 'Y'], maxDrops: 6, hint: '5 drops · Ocean finale'},
  ],
  velvet: [
    {id: 'velvet-1', typeId: 'velvet', number: 1, name: 'Royal Grape', recipe: ['R', 'B'], maxDrops: 3, hint: '2 drops · Classic violet'},
    {id: 'velvet-2', typeId: 'velvet', number: 2, name: 'Orchid Bloom', recipe: ['R', 'R', 'B'], maxDrops: 4, hint: '3 drops · Warm magenta'},
    {id: 'velvet-3', typeId: 'velvet', number: 3, name: 'Iris Dusk', recipe: ['R', 'B', 'B'], maxDrops: 4, hint: '3 drops · Cool lavender'},
    {id: 'velvet-4', typeId: 'velvet', number: 4, name: 'Amethyst Silk', recipe: ['R', 'R', 'B', 'B'], maxDrops: 5, hint: '4 drops · Rich saturated plum'},
    {id: 'velvet-5', typeId: 'velvet', number: 5, name: 'Fig Jam', recipe: ['R', 'R', 'Y', 'B'], maxDrops: 5, hint: '4 drops · Warm spiced berry'},
    {id: 'velvet-6', typeId: 'velvet', number: 6, name: 'Wisteria Haze', recipe: ['R', 'B', 'B', 'B'], maxDrops: 5, hint: '4 drops · Deep periwinkle'},
    {id: 'velvet-7', typeId: 'velvet', number: 7, name: 'Mauve Mist', recipe: ['R', 'R', 'Y', 'B', 'B'], maxDrops: 6, hint: '5 drops · Dusty rose plum'},
    {id: 'velvet-8', typeId: 'velvet', number: 8, name: 'Plum Royale', recipe: ['R', 'R', 'R', 'B', 'B'], maxDrops: 6, hint: '5 drops · Regal velvet'},
    {id: 'velvet-9', typeId: 'velvet', number: 9, name: 'Mystic Indigo', recipe: ['R', 'R', 'B', 'B', 'B'], maxDrops: 6, hint: '5 drops · Starry night'},
    {id: 'velvet-10', typeId: 'velvet', number: 10, name: 'Velvet Sovereign', recipe: ['R', 'R', 'R', 'B', 'Y'], maxDrops: 6, hint: '5 drops · Velvet finale'},
  ],
  shadow: [
    {id: 'shadow-1', typeId: 'shadow', number: 1, name: 'Warm Umber', recipe: ['R', 'Y', 'B'], maxDrops: 4, hint: '3 drops · Equal trio'},
    {id: 'shadow-2', typeId: 'shadow', number: 2, name: 'Smoked Clay', recipe: ['R', 'R', 'Y', 'B'], maxDrops: 5, hint: '4 drops · Terracotta ash'},
    {id: 'shadow-3', typeId: 'shadow', number: 3, name: 'Antique Brass', recipe: ['R', 'Y', 'Y', 'B'], maxDrops: 5, hint: '4 drops · Muted bronze'},
    {id: 'shadow-4', typeId: 'shadow', number: 4, name: 'Storm Pewter', recipe: ['R', 'Y', 'B', 'B'], maxDrops: 5, hint: '4 drops · Cool raincloud'},
    {id: 'shadow-5', typeId: 'shadow', number: 5, name: 'Roasted Cocoa', recipe: ['R', 'R', 'Y', 'Y', 'B'], maxDrops: 6, hint: '5 drops · Rich espresso'},
    {id: 'shadow-6', typeId: 'shadow', number: 6, name: 'Tundra Moss', recipe: ['R', 'Y', 'Y', 'B', 'B'], maxDrops: 6, hint: '5 drops · Nordic lichen'},
    {id: 'shadow-7', typeId: 'shadow', number: 7, name: 'Dusk Aubergine', recipe: ['R', 'R', 'Y', 'B', 'B'], maxDrops: 6, hint: '5 drops · Shadow plum'},
    {id: 'shadow-8', typeId: 'shadow', number: 8, name: 'Charcoal Drift', recipe: ['R', 'Y', 'B', 'B', 'B'], maxDrops: 6, hint: '5 drops · Slate ink'},
    {id: 'shadow-9', typeId: 'shadow', number: 9, name: 'Cinder Gold', recipe: ['R', 'R', 'Y', 'Y', 'Y', 'B'], maxDrops: 7, hint: '6 drops · Ember ochre'},
    {id: 'shadow-10', typeId: 'shadow', number: 10, name: 'Alchemist Elixir', recipe: ['R', 'R', 'Y', 'Y', 'B', 'B'], maxDrops: 7, hint: '6 drops · Grand master mix'},
  ],
};

// Instruction 12d: 4 Pigment Palettes (Default free, Pigment 2: 150, Pigment 3: 150, Pigment 4: 300)
export const PALETTES: PaletteDef[] = [
  {
    id: 'watercolor',
    name: 'Primary Watercolor',
    desc: 'Classic translucent studio inks',
    price: 0,
    names: {R: 'Crimson', Y: 'Gamboge', B: 'Cobalt'},
    R: [232, 56, 72],
    Y: [250, 204, 28],
    B: [36, 108, 224],
    RY: [255, 118, 34],
    YB: [44, 182, 104],
    RB: [134, 62, 198],
    RYB: [118, 92, 68],
  },
  {
    id: 'pastel',
    name: 'Pastel Gouache',
    desc: 'Soft milky botanical tints',
    price: 150,
    names: {R: 'Rosewater', Y: 'Buttercream', B: 'Periwinkle'},
    R: [244, 124, 146],
    Y: [253, 226, 116],
    B: [112, 168, 244],
    RY: [255, 168, 122],
    YB: [126, 218, 174],
    RB: [176, 138, 232],
    RYB: [164, 144, 128],
  },
  {
    id: 'neon',
    name: 'Botanical Neon',
    desc: 'High-chroma luminous extracts',
    price: 150,
    names: {R: 'Hibiscus', Y: 'Citron', B: 'Lagoon'},
    R: [255, 42, 109],
    Y: [249, 238, 18],
    B: [16, 152, 255],
    RY: [255, 124, 12],
    YB: [20, 226, 126],
    RB: [168, 48, 255],
    RYB: [126, 108, 92],
  },
  {
    id: 'royal',
    name: 'Royal Alchemy',
    desc: 'Velvety jewel-toned master inks',
    price: 300,
    names: {R: 'Ruby Ink', Y: 'Aureolin', B: 'Sapphire'},
    R: [204, 34, 88],
    Y: [244, 182, 26],
    B: [34, 78, 196],
    RY: [236, 98, 36],
    YB: [32, 156, 108],
    RB: [122, 42, 178],
    RYB: [98, 76, 62],
  },
];

// Instruction 12b & 12c: 6 Vessels (V1: Free, V2: 100, V3-V5: 150, V6: 300)
export const VESSELS: VesselDef[] = [
  {
    id: 'tumbler',
    name: 'Classic Tumbler',
    desc: 'Balanced everyday studio glass',
    price: 0,
  },
  {
    id: 'flask',
    name: 'Potion Flask',
    desc: 'Rounded alchemist mixing bottle',
    price: 100,
  },
  {
    id: 'highball',
    name: 'Tall Highball',
    desc: 'Sleek vertical crystal silhouette',
    price: 150,
  },
  {
    id: 'lotus',
    name: 'Lotus Tea Bowl',
    desc: 'Wide ceremonial petal vessel',
    price: 150,
  },
  {
    id: 'chalice',
    name: 'Crystal Chalice',
    desc: 'Faceted stemmed studio goblet',
    price: 150,
  },
  {
    id: 'amphora',
    name: 'Royal Amphora',
    desc: 'Ornate collector master urn',
    price: 300,
  },
];

export function getPaletteById(id: PaletteId): PaletteDef {
  return PALETTES.find((p) => p.id === id) || PALETTES[0];
}

export function getVesselById(id: VesselId): VesselDef {
  return VESSELS.find((v) => v.id === id) || VESSELS[0];
}

export function getLevelDef(typeId: LevelTypeId, levelNumber: number): LevelDef {
  const list = LEVELS_BY_TYPE[typeId] || LEVELS_BY_TYPE.crimson;
  return list.find((l) => l.number === levelNumber) || list[0];
}

export function getNextLevelType(typeId: LevelTypeId): LevelTypeId | null {
  const idx = LEVEL_TYPE_ORDER.indexOf(typeId);
  if (idx === -1 || idx >= LEVEL_TYPE_ORDER.length - 1) return null;
  return LEVEL_TYPE_ORDER[idx + 1];
}

export function getTodayDateString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const DAILY_TASK_POOL: Array<Omit<DailyTask, 'id' | 'progress' | 'claimed'>> = [
  {kind: 'complete_levels', title: 'Complete 3 Levels', target: 3, reward: 10, icon: 'chest'},
  {kind: 'perfect_blends', title: 'Perfect Blend', target: 2, reward: 10, icon: 'diamond'},
  {kind: 'use_drops', title: 'Drop 8 Pigments', target: 8, reward: 10, icon: 'chest'},
  {kind: 'swirl_glasses', title: 'Swirl 4 Glasses', target: 4, reward: 10, icon: 'diamond'},
  {kind: 'earn_stars', title: 'Earn 6 Stars', target: 6, reward: 10, icon: 'chest'},
  {kind: 'save_snapshot', title: 'Save 1 Snapshot', target: 1, reward: 10, icon: 'diamond'},
];

export function generateDailyTasksForDate(dateStr: string): DailyTask[] {
  // Deterministic 2 tasks per day seeded by YYYY-MM-DD
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) >>> 0;
  }
  const idx1 = hash % DAILY_TASK_POOL.length;
  const idx2 = (idx1 + 1 + ((hash >> 3) % (DAILY_TASK_POOL.length - 1))) % DAILY_TASK_POOL.length;

  const t1 = DAILY_TASK_POOL[idx1];
  const t2 = DAILY_TASK_POOL[idx2];

  return [
    {...t1, id: `${dateStr}-0`, progress: 0, claimed: false, icon: 'chest'},
    {...t2, id: `${dateStr}-1`, progress: 0, claimed: false, icon: 'diamond'},
  ];
}
