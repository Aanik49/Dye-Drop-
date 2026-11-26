import React from 'react';
import type {LevelTypeId, PaletteDef, VesselId} from '../game/types';

/* ============================================================================
   HERO STACKED "Dye Drop" CARTOON LOGO WITH GLASS DROPPER & RAINBOW DROPLET
   (100% matched to Lobby Mockup)
   ============================================================================ */
export const DyeDropHeroLogo: React.FC<{className?: string}> = ({
  className = 'w-[248px] h-[126px]',
}) => (
  <svg viewBox="0 0 320 162" className={className} fill="none" aria-label="Dye Drop">
    <defs>
      <linearGradient id="logoBlue" x1="56" y1="68" x2="56" y2="146" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#65D6FF" />
        <stop offset="55%" stopColor="#20A2F8" />
        <stop offset="100%" stopColor="#1479DC" />
      </linearGradient>
      <linearGradient id="logoAmber" x1="128" y1="84" x2="128" y2="146" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFE15A" />
        <stop offset="55%" stopColor="#FFAE22" />
        <stop offset="100%" stopColor="#F08610" />
      </linearGradient>
      <linearGradient id="logoPink" x1="234" y1="84" x2="234" y2="152" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FF88B8" />
        <stop offset="55%" stopColor="#FF4F8E" />
        <stop offset="100%" stopColor="#E62B6E" />
      </linearGradient>
      <linearGradient id="rainbowDrop" x1="154" y1="74" x2="210" y2="146" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFE95C" />
        <stop offset="28%" stopColor="#FF9138" />
        <stop offset="56%" stopColor="#FF4C94" />
        <stop offset="78%" stopColor="#5D6BFF" />
        <stop offset="100%" stopColor="#26D7F5" />
      </linearGradient>
      <linearGradient id="dropperLiquid" x1="234" y1="30" x2="206" y2="74" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFE14D" />
        <stop offset="58%" stopColor="#FF9F28" />
        <stop offset="100%" stopColor="#2EA5FF" />
      </linearGradient>
    </defs>

    {/* Decorative Blue Splash Droplets (Left of "Dye") */}
    <path d="M56 36C45 31 38 22 41 18C45 14 57 22 62 32C64 35 60 38 56 36Z" fill="#2CA3F6" />
    <path d="M50 51C41 51 35 47 36 43C38 39 48 41 54 46C56 48 54 51 50 51Z" fill="#46B8FA" />

    {/* Decorative Blue Splash Right of Dropper */}
    <path d="M244 68C252 63 261 63 261 68C261 72 251 74 244 72C242 71 242 69 244 68Z" fill="#2CA3F6" />

    {/* Thick Dark Teal Cartoon Backing Silhouette for "Dye" */}
    <text
      x="148"
      y="70"
      textAnchor="middle"
      fontFamily="Fredoka, sans-serif"
      fontWeight="700"
      fontSize="66"
      stroke="#144552"
      strokeWidth="15"
      strokeLinejoin="round"
      fill="#144552"
      letterSpacing="-1"
    >
      Dye
    </text>
    {/* Cream-White Fill for "Dye" */}
    <text
      x="148"
      y="70"
      textAnchor="middle"
      fontFamily="Fredoka, sans-serif"
      fontWeight="700"
      fontSize="66"
      fill="#FFFDF2"
      letterSpacing="-1"
    >
      Dye
    </text>

    {/* Thick Dark Teal Outline for "D", "r", "p" */}
    <text
      x="72"
      y="138"
      textAnchor="middle"
      fontFamily="Fredoka, sans-serif"
      fontWeight="700"
      fontSize="74"
      stroke="#144552"
      strokeWidth="15"
      strokeLinejoin="round"
      fill="#144552"
    >
      D
    </text>
    <text
      x="72"
      y="138"
      textAnchor="middle"
      fontFamily="Fredoka, sans-serif"
      fontWeight="700"
      fontSize="74"
      fill="url(#logoBlue)"
    >
      D
    </text>

    <text
      x="126"
      y="138"
      textAnchor="middle"
      fontFamily="Fredoka, sans-serif"
      fontWeight="700"
      fontSize="72"
      stroke="#144552"
      strokeWidth="15"
      strokeLinejoin="round"
      fill="#144552"
    >
      r
    </text>
    <text
      x="126"
      y="138"
      textAnchor="middle"
      fontFamily="Fredoka, sans-serif"
      fontWeight="700"
      fontSize="72"
      fill="url(#logoAmber)"
    >
      r
    </text>

    <text
      x="234"
      y="138"
      textAnchor="middle"
      fontFamily="Fredoka, sans-serif"
      fontWeight="700"
      fontSize="72"
      stroke="#144552"
      strokeWidth="15"
      strokeLinejoin="round"
      fill="#144552"
    >
      p
    </text>
    <text
      x="234"
      y="138"
      textAnchor="middle"
      fontFamily="Fredoka, sans-serif"
      fontWeight="700"
      fontSize="72"
      fill="url(#logoPink)"
    >
      p
    </text>

    {/* Rainbow Prism Glass Droplet "o" */}
    <g>
      <path
        d="M178 72C178 72 150 104 150 122C150 137.5 162.5 149 178 149C193.5 149 206 137.5 206 122C206 104 178 72 178 72Z"
        fill="url(#rainbowDrop)"
        stroke="#144552"
        strokeWidth="7.5"
        strokeLinejoin="round"
      />
      {/* Internal Swirl Ribbon */}
      <path
        d="M159 124C166 116 184 114 196 125C192 137 183 142 174 142C164 142 158 134 159 124Z"
        fill="#39C2FF"
        opacity="0.72"
      />
      <ellipse
        cx="166"
        cy="112"
        rx="5"
        ry="11"
        transform="rotate(20 166 112)"
        fill="#FFFFFF"
        opacity="0.82"
      />
      <circle cx="173" cy="96" r="2.8" fill="#FFFFFF" opacity="0.85" />
    </g>

    {/* Tilted Cartoon Glass Pipette Dropper on Top-Right */}
    <g transform="translate(206 6)">
      {/* Squeezing Drop from Pipette Tip */}
      <path
        d="M11 45C11 45 0 60 0 67C0 73.5 5 78 11 78C17 78 22 73.5 22 67C22 60 11 45 11 45Z"
        fill="url(#dropperLiquid)"
        stroke="#144552"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="66" r="2.2" fill="#FFFFFF" opacity="0.85" />

      {/* Dropper Glass Tube */}
      <g transform="rotate(42 36 28)">
        <rect
          x="28"
          y="10"
          width="16"
          height="40"
          rx="5"
          fill="#E4F9FF"
          stroke="#144552"
          strokeWidth="3.2"
        />
        <rect x="30.5" y="25" width="11" height="22" rx="3" fill="#FFD13B" />
        {/* Collar */}
        <rect
          x="24"
          y="7"
          width="24"
          height="8"
          rx="4"
          fill="#266478"
          stroke="#144552"
          strokeWidth="2.8"
        />
        {/* Rubber Bulb */}
        <path
          d="M27 7C27 -5 30 -12 36 -12C42 -12 45 -5 45 7H27Z"
          fill="#2F7A90"
          stroke="#144552"
          strokeWidth="3"
        />
        <path d="M31 -6C31 -2 31 2 31 4" stroke="#85D8E8" strokeWidth="2.4" strokeLinecap="round" />
      </g>
    </g>
  </svg>
);

