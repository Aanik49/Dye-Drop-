import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Flame,
  Home,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Timer,
  Undo2,
} from 'lucide-react';
import {audio} from '../game/audio';
import {
  colorSimilarity,
  evaluateMixResult,
  getDyeRgb,
  getRecipeRgb,
  rgbToHex,
} from '../game/colorEngine';
import {getPaletteById, getRushMultiplier, pickNextRushTarget} from '../game/data';
import type {
  DyeCode,
  PrimaryDyeCode,
  RushRunSummary,
  RushShadeTarget,
  SavedGameState,
} from '../game/types';
import {
  type FallingDrop,
  type PigmentCloud,
  type SurfaceRipple,
  getColorPipeLayout,
  getPipeSpacing,
  getVesselCenterY,
  getVesselMetrics,
  renderLiquidGlassScene,
} from '../game/vesselRenderer';
import {MusicComicIcon, SoundComicIcon, TeardropColorIcon} from './ComicIcons';
import {PastelNatureBackdrop} from './PastelNatureBackdrop';

const RUSH_DURATION_MS = 60_000;

interface TimedRushScreenProps {
  gameState: SavedGameState;
  runCounter: number;
  onBackToLobby: () => void;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  onDropAdded: () => void;
  onSwirlAction: () => void;
  onPerfectBlend: () => void;
  onComplete: (summary: RushRunSummary) => void;
  onToast: (message: string) => void;
}

interface FloatingBanner {
  id: number;
  text: string;
  sub?: string;
  tone: 'perfect' | 'good' | 'miss';
}

