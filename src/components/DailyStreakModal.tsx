import React from 'react';
import {Check, X} from 'lucide-react';
import {DAILY_LOGIN_REWARDS} from '../game/data';
import {canClaimDailyLogin, getActiveStreakDayToClaim} from '../game/storage';
import type {SavedGameState} from '../game/types';
import {DailyLoginCardIcon, DiamondIcon, StarburstSpark} from './ComicIcons';

interface DailyStreakModalProps {
  gameState: SavedGameState;
  onClaim: () => void;
  onClose: () => void;
}

export const DailyStreakModal: React.FC<DailyStreakModalProps> = ({
  gameState,
  onClaim,
  onClose,
}) => {
  const claimable = canClaimDailyLogin(gameState);
  const currentDay = getActiveStreakDayToClaim(gameState);

  return (
    <div className="fixed inset-0 z-50 bg-[#0B3338]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-[382px] pastel-modal rounded-[30px] overflow-hidden animate-pop-in">
        {/* Pastel Cartoon Sky-Mint Header */}
        <div className="bg-gradient-to-b from-[#9FE8FF] to-[#6DD3FB] border-b-[2.5px] border-[#18495A] px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <DailyLoginCardIcon className="w-11 h-12 shrink-0 drop-shadow-[0_3px_4px_rgba(14,62,74,0.22)]" />
            <div className="min-w-0">
              <h2 className="font-display font-bold text-xl text-[#144353] leading-tight">
                Daily Login Streak
              </h2>
              <p className="text-[11px] font-bold text-[#1E5C70]">
                Check in daily to collect bonus diamonds
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Daily Streak"
            className="w-9 h-9 rounded-xl pastel-white-sq-btn flex items-center justify-center text-[#164454] cursor-pointer shrink-0"
          >
            <X className="w-4.5 h-4.5 stroke-[3]" />
          </button>
        </div>

        {/* 7-Day Reward Grid */}
        <div className="p-4">
          <div className="grid grid-cols-3 gap-2.5">
            {DAILY_LOGIN_REWARDS.slice(0, 6).map((amount, idx) => {
              const dayNum = idx + 1;
              const isClaimed = claimable ? dayNum < currentDay : dayNum <= gameState.streakDay;
              const isToday = claimable && dayNum === currentDay;

              return (
                <div
                  key={dayNum}
                  className={`relative rounded-[20px] p-2.5 flex flex-col items-center justify-center text-center transition ${
                    isToday
                      ? 'bg-[#FFF5CC] border-[2.5px] border-[#18495A] shadow-[0_4px_0_#D89A14] scale-[1.03]'
                      : isClaimed
                      ? 'bg-[#DCFAEB] border-2 border-[#22A862] shadow-[0_3px_0_#9EE2BF]'
                      : 'pastel-subcard'
                  }`}
                >
                  <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[#3F7080]">
                    Day {dayNum}
                  </span>
                  <DiamondIcon className="w-9 h-8 my-1" />
                  <span className="font-display font-bold text-base text-[#144353] font-mono-num">
                    +{amount}
                  </span>
                  {isClaimed && (
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#24C466] border-2 border-[#144353] text-white flex items-center justify-center shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3.2]" />
                    </span>
                  )}
                  {isToday && (
                    <span className="absolute -top-2.5 right-1 px-2 py-0.5 rounded-full bg-[#EA3E57] border-2 border-[#18495A] text-[9px] font-extrabold text-white uppercase shadow-xs">
                      Today
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Day 7 Grand Prize Banner */}
          {(() => {
            const isClaimed7 = claimable ? false : gameState.streakDay === 7;
            const isToday7 = claimable && currentDay === 7;
            return (
              <div
                className={`mt-2.5 rounded-[22px] p-3 flex items-center justify-between ${
                  isToday7
                    ? 'bg-[#FFF4C4] border-[2.5px] border-[#18495A] shadow-[0_4px_0_#D89A14]'
                    : isClaimed7
                    ? 'bg-[#DCFAEB] border-2 border-[#22A862]'
                    : 'pastel-subcard'
                }`}
              >
                <div className="flex items-center gap-3">
                  <DiamondIcon className="w-11 h-10 shrink-0" />
                  <div>
                    <div className="text-[10.5px] font-extrabold uppercase tracking-wider text-[#3F7080]">
                      Day 7 Grand Bonus
                    </div>
                    <div className="font-display font-bold text-xl text-[#144353] font-mono-num">
                      +50 Diamonds
                    </div>
                  </div>
                </div>
                {isClaimed7 ? (
                  <span className="px-2.5 py-1 rounded-full bg-[#24C466] border-2 border-[#144353] text-white text-xs font-extrabold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Claimed</span>
                  </span>
                ) : (
                  <StarburstSpark color="#FFD44D" className="w-8 h-8 animate-sparkle" />
                )}
              </div>
            );
          })()}

          {/* Action CTA */}
          <div className="mt-4">
            {claimable ? (
              <button
                type="button"
                onClick={onClaim}
                className="w-full py-3.5 px-4 rounded-full pastel-play-btn font-display font-bold text-lg text-white cartoon-text-shadow flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>CLAIM DAY {currentDay}</span>
                <DiamondIcon className="w-5 h-5" />
                <span className="font-mono-num">+{DAILY_LOGIN_REWARDS[currentDay - 1]}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 px-4 rounded-full pastel-silver-btn font-display font-bold text-sm text-[#18495A] cursor-pointer"
              >
                Come Back Tomorrow for Day {gameState.streakDay >= 7 ? 1 : gameState.streakDay + 1}!
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
