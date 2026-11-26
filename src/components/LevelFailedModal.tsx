import React from 'react';
import {Home, LayoutGrid, RotateCcw} from 'lucide-react';

interface LevelFailedModalProps {
  levelName: string;
  targetHex: string;
  mixedHex: string;
  isLayered?: boolean;
  targetTopHex?: string;
  targetBottomHex?: string;
  mixedTopHex?: string;
  mixedBottomHex?: string;
  overMixedFail?: boolean;
  matchPercent: number;
  hint: string;
  onRetry: () => void;
  onHome: () => void;
  onShowLevels: () => void;
}

export const LevelFailedModal: React.FC<LevelFailedModalProps> = ({
  levelName,
  targetHex,
  mixedHex,
  isLayered = false,
  targetTopHex,
  targetBottomHex,
  mixedTopHex,
  mixedBottomHex,
  overMixedFail = false,
  matchPercent,
  hint,
  onRetry,
  onHome,
  onShowLevels,
}) => {
  const showSplitTarget = isLayered && targetTopHex && targetBottomHex;
  const showSplitMixed = isLayered && mixedTopHex && mixedBottomHex;

  return (
    <div className="fixed inset-0 z-50 bg-[#0B3338]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-[358px] pastel-modal rounded-[30px] overflow-hidden animate-pop-in">
        {/* Pastel Coral-Rose Banner */}
        <div className="bg-gradient-to-b from-[#FF99B4] to-[#FF6A92] border-b-[2.5px] border-[#18495A] px-4 py-4 text-center">
          <div className="font-display font-bold text-3xl text-white cartoon-text-shadow leading-none">
            {overMixedFail ? 'Over-Mixed!' : 'Almost There!'}
          </div>
          <p className="text-xs font-bold text-[#63152F] mt-1">
            {overMixedFail
              ? `${levelName} · Layers bled together`
              : `${levelName} · Swirled at ${matchPercent}% accuracy`}
          </p>
        </div>

        {/* Swatch Comparison */}
        <div className="p-4 space-y-4">
          <div className="pastel-subcard rounded-[22px] p-3.5 flex items-center justify-between gap-3">
            <div className="flex flex-col items-center flex-1">
              <div
                className="w-14 h-14 rounded-2xl pastel-level-tile mb-1.5"
                style={
                  showSplitTarget
                    ? {
                        backgroundImage: `linear-gradient(180deg, ${targetTopHex} 0%, ${targetTopHex} 50%, ${targetBottomHex} 50%, ${targetBottomHex} 100%)`,
                      }
                    : {backgroundColor: targetHex}
                }
              />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#457282]">
                Target
              </span>
              {showSplitTarget ? (
                <div className="text-center leading-tight">
                  <div className="font-mono-num text-[10px] font-bold text-[#144353]">
                    T:{targetTopHex}
                  </div>
                  <div className="font-mono-num text-[10px] font-bold text-[#144353]">
                    B:{targetBottomHex}
                  </div>
                </div>
              ) : (
                <span className="font-mono-num text-xs font-bold text-[#144353]">{targetHex}</span>
              )}
            </div>

            <div className="flex flex-col items-center">
              <span className="font-display font-bold text-2xl text-[#E23265] font-mono-num">
                {matchPercent}%
              </span>
              <span className="text-[10px] font-extrabold text-[#457282] uppercase">
                {overMixedFail ? 'Too Rough' : 'Need 84%+'}
              </span>
            </div>

            <div className="flex flex-col items-center flex-1">
              <div
                className="w-14 h-14 rounded-2xl pastel-level-tile mb-1.5"
                style={
                  showSplitMixed
                    ? {
                        backgroundImage: `linear-gradient(180deg, ${mixedTopHex} 0%, ${mixedTopHex} 50%, ${mixedBottomHex} 50%, ${mixedBottomHex} 100%)`,
                      }
                    : {backgroundColor: mixedHex}
                }
              />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#457282]">
                Your Mix
              </span>
              {showSplitMixed ? (
                <div className="text-center leading-tight">
                  <div className="font-mono-num text-[10px] font-bold text-[#144353]">
                    T:{mixedTopHex}
                  </div>
                  <div className="font-mono-num text-[10px] font-bold text-[#144353]">
                    B:{mixedBottomHex}
                  </div>
                </div>
              ) : (
                <span className="font-mono-num text-xs font-bold text-[#144353]">{mixedHex}</span>
              )}
            </div>
          </div>

          <div className="bg-[#E6F8F8] rounded-2xl border-2 border-[#B6DFE4] px-3 py-2 text-center text-xs font-bold text-[#1A5566]">
            {overMixedFail
              ? 'Tip: Tilt gently (±15° or less) so Top & Bottom layers stay crisp!'
              : `Tip: ${hint}`}
          </div>

          {/* Primary Retry + Home & Level List Buttons */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={onRetry}
              className="w-full py-3.5 px-4 rounded-full pastel-coral-btn font-display font-bold text-lg text-white cartoon-text-shadow flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-5 h-5 stroke-[2.6]" />
              <span>RETRY LEVEL</span>
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={onHome}
                className="py-2.5 px-3 rounded-full pastel-silver-btn font-display font-bold text-sm text-[#18495A] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Home className="w-4 h-4 stroke-[2.5]" />
                <span>Home</span>
              </button>

              <button
                type="button"
                onClick={onShowLevels}
                className="py-2.5 px-3 rounded-full pastel-silver-btn font-display font-bold text-sm text-[#18495A] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LayoutGrid className="w-4 h-4 stroke-[2.5] text-[#1A84D8]" />
                <span>Levels</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