export const TimedRushScreen: React.FC<TimedRushScreenProps> = ({
  gameState,
  runCounter,
  onBackToLobby,
  onToggleSound,
  onToggleMusic,
  onDropAdded,
  onSwirlAction,
  onPerfectBlend,
  onComplete,
  onToast,
}) => {
  const palette = getPaletteById(gameState.equippedPalette);

  const [target, setTarget] = useState<RushShadeTarget>(() => pickNextRushTarget(0));
  const [remainingMs, setRemainingMs] = useState<number>(RUSH_DURATION_MS);
  const [score, setScore] = useState<number>(0);
  const [matches, setMatches] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [usedUndoThisRound, setUsedUndoThisRound] = useState<boolean>(false);
  const [drops, setDrops] = useState<DyeCode[]>([]);
  const [matchPct, setMatchPct] = useState<number>(0);
  const [isSwirlingCheck, setIsSwirlingCheck] = useState<boolean>(false);
  const [showPauseMenu, setShowPauseMenu] = useState<boolean>(false);
  const [activePipeCode, setActivePipeCode] = useState<PrimaryDyeCode>('Y');
  const [banner, setBanner] = useState<FloatingBanner | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const swirlTimerRef = useRef<number | null>(null);
  const clearTimerRef = useRef<number | null>(null);
  const bannerTimerRef = useRef<number | null>(null);
  const lastSecondTickRef = useRef<number>(60);
  const runEndedRef = useRef<boolean>(false);

  // Authoritative stats ref for accurate completion payload at 0.0s
  const statsRef = useRef({
    score: 0,
    matches: 0,
    perfectMatches: 0,
    streak: 0,
    bestStreak: 0,
    peakMultiplier: 1,
    undosUsed: 0,
    usedUndoThisRound: false,
  });

  const targetRgb = getRecipeRgb(target.recipe, palette);
  const targetHex = rgbToHex(targetRgb);

  interface PendingPipeDrop {
    dyeType: DyeCode;
    pipeCode: PrimaryDyeCode;
    dropIndex: number;
  }

  const simRef = useRef<{
    drops: DyeCode[];
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
    isDragging: boolean;
    lastPointerX: number;
    canvasW: number;
    canvasH: number;
    locked: boolean;
  }>({
    drops: [],
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
    isDragging: false,
    lastPointerX: 0,
    canvasW: 360,
    canvasH: 380,
    locked: false,
  });

  const clearLiquidVessel = useCallback(() => {
    if (swirlTimerRef.current !== null) {
      window.clearInterval(swirlTimerRef.current);
      swirlTimerRef.current = null;
    }
    if (clearTimerRef.current !== null) {
      window.clearTimeout(clearTimerRef.current);
      clearTimerRef.current = null;
    }
    const sim = simRef.current;
    sim.drops = [];
    sim.fallingDrops = [];
    sim.pendingDrops = [];
    sim.pigmentClouds = [];
    sim.ripples = [];
    sim.pipePulses = {B: 0, Y: 0, R: 0};
    sim.tiltAngle = 0;
    sim.targetTilt = 0;
    sim.swirlEnergy = 0;
    sim.locked = false;
    setDrops([]);
    setMatchPct(0);
    setIsSwirlingCheck(false);
  }, []);

  const showFloatingBanner = useCallback(
    (text: string, tone: FloatingBanner['tone'], sub?: string) => {
      if (bannerTimerRef.current !== null) {
        window.clearTimeout(bannerTimerRef.current);
      }
      setBanner({id: Date.now(), text, sub, tone});
      bannerTimerRef.current = window.setTimeout(() => {
        setBanner(null);
      }, 1050);
    },
    []
  );

  // Reset entire 60-second Rush run whenever runCounter increments
  const resetWholeRun = useCallback(() => {
    clearLiquidVessel();
    runEndedRef.current = false;
    lastSecondTickRef.current = 60;
    statsRef.current = {
      score: 0,
      matches: 0,
      perfectMatches: 0,
      streak: 0,
      bestStreak: 0,
      peakMultiplier: 1,
      undosUsed: 0,
      usedUndoThisRound: false,
    };
    simRef.current.pipeRailOffset = 0;
    simRef.current.targetPipeRailOffset = 0;
    setTarget(pickNextRushTarget(0));
    setRemainingMs(RUSH_DURATION_MS);
    setScore(0);
    setMatches(0);
    setStreak(0);
    setUsedUndoThisRound(false);
    setActivePipeCode('Y');
    setShowPauseMenu(false);
    setBanner(null);
  }, [clearLiquidVessel]);

  useEffect(() => {
    resetWholeRun();
  }, [runCounter, resetWholeRun]);

  useEffect(() => {
    return () => {
      if (swirlTimerRef.current !== null) window.clearInterval(swirlTimerRef.current);
      if (clearTimerRef.current !== null) window.clearTimeout(clearTimerRef.current);
      if (bannerTimerRef.current !== null) window.clearTimeout(bannerTimerRef.current);
    };
  }, []);

  // Crisp 60-second countdown loop (pauses cleanly during Pause overlay)
  useEffect(() => {
    if (showPauseMenu || runEndedRef.current) return;

    let lastNow = performance.now();
    const timer = window.setInterval(() => {
      if (runEndedRef.current) return;
      const now = performance.now();
      const dt = now - lastNow;
      lastNow = now;

      setRemainingMs((prev) => {
        const next = Math.max(0, prev - dt);
        const wholeSec = Math.ceil(next / 1000);
        if (wholeSec < lastSecondTickRef.current && wholeSec > 0 && wholeSec <= 5) {
          lastSecondTickRef.current = wholeSec;
          audio.playTick(wholeSec <= 3);
        }
        if (next <= 0 && !runEndedRef.current) {
          runEndedRef.current = true;
          simRef.current.locked = true;
          if (swirlTimerRef.current !== null) {
            window.clearInterval(swirlTimerRef.current);
            swirlTimerRef.current = null;
          }
          audio.playTimeUp();
          const st = statsRef.current;
          window.setTimeout(() => {
            onComplete({
              score: st.score,
              matches: st.matches,
              perfectMatches: st.perfectMatches,
              bestStreak: st.bestStreak,
              peakMultiplier: st.peakMultiplier,
              undosUsed: st.undosUsed,
            });
          }, 180);
        }
        return next;
      });
    }, 100);

    return () => window.clearInterval(timer);
  }, [showPauseMenu, onComplete]);

  const applySwirlImpulse = useCallback((strength = 1.0) => {
    const sim = simRef.current;
    if (sim.drops.length === 0) return;
    audio.playSwirl(strength);
    sim.swirlEnergy = Math.min(1, sim.swirlEnergy + 0.22 * strength);
    sim.pigmentClouds.forEach((p, idx) => {
      const dir = idx % 2 === 0 ? 1 : -1;
      p.vx += (-p.y * 0.032 + dir * 1.65) * strength;
      p.vy += p.x * 0.045 * strength;
    });
  }, []);

  const dropDye = useCallback(
    (dyeType: PrimaryDyeCode) => {
      const sim = simRef.current;
      if (sim.locked || isSwirlingCheck || showPauseMenu || runEndedRef.current) return;

      if (sim.drops.length >= target.maxDrops) {
        onToast('Jar full! Tap Tilt to score or Reset.');
        return;
      }

      const spacing = getPipeSpacing(sim.canvasW);
      const pipeIdx = dyeType === 'B' ? 0 : dyeType === 'R' ? 2 : 1;
      const targetOffset = (1 - pipeIdx) * spacing;

      const dropIdx = sim.drops.length;
      setActivePipeCode(dyeType);
      sim.drops = [...sim.drops, dyeType];
      setDrops(sim.drops);
      onDropAdded();

      sim.targetPipeRailOffset = targetOffset;
      sim.pendingDrops.push({
        dyeType,
        pipeCode: dyeType,
        dropIndex: dropIdx,
      });

      sim.swirlEnergy = Math.max(0.25, sim.swirlEnergy * 0.6);
    },
    [isSwirlingCheck, onDropAdded, onToast, showPauseMenu, target.maxDrops]
  );

  // Snappy arcade swirl-check (~340ms) for rapid-fire 60s mixing
  const handleTiltCheck = useCallback(() => {
    const sim = simRef.current;
    if (sim.locked || isSwirlingCheck || showPauseMenu || runEndedRef.current) return;
    if (sim.drops.length === 0) {
      onToast('Drop a color first!');
      return;
    }

    setIsSwirlingCheck(true);
    sim.locked = true;
    onSwirlAction();

    let step = 0;
    if (swirlTimerRef.current !== null) {
      window.clearInterval(swirlTimerRef.current);
    }

    swirlTimerRef.current = window.setInterval(() => {
      step++;
      if (step === 1) {
        sim.targetTilt = -20;
        applySwirlImpulse(1.5);
      } else if (step === 2) {
        sim.targetTilt = 20;
        applySwirlImpulse(1.5);
      } else if (step === 3) {
        sim.targetTilt = 0;
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
        setIsSwirlingCheck(false);

        if (runEndedRef.current) return;

        const evaluation = evaluateMixResult(sim.drops, target.recipe, palette);
        const st = statsRef.current;

        if (evaluation.passed) {
          const isPerfectNoUndo = evaluation.similarity === 100 && !st.usedUndoThisRound;

          if (isPerfectNoUndo) {
            const nextStreak = st.streak + 1;
            const mult = getRushMultiplier(nextStreak);
            const pts = Math.round(150 * mult);
            st.streak = nextStreak;
            st.bestStreak = Math.max(st.bestStreak, nextStreak);
            st.peakMultiplier = Math.max(st.peakMultiplier, mult);
            st.perfectMatches += 1;
            st.matches += 1;
            st.score += pts;
            onPerfectBlend();
            audio.playComboMatch(nextStreak);
            showFloatingBanner(
              `+${pts} · 100% PERFECT!`,
              'perfect',
              nextStreak >= 2 ? `${nextStreak} Streak · ${mult}x Combo` : 'No-Undo Streak Started!'
            );
          } else {
            // Still passes and advances, but resets the consecutive 100% no-undo streak
            const pts = evaluation.similarity === 100 ? 120 : 100;
            st.streak = 0;
            st.matches += 1;
            st.score += pts;
            audio.playComboMatch(1);
            showFloatingBanner(
              `+${pts} · ${evaluation.similarity}% Match`,
              'good',
              st.usedUndoThisRound ? 'Undo used · Streak reset' : 'Hit 100% for Streak!'
            );
          }

          st.usedUndoThisRound = false;
          setScore(st.score);
          setMatches(st.matches);
          setStreak(st.streak);
          setUsedUndoThisRound(false);

          const nextTarget = pickNextRushTarget(st.matches, target.id);
          clearTimerRef.current = window.setTimeout(() => {
            if (runEndedRef.current) return;
            setTarget(nextTarget);
            clearLiquidVessel();
          }, 220);
        } else {
          // Missed: reset streak and auto-clear fast so player never loses flow
          st.streak = 0;
          setStreak(0);
          audio.playFail();
          showFloatingBanner(
            `${evaluation.similarity}% — Try Again!`,
            'miss',
            'Streak reset · Jar cleared'
          );
          clearTimerRef.current = window.setTimeout(() => {
            if (runEndedRef.current) return;
            clearLiquidVessel();
          }, 260);
        }
      }
    }, 85);
  }, [
    applySwirlImpulse,
    clearLiquidVessel,
    isSwirlingCheck,
    onPerfectBlend,
    onSwirlAction,
    onToast,
    palette,
    showFloatingBanner,
    showPauseMenu,
    target.id,
    target.recipe,
  ]);

  const handleUndo = () => {
    const sim = simRef.current;
    if (sim.locked || isSwirlingCheck || sim.drops.length === 0 || runEndedRef.current) return;
    sim.drops = sim.drops.slice(0, -1);
    if (sim.pendingDrops.length > 0) {
      sim.pendingDrops.pop();
    } else {
      sim.pigmentClouds.splice(Math.max(0, sim.pigmentClouds.length - 9), 9);
    }
    setDrops(sim.drops);
    statsRef.current.undosUsed += 1;
    if (!statsRef.current.usedUndoThisRound) {
      statsRef.current.usedUndoThisRound = true;
      setUsedUndoThisRound(true);
      if (statsRef.current.streak > 0) {
        statsRef.current.streak = 0;
        setStreak(0);
        onToast('Undo used — combo streak reset!');
      }
    }
    audio.playSwirl(0.5);
  };

  const handleResetJar = () => {
    if (isSwirlingCheck || runEndedRef.current) return;
    audio.playSwirl(0.7);
    clearLiquidVessel();
  };

  // 60fps Canvas Loop (Same Sliding 3 Pipes + Equipped Vessel + Equipped Liquid Finish)
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

      if (sim.pendingDrops.length > 0) {
        const nextPending = sim.pendingDrops[0];
        const spacing = getPipeSpacing(sim.canvasW);
        const pIdx = nextPending.pipeCode === 'B' ? 0 : nextPending.pipeCode === 'R' ? 2 : 1;
        const desiredOffset = (1 - pIdx) * spacing;
        sim.targetPipeRailOffset = desiredOffset;

        const diff = desiredOffset - sim.pipeRailOffset;
        if (Math.abs(diff) <= 4.5) {
          sim.pipeRailOffset = desiredOffset;
          sim.pendingDrops.shift();

          const pipes = getColorPipeLayout(sim.canvasW, sim.canvasH, sim.pipeRailOffset);
          const centeredPipe = pipes.find((p) => p.code === nextPending.pipeCode) || pipes[1];
          const cy = getVesselCenterY(sim.canvasH, true);
          const rgb = getDyeRgb(nextPending.dyeType, palette);
          const jitterX = (Math.random() - 0.5) * Math.min(8, m.topW * 0.14);

          sim.pipePulses[nextPending.pipeCode] = 1;
          audio.playDrop(nextPending.dyeType, nextPending.dropIndex);

          sim.fallingDrops.push({
            x: sim.canvasW / 2 + jitterX,
            y: centeredPipe.nozzleY,
            targetY: cy - m.height * 0.14,
            vy: 6.2,
            radius: 9.5,
            rgb: [...rgb] as [number, number, number],
            dyeType: nextPending.dyeType,
            localX: jitterX,
          });
        } else {
          sim.pipeRailOffset += diff * 0.38;
        }
      } else {
        sim.pipeRailOffset += (sim.targetPipeRailOffset - sim.pipeRailOffset) * 0.28;
      }

      sim.pipePulses.B = Math.max(0, sim.pipePulses.B * 0.86 - 0.01);
      sim.pipePulses.Y = Math.max(0, sim.pipePulses.Y * 0.86 - 0.01);
      sim.pipePulses.R = Math.max(0, sim.pipePulses.R * 0.86 - 0.01);

      const prevTilt = sim.tiltAngle;
      sim.tiltAngle += (sim.targetTilt - sim.tiltAngle) * 0.2;
      const tiltDelta = Math.abs(sim.tiltAngle - prevTilt);

      if (tiltDelta > 0.26 && sim.drops.length > 0) {
        applySwirlImpulse(Math.min(1.4, tiltDelta * 0.15));
      }

      sim.wavePhase += 0.062 + tiltDelta * 0.03;

      for (let i = sim.fallingDrops.length - 1; i >= 0; i--) {
        const d = sim.fallingDrops[i];
        d.vy += 0.72;
        d.y += d.vy;
        if (d.y >= d.targetY) {
          const spawnY = waterTopY + 12 + Math.random() * 14;
          for (let k = 0; k < 8; k++) {
            const angle = (Math.PI * 2 * k) / 8 + Math.random() * 0.5;
            const speed = 0.45 + Math.random() * 1.1;
            sim.pigmentClouds.push({
              x: d.localX + (Math.random() - 0.5) * 14,
              y: spawnY,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed * 0.8 + 0.42,
              radius: (15 + Math.random() * 12) * m.scale,
              maxRadius: (42 + Math.random() * 16) * m.scale,
              rgb: [...d.rgb] as [number, number, number],
              dyeType: d.dyeType,
              alpha: 0.54,
              phase: Math.random() * Math.PI * 2,
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
        rip.radius += 1.6;
        rip.alpha -= 0.028;
        if (rip.alpha <= 0 || rip.radius >= rip.maxRadius) {
          sim.ripples.splice(i, 1);
        }
      }

      const blendedRGB: [number, number, number] =
        sim.drops.length > 0 ? getRecipeRgb(sim.drops, palette) : [180, 236, 255];

      const tiltRad = (sim.tiltAngle * Math.PI) / 180;
      const gravX = Math.sin(tiltRad) * 0.35;

      for (const p of sim.pigmentClouds) {
        p.phase += 0.032;
        p.radius += (p.maxRadius - p.radius) * 0.032;
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
        const minY = waterTopY + 10;
        const maxY = waterBotY - 12;
        if (p.y < minY) {
          p.y = minY;
          p.vy *= -0.5;
        }
        if (p.y > maxY) {
          p.y = maxY;
          p.vy *= -0.5;
        }
        const blendRate = 0.028 + sim.swirlEnergy * 0.08;
        p.rgb[0] += (blendedRGB[0] - p.rgb[0]) * blendRate;
        p.rgb[1] += (blendedRGB[1] - p.rgb[1]) * blendRate;
        p.rgb[2] += (blendedRGB[2] - p.rgb[2]) * blendRate;
      }

      if (sim.drops.length > 0 && sim.swirlEnergy < 1) {
        sim.swirlEnergy = Math.min(1, sim.swirlEnergy + 0.004);
      }

      renderLiquidGlassScene(ctx, sim.canvasW, sim.canvasH, {
        vesselId: gameState.equippedVessel,
        palette,
        liquidFinish: gameState.equippedFinish,
        drops: sim.drops,
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
        if (sim.drops.length === 0) {
          setMatchPct(0);
        } else {
          const rawSim = colorSimilarity(blendedRGB, targetRgb);
          setMatchPct(Math.min(100, Math.round(rawSim * (0.65 + 0.35 * sim.swirlEnergy))));
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
    gameState.equippedFinish,
    gameState.equippedVessel,
    palette,
    targetRgb,
  ]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || simRef.current.locked || isSwirlingCheck || showPauseMenu) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const pipes = getColorPipeLayout(
      simRef.current.canvasW,
      simRef.current.canvasH,
      simRef.current.pipeRailOffset
    );
    const pipeBottom = (pipes[0]?.nozzleY ?? 90) + 12;
    if (y <= pipeBottom) return;

    simRef.current.isDragging = true;
    simRef.current.lastPointerX = x;
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
    sim.targetTilt = 0;
  };

  const secondsLeft = Math.ceil(remainingMs / 1000);
  const timerProgressPct = Math.max(0, Math.min(100, (remainingMs / RUSH_DURATION_MS) * 100));
  const isUrgent = secondsLeft <= 10;
  const nextMult = getRushMultiplier(streak + 1);
  const currentMult = getRushMultiplier(streak);
  const remainingDrops = Math.max(0, target.maxDrops - drops.length);
  const outOfDrops = remainingDrops <= 0 || isSwirlingCheck;
  const canMixNow = drops.length > 0;

  const primaryCards: Array<{code: PrimaryDyeCode; label: string; color: string}> = [
    {code: 'B', label: palette.names.B, color: `rgb(${palette.B[0]}, ${palette.B[1]}, ${palette.B[2]})`},
    {code: 'Y', label: palette.names.Y, color: `rgb(${palette.Y[0]}, ${palette.Y[1]}, ${palette.Y[2]})`},
    {code: 'R', label: palette.names.R, color: `rgb(${palette.R[0]}, ${palette.R[1]}, ${palette.R[2]})`},
  ];

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden select-none">
      {/* Equipped Scenic Studio Background Theme */}
      <PastelNatureBackdrop variant="gameplay" themeId={gameState.equippedTheme} />

      {/* 1. TOP RUSH HEADER: Pause | 60s Timer Capsule | Audio Controls */}
      <header className="relative z-20 px-3 pt-2.5 pb-1.5 flex items-center justify-between gap-2 shrink-0">
        <button
          type="button"
          onClick={() => {
            audio.playClick();
            setShowPauseMenu(true);
          }}
          aria-label="Pause Rush"
          className="w-11 h-11 rounded-[14px] pastel-white-sq-btn flex items-center justify-center text-[#18495A] cursor-pointer shrink-0"
        >
          <Pause className="w-5 h-5 fill-[#18495A] stroke-[#18495A]" />
        </button>

        {/* Center 60s Countdown + Score Capsule */}
        <div
          className={`flex-1 h-11 rounded-full px-3.5 flex items-center justify-between gap-2 border-[2.5px] border-[#18495A] shadow-[0_4px_0_rgba(18,73,90,0.28)] overflow-hidden transition-colors ${
            isUrgent
              ? 'bg-gradient-to-b from-[#FF8EA8] to-[#EE456E] text-white'
              : 'bg-gradient-to-b from-[#FFD56E] to-[#FF9B38] text-[#4C1E08]'
          }`}
        >
          <div className="flex items-center gap-1.5 shrink-0">
            <Timer className="w-4.5 h-4.5 stroke-[2.8]" />
            <span className="font-display font-bold text-lg font-mono-num leading-none">
              {secondsLeft}s
            </span>
          </div>

          <div className="h-5 w-[1.5px] bg-current/25 shrink-0" />

          <div className="flex flex-col items-end leading-none min-w-0">
            <span className="text-[9.5px] font-extrabold uppercase tracking-wider opacity-85">
              Score
            </span>
            <span className="font-display font-bold text-base font-mono-num leading-tight">
              {score.toLocaleString()}
            </span>
          </div>
        </div>

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

      {/* Thin 60s Countdown Progress Bar */}
      <div className="relative z-20 px-3 pb-1.5 shrink-0">
        <div className="w-full h-2 rounded-full bg-[#104754]/30 border border-[#18495A]/60 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-100 ${
              isUrgent
                ? 'bg-gradient-to-r from-[#FF4C72] to-[#FF9B42]'
                : 'bg-gradient-to-r from-[#38E27D] via-[#FFD147] to-[#FF8A38]'
            }`}
            style={{width: `${timerProgressPct}%`}}
          />
        </div>
      </div>

      {/* 2. RUSH HUD CARD: Target Shade | Streak Multiplier | Matched & Drops */}
      <section className="relative z-20 px-3 shrink-0">
        <div className="pastel-hud-card rounded-[20px] px-3 py-2 flex items-center justify-between gap-2">
          {/* Left: Target Swatch + Name */}
          <div className="flex items-center gap-2 min-w-0 flex-[1.2]">
            <div
              className="w-10 h-10 rounded-[11px] border-2 border-[#18495A] shadow-[inset_0_2px_0_rgba(255,255,255,0.45)] shrink-0"
              style={{backgroundColor: targetHex}}
            />
            <div className="min-w-0">
              <div className="text-[9.5px] font-extrabold uppercase tracking-wider text-[#266073] leading-none">
                Target · #{matches + 1}
              </div>
              <div className="font-display font-bold text-sm sm:text-[15px] text-[#144353] truncate leading-tight mt-0.5">
                {target.name}
              </div>
            </div>
          </div>

          <div className="w-[1.5px] h-8 bg-[#B8DDE2] shrink-0" />

          {/* Center: Endless Streak & Multiplier */}
          <div className="flex flex-col items-center justify-center shrink-0 px-1">
            <div className="flex items-center gap-1">
              <Flame
                className={`w-4 h-4 stroke-[2.6] ${
                  streak >= 2 ? 'text-[#FF6D24] fill-[#FFD147]' : 'text-[#5A8794]'
                }`}
              />
              <span className="font-display font-bold text-base text-[#144353] font-mono-num leading-none">
                {streak > 0 ? `${currentMult}x` : '1x'}
              </span>
            </div>
            <span className="text-[9.5px] font-extrabold text-[#2B6475] leading-tight mt-0.5 whitespace-nowrap">
              {usedUndoThisRound
                ? 'Undo used'
                : streak > 0
                ? `${streak} Streak · Next ${nextMult}x`
                : 'No Undo · 100%'}
            </span>
          </div>

          <div className="w-[1.5px] h-8 bg-[#B8DDE2] shrink-0" />

          {/* Right: Drops Left */}
          <div className="flex flex-col items-center shrink-0 min-w-[58px]">
            <span className="text-[10px] font-extrabold text-[#266073] leading-none mb-1">
              Drops
            </span>
            <div className="w-full h-7 rounded-[10px] pastel-blue-pill flex items-center justify-center px-2">
              <span className="font-display font-bold text-base text-[#144353] font-mono-num leading-none">
                {remainingDrops}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE 3-PIPE + GLASS VESSEL STAGE */}
      <section className="relative z-10 flex-1 min-h-0 flex items-center justify-center overflow-hidden -mt-1">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-full h-full block touch-none cursor-grab active:cursor-grabbing"
        />

        {/* Floating Combo Match / Miss Banner */}
        {banner && (
          <div
            key={banner.id}
            className={`pointer-events-none absolute top-[24%] left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-[18px] border-2 border-[#18495A] shadow-[0_6px_0_rgba(18,73,90,0.3)] text-center animate-pop-in ${
              banner.tone === 'perfect'
                ? 'bg-gradient-to-b from-[#6EF29A] to-[#24C968] text-white'
                : banner.tone === 'good'
                ? 'bg-gradient-to-b from-[#98E4FF] to-[#4AC1FA] text-[#144353]'
                : 'bg-gradient-to-b from-[#FF8CA8] to-[#EE456E] text-white'
            }`}
          >
            <div className="font-display font-bold text-base leading-tight whitespace-nowrap">
              {banner.text}
            </div>
            {banner.sub && (
              <div className="text-[10.5px] font-extrabold opacity-95 leading-tight mt-0.5 whitespace-nowrap">
                {banner.sub}
              </div>
            )}
          </div>
        )}

        {/* Quick Live Match Readout Pill (Right Side) */}
        {canMixNow && (
          <button
            type="button"
            onClick={handleTiltCheck}
            className="absolute right-2.5 top-[36%] z-20 rounded-[16px] bg-white/95 border-2 border-[#18495A] px-2.5 py-1.5 shadow-[0_4px_0_rgba(24,73,90,0.25)] text-center cursor-pointer active:scale-95 transition"
          >
            <div className="font-display font-bold text-sm font-mono-num text-[#144353] leading-none">
              {matchPct}%
            </div>
            <div className="text-[9.5px] font-extrabold text-[#248A62] leading-tight mt-0.5">
              Tap Tilt!
            </div>
          </button>
        )}
      </section>

      {/* 4. BOTTOM CONTROLS: 3 COMPACT COLOR CARDS + TILT / UNDO / RESET */}
      <section className="relative z-20 px-3 pb-2.5 pt-1 shrink-0 space-y-2">
        <div className="max-w-[292px] mx-auto grid grid-cols-3 gap-2">
          {primaryCards.map((item) => {
            const isAligned = activePipeCode === item.code;
            return (
              <button
                key={item.code}
                type="button"
                disabled={outOfDrops}
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

        <div className="grid grid-cols-3 gap-2 px-0.5">
          <button
            type="button"
            disabled={!canMixNow || isSwirlingCheck}
            onClick={handleTiltCheck}
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
            disabled={drops.length === 0 || isSwirlingCheck}
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
            onClick={handleResetJar}
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

      {/* PAUSE OVERLAY FOR TIMED RUSH */}
      {showPauseMenu && (
        <div className="fixed inset-0 z-50 bg-[#0D3C42]/55 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-[330px] pastel-modal rounded-[28px] overflow-hidden animate-pop-in">
            <div className="bg-gradient-to-b from-[#FFD466] to-[#FF9B38] border-b-[2.5px] border-[#18495A] px-4 py-3 text-center">
              <h2 className="font-display font-bold text-2xl text-[#4C1E08] leading-tight">
                Rush Paused
              </h2>
              <p className="text-xs font-bold text-[#6E3010]">
                {secondsLeft}s left · {score.toLocaleString()} pts · {matches} matched
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
                  resetWholeRun();
                }}
                className="w-full h-11 rounded-full pastel-lime-btn font-display font-bold text-base text-[#134D32] flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 stroke-[2.6]" />
                <span>Restart 60s</span>
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
