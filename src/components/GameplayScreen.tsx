import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  AlertTriangle,
  Home,
  Layers,
  LayoutGrid,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Undo2,
} from 'lucide-react';
import {audio} from '../game/audio';
import {
  MODIFIER_LABELS,
  colorSimilarity,
  evaluateLayeredMixResult,
  evaluateMixResult,
  formatLayeredRecipeText,
  formatRecipeText,
  getDyeRgb,
  getRecipeRgb,
  rgbToHex,
} from '../game/colorEngine';
import {LEVELS_BY_TYPE, LEVEL_TYPES, getLevelDef, getPaletteById} from '../game/data';
import type {
  DyeCode,
  LayerSlot,
  LevelTypeId,
  ModifierDyeCode,
  PrimaryDyeCode,
  SavedGameState,
} from '../game/types';
import {
  type FallingDrop,
  type PigmentCloud,
  type SurfaceRipple,
  generateSnapshotCardDataUrl,
  getColorPipeLayout,
  getPipeSpacing,
  getVesselCenterY,
  getVesselMetrics,
  renderLiquidGlassScene,
} from '../game/vesselRenderer';
import {
  ComicStarIcon,
  LightbulbTipIcon,
  MusicComicIcon,
  SoundComicIcon,
  TeardropColorIcon,
} from './ComicIcons';
import {PastelNatureBackdrop} from './PastelNatureBackdrop';

export interface GameplayResultPayload {
  passed: boolean;
  stars: number;
  matchPercent: number;
  hexCode: string;
  targetHex: string;
  isLayered: boolean;
  topHexCode?: string;
  bottomHexCode?: string;
  targetTopHex?: string;
  targetBottomHex?: string;
  overMixedFail?: boolean;
  recipeText: string;
  snapshotDataUrl: string;
  dropsUsed: DyeCode[];
  bottomDropsUsed?: DyeCode[];
  topDropsUsed?: DyeCode[];
}

interface GameplayScreenProps {
  gameState: SavedGameState;
  typeId: LevelTypeId;
  levelNumber: number;
  resetCounter: number;
  onBackToLobby: () => void;
  onOpenLevels: () => void;
  onChangeLevel: (levelNumber: number) => void;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  onDropAdded: () => void;
  onSwirlAction: () => void;
  onResult: (result: GameplayResultPayload) => void;
  onToast: (message: string) => void;
}

function blendRgbLocal(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] {
  const c = Math.max(0, Math.min(1, t));
  return [
    Math.round(a[0] + (b[0] - a[0]) * c),
    Math.round(a[1] + (b[1] - a[1]) * c),
    Math.round(a[2] + (b[2] - a[2]) * c),
  ];
}

