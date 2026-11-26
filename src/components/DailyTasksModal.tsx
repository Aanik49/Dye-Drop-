import React from 'react';
import {Check, X} from 'lucide-react';
import type {SavedGameState} from '../game/types';
import {DailyTaskClipboardIcon, DiamondIcon} from './ComicIcons';

interface DailyTasksModalProps {
  gameState: SavedGameState;
  accentColor: string;
  onClaimTask: (taskId: string) => void;
  onClose: () => void;
}

export const DailyTasksModal: React.FC<DailyTasksModalProps> = ({
  gameState,
  onClaimTask,
  onClose,
}) => {
  const claimedCount = gameState.dailyTasks.filter((t) => t.claimed).length;

  return (
    <div className="fixed inset-0 z-50 bg-[#0B3338]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-[378px] pastel-modal rounded-[30px] overflow-hidden animate-pop-in">
        {/* Pastel Cartoon Header */}
        <div className="bg-gradient-to-b from-[#9AF0C2] to-[#56D993] border-b-[2.5px] border-[#18495A] px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <DailyTaskClipboardIcon className="w-11 h-12 shrink-0 drop-shadow-[0_3px_4px_rgba(14,62,74,0.22)]" />
            <div className="min-w-0">
              <h2 className="font-display font-bold text-xl text-[#144353] leading-tight">
                Daily Tasks
              </h2>
              <p className="text-[11px] font-bold text-[#19574B]">
                Complete today&apos;s goals for +10 Diamonds ({claimedCount}/{gameState.dailyTasks.length})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Daily Tasks"
            className="w-9 h-9 rounded-xl pastel-white-sq-btn flex items-center justify-center text-[#164454] cursor-pointer shrink-0"
          >
            <X className="w-4.5 h-4.5 stroke-[3]" />
          </button>
        </div>

        {/* Daily Tasks List */}
        <div className="p-4 space-y-3">
          {gameState.dailyTasks.map((task) => {
            const pct = Math.min(100, Math.round((task.progress / task.target) * 100));
            const canClaim = !task.claimed && task.progress >= task.target;

            return (
              <div
                key={task.id}
                className={`relative rounded-[22px] p-3.5 flex flex-col gap-2.5 transition ${
                  canClaim
                    ? 'bg-[#FFF5CC] border-[2.5px] border-[#18495A] shadow-[0_4px_0_#D89A14]'
                    : task.claimed
                    ? 'bg-[#DCFAEB] border-2 border-[#22A862]'
                    : 'pastel-subcard'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-[#E8F9F8] border-2 border-[#B5DFE3] flex items-center justify-center shrink-0">
                      {task.icon === 'chest' ? (
                        <DailyTaskClipboardIcon className="w-8 h-8" />
                      ) : (
                        <DiamondIcon className="w-7 h-6" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-display font-bold text-sm sm:text-base text-[#144353] leading-tight">
                        {task.title}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <DiamondIcon className="w-4 h-3.5" />
                        <span className="font-mono-num text-xs font-extrabold text-[#3E6F80]">
                          +{task.reward} Diamonds
                        </span>
                      </div>
                    </div>
                  </div>

                  {task.claimed ? (
                    <span className="px-2.5 py-1.5 rounded-full bg-[#24C466] border-2 border-[#144353] font-display font-bold text-xs text-white flex items-center gap-1 shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Done</span>
                    </span>
                  ) : canClaim ? (
                    <button
                      type="button"
                      onClick={() => onClaimTask(task.id)}
                      className="px-3.5 py-1.5 rounded-full pastel-lime-btn font-display font-bold text-xs text-[#12452B] shrink-0 cursor-pointer animate-pulse"
                    >
                      CLAIM +{task.reward}
                    </button>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-[#E1F4F7] border border-[#A8D8DF] font-mono-num text-xs font-extrabold text-[#18495A] shrink-0">
                      {task.progress}/{task.target}
                    </span>
                  )}
                </div>

                {/* Recessed Mint Progress Track */}
                <div className="relative w-full h-4.5 rounded-full pastel-track overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: task.claimed || canClaim ? '#28C96D' : '#35B2F8',
                    }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-extrabold text-[#144353] font-mono-num">
                    {task.progress} / {task.target}
                  </span>
                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-full pastel-silver-btn font-display font-bold text-sm text-[#18495A] cursor-pointer"
          >
            Back to Lobby
          </button>
        </div>
      </div>
    </div>
  );
};