/* ============================================================================
   HERO CENTER LAYERED ERLENMEYER FLASK (Lobby Centerpiece on Meadow Bank)
   ============================================================================ */
export const LobbyHeroFlask: React.FC<{className?: string}> = ({
  className = 'w-[144px] h-[156px]',
}) => (
  <svg viewBox="0 0 180 196" className={className} fill="none" aria-hidden="true">
    <defs>
      <clipPath id="heroFlaskClip">
        <path d="M68 46H112V72L152 152C157 162 150 174 139 174H41C30 174 23 162 28 152L68 72V46Z" />
      </clipPath>
      <linearGradient id="heroFlaskGlass" x1="36" y1="44" x2="148" y2="174" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.82" />
        <stop offset="55%" stopColor="#D7F4FF" stopOpacity="0.48" />
        <stop offset="100%" stopColor="#B8E7FA" stopOpacity="0.68" />
      </linearGradient>
    </defs>

    {/* Ground Shadow */}
    <ellipse cx="90" cy="178" rx="68" ry="12" fill="#125C4F" opacity="0.38" />

    {/* Floating Bubbles Above Flask Rim */}
    <circle cx="80" cy="24" r="5" fill="#9AF0FF" stroke="#FFFFFF" strokeWidth="1.6" opacity="0.88" />
    <circle cx="101" cy="18" r="7" fill="#89EAFF" stroke="#FFFFFF" strokeWidth="1.8" opacity="0.86" />
    <circle cx="94" cy="34" r="3.5" fill="#FFFFFF" opacity="0.85" />

    {/* Flask Back Glass */}
    <path
      d="M68 46H112V72L152 152C157 162 150 174 139 174H41C30 174 23 162 28 152L68 72V46Z"
      fill="url(#heroFlaskGlass)"
    />

    {/* Layered Vibrant Waves inside Flask: Blue -> Yellow -> Magenta-Pink */}
    <g clipPath="url(#heroFlaskClip)">
      {/* Top Blue Wave */}
      <path
        d="M16 102Q54 90 90 100T164 98V180H16V102Z"
        fill="#39B2FF"
      />
      <path
        d="M16 102Q54 90 90 100T164 98Q126 106 90 106T16 102Z"
        fill="#92E1FF"
        opacity="0.72"
      />
      {/* Middle Golden-Yellow Wave */}
      <path
        d="M16 122Q58 109 94 121T164 118V180H16V122Z"
        fill="#FFC929"
      />
      <path
        d="M16 135Q60 124 98 135T164 132V180H16V135Z"
        fill="#FF9F28"
        opacity="0.58"
      />
      {/* Bottom Magenta-Pink Wave */}
      <path
        d="M16 146Q58 134 94 147T164 144V180H16V146Z"
        fill="#E942A4"
      />
      <path
        d="M16 161Q60 154 98 162T164 159V180H16V161Z"
        fill="#C92B88"
        opacity="0.6"
      />

      {/* Inside Bubbles */}
      <circle cx="96" cy="84" r="5" fill="#FFFFFF" opacity="0.55" />
      <circle cx="106" cy="100" r="7.5" fill="none" stroke="#FFFFFF" strokeWidth="2" opacity="0.82" />
      <circle cx="72" cy="132" r="4" fill="#FFFFFF" opacity="0.48" />
    </g>

    {/* Outer Thick Glossy White/Ice Rim Outline */}
    <path
      d="M68 46H112V72L152 152C157 162 150 174 139 174H41C30 174 23 162 28 152L68 72V46Z"
      stroke="#E6FAFF"
      strokeWidth="6"
      strokeLinejoin="round"
    />
    <path
      d="M68 46H112V72L152 152C157 162 150 174 139 174H41C30 174 23 162 28 152L68 72V46Z"
      stroke="#8AD4EA"
      strokeWidth="2"
      strokeLinejoin="round"
    />

    {/* Flask Lip Ring */}
    <rect x="58" y="38" width="64" height="12" rx="6" fill="#E9FBFF" stroke="#8AD4EA" strokeWidth="2" />

    {/* Specular Gloss Streak Left Side */}
    <path
      d="M74 56V74L42 146"
      stroke="#FFFFFF"
      strokeWidth="6"
      strokeLinecap="round"
      opacity="0.78"
    />
  </svg>
);

