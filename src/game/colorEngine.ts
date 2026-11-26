import type {DyeCode, PaletteDef} from './types';

export const MODIFIER_RGB: Record<'W' | 'K' | 'D', [number, number, number]> = {
  W: [252, 249, 240], // Milk (Lighten)
  K: [34, 32, 40], // Charcoal (Darken)
  D: [204, 238, 252], // Clear Water (Dilute)
};

export const MODIFIER_LABELS: Record<'W' | 'K' | 'D', {name: string; short: string}> = {
  W: {name: 'Milk', short: 'Lighten'},
  K: {name: 'Charcoal', short: 'Darken'},
  D: {name: 'Water', short: 'Dilute'},
};

export function getDyeRgb(code: DyeCode, palette: PaletteDef): [number, number, number] {
  if (code === 'W' || code === 'K' || code === 'D') {
    return MODIFIER_RGB[code];
  }
  return palette[code];
}

export function getDyeName(code: DyeCode, palette: PaletteDef): string {
  if (code === 'W' || code === 'K' || code === 'D') {
    return MODIFIER_LABELS[code].name;
  }
  return palette.names[code];
}

export function rybToRgb(
  r: number,
  y: number,
  b: number,
  palette: PaletteDef
): [number, number, number] {
  const c000: [number, number, number] = [235, 246, 252];
  const c100 = palette.R;
  const c010 = palette.Y;
  const c001 = palette.B;
  const c110 = palette.RY;
  const c011 = palette.YB;
  const c101 = palette.RB;
  const c111 = palette.RYB;

  const lerp = (a: number, bVal: number, t: number) => a + (bVal - a) * t;
  const mix3 = (
    v0: [number, number, number],
    v1: [number, number, number],
    t: number
  ): [number, number, number] => [
    lerp(v0[0], v1[0], t),
    lerp(v0[1], v1[1], t),
    lerp(v0[2], v1[2], t),
  ];

  const c00 = mix3(c000, c100, r);
  const c10 = mix3(c010, c110, r);
  const c01 = mix3(c001, c101, r);
  const c11 = mix3(c011, c111, r);

  const c0 = mix3(c00, c10, y);
  const c1 = mix3(c01, c11, y);

  const out = mix3(c0, c1, b);
  return [Math.round(out[0]), Math.round(out[1]), Math.round(out[2])];
}

