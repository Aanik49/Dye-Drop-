import React from 'react';
import {Home} from 'lucide-react';
import {LEVEL_TYPES} from '../game/data';
import type {LevelTypeId} from '../game/types';
import {LevelTypeIcon, StarburstSpark} from './ComicIcons';

interface ChapterUnlockModalProps {
  completedType: LevelTypeId;
  unlockedType: LevelTypeId | null;
  onGoToLobby: () => void;
}

export const ChapterUnlockModal: React.FC<ChapterUnlockModalProps> = ({
  completedType,
  unlockedType,
  onGoToLobby,
}) => {
  const completedTheme = LEVEL_TYPES[completedType];
  const unlockedTheme = unlockedType ? LEVEL_TYPES[unlockedType] : null;

  return (
    <div className="fixed inset-0 z-[60] bg-[#0B3338]/65 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-[368px] pastel-modal rounded-[30px] overflow-hidden animate-pop-in">
        {/* Pastel Cartoon Celebration Header */}
        <div className="bg-gradient-to-b from-[#9CF0C4] to-[#4ED78D] border-b-[2.5px] border-[#18495A] px-4 py-4 text-center relative">
          <div className="flex items-center justify-center gap-2 mb-1">
            <StarburstSpark color="#FFE45C" className="w-6 h-6 animate-sparkle shrink-0" />
            <span className="font-display font-bold text-2xl text-[#144353] leading-tight">
              {unlockedTheme ? 'New Mode Unlocked!' : 'All Modes Mastered!'}
            </span>
            <StarburstSpark color="#FFE45C" className="w-6 h-6 animate-sparkle shrink-0" />
          </div>
          <p className="text-xs font-bold text-[#18574A]">
            All 10 {completedTheme.name} levels completed!
          </p>
        </div>

        {/* Body */}
        <div className="p-5 text-center space-y-4">
          {unlockedTheme && unlockedType ? (
            <>
              <div className="rounded-[22px] pastel-subcard p-4 flex flex-col items-center justify-center gap-2.5">
                <div className="w-14 h-14 rounded-2xl bg-[#E8FAF8] border-2 border-[#18495A] flex items-center justify-center">
                  <LevelTypeIcon typeId={unlockedType} className="w-10 h-10" />
                </div>
                <span
                  className="px-4 py-1.5 rounded-full border-2 border-[#18495A] font-display font-bold text-base text-white cartoon-text-shadow"
                  style={{backgroundColor: unlockedTheme.tabColor}}
                >
                  {unlockedTheme.name} Mode
                </span>
                <p className="text-xs font-bold text-[#3E6F80]">
                  10 new handcrafted pigment levels in {unlockedTheme.name} are now unlocked!
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  {unlockedTheme.tilePalette.slice(0, 5).map((c, idx) => (
                    <span
                      key={idx}
                      className="w-7 h-7 rounded-xl pastel-level-tile"
                      style={{backgroundColor: c}}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs font-bold text-[#457282] leading-relaxed">
                Head back to the <strong className="text-[#144353]">Lobby</strong> to open your new{' '}
                <strong className="text-[#144353]">{unlockedTheme.name}</strong> levels!
              </p>
            </>
          ) : (
            <div className="rounded-[22px] bg-[#FFF5CC] border-[2.5px] border-[#18495A] p-4 shadow-[0_4px_0_#D89A14]">
              <div className="font-display font-bold text-xl text-[#144353]">
                Grand Color Alchemist!
              </div>
              <p className="text-xs font-bold text-[#3E6F80] mt-1 leading-relaxed">
                You completed every single chapter across Classic, Blend, Triple, Layers, Rush, and Color Grid!
              </p>
            </div>
          )}

          {/* Mandatory Return to Lobby CTA */}
          <button
            type="button"
            onClick={onGoToLobby}
            className="w-full py-3.5 px-5 rounded-full pastel-play-btn font-display font-bold text-lg text-white cartoon-text-shadow flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Home className="w-5 h-5 stroke-[2.5]" />
            <span>GO TO LOBBY</span>
            <span>➔</span>
          </button>
        </div>
      </div>
    </div>
  );
};