/* ============================================================================
   LOBBY FLOATING ACTION ICONS (Daily Login Calendar & Daily Task Clipboard)
   ============================================================================ */
export const DailyLoginCardIcon: React.FC<{className?: string}> = ({className = 'w-16 h-18'}) => (
  <svg viewBox="0 0 74 80" className={className} fill="none" aria-hidden="true">
    {/* Dark teal depth shadow base */}
    <rect x="7" y="14" width="60" height="62" rx="15" fill="#175A61" />
    {/* Crisp off-white calendar body */}
    <rect x="7" y="10" width="60" height="60" rx="14" fill="#FCFFF9" stroke="#18495A" strokeWidth="2.5" />
    {/* Glossy Crimson Header */}
    <path d="M8.5 22C8.5 15.5 13 11 19 11H55C61 11 65.5 15.5 65.5 22V25H8.5V22Z" fill="#E83B55" />
    {/* Rings */}
    <rect x="19" y="5" width="6" height="12" rx="3" fill="#FFFDF5" stroke="#18495A" strokeWidth="2" />
    <rect x="49" y="5" width="6" height="12" rx="3" fill="#FFFDF5" stroke="#18495A" strokeWidth="2" />
    {/* Green Check Circle */}
    <circle cx="37" cy="37" r="9.5" fill="#2AD175" />
    <path d="M32.5 37L35.7 40.2L42 33.8" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    {/* Centered Label inside card */}
    <text x="37" y="54.5" textAnchor="middle" fill="#164454" fontSize="10" fontWeight="800" fontFamily="Fredoka, sans-serif">
      Daily
    </text>
    <text x="37" y="63.5" textAnchor="middle" fill="#164454" fontSize="9.5" fontWeight="800" fontFamily="Fredoka, sans-serif">
      Login
    </text>
  </svg>
);

