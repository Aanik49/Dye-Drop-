import {getRecipeRgb} from './colorEngine';
import type {
  DyeCode,
  LayerSlot,
  LiquidFinishId,
  PaletteDef,
  PrimaryDyeCode,
  VesselId,
} from './types';

export interface FallingDrop {
  x: number;
  y: number;
  targetY: number;
  vy: number;
  radius: number;
  rgb: [number, number, number];
  dyeType: DyeCode;
  localX: number;
  layer?: LayerSlot;
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
  layer?: LayerSlot;
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

export interface ColorPipeInfo {
  code: PrimaryDyeCode;
  x: number;
  topY: number;
  width: number;
  height: number;
  nozzleY: number;
}

/* Exact 3 Glass Color Pipes layout attached to a sliding rail beneath the Gameplay HUD bar */
export function getColorPipeLayout(
  canvasW: number,
  canvasH: number,
  railOffset = 0
): ColorPipeInfo[] {
  const pipeW = Math.max(36, Math.min(46, canvasW * 0.115));
  const pipeH = Math.max(58, Math.min(84, canvasH * 0.245));
  const spacing = Math.max(74, Math.min(94, canvasW * 0.235));
  const cx = canvasW / 2;
  const topY = 0;

  const codes: PrimaryDyeCode[] = ['B', 'Y', 'R'];
  return codes.map((code, idx) => {
    const x = cx + (idx - 1) * spacing + railOffset;
    return {
      code,
      x,
      topY,
      width: pipeW,
      height: pipeH,
      nozzleY: topY + pipeH + 6,
    };
  });
}

export function getPipeSpacing(canvasW: number): number {
  return Math.max(74, Math.min(94, canvasW * 0.235));
}

/* Computes vessel center Y accounting for the 3 pipes hanging above when active */
export function getVesselCenterY(canvasH: number, showPipes = false): number {
  if (showPipes) {
    return canvasH * 0.64;
  }
  return canvasH * 0.52;
}

export function getVesselMetrics(
  vesselId: VesselId,
  canvasW: number,
  canvasH: number,
  showPipes = false
): VesselMetrics {
  const maxHFactor = showPipes ? 0.52 : 0.62;
  const scale = Math.min(canvasW / 355, (canvasH * maxHFactor) / 195, 1.08);
  switch (vesselId) {
    case 'flask':
      return {topW: 52 * scale, botW: 168 * scale, height: 196 * scale, neckH: 48 * scale, stemH: 0, scale};
    case 'highball':
      return {topW: 110 * scale, botW: 98 * scale, height: 210 * scale, neckH: 0, stemH: 0, scale};
    case 'lotus':
      return {topW: 194 * scale, botW: 98 * scale, height: 156 * scale, neckH: 0, stemH: 0, scale};
    case 'chalice':
      return {topW: 156 * scale, botW: 84 * scale, height: 142 * scale, neckH: 0, stemH: 52 * scale, scale};
    case 'amphora':
      return {topW: 62 * scale, botW: 150 * scale, height: 198 * scale, neckH: 44 * scale, stemH: 0, scale};
    case 'tumbler':
    default:
      /* Matches Gameplay Mockup Wide Rounded Crystal Mixing Bowl */
      return {topW: 212 * scale, botW: 112 * scale, height: 178 * scale, neckH: 0, stemH: 0, scale};
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
  const cornerR = 20 * m.scale;

  ctx.beginPath();
  if (vesselId === 'flask') {
    const shoulderY = topY + m.neckH;
    ctx.moveTo(-halfTop, topY);
    ctx.lineTo(-halfTop, shoulderY);
    ctx.quadraticCurveTo(-halfBot * 1.08, shoulderY + 32 * m.scale, -halfBot, botY - cornerR);
    ctx.quadraticCurveTo(-halfBot, botY, -halfBot + cornerR, botY);
    ctx.lineTo(halfBot - cornerR, botY);
    ctx.quadraticCurveTo(halfBot, botY, halfBot, botY - cornerR);
    ctx.quadraticCurveTo(halfBot * 1.08, shoulderY + 32 * m.scale, halfTop, shoulderY);
    ctx.lineTo(halfTop, topY);
  } else if (vesselId === 'highball') {
    ctx.moveTo(-halfTop, topY);
    ctx.lineTo(-halfBot, botY - cornerR);
    ctx.quadraticCurveTo(-halfBot, botY, -halfBot + cornerR, botY);
    ctx.lineTo(halfBot - cornerR, botY);
    ctx.quadraticCurveTo(halfBot, botY, halfBot, botY - cornerR);
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
      shoulderY + 26 * m.scale,
      -halfBot * 1.05,
      botY - 24 * m.scale,
      -halfBot * 0.56,
      botY
    );
    ctx.lineTo(halfBot * 0.56, botY);
    ctx.bezierCurveTo(
      halfBot * 1.05,
      botY - 24 * m.scale,
      halfBot * 1.2,
      shoulderY + 26 * m.scale,
      halfTop * 0.88,
      shoulderY
    );
    ctx.lineTo(halfTop * 1.15, topY);
  } else {
    /* Wide Rounded Crystal Mixing Bowl matching Gameplay Mockup */
    ctx.moveTo(-halfTop, topY);
    ctx.bezierCurveTo(
      -halfTop * 1.04,
      topY + m.height * 0.56,
      -halfBot * 1.22,
      botY,
      -halfBot * 0.62,
      botY
    );
    ctx.lineTo(halfBot * 0.62, botY);
    ctx.bezierCurveTo(
      halfBot * 1.22,
      botY,
      halfTop * 1.04,
      topY + m.height * 0.56,
      halfTop,
      topY
    );
  }
}

export interface LiquidSceneState {
  vesselId: VesselId;
  palette: PaletteDef;
  liquidFinish?: LiquidFinishId;
  drops: DyeCode[];
  isLayered?: boolean;
  bottomDrops?: DyeCode[];
  topDrops?: DyeCode[];
  overMix?: number;
  fallingDrops: FallingDrop[];
  pigmentClouds: PigmentCloud[];
  ripples: SurfaceRipple[];
  tiltAngle: number;
  swirlEnergy: number;
  wavePhase: number;
  showPipes?: boolean;
  pipePulses?: Record<PrimaryDyeCode, number>;
  pipeRailOffset?: number;
}

function blendTwoRgb(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

/* Draws the 3 Vertical Glass Color Pipes (Blue, Yellow, Pink) on a smooth horizontal sliding rail */
function drawColorPipes(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  palette: PaletteDef,
  wavePhase: number,
  pipePulses: Record<PrimaryDyeCode, number>,
  railOffset = 0
): void {
  const pipes = getColorPipeLayout(width, height, railOffset);
  const ink = '#174859';

  // Subtle Metallic Overhead Sliding Rail Track beneath the HUD card
  const railGrad = ctx.createLinearGradient(0, 0, 0, 10);
  railGrad.addColorStop(0, '#133D4C');
  railGrad.addColorStop(0.5, '#33768C');
  railGrad.addColorStop(1, '#194D5E');
  ctx.fillStyle = railGrad;
  ctx.fillRect(0, 1, width, 7);
  ctx.strokeStyle = ink;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(0, 8);
  ctx.lineTo(width, 8);
  ctx.stroke();

  const cx = width / 2;

  for (const pipe of pipes) {
    const pulse = Math.max(0, Math.min(1, pipePulses[pipe.code] || 0));
    const isCentered = Math.abs(pipe.x - cx) < 18;
    const rgb = palette[pipe.code];
    const fillCol = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    const lightCol = `rgb(${Math.min(255, rgb[0] + 45)}, ${Math.min(255, rgb[1] + 45)}, ${Math.min(255, rgb[2] + 45)})`;
    const darkCol = `rgb(${Math.max(0, rgb[0] - 28)}, ${Math.max(0, rgb[1] - 28)}, ${Math.max(0, rgb[2] - 28)})`;

    const halfW = pipe.width / 2;
    const bounceY = pulse * 3.5;

    ctx.save();
    ctx.translate(pipe.x, pipe.topY + bounceY);

    // Subtle Active Halo beneath the Centered Pipe aligned over the Jar
    if (isCentered) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.34)';
      ctx.beginPath();
      ctx.ellipse(0, pipe.height + 5, halfW + 10, 9, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Subtle Drop Shadow below Bottom Pipe Rim
    ctx.fillStyle = 'rgba(18, 72, 88, 0.2)';
    ctx.beginPath();
    ctx.ellipse(0, pipe.height + 6, halfW + 7, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Translucent Glass Cylinder Body
    const tubeGrad = ctx.createLinearGradient(-halfW, 0, halfW, 0);
    tubeGrad.addColorStop(0, 'rgba(176, 232, 252, 0.72)');
    tubeGrad.addColorStop(0.28, 'rgba(246, 253, 255, 0.85)');
    tubeGrad.addColorStop(0.7, 'rgba(184, 236, 255, 0.56)');
    tubeGrad.addColorStop(1, 'rgba(130, 206, 236, 0.72)');

    ctx.fillStyle = tubeGrad;
    ctx.strokeStyle = ink;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.rect(-halfW, 4, pipe.width, pipe.height - 6);
    ctx.fill();
    ctx.stroke();

    // Liquid Column Inside Pipe (dips slightly during pulse!)
    const liquidTop = pipe.height * (0.44 + pulse * 0.14);
    const liquidBot = pipe.height - 4;
    const liquidInnerW = pipe.width - 7;
    const liqHalfW = liquidInnerW / 2;

    const liqGrad = ctx.createLinearGradient(-liqHalfW, 0, liqHalfW, 0);
    liqGrad.addColorStop(0, fillCol);
    liqGrad.addColorStop(0.4, lightCol);
    liqGrad.addColorStop(1, darkCol);

    ctx.fillStyle = liqGrad;
    ctx.beginPath();
    ctx.roundRect(-liqHalfW, liquidTop, liquidInnerW, Math.max(10, liquidBot - liquidTop), 4);
    ctx.fill();

    // Liquid Meniscus Top Ellipse
    ctx.fillStyle = lightCol;
    ctx.beginPath();
    ctx.ellipse(
      0,
      liquidTop + Math.sin(wavePhase * 1.4 + pipe.x) * 1.2,
      liqHalfW,
      4.5,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Vertical Glass Gloss Reflection Strip
    ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
    ctx.beginPath();
    ctx.roundRect(-halfW + 4.5, 10, 5.5, pipe.height - 20, 3);
    ctx.fill();

    // Top Dark-Teal Metallic Collar (anchored to HUD bottom)
    const collarGrad = ctx.createLinearGradient(-halfW - 6, 0, halfW + 6, 0);
    collarGrad.addColorStop(0, '#1B4F62');
    collarGrad.addColorStop(0.35, '#4A8FA6');
    collarGrad.addColorStop(0.75, '#256074');
    collarGrad.addColorStop(1, '#143C4B');

    ctx.fillStyle = collarGrad;
    ctx.strokeStyle = ink;
    ctx.lineWidth = 2.3;
    ctx.beginPath();
    ctx.ellipse(0, 6, halfW + 6, 7.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Bottom Metallic Nozzle Collar
    ctx.fillStyle = collarGrad;
    ctx.beginPath();
    ctx.ellipse(0, pipe.height - 1, halfW + 6, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Inner bright ring on bottom collar
    ctx.strokeStyle = 'rgba(204, 245, 255, 0.75)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.ellipse(0, pipe.height - 2.5, halfW + 2, 4.5, 0, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();

    // Squeezing Droplet Glow at Nozzle when freshly triggered
    if (pulse > 0.15) {
      ctx.fillStyle = fillCol;
      ctx.strokeStyle = ink;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, pipe.height + 5, 4.5 + pulse * 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    ctx.restore();
  }
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

  const showPipes = Boolean(scene.showPipes);
  const cx = width / 2;
  const cy = getVesselCenterY(height, showPipes);
  const m = getVesselMetrics(scene.vesselId, width, height, showPipes);
  const topY = -m.height / 2 - (m.stemH ? m.stemH * 0.35 : 0);
  const botY = m.height / 2 - (m.stemH ? m.stemH * 0.35 : 0);
  const baseShadowY = m.stemH ? botY + m.stemH + 8 : botY + 8;
  const ink = '#174859';

  // Soft Ground Shadow beneath Bowl/Glass on Meadow
  ctx.save();
  ctx.translate(cx, cy + baseShadowY);
  ctx.fillStyle = 'rgba(18, 92, 74, 0.34)';
  ctx.beginPath();
  ctx.ellipse(0, 0, m.topW * 0.52, 13 * m.scale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Falling Droplets (drawn behind pipes so they visibly emerge out of pipe mouth!)
  for (const d of scene.fallingDrops) {
    ctx.save();
    ctx.fillStyle = `rgb(${d.rgb[0]}, ${d.rgb[1]}, ${d.rgb[2]})`;
    ctx.strokeStyle = ink;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(d.x, d.y - d.radius * 1.6);
    ctx.bezierCurveTo(
      d.x + d.radius * 1.05,
      d.y - d.radius * 0.15,
      d.x + d.radius * 1.05,
      d.y + d.radius,
      d.x,
      d.y + d.radius
    );
    ctx.bezierCurveTo(
      d.x - d.radius * 1.05,
      d.y + d.radius,
      d.x - d.radius * 1.05,
      d.y - d.radius * 0.15,
      d.x,
      d.y - d.radius * 1.6
    );
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.88)';
    ctx.beginPath();
    ctx.arc(d.x - 2.6, d.y + 0.8, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Draw the 3 Glass Color Pipes on their sliding overhead rail
  if (showPipes) {
    drawColorPipes(
      ctx,
      width,
      height,
      scene.palette,
      scene.wavePhase,
      scene.pipePulses || {B: 0, Y: 0, R: 0},
      scene.pipeRailOffset ?? 0
    );
  }

  // Tilted Glass Coordinate Space
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((scene.tiltAngle * Math.PI) / 180);

  // Decorative Handles for Royal Amphora
  if (scene.vesselId === 'amphora') {
    ctx.save();
    ctx.strokeStyle = ink;
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
      ctx.strokeStyle = '#FFD347';
      ctx.lineWidth = 4.5 * m.scale;
      ctx.stroke();
      ctx.strokeStyle = ink;
      ctx.lineWidth = 9 * m.scale;
    });
    ctx.restore();
  }

  // Stem & Foot for Crystal Chalice
  if (scene.vesselId === 'chalice') {
    ctx.save();
    ctx.fillStyle = '#E6FAFF';
    ctx.strokeStyle = ink;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(-7 * m.scale, botY - 4, 14 * m.scale, m.stemH, 4);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(0, botY + m.stemH - 2, m.botW * 0.54, 10 * m.scale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // Translucent Sky-Tinted Back Glass Fill (Matches Gameplay Mockup Crystal Bowl)
  traceVesselInterior(ctx, scene.vesselId, m);
  const backGlassGrad = ctx.createLinearGradient(-m.topW / 2, topY, m.topW / 2, botY);
  backGlassGrad.addColorStop(0, 'rgba(210, 246, 255, 0.64)');
  backGlassGrad.addColorStop(0.5, 'rgba(235, 252, 255, 0.48)');
  backGlassGrad.addColorStop(1, 'rgba(176, 232, 252, 0.68)');
  ctx.fillStyle = backGlassGrad;
  ctx.fill();

  // Clip Interior for Liquid, Layered Waves, Bubbles & Pigment Clouds
  ctx.save();
  traceVesselInterior(ctx, scene.vesselId, m);
  ctx.clip();

  const waterTopY =
    topY + m.height * (scene.vesselId === 'flask' || scene.vesselId === 'amphora' ? 0.38 : 0.34);
  const waterBotY = botY + 14;
  const midY = waterTopY + (botY - waterTopY) * 0.5;
  const waveW = Math.max(m.topW, m.botW) * 1.45;

  // Counter-rotate water surface so liquid stays level when tilted
  ctx.save();
  ctx.rotate(((-scene.tiltAngle * Math.PI) / 180) * 0.72);

  if (scene.isLayered) {
    const bDrops = scene.bottomDrops || [];
    const tDrops = scene.topDrops || [];
    const rawBot = bDrops.length > 0 ? getRecipeRgb(bDrops, scene.palette) : [176, 234, 255];
    const rawTop = tDrops.length > 0 ? getRecipeRgb(tDrops, scene.palette) : [204, 244, 255];
    const mud = blendTwoRgb(rawBot as [number, number, number], rawTop as [number, number, number], 0.5);
    const overMix = Math.max(0, Math.min(1, scene.overMix || 0));

    const visBot = blendTwoRgb(rawBot as [number, number, number], mud, overMix * 0.85);
    const visTop = blendTwoRgb(rawTop as [number, number, number], mud, overMix * 0.85);

    const hasAny = bDrops.length > 0 || tDrops.length > 0;
    const baseAlpha = !hasAny ? 0.56 : 0.76 + scene.swirlEnergy * 0.22;

    const bandSpread = 0.06 + overMix * 0.36;
    const liqGrad = ctx.createLinearGradient(0, waterTopY, 0, botY);
    liqGrad.addColorStop(0, `rgba(${visTop[0]}, ${visTop[1]}, ${visTop[2]}, ${baseAlpha})`);
    liqGrad.addColorStop(
      Math.max(0.05, 0.5 - bandSpread),
      `rgba(${visTop[0]}, ${visTop[1]}, ${visTop[2]}, ${Math.min(0.98, baseAlpha + 0.06)})`
    );
    liqGrad.addColorStop(
      Math.min(0.95, 0.5 + bandSpread),
      `rgba(${visBot[0]}, ${visBot[1]}, ${visBot[2]}, ${Math.min(0.98, baseAlpha + 0.08)})`
    );
    liqGrad.addColorStop(1, `rgba(${visBot[0]}, ${visBot[1]}, ${visBot[2]}, ${Math.min(0.99, baseAlpha + 0.12)})`);

    ctx.fillStyle = liqGrad;
    ctx.beginPath();
    ctx.moveTo(-waveW, waterTopY);
    for (let wx = -waveW; wx <= waveW; wx += 12) {
      const wy =
        waterTopY +
        Math.sin(wx * 0.044 + scene.wavePhase) * (3.2 + Math.abs(scene.tiltAngle) * 0.14);
      ctx.lineTo(wx, wy);
    }
    ctx.lineTo(waveW, waterBotY + 45);
    ctx.lineTo(-waveW, waterBotY + 45);
    ctx.closePath();
    ctx.fill();

    if (overMix < 0.75) {
      ctx.strokeStyle = `rgba(255, 255, 255, ${(1 - overMix) * 0.65})`;
      ctx.lineWidth = 2.4;
      ctx.setLineDash([7, 5]);
      ctx.beginPath();
      for (let wx = -waveW; wx <= waveW; wx += 14) {
        const wy =
          midY +
          Math.sin(wx * 0.048 - scene.wavePhase * 0.85) * (3 + Math.abs(scene.tiltAngle) * 0.18);
        if (wx === -waveW) ctx.moveTo(wx, wy);
        else ctx.lineTo(wx, wy);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }
  } else {
    const blendedRGB: [number, number, number] =
      scene.drops.length > 0 ? getRecipeRgb(scene.drops, scene.palette) : [180, 236, 255];

    const baseMixAlpha = scene.drops.length === 0 ? 0.52 : 0.72 + scene.swirlEnergy * 0.25;
    const liqGrad = ctx.createLinearGradient(0, waterTopY, 0, waterBotY);
    liqGrad.addColorStop(
      0,
      `rgba(${Math.min(255, blendedRGB[0] + 18)}, ${Math.min(255, blendedRGB[1] + 18)}, ${Math.min(
        255,
        blendedRGB[2] + 18
      )}, ${baseMixAlpha})`
    );
    liqGrad.addColorStop(
      1,
      `rgba(${Math.max(0, blendedRGB[0] - 24)}, ${Math.max(0, blendedRGB[1] - 24)}, ${Math.max(
        0,
        blendedRGB[2] - 24
      )}, ${Math.min(0.98, baseMixAlpha + 0.14)})`
    );

    ctx.fillStyle = liqGrad;
    ctx.beginPath();
    ctx.moveTo(-waveW, waterTopY);
    for (let wx = -waveW; wx <= waveW; wx += 12) {
      const wy =
        waterTopY +
        Math.sin(wx * 0.044 + scene.wavePhase) * (3.2 + Math.abs(scene.tiltAngle) * 0.14);
      ctx.lineTo(wx, wy);
    }
    ctx.lineTo(waveW, waterBotY + 45);
    ctx.lineTo(-waveW, waterBotY + 45);
    ctx.closePath();
    ctx.fill();

    // Subtle Layered Ribbon Bands while drops are actively swirling in (resembles mockup wavy bands!)
    if (scene.drops.length >= 2 && scene.swirlEnergy < 0.92) {
      const bandOpacity = Math.max(0, (1 - scene.swirlEnergy) * 0.65);
      const uniqueDrops = scene.drops.slice(-3);
      uniqueDrops.forEach((code, idx) => {
        const cRgb = getRecipeRgb([code], scene.palette);
        const bandY = waterTopY + ((idx + 0.7) / (uniqueDrops.length + 0.5)) * (botY - waterTopY);
        ctx.fillStyle = `rgba(${cRgb[0]}, ${cRgb[1]}, ${cRgb[2]}, ${bandOpacity})`;
        ctx.beginPath();
        ctx.moveTo(-waveW, bandY);
        for (let wx = -waveW; wx <= waveW; wx += 14) {
          const wy = bandY + Math.sin(wx * 0.05 + scene.wavePhase + idx * 1.4) * 5.2;
          ctx.lineTo(wx, wy);
        }
        ctx.lineTo(waveW, bandY + 24);
        ctx.lineTo(-waveW, bandY + 24);
        ctx.closePath();
        ctx.fill();
      });
    }
  }

  // Crisp Glossy Meniscus Surface Highlight Wave
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.82)';
  ctx.lineWidth = 3.2;
  ctx.beginPath();
  for (let wx = -waveW; wx <= waveW; wx += 12) {
    const wy =
      waterTopY +
      Math.sin(wx * 0.044 + scene.wavePhase) * (3.2 + Math.abs(scene.tiltAngle) * 0.14);
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

  // Sparkling Cartoon Air Bubbles & Equipped Liquid Finish Toppings inside Liquid
  const liqH = Math.max(30, botY - waterTopY);
  const finish = scene.liquidFinish || 'classic';

  if (finish === 'pearlescent') {
    // Silky sweeping iridescent pearl sheen ribbons + pearl shimmer flecks
    ctx.save();
    const sweep = Math.sin(scene.wavePhase * 0.55) * m.topW * 0.45 + scene.tiltAngle * 1.4;
    const pearlGrad = ctx.createLinearGradient(
      -m.topW * 0.65 + sweep,
      waterTopY,
      m.topW * 0.65 + sweep,
      botY
    );
    pearlGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    pearlGrad.addColorStop(0.24, 'rgba(255, 224, 248, 0.34)');
    pearlGrad.addColorStop(0.42, 'rgba(255, 255, 255, 0.52)');
    pearlGrad.addColorStop(0.6, 'rgba(186, 245, 255, 0.34)');
    pearlGrad.addColorStop(0.78, 'rgba(255, 246, 198, 0.24)');
    pearlGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = pearlGrad;
    ctx.fillRect(-m.topW, waterTopY - 6, m.topW * 2, liqH + 22);

    // Subtle secondary diagonal satin ribbon
    const sweep2 = Math.cos(scene.wavePhase * 0.38 + 1.2) * m.topW * 0.35;
    const satinGrad = ctx.createLinearGradient(
      -m.topW * 0.5 - sweep2,
      waterTopY + liqH * 0.2,
      m.topW * 0.5 - sweep2,
      botY
    );
    satinGrad.addColorStop(0, 'rgba(255,255,255,0)');
    satinGrad.addColorStop(0.5, 'rgba(255,255,255,0.28)');
    satinGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = satinGrad;
    ctx.fillRect(-m.topW, waterTopY, m.topW * 2, liqH + 14);

    // Tiny pearlescent micro-sparkles
    for (let i = 0; i < 14; i++) {
      const fx =
        Math.sin(i * 2.1 + scene.wavePhase * 0.4) * m.botW * 0.42 +
        Math.cos(i * 1.3) * 10 * m.scale;
      const fy =
        waterTopY +
        14 +
        (((i * 29 + scene.wavePhase * 5.5) % Math.max(20, liqH - 22)));
      const shimmerAlpha = 0.35 + 0.55 * (0.5 + 0.5 * Math.sin(scene.wavePhase * 2.2 + i * 1.7));
      ctx.fillStyle =
        i % 3 === 0
          ? `rgba(255, 255, 255, ${shimmerAlpha})`
          : i % 3 === 1
          ? `rgba(255, 218, 246, ${shimmerAlpha})`
          : `rgba(205, 252, 255, ${shimmerAlpha})`;
      ctx.beginPath();
      ctx.arc(fx, fy, (1.8 + (i % 3) * 0.85) * m.scale, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  if (finish === 'aurora_bubbles') {
    // Glowing holographic aurora light curtains inside liquid
    ctx.save();
    for (let band = 0; band < 2; band++) {
      const bandY = waterTopY + liqH * (0.34 + band * 0.28);
      const aurGrad = ctx.createLinearGradient(-m.topW * 0.55, bandY, m.topW * 0.55, bandY);
      aurGrad.addColorStop(0, 'rgba(92, 255, 214, 0)');
      aurGrad.addColorStop(0.28, band === 0 ? 'rgba(92, 255, 214, 0.32)' : 'rgba(130, 188, 255, 0.28)');
      aurGrad.addColorStop(0.55, 'rgba(196, 134, 255, 0.34)');
      aurGrad.addColorStop(0.8, 'rgba(116, 248, 255, 0.28)');
      aurGrad.addColorStop(1, 'rgba(92, 255, 214, 0)');
      ctx.strokeStyle = aurGrad;
      ctx.lineWidth = 14 * m.scale;
      ctx.lineCap = 'round';
      ctx.beginPath();
      for (let wx = -m.topW * 0.55; wx <= m.topW * 0.55; wx += 14) {
        const wy =
          bandY +
          Math.sin(wx * 0.045 + scene.wavePhase * (0.9 + band * 0.3) + band * 2) * 8 * m.scale;
        if (wx === -m.topW * 0.55) ctx.moveTo(wx, wy);
        else ctx.lineTo(wx, wy);
      }
      ctx.stroke();
    }

    const auroraSeeds = [
      {ox: -44, spd: 12, r: 6.2, ph: 0.3, hue: 168},
      {ox: 34, spd: 15, r: 7.4, ph: 1.6, hue: 282},
      {ox: -12, spd: 10, r: 5.5, ph: 2.9, hue: 196},
      {ox: 48, spd: 13, r: 5.8, ph: 4.1, hue: 318},
      {ox: -26, spd: 16, r: 6.8, ph: 5.2, hue: 152},
      {ox: 12, spd: 11, r: 4.9, ph: 3.7, hue: 242},
      {ox: -5, spd: 14, r: 6.0, ph: 0.9, hue: 184},
    ];
    for (const ab of auroraSeeds) {
      const progress = ((scene.wavePhase * ab.spd + ab.ph * 26) % liqH) / liqH;
      const bx =
        ab.ox * m.scale +
        Math.sin(scene.wavePhase * 1.1 + ab.ph) * 6 +
        scene.tiltAngle * 0.45;
      const by = botY - 10 - progress * (liqH - 12);
      const radius = ab.r * m.scale;
      const hue = (ab.hue + scene.wavePhase * 18) % 360;

      // Soft outer aurora glow
      const halo = ctx.createRadialGradient(bx, by, radius * 0.2, bx, by, radius * 1.9);
      halo.addColorStop(0, `hsla(${hue}, 96%, 78%, 0.52)`);
      halo.addColorStop(0.6, `hsla(${(hue + 50) % 360}, 92%, 70%, 0.22)`);
      halo.addColorStop(1, `hsla(${hue}, 96%, 72%, 0)`);
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(bx, by, radius * 1.9, 0, Math.PI * 2);
      ctx.fill();

      // Bubble rim & crescent highlight
      ctx.fillStyle = `hsla(${hue}, 95%, 86%, 0.32)`;
      ctx.strokeStyle = `hsla(${(hue + 35) % 360}, 100%, 84%, 0.92)`;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(bx, by, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
      ctx.beginPath();
      ctx.arc(bx - radius * 0.32, by - radius * 0.32, radius * 0.26, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  } else {
    // Classic sunlit cartoon air bubbles
    const bubbleSeeds = [
      {ox: -36, spd: 11, r: 4.2, ph: 0.4},
      {ox: 28, spd: 14, r: 5.0, ph: 1.9},
      {ox: -8, spd: 9, r: 3.6, ph: 3.1},
      {ox: 46, spd: 12, r: 3.8, ph: 4.5},
      {ox: -22, spd: 15, r: 4.6, ph: 5.4},
    ];
    for (const b of bubbleSeeds) {
      const progress = ((scene.wavePhase * b.spd + b.ph * 25) % liqH) / liqH;
      const bx = b.ox * m.scale + Math.sin(scene.wavePhase * 0.9 + b.ph) * 4;
      const by = botY - 12 - progress * (liqH - 14);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.36)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(bx, by, b.r * m.scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }

  if (finish === 'star_confetti') {
    // Floating rotating pastel 4-point & 5-point star confetti drifting inside the dye
    const stars = [
      {ox: -46, oy: 0.22, r: 7.2, spd: 0.7, ph: 0.2, col: '#FFF27A', pts: 5},
      {ox: 38, oy: 0.3, r: 6.4, spd: -0.9, ph: 1.1, col: '#FFFFFF', pts: 4},
      {ox: -14, oy: 0.45, r: 8.0, spd: 0.65, ph: 2.3, col: '#FFB3DC', pts: 5},
      {ox: 18, oy: 0.66, r: 6.8, spd: -0.8, ph: 3.0, col: '#A8FFEA', pts: 4},
      {ox: -36, oy: 0.74, r: 7.4, spd: 0.85, ph: 4.2, col: '#FFE066', pts: 5},
      {ox: 44, oy: 0.78, r: 6.0, spd: -0.75, ph: 5.1, col: '#FFFFFF', pts: 5},
      {ox: 2, oy: 0.24, r: 5.8, spd: 1.0, ph: 1.7, col: '#FFD4F4', pts: 4},
      {ox: -24, oy: 0.56, r: 5.5, spd: -0.95, ph: 3.9, col: '#FFF6B0', pts: 4},
      {ox: 28, oy: 0.48, r: 7.0, spd: 0.72, ph: 2.8, col: '#FFF27A', pts: 5},
      {ox: -4, oy: 0.84, r: 6.6, spd: -0.6, ph: 0.8, col: '#FFFFFF', pts: 4},
    ];
    ctx.save();
    for (const st of stars) {
      const sx =
        st.ox * m.scale +
        Math.sin(scene.wavePhase * 0.7 + st.ph) * 7 * m.scale +
        scene.tiltAngle * 0.65;
      const sy =
        waterTopY +
        12 +
        st.oy * Math.max(24, liqH - 22) +
        Math.cos(scene.wavePhase * 0.85 + st.ph) * 5 * m.scale;
      const rot = scene.wavePhase * st.spd * 0.45 + st.ph + scene.tiltAngle * 0.03;
      const outerR = st.r * m.scale;
      const innerR = outerR * (st.pts === 4 ? 0.36 : 0.46);

      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(rot);
      ctx.fillStyle = st.col;
      ctx.strokeStyle = 'rgba(23, 72, 89, 0.55)';
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      for (let p = 0; p < st.pts * 2; p++) {
        const ang = (p * Math.PI) / st.pts - Math.PI / 2;
        const rad = p % 2 === 0 ? outerR : innerR;
        const px = Math.cos(ang) * rad;
        const py = Math.sin(ang) * rad;
        if (p === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
  }

  if (finish === 'boba_pearls') {
    // Glossy chewy brown-sugar boba pearls settled at the base, rolling smoothly with tilt
    const bobaSeeds = [
      {ox: -36, row: 0, r: 8.6, ph: 0.2},
      {ox: -20, row: 0, r: 9.2, ph: 1.4},
      {ox: -3, row: 0, r: 8.8, ph: 2.1},
      {ox: 14, row: 0, r: 9.4, ph: 3.3},
      {ox: 31, row: 0, r: 8.6, ph: 4.0},
      {ox: -28, row: 1, r: 8.4, ph: 0.9},
      {ox: -10, row: 1, r: 8.9, ph: 2.7},
      {ox: 8, row: 1, r: 8.5, ph: 3.8},
      {ox: 24, row: 1, r: 8.2, ph: 5.0},
      {ox: -1, row: 2, r: 8.0, ph: 1.8},
    ];
    ctx.save();
    const tiltShift = Math.max(-22, Math.min(22, scene.tiltAngle * 0.9)) * m.scale;
    const bounceBoost = Math.abs(scene.tiltAngle) * 0.28 + (1 - scene.swirlEnergy) * 2.5;
    for (const bp of bobaSeeds) {
      const r = bp.r * m.scale;
      const bx =
        bp.ox * m.scale +
        tiltShift +
        Math.sin(scene.wavePhase * 0.75 + bp.ph) * (1.8 + bounceBoost * 0.35);
      const baseRowY = botY - 11 * m.scale - bp.row * 13.5 * m.scale;
      const by =
        baseRowY -
        Math.abs(Math.sin(scene.wavePhase * 0.9 + bp.ph)) * (1.6 + bounceBoost * 0.45);

      const bobaGrad = ctx.createRadialGradient(bx - r * 0.28, by - r * 0.28, r * 0.1, bx, by, r);
      bobaGrad.addColorStop(0, '#6B4230');
      bobaGrad.addColorStop(0.45, '#3E2218');
      bobaGrad.addColorStop(1, '#1F0E0A');

      ctx.fillStyle = bobaGrad;
      ctx.strokeStyle = '#174859';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(bx, by, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Glossy specular shine dot on each boba pearl
      ctx.fillStyle = 'rgba(255, 240, 224, 0.82)';
      ctx.beginPath();
      ctx.ellipse(bx - r * 0.3, by - r * 0.3, r * 0.28, r * 0.17, -0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // Impact Ripples
  for (const rip of scene.ripples) {
    ctx.strokeStyle = `rgba(255, 255, 255, ${rip.alpha})`;
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.ellipse(rip.x, waterTopY + 2, rip.radius, rip.radius * 0.25, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Lotus Engraving
  if (scene.vesselId === 'lotus') {
    ctx.strokeStyle = 'rgba(23, 72, 89, 0.22)';
    ctx.lineWidth = 2;
    [-36, 0, 36].forEach((ox) => {
      ctx.beginPath();
      ctx.ellipse(
        ox * m.scale,
        botY - 34 * m.scale,
        20 * m.scale,
        34 * m.scale,
        ox * 0.008,
        0,
        Math.PI * 2
      );
      ctx.stroke();
    });
  }

  ctx.restore(); // End vessel clip

  // Crisp Cartoon Dark-Teal Vector Outline around Glass
  traceVesselInterior(ctx, scene.vesselId, m);
  ctx.strokeStyle = ink;
  ctx.lineWidth = 3.4;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.stroke();

  // Thick Glossy Left Specular Band (Matches Mockup Glass Reflection!)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.72)';
  ctx.lineWidth = 10 * m.scale;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-m.topW * 0.33, topY + m.height * 0.14);
  ctx.quadraticCurveTo(-m.topW * 0.3, topY + m.height * 0.55, -m.botW * 0.32, botY - m.height * 0.16);
  ctx.stroke();

  // Subtle Right Specular Glint
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 4.5 * m.scale;
  ctx.beginPath();
  ctx.moveTo(m.topW * 0.36, topY + m.height * 0.18);
  ctx.quadraticCurveTo(m.topW * 0.34, topY + m.height * 0.52, m.botW * 0.38, botY - m.height * 0.22);
  ctx.stroke();

  // Top Rim Glass Ellipse
  ctx.fillStyle = 'rgba(224, 250, 255, 0.65)';
  ctx.strokeStyle = ink;
  ctx.lineWidth = 2.8;
  ctx.beginPath();
  ctx.ellipse(
    0,
    topY,
    scene.vesselId === 'amphora' ? m.topW * 0.58 : m.topW / 2,
    8.5 * m.scale,
    0,
    0,
    Math.PI * 2
  );
  ctx.fill();
  ctx.stroke();

  // Inner bright glass rim sheen
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, topY + 1, m.topW * 0.44, 5 * m.scale, 0, 0.08 * Math.PI, 0.92 * Math.PI);
  ctx.stroke();

  ctx.restore();
}

// Generates a downloadable Studio Polaroid PNG WITH the color HEX code(s) & recipe burned in!
export function generateSnapshotCardDataUrl(params: {
  vesselId: VesselId;
  palette: PaletteDef;
  liquidFinish?: LiquidFinishId;
  drops: DyeCode[];
  isLayered?: boolean;
  bottomDrops?: DyeCode[];
  topDrops?: DyeCode[];
  overMix?: number;
  levelName: string;
  typeName: string;
  hexCode: string;
  topHexCode?: string;
  bottomHexCode?: string;
  matchPercent: number;
  recipeText: string;
  stageBg: string;
  accentColor: string;
}): string {
  const w = 640;
  const h = 790;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Pastel Mint-Aqua Backdrop matching the world art style
  const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
  bgGrad.addColorStop(0, '#78E8D8');
  bgGrad.addColorStop(0.55, '#C4FBF0');
  bgGrad.addColorStop(1, '#92E8C8');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Outer Card Frame (Soft Frosted Mint-Aqua instead of stark white)
  const cardGrad = ctx.createLinearGradient(0, 28, 0, h - 28);
  cardGrad.addColorStop(0, '#D8FDF6');
  cardGrad.addColorStop(1, '#AEF3E4');
  ctx.fillStyle = cardGrad;
  ctx.strokeStyle = '#18495A';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.roundRect(28, 28, w - 56, h - 56, 32);
  ctx.fill();
  ctx.stroke();

  // Header Row
  ctx.fillStyle = '#164454';
  ctx.font = '700 24px "Fredoka", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('DYE DROP STUDIO', 56, 78);

  // Glossy Lime Match Pill
  ctx.fillStyle = '#5DD928';
  ctx.strokeStyle = '#175438';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(w - 216, 46, 158, 44, 22);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 19px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`${params.matchPercent}% MATCH`, w - 137, 75);

  // Inner Glass Stage Window
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(52, 108, w - 104, 412, 24);
  ctx.clip();

  const stageGrad = ctx.createLinearGradient(0, 108, 0, 520);
  stageGrad.addColorStop(0, '#A0F4E4');
  stageGrad.addColorStop(0.68, '#D7FCF5');
  stageGrad.addColorStop(1, '#68D99A');
  ctx.fillStyle = stageGrad;
  ctx.fillRect(52, 108, w - 104, 412);

  ctx.translate(52, 108);
  renderLiquidGlassScene(ctx, w - 104, 412, {
    vesselId: params.vesselId,
    palette: params.palette,
    liquidFinish: params.liquidFinish,
    drops: params.drops,
    isLayered: params.isLayered,
    bottomDrops: params.bottomDrops,
    topDrops: params.topDrops,
    overMix: params.overMix ?? 0.08,
    fallingDrops: [],
    pigmentClouds: [],
    ripples: [],
    tiltAngle: 0,
    swirlEnergy: 1,
    wavePhase: 0.7,
    showPipes: false,
  });
  ctx.restore();

  // Stage Inner Frame Outline
  ctx.strokeStyle = '#18495A';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.roundRect(52, 108, w - 104, 412, 24);
  ctx.stroke();

  // Bottom Color Swatch Bar + High-Contrast HEX Code
  const barY = 548;
  ctx.fillStyle = '#E0FBF6';
  ctx.strokeStyle = '#18495A';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.roundRect(52, barY, w - 104, 184, 24);
  ctx.fill();
  ctx.stroke();

  // Swatch Tile
  if (params.isLayered && params.topHexCode && params.bottomHexCode) {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(76, barY + 26, 128, 128, 22);
    ctx.clip();
    ctx.fillStyle = params.topHexCode;
    ctx.fillRect(76, barY + 26, 128, 64);
    ctx.fillStyle = params.bottomHexCode;
    ctx.fillRect(76, barY + 90, 128, 64);
    ctx.restore();
    ctx.strokeStyle = '#18495A';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.roundRect(76, barY + 26, 128, 128, 22);
    ctx.stroke();
  } else {
    ctx.fillStyle = params.hexCode;
    ctx.strokeStyle = '#18495A';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.roundRect(76, barY + 26, 128, 128, 22);
    ctx.fill();
    ctx.stroke();
  }

  // Color Title & High-Contrast HEX Pill
  ctx.textAlign = 'left';
  ctx.fillStyle = '#103D4D';
  ctx.font = '700 32px "Fredoka", sans-serif';
  ctx.fillText(params.levelName, 228, barY + 58);

  if (params.isLayered && params.topHexCode && params.bottomHexCode) {
    ctx.fillStyle = '#144353';
    ctx.beginPath();
    ctx.roundRect(228, barY + 72, 336, 40, 20);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 20px "JetBrains Mono", monospace';
    ctx.fillText(`T:${params.topHexCode.toUpperCase()}  B:${params.bottomHexCode.toUpperCase()}`, 244, barY + 99);
  } else {
    ctx.fillStyle = '#144353';
    ctx.beginPath();
    ctx.roundRect(228, barY + 72, 188, 42, 21);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 26px "JetBrains Mono", monospace';
    ctx.fillText(params.hexCode.toUpperCase(), 252, barY + 102);
  }

  ctx.fillStyle = '#1F5C6E';
  ctx.font = '700 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`${params.typeName} · ${params.recipeText}`, 228, barY + 148);

  return canvas.toDataURL('image/png');
}
