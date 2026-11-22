import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ChevronLeft, ChevronRight, Droplets, Home, RotateCcw, Sparkles} from 'lucide-react';
import {audio} from '../game/audio';
import {
  colorSimilarity,
  dropsToNormalizedRYB,
  evaluateMixResult,
  formatRecipeText,
  getRecipeRgb,
  rgbToHex,
  rybToRgb,
} from '../game/colorEngine';
import {LEVELS_BY_TYPE, LEVEL_TYPES, getLevelDef, getPaletteById} from '../game/data';
import type {DyeCode, LevelTypeId, SavedGameState} from '../game/types';
import {
  type FallingDrop,
  type PigmentCloud,
  type SurfaceRipple,
  generateSnapshotCardDataUrl,
  getVesselMetrics,
  renderLiquidGlassScene,
} from '../game/vesselRenderer';
import {MusicComicIcon, SoundComicIcon} from './ComicIcons';

export interface GameplayResultPayload {
  passed: boolean;
  stars: number;
  matchPercent: number;
  hexCode: string;
  targetHex: string;
  recipeText: string;
  snapshotDataUrl: string;
  dropsUsed: DyeCode[];
}

interface GameplayScreenProps {
  gameState: SavedGameState;
  typeId: LevelTypeId;
  levelNumber: number;
  resetCounter: number;
  onBackToLobby: () => void;
  onChangeLevel: (levelNumber: number) => void;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  onDropAdded: () => void;
  onSwirlAction: () => void;
  onResult: (result: GameplayResultPayload) => void;
  onToast: (message: string) => void;
}

