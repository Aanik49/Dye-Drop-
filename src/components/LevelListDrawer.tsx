import React from 'react';
import {LEVELS_BY_TYPE, LEVEL_TYPES} from '../game/data';
import type {LevelTypeId, SavedGameState} from '../game/types';
import {ComicStarIcon} from './ComicIcons';

interface LevelListDrawerProps {
  gameState: SavedGameState;
  typeId: LevelTypeId;
  currentLevelNumber: number;
  onSelectLevel: (levelNumber: number) => void;
  onGoToLobby: () => void;
  onClose: () => void;
}

export const LevelListDrawer: React.FC<LevelListDrawerProps> = ({
  gameState,
  typeId,
  currentLevelNumber,
  onSelectLevel,
  onGoToLobby,
  onClose,
}) => {
  const theme = LEVEL_TYPES[typeId];
  const levels = LEVELS_BY_TYPE[typeId];

  return (
    <div className="fixed inset-0 z-50 bg-[#141414]/70 flex items-center justify-center p-4">
      <div className="w-full max-w-[380px] bg-[#FFF8DB] rounded-3xl comic-box-lg overflow-hidden animate-pop-in">
        <div
          className="border-b-[3.5px] border-[#141414] px-4 py-3 flex items-center justify-between"
          style={{backgroundColor: theme.tabColor}}
        >
          <div>
            <h2 className="font-display font-bold text-xl text-[#141414] leading-tight">
              {theme.name.toUpperCase()} LEVELS
            </h2>
            <p className="text-[11px] font-extrabold text-[#141414]/80">
              Pick any unlocked level to play
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Level List"
            className="w-9 h-9 rounded-xl bg-[#FFFDF5] comic-btn flex items-center justify-center font-black text-base text-[#141414] cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-4" style={{backgroundColor: theme.folderBg}}>
          <div className="grid grid-cols-5 gap-2">
            {levels.map((lvl, idx) => {
              const prog = gameState.levelProgress[lvl.id];
              const stars = prog?.bestStars || 0;
              const isCurrent = lvl.number === currentLevelNumber;
              const tileColor = theme.tilePalette[idx % theme.tilePalette.length];

              return (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => onSelectLevel(lvl.number)}
                  className={`rounded-xl py-2 px-1 flex flex-col items-center justify-center comic-btn cursor-pointer ${
                    isCurrent ? 'ring-3 ring-[#141414] scale-105' : ''
                  }`}
                  style={{backgroundColor: tileColor}}
                >
                  <span className="font-display font-bold text-xl text-white comic-text-stroke leading-none">
                    {lvl.number}
                  </span>
                  <div className="flex items-center gap-0.5 mt-1">
                    {[0, 1, 2].map((s) => (
                      <ComicStarIcon key={s} filled={s < stars} className="w-3 h-3" />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onGoToLobby}
            className="mt-4 w-full py-2.5 px-4 rounded-xl bg-[#FFFDF5] comic-btn font-display font-bold text-sm text-[#141414] cursor-pointer"
          >
            See All Level Packs in Lobby ➔
          </button>
        </div>
      </div>
    </div>
  );
};