export function rgbToHex([r, g, b]: [number, number, number]): string {
  return (
    '#' +
    [r, g, b]
      .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
}

export function dropsToNormalizedRYB(drops: DyeCode[]): {
  r: number;
  y: number;
  b: number;
  w: number;
  k: number;
  d: number;
  primaryTotal: number;
  total: number;
} {
  if (!drops || drops.length === 0) {
    return {r: 0, y: 0, b: 0, w: 0, k: 0, d: 0, primaryTotal: 0, total: 0};
  }
  let cR = 0;
  let cY = 0;
  let cB = 0;
  let cW = 0;
  let cK = 0;
  let cD = 0;

  for (const drop of drops) {
    if (drop === 'R') cR++;
    else if (drop === 'Y') cY++;
    else if (drop === 'B') cB++;
    else if (drop === 'W') cW++;
    else if (drop === 'K') cK++;
    else if (drop === 'D') cD++;
  }

  const primaryTotal = cR + cY + cB;
  if (primaryTotal === 0) {
    return {r: 0, y: 0, b: 0, w: cW, k: cK, d: cD, primaryTotal: 0, total: drops.length};
  }

  const maxComp = Math.max(cR, cY, cB, 1);
  const strength = Math.min(1, 0.72 + (primaryTotal - 1) * 0.1);
  return {
    r: (cR / maxComp) * strength,
    y: (cY / maxComp) * strength,
    b: (cB / maxComp) * strength,
    w: cW,
    k: cK,
    d: cD,
    primaryTotal,
    total: drops.length,
  };
}

function lerpRgb(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] {
  const clamped = Math.max(0, Math.min(1, t));
  return [
    Math.round(a[0] + (b[0] - a[0]) * clamped),
    Math.round(a[1] + (b[1] - a[1]) * clamped),
    Math.round(a[2] + (b[2] - a[2]) * clamped),
  ];
}

export function getRecipeRgb(drops: DyeCode[], palette: PaletteDef): [number, number, number] {
  if (!drops || drops.length === 0) return [235, 246, 252];
  const norm = dropsToNormalizedRYB(drops);

  let rgb: [number, number, number] =
    norm.primaryTotal > 0 ? rybToRgb(norm.r, norm.y, norm.b, palette) : [235, 246, 252];

  // Apply Clear Water Dilute (softens saturation & pulls toward translucent pale water)
  if (norm.d > 0) {
    const diluteFactor = 1 - Math.pow(0.7, norm.d);
    rgb = lerpRgb(rgb, [230, 244, 251], diluteFactor * 0.85);
  }

  // Apply Milk / White Tint (brightens into creamy pastel)
  if (norm.w > 0) {
    const tintFactor = 1 - Math.pow(0.68, norm.w);
    rgb = lerpRgb(rgb, [252, 249, 243], tintFactor * 0.9);
  }

  // Apply Charcoal / Black Shade (deepens into rich dark tone)
  if (norm.k > 0) {
    const shadeFactor = 1 - Math.pow(0.66, norm.k);
    rgb = lerpRgb(rgb, [24, 22, 30], shadeFactor * 0.9);
  }

  return rgb;
}

export function colorSimilarity(
  rgb1: [number, number, number],
  rgb2: [number, number, number]
): number {
  const dr = rgb1[0] - rgb2[0];
  const dg = rgb1[1] - rgb2[1];
  const db = rgb1[2] - rgb2[2];
  const dist = Math.sqrt(dr * dr * 0.3 + dg * dg * 0.59 + db * db * 0.11);
  const maxDist = 215;
  return Math.max(0, Math.min(100, Math.round((1 - dist / maxDist) * 100)));
}

function countAllDyes(arr: DyeCode[]): Record<DyeCode, number> {
  const counts: Record<DyeCode, number> = {R: 0, Y: 0, B: 0, W: 0, K: 0, D: 0};
  for (const d of arr) counts[d]++;
  return counts;
}

function isExactRecipe(a: DyeCode[], b: DyeCode[]): boolean {
  const ca = countAllDyes(a);
  const cb = countAllDyes(b);
  return (
    ca.R === cb.R &&
    ca.Y === cb.Y &&
    ca.B === cb.B &&
    ca.W === cb.W &&
    ca.K === cb.K &&
    ca.D === cb.D
  );
}

export function evaluateMixResult(
  drops: DyeCode[],
  targetRecipe: DyeCode[],
  palette: PaletteDef
): {
  similarity: number;
  stars: number;
  passed: boolean;
  hex: string;
  rgb: [number, number, number];
} {
  const rgb = getRecipeRgb(drops, palette);
  const targetRgb = getRecipeRgb(targetRecipe, palette);
  const hex = rgbToHex(rgb);

  if (drops.length === 0) {
    return {similarity: 0, stars: 0, passed: false, hex: '#EBF6FC', rgb};
  }

  const exact = isExactRecipe(drops, targetRecipe);
  const similarity = exact ? 100 : colorSimilarity(rgb, targetRgb);

  if (exact || similarity >= 96) {
    return {similarity, stars: 3, passed: true, hex, rgb};
  }
  if (similarity >= 90) {
    return {similarity, stars: 2, passed: true, hex, rgb};
  }
  if (similarity >= 84) {
    return {similarity, stars: 1, passed: true, hex, rgb};
  }
  return {similarity, stars: 0, passed: false, hex, rgb};
}

export function evaluateLayeredMixResult(params: {
  bottomDrops: DyeCode[];
  topDrops: DyeCode[];
  targetBottomRecipe: DyeCode[];
  targetTopRecipe: DyeCode[];
  palette: PaletteDef;
  overMix: number; // 0 = clean separation, 1 = fully muddied
}): {
  similarity: number;
  bottomSimilarity: number;
  topSimilarity: number;
  stars: number;
  passed: boolean;
  overMixedFail: boolean;
  bottomHex: string;
  topHex: string;
  bottomRgb: [number, number, number];
  topRgb: [number, number, number];
} {
  const rawBottomRgb = getRecipeRgb(params.bottomDrops, params.palette);
  const rawTopRgb = getRecipeRgb(params.topDrops, params.palette);
  const mudRgb = lerpRgb(rawBottomRgb, rawTopRgb, 0.5);

  // If layers bled together via over-mixing, displayed & scored layer colors drift toward mud
  const bleed = Math.max(0, Math.min(1, params.overMix));
  const bottomRgb = lerpRgb(rawBottomRgb, mudRgb, bleed * 0.85);
  const topRgb = lerpRgb(rawTopRgb, mudRgb, bleed * 0.85);

  const bottomHex = rgbToHex(bottomRgb);
  const topHex = rgbToHex(topRgb);

  if (params.bottomDrops.length === 0 || params.topDrops.length === 0) {
    return {
      similarity: 0,
      bottomSimilarity: 0,
      topSimilarity: 0,
      stars: 0,
      passed: false,
      overMixedFail: false,
      bottomHex,
      topHex,
      bottomRgb,
      topRgb,
    };
  }

  const targetBottomRgb = getRecipeRgb(params.targetBottomRecipe, params.palette);
  const targetTopRgb = getRecipeRgb(params.targetTopRecipe, params.palette);

  const exactBottom = isExactRecipe(params.bottomDrops, params.targetBottomRecipe);
  const exactTop = isExactRecipe(params.topDrops, params.targetTopRecipe);

  const baseBottomSim = exactBottom && bleed < 0.25 ? 100 : colorSimilarity(bottomRgb, targetBottomRgb);
  const baseTopSim = exactTop && bleed < 0.25 ? 100 : colorSimilarity(topRgb, targetTopRgb);

  // Over-mixing beyond 0.72 ruins the two-tone cocktail separation!
  if (bleed >= 0.72) {
    const ruinedSim = Math.min(68, Math.round((baseBottomSim + baseTopSim) / 2 * 0.7));
    return {
      similarity: ruinedSim,
      bottomSimilarity: baseBottomSim,
      topSimilarity: baseTopSim,
      stars: 0,
      passed: false,
      overMixedFail: true,
      bottomHex,
      topHex,
      bottomRgb,
      topRgb,
    };
  }

  // Slight separation penalty if player got close to over-mixing (0.45..0.72)
  const sepPenalty = bleed > 0.45 ? Math.round((bleed - 0.45) * 28) : 0;
  const similarity = Math.max(0, Math.min(100, Math.round((baseBottomSim + baseTopSim) / 2) - sepPenalty));

  const bothClose = baseBottomSim >= 78 && baseTopSim >= 78;
  if (!bothClose || similarity < 84) {
    return {
      similarity,
      bottomSimilarity: baseBottomSim,
      topSimilarity: baseTopSim,
      stars: 0,
      passed: false,
      overMixedFail: false,
      bottomHex,
      topHex,
      bottomRgb,
      topRgb,
    };
  }

  if ((exactBottom && exactTop && bleed < 0.38) || similarity >= 95) {
    return {
      similarity,
      bottomSimilarity: baseBottomSim,
      topSimilarity: baseTopSim,
      stars: 3,
      passed: true,
      overMixedFail: false,
      bottomHex,
      topHex,
      bottomRgb,
      topRgb,
    };
  }
  if (similarity >= 89) {
    return {
      similarity,
      bottomSimilarity: baseBottomSim,
      topSimilarity: baseTopSim,
      stars: 2,
      passed: true,
      overMixedFail: false,
      bottomHex,
      topHex,
      bottomRgb,
      topRgb,
    };
  }
  return {
    similarity,
    bottomSimilarity: baseBottomSim,
    topSimilarity: baseTopSim,
    stars: 1,
    passed: true,
    overMixedFail: false,
    bottomHex,
    topHex,
    bottomRgb,
    topRgb,
  };
}

export function formatRecipeText(drops: DyeCode[], palette: PaletteDef): string {
  const counts = countAllDyes(drops);
  const parts: string[] = [];
  if (counts.R) parts.push(`${counts.R} ${palette.names.R}`);
  if (counts.Y) parts.push(`${counts.Y} ${palette.names.Y}`);
  if (counts.B) parts.push(`${counts.B} ${palette.names.B}`);
  if (counts.W) parts.push(`${counts.W} Milk`);
  if (counts.K) parts.push(`${counts.K} Charcoal`);
  if (counts.D) parts.push(`${counts.D} Water`);
  return parts.length > 0 ? parts.join(' + ') : 'Clear Water';
}

export function formatLayeredRecipeText(
  topDrops: DyeCode[],
  bottomDrops: DyeCode[],
  palette: PaletteDef
): string {
  return `Top: ${formatRecipeText(topDrops, palette)} · Btm: ${formatRecipeText(bottomDrops, palette)}`;
}
