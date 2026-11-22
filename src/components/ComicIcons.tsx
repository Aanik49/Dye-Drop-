import React from 'react';
import type {PaletteDef, VesselId} from '../game/types';

export const DiamondIcon: React.FC<{className?: string}> = ({className = 'w-6 h-6'}) => (
  <svg viewBox="0 0 64 56" className={className} fill="none" aria-hidden="true">
    <path
      d="M15 4H49L61 20L32 52L3 20L15 4Z"
      fill="#7AE6F5"
      stroke="#141414"
      strokeWidth="4.2"
      strokeLinejoin="round"
    />
    <path d="M15 4L22 20L32 52L42 20L49 4" stroke="#141414" strokeWidth="3.2" strokeLinejoin="round" />
    <path d="M3 20H61" stroke="#141414" strokeWidth="3.4" />
    <path d="M22 20L32 4L42 20" fill="#B8F5FF" stroke="#141414" strokeWidth="3" strokeLinejoin="round" />
  </svg>
);

export const StreakCalendarIcon: React.FC<{day: number; hasReward?: boolean; className?: string}> = ({
  day,
  hasReward = false,
  className = 'w-12 h-12',
}) => (
  <div className={`relative inline-flex items-center justify-center ${className}`}>
    <svg viewBox="0 0 64 68" className="w-full h-full drop-shadow-[3px_3px_0_#141414]" fill="none">
      <g transform="rotate(8 32 34)">
        <rect
          x="8"
          y="12"
          width="48"
          height="48"
          rx="9"
          fill="#FFFDF5"
          stroke="#141414"
          strokeWidth="4"
        />
        <path
          d="M8 21C8 16.0294 12.0294 12 17 12H47C51.9706 12 56 16.0294 56 21V25H8V21Z"
          fill="#FF6B63"
          stroke="#141414"
          strokeWidth="4"
        />
        <rect x="17" y="6" width="6" height="12" rx="3" fill="#FFFDF5" stroke="#141414" strokeWidth="3.2" />
        <rect x="41" y="6" width="6" height="12" rx="3" fill="#FFFDF5" stroke="#141414" strokeWidth="3.2" />
        {/* Folded corner */}
        <path d="M44 60L56 48H44V60Z" fill="#E6DEC8" stroke="#141414" strokeWidth="3" strokeLinejoin="round" />
        <text
          x="32"
          y="37"
          textAnchor="middle"
          fill="#141414"
          fontSize="11.5"
          fontWeight="800"
          fontFamily="Plus Jakarta Sans, sans-serif"
        >
          Day
        </text>
        <text
          x="32"
          y="53"
          textAnchor="middle"
          fill="#141414"
          fontSize="18"
          fontWeight="800"
          fontFamily="Fredoka, sans-serif"
        >
          {day}
        </text>
      </g>
    </svg>
    {hasReward && (
      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#B8FF00] border-2 border-[#141414] flex items-center justify-center text-[10px] font-black text-[#141414]">
        !
      </span>
    )}
  </div>
);

export const SoundComicIcon: React.FC<{muted?: boolean; className?: string}> = ({
  muted = false,
  className = 'w-6 h-6',
}) => (
  <svg viewBox="0 0 36 36" className={className} fill="none" aria-hidden="true">
    <path
      d="M5 13H12L20 6V30L12 23H5V13Z"
      fill="#141414"
      stroke="#141414"
      strokeWidth="2.4"
      strokeLinejoin="round"
    />
    {muted ? (
      <>
        <path d="M24 13L32 23" stroke="#E11D48" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M32 13L24 23" stroke="#E11D48" strokeWidth="3.5" strokeLinecap="round" />
      </>
    ) : (
      <>
        <path d="M24 13C26 15 26 21 24 23" stroke="#141414" strokeWidth="3" strokeLinecap="round" />
        <path d="M28 9.5C32 13.5 32 22.5 28 26.5" stroke="#141414" strokeWidth="3" strokeLinecap="round" />
      </>
    )}
  </svg>
);

export const MusicComicIcon: React.FC<{muted?: boolean; className?: string}> = ({
  muted = false,
  className = 'w-6 h-6',
}) => (
  <svg viewBox="0 0 36 36" className={className} fill="none" aria-hidden="true">
    <path
      d="M14 25V9L29 6V22"
      stroke="#141414"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M14 14L29 11" stroke="#141414" strokeWidth="3" />
    <ellipse cx="10.5" cy="25.5" rx="4.5" ry="3.5" fill="#141414" />
    <ellipse cx="25.5" cy="22.5" rx="4.5" ry="3.5" fill="#141414" />
    {muted && (
      <path d="M6 6L30 30" stroke="#E11D48" strokeWidth="3.8" strokeLinecap="round" />
    )}
  </svg>
);