export const DailyTaskClipboardIcon: React.FC<{className?: string}> = ({className = 'w-12 h-13'}) => (
  <svg viewBox="0 0 58 64" className={className} fill="none" aria-hidden="true">
    {/* Green Board & Crisp Green Border */}
    <rect x="6" y="10" width="46" height="50" rx="9" fill="#22B862" stroke="#116638" strokeWidth="3" />
    {/* Crisp White Checklist Paper */}
    <rect x="11.5" y="15.5" width="35" height="39" rx="4.5" fill="#FFFFFF" stroke="#148046" strokeWidth="1.5" />
    {/* Green Top Clip */}
    <rect x="19" y="4.5" width="20" height="10" rx="4" fill="#32D178" stroke="#116638" strokeWidth="2.5" />
    <circle cx="29" cy="9.5" r="2" fill="#E6FFF0" />
    {/* Checklist Rows */}
    <path d="M16.5 24L19 26.5L23.5 22" stroke="#1FB862" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="27" y="23" width="14" height="3.2" rx="1.6" fill="#9BC3CE" />
    <path d="M16.5 34L19 36.5L23.5 32" stroke="#1FB862" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="27" y="33" width="14" height="3.2" rx="1.6" fill="#9BC3CE" />
    {/* Big Green Checkmark */}
    <path d="M16.5 44L19 46.5L23.5 42" stroke="#1FB862" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M27 45L32.5 50.5L43 39" stroke="#1DC468" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ============================================================================
   LOBBY BOTTOM WIDE CARD ICONS (Studio Striped Awning Shop & Open Recipe Book)
   ============================================================================ */
export const StudioShopIcon: React.FC<{className?: string}> = ({className = 'w-14 h-12'}) => (
  <svg viewBox="0 0 76 64" className={className} fill="none" aria-hidden="true">
    {/* Shop Wall */}
    <rect x="12" y="26" width="52" height="33" rx="6" fill="#FCE5B8" stroke="#18495A" strokeWidth="2.6" />
    {/* Blue Door */}
    <rect x="19" y="37" width="16" height="22" rx="3.5" fill="#2A9BF5" stroke="#18495A" strokeWidth="2.2" />
    <circle cx="31.5" cy="48.5" r="1.8" fill="#FFE666" />
    {/* Window */}
    <rect x="41" y="37" width="16" height="14" rx="3.5" fill="#9CE9FF" stroke="#18495A" strokeWidth="2.2" />
    {/* Striped Red & Cream Awning */}
    <path d="M7 22L14 7H62L69 22H7Z" fill="#FFFDF6" stroke="#18495A" strokeWidth="2.6" strokeLinejoin="round" />
    <path d="M14 7H24L20 22H7L14 7Z" fill="#EA434E" />
    <path d="M33 7H43L43 22H33L33 7Z" fill="#EA434E" />
    <path d="M52 7H62L69 22H56L52 7Z" fill="#EA434E" />
    {/* Scalloped Awning Rim */}
    <path d="M7 22C7 26.5 13 28 19.5 22C19.5 26.5 26 28 32 22C32 26.5 38 28 44 22C44 26.5 50 28 56.5 22C56.5 26.5 63 28 69 22" fill="#EA434E" stroke="#18495A" strokeWidth="2.2" />
  </svg>
);

export const RecipeBookOpenIcon: React.FC<{className?: string}> = ({className = 'w-14 h-11'}) => (
  <svg viewBox="0 0 80 56" className={className} fill="none" aria-hidden="true">
    {/* Dark Navy Hardcover Backing */}
    <rect x="5" y="10" width="70" height="41" rx="7" fill="#2B527A" stroke="#153E52" strokeWidth="2.6" />
    {/* Left Open Page */}
    <path d="M10 12C10 8 15 6 24 6C32 6 38 9 40 13V45C38 42 32 40 24 40C15 40 10 42 10 45V12Z" fill="#F8FCFF" stroke="#153E52" strokeWidth="2.2" />
    {/* Right Open Page */}
    <path d="M70 12C70 8 65 6 56 6C48 6 42 9 40 13V45C42 42 48 40 56 40C65 40 70 42 70 45V12Z" fill="#FFFFFF" stroke="#153E52" strokeWidth="2.2" />
    {/* Left Page Blue Sky Swatch Illustration */}
    <path d="M16 24C16 18 20 14 25 14C30 14 34 18 34 24H16Z" fill="#52C4FA" />
    <rect x="16" y="28" width="18" height="3" rx="1.5" fill="#B5D7E6" />
    <rect x="16" y="34" width="14" height="3" rx="1.5" fill="#B5D7E6" />
    {/* Right Page Golden Sun Swatch Dot */}
    <circle cx="55" cy="22" r="8" fill="#FFC928" />
    <circle cx="52.5" cy="19.5" r="2.2" fill="#FFF7B8" />
    <rect x="46" y="34" width="18" height="3" rx="1.5" fill="#B5D7E6" />
  </svg>
);

/* ============================================================================
   6 LEVEL TYPE CARD ICONS (Exact Match to Lobby Mockup)
   Classic / Blend / Triple / Layers / Rush / Color Grid
   ============================================================================ */
export const LevelTypeIcon: React.FC<{typeId: LevelTypeId; className?: string}> = ({
  typeId,
  className = 'w-8 h-8',
}) => {
  switch (typeId) {
    case 'crimson': // Classic — Blue Droplet
      return (
        <svg viewBox="0 0 40 44" className={className} fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="ltDrop" x1="12" y1="6" x2="28" y2="38" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#65D6FF" />
              <stop offset="55%" stopColor="#209CF8" />
              <stop offset="100%" stopColor="#1268D4" />
            </linearGradient>
          </defs>
          <path
            d="M20 4C20 4 6 20 6 28.5C6 36 12.3 41 20 41C27.7 41 34 36 34 28.5C34 20 20 4 20 4Z"
            fill="url(#ltDrop)"
            stroke="#135A9E"
            strokeWidth="2.2"
          />
          <ellipse cx="14.5" cy="25" rx="3" ry="6.5" transform="rotate(18 14.5 25)" fill="#FFFFFF" opacity="0.72" />
        </svg>
      );

    case 'marigold': // Blend — Artist Palette
      return (
        <svg viewBox="0 0 44 40" className={className} fill="none" aria-hidden="true">
          <path
            d="M22 4C11 4 4 11.5 4 20.5C4 29 10.5 35 18 35C21 35 23 33.5 23 31C23 29 24.5 27.5 26.5 27.5H31C36.5 27.5 40 23.5 40 18.5C40 10.5 32 4 22 4Z"
            fill="#F4D3A1"
            stroke="#C29258"
            strokeWidth="2"
          />
          <circle cx="13" cy="18" r="3.4" fill="#FF5484" />
          <circle cx="19" cy="11.5" r="3.4" fill="#FFC928" />
          <circle cx="28" cy="12" r="3.4" fill="#32C876" />
          <circle cx="33" cy="19.5" r="3.4" fill="#2A9BF8" />
          <circle cx="16" cy="27.5" r="3.2" fill="#FFFFFF" stroke="#C29258" strokeWidth="1.5" />
        </svg>
      );

    case 'forest': // Triple — RGB Venn Circles
      return (
        <svg viewBox="0 0 44 42" className={className} fill="none" aria-hidden="true">
          <circle cx="22" cy="14" r="10.5" fill="#FF4B6E" opacity="0.92" />
          <circle cx="15" cy="27" r="10.5" fill="#2A9BF8" opacity="0.88" />
          <circle cx="29" cy="27" r="10.5" fill="#32D16F" opacity="0.88" />
          <circle cx="22" cy="22.5" r="4.5" fill="#FFFFFF" opacity="0.52" />
        </svg>
      );

    case 'ocean': // Layers — Stacked Isometric Squares
      return (
        <svg viewBox="0 0 44 44" className={className} fill="none" aria-hidden="true">
          <path d="M22 25L38 32L22 39L6 32L22 25Z" fill="#25A6FA" stroke="#1670BA" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M22 16L38 23L22 30L6 23L22 16Z" fill="#FF5390" stroke="#C42562" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M22 7L38 14L22 21L6 14L22 7Z" fill="#FFD133" stroke="#D9960E" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      );

    case 'velvet': // Rush — Golden Lightning Bolt
      return (
        <svg viewBox="0 0 38 44" className={className} fill="none" aria-hidden="true">
          <path
            d="M22 4L7 24H18L15 40L32 19H21L22 4Z"
            fill="#FFD12C"
            stroke="#DF8A0C"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path d="M20 9L12 21H18" stroke="#FFF9B8" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );

    case 'shadow': // Color Grid — 3x3 Vibrant Gradient Grid
    default:
      return (
        <svg viewBox="0 0 42 42" className={className} fill="none" aria-hidden="true">
          <rect x="4" y="4" width="10" height="10" rx="2.5" fill="#7D52F4" />
          <rect x="16" y="4" width="10" height="10" rx="2.5" fill="#9E5AF5" />
          <rect x="28" y="4" width="10" height="10" rx="2.5" fill="#D154E8" />
          <rect x="4" y="16" width="10" height="10" rx="2.5" fill="#5278F6" />
          <rect x="16" y="16" width="10" height="10" rx="2.5" fill="#7663F5" />
          <rect x="28" y="16" width="10" height="10" rx="2.5" fill="#B55DF0" />
          <rect x="4" y="28" width="10" height="10" rx="2.5" fill="#2CAEF8" />
          <rect x="16" y="28" width="10" height="10" rx="2.5" fill="#3AC7F2" />
          <rect x="28" y="28" width="10" height="10" rx="2.5" fill="#5D8BF7" />
        </svg>
      );
  }
};

/* ============================================================================
   GAMEPLAY GLOSSY TEARDROP BUTTON ICON (Blue / Yellow / Pink / Modifiers)
   ============================================================================ */
export const TeardropColorIcon: React.FC<{
  color: string;
  strokeColor?: string;
  className?: string;
}> = ({color, strokeColor = '#18495A', className = 'w-11 h-12'}) => (
  <svg viewBox="0 0 48 54" className={className} fill="none" aria-hidden="true">
    {/* Teardrop Body */}
    <path
      d="M24 4C24 4 6 23.5 6 34.5C6 44.5 14 51 24 51C34 51 42 44.5 42 34.5C42 23.5 24 4 24 4Z"
      fill={color}
      stroke={strokeColor}
      strokeWidth="3"
      strokeLinejoin="round"
    />
    {/* Soft Inner Shadow Crescent at Bottom */}
    <path
      d="M12 37C14 44 20 47.5 26 47C31.5 46.5 36.5 43 38 36.5C35.5 41 30 43.5 24 43.5C18 43.5 14.5 41 12 37Z"
      fill="#000000"
      opacity="0.16"
    />
    {/* Glossy Top-Left Specular Highlight */}
    <ellipse
      cx="16.5"
      cy="30"
      rx="4.2"
      ry="8.5"
      transform="rotate(20 16.5 30)"
      fill="#FFFFFF"
      opacity="0.72"
    />
    <circle cx="20.5" cy="18.5" r="2.4" fill="#FFFFFF" opacity="0.82" />
  </svg>
);

/* Glowing Lightbulb Icon for Gameplay Tip Speech Bubble */
export const LightbulbTipIcon: React.FC<{className?: string}> = ({className = 'w-6 h-7'}) => (
  <svg viewBox="0 0 36 42" className={className} fill="none" aria-hidden="true">
    <path
      d="M18 4C11 4 6 9.2 6 15.8C6 20 8.5 23.4 11.8 25.5C12.7 26.1 13.2 27.1 13.2 28.2V30H22.8V28.2C22.8 27.1 23.3 26.1 24.2 25.5C27.5 23.4 30 20 30 15.8C30 9.2 25 4 18 4Z"
      fill="#FFD538"
      stroke="#18495A"
      strokeWidth="2.4"
      strokeLinejoin="round"
    />
    <rect x="13" y="30" width="10" height="4.5" rx="2" fill="#9BB5C2" stroke="#18495A" strokeWidth="2" />
    <path d="M15 36.5H21" stroke="#18495A" strokeWidth="2.4" strokeLinecap="round" />
    <ellipse cx="14" cy="13" rx="2.5" ry="4.5" transform="rotate(22 14 13)" fill="#FFFCE0" opacity="0.9" />
  </svg>
);

/* ============================================================================
   CORE SHARED CARTOON ICONS (Diamond, Star, Audio, Padlock, Vessels, Palettes)
   ============================================================================ */
export const WatercolorDropEmblem: React.FC<{className?: string}> = ({className = 'w-11 h-12'}) => (
  <TeardropColorIcon color="#29A8FA" strokeColor="#164454" className={className} />
);

export const WatercolorPaintboxIcon: React.FC<{className?: string}> = ({className = 'w-12 h-12'}) => (
  <DailyTaskClipboardIcon className={className} />
);

export const SwatchBookIcon: React.FC<{className?: string}> = ({className = 'w-12 h-12'}) => (
  <RecipeBookOpenIcon className={className} />
);

/* Faceted Sky-Blue Cartoon Diamond Gem (Matches Lobby Top-Left Counter) */
export const DiamondIcon: React.FC<{className?: string}> = ({className = 'w-6 h-6'}) => (
  <svg viewBox="0 0 64 56" className={className} fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="pastelDiaTop" x1="12" y1="6" x2="52" y2="22" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#B8F5FF" />
        <stop offset="50%" stopColor="#5CD5FF" />
        <stop offset="100%" stopColor="#26A5F5" />
      </linearGradient>
      <linearGradient id="pastelDiaBot" x1="10" y1="20" x2="54" y2="52" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#3BC5FA" />
        <stop offset="55%" stopColor="#1C8FE8" />
        <stop offset="100%" stopColor="#125FB8" />
      </linearGradient>
    </defs>
    <path
      d="M15 5H49L60 20L32 52L4 20L15 5Z"
      fill="url(#pastelDiaBot)"
      stroke="#114668"
      strokeWidth="3.2"
      strokeLinejoin="round"
    />
    <path d="M15 5H49L60 20H4L15 5Z" fill="url(#pastelDiaTop)" />
    <path d="M22 20L32 5L42 20H22Z" fill="#E6FDFF" opacity="0.9" />
    <path d="M22 20H42L32 52L22 20Z" fill="#32B9F5" opacity="0.72" />
    <path d="M4 20H22L32 52L4 20Z" fill="#1782D6" opacity="0.55" />
    <path d="M15 5H49L60 20L32 52L4 20L15 5Z" stroke="#114668" strokeWidth="3" strokeLinejoin="round" />
  </svg>
);

export const StreakCalendarIcon: React.FC<{day: number; hasReward?: boolean; className?: string}> = ({
  day,
  hasReward = false,
  className = 'w-12 h-12',
}) => (
  <div className={`relative inline-flex items-center justify-center ${className}`}>
    <svg viewBox="0 0 64 66" className="w-full h-full" fill="none">
      <rect x="7" y="13" width="50" height="47" rx="13" fill="#FFFFFF" stroke="#18495A" strokeWidth="2.8" />
      <path d="M8.5 22C8.5 16.5 12.5 13 18 13H46C51.5 13 55.5 16.5 55.5 22V27H8.5V22Z" fill="#EA3E57" />
      <rect x="17" y="6.5" width="6" height="12" rx="3" fill="#FFFFFF" stroke="#18495A" strokeWidth="2" />
      <rect x="41" y="6.5" width="6" height="12" rx="3" fill="#FFFFFF" stroke="#18495A" strokeWidth="2" />
      <text x="32" y="23" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="700" fontFamily="Fredoka, sans-serif">
        Day
      </text>
      <text x="32" y="49" textAnchor="middle" fill="#164454" fontSize="22" fontWeight="700" fontFamily="Fredoka, sans-serif">
        {day}
      </text>
    </svg>
    {hasReward && (
      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#EA3E57] border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-black text-white">
        !
      </span>
    )}
  </div>
);

/* Sound Icon — supports crisp White (Lobby dark teal circle) or Dark Navy + Red X (Gameplay yellow square) */
export const SoundComicIcon: React.FC<{
  muted?: boolean;
  tone?: 'light' | 'dark';
  className?: string;
}> = ({muted = false, tone = 'light', className = 'w-6 h-6'}) => {
  const fillCol = tone === 'dark' ? '#1A3E4C' : '#FFFFFF';
  const muteCol = tone === 'dark' ? '#EB3646' : '#FF8295';
  return (
    <svg viewBox="0 0 36 36" className={className} fill="none" aria-hidden="true">
      <path
        d="M6.5 13.5C6.5 12.4 7.4 11.5 8.5 11.5H12.5L19.5 6.8C20.5 6.1 21.8 6.8 21.8 8V28C21.8 29.2 20.5 29.9 19.5 29.2L12.5 24.5H8.5C7.4 24.5 6.5 23.6 6.5 22.5V13.5Z"
        fill={fillCol}
      />
      {muted ? (
        <>
          <path d="M25 13.5L31.5 22.5" stroke={muteCol} strokeWidth="3.6" strokeLinecap="round" />
          <path d="M31.5 13.5L25 22.5" stroke={muteCol} strokeWidth="3.6" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M25.5 13.5C27.5 15.6 27.5 20.4 25.5 22.5" stroke={fillCol} strokeWidth="2.8" strokeLinecap="round" />
          <path d="M29 10.2C32.2 14 32.2 22 29 25.8" stroke={fillCol} strokeWidth="2.8" strokeLinecap="round" opacity="0.85" />
        </>
      )}
    </svg>
  );
};

/* Music Icon — supports crisp White (Lobby dark teal circle) or Dark Navy + Red Slash (Gameplay yellow square) */
export const MusicComicIcon: React.FC<{
  muted?: boolean;
  tone?: 'light' | 'dark';
  className?: string;
}> = ({muted = false, tone = 'light', className = 'w-6 h-6'}) => {
  const fillCol = tone === 'dark' ? '#1A3E4C' : '#FFFFFF';
  const muteCol = tone === 'dark' ? '#EB3646' : '#FF8295';
  return (
    <svg viewBox="0 0 36 36" className={className} fill="none" aria-hidden="true">
      <path
        d="M14.5 25V10.5L28 7.5V22"
        stroke={fillCol}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14.5 15.2L28 12.2" stroke={fillCol} strokeWidth="3" />
      <ellipse cx="11.2" cy="25.5" rx="4.4" ry="3.4" fill={fillCol} />
      <ellipse cx="24.8" cy="22.5" rx="4.4" ry="3.4" fill={fillCol} />
      {muted && <path d="M7 7L29 29" stroke={muteCol} strokeWidth="3.6" strokeLinecap="round" />}
    </svg>
  );
};

/* Cartoon Padlock */
export const PadlockIcon: React.FC<{className?: string}> = ({className = 'w-7 h-7'}) => (
  <svg viewBox="0 0 44 48" className={className} fill="none" aria-hidden="true">
    <path
      d="M14 21V14.5C14 9.8 17.6 6 22 6C26.4 6 30 9.8 30 14.5V21"
      stroke="#1A4B5C"
      strokeWidth="4.2"
      strokeLinecap="round"
    />
    <rect x="8" y="20" width="28" height="22" rx="7" fill="#DCECF0" stroke="#1A4B5C" strokeWidth="2.8" />
    <circle cx="22" cy="29.5" r="2.8" fill="#1A4B5C" />
    <path d="M22 31.5V36.5" stroke="#1A4B5C" strokeWidth="2.6" strokeLinecap="round" />
  </svg>
);

/* Glossy Cartoon Golden Star (Matches Gameplay HUD Star!) */
export const ComicStarIcon: React.FC<{filled?: boolean; className?: string}> = ({
  filled = true,
  className = 'w-4 h-4',
}) => (
  <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="cartoonStarGold" x1="6" y1="3" x2="26" y2="29" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFF282" />
        <stop offset="48%" stopColor="#FFC926" />
        <stop offset="100%" stopColor="#EB930F" />
      </linearGradient>
    </defs>
    <path
      d="M16 3.5C16.7 3.5 17.3 3.9 17.6 4.5L20.5 10.4L27 11.3C28.4 11.5 29 13.3 27.9 14.3L23.2 18.8L24.3 25.3C24.6 26.7 23.1 27.8 21.8 27.1L16 24L10.2 27.1C8.9 27.8 7.4 26.7 7.7 25.3L8.8 18.8L4.1 14.3C3 13.3 3.6 11.5 5 11.3L11.5 10.4L14.4 4.5C14.7 3.9 15.3 3.5 16 3.5Z"
      fill={filled ? 'url(#cartoonStarGold)' : '#D7EAEF'}
      stroke={filled ? '#B86A08' : '#8EB4C0'}
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    {filled && <circle cx="13.2" cy="11.8" r="1.8" fill="#FFFFFF" opacity="0.85" />}
  </svg>
);

export const ChestIcon: React.FC<{className?: string}> = ({className = 'w-8 h-8'}) => (
  <DailyTaskClipboardIcon className={className} />
);

/* Cartoon Sparkle */
export const StarburstSpark: React.FC<{color?: string; className?: string}> = ({
  color = '#FFD44D',
  className = 'w-6 h-6',
}) => (
  <svg viewBox="0 0 36 36" className={className} fill="none" aria-hidden="true">
    <path
      d="M18 3C19.4 12.2 23.8 16.6 33 18C23.8 19.4 19.4 23.8 18 33C16.6 23.8 12.2 19.4 3 18C12.2 16.6 16.6 12.2 18 3Z"
      fill={color}
      stroke="#18495A"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

/* Clean Cartoon Vector-Ink Glass Vessels for Studio & Recipe Book */
export const VesselSvgIcon: React.FC<{
  vesselId: VesselId;
  liquidColor?: string;
  className?: string;
}> = ({vesselId, liquidColor = '#3AD986', className = 'w-14 h-14'}) => {
  const ink = '#18495A';
  switch (vesselId) {
    case 'flask':
      return (
        <svg viewBox="0 0 64 68" className={className} fill="none" aria-hidden="true">
          <ellipse cx="32" cy="63" rx="18" ry="3.5" fill={ink} opacity="0.16" />
          <path
            d="M25 11H39V22C48.5 26 54 35.5 54 45C54 55.8 44.8 62 32 62C19.2 62 10 55.8 10 45C10 35.5 15.5 26 25 22V11Z"
            fill="#DFF7FF"
            stroke={ink}
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <path
            d="M14 44.5C14 52.8 21.4 58.5 32 58.5C42.6 58.5 50 52.8 50 44.5C50 41 48 38.5 45.5 38.5C39 41 25 36.5 18.5 38.5C16 39.5 14 41.5 14 44.5Z"
            fill={liquidColor}
          />
          <ellipse cx="32" cy="11" rx="8.5" ry="2.6" fill="#FFFFFF" stroke={ink} strokeWidth="2.2" />
          <path d="M19 42C19 48 22.5 53 27.5 54.5" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" opacity="0.88" />
        </svg>
      );
    case 'highball':
      return (
        <svg viewBox="0 0 64 68" className={className} fill="none" aria-hidden="true">
          <ellipse cx="32" cy="63" rx="14" ry="3" fill={ink} opacity="0.16" />
          <path
            d="M19 8H45L42 59C42 61 40 62 38 62H26C24 62 22 61 22 59L19 8Z"
            fill="#DFF7FF"
            stroke={ink}
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <path d="M21.5 27H42.5L40.5 57.5H23.5L21.5 27Z" fill={liquidColor} />
          <ellipse cx="32" cy="8" rx="13" ry="3.2" fill="#FFFFFF" stroke={ink} strokeWidth="2.2" />
          <path d="M25 18V51" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" opacity="0.88" />
        </svg>
      );
    case 'lotus':
      return (
        <svg viewBox="0 0 68 64" className={className} fill="none" aria-hidden="true">
          <ellipse cx="34" cy="59" rx="18" ry="3.5" fill={ink} opacity="0.16" />
          <path
            d="M8 22H60C59 42 48 53 34 53C20 53 9 42 8 22Z"
            fill="#FFE6F0"
            stroke={ink}
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <ellipse cx="34" cy="22" rx="26" ry="6.2" fill={liquidColor} stroke={ink} strokeWidth="2.2" />
          <path d="M22 52L24 57H44L46 52" fill="#FFFFFF" stroke={ink} strokeWidth="2.2" />
        </svg>
      );
    case 'chalice':
      return (
        <svg viewBox="0 0 64 68" className={className} fill="none" aria-hidden="true">
          <ellipse cx="32" cy="61" rx="16" ry="3.5" fill={ink} opacity="0.16" />
          <path d="M14 10H50C49 28 42 40 32 40C22 40 15 28 14 10Z" fill="#DFF7FF" stroke={ink} strokeWidth="2.4" />
          <path d="M17 21H47C45 31 39 38 32 38C25 38 19 31 17 21Z" fill={liquidColor} />
          <rect x="29" y="40" width="6" height="16" rx="2" fill="#E8FAFF" stroke={ink} strokeWidth="2" />
          <ellipse cx="32" cy="58" rx="14" ry="4.5" fill="#FFD35C" stroke={ink} strokeWidth="2" />
          <ellipse cx="32" cy="10" rx="18" ry="3.8" fill="#FFFFFF" stroke={ink} strokeWidth="2.2" />
        </svg>
      );
    case 'amphora':
      return (
        <svg viewBox="0 0 68 68" className={className} fill="none" aria-hidden="true">
          <path d="M24 16C12 16 10 30 16 40" stroke="#F4C24D" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M44 16C56 16 58 30 52 40" stroke="#F4C24D" strokeWidth="4.5" strokeLinecap="round" />
          <path
            d="M23 9H45L42 22C50 28 52 42 44 54L41 61H27L24 54C16 42 18 28 26 22L23 9Z"
            fill="#DFF7FF"
            stroke={ink}
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <path d="M22 34H46C48 42 46 50 41 56H27C22 50 20 42 22 34Z" fill={liquidColor} />
          <ellipse cx="34" cy="9" rx="11" ry="3.2" fill="#FFD35C" stroke={ink} strokeWidth="2" />
        </svg>
      );
    case 'tumbler':
    default:
      /* Matches Gameplay Mockup Rounded Crystal Mixing Bowl! */
      return (
        <svg viewBox="0 0 68 64" className={className} fill="none" aria-hidden="true">
          <ellipse cx="34" cy="59" rx="18" ry="3.5" fill={ink} opacity="0.16" />
          <path
            d="M11 16C10 36 16 55 34 55C52 55 58 36 57 16H11Z"
            fill="#DFF7FF"
            stroke={ink}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="M14.5 31C16 44 22 52 34 52C46 52 52 44 53.5 31C46 28 40 34 34 31C28 28 21 33 14.5 31Z"
            fill={liquidColor}
          />
          <ellipse cx="34" cy="16" rx="23" ry="4.5" fill="#E9FBFF" stroke={ink} strokeWidth="2.2" />
          <path d="M20 22C19.5 33 21.5 43 25 48" stroke="#FFFFFF" strokeWidth="3.4" strokeLinecap="round" opacity="0.86" />
        </svg>
      );
  }
};

/* Cartoon Pigment Palette Tray */
export const PaletteTrayIcon: React.FC<{palette: PaletteDef; className?: string}> = ({
  palette,
  className = 'w-24 h-16',
}) => {
  const swatches = [palette.B, palette.Y, palette.R, palette.YB, palette.RY, palette.RB];
  return (
    <svg viewBox="0 0 112 78" className={className} fill="none" aria-hidden="true">
      <rect
        x="4"
        y="4"
        width="104"
        height="70"
        rx="16"
        fill="#FFFFFF"
        stroke="#18495A"
        strokeWidth="2.8"
      />
      {swatches.map((rgb, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        return (
          <g key={i}>
            <rect
              x={13 + col * 30}
              y={13 + row * 28}
              width="24"
              height="22"
              rx="6"
              fill={`rgb(${rgb[0]},${rgb[1]},${rgb[2]})`}
              stroke="#18495A"
              strokeWidth="1.6"
            />
            <rect
              x={16 + col * 30}
              y={16 + row * 28}
              width="12"
              height="3.5"
              rx="1.75"
              fill="#FFFFFF"
              opacity="0.5"
            />
          </g>
        );
      })}
    </svg>
  );
};
