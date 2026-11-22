import type {DyeCode, PaletteDef} from './types';

export function rybToRgb(r: number, y: number, b: number, palette: PaletteDef): [number, number, number] {
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
  total: number;
} {
  if (!drops || drops.length === 0) return {r: 0, y: 0, b: 0, total: 0};
  let cR = 0;
  let cY = 0;
  let cB = 0;
  for (const d of drops) {
    if (d === 'R') cR++;
    else if (d === 'Y') cY++;
    else if (d === 'B') cB++;
  }
  const maxComp = Math.max(cR, cY, cB, 1);
  const strength = Math.min(1, 0.72 + (drops.length - 1) * 0.1);
  return {
    r: (cR / maxComp) * strength,
    y: (cY / maxComp) * strength,
    b: (cB / maxComp) * strength,
    total: drops.length,
  };
}

export function getRecipeRgb(drops: DyeCode[], palette: PaletteDef): [number, number, number] {
  if (drops.length === 0) return [235, 246, 252];
  const norm = dropsToNormalizedRYB(drops);
  return rybToRgb(norm.r, norm.y, norm.b, palette);
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

  const count = (arr: DyeCode[]) => ({
    R: arr.filter((d) => d === 'R').length,
    Y: arr.filter((d) => d === 'Y').length,
    B: arr.filter((d) => d === 'B').length,
  });

  const dc = count(drops);
  const tc = count(targetRecipe);
  const isExact = dc.R === tc.R && dc.Y === tc.Y && dc.B === tc.B;

  const similarity = isExact ? 100 : colorSimilarity(rgb, targetRgb);

  if (isExact || similarity >= 96) {
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

export function formatRecipeText(drops: DyeCode[], palette: PaletteDef): string {
  const counts: Record<DyeCode, number> = {R: 0, Y: 0, B: 0};
  for (const d of drops) counts[d]++;
  const parts: string[] = [];
  if (counts.R) parts.push(`${counts.R} ${palette.names.R}`);
  if (counts.Y) parts.push(`${counts.Y} ${palette.names.Y}`);
  if (counts.B) parts.push(`${counts.B} ${palette.names.B}`);
  return parts.length > 0 ? parts.join(' + ') : 'Clear Water';
}
