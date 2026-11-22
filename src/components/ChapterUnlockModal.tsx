import React from 'react';
import {Home} from 'lucide-react';
import {LEVEL_TYPES} from '../game/data';
import type {LevelTypeId} from '../game/types';
import {StarburstSpark} from './ComicIcons';

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
    <div className="fixed inset-0 z-[60] bg-[#141414]/75 flex items-center justify-center p-4">
      <div className="w-full max-w-[365px] bg-[#FFF8DB] rounded-3xl comic-box-lg overflow-hidden animate-pop-in">
        {/* Header */}
        <div
          className="border-b-[3.5px] border-[#141414] px-4 py-4 text-center relative"
          style={{backgroundColor: unlockedTheme ? unlockedTheme.tabColor : '#FFE047'}}
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <StarburstSpark color="#FFE047" className="w-7 h-7 animate-sparkle" />
            <span className="font-display font-bold text-2xl text-white comic-text-stroke">
              {unlockedTheme ? 'NEW PACK UNLOCKED!' : 'ALL PACKS MASTERED!'}
            </span>
            <StarburstSpark color="#B8FF00" className="w-7 h-7 animate-sparkle" />
          </div>
          <p className="text-xs font-extrabold text-[#141414]">
            All 10 {completedTheme.name} levels completed!
          </p>
        </div>

        {/* Body */}
        <div className="p-5 text-center space-y-4">
          {unlockedTheme ? (
            <>
              <div
                className="rounded-2xl comic-box p-4 flex flex-col items-center justify-center gap-2"
                style={{backgroundColor: unlockedTheme.folderBg}}
              >
                <span
                  className="px-4 py-1 rounded-xl border-[2.5px] border-[#141414] font-display font-bold text-lg text-[#141414] shadow-[2px_2px_0_#141414]"
                  style={{backgroundColor: unlockedTheme.tabColor}}
                >
                  {unlockedTheme.name.toUpperCase()} PACK
                </span>
                <p className="text-xs font-extrabold text-[#141414]/85">
                  10 brand-new levels &amp; a fresh {unlockedTheme.name} studio theme are now open!
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {unlockedTheme.tilePalette.map((c, idx) => (
                    <span
                      key={idx}
                      className="w-7 h-7 rounded-lg border-2 border-[#141414] shadow-[2px_2px_0_#141414]"
                      style={{backgroundColor: c}}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs font-bold text-[#141414]/80 leading-relaxed">
                Head back to the <strong>Lobby</strong> to open your new{' '}
                <strong>{unlockedTheme.name}</strong> folder and switch themes!
              </p>
            </>
          ) : (
            <div className="rounded-2xl comic-box p-4 bg-[#FFE047]">
              <div className="font-display font-bold text-xl text-[#141414]">
                Grand Color Alchemist!
              </div>
              <p className="text-xs font-bold text-[#141414]/85 mt-1">
                You completed every single chapter across Crimson, Marigold, Forest, Ocean, Velvet, and Shadow!
              </p>
            </div>
          )}

          {/* Mandatory Return to Lobby CTA (Instruction 6) */}
          <button
            type="button"
            onClick={onGoToLobby}
            className="w-full py-3.5 px-5 rounded-2xl bg-[#B8FF00] hover:bg-[#C7FF33] comic-btn font-display font-bold text-xl text-[#141414] flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Home className="w-5 h-5 stroke-[2.8]" />
            <span>GO TO LOBBY</span>
            <span>➔</span>
          </button>
        </div>
      </div>
    </div>
  );
};