export const PadlockIcon: React.FC<{className?: string}> = ({className = 'w-8 h-8'}) => (
  <svg viewBox="0 0 44 48" className={className} fill="none" aria-hidden="true">
    <path
      d="M13 21V14C13 9.02944 17.0294 5 22 5C26.9706 5 31 9.02944 31 14V21"
      stroke="#141414"
      strokeWidth="4.2"
      strokeLinecap="round"
    />
    <rect
      x="7"
      y="20"
      width="30"
      height="23"
      rx="6"
      fill="#FFC933"
      stroke="#141414"
      strokeWidth="3.6"
    />
    <circle cx="22" cy="29.5" r="3.2" fill="#141414" />
    <path d="M22 31.5V37" stroke="#141414" strokeWidth="3.2" strokeLinecap="round" />
  </svg>
);

export const ComicStarIcon: React.FC<{filled?: boolean; className?: string}> = ({
  filled = true,
  className = 'w-4 h-4',
}) => (
  <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
    <path
      d="M16 3L19.9 10.9L28.6 12.2L22.3 18.3L23.8 27L16 22.9L8.2 27L9.7 18.3L3.4 12.2L12.1 10.9L16 3Z"
      fill={filled ? '#FFE047' : '#EFE8D2'}
      stroke="#141414"
      strokeWidth="2.6"
      strokeLinejoin="round"
    />
  </svg>
);

export const ChestIcon: React.FC<{className?: string}> = ({className = 'w-8 h-8'}) => (
  <svg viewBox="0 0 48 44" className={className} fill="none" aria-hidden="true">
    <rect x="6" y="14" width="36" height="24" rx="5" fill="#D97736" stroke="#141414" strokeWidth="3.2" />
    <path
      d="M6 16C6 10.5 11 7 24 7C37 7 42 10.5 42 16V20H6V16Z"
      fill="#F59E42"
      stroke="#141414"
      strokeWidth="3.2"
    />
    <rect x="6" y="18" width="36" height="5" fill="#FFE047" stroke="#141414" strokeWidth="2.6" />
    <rect x="20" y="17" width="8" height="9" rx="2" fill="#FFE047" stroke="#141414" strokeWidth="2.6" />
    <circle cx="24" cy="21.5" r="1.6" fill="#141414" />
  </svg>
);

export const StarburstSpark: React.FC<{color?: string; className?: string}> = ({
  color = '#FFE047',
  className = 'w-6 h-6',
}) => (
  <svg viewBox="0 0 36 36" className={className} fill="none" aria-hidden="true">
    <path
      d="M18 2L21.5 12.5L32 8L25 17.5L34 23L23 23.5L24 34L17 25.5L8 32L12 21.5L2 18L12.5 14L10 4L18 11.5L18 2Z"
      fill={color}
      stroke="#141414"
      strokeWidth="2.4"
      strokeLinejoin="round"
    />
  </svg>
);

