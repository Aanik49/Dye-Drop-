import React from 'react';
import {Home, LayoutGrid, RotateCcw} from 'lucide-react';

interface LevelFailedModalProps {
  levelName: string;
  targetHex: string;
  mixedHex: string;
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
  matchPercent,
  hint,
  onRetry,
  onHome,
  onShowLevels,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#141414]/70 flex items-center justify-center p-4">
      <div className="w-full max-w-[355px] bg-[#FFF8DB] rounded-3xl comic-box-lg overflow-hidden animate-pop-in">
        {/* Top Banner */}
        <div className="bg-[#FF6B63] border-b-[3.5px] border-[#141414] px-4 py-4 text-center relative">
          <div className="font-display font-bold text-3xl text-[#FFE047] comic-text-stroke leading-none">
            NOT A MATCH!
          </div>
          <p className="text-xs font-extrabold text-[#141414] mt-1">
            {levelName} · Swirled at {matchPercent}% accuracy
          </p>
        </div>

        {/* Swatch Comparison */}
        <div className="p-4 space-y-4">
          <div className="bg-[#FFFDF5] rounded-2xl comic-box-sm p-3.5 flex items-center justify-between gap-3">
            <div className="flex flex-col items-center flex-1">
              <div
                className="w-14 h-14 rounded-2xl comic-box-sm mb-1.5"
                style={{backgroundColor: targetHex}}
              />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#141414]/70">
                Target
              </span>
              <span className="font-mono-num text-xs font-bold text-[#141414]">{targetHex}</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="font-display font-bold text-2xl text-[#E11D48] font-mono-num">
                {matchPercent}%
              </span>
              <span className="text-[10px] font-extrabold text-[#141414]/65 uppercase">
                Need 84%+
              </span>
            </div>

            <div className="flex flex-col items-center flex-1">
              <div
                className="w-14 h-14 rounded-2xl comic-box-sm mb-1.5"
                style={{backgroundColor: mixedHex}}
              />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#141414]/70">
                Your Mix
              </span>
              <span className="font-mono-num text-xs font-bold text-[#141414]">{mixedHex}</span>
            </div>
          </div>

          <div className="bg-[#FFE047]/70 rounded-xl border-2 border-[#141414] px-3 py-2 text-center text-xs font-extrabold text-[#141414]">
            Tip: {hint}
          </div>

          {/* Primary Retry + Home & Level List Buttons (Instruction 5) */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={onRetry}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#B8FF00] hover:bg-[#C6FF2E] comic-btn font-display font-bold text-lg text-[#141414] flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-5 h-5 stroke-[2.8]" />
              <span>RETRY LEVEL</span>
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={onHome}
                className="py-2.5 px-3 rounded-2xl bg-[#FFFDF5] hover:bg-[#FFF3C4] comic-btn font-display font-bold text-sm text-[#141414] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Home className="w-4 h-4 stroke-[2.8]" />
                <span>HOME</span>
              </button>

              <button
                type="button"
                onClick={onShowLevels}
                className="py-2.5 px-3 rounded-2xl bg-[#7AE6F5] hover:bg-[#9BEFFA] comic-btn font-display font-bold text-sm text-[#141414] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LayoutGrid className="w-4 h-4 stroke-[2.8]" />
                <span>LEVELS</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
