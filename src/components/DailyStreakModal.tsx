import React from 'react';
import {DAILY_LOGIN_REWARDS} from '../game/data';
import {canClaimDailyLogin, getActiveStreakDayToClaim} from '../game/storage';
import type {SavedGameState} from '../game/types';
import {DiamondIcon, StarburstSpark} from './ComicIcons';

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
    <div className="fixed inset-0 z-50 bg-[#141414]/65 flex items-center justify-center p-4">
      <div className="w-full max-w-[380px] bg-[#FFF8DB] rounded-3xl comic-box-lg overflow-hidden animate-pop-in">
        {/* Comic Folder Header */}
        <div className="bg-[#FF7D78] border-b-[3.5px] border-[#141414] px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StarburstSpark color="#FFE047" className="w-7 h-7" />
            <div>
              <h2 className="font-display font-bold text-xl text-[#141414] leading-tight">
                DAILY LOGIN STREAK
              </h2>
              <p className="text-[11px] font-extrabold text-[#141414]/80">
                Log in every day to collect bonus diamonds
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Daily Streak"
            className="w-9 h-9 rounded-xl bg-[#FFFDF5] comic-btn flex items-center justify-center font-black text-base text-[#141414] cursor-pointer"
          >
            ✕
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
                  className={`relative rounded-2xl p-2.5 flex flex-col items-center justify-center text-center transition ${
                    isToday
                      ? 'bg-[#FFE047] comic-box scale-[1.03]'
                      : isClaimed
                      ? 'bg-[#D9F99D] comic-box-sm opacity-90'
                      : 'bg-[#FFFDF5] comic-box-sm'
                  }`}
                >
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#141414]/75">
                    Day {dayNum}
                  </span>
                  <DiamondIcon className="w-9 h-8 my-1" />
                  <span className="font-display font-bold text-base text-[#141414] font-mono-num">
                    +{amount}
                  </span>
                  {isClaimed && (
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#359B62] border-2 border-[#141414] text-white text-xs font-black flex items-center justify-center">
                      ✓
                    </span>
                  )}
                  {isToday && (
                    <span className="absolute -top-2.5 right-1 px-1.5 py-0.5 rounded-md bg-[#FF6B63] border-2 border-[#141414] text-[9px] font-black text-white uppercase">
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
                className={`mt-2.5 rounded-2xl p-3 flex items-center justify-between ${
                  isToday7
                    ? 'bg-[#FFE047] comic-box'
                    : isClaimed7
                    ? 'bg-[#D9F99D] comic-box-sm'
                    : 'bg-[#FFE699] comic-box-sm'
                }`}
              >
                <div className="flex items-center gap-3">
                  <DiamondIcon className="w-11 h-10 shrink-0" />
                  <div>
                    <div className="text-[11px] font-extrabold uppercase text-[#141414]/80">
                      Day 7 Grand Bonus
                    </div>
                    <div className="font-display font-bold text-xl text-[#141414] font-mono-num">
                      +50 Diamonds
                    </div>
                  </div>
                </div>
                {isClaimed7 ? (
                  <span className="px-2.5 py-1 rounded-xl bg-[#359B62] border-2 border-[#141414] text-white text-xs font-black">
                    CLAIMED ✓
                  </span>
                ) : (
                  <StarburstSpark color="#FF7D78" className="w-8 h-8" />
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
                className="w-full py-3 px-4 rounded-2xl bg-[#B8FF00] hover:bg-[#C6FF2E] comic-btn font-display font-bold text-lg text-[#141414] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>CLAIM DAY {currentDay}</span>
                <DiamondIcon className="w-5 h-5" />
                <span className="font-mono-num">+{DAILY_LOGIN_REWARDS[currentDay - 1]}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 px-4 rounded-2xl bg-[#FFFDF5] comic-btn font-display font-bold text-base text-[#141414] cursor-pointer"
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