export const VesselSvgIcon: React.FC<{
  vesselId: VesselId;
  liquidColor?: string;
  className?: string;
}> = ({vesselId, liquidColor = '#FF6B63', className = 'w-14 h-14'}) => {
  switch (vesselId) {
    case 'flask':
      return (
        <svg viewBox="0 0 64 68" className={className} fill="none" aria-hidden="true">
          <rect x="25" y="5" width="14" height="9" rx="2" fill="#D99456" stroke="#141414" strokeWidth="3" />
          <path
            d="M24 14H40V23C49 27 54 36 54 45C54 55.5 45 62 32 62C19 62 10 55.5 10 45C10 36 15 27 24 23V14Z"
            fill="#FFFDF5"
            stroke="#141414"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <path
            d="M14.5 44C14.5 52 21.5 57.5 32 57.5C42.5 57.5 49.5 52 49.5 44C49.5 41 48 39 46 39C40 41 24 37 18 39C16 40 14.5 41.5 14.5 44Z"
            fill={liquidColor}
            stroke="#141414"
            strokeWidth="2.5"
          />
          <path d="M21 44C21 48 24 52 28 53" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'highball':
      return (
        <svg viewBox="0 0 64 68" className={className} fill="none" aria-hidden="true">
          <path
            d="M19 8H45L42 59C42 61 40 62 38 62H26C24 62 22 61 22 59L19 8Z"
            fill="#FFFDF5"
            stroke="#141414"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <path
            d="M21.5 26H42.5L40.5 57H23.5L21.5 26Z"
            fill={liquidColor}
            stroke="#141414"
            strokeWidth="2.4"
          />
          <ellipse cx="32" cy="8" rx="13" ry="3.5" fill="#FFFDF5" stroke="#141414" strokeWidth="3" />
          <path d="M25 20V50" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'lotus':
      return (
        <svg viewBox="0 0 68 64" className={className} fill="none" aria-hidden="true">
          <path
            d="M8 22H60C59 42 48 53 34 53C20 53 9 42 8 22Z"
            fill="#FFD4DC"
            stroke="#141414"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <ellipse cx="34" cy="22" rx="26" ry="6.5" fill={liquidColor} stroke="#141414" strokeWidth="3.2" />
          <path
            d="M22 52L24 57H44L46 52"
            fill="#FFFDF5"
            stroke="#141414"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          <path
            d="M34 32C30 39 28 46 34 51C40 46 38 39 34 32Z"
            fill="#FF9EB5"
            stroke="#141414"
            strokeWidth="2.4"
          />
          <path
            d="M22 33C20 40 23 47 30 50C29 43 26 37 22 33Z"
            fill="#FF9EB5"
            stroke="#141414"
            strokeWidth="2.2"
          />
          <path
            d="M46 33C48 40 45 47 38 50C39 43 42 37 46 33Z"
            fill="#FF9EB5"
            stroke="#141414"
            strokeWidth="2.2"
          />
        </svg>
      );
    case 'chalice':
      return (
        <svg viewBox="0 0 64 68" className={className} fill="none" aria-hidden="true">
          <path
            d="M14 10H50C49 28 42 40 32 40C22 40 15 28 14 10Z"
            fill="#FFFDF5"
            stroke="#141414"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <path
            d="M17 20H47C45 31 39 38 32 38C25 38 19 31 17 20Z"
            fill={liquidColor}
            stroke="#141414"
            strokeWidth="2.4"
          />
          <rect x="29" y="40" width="6" height="16" fill="#FFFDF5" stroke="#141414" strokeWidth="3" />
          <ellipse cx="32" cy="58" rx="14" ry="4.5" fill="#FFE047" stroke="#141414" strokeWidth="3" />
          <ellipse cx="32" cy="10" rx="18" ry="4" fill="#FFFDF5" stroke="#141414" strokeWidth="3" />
        </svg>
      );
    case 'amphora':
      return (
        <svg viewBox="0 0 68 68" className={className} fill="none" aria-hidden="true">
          <path
            d="M24 16C12 16 10 30 16 40"
            stroke="#141414"
            strokeWidth="6.5"
            strokeLinecap="round"
          />
          <path
            d="M24 16C12 16 10 30 16 40"
            stroke="#FFE047"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M44 16C56 16 58 30 52 40"
            stroke="#141414"
            strokeWidth="6.5"
            strokeLinecap="round"
          />
          <path
            d="M44 16C56 16 58 30 52 40"
            stroke="#FFE047"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M23 9H45L42 22C50 28 52 42 44 54L41 61H27L24 54C16 42 18 28 26 22L23 9Z"
            fill="#FFFDF5"
            stroke="#141414"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <path
            d="M22 34H46C48 42 46 50 41 56H27C22 50 20 42 22 34Z"
            fill={liquidColor}
            stroke="#141414"
            strokeWidth="2.4"
          />
          <ellipse cx="34" cy="9" rx="11" ry="3.2" fill="#FFE047" stroke="#141414" strokeWidth="3" />
        </svg>
      );
    case 'tumbler':
    default:
      return (
        <svg viewBox="0 0 64 68" className={className} fill="none" aria-hidden="true">
          <path
            d="M14 12H50L45 58C44.5 60.5 42.5 62 40 62H24C21.5 62 19.5 60.5 19 58L14 12Z"
            fill="#FFFDF5"
            stroke="#141414"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <path
            d="M17.5 29H46.5L43.5 57H20.5L17.5 29Z"
            fill={liquidColor}
            stroke="#141414"
            strokeWidth="2.4"
          />
          <ellipse cx="32" cy="12" rx="18" ry="4" fill="#FFFDF5" stroke="#141414" strokeWidth="3" />
          <path d="M22 24L24.5 51" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" />
        </svg>
      );
  }
};

export const PaletteTrayIcon: React.FC<{palette: PaletteDef; className?: string}> = ({
  palette,
  className = 'w-24 h-16',
}) => {
  const swatches = [palette.R, palette.Y, palette.B, palette.RY, palette.YB, palette.RB];
  return (
    <svg viewBox="0 0 112 78" className={className} fill="none" aria-hidden="true">
      <rect
        x="5"
        y="5"
        width="102"
        height="68"
        rx="12"
        fill="#FFFDF5"
        stroke="#141414"
        strokeWidth="4.5"
      />
      {swatches.map((rgb, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        return (
          <rect
            key={i}
            x={13 + col * 30}
            y={13 + row * 28}
            width="24"
            height="22"
            rx="5"
            fill={`rgb(${rgb[0]},${rgb[1]},${rgb[2]})`}
            stroke="#141414"
            strokeWidth="2.8"
          />
        );
      })}
    </svg>
  );
};
