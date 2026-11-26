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
  isLayered?: boolean;
  topHexCode?: string;
  bottomHexCode?: string;
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
  isLayered = false,
  topHexCode,
  bottomHexCode,
  recipeText,
  diamondsDelta,
  wasStarUpgrade,
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

  // Pastel Cartoon Vector-Ink Color Vial / Gem Crystallize Celebration
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
    const vialColors = ['#26A5FA', '#FFD424', '#FF4D8A', '#34D97E'];

    const spawnBurst = (cx: number, cy: number, count: number) => {
      for (let i = 0; i < count; i++) {
        const a = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.35;
        const spd = 72 + Math.random() * 148;
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

      // Pastel Mint-Aqua Sky Backdrop
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, '#DDFDF6');
      bgGrad.addColorStop(0.55, '#B4F6EA');
      bgGrad.addColorStop(1, '#7CE7D7');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Soft Sunburst Rays behind Diamond Convergence Point
      const targetX = w * 0.5;
      const targetY = h * 0.45;
      if (elapsed > 0.72) {
        const sunP = Math.min(1, (elapsed - 0.72) / 0.35);
        ctx.save();
        ctx.translate(targetX, targetY);
        ctx.rotate(elapsed * 0.36);
        ctx.scale(sunP, sunP);
        for (let i = 0; i < 12; i++) {
          const a1 = (i * Math.PI * 2) / 12;
          const a2 = a1 + 0.22;
          ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 255, 255, 0.52)' : 'rgba(255, 232, 118, 0.24)';
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(a1) * 145, Math.sin(a1) * 145);
          ctx.lineTo(Math.cos(a2) * 145, Math.sin(a2) * 145);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }

      // 4 Cartoon Vector-Ink Glass Vials along the bottom
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

        // Converging Chroma Beams
        if (beamProg > 0) {
          once(`beam-${i}`, () => audio.playVialBeam(i));
          const curX = vx + (targetX - vx) * beamProg;
          const curY = baseY - vialH + (targetY - (baseY - vialH)) * beamProg;

          ctx.save();
          ctx.lineCap = 'round';
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.78)';
          ctx.lineWidth = 8.5;
          ctx.beginPath();
          ctx.moveTo(vx, baseY - vialH);
          ctx.lineTo(curX, curY);
          ctx.stroke();

          ctx.strokeStyle = col;
          ctx.lineWidth = 4.5;
          ctx.beginPath();
          ctx.moveTo(vx, baseY - vialH);
          ctx.lineTo(curX, curY);
          ctx.stroke();
          ctx.restore();
        }

        // Ground Shadow
        ctx.fillStyle = 'rgba(18, 84, 78, 0.22)';
        ctx.beginPath();
        ctx.roundRect(vx - vialW / 2 + 2.5, baseY - vialH + 4, vialW, vialH, 12);
        ctx.fill();

        // Translucent Glass Vial Body
        ctx.fillStyle = 'rgba(235, 252, 255, 0.92)';
        ctx.beginPath();
        ctx.roundRect(vx - vialW / 2, baseY - vialH, vialW, vialH, 12);
        ctx.fill();

        // Liquid Fill inside Vial
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.roundRect(vx - vialW / 2 + 3, baseY - vialH + 14, vialW - 6, vialH - 17, 9);
        ctx.fill();

        // Fizz Bubble
        const bubY = baseY - 12 - ((elapsed * 42 + i * 19) % 36);
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.beginPath();
        ctx.arc(vx - 3 + Math.sin(elapsed * 6 + i) * 3, bubY, 2.8, 0, Math.PI * 2);
        ctx.fill();

        // Crisp Dark-Teal Vector Ink Outline
        ctx.strokeStyle = '#18495A';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.roundRect(vx - vialW / 2, baseY - vialH, vialW, vialH, 12);
        ctx.stroke();

        // Metallic Teal Stopper
        const corkY = baseY - vialH - 7 - (1 - corkDrop) * 26;
        ctx.fillStyle = '#3B7D92';
        ctx.strokeStyle = '#18495A';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(vx - 9, corkY, 18, 9, 4);
        ctx.fill();
        ctx.stroke();
      });

      // Crystallized Cartoon Gem Trophy at Convergence Point
      const diaDt = elapsed - 0.72;
      if (diaDt > 0) {
        once('diamond-pop', () => {
          audio.playCrystalVictory();
          spawnBurst(targetX, targetY, 24);
        });
        const sc = easeOutElastic(Math.min(1, diaDt / 0.45));
        const bob = Math.sin(diaDt * 4.2) * 3;
        ctx.save();
        ctx.translate(targetX, targetY + bob);
        ctx.scale(sc, sc);

        ctx.fillStyle = 'rgba(18, 84, 92, 0.22)';
        drawDiamondPath(ctx, 2, 6, 28, 34);
        ctx.fill();

        const dGrad = ctx.createLinearGradient(-26, -32, 26, 32);
        dGrad.addColorStop(0, '#D4F9FF');
        dGrad.addColorStop(0.5, '#5AD7FA');
        dGrad.addColorStop(1, '#1B8BE0');
        ctx.fillStyle = dGrad;
        ctx.strokeStyle = '#144353';
        ctx.lineWidth = 2.8;
        drawDiamondPath(ctx, 0, 0, 28, 34);
        ctx.fill();
        ctx.stroke();

        // Inner Gem Facet in Player's Mixed Color
        ctx.fillStyle = hexCode;
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        drawDiamondPath(ctx, 0, 0, 14, 18);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(-8, -11, 3.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Top 3-Star Pop Row (Glossy Gold Stars with Cartoon Ink)
      const starY = 30;
      const starOffsets = [-46, 0, 46];
      const starRadii = [16, 21, 16];

      starOffsets.forEach((ox, idx) => {
        const sx = w * 0.5 + ox;
        const sy = starY + (idx === 1 ? -4 : 3);
        const r = starRadii[idx];
        const earned = idx < stars;

        ctx.save();
        ctx.fillStyle = 'rgba(215, 240, 242, 0.85)';
        ctx.strokeStyle = '#18495A';
        ctx.lineWidth = 2;
        drawStarPath(ctx, sx, sy, 5, r, r * 0.48);
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
            const sGrad = ctx.createLinearGradient(-r, -r, r, r);
            sGrad.addColorStop(0, '#FFF282');
            sGrad.addColorStop(0.5, '#FFC926');
            sGrad.addColorStop(1, '#EB930F');
            ctx.fillStyle = sGrad;
            ctx.strokeStyle = '#18495A';
            ctx.lineWidth = 2.2;
            drawStarPath(ctx, 0, 0, 5, r, r * 0.48);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
          }
        }
      });

      // Update & Draw Glossy Gem Sparks
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
        ctx.strokeStyle = '#18495A';
        ctx.lineWidth = 1.4;
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
    <div className="fixed inset-0 z-50 bg-[#0B3338]/60 backdrop-blur-sm flex items-center justify-center p-3">
      <div className="w-full max-w-[378px] max-h-[94dvh] pastel-modal rounded-[30px] overflow-hidden flex flex-col animate-pop-in">
        {/* Pastel Cartoon Celebration Header */}
        <div className="bg-gradient-to-b from-[#9CF0C4] to-[#56DB94] border-b-[2.5px] border-[#18495A] px-4 py-3 flex items-center justify-between shrink-0">
          <div>
            <div className="font-display font-bold text-2xl text-[#144353] leading-none">
              {stars === 3 ? 'Perfect Blend!' : 'Level Complete!'}
            </div>
            <div className="text-[11px] font-bold text-[#18574A] mt-0.5">
              {typeName} · Level {levelNumber} ({matchPercent}% Match)
            </div>
          </div>

          {/* Diamond Reward Pill */}
          <div className="pastel-teal-pill rounded-2xl px-2.5 py-1.5 flex items-center gap-1.5">
            <DiamondIcon className="w-6 h-5" />
            <div className="text-left leading-none">
              <div className="font-display font-bold text-base text-white font-mono-num">
                {diamondsDelta > 0 ? `+${diamondsDelta}` : 'MAX'}
              </div>
              <div className="text-[9px] font-extrabold text-[#A8F3E6] uppercase">
                {wasStarUpgrade ? '3★ Bonus' : diamondsDelta > 0 ? 'Earned' : 'Collected'}
              </div>
            </div>
          </div>
        </div>

        {/* Color Vial / Gem Crystallize Animation Stage */}
        <div className="relative w-full h-[182px] border-b-[2.5px] border-[#18495A] shrink-0 overflow-hidden">
          <canvas ref={canvasRef} className="w-full h-full block" />
        </div>

        {/* Crisp Result Color Swatch & High-Contrast HEX Card + Actions */}
        <div className="p-3.5 space-y-3 overflow-y-auto">
          <div className="pastel-subcard rounded-[22px] p-3 flex items-center gap-3.5">
            {/* Bold, Clear Full-Bleed Color Swatch (50/50 split for two-tone levels) */}
            <div
              className="relative w-16 h-16 rounded-2xl border-[2.5px] border-[#18495A] shadow-[0_4px_0_rgba(20,74,88,0.32),inset_0_3px_0_rgba(255,255,255,0.45)] shrink-0 overflow-hidden"
              style={
                isLayered && topHexCode && bottomHexCode
                  ? {
                      backgroundImage: `linear-gradient(180deg, ${topHexCode} 0%, ${topHexCode} 50%, ${bottomHexCode} 50%, ${bottomHexCode} 100%)`,
                    }
                  : {backgroundColor: hexCode}
              }
            >
              <span className="pointer-events-none absolute top-1.5 left-2 w-6 h-1.5 rounded-full bg-white/45" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="font-display font-bold text-lg text-[#103D4D] leading-tight truncate">
                {levelName}
              </div>
              <div className="text-xs font-bold text-[#1F5E70] truncate mt-0.5">
                {recipeText}
              </div>
              {isLayered && topHexCode && bottomHexCode ? (
                <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                  <div className="inline-flex items-center gap-1.5 bg-[#144353] border border-[#0D2F3B] rounded-full px-2.5 py-0.5 shadow-xs">
                    <span
                      className="w-3 h-3 rounded-full border-[1.5px] border-white shrink-0"
                      style={{backgroundColor: topHexCode}}
                    />
                    <span className="font-mono-num text-[11px] font-extrabold text-white tracking-wide">
                      T {topHexCode.toUpperCase()}
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 bg-[#144353] border border-[#0D2F3B] rounded-full px-2.5 py-0.5 shadow-xs">
                    <span
                      className="w-3 h-3 rounded-full border-[1.5px] border-white shrink-0"
                      style={{backgroundColor: bottomHexCode}}
                    />
                    <span className="font-mono-num text-[11px] font-extrabold text-white tracking-wide">
                      B {bottomHexCode.toUpperCase()}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mt-1.5 inline-flex items-center gap-2 bg-[#144353] border border-[#0D2F3B] rounded-full px-3 py-1 shadow-xs">
                  <span
                    className="w-3.5 h-3.5 rounded-full border-[1.5px] border-white shrink-0"
                    style={{backgroundColor: hexCode}}
                  />
                  <span className="font-mono-num text-sm font-extrabold text-white tracking-wider leading-none">
                    {hexCode.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Save Snapshot + Copy Recipe */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={onSaveSnapshot}
              className="py-2.5 px-2 rounded-full pastel-silver-btn font-display font-bold text-xs text-[#18495A] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Camera className="w-4 h-4 stroke-[2.4] text-[#1A84D8]" />
              <span>Save Snapshot</span>
            </button>
            <button
              type="button"
              onClick={onCopyRecipe}
              className="py-2.5 px-2 rounded-full pastel-silver-btn font-display font-bold text-xs text-[#18495A] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Copy className="w-4 h-4 stroke-[2.4] text-[#18946E]" />
              <span>Copy Recipe</span>
            </button>
          </div>

          {/* Primary Navigation Row */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onHome}
              aria-label="Go to Lobby"
              className="w-12 h-12 rounded-2xl pastel-white-sq-btn flex items-center justify-center text-[#164454] cursor-pointer shrink-0"
            >
              <Home className="w-5 h-5 stroke-[2.5]" />
            </button>

            <button
              type="button"
              onClick={onReplay}
              aria-label="Replay Level"
              className="w-12 h-12 rounded-2xl pastel-white-sq-btn flex items-center justify-center text-[#164454] cursor-pointer shrink-0"
            >
              <RotateCcw className="w-5 h-5 stroke-[2.5]" />
            </button>

            <button
              type="button"
              onClick={onNext}
              className="flex-1 h-12 rounded-full pastel-play-btn font-display font-bold text-lg text-white cartoon-text-shadow flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>
                {isFinalUnlocksChapter
                  ? 'CONTINUE'
                  : hasNextLevel
                  ? 'NEXT LEVEL'
                  : 'LOBBY'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