export const GameplayScreen: React.FC<GameplayScreenProps> = ({
  gameState,
  typeId,
  levelNumber,
  resetCounter,
  onBackToLobby,
  onOpenLevels,
  onToggleSound,
  onToggleMusic,
  onDropAdded,
  onSwirlAction,
  onResult,
  onToast,
}) => {
  const theme = LEVEL_TYPES[typeId];
  const level = getLevelDef(typeId, levelNumber);
  const palette = getPaletteById(gameState.equippedPalette);
  const totalLevelsInPack = LEVELS_BY_TYPE[typeId].length;

  const isLayered = Boolean(level.isLayered && level.bottomRecipe && level.topRecipe);
  const maxDropsBottom = level.maxDropsBottom ?? Math.ceil(level.maxDrops / 2);
  const maxDropsTop = level.maxDropsTop ?? Math.floor(level.maxDrops / 2);

  // Modifier droppers unlocked in Triple / Layers / Rush / Color Grid
  const activeModifiers: ModifierDyeCode[] = [];
  if (theme.hasTintShade) {
    activeModifiers.push('W', 'K');
  }
  if (theme.hasDilute) {
    activeModifiers.push('D');
  }
  const hasModifiers = activeModifiers.length > 0;

  const targetRgb = getRecipeRgb(level.recipe, palette);
  const targetHex = rgbToHex(targetRgb);
  const targetBottomRgb = isLayered
    ? getRecipeRgb(level.bottomRecipe!, palette)
    : targetRgb;
  const targetTopRgb = isLayered
    ? getRecipeRgb(level.topRecipe!, palette)
    : targetRgb;
  const targetBottomHex = rgbToHex(targetBottomRgb);
  const targetTopHex = rgbToHex(targetTopRgb);

  const [drops, setDrops] = useState<DyeCode[]>([]);
  const [bottomDrops, setBottomDrops] = useState<DyeCode[]>([]);
  const [topDrops, setTopDrops] = useState<DyeCode[]>([]);
  const [activeLayer, setActiveLayer] = useState<LayerSlot>('bottom');
  const [overMixPct, setOverMixPct] = useState<number>(0);
  const [matchPct, setMatchPct] = useState<number>(0);
  const [isSwirlingCheck, setIsSwirlingCheck] = useState<boolean>(false);
  const [showPauseMenu, setShowPauseMenu] = useState<boolean>(false);
  const [activePipeCode, setActivePipeCode] = useState<PrimaryDyeCode>('Y');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const swirlTimerRef = useRef<number | null>(null);

  interface PendingPipeDrop {
    dyeType: DyeCode;
    pipeCode: PrimaryDyeCode;
    targetOffset: number;
    dropIndex: number;
    layer?: LayerSlot;
  }

  // Isolated 60fps liquid & sliding 3-pipe carriage simulation ref
  const simRef = useRef<{
    drops: DyeCode[];
    bottomDrops: DyeCode[];
    topDrops: DyeCode[];
    activeLayer: LayerSlot;
    overMix: number;
    fallingDrops: FallingDrop[];
    pendingDrops: PendingPipeDrop[];
    pigmentClouds: PigmentCloud[];
    ripples: SurfaceRipple[];
    pipePulses: Record<PrimaryDyeCode, number>;
    pipeRailOffset: number;
    targetPipeRailOffset: number;
    tiltAngle: number;
    targetTilt: number;
    swirlEnergy: number;
    wavePhase: number;
    selectedDyeForTap: DyeCode;
    isDragging: boolean;
    lastPointerX: number;
    pointerDownPos: {x: number; y: number} | null;
    canvasW: number;
    canvasH: number;
    resolved: boolean;
    isAutoSwirling: boolean;
  }>({
    drops: [],
    bottomDrops: [],
    topDrops: [],
    activeLayer: 'bottom',
    overMix: 0,
    fallingDrops: [],
    pendingDrops: [],
    pigmentClouds: [],
    ripples: [],
    pipePulses: {B: 0, Y: 0, R: 0},
    pipeRailOffset: 0,
    targetPipeRailOffset: 0,
    tiltAngle: 0,
    targetTilt: 0,
    swirlEnergy: 0,
    wavePhase: 0,
    selectedDyeForTap: 'Y',
    isDragging: false,
    lastPointerX: 0,
    pointerDownPos: null,
    canvasW: 360,
    canvasH: 380,
    resolved: false,
    isAutoSwirling: false,
  });

  const resetLiquidState = useCallback(() => {
    if (swirlTimerRef.current !== null) {
      window.clearInterval(swirlTimerRef.current);
      swirlTimerRef.current = null;
    }
    simRef.current.drops = [];
    simRef.current.bottomDrops = [];
    simRef.current.topDrops = [];
    simRef.current.activeLayer = 'bottom';
    simRef.current.overMix = 0;
    simRef.current.fallingDrops = [];
    simRef.current.pendingDrops = [];
    simRef.current.pigmentClouds = [];
    simRef.current.ripples = [];
    simRef.current.pipePulses = {B: 0, Y: 0, R: 0};
    simRef.current.pipeRailOffset = 0;
    simRef.current.targetPipeRailOffset = 0;
    simRef.current.tiltAngle = 0;
    simRef.current.targetTilt = 0;
    simRef.current.swirlEnergy = 0;
    simRef.current.resolved = false;
    simRef.current.isAutoSwirling = false;
    setDrops([]);
    setBottomDrops([]);
    setTopDrops([]);
    setActiveLayer('bottom');
    setActivePipeCode('Y');
    setOverMixPct(0);
    setMatchPct(0);
    setIsSwirlingCheck(false);
    setShowPauseMenu(false);
  }, []);

  useEffect(() => {
    resetLiquidState();
  }, [typeId, levelNumber, resetCounter, resetLiquidState]);

  useEffect(() => {
    return () => {
      if (swirlTimerRef.current !== null) {
        window.clearInterval(swirlTimerRef.current);
      }
    };
  }, []);

  const switchLayer = (layer: LayerSlot) => {
    if (isSwirlingCheck) return;
    audio.playClick();
    simRef.current.activeLayer = layer;
    setActiveLayer(layer);
  };

  const applySwirlImpulse = useCallback(
    (strength = 1.0, isGentleOverride = false) => {
      const sim = simRef.current;
      const totalCount = isLayered
        ? sim.bottomDrops.length + sim.topDrops.length
        : sim.drops.length;
      if (totalCount === 0) return;

      audio.playSwirl(strength);
      sim.swirlEnergy = Math.min(1, sim.swirlEnergy + 0.16 * strength);

      if (isLayered && !isGentleOverride && !sim.isAutoSwirling) {
        const hasBoth = sim.bottomDrops.length > 0 && sim.topDrops.length > 0;
        if (hasBoth) {
          const steepness = Math.abs(sim.tiltAngle);
          if (steepness > 17 || strength > 1.08) {
            const penalty =
              (steepness > 17 ? (steepness - 16) * 0.0045 : 0) +
              (strength > 1.08 ? (strength - 1.0) * 0.09 : 0);
            sim.overMix = Math.min(1, sim.overMix + penalty);
          }
        }
      }

      sim.pigmentClouds.forEach((p, idx) => {
        const dir = idx % 2 === 0 ? 1 : -1;
        const vyScale = isLayered && sim.overMix < 0.5 ? 0.018 : 0.045;
        p.vx += (-p.y * 0.032 + dir * 1.65) * strength;
        p.vy += p.x * vyScale * strength;
      });
    },
    [isLayered]
  );

  // Slide the selected overhead color tube right above the fixed center jar and drop liquid into it!
  const dropDye = useCallback(
    (dyeType: DyeCode) => {
      const sim = simRef.current;
      if (sim.resolved || isSwirlingCheck || showPauseMenu) return;

      const spacing = getPipeSpacing(sim.canvasW);
      const pipeCode: PrimaryDyeCode =
        dyeType === 'B' || dyeType === 'Y' || dyeType === 'R' ? dyeType : 'Y';
      // Index 0 (Blue) => shift right (+spacing), Index 1 (Yellow) => center (0), Index 2 (Pink) => shift left (-spacing)
      const pipeIdx = pipeCode === 'B' ? 0 : pipeCode === 'R' ? 2 : 1;
      const targetOffset = (1 - pipeIdx) * spacing;

      if (isLayered) {
        const slot = sim.activeLayer;
        const currentSlotDrops = slot === 'bottom' ? sim.bottomDrops : sim.topDrops;
        const slotCap = slot === 'bottom' ? maxDropsBottom : maxDropsTop;

        if (currentSlotDrops.length >= slotCap) {
          onToast(
            `${slot === 'bottom' ? 'Bottom' : 'Top'} layer full (${slotCap}/${slotCap})! Switch layer or tap Tilt.`
          );
          return;
        }

        const totalDropsNow = sim.bottomDrops.length + sim.topDrops.length;
        sim.selectedDyeForTap = dyeType;
        setActivePipeCode(pipeCode);

        if (slot === 'bottom') {
          sim.bottomDrops = [...sim.bottomDrops, dyeType];
          setBottomDrops(sim.bottomDrops);
        } else {
          sim.topDrops = [...sim.topDrops, dyeType];
          setTopDrops(sim.topDrops);
        }
        sim.drops = [...sim.bottomDrops, ...sim.topDrops];
        setDrops(sim.drops);
        onDropAdded();

        sim.targetPipeRailOffset = targetOffset;
        sim.pendingDrops.push({
          dyeType,
          pipeCode,
          targetOffset,
          dropIndex: totalDropsNow,
          layer: slot,
        });

        sim.swirlEnergy = Math.max(0.22, sim.swirlEnergy * 0.62);
        return;
      }

      if (sim.drops.length >= level.maxDrops) {
        onToast(`0 moves left! Tap Tilt to check or Undo.`);
        return;
      }

      const dropIdx = sim.drops.length;
      sim.selectedDyeForTap = dyeType;
      setActivePipeCode(pipeCode);
      sim.drops = [...sim.drops, dyeType];
      setDrops(sim.drops);
      onDropAdded();

      sim.targetPipeRailOffset = targetOffset;
      sim.pendingDrops.push({
        dyeType,
        pipeCode,
        targetOffset,
        dropIndex: dropIdx,
      });

      sim.swirlEnergy = Math.max(0.2, sim.swirlEnergy * 0.58);
    },
    [
      isLayered,
      isSwirlingCheck,
      level.maxDrops,
      maxDropsBottom,
      maxDropsTop,
      onDropAdded,
      onToast,
      showPauseMenu,
    ]
  );

  // Mix / Swirl and Evaluate Result
  const handleSwirlButton = useCallback(() => {
    const sim = simRef.current;
    if (sim.resolved || isSwirlingCheck || showPauseMenu) return;

    if (isLayered) {
      if (sim.bottomDrops.length === 0 || sim.topDrops.length === 0) {
        onToast('Pour drops into both Bottom & Top layers first!');
        return;
      }
    } else if (sim.drops.length === 0) {
      onToast('Tap Blue, Yellow, or Pink to drop dye from a pipe first!');
      return;
    }

    setIsSwirlingCheck(true);
    sim.isAutoSwirling = true;
    onSwirlAction();

    let step = 0;
    if (swirlTimerRef.current !== null) {
      window.clearInterval(swirlTimerRef.current);
    }

    const amp = isLayered ? 11 : 22;

    swirlTimerRef.current = window.setInterval(() => {
      step++;
      if (step === 1) {
        sim.targetTilt = -amp;
        applySwirlImpulse(isLayered ? 0.9 : 1.45, true);
      } else if (step === 2) {
        sim.targetTilt = amp;
        applySwirlImpulse(isLayered ? 0.9 : 1.45, true);
      } else if (step === 3) {
        sim.targetTilt = -Math.round(amp * 0.6);
        applySwirlImpulse(isLayered ? 0.85 : 1.4, true);
      } else if (step === 4) {
        sim.targetTilt = 0;
        sim.swirlEnergy = 1;
        applySwirlImpulse(isLayered ? 0.8 : 1.25, true);
      } else {
        if (swirlTimerRef.current !== null) {
          window.clearInterval(swirlTimerRef.current);
          swirlTimerRef.current = null;
        }
        sim.tiltAngle = 0;
        sim.targetTilt = 0;
        sim.swirlEnergy = 1;
        sim.isAutoSwirling = false;
        setIsSwirlingCheck(false);
        sim.resolved = true;

        if (isLayered) {
          const evalLayered = evaluateLayeredMixResult({
            bottomDrops: sim.bottomDrops,
            topDrops: sim.topDrops,
            targetBottomRecipe: level.bottomRecipe!,
            targetTopRecipe: level.topRecipe!,
            palette,
            overMix: sim.overMix,
          });
          const recipeText = formatLayeredRecipeText(sim.topDrops, sim.bottomDrops, palette);
          const allDrops = [...sim.bottomDrops, ...sim.topDrops];

          const snapshotDataUrl = evalLayered.passed
            ? generateSnapshotCardDataUrl({
                vesselId: gameState.equippedVessel,
                palette,
                drops: allDrops,
                isLayered: true,
                bottomDrops: sim.bottomDrops,
                topDrops: sim.topDrops,
                overMix: sim.overMix,
                levelName: level.name,
                typeName: theme.name,
                hexCode: evalLayered.topHex,
                topHexCode: evalLayered.topHex,
                bottomHexCode: evalLayered.bottomHex,
                matchPercent: evalLayered.similarity,
                recipeText,
                stageBg: theme.gameplayStageBg,
                accentColor: theme.gameplayAccent,
              })
            : '';

          if (!evalLayered.passed) {
            audio.playFail();
          }

          onResult({
            passed: evalLayered.passed,
            stars: evalLayered.stars,
            matchPercent: evalLayered.similarity,
            hexCode: evalLayered.topHex,
            targetHex: targetTopHex,
            isLayered: true,
            topHexCode: evalLayered.topHex,
            bottomHexCode: evalLayered.bottomHex,
            targetTopHex,
            targetBottomHex,
            overMixedFail: evalLayered.overMixedFail,
            recipeText,
            snapshotDataUrl,
            dropsUsed: allDrops,
            bottomDropsUsed: [...sim.bottomDrops],
            topDropsUsed: [...sim.topDrops],
          });
          return;
        }

        const evaluation = evaluateMixResult(sim.drops, level.recipe, palette);
        const recipeText = formatRecipeText(sim.drops, palette);

        const snapshotDataUrl = evaluation.passed
          ? generateSnapshotCardDataUrl({
              vesselId: gameState.equippedVessel,
              palette,
              drops: sim.drops,
              levelName: level.name,
              typeName: theme.name,
              hexCode: evaluation.hex,
              matchPercent: evaluation.similarity,
              recipeText,
              stageBg: theme.gameplayStageBg,
              accentColor: theme.gameplayAccent,
            })
          : '';

        if (!evaluation.passed) {
          audio.playFail();
        }

        onResult({
          passed: evaluation.passed,
          stars: evaluation.stars,
          matchPercent: evaluation.similarity,
          hexCode: evaluation.hex,
          targetHex,
          isLayered: false,
          recipeText,
          snapshotDataUrl,
          dropsUsed: [...sim.drops],
        });
      }
    }, 145);
  }, [
    applySwirlImpulse,
    gameState.equippedVessel,
    isLayered,
    isSwirlingCheck,
    level.bottomRecipe,
    level.name,
    level.recipe,
    level.topRecipe,
    onResult,
    onSwirlAction,
    onToast,
    palette,
    showPauseMenu,
    targetBottomHex,
    targetHex,
    targetTopHex,
    theme.gameplayAccent,
    theme.gameplayStageBg,
    theme.name,
  ]);

  const handleUndo = () => {
    const sim = simRef.current;
    if (sim.resolved || isSwirlingCheck) return;

    if (isLayered) {
      const slot = sim.activeLayer;
      const list = slot === 'bottom' ? sim.bottomDrops : sim.topDrops;
      if (list.length === 0) return;

      if (slot === 'bottom') {
        sim.bottomDrops = sim.bottomDrops.slice(0, -1);
        setBottomDrops(sim.bottomDrops);
      } else {
        sim.topDrops = sim.topDrops.slice(0, -1);
        setTopDrops(sim.topDrops);
      }
      sim.drops = [...sim.bottomDrops, ...sim.topDrops];
      setDrops(sim.drops);

      // If the undone drop is still queued on the sliding pipe rail, cancel it cleanly
      const pendingIdx = [...sim.pendingDrops]
        .reverse()
        .findIndex((p) => p.layer === slot);
      if (pendingIdx !== -1) {
        sim.pendingDrops.splice(sim.pendingDrops.length - 1 - pendingIdx, 1);
      } else {
        let removed = 0;
        for (let i = sim.pigmentClouds.length - 1; i >= 0 && removed < 9; i--) {
          if (sim.pigmentClouds[i].layer === slot) {
            sim.pigmentClouds.splice(i, 1);
            removed++;
          }
        }
      }
      audio.playSwirl(0.5);
      return;
    }

    if (sim.drops.length === 0) return;
    sim.drops = sim.drops.slice(0, -1);
    if (sim.pendingDrops.length > 0) {
      sim.pendingDrops.pop();
    } else {
      sim.pigmentClouds.splice(Math.max(0, sim.pigmentClouds.length - 9), 9);
    }
    setDrops(sim.drops);
    audio.playSwirl(0.5);
  };

  const handleReset = () => {
    if (isSwirlingCheck) return;
    audio.playSwirl(0.7);
    resetLiquidState();
  };

  // Main 60fps Canvas Loop (3 Overhead Glass Pipes + Interactive Bowl + Ripples + Bubbles)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let hudSyncCounter = 0;

    const syncSize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(260, rect.width);
      const h = Math.max(220, rect.height);
      simRef.current.canvasW = w;
      simRef.current.canvasH = h;
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    syncSize();
    window.addEventListener('resize', syncSize);

    const loop = () => {
      const sim = simRef.current;
      const m = getVesselMetrics(gameState.equippedVessel, sim.canvasW, sim.canvasH, true);
      const topY = -m.height / 2 - (m.stemH ? m.stemH * 0.35 : 0);
      const botY = m.height / 2 - (m.stemH ? m.stemH * 0.35 : 0);
      const waterTopY =
        topY +
        m.height *
          (gameState.equippedVessel === 'flask' || gameState.equippedVessel === 'amphora'
            ? 0.38
            : 0.34);
      const waterBotY = botY - 8;
      const midY = waterTopY + (waterBotY - waterTopY) * 0.5;

      // Smoothly slide overhead 3-pipe carriage so the selected tube aligns dead-center over the fixed jar
      if (sim.pendingDrops.length > 0) {
        const nextPending = sim.pendingDrops[0];
        const spacing = getPipeSpacing(sim.canvasW);
        const pIdx = nextPending.pipeCode === 'B' ? 0 : nextPending.pipeCode === 'R' ? 2 : 1;
        const desiredOffset = (1 - pIdx) * spacing;
        sim.targetPipeRailOffset = desiredOffset;

        const diff = desiredOffset - sim.pipeRailOffset;
        if (Math.abs(diff) <= 3.5) {
          sim.pipeRailOffset = desiredOffset;
          sim.pendingDrops.shift();

          const pipes = getColorPipeLayout(sim.canvasW, sim.canvasH, sim.pipeRailOffset);
          const centeredPipe =
            pipes.find((p) => p.code === nextPending.pipeCode) || pipes[1];
          const cy = getVesselCenterY(sim.canvasH, true);
          const rgb = getDyeRgb(nextPending.dyeType, palette);
          const jitterX = (Math.random() - 0.5) * Math.min(8, m.topW * 0.14);

          sim.pipePulses[nextPending.pipeCode] = 1;
          audio.playDrop(nextPending.dyeType, nextPending.dropIndex);

          sim.fallingDrops.push({
            x: sim.canvasW / 2 + jitterX,
            y: centeredPipe.nozzleY,
            targetY:
              isLayered && nextPending.layer === 'bottom'
                ? cy + m.height * 0.12
                : cy - m.height * 0.14,
            vy: 4.5,
            radius: 9.5,
            rgb: [...rgb] as [number, number, number],
            dyeType: nextPending.dyeType,
            localX: jitterX,
            layer: nextPending.layer,
          });
        } else {
          sim.pipeRailOffset += diff * 0.3;
        }
      } else {
        sim.pipeRailOffset += (sim.targetPipeRailOffset - sim.pipeRailOffset) * 0.24;
      }

      // Decay pipe nozzle pulses smoothly
      sim.pipePulses.B = Math.max(0, sim.pipePulses.B * 0.88 - 0.01);
      sim.pipePulses.Y = Math.max(0, sim.pipePulses.Y * 0.88 - 0.01);
      sim.pipePulses.R = Math.max(0, sim.pipePulses.R * 0.88 - 0.01);

      const prevTilt = sim.tiltAngle;
      sim.tiltAngle += (sim.targetTilt - sim.tiltAngle) * 0.16;
      const tiltDelta = Math.abs(sim.tiltAngle - prevTilt);

      const totalDropsNow = isLayered
        ? sim.bottomDrops.length + sim.topDrops.length
        : sim.drops.length;

      if (tiltDelta > 0.26 && totalDropsNow > 0) {
        applySwirlImpulse(Math.min(1.4, tiltDelta * 0.14));
      }

      if (
        isLayered &&
        !sim.isAutoSwirling &&
        sim.bottomDrops.length > 0 &&
        sim.topDrops.length > 0 &&
        Math.abs(sim.tiltAngle) > 18
      ) {
        sim.overMix = Math.min(1, sim.overMix + (Math.abs(sim.tiltAngle) - 17) * 0.00055);
      }

      sim.wavePhase += 0.055 + tiltDelta * 0.03;

      // Falling drops from overhead pipes into glass jar
      for (let i = sim.fallingDrops.length - 1; i >= 0; i--) {
        const d = sim.fallingDrops[i];
        d.vy += 0.58;
        d.y += d.vy;
        if (d.y >= d.targetY) {
          const spawnY =
            isLayered && d.layer === 'bottom'
              ? midY + 12 + Math.random() * Math.max(10, (waterBotY - midY) * 0.45)
              : waterTopY + 12 + Math.random() * 14;

          for (let k = 0; k < 9; k++) {
            const angle = (Math.PI * 2 * k) / 9 + Math.random() * 0.5;
            const speed = 0.4 + Math.random() * 1.1;
            sim.pigmentClouds.push({
              x: d.localX + (Math.random() - 0.5) * 14,
              y: spawnY,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed * (isLayered ? 0.45 : 0.8) + (isLayered ? 0.12 : 0.42),
              radius: (15 + Math.random() * 13) * m.scale,
              maxRadius: (42 + Math.random() * 18) * m.scale,
              rgb: [...d.rgb] as [number, number, number],
              dyeType: d.dyeType,
              alpha: 0.54,
              phase: Math.random() * Math.PI * 2,
              layer: d.layer,
            });
          }
          sim.ripples.push({
            x: d.localX,
            radius: 4,
            maxRadius: m.topW * 0.38,
            alpha: 0.85,
          });
          sim.fallingDrops.splice(i, 1);
        }
      }

      for (let i = sim.ripples.length - 1; i >= 0; i--) {
        const rip = sim.ripples[i];
        rip.radius += 1.5;
        rip.alpha -= 0.026;
        if (rip.alpha <= 0 || rip.radius >= rip.maxRadius) {
          sim.ripples.splice(i, 1);
        }
      }

      const blendedRGB: [number, number, number] =
        sim.drops.length > 0 ? getRecipeRgb(sim.drops, palette) : [180, 236, 255];

      const rawBotRGB: [number, number, number] =
        sim.bottomDrops.length > 0 ? getRecipeRgb(sim.bottomDrops, palette) : [176, 234, 255];
      const rawTopRGB: [number, number, number] =
        sim.topDrops.length > 0 ? getRecipeRgb(sim.topDrops, palette) : [204, 244, 255];
      const mudRGB = blendRgbLocal(rawBotRGB, rawTopRGB, 0.5);
      const visBotRGB = blendRgbLocal(rawBotRGB, mudRGB, sim.overMix * 0.85);
      const visTopRGB = blendRgbLocal(rawTopRGB, mudRGB, sim.overMix * 0.85);

      const tiltRad = (sim.tiltAngle * Math.PI) / 180;
      const gravX = Math.sin(tiltRad) * 0.35;

      for (const p of sim.pigmentClouds) {
        p.phase += 0.03;
        p.radius += (p.maxRadius - p.radius) * 0.026;
        p.vx = p.vx * 0.94 + gravX + Math.cos(p.phase) * 0.04;
        p.vy = p.vy * 0.94 + Math.sin(p.phase) * 0.04;
        p.x += p.vx;
        p.y += p.vy;

        const maxW = m.botW * 0.44;
        if (p.x < -maxW) {
          p.x = -maxW;
          p.vx *= -0.6;
        }
        if (p.x > maxW) {
          p.x = maxW;
          p.vx *= -0.6;
        }

        let minY = waterTopY + 10;
        let maxY = waterBotY - 12;
        if (isLayered && sim.overMix < 0.65) {
          const bleedMargin = sim.overMix * 36;
          if (p.layer === 'top') {
            maxY = Math.min(waterBotY - 12, midY - 4 + bleedMargin);
          } else if (p.layer === 'bottom') {
            minY = Math.max(waterTopY + 10, midY + 4 - bleedMargin);
          }
        }

        if (p.y < minY) {
          p.y = minY;
          p.vy *= -0.5;
        }
        if (p.y > maxY) {
          p.y = maxY;
          p.vy *= -0.5;
        }

        const targetCloudRgb = isLayered
          ? p.layer === 'bottom'
            ? visBotRGB
            : visTopRGB
          : blendedRGB;
        const blendRate = 0.018 + sim.swirlEnergy * 0.065;
        p.rgb[0] += (targetCloudRgb[0] - p.rgb[0]) * blendRate;
        p.rgb[1] += (targetCloudRgb[1] - p.rgb[1]) * blendRate;
        p.rgb[2] += (targetCloudRgb[2] - p.rgb[2]) * blendRate;
      }

      if (totalDropsNow > 0 && sim.swirlEnergy < 1) {
        sim.swirlEnergy = Math.min(1, sim.swirlEnergy + 0.0022);
      }

      renderLiquidGlassScene(ctx, sim.canvasW, sim.canvasH, {
        vesselId: gameState.equippedVessel,
        palette,
        drops: sim.drops,
        isLayered,
        bottomDrops: sim.bottomDrops,
        topDrops: sim.topDrops,
        overMix: sim.overMix,
        fallingDrops: sim.fallingDrops,
        pigmentClouds: sim.pigmentClouds,
        ripples: sim.ripples,
        tiltAngle: sim.tiltAngle,
        swirlEnergy: sim.swirlEnergy,
        wavePhase: sim.wavePhase,
        showPipes: true,
        pipePulses: sim.pipePulses,
        pipeRailOffset: sim.pipeRailOffset,
      });

      hudSyncCounter++;
      if (hudSyncCounter % 5 === 0) {
        if (isLayered) {
          setOverMixPct(Math.round(sim.overMix * 100));
          if (sim.bottomDrops.length === 0 && sim.topDrops.length === 0) {
            setMatchPct(0);
          } else {
            const simBot =
              sim.bottomDrops.length > 0 ? colorSimilarity(visBotRGB, targetBottomRgb) : 0;
            const simTop = sim.topDrops.length > 0 ? colorSimilarity(visTopRGB, targetTopRgb) : 0;
            const rawAvg = (simBot + simTop) / 2;
            const overPenalty =
              sim.overMix >= 0.72 ? 32 : sim.overMix > 0.45 ? (sim.overMix - 0.45) * 28 : 0;
            const eff = Math.max(
              0,
              Math.min(100, Math.round(rawAvg * (0.58 + 0.42 * sim.swirlEnergy) - overPenalty))
            );
            setMatchPct(eff);
          }
        } else if (sim.drops.length === 0) {
          setMatchPct(0);
        } else {
          const rawSim = colorSimilarity(blendedRGB, targetRgb);
          const effectiveMatch = Math.min(
            100,
            Math.round(rawSim * (0.55 + 0.45 * sim.swirlEnergy))
          );
          setMatchPct(effectiveMatch);
        }
      }

      rafId = window.requestAnimationFrame(loop);
    };

    rafId = window.requestAnimationFrame(loop);
    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', syncSize);
    };
  }, [
    applySwirlImpulse,
    gameState.equippedVessel,
    isLayered,
    palette,
    targetBottomRgb,
    targetRgb,
    targetTopRgb,
  ]);

  // Direct Canvas Pointer Interactions: Drag on jar area to gently swirl (Color tube tapping is DISABLED!)
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || simRef.current.resolved || isSwirlingCheck || showPauseMenu) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Ignore touches on the overhead color pipe rail area (selection is exclusively via bottom buttons)
    const pipes = getColorPipeLayout(simRef.current.canvasW, simRef.current.canvasH, simRef.current.pipeRailOffset);
    const pipeBottom = (pipes[0]?.nozzleY ?? 90) + 12;
    if (y <= pipeBottom) return;

    simRef.current.isDragging = true;
    simRef.current.lastPointerX = x;
    simRef.current.pointerDownPos = {x, y};
    canvas.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const sim = simRef.current;
    const canvas = canvasRef.current;
    if (!sim.isDragging || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const dx = x - sim.lastPointerX;
    sim.lastPointerX = x;

    sim.targetTilt = Math.max(-26, Math.min(26, sim.targetTilt + dx * 0.36));
    if (Math.abs(dx) > 1.5) {
      applySwirlImpulse(Math.min(1.4, Math.abs(dx) * 0.08));
    }
  };

  const handlePointerUp = () => {
    const sim = simRef.current;
    if (!sim.isDragging) return;
    sim.isDragging = false;
    sim.pointerDownPos = null;
    sim.targetTilt = 0;
  };

  const activeLayerDrops = isLayered
    ? activeLayer === 'bottom'
      ? bottomDrops
      : topDrops
    : drops;
  const activeLayerMax = isLayered
    ? activeLayer === 'bottom'
      ? maxDropsBottom
      : maxDropsTop
    : level.maxDrops;
  const remainingMoves = Math.max(0, activeLayerMax - activeLayerDrops.length);
  const outOfDropsForCurrent = remainingMoves <= 0 || isSwirlingCheck;
  const canMixNow = isLayered
    ? bottomDrops.length > 0 && topDrops.length > 0
    : drops.length > 0;

  const isOverMixWarning = isLayered && overMixPct >= 45;
  const isOverMixDanger = isLayered && overMixPct >= 72;

  // Ordered Left-to-Right to match the 3 Pipes: Blue, Yellow, Pink
  const primaryCards: Array<{code: PrimaryDyeCode; label: string; color: string}> = [
    {
      code: 'B',
      label: palette.names.B,
      color: `rgb(${palette.B[0]}, ${palette.B[1]}, ${palette.B[2]})`,
    },
    {
      code: 'Y',
      label: palette.names.Y,
      color: `rgb(${palette.Y[0]}, ${palette.Y[1]}, ${palette.Y[2]})`,
    },
    {
      code: 'R',
      label: palette.names.R,
      color: `rgb(${palette.R[0]}, ${palette.R[1]}, ${palette.R[2]})`,
    },
  ];

  const levelProg = gameState.levelProgress[level.id];
  const earnedStars = levelProg?.completed ? levelProg.bestStars || 1 : 0;

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden select-none">
      {/* Full-bleed Pastel Mint Mountain-Lake Gameplay Scenery */}
      <PastelNatureBackdrop variant="gameplay" />

      {/* 1. TOP HEADER ROW: Pause (||) | Sky-Blue Level Banner | Sunny-Yellow Sound & Music */}
      <header className="relative z-20 px-3 pt-2.5 pb-1.5 flex items-center justify-between gap-2 shrink-0">
        <button
          type="button"
          onClick={() => {
            audio.playClick();
            setShowPauseMenu(true);
          }}
          aria-label="Pause Menu"
          className="w-11 h-11 rounded-[14px] pastel-white-sq-btn flex items-center justify-center text-[#18495A] cursor-pointer shrink-0"
        >
          <Pause className="w-5 h-5 fill-[#18495A] stroke-[#18495A]" />
        </button>

        {/* Sky-Blue Glossy Level Capsule (Shows earned stars beside level no. when already completed) */}
        <button
          type="button"
          onClick={() => {
            audio.playClick();
            onOpenLevels();
          }}
          className="flex-1 h-11 rounded-full pastel-blue-pill px-3 flex flex-col items-center justify-center cursor-pointer overflow-hidden active:scale-[0.98] transition"
        >
          <span className="pointer-events-none absolute top-1 left-5 w-10 h-1.5 rounded-full bg-white/60" />
          <div className="flex items-center justify-center gap-1.5">
            <span className="font-display font-bold text-lg sm:text-[19px] text-[#174E64] leading-none whitespace-nowrap">
              Level {levelNumber}
            </span>
            {earnedStars > 0 && (
              <span
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#144353]/85 border border-white/45 shrink-0"
                aria-label={`Completed with ${earnedStars} of 3 stars`}
              >
                {[0, 1, 2].map((s) => (
                  <ComicStarIcon
                    key={s}
                    filled={s < earnedStars}
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                  />
                ))}
              </span>
            )}
          </div>
          <div className="text-[10px] font-extrabold text-[#164A5E] leading-tight truncate max-w-full">
            Match the target color!
          </div>
        </button>

        {/* Two Sunny-Yellow Square Audio Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onToggleSound}
            aria-label={gameState.soundEnabled ? 'Mute Sound' : 'Enable Sound'}
            className="w-11 h-11 rounded-[14px] pastel-yellow-btn flex items-center justify-center cursor-pointer"
          >
            <SoundComicIcon muted={!gameState.soundEnabled} tone="dark" className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={onToggleMusic}
            aria-label={gameState.musicEnabled ? 'Mute Music' : 'Enable Music'}
            className="w-11 h-11 rounded-[14px] pastel-yellow-btn flex items-center justify-center cursor-pointer"
          >
            <MusicComicIcon muted={!gameState.musicEnabled} tone="dark" className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* 2. WHITE HUD INFO CARD (TARGET | STAR LEVEL COUNT | MOVES) — Pipes attach seamlessly below! */}
      <section className="relative z-20 px-3 shrink-0">
        <div className="pastel-hud-card rounded-[20px] px-3 py-2 flex items-center justify-between gap-2">
          {/* Left: Target Color Swatch + Target Name */}
          <div className="flex items-center gap-2 min-w-0 flex-[1.25]">
            <div
              className="w-10 h-10 rounded-[11px] border-2 border-[#18495A] shadow-[inset_0_2px_0_rgba(255,255,255,0.45)] shrink-0"
              style={
                isLayered
                  ? {
                      backgroundImage: `linear-gradient(180deg, ${targetTopHex} 0%, ${targetTopHex} 50%, ${targetBottomHex} 50%, ${targetBottomHex} 100%)`,
                    }
                  : {backgroundColor: targetHex}
              }
            />
            <div className="min-w-0">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#266073] leading-none">
                TARGET
              </div>
              <div className="font-display font-bold text-sm sm:text-[15px] text-[#144353] truncate leading-tight mt-0.5">
                {level.name}
              </div>
            </div>
          </div>

          <div className="w-[1.5px] h-8 bg-[#B8DDE2] shrink-0" />

          {/* Center: Golden Star + Level Index */}
          <div className="flex items-center justify-center gap-1.5 shrink-0 px-1">
            <ComicStarIcon filled className="w-6 h-6 shrink-0" />
            <span className="font-display font-bold text-base sm:text-lg text-[#144353] font-mono-num leading-none">
              {levelNumber} / {totalLevelsInPack}
            </span>
          </div>

          <div className="w-[1.5px] h-8 bg-[#B8DDE2] shrink-0" />

          {/* Right: Moves Counter Sky-Blue Pill */}
          <div className="flex flex-col items-center shrink-0 min-w-[66px]">
            <span className="text-[10px] font-extrabold text-[#266073] leading-none mb-1">
              Moves
            </span>
            <div className="w-full h-7 rounded-[10px] pastel-blue-pill flex items-center justify-center px-2">
              <span className="font-display font-bold text-base text-[#144353] font-mono-num leading-none">
                {remainingMoves}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE STAGE: 3 HANGING GLASS PIPES + BOWL + SPEECH BUBBLE + MIX CTA */}
      <section className="relative z-10 flex-1 min-h-0 flex items-center justify-center overflow-hidden -mt-1">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-full h-full block touch-none cursor-grab active:cursor-grabbing"
        />

        {/* Layered Boss Compact Bottom/Top Switcher (Only on Two-Tone Levels 5 & 10) */}
        {isLayered && (
          <div className="absolute top-[98px] left-2.5 z-20 flex flex-col gap-1">
            <div className="bg-white/95 border-2 border-[#18495A] rounded-full p-0.5 flex items-center gap-0.5 shadow-sm">
              <button
                type="button"
                onClick={() => switchLayer('bottom')}
                className={`px-2 py-0.5 rounded-full font-display font-bold text-[10px] flex items-center gap-1 cursor-pointer transition ${
                  activeLayer === 'bottom'
                    ? 'bg-[#29A8FA] text-white'
                    : 'text-[#18495A]'
                }`}
              >
                <Layers className="w-2.5 h-2.5" />
                <span>
                  Btm {bottomDrops.length}/{maxDropsBottom}
                </span>
              </button>
              <button
                type="button"
                onClick={() => switchLayer('top')}
                className={`px-2 py-0.5 rounded-full font-display font-bold text-[10px] flex items-center gap-1 cursor-pointer transition ${
                  activeLayer === 'top'
                    ? 'bg-[#FF4F8E] text-white'
                    : 'text-[#18495A]'
                }`}
              >
                <Layers className="w-2.5 h-2.5" />
                <span>
                  Top {topDrops.length}/{maxDropsTop}
                </span>
              </button>
            </div>
            {isOverMixWarning && (
              <div className="px-2 py-0.5 rounded-full bg-[#FFE4EC] border border-[#C82A5A] text-[9px] font-extrabold text-[#C82A5A] flex items-center gap-1 w-fit">
                <AlertTriangle className="w-2.5 h-2.5" />
                <span>{isOverMixDanger ? 'Over-mixed!' : 'Tilt gently!'}</span>
              </div>
            )}
          </div>
        )}

        {/* Right Floating Comic Speech Bubble (Exact Match to Gameplay Mockup!) */}
        <button
          type="button"
          onClick={() => {
            if (canMixNow) {
              handleSwirlButton();
            } else {
              audio.playClick();
              onToast(level.hint);
            }
          }}
          className={`absolute right-2.5 top-[34%] z-20 max-w-[126px] rounded-[18px] bg-white border-2 border-[#18495A] px-2.5 py-2 shadow-[0_4px_0_rgba(24,73,90,0.28)] flex items-center gap-1.5 text-left cursor-pointer active:scale-95 transition ${
            canMixNow ? 'ring-2 ring-[#7DF542]' : ''
          }`}
          style={{transform: 'rotate(2deg)'}}
        >
          {/* Speech Bubble Tail pointing toward the Jar */}
          <span
            className="pointer-events-none absolute -bottom-2 left-4 w-3.5 h-3.5 bg-white border-r-2 border-b-2 border-[#18495A]"
            style={{transform: 'rotate(45deg)'}}
          />
          <LightbulbTipIcon className="w-6 h-7 shrink-0" />
          <span className="font-display font-bold text-[11px] leading-[1.15] text-[#144353]">
            {canMixNow
              ? `${matchPct}% Match! Tap Tilt!`
              : 'Mix colors to match the target!'}
          </span>
        </button>
      </section>

      {/* 4. BOTTOM CONTROLS: OPTIONAL MODIFIERS + SMALLER 3 COLOR CARDS + TILT / UNDO / RESET ROW */}
      <section className="relative z-20 px-3 pb-2.5 pt-1 shrink-0 space-y-2">
        {/* Compact Modifier Pills (Only in Triple / Layers / Rush / Color Grid packs) */}
        {hasModifiers && (
          <div className="flex items-center justify-center gap-1.5 px-1">
            {activeModifiers.map((modCode) => {
              const modInfo = MODIFIER_LABELS[modCode];
              const modRgb = getDyeRgb(modCode, palette);
              const modCol = `rgb(${modRgb[0]}, ${modRgb[1]}, ${modRgb[2]})`;
              return (
                <button
                  key={modCode}
                  type="button"
                  disabled={outOfDropsForCurrent}
                  onClick={() => dropDye(modCode)}
                  className="flex-1 max-w-[106px] h-7.5 rounded-full bg-white/95 border-2 border-[#18495A] shadow-[0_2.5px_0_rgba(24,73,90,0.3)] px-2 flex items-center justify-center gap-1 cursor-pointer active:translate-y-0.5 transition disabled:opacity-45"
                >
                  <TeardropColorIcon color={modCol} className="w-3.5 h-4 shrink-0" />
                  <span className="font-display font-bold text-[11px] text-[#154453] truncate">
                    {modInfo.name}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Row 1: Compact 3 White Color Dropper Cards (Blue · Yellow · Pink — slides matching tube over jar!) */}
        <div className="max-w-[292px] mx-auto grid grid-cols-3 gap-2">
          {primaryCards.map((item) => {
            const isAligned = activePipeCode === item.code;
            return (
              <button
                key={item.code}
                type="button"
                disabled={outOfDropsForCurrent}
                onClick={() => dropDye(item.code)}
                className={`pastel-color-card rounded-[15px] py-1.5 px-1.5 flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                  isAligned ? 'ring-2 ring-[#4AE692]' : ''
                }`}
              >
                <TeardropColorIcon
                  color={item.color}
                  strokeColor="#18495A"
                  className="w-7 h-8 sm:w-8 sm:h-9 drop-shadow-[0_2px_3px_rgba(16,62,74,0.2)]"
                />
                <span className="font-display font-bold text-xs sm:text-[13px] text-[#144353] leading-none">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Row 2: 3 Space-Balanced Action Buttons — Tilt (Left), Undo (Middle), Reset (Right) */}
        <div className="grid grid-cols-3 gap-2 px-0.5">
          <button
            type="button"
            disabled={!canMixNow || isSwirlingCheck}
            onClick={handleSwirlButton}
            className="h-[44px] rounded-full pastel-play-btn px-2 flex items-center justify-center gap-1.5 cursor-pointer overflow-hidden"
          >
            <span className="pointer-events-none absolute top-1 left-3.5 w-7 h-1 rounded-full bg-white/50" />
            <Sparkles className="w-4 h-4 text-white stroke-[2.6] shrink-0" />
            <span className="font-display font-bold text-sm sm:text-[15px] text-white cartoon-text-shadow leading-none truncate">
              {isSwirlingCheck ? 'Mix...' : 'Tilt'}
            </span>
          </button>

          <button
            type="button"
            disabled={activeLayerDrops.length === 0 || isSwirlingCheck}
            onClick={handleUndo}
            className="h-[44px] rounded-full pastel-silver-btn px-2 flex items-center justify-center gap-1.5 cursor-pointer overflow-hidden"
          >
            <span className="pointer-events-none absolute top-1 left-3.5 w-7 h-1 rounded-full bg-white/75" />
            <Undo2 className="w-4 h-4 text-[#2C5566] stroke-[2.8] shrink-0" />
            <span className="font-display font-bold text-sm sm:text-[15px] text-[#3E6373] leading-none truncate">
              Undo
            </span>
          </button>

          <button
            type="button"
            disabled={isSwirlingCheck}
            onClick={handleReset}
            className="h-[44px] rounded-full pastel-lime-btn px-2 flex items-center justify-center gap-1.5 cursor-pointer overflow-hidden"
          >
            <span className="pointer-events-none absolute top-1 left-3.5 w-7 h-1 rounded-full bg-white/65" />
            <RotateCcw className="w-4 h-4 text-[#134D32] stroke-[2.8] shrink-0" />
            <span className="font-display font-bold text-sm sm:text-[15px] text-[#134D32] leading-none truncate">
              Reset
            </span>
          </button>
        </div>
      </section>

      {/* PAUSE MENU OVERLAY (Matching Pastel Cartoon Art Style) */}
      {showPauseMenu && (
        <div className="fixed inset-0 z-50 bg-[#0D3C42]/55 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-[330px] pastel-modal rounded-[28px] overflow-hidden animate-pop-in">
            <div className="bg-[#7AD9FF] border-b-[2.5px] border-[#18495A] px-4 py-3 text-center">
              <h2 className="font-display font-bold text-2xl text-[#144353] leading-tight">
                Paused
              </h2>
              <p className="text-xs font-bold text-[#1A586E]">
                {theme.name} · Level {levelNumber} ({level.name})
              </p>
            </div>
            <div className="p-4 space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  audio.playClick();
                  setShowPauseMenu(false);
                }}
                className="w-full h-12 rounded-full pastel-play-btn font-display font-bold text-lg text-white cartoon-text-shadow flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>Resume</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  audio.playClick();
                  setShowPauseMenu(false);
                  onOpenLevels();
                }}
                className="w-full h-11 rounded-full pastel-silver-btn font-display font-bold text-base text-[#164454] flex items-center justify-center gap-2 cursor-pointer"
              >
                <LayoutGrid className="w-4 h-4 stroke-[2.5]" />
                <span>Select Level</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowPauseMenu(false);
                  handleReset();
                }}
                className="w-full h-11 rounded-full pastel-lime-btn font-display font-bold text-base text-[#134D32] flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 stroke-[2.6]" />
                <span>Restart Level</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowPauseMenu(false);
                  onBackToLobby();
                }}
                className="w-full h-11 rounded-full pastel-silver-btn font-display font-bold text-base text-[#164454] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="w-4 h-4 stroke-[2.5]" />
                <span>Back to Lobby</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
