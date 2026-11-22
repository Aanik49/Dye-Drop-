import {dropsToNormalizedRYB, rybToRgb} from './colorEngine';
import type {DyeCode, PaletteDef, VesselId} from './types';

export interface FallingDrop {
  x: number;
  y: number;
  targetY: number;
  vy: number;
  radius: number;
  rgb: [number, number, number];
  dyeType: DyeCode;
  localX: number;
}

export interface PigmentCloud {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  maxRadius: number;
  rgb: [number, number, number];
  dyeType: DyeCode;
  alpha: number;
  phase: number;
}

export interface SurfaceRipple {
  x: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

export interface VesselMetrics {
  topW: number;
  botW: number;
  height: number;
  neckH: number;
  stemH: number;
  scale: number;
}

export function getVesselMetrics(
  vesselId: VesselId,
  canvasW: number,
  canvasH: number
): VesselMetrics {
  const scale = Math.min(canvasW / 345, canvasH / 370, 1.12);
  switch (vesselId) {
    case 'flask':
      return {topW: 54 * scale, botW: 176 * scale, height: 215 * scale, neckH: 54 * scale, stemH: 0, scale};
    case 'highball':
      return {topW: 112 * scale, botW: 102 * scale, height: 238 * scale, neckH: 0, stemH: 0, scale};
    case 'lotus':
      return {topW: 194 * scale, botW: 96 * scale, height: 165 * scale, neckH: 0, stemH: 0, scale};
    case 'chalice':
      return {topW: 158 * scale, botW: 84 * scale, height: 150 * scale, neckH: 0, stemH: 58 * scale, scale};
    case 'amphora':
      return {topW: 64 * scale, botW: 156 * scale, height: 220 * scale, neckH: 48 * scale, stemH: 0, scale};
    case 'tumbler':
    default:
      return {topW: 152 * scale, botW: 120 * scale, height: 210 * scale, neckH: 0, stemH: 0, scale};
  }
}

export function traceVesselInterior(
  ctx: CanvasRenderingContext2D,
  vesselId: VesselId,
  m: VesselMetrics
): void {
  const halfTop = m.topW / 2;
  const halfBot = m.botW / 2;
  const topY = -m.height / 2 - (m.stemH ? m.stemH * 0.35 : 0);
  const botY = m.height / 2 - (m.stemH ? m.stemH * 0.35 : 0);
  const cornerR = 18 * m.scale;

  ctx.beginPath();
  if (vesselId === 'flask') {
    const shoulderY = topY + m.neckH;
    ctx.moveTo(-halfTop, topY);
    ctx.lineTo(-halfTop, shoulderY);
    ctx.quadraticCurveTo(-halfBot * 1.08, shoulderY + 34 * m.scale, -halfBot, botY - cornerR);
    ctx.quadraticCurveTo(-halfBot, botY, -halfBot + cornerR, botY);
    ctx.lineTo(halfBot - cornerR, botY);
    ctx.quadraticCurveTo(halfBot, botY, halfBot, botY - cornerR);
    ctx.quadraticCurveTo(halfBot * 1.08, shoulderY + 34 * m.scale, halfTop, shoulderY);
    ctx.lineTo(halfTop, topY);
  } else if (vesselId === 'lotus') {
    ctx.moveTo(-halfTop, topY);
    ctx.bezierCurveTo(
      -halfTop * 1.06,
      topY + m.height * 0.68,
      -halfBot * 1.25,
      botY,
      -halfBot + cornerR,
      botY
    );
    ctx.lineTo(halfBot - cornerR, botY);
    ctx.bezierCurveTo(
      halfBot * 1.25,
      botY,
      halfTop * 1.06,
      topY + m.height * 0.68,
      halfTop,
      topY
    );
  } else if (vesselId === 'chalice') {
    ctx.moveTo(-halfTop, topY);
    ctx.bezierCurveTo(-halfTop * 0.98, topY + m.height * 0.72, -halfBot * 0.7, botY, 0, botY);
    ctx.bezierCurveTo(halfBot * 0.7, botY, halfTop * 0.98, topY + m.height * 0.72, halfTop, topY);
  } else if (vesselId === 'amphora') {
    const shoulderY = topY + m.neckH;
    ctx.moveTo(-halfTop * 1.15, topY);
    ctx.lineTo(-halfTop * 0.88, shoulderY);
    ctx.bezierCurveTo(
      -halfBot * 1.2,
      shoulderY + 28 * m.scale,
      -halfBot * 1.05,
      botY - 26 * m.scale,
      -halfBot * 0.56,
      botY
    );
    ctx.lineTo(halfBot * 0.56, botY);
    ctx.bezierCurveTo(
      halfBot * 1.05,
      botY - 26 * m.scale,
      halfBot * 1.2,
      shoulderY + 28 * m.scale,
      halfTop * 0.88,
      shoulderY
    );
    ctx.lineTo(halfTop * 1.15, topY);
  } else {
    // Classic Tumbler & Tall Highball
    ctx.moveTo(-halfTop, topY);
    ctx.lineTo(-halfBot, botY - cornerR);
    ctx.quadraticCurveTo(-halfBot, botY, -halfBot + cornerR, botY);
    ctx.lineTo(halfBot - cornerR, botY);
    ctx.quadraticCurveTo(halfBot, botY, halfBot, botY - cornerR);
    ctx.lineTo(halfTop, topY);
  }
}

export interface LiquidSceneState {
  vesselId: VesselId;
  palette: PaletteDef;
  drops: DyeCode[];
  fallingDrops: FallingDrop[];
  pigmentClouds: PigmentCloud[];
  ripples: SurfaceRipple[];
  tiltAngle: number;
  swirlEnergy: number;
  wavePhase: number;
}

export function renderLiquidGlassScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  scene: LiquidSceneState,
  options?: {backdropColor?: string; halftoneColor?: string}
): void {
  ctx.clearRect(0, 0, width, height);

  if (options?.backdropColor) {
    ctx.fillStyle = options.backdropColor;
    ctx.fillRect(0, 0, width, height);
    if (options.halftoneColor) {
      ctx.fillStyle = options.halftoneColor;
      for (let x = 10; x < width; x += 18) {
        for (let y = 10; y < height; y += 18) {
          ctx.beginPath();
          ctx.arc(x, y, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  const cx = width / 2;
  const cy = height / 2 + 8;
  const m = getVesselMetrics(scene.vesselId, width, height);
  const topY = -m.height / 2 - (m.stemH ? m.stemH * 0.35 : 0);
  const botY = m.height / 2 - (m.stemH ? m.stemH * 0.35 : 0);
  const baseShadowY = m.stemH ? botY + m.stemH + 8 : botY + 12;

  // Hard Comic Offset Shadow beneath Glass
  ctx.save();
  ctx.translate(cx, cy + baseShadowY);
  ctx.fillStyle = 'rgba(20, 20, 20, 0.22)';
  ctx.beginPath();
  ctx.ellipse(0, 0, m.botW * 0.65, 11 * m.scale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Falling Droplets (outside glass transform)
  for (const d of scene.fallingDrops) {
    ctx.save();
    ctx.fillStyle = `rgb(${d.rgb[0]}, ${d.rgb[1]}, ${d.rgb[2]})`;
    ctx.strokeStyle = '#141414';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(d.x, d.y - d.radius * 1.55);
    ctx.bezierCurveTo(
      d.x + d.radius,
      d.y - d.radius * 0.2,
      d.x + d.radius,
      d.y + d.radius,
      d.x,
      d.y + d.radius
    );
    ctx.bezierCurveTo(
      d.x - d.radius,
      d.y + d.radius,
      d.x - d.radius,
      d.y - d.radius * 0.2,
      d.x,
      d.y - d.radius * 1.55
    );
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.beginPath();
    ctx.arc(d.x - 2.6, d.y + 1, 2.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Tilted Glass Coordinate Space
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((scene.tiltAngle * Math.PI) / 180);

  // Optional Decorative Handles for Royal Amphora (drawn behind vessel body)
  if (scene.vesselId === 'amphora') {
    ctx.save();
    ctx.strokeStyle = '#141414';
    ctx.lineWidth = 9 * m.scale;
    ctx.lineCap = 'round';
    [-1, 1].forEach((dir) => {
      ctx.beginPath();
      ctx.moveTo(dir * m.topW * 0.45, topY + 18 * m.scale);
      ctx.bezierCurveTo(
        dir * m.botW * 0.82,
        topY + 14 * m.scale,
        dir * m.botW * 0.85,
        topY + m.height * 0.56,
        dir * m.botW * 0.48,
        topY + m.height * 0.56
      );
      ctx.stroke();
      ctx.strokeStyle = '#FFE047';
      ctx.lineWidth = 4.5 * m.scale;
      ctx.stroke();
      ctx.strokeStyle = '#141414';
      ctx.lineWidth = 9 * m.scale;
    });
    ctx.restore();
  }

  // Optional Stem & Foot for Crystal Chalice
  if (scene.vesselId === 'chalice') {
    ctx.save();
    ctx.fillStyle = '#FFFDF5';
    ctx.strokeStyle = '#141414';
    ctx.lineWidth = 3.5;
    // Stem
    ctx.beginPath();
    ctx.roundRect(-7 * m.scale, botY - 4, 14 * m.scale, m.stemH, 4);
    ctx.fill();
    ctx.stroke();
    // Base Foot
    ctx.beginPath();
    ctx.ellipse(0, botY + m.stemH - 2, m.botW * 0.54, 10 * m.scale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // Back Glass Fill
  traceVesselInterior(ctx, scene.vesselId, m);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.58)';
  ctx.fill();

  // Clip Interior for Liquid & Pigment Clouds
  ctx.save();
  traceVesselInterior(ctx, scene.vesselId, m);
  ctx.clip();

  const waterTopY = topY + m.height * (scene.vesselId === 'flask' || scene.vesselId === 'amphora' ? 0.36 : 0.28);
  const waterBotY = botY + 14;
  const norm = dropsToNormalizedRYB(scene.drops);
  const blendedRGB: [number, number, number] =
    scene.drops.length > 0 ? rybToRgb(norm.r, norm.y, norm.b, scene.palette) : [214, 243, 255];

  // Counter-rotate water surface so liquid stays level when tilted
  ctx.save();
  ctx.rotate(((-scene.tiltAngle * Math.PI) / 180) * 0.72);

  const baseMixAlpha = scene.drops.length === 0 ? 0.62 : 0.42 + scene.swirlEnergy * 0.55;
  const liqGrad = ctx.createLinearGradient(0, waterTopY, 0, waterBotY);
  liqGrad.addColorStop(
    0,
    `rgba(${blendedRGB[0]}, ${blendedRGB[1]}, ${blendedRGB[2]}, ${baseMixAlpha * 0.9})`
  );
  liqGrad.addColorStop(
    1,
    `rgba(${Math.max(0, blendedRGB[0] - 20)}, ${Math.max(0, blendedRGB[1] - 20)}, ${Math.max(
      0,
      blendedRGB[2] - 20
    )}, ${Math.min(0.98, baseMixAlpha + 0.14)})`
  );

  ctx.fillStyle = liqGrad;
  ctx.beginPath();
  const waveW = Math.max(m.topW, m.botW) * 1.4;
  ctx.moveTo(-waveW, waterTopY);
  for (let wx = -waveW; wx <= waveW; wx += 12) {
    const wy =
      waterTopY +
      Math.sin(wx * 0.048 + scene.wavePhase) * (2.6 + Math.abs(scene.tiltAngle) * 0.13);
    ctx.lineTo(wx, wy);
  }
  ctx.lineTo(waveW, waterBotY + 45);
  ctx.lineTo(-waveW, waterBotY + 45);
  ctx.closePath();
  ctx.fill();

  // Crisp Meniscus Surface Highlight
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let wx = -waveW; wx <= waveW; wx += 12) {
    const wy =
      waterTopY +
      Math.sin(wx * 0.048 + scene.wavePhase) * (2.6 + Math.abs(scene.tiltAngle) * 0.13);
    if (wx === -waveW) ctx.moveTo(wx, wy);
    else ctx.lineTo(wx, wy);
  }
  ctx.stroke();
  ctx.restore();

  // Swirling Pigment Clouds
  for (const p of scene.pigmentClouds) {
    const r = Math.round(p.rgb[0]);
    const g = Math.round(p.rgb[1]);
    const b = Math.round(p.rgb[2]);
    const cloudGrad = ctx.createRadialGradient(p.x, p.y, 2, p.x, p.y, p.radius);
    cloudGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${p.alpha})`);
    cloudGrad.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, ${p.alpha * 0.48})`);
    cloudGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

    ctx.fillStyle = cloudGrad;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Impact Ripples
  for (const rip of scene.ripples) {
    ctx.strokeStyle = `rgba(255, 255, 255, ${rip.alpha})`;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.ellipse(rip.x, waterTopY + 2, rip.radius, rip.radius * 0.25, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Subtle Lotus Petal Engraving on Lotus Bowl
  if (scene.vesselId === 'lotus') {
    ctx.strokeStyle = 'rgba(20, 20, 20, 0.18)';
    ctx.lineWidth = 2;
    [-36, 0, 36].forEach((ox) => {
      ctx.beginPath();
      ctx.ellipse(ox * m.scale, botY - 34 * m.scale, 20 * m.scale, 34 * m.scale, ox * 0.008, 0, Math.PI * 2);
      ctx.stroke();
    });
  }

  ctx.restore(); // End vessel clip

  // Bold Comic Ink Outline around Glass
  traceVesselInterior(ctx, scene.vesselId, m);
  ctx.strokeStyle = '#141414';
  ctx.lineWidth = 4;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.stroke();

  // Glass Base Reflection (for flat-bottom vessels)
  if (scene.vesselId !== 'chalice') {
    const halfBot = m.botW / 2;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.62)';
    ctx.beginPath();
    ctx.roundRect(
      -halfBot * 0.72,
      botY - 12 * m.scale,
      m.botW * 0.72,
      8 * m.scale,
      4
    );
    ctx.fill();
  }

  // Comic Gloss Highlight Streak
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.lineWidth = 5.5 * m.scale;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-m.topW * 0.34, topY + m.height * 0.18);
  ctx.lineTo(-m.botW * 0.3, botY - m.height * 0.2);
  ctx.stroke();

  // Top Rim Comic Ellipse
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.strokeStyle = '#141414';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.ellipse(
    0,
    topY,
    (scene.vesselId === 'amphora' ? m.topW * 0.58 : m.topW / 2),
    6.5 * m.scale,
    0,
    0,
    Math.PI * 2
  );
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

// Generates a downloadable Studio Polaroid PNG WITH the color HEX code & recipe burned in!
export function generateSnapshotCardDataUrl(params: {
  vesselId: VesselId;
  palette: PaletteDef;
  drops: DyeCode[];
  levelName: string;
  typeName: string;
  hexCode: string;
  matchPercent: number;
  recipeText: string;
  stageBg: string;
  accentColor: string;
}): string {
  const w = 640;
  const h = 780;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Outer Comic Cream Card
  ctx.fillStyle = '#FFF9DF';
  ctx.fillRect(0, 0, w, h);

  // Subtle Halftone Dots
  ctx.fillStyle = 'rgba(245, 184, 52, 0.26)';
  for (let x = 14; x < w; x += 20) {
    for (let y = 14; y < h; y += 20) {
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Thick Card Frame with Hard Offset Shadow
  ctx.fillStyle = '#141414';
  ctx.beginPath();
  ctx.roundRect(38, 38, w - 64, h - 64, 28);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#141414';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(28, 28, w - 64, h - 64, 28);
  ctx.fill();
  ctx.stroke();

  // Header Row
  ctx.fillStyle = '#141414';
  ctx.font = '700 22px "Fredoka", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('DYE DROP STUDIO', 56, 76);

  // Match Badge
  ctx.fillStyle = '#B8FF00';
  ctx.strokeStyle = '#141414';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(w - 220, 48, 162, 42, 21);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#141414';
  ctx.font = '700 20px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`${params.matchPercent}% MATCH`, w - 139, 76);

  // Inner Glass Stage Frame
  const stageX = 54;
  const stageY = 108;
  const stageW = w - 116;
  const stageH = 430;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(stageX, stageY, stageW, stageH, 22);
  ctx.clip();

  ctx.translate(stageX, stageY);
  renderLiquidGlassScene(
    ctx,
    stageW,
    stageH,
    {
      vesselId: params.vesselId,
      palette: params.palette,
      drops: params.drops,
      fallingDrops: [],
      pigmentClouds: [],
      ripples: [],
      tiltAngle: 0,
      swirlEnergy: 1,
      wavePhase: 0.4,
    },
    {backdropColor: params.stageBg, halftoneColor: 'rgba(20, 20, 20, 0.06)'}
  );
  ctx.restore();

  ctx.strokeStyle = '#141414';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.roundRect(stageX, stageY, stageW, stageH, 22);
  ctx.stroke();

  // Color Swatch + Color Name + Recipe + Prominent HEX Code
  const footerY = stageY + stageH + 30;
  ctx.fillStyle = params.hexCode;
  ctx.strokeStyle = '#141414';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.roundRect(54, footerY, 92, 92, 18);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#141414';
  ctx.textAlign = 'left';
  ctx.font = '700 32px "Fredoka", sans-serif';
  ctx.fillText(params.levelName, 164, footerY + 34);

  ctx.fillStyle = '#524C5C';
  ctx.font = '700 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`${params.typeName} Pack · ${params.recipeText}`, 164, footerY + 66);

  // Prominent HEX Code Pill
  ctx.fillStyle = '#FFE047';
  ctx.strokeStyle = '#141414';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(164, footerY + 84, 178, 44, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#141414';
  ctx.font = '700 24px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(params.hexCode, 164 + 89, footerY + 114);

  return canvas.toDataURL('image/png');
}