export const GameplayScreen: React.FC<GameplayScreenProps> = ({
  gameState,
  typeId,
  levelNumber,
  resetCounter,
  onBackToLobby,
  onChangeLevel,
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

  const targetRgb = getRecipeRgb(level.recipe, palette);
  const targetHex = rgbToHex(targetRgb);

  const [drops, setDrops] = useState<DyeCode[]>([]);
  const [liveHex, setLiveHex] = useState<string>('CLEAR');
  const [liveSwatch, setLiveSwatch] = useState<string>('#EBF6FC');
  const [matchPct, setMatchPct] = useState<number>(0);
  const [swirlPct, setSwirlPct] = useState<number>(0);
  const [tiltSliderVal, setTiltSliderVal] = useState<number>(0);
  const [isSwirlingCheck, setIsSwirlingCheck] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const swirlTimerRef = useRef<number | null>(null);

  // Isolated 60fps simulation ref (never causes React re-renders per frame)
  const simRef = useRef<{
    drops: DyeCode[];
    fallingDrops: FallingDrop[];
    pigmentClouds: PigmentCloud[];
    ripples: SurfaceRipple[];
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
  }>({
    drops: [],
    fallingDrops: [],
    pigmentClouds: [],
    ripples: [],
    tiltAngle: 0,
    targetTilt: 0,
    swirlEnergy: 0,
    wavePhase: 0,
    selectedDyeForTap: 'R',
    isDragging: false,
    lastPointerX: 0,
    pointerDownPos: null,
    canvasW: 360,
    canvasH: 360,
    resolved: false,
  });

  const resetLiquidState = useCallback(() => {
    if (swirlTimerRef.current !== null) {
      window.clearInterval(swirlTimerRef.current);
      swirlTimerRef.current = null;
    }
    simRef.current.drops = [];
    simRef.current.fallingDrops = [];
    simRef.current.pigmentClouds = [];
    simRef.current.ripples = [];
    simRef.current.tiltAngle = 0;
    simRef.current.targetTilt = 0;
    simRef.current.swirlEnergy = 0;
    simRef.current.resolved = false;
    setDrops([]);
    setLiveHex('CLEAR');
    setLiveSwatch('#EBF6FC');
    setMatchPct(0);
    setSwirlPct(0);
    setTiltSliderVal(0);
    setIsSwirlingCheck(false);
  }, []);

  useEffect(() => {
    resetLiquidState();
  }, [typeId, levelNumber, resetCounter, resetLiquidState]);

  // Cleanup swirl timer on unmount
  useEffect(() => {
    return () => {
      if (swirlTimerRef.current !== null) {
        window.clearInterval(swirlTimerRef.current);
      }
    };
  }, []);

  const applySwirlImpulse = useCallback((strength = 1.0) => {
    const sim = simRef.current;
    if (sim.drops.length === 0) return;
    audio.playSwirl(strength);
    sim.swirlEnergy = Math.min(1, sim.swirlEnergy + 0.15 * strength);

    sim.pigmentClouds.forEach((p, idx) => {
      const dir = idx % 2 === 0 ? 1 : -1;
      p.vx += (-p.y * 0.045 + dir * 1.9) * strength;
      p.vy += p.x * 0.045 * strength;
    });
  }, []);

  const dropDye = useCallback(
    (dyeType: DyeCode, customX: number | null = null) => {
      const sim = simRef.current;
      if (sim.resolved || isSwirlingCheck) return;
      if (sim.drops.length >= level.maxDrops) {
        onToast(`Max ${level.maxDrops} drops reached! Tap Swirl or Undo.`);
        return;
      }

      audio.playDrop(dyeType, sim.drops.length);
      sim.selectedDyeForTap = dyeType;
      sim.drops = [...sim.drops, dyeType];
      setDrops(sim.drops);
      onDropAdded();

      const m = getVesselMetrics(gameState.equippedVessel, sim.canvasW, sim.canvasH);
      const spread = m.topW * 0.34;
      const dropOffsetX =
        customX !== null
          ? Math.max(-spread, Math.min(spread, customX - sim.canvasW / 2))
          : (Math.random() - 0.5) * spread;

      const rgb = palette[dyeType];
      sim.fallingDrops.push({
        x: sim.canvasW / 2 + dropOffsetX,
        y: sim.canvasH / 2 - m.height / 2 - 38,
        targetY: sim.canvasH / 2 - m.height * 0.14,
        vy: 4.5,
        radius: 9,
        rgb: [...rgb] as [number, number, number],
        dyeType,
        localX: dropOffsetX,
      });

      sim.swirlEnergy = Math.max(0.14, sim.swirlEnergy * 0.52);
    },
    [gameState.equippedVessel, isSwirlingCheck, level.maxDrops, onDropAdded, onToast, palette]
  );

  // Instruction 5: After Swirl button called, if color does not match -> show Level Failed panel!
  const handleSwirlButton = useCallback(() => {
    const sim = simRef.current;
    if (sim.resolved || isSwirlingCheck) return;

    if (sim.drops.length === 0) {
      onToast('Drop at least 1 pigment color into the water first!');
      return;
    }

    setIsSwirlingCheck(true);
    onSwirlAction();

    let step = 0;
    if (swirlTimerRef.current !== null) {
      window.clearInterval(swirlTimerRef.current);
    }

    swirlTimerRef.current = window.setInterval(() => {
      step++;
      if (step === 1) {
        sim.targetTilt = -24;
        setTiltSliderVal(-24);
        applySwirlImpulse(1.5);
      } else if (step === 2) {
        sim.targetTilt = 24;
        setTiltSliderVal(24);
        applySwirlImpulse(1.5);
      } else if (step === 3) {
        sim.targetTilt = -14;
        setTiltSliderVal(-14);
        applySwirlImpulse(1.5);
      } else if (step === 4) {
        sim.targetTilt = 0;
        setTiltSliderVal(0);
        sim.swirlEnergy = 1;
        applySwirlImpulse(1.3);
      } else {
        if (swirlTimerRef.current !== null) {
          window.clearInterval(swirlTimerRef.current);
          swirlTimerRef.current = null;
        }
        sim.tiltAngle = 0;
        sim.targetTilt = 0;
        sim.swirlEnergy = 1;
        setTiltSliderVal(0);
        setIsSwirlingCheck(false);

        const evaluation = evaluateMixResult(sim.drops, level.recipe, palette);
        const recipeText = formatRecipeText(sim.drops, palette);
        sim.resolved = true;

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
          recipeText,
          snapshotDataUrl,
          dropsUsed: [...sim.drops],
        });
      }
    }, 150);
  }, [
    applySwirlImpulse,
    gameState.equippedVessel,
    isSwirlingCheck,
    level.name,
    level.recipe,
    onResult,
    onSwirlAction,
    onToast,
    palette,
    targetHex,
    theme.gameplayAccent,
    theme.gameplayStageBg,
    theme.name,
  ]);

  const handleUndo = () => {
    const sim = simRef.current;
    if (sim.drops.length === 0 || sim.resolved || isSwirlingCheck) return;
    sim.drops = sim.drops.slice(0, -1);
    sim.pigmentClouds.splice(Math.max(0, sim.pigmentClouds.length - 9), 9);
    setDrops(sim.drops);
    audio.playSwirl(0.5);
  };

  const handleClear = () => {
    if (isSwirlingCheck) return;
    audio.playSwirl(0.7);
    resetLiquidState();
  };

  // Main 60fps Canvas Loop
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
      const w = Math.max(240, rect.width);
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
      const m = getVesselMetrics(gameState.equippedVessel, sim.canvasW, sim.canvasH);
      const topY = -m.height / 2 - (m.stemH ? m.stemH * 0.35 : 0);
      const botY = m.height / 2 - (m.stemH ? m.stemH * 0.35 : 0);
      const waterTopY =
        topY +
        m.height * (gameState.equippedVessel === 'flask' || gameState.equippedVessel === 'amphora' ? 0.36 : 0.28);
      const waterBotY = botY - 8;

      const prevTilt = sim.tiltAngle;
      sim.tiltAngle += (sim.targetTilt - sim.tiltAngle) * 0.16;
      const tiltDelta = Math.abs(sim.tiltAngle - prevTilt);

      if (tiltDelta > 0.26 && sim.drops.length > 0) {
        applySwirlImpulse(Math.min(1.4, tiltDelta * 0.14));
      }

      sim.wavePhase += 0.055 + tiltDelta * 0.03;

      // Update falling drops
      for (let i = sim.fallingDrops.length - 1; i >= 0; i--) {
        const d = sim.fallingDrops[i];
        d.vy += 0.56;
        d.y += d.vy;
        if (d.y >= d.targetY) {
          for (let k = 0; k < 9; k++) {
            const angle = (Math.PI * 2 * k) / 9 + Math.random() * 0.5;
            const speed = 0.4 + Math.random() * 1.1;
            sim.pigmentClouds.push({
              x: d.localX + (Math.random() - 0.5) * 14,
              y: waterTopY + 12 + Math.random() * 14,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed * 0.8 + 0.42,
              radius: (15 + Math.random() * 13) * m.scale,
              maxRadius: (46 + Math.random() * 22) * m.scale,
              rgb: [...d.rgb] as [number, number, number],
              dyeType: d.dyeType,
              alpha: 0.52,
              phase: Math.random() * Math.PI * 2,
            });
          }
          sim.ripples.push({
            x: d.localX,
            radius: 4,
            maxRadius: m.topW * 0.4,
            alpha: 0.8,
          });
          sim.fallingDrops.splice(i, 1);
        }
      }

      // Ripples
      for (let i = sim.ripples.length - 1; i >= 0; i--) {
        const rip = sim.ripples[i];
        rip.radius += 1.4;
        rip.alpha -= 0.025;
        if (rip.alpha <= 0 || rip.radius >= rip.maxRadius) {
          sim.ripples.splice(i, 1);
        }
      }

      const norm = dropsToNormalizedRYB(sim.drops);
      const blendedRGB: [number, number, number] =
        sim.drops.length > 0 ? rybToRgb(norm.r, norm.y, norm.b, palette) : [235, 246, 252];

      const tiltRad = (sim.tiltAngle * Math.PI) / 180;
      const gravX = Math.sin(tiltRad) * 0.35;

      for (const p of sim.pigmentClouds) {
        p.phase += 0.03;
        p.radius += (p.maxRadius - p.radius) * 0.026;
        p.vx = p.vx * 0.94 + gravX + Math.cos(p.phase) * 0.04;
        p.vy = p.vy * 0.94 + Math.sin(p.phase) * 0.04;
        p.x += p.vx;
        p.y += p.vy;

        const maxW = m.botW * 0.4;
        if (p.x < -maxW) {
          p.x = -maxW;
          p.vx *= -0.6;
        }
        if (p.x > maxW) {
          p.x = maxW;
          p.vx *= -0.6;
        }
        if (p.y < waterTopY + 10) {
          p.y = waterTopY + 10;
          p.vy *= -0.5;
        }
        if (p.y > waterBotY - 12) {
          p.y = waterBotY - 12;
          p.vy *= -0.5;
        }

        const blendRate = 0.016 + sim.swirlEnergy * 0.065;
        p.rgb[0] += (blendedRGB[0] - p.rgb[0]) * blendRate;
        p.rgb[1] += (blendedRGB[1] - p.rgb[1]) * blendRate;
        p.rgb[2] += (blendedRGB[2] - p.rgb[2]) * blendRate;
      }

      if (sim.drops.length > 0 && sim.swirlEnergy < 1) {
        sim.swirlEnergy = Math.min(1, sim.swirlEnergy + 0.0018);
      }

      renderLiquidGlassScene(ctx, sim.canvasW, sim.canvasH, {
        vesselId: gameState.equippedVessel,
        palette,
        drops: sim.drops,
        fallingDrops: sim.fallingDrops,
        pigmentClouds: sim.pigmentClouds,
        ripples: sim.ripples,
        tiltAngle: sim.tiltAngle,
        swirlEnergy: sim.swirlEnergy,
        wavePhase: sim.wavePhase,
      });

      // Throttled HUD sync (~12fps) for smooth UI without excess React re-renders
      hudSyncCounter++;
      if (hudSyncCounter % 5 === 0) {
        if (sim.drops.length === 0) {
          setLiveHex('CLEAR');
          setLiveSwatch('#EBF6FC');
          setMatchPct(0);
          setSwirlPct(0);
        } else {
          const hex = rgbToHex(blendedRGB);
          const rawSim = colorSimilarity(blendedRGB, targetRgb);
          const effectiveMatch = Math.min(100, Math.round(rawSim * (0.55 + 0.45 * sim.swirlEnergy)));
          setLiveHex(hex);
          setLiveSwatch(hex);
          setMatchPct(effectiveMatch);
          setSwirlPct(Math.round(sim.swirlEnergy * 100));
        }
      }

      rafId = window.requestAnimationFrame(loop);
    };

    rafId = window.requestAnimationFrame(loop);
    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', syncSize);
    };
  }, [applySwirlImpulse, gameState.equippedVessel, palette, targetRgb]);

  // Direct Canvas Pointer Interactions (Tap glass to drop, Swipe/Drag to tilt & swirl)
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || simRef.current.resolved || isSwirlingCheck) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
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

    sim.targetTilt = Math.max(-28, Math.min(28, sim.targetTilt + dx * 0.38));
    setTiltSliderVal(Math.round(sim.targetTilt));
    if (Math.abs(dx) > 1.5) {
      applySwirlImpulse(Math.min(1.3, Math.abs(dx) * 0.08));
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const sim = simRef.current;
    const canvas = canvasRef.current;
    if (!sim.isDragging || !canvas) return;
    sim.isDragging = false;

    if (sim.pointerDownPos) {
      const rect = canvas.getBoundingClientRect();
      const upX = e.clientX - rect.left;
      const upY = e.clientY - rect.top;
      const dist = Math.hypot(upX - sim.pointerDownPos.x, upY - sim.pointerDownPos.y);
      if (dist < 8) {
        dropDye(sim.selectedDyeForTap, upX);
      }
    }
    sim.pointerDownPos = null;
    sim.targetTilt = 0;
    setTiltSliderVal(0);
  };

  return (
    <div
      className="relative w-full h-full flex flex-col overflow-hidden transition-colors duration-300"
      style={{
        backgroundColor: theme.pageBg,
        ['--dot-color' as string]: theme.halftoneDot,
      }}
    >
      <div className="absolute inset-0 comic-halftone-edge opacity-80 pointer-events-none" />

      {/* 1. TOP GAMEPLAY HEADER (Studio Removed from Gameplay per Instruction 1!) */}
      <header className="relative z-20 px-3 pt-2.5 pb-1.5 flex items-center justify-between gap-2 shrink-0">
        {/* Home / Back to Lobby */}
        <button
          type="button"
          onClick={onBackToLobby}
          aria-label="Back to Lobby"
          className="w-10 h-10 rounded-xl bg-[#FFFDF5] comic-btn flex items-center justify-center text-[#141414] cursor-pointer shrink-0"
        >
          <Home className="w-5 h-5 stroke-[2.7]" />
        </button>

        {/* Level Switcher Card */}
        <div
          className="flex-1 max-w-[230px] rounded-2xl comic-box-sm px-1.5 py-1 flex items-center justify-between gap-1"
          style={{backgroundColor: theme.folderBg}}
        >
          <button
            type="button"
            disabled={levelNumber <= 1 || isSwirlingCheck}
            onClick={() => onChangeLevel(levelNumber - 1)}
            aria-label="Previous Level"
            className="w-7 h-7 rounded-lg bg-[#FFFDF5] border-2 border-[#141414] flex items-center justify-center disabled:opacity-35 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 stroke-[3]" />
          </button>

          <div className="text-center min-w-0 px-1">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#141414]/80 leading-none">
              {theme.name} · Lvl {levelNumber}/{totalLevelsInPack}
            </div>
            <div className="font-display font-bold text-xs sm:text-sm text-[#141414] truncate leading-tight">
              {level.name}
            </div>
          </div>

          <button
            type="button"
            disabled={levelNumber >= totalLevelsInPack || isSwirlingCheck}
            onClick={() => onChangeLevel(levelNumber + 1)}
            aria-label="Next Level"
            className="w-7 h-7 rounded-lg bg-[#FFFDF5] border-2 border-[#141414] flex items-center justify-center disabled:opacity-35 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Sound & Music Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onToggleSound}
            aria-label="Toggle Sound"
            className="w-10 h-10 rounded-xl bg-[#FFF066] comic-btn flex items-center justify-center cursor-pointer"
          >
            <SoundComicIcon muted={!gameState.soundEnabled} className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={onToggleMusic}
            aria-label="Toggle Music"
            className="w-10 h-10 rounded-xl bg-[#FFF066] comic-btn flex items-center justify-center cursor-pointer"
          >
            <MusicComicIcon muted={!gameState.musicEnabled} className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 2. TARGET vs YOUR MIX COMIC CARD + DROP PIPS */}
      <section className="relative z-20 px-3 pb-1 shrink-0">
        <div className="bg-[#FFFDF5] rounded-2xl comic-box p-2.5 flex items-center justify-between gap-2">
          {/* Target Swatch */}
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-11 h-11 rounded-xl border-[2.5px] border-[#141414] shadow-[2px_2px_0_#141414] shrink-0 transition-colors"
              style={{backgroundColor: targetHex}}
            />
            <div className="min-w-0">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#141414]/65 leading-none">
                Target
              </div>
              <div className="font-display font-bold text-xs sm:text-sm text-[#141414] truncate leading-tight mt-0.5">
                {level.name}
              </div>
              <div className="text-[10px] font-bold text-[#141414]/70 truncate">{level.hint}</div>
            </div>
          </div>

          {/* Center Match Readout */}
          <div className="flex flex-col items-center shrink-0">
            <div
              className="px-2.5 py-1 rounded-xl border-2 border-[#141414] shadow-[2px_2px_0_#141414] flex items-center gap-1 transition-colors"
              style={{
                backgroundColor: matchPct >= 86 ? '#B8FF00' : theme.folderBg,
              }}
            >
              <span className="font-display font-bold text-sm text-[#141414] font-mono-num">
                {matchPct}%
              </span>
              <span className="text-[10px] font-extrabold text-[#141414]">Match</span>
            </div>
            <span className="text-[10px] font-extrabold text-[#141414]/70 mt-0.5">
              {drops.length === 0 ? 'Add drops' : swirlPct < 75 ? `Swirl ${swirlPct}%` : 'Tap Swirl!'}
            </span>
          </div>

          {/* Your Live Mix Swatch */}
          <div className="flex items-center gap-2 text-right min-w-0">
            <div className="min-w-0">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#141414]/65 leading-none">
                Your Mix
              </div>
              <div className="font-mono-num font-bold text-xs text-[#141414] leading-tight mt-0.5">
                {liveHex}
              </div>
              <div className="text-[10px] font-bold text-[#141414]/70">
                {drops.length === 0 ? 'Clear water' : `${drops.length}/${level.maxDrops} drops`}
              </div>
            </div>
            <div
              className="w-11 h-11 rounded-xl border-[2.5px] border-[#141414] shadow-[2px_2px_0_#141414] shrink-0 transition-colors"
              style={{backgroundColor: liveSwatch}}
            />
          </div>
        </div>

        {/* Drop Allowance Pips & Undo/Clear Bar */}
        <div className="flex items-center justify-between pt-2 px-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-extrabold text-[#141414]">Drops:</span>
            <div className="flex items-center gap-1">
              {Array.from({length: level.maxDrops}).map((_, i) => {
                const code = drops[i];
                const rgb = code ? palette[code] : null;
                return (
                  <span
                    key={i}
                    className={`w-4 h-4 rounded-full border-2 border-[#141414] transition-transform ${
                      rgb ? 'scale-105 shadow-[1px_1px_0_#141414]' : 'bg-[#FFFDF5] border-dashed'
                    }`}
                    style={rgb ? {backgroundColor: `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`} : undefined}
                  />
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={drops.length === 0 || isSwirlingCheck}
              onClick={handleUndo}
              className="px-2.5 py-1 rounded-xl bg-[#FFFDF5] comic-btn text-[11px] font-extrabold text-[#141414] flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 stroke-[2.8]" />
              <span>Undo</span>
            </button>
            <button
              type="button"
              disabled={isSwirlingCheck}
              onClick={handleClear}
              className="px-2.5 py-1 rounded-xl bg-[#FFFDF5] comic-btn text-[11px] font-extrabold text-[#141414] flex items-center gap-1 cursor-pointer"
            >
              <Droplets className="w-3.5 h-3.5 stroke-[2.8]" />
              <span>Clear</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE LIQUID VESSEL CANVAS STAGE */}
      <section className="relative z-10 flex-1 min-h-0 flex items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-full h-full block touch-none cursor-grab active:cursor-grabbing"
        />

        <div className="pointer-events-none absolute bottom-1.5 left-1/2 -translate-x-1/2 bg-[#141414] text-[#FFF8DB] px-3 py-1 rounded-xl border-2 border-[#141414] text-[10px] sm:text-[11px] font-extrabold tracking-wide whitespace-nowrap">
          Tap pigment to drop · Swipe glass or tap Swirl to mix
        </div>
      </section>

      {/* 4. BOTTOM CONTROLS DECK: 3 DYE PIPETTES + TILT SLIDER + SWIRL CHECK BUTTON */}
      <section
        className="relative z-20 border-t-[3.5px] border-[#141414] px-3 pt-2.5 pb-3 shrink-0 transition-colors duration-300"
        style={{backgroundColor: theme.panelCoral}}
      >
        {/* 3 Dye Pipettes */}
        <div className="grid grid-cols-3 gap-2.5 mb-2.5">
          {(['R', 'Y', 'B'] as DyeCode[]).map((code) => {
            const rgb = palette[code];
            const outOfDrops = drops.length >= level.maxDrops || isSwirlingCheck;
            return (
              <button
                key={code}
                type="button"
                disabled={outOfDrops}
                onClick={() => dropDye(code)}
                className="bg-[#FFFDF5] hover:bg-[#FFF9DB] rounded-2xl comic-btn py-2 px-1.5 flex flex-col items-center justify-center cursor-pointer"
              >
                <div
                  className="w-10 h-10 rounded-full border-[3px] border-[#141414] shadow-[2px_2px_0_#141414] flex items-center justify-center mb-1"
                  style={{
                    background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.75), rgb(${rgb[0]},${rgb[1]},${rgb[2]}))`,
                  }}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-white/80 -translate-x-1.5 -translate-y-1.5" />
                </div>
                <span className="font-display font-bold text-xs text-[#141414] leading-none">
                  {palette.names[code]}
                </span>
                <span className="text-[10px] font-extrabold text-[#141414]/65 mt-0.5">+1 Drop</span>
              </button>
            );
          })}
        </div>

        {/* Tilt Slider + Swirl Evaluate CTA */}
        <div
          className="rounded-2xl comic-box-sm px-3 py-2 flex items-center gap-2.5"
          style={{backgroundColor: theme.folderBg}}
        >
          <span className="font-display font-bold text-xs uppercase text-[#141414] shrink-0">
            Tilt
          </span>
          <input
            type="range"
            min={-28}
            max={28}
            step={1}
            value={tiltSliderVal}
            aria-label="Tilt glass to swirl liquid"
            onChange={(e) => {
              const v = Number(e.target.value);
              setTiltSliderVal(v);
              simRef.current.targetTilt = v;
            }}
            onPointerUp={() => {
              setTiltSliderVal(0);
              simRef.current.targetTilt = 0;
            }}
            onTouchEnd={() => {
              setTiltSliderVal(0);
              simRef.current.targetTilt = 0;
            }}
            className="comic-slider flex-1"
          />
          <button
            type="button"
            disabled={isSwirlingCheck}
            onClick={handleSwirlButton}
            className="px-4 py-2 rounded-xl bg-[#B8FF00] hover:bg-[#C7FF33] comic-btn font-display font-bold text-sm text-[#141414] flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 stroke-[2.8]" />
            <span>{isSwirlingCheck ? 'SWIRLING...' : 'SWIRL'}</span>
          </button>
        </div>
      </section>
    </div>
  );
};
