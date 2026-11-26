import React from 'react';
import {Flame, Home, RotateCcw, Trophy} from 'lucide-react';
import type {RushRunSummary} from '../game/types';
import {DiamondIcon} from './ComicIcons';

interface RushSummaryModalProps {
  summary: RushRunSummary;
  diamondsEarned: number;
  isNewBestScore: boolean;
  bestScore: number;
  bestStreak: number;
  onPlayAgain: () => void;
  onLobby: () => void;
}

export const RushSummaryModal: React.FC<RushSummaryModalProps> = ({
  summary,
  diamondsEarned,
  isNewBestScore,
  bestScore,
  bestStreak,
  onPlayAgain,
  onLobby,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#0B3338]/65 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-[360px] pastel-modal rounded-[30px] overflow-hidden animate-pop-in">
        {/* Sunset Gold Header */}
        <div className="bg-gradient-to-b from-[#FFD86E] to-[#FF9B38] border-b-[2.5px] border-[#18495A] px-5 py-4 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/90 border-2 border-[#18495A] shadow-[0_3px_0_rgba(24,73,90,0.28)] mb-2">
            <Trophy className="w-6 h-6 text-[#EA7A15] stroke-[2.5]" />
          </div>
          <h2 className="font-display font-bold text-2xl text-[#4C1E08] leading-tight">
            Time&apos;s Up!
          </h2>
          <p className="text-xs font-bold text-[#733210] mt-0.5">
            {isNewBestScore ? 'New Personal Best Score!' : '60s Timed Rush Complete'}
          </p>
        </div>

        {/* Score & Metrics */}
        <div className="p-4 space-y-3">
          {/* Primary Score Card */}
          <div className="pastel-subcard rounded-[22px] p-3.5 text-center">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#266073]">
              Final Score
            </div>
            <div className="font-display font-bold text-4xl font-mono-num text-[#144353] leading-tight mt-0.5">
              {summary.score.toLocaleString()}
            </div>
            <div className="text-xs font-bold text-[#3C6F7E] mt-1">
              Best {bestScore.toLocaleString()} · Record Streak {bestStreak}
            </div>
          </div>

          {/* 3-Column Compact Breakdown */}
          <div className="grid grid-cols-3 gap-2">
            <div className="pastel-subcard rounded-[16px] p-2.5 text-center">
              <div className="font-display font-bold text-xl font-mono-num text-[#144353] leading-none">
                {summary.matches}
              </div>
              <div className="text-[10px] font-extrabold text-[#3E6E7D] mt-1">
                Matched
              </div>
            </div>
            <div className="pastel-subcard rounded-[16px] p-2.5 text-center">
              <div className="flex items-center justify-center gap-0.5 font-display font-bold text-xl font-mono-num text-[#D95B16] leading-none">
                <Flame className="w-4 h-4 fill-[#FFD147] text-[#EA6515]" />
                <span>{summary.bestStreak}</span>
              </div>
              <div className="text-[10px] font-extrabold text-[#3E6E7D] mt-1">
                Best Streak
              </div>
            </div>
            <div className="pastel-subcard rounded-[16px] p-2.5 text-center">
              <div className="font-display font-bold text-xl font-mono-num text-[#188C54] leading-none">
                {summary.peakMultiplier}x
              </div>
              <div className="text-[10px] font-extrabold text-[#3E6E7D] mt-1">
                Peak Combo
              </div>
            </div>
          </div>

          {/* Diamonds Reward Row */}
          <div className="rounded-[18px] bg-[#144D5A] border-2 border-[#0E3640] px-4 py-2.5 flex items-center justify-between text-white">
            <span className="font-display font-bold text-sm">Rush Reward</span>
            <span className="flex items-center gap-1.5 font-display font-bold text-base font-mono-num">
              <DiamondIcon className="w-5 h-4" />
              <span>+{diamondsEarned}</span>
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={onLobby}
              className="w-14 h-12 rounded-full pastel-silver-btn flex items-center justify-center text-[#164454] cursor-pointer shrink-0"
              aria-label="Back to Lobby"
            >
              <Home className="w-5 h-5 stroke-[2.6]" />
            </button>

            <button
              type="button"
              onClick={onPlayAgain}
              className="flex-1 h-12 rounded-full pastel-rush-btn flex items-center justify-center gap-2 font-display font-bold text-lg text-white cartoon-text-shadow cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-5 h-5 stroke-[2.8]" />
              <span>Play Again</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
