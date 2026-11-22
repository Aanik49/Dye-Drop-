import React, {useEffect, useRef} from 'react';
import {Camera, Copy, Home, RotateCcw} from 'lucide-react';
import {audio} from '../game/audio';
import {DiamondIcon} from './ComicIcons';

interface LevelSuccessModalProps {
  levelNumber: number;
  levelName: string;
  typeName: string;
  stars: number;
  matchPercent: number;
  hexCode: string;
  recipeText: string;
  diamondsDelta: number;
  wasStarUpgrade: boolean;
  snapshotDataUrl: string;
  accentColor: string;
  folderBg: string;
  isFinalUnlocksChapter: boolean;
  hasNextLevel: boolean;
  onSaveSnapshot: () => void;
  onCopyRecipe: () => void;
  onReplay: () => void;
  onHome: () => void;
  onNext: () => void;
}

function easeOutBack(x: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

function easeOutElastic(x: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const c4 = (2 * Math.PI) / 3;
  return Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}

function drawStarPath(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerR: number,
  innerR: number
) {
  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const a = (i * Math.PI) / spikes - Math.PI / 2;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function drawDiamondPath(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rx: number,
  ry: number
) {
  ctx.beginPath();
  ctx.moveTo(cx, cy - ry);
  ctx.lineTo(cx + rx, cy);
  ctx.lineTo(cx, cy + ry);
  ctx.lineTo(cx - rx, cy);
  ctx.closePath();
}

export const LevelSuccessModal: React.FC<LevelSuccessModalProps> = ({
  levelNumber,
  levelName,
  typeName,
  stars,
  matchPercent,
  hexCode,
  recipeText,
  diamondsDelta,
  wasStarUpgrade,
  snapshotDataUrl,
  accentColor,
  folderBg,
  isFinalUnlocksChapter,
  hasNextLevel,
  onSaveSnapshot,
  onCopyRecipe,
  onReplay,
  onHome,
  onNext,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 07. Color Vial / Gem Crystallize Celebration Animation in Comic Pop-Art Style
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let elapsed = 0;
    let lastTime = performance.now();
    const triggered = new Set<string>();

    interface Spark {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      rot: number;
      vrot: number;
      life: number;
    }

    const sparks: Spark[] = [];
    const vialColors = ['#FF5A79', '#4CE4F2', '#FFE047', '#52DC89'];

    const spawnBurst = (cx: number, cy: number, count: number) => {
      for (let i = 0; i < count; i++) {
        const a = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.35;
        const spd = 70 + Math.random() * 145;
        sparks.push({
          x: cx,
          y: cy,
          vx: Math.cos(a) * spd,
          vy: Math.sin(a) * spd - 35,
          size: 4 + Math.random() * 4.5,
          color: vialColors[i % vialColors.length],
          rot: Math.random() * Math.PI * 2,
          vrot: (Math.random() - 0.5) * 8,
          life: 1,
        });
      }
    };

    const once = (key: string, fn: () => void) => {
      if (!triggered.has(key)) {
        triggered.add(key);
        fn();
      }
    };

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      elapsed += dt;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(260, rect.width);
      const h = Math.max(170, rect.height);
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Creamy Comic Halftone Backdrop
      ctx.fillStyle = folderBg;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = 'rgba(20, 20, 20, 0.08)';
      for (let gx = 10; gx < w; gx += 16) {
        for (let gy = 10; gy < h; gy += 16) {
          ctx.beginPath();
          ctx.arc(gx, gy, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Comic Sunburst behind Diamond Convergence Point
      const targetX = w * 0.5;
      const targetY = h * 0.44;
      if (elapsed > 0.72) {
        const sunP = Math.min(1, (elapsed - 0.72) / 0.35);
        ctx.save();
        ctx.translate(targetX, targetY);
        ctx.rotate(elapsed * 0.45);
        ctx.scale(sunP, sunP);
        for (let i = 0; i < 12; i++) {
          const a1 = (i * Math.PI * 2) / 12;
          const a2 = a1 + 0.24;
          ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 224, 71, 0.45)';
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(a1) * 140, Math.sin(a1) * 140);
          ctx.lineTo(Math.cos(a2) * 140, Math.sin(a2) * 140);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }

      // 4 Color Vials along the bottom
      const vialW = 28;
      const vialH = 66;
      const baseY = h * 0.91;
      const spacing = Math.min(62, w * 0.19);
      const startX = w * 0.5 - spacing * 1.5;

      const corkDrop = easeOutBack(Math.min(1, elapsed / 0.32));
      const beamProg = Math.min(1, Math.max(0, (elapsed - 0.34) / 0.38));

      if (elapsed > 0.04) {
        once('corks', () => audio.playVialCork());
      }

      vialColors.forEach((col, i) => {
        const vx = startX + i * spacing;

        // Converging Bold Comic Chroma Beams
        if (beamProg > 0) {
          once(`beam-${i}`, () => audio.playVialBeam(i));
          const curX = vx + (targetX - vx) * beamProg;
          const curY = baseY - vialH + (targetY - (baseY - vialH)) * beamProg;

          ctx.save();
          ctx.lineCap = 'round';
          // Outer black comic stroke
          ctx.strokeStyle = '#141414';
          ctx.lineWidth = 8.5;
          ctx.beginPath();
          ctx.moveTo(vx, baseY - vialH);
          ctx.lineTo(curX, curY);
          ctx.stroke();

          // Inner vivid color beam
          ctx.strokeStyle = col;
          ctx.lineWidth = 4.5;
          ctx.beginPath();
          ctx.moveTo(vx, baseY - vialH);
          ctx.lineTo(curX, curY);
          ctx.stroke();
          ctx.restore();
        }

        // Vial Hard Comic Shadow
        ctx.fillStyle = '#141414';
        ctx.beginPath();
        ctx.roundRect(vx - vialW / 2 + 3, baseY - vialH + 3, vialW, vialH, 10);
        ctx.fill();

        // Vial Body Glass
        ctx.fillStyle = '#FFFDF5';
        ctx.strokeStyle = '#141414';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(vx - vialW / 2, baseY - vialH, vialW, vialH, 10);
        ctx.fill();

        // Liquid Fill inside Vial
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.roundRect(vx - vialW / 2 + 3, baseY - vialH + 14, vialW - 6, vialH - 17, 7);
        ctx.fill();

        // Harmonic Fizz Bubbles inside Vial
        const bubY = baseY - 12 - ((elapsed * 42 + i * 19) % 36);
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.beginPath();
        ctx.arc(vx - 3 + Math.sin(elapsed * 6 + i) * 3, bubY, 3, 0, Math.PI * 2);
        ctx.fill();

        // Re-stroke Vial Outline
        ctx.strokeStyle = '#141414';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(vx - vialW / 2, baseY - vialH, vialW, vialH, 10);
        ctx.stroke();

        // Golden Stopper Cork
        const corkY = baseY - vialH - 7 - (1 - corkDrop) * 26;
        ctx.fillStyle = '#FFE047';
        ctx.strokeStyle = '#141414';
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.roundRect(vx - 9, corkY, 18, 9, 3);
        ctx.fill();
        ctx.stroke();
      });

      // Spinning Crystallized Comic Diamond Trophy at Convergence Point
      const diaDt = elapsed - 0.72;
      if (diaDt > 0) {
        once('diamond-pop', () => {
          audio.playCrystalVictory();
          spawnBurst(targetX, targetY, 26);
        });
        const sc = easeOutElastic(Math.min(1, diaDt / 0.45));
        const bob = Math.sin(diaDt * 4.5) * 3;
        ctx.save();
        ctx.translate(targetX, targetY + bob);
        ctx.scale(sc, sc);

        // Hard offset shadow
        ctx.fillStyle = '#141414';
        drawDiamondPath(ctx, 4, 4, 28, 34);
        ctx.fill();

        // Faceted Diamond Fill tinted with mixed color + cyan brilliance
        const dGrad = ctx.createLinearGradient(-26, -32, 26, 32);
        dGrad.addColorStop(0, '#D8FBFF');
        dGrad.addColorStop(0.5, '#7AE6F5');
        dGrad.addColorStop(1, '#38BDF8');
        ctx.fillStyle = dGrad;
        ctx.strokeStyle = '#141414';
        ctx.lineWidth = 3.5;
        drawDiamondPath(ctx, 0, 0, 28, 34);
        ctx.fill();
        ctx.stroke();

        // Inner Gem Facet in Player's Mixed Color!
        ctx.fillStyle = hexCode;
        ctx.strokeStyle = '#141414';
        ctx.lineWidth = 2.2;
        drawDiamondPath(ctx, 0, 0, 14, 18);
        ctx.fill();
        ctx.stroke();

        // Specular Sparkle
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(-8, -11, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Top 3-Star Pop Row
      const starY = 30;
      const starOffsets = [-46, 0, 46];
      const starRadii = [16, 21, 16];

      starOffsets.forEach((ox, idx) => {
        const sx = w * 0.5 + ox;
        const sy = starY + (idx === 1 ? -4 : 3);
        const r = starRadii[idx];
        const earned = idx < stars;

        // Socket
        ctx.save();
        ctx.fillStyle = '#FFFDF5';
        ctx.strokeStyle = '#141414';
        ctx.lineWidth = 2.6;
        drawStarPath(ctx, sx, sy, 5, r, r * 0.46);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        if (earned) {
          const st = elapsed - (0.88 + idx * 0.14);
          if (st > 0) {
            once(`star-${idx}`, () => {
              audio.playStarPop(idx);
              spawnBurst(sx, sy, 8);
            });
            const sScale = easeOutElastic(Math.min(1, st / 0.42));
            ctx.save();
            ctx.translate(sx, sy);
            ctx.scale(sScale, sScale);
            ctx.fillStyle = '#FFE047';
            ctx.strokeStyle = '#141414';
            ctx.lineWidth = 2.8;
            drawStarPath(ctx, 0, 0, 5, r, r * 0.46);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
          }
        }
      });

      // Update & Draw Geometric Comic Sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const sp = sparks[i];
        sp.x += sp.vx * dt;
        sp.y += sp.vy * dt;
        sp.vy += 240 * dt;
        sp.rot += sp.vrot * dt;
        sp.life -= dt * 0.9;
        if (sp.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = Math.max(0, sp.life);
        ctx.translate(sp.x, sp.y);
        ctx.rotate(sp.rot);
        ctx.fillStyle = sp.color;
        ctx.strokeStyle = '#141414';
        ctx.lineWidth = 1.6;
        drawDiamondPath(ctx, 0, 0, sp.size, sp.size * 1.3);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      rafId = window.requestAnimationFrame(render);
    };

    rafId = window.requestAnimationFrame(render);
    return () => window.cancelAnimationFrame(rafId);
  }, [folderBg, hexCode, stars]);

  return (
    <div className="fixed inset-0 z-50 bg-[#141414]/70 flex items-center justify-center p-3">
      <div className="w-full max-w-[375px] max-h-[94dvh] bg-[#FFF8DB] rounded-3xl comic-box-lg overflow-hidden flex flex-col animate-pop-in">
        {/* Top Comic Celebration Banner */}
        <div
          className="border-b-[3.5px] border-[#141414] px-4 py-2.5 flex items-center justify-between shrink-0"
          style={{backgroundColor: accentColor}}
        >
          <div>
            <div className="font-display font-bold text-2xl text-[#FFE047] comic-text-stroke leading-none">
              {stars === 3 ? 'PERFECT MIX!' : 'LEVEL CLEAR!'}
            </div>
            <div className="text-[11px] font-extrabold text-[#141414] mt-0.5">
              {typeName} · Level {levelNumber} ({matchPercent}% Match)
            </div>
          </div>

          {/* Diamond Reward Badge */}
          <div className="bg-[#FFFDF5] comic-box-sm rounded-2xl px-2.5 py-1.5 flex items-center gap-1.5">
            <DiamondIcon className="w-6 h-5" />
            <div className="text-left leading-none">
              <div className="font-display font-bold text-base text-[#141414] font-mono-num">
                {diamondsDelta > 0 ? `+${diamondsDelta}` : 'MAX'}
              </div>
              <div className="text-[9px] font-extrabold text-[#141414]/70 uppercase">
                {wasStarUpgrade ? '3★ Bonus' : diamondsDelta > 0 ? 'Earned' : 'Collected'}
              </div>
            </div>
          </div>
        </div>

        {/* 07. Color Vial / Gem Crystallize Animation Stage */}
        <div className="relative w-full h-[182px] border-b-[3px] border-[#141414] shrink-0 overflow-hidden">
          <canvas ref={canvasRef} className="w-full h-full block" />
        </div>

        {/* Snapshot Color Card + Actions (Studio Unlock Info Removed per Instruction 4) */}
        <div className="p-3.5 space-y-3 overflow-y-auto">
          <div className="bg-[#FFFDF5] rounded-2xl comic-box-sm p-2.5 flex items-center gap-3">
            {snapshotDataUrl ? (
              <img
                src={snapshotDataUrl}
                alt={`Mixed ${levelName} glass`}
                className="w-16 h-16 rounded-xl border-2 border-[#141414] object-cover shrink-0 bg-[#FFF8DB]"
              />
            ) : (
              <div
                className="w-16 h-16 rounded-xl border-2 border-[#141414] shrink-0"
                style={{backgroundColor: hexCode}}
              />
            )}

            <div className="min-w-0 flex-1">
              <div className="font-display font-bold text-base text-[#141414] truncate">
                {levelName}
              </div>
              <div className="text-[11px] font-bold text-[#141414]/75 truncate">{recipeText}</div>
              <div className="mt-1 inline-flex items-center gap-1.5 bg-[#FFE047] border-2 border-[#141414] rounded-lg px-2 py-0.5">
                <span
                  className="w-3 h-3 rounded-full border border-[#141414]"
                  style={{backgroundColor: hexCode}}
                />
                <span className="font-mono-num text-xs font-extrabold text-[#141414]">
                  {hexCode}
                </span>
              </div>
            </div>
          </div>

          {/* Save Snapshot (Generates Image with Color Code) + Copy Recipe */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onSaveSnapshot}
              className="py-2.5 px-2 rounded-xl bg-[#7AE6F5] hover:bg-[#99EEFA] comic-btn font-display font-bold text-xs text-[#141414] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Camera className="w-4 h-4 stroke-[2.6]" />
              <span>Save Snapshot</span>
            </button>
            <button
              type="button"
              onClick={onCopyRecipe}
              className="py-2.5 px-2 rounded-xl bg-[#FFFDF5] hover:bg-[#FFF3C4] comic-btn font-display font-bold text-xs text-[#141414] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Copy className="w-4 h-4 stroke-[2.6]" />
              <span>Copy Recipe</span>
            </button>
          </div>

          {/* Primary Navigation Row */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onHome}
              aria-label="Go to Lobby"
              className="w-12 h-12 rounded-2xl bg-[#FFFDF5] hover:bg-[#FFF3C4] comic-btn flex items-center justify-center text-[#141414] cursor-pointer shrink-0"
            >
              <Home className="w-5 h-5 stroke-[2.6]" />
            </button>

            <button
              type="button"
              onClick={onReplay}
              aria-label="Replay Level"
              className="w-12 h-12 rounded-2xl bg-[#FFE047] hover:bg-[#FFEA75] comic-btn flex items-center justify-center text-[#141414] cursor-pointer shrink-0"
            >
              <RotateCcw className="w-5 h-5 stroke-[2.6]" />
            </button>

            <button
              type="button"
              onClick={onNext}
              className="flex-1 h-12 rounded-2xl bg-[#B8FF00] hover:bg-[#C7FF33] comic-btn font-display font-bold text-lg text-[#141414] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>
                {isFinalUnlocksChapter
                  ? 'CONTINUE'
                  : hasNextLevel
                  ? 'NEXT LEVEL'
                  : 'LOBBY'}
              </span>
              <span className="text-xl leading-none">➔</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
