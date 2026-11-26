import React from 'react';
import type {BackgroundThemeId} from '../game/types';

interface PastelNatureBackdropProps {
  variant?: 'lobby' | 'gameplay';
  themeId?: BackgroundThemeId;
}

/* Full-bleed illustrated pastel landscapes for all 4 collectible Studio Background Themes */
export const PastelNatureBackdrop: React.FC<PastelNatureBackdropProps> = ({
  variant = 'lobby',
  themeId = 'mint_meadow',
}) => {
  const isLobby = variant === 'lobby';
  const uid = `${themeId}-${variant}`;

  if (themeId === 'cherry_blossom') {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden select-none">
        <svg
          viewBox="0 0 430 932"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full block"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={`sky-${uid}`} x1="215" y1="0" x2="215" y2="520" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFAED0" />
              <stop offset="48%" stopColor="#FFD8E8" />
              <stop offset="100%" stopColor="#FFF1F5" />
            </linearGradient>
            <linearGradient id={`lake-${uid}`} x1="215" y1="430" x2="215" y2="560" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#C8B6FF" />
              <stop offset="50%" stopColor="#F5C7E8" />
              <stop offset="100%" stopColor="#B8A3F5" />
            </linearGradient>
            <linearGradient id={`hill-${uid}`} x1="215" y1="485" x2="215" y2="932" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={isLobby ? '#C95A8B' : '#F28CB6'} />
              <stop offset="35%" stopColor={isLobby ? '#A74473' : '#D96B9B'} />
              <stop offset="100%" stopColor={isLobby ? '#7E2E58' : '#A94575'} />
            </linearGradient>
          </defs>

          <rect width="430" height="932" fill={`url(#sky-${uid})`} />

          {/* Soft Blush Clouds */}
          <g opacity="0.82">
            <path
              d="M-8 176H92C92 167 84 160 74 160C71 160 69 160.5 67 161C63 148 50 139 36 139C19 139 6 151 4 166C-2 167 -8 171 -8 176Z"
              fill="#FFF8FB"
            />
            <path
              d="M336 234H440C440 226 434 220 426 220C422 208 410 200 396 200C380 200 368 211 366 225C356 225 344 228 336 234Z"
              fill="#FFF8FB"
            />
          </g>

          {/* Misty Rose Mountains */}
          <path
            d="M-10 412L74 246L156 356L218 282L292 366L372 260L440 344V454H-10V412Z"
            fill="#F3A6C8"
          />
          <path d="M74 246L114 322L86 314L74 246Z" fill="#FFE6F1" opacity="0.72" />
          <path d="M372 260L408 326L382 318L372 260Z" fill="#FFE6F1" opacity="0.65" />

          {/* Mid Rolling Blossom Hills */}
          <path
            d="M-10 434Q76 348 164 392T318 378T440 400V472H-10V434Z"
            fill="#E583AE"
          />

          {/* Sakura Blossom Canopies (Left & Right Banks) */}
          <g>
            {/* Left Sakura Trees */}
            <rect x="26" y="388" width="8" height="58" rx="4" fill="#6F384C" />
            <circle cx="24" cy="364" r="34" fill="#FF8BB8" />
            <circle cx="48" cy="378" r="24" fill="#FFA8CB" />
            <circle cx="8" cy="382" r="22" fill="#FF73A8" />
            <circle cx="34" cy="348" r="18" fill="#FFD1E4" opacity="0.75" />

            <rect x="86" y="400" width="6" height="44" rx="3" fill="#6F384C" />
            <circle cx="88" cy="384" r="24" fill="#FFA4C8" />
            <circle cx="106" cy="394" r="18" fill="#FFBED8" />

            {/* Right Sakura Trees */}
            <rect x="394" y="382" width="8" height="62" rx="4" fill="#6F384C" />
            <circle cx="396" cy="358" r="36" fill="#FF8BB8" />
            <circle cx="370" cy="374" r="25" fill="#FFA8CB" />
            <circle cx="416" cy="378" r="24" fill="#FF73A8" />
            <circle cx="386" cy="342" r="18" fill="#FFD1E4" opacity="0.75" />

            <rect x="336" y="402" width="6" height="42" rx="3" fill="#6F384C" />
            <circle cx="338" cy="388" r="22" fill="#FFA4C8" />
            <circle cx="322" cy="396" r="16" fill="#FFBED8" />
          </g>

          {/* Soft Meadow Slope Behind Lake */}
          <path d="M-10 444Q96 406 190 428T440 422V468H-10V444Z" fill="#F29BC0" />

          {/* Shimmering Rose-Lavender Lake */}
          <rect
            x="0"
            y={isLobby ? 444 : 458}
            width="430"
            height={isLobby ? 84 : 112}
            fill={`url(#lake-${uid})`}
          />
          <g opacity="0.72" fill="#FFF0F8">
            <rect x="30" y={isLobby ? 464 : 478} width="82" height="5" rx="2.5" />
            <rect x="150" y={isLobby ? 474 : 490} width="108" height="4" rx="2" />
            <rect x="304" y={isLobby ? 466 : 482} width="76" height="5" rx="2.5" />
            <rect x="76" y={isLobby ? 488 : 508} width="124" height="4" rx="2" />
            <rect x="258" y={isLobby ? 492 : 514} width="94" height="4" rx="2" />
          </g>

          {/* Curved Foreground Meadow Hill */}
          <path
            d={isLobby ? 'M-20 532Q215 468 450 532V940H-20V532Z' : 'M-20 572Q215 516 450 572V940H-20V572Z'}
            fill={`url(#hill-${uid})`}
          />
          <path
            d={
              isLobby
                ? 'M-20 532Q215 468 450 532Q215 492 -20 546Z'
                : 'M-20 572Q215 516 450 572Q215 538 -20 588Z'
            }
            fill="#FFB9D5"
            opacity="0.52"
          />

          {/* Foreground Blossom Bushes */}
          <g>
            <circle cx="8" cy="544" r="36" fill="#9D3968" />
            <circle cx="48" cy="560" r="24" fill="#BA4A7E" />
            <circle cx="16" cy="894" r="56" fill="#8D305E" />
            <circle cx="64" cy="918" r="44" fill="#B5457A" />
            <circle cx="422" cy="542" r="38" fill="#9D3968" />
            <circle cx="382" cy="560" r="24" fill="#BA4A7E" />
            <circle cx="416" cy="886" r="58" fill="#8D305E" />
            <circle cx="366" cy="918" r="46" fill="#B5457A" />
          </g>

          {/* Gently Floating Sakura Petals */}
          <g className="animate-petal-drift" fill="#FFF2F8" opacity="0.9">
            <ellipse cx="76" cy="214" rx="6" ry="3.2" transform="rotate(-24 76 214)" />
            <ellipse cx="182" cy="176" rx="5.5" ry="3" transform="rotate(18 182 176)" />
            <ellipse cx="312" cy="204" rx="6.5" ry="3.2" transform="rotate(-32 312 204)" />
            <ellipse cx="128" cy="316" rx="5" ry="2.8" transform="rotate(28 128 316)" />
            <ellipse cx="274" cy="294" rx="6" ry="3" transform="rotate(-14 274 294)" />
            <ellipse cx="362" cy="436" rx="5.5" ry="2.8" transform="rotate(35 362 436)" />
            <ellipse cx="64" cy="462" rx="5" ry="2.6" transform="rotate(-22 64 462)" />
          </g>
        </svg>
      </div>
    );
  }

  if (themeId === 'sunset_beach') {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden select-none">
        <svg
          viewBox="0 0 430 932"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full block"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={`sky-${uid}`} x1="215" y1="0" x2="215" y2="490" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FF7A70" />
              <stop offset="44%" stopColor="#FFA86B" />
              <stop offset="82%" stopColor="#FFD68A" />
              <stop offset="100%" stopColor="#FFF0B8" />
            </linearGradient>
            <linearGradient id={`ocean-${uid}`} x1="215" y1="425" x2="215" y2="575" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FF9678" />
              <stop offset="45%" stopColor="#46C5D8" />
              <stop offset="100%" stopColor="#2A95B8" />
            </linearGradient>
            <linearGradient id={`sand-${uid}`} x1="215" y1="500" x2="215" y2="932" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={isLobby ? '#D97C4A' : '#F4B46A'} />
              <stop offset="32%" stopColor={isLobby ? '#B85D3B' : '#DF8C4E'} />
              <stop offset="100%" stopColor={isLobby ? '#873E34' : '#B15A3C'} />
            </linearGradient>
          </defs>

          <rect width="430" height="932" fill={`url(#sky-${uid})`} />

          {/* Glowing Setting Sun */}
          <circle cx="215" cy="366" r="88" fill="#FFF3B8" opacity="0.34" />
          <circle cx="215" cy="366" r="62" fill="#FFE68C" opacity="0.58" />
          <circle cx="215" cy="366" r="42" fill="#FFF9D6" />

          {/* Warm Peach Sunset Clouds */}
          <g opacity="0.78">
            <path
              d="M-6 184H98C98 175 90 168 80 168C75 155 62 146 47 146C30 146 16 158 14 173C4 174 -6 178 -6 184Z"
              fill="#FFF2DC"
            />
            <path
              d="M326 238H440C440 230 434 224 426 224C422 212 409 204 395 204C380 204 367 214 365 228C354 228 334 232 326 238Z"
              fill="#FFE9CF"
            />
          </g>

          {/* Distant Coastal Headlands */}
          <path
            d="M-10 436Q62 368 142 420L178 444H-10V436Z"
            fill="#DC6E72"
            opacity="0.72"
          />
          <path
            d="M276 444Q346 376 440 422V448H276V444Z"
            fill="#DC6E72"
            opacity="0.72"
          />

          {/* Shimmering Sunset Ocean */}
          <rect
            x="0"
            y={isLobby ? 436 : 450}
            width="430"
            height={isLobby ? 98 : 126}
            fill={`url(#ocean-${uid})`}
          />
          {/* Golden Sun Reflection Path on Waves */}
          <g opacity="0.82" fill="#FFF3BD">
            <rect x="174" y={isLobby ? 448 : 462} width="82" height="6" rx="3" />
            <rect x="158" y={isLobby ? 464 : 478} width="114" height="5" rx="2.5" />
            <rect x="184" y={isLobby ? 480 : 496} width="62" height="5" rx="2.5" />
            <rect x="170" y={isLobby ? 496 : 514} width="90" height="4" rx="2" />
          </g>
          <g opacity="0.52" fill="#D4F9FF">
            <rect x="28" y={isLobby ? 470 : 486} width="72" height="4" rx="2" />
            <rect x="322" y={isLobby ? 474 : 490} width="78" height="4" rx="2" />
            <rect x="64" y={isLobby ? 498 : 516} width="84" height="4" rx="2" />
          </g>

          {/* Stylized Palm Silhouettes Left & Right */}
          <g fill="#7C3242">
            {/* Left Palm */}
            <path d="M18 522Q36 446 56 380L64 384Q46 448 30 524Z" />
            <path d="M58 382Q18 362 -6 382Q24 378 58 386Z" />
            <path d="M60 382Q36 340 6 342Q36 356 60 384Z" />
            <path d="M60 382Q82 344 114 356Q84 364 60 386Z" />
            <path d="M58 384Q92 376 116 404Q84 392 56 388Z" />

            {/* Right Palm */}
            <path d="M412 522Q394 446 374 374L366 378Q384 448 400 524Z" />
            <path d="M372 376Q412 356 436 376Q406 372 372 380Z" />
            <path d="M370 376Q394 334 424 336Q394 350 370 378Z" />
            <path d="M370 376Q348 338 316 350Q346 358 370 380Z" />
            <path d="M372 378Q338 370 314 398Q346 386 374 382Z" />
          </g>

          {/* Curved Sunlit Beach Foreground */}
          <path
            d={isLobby ? 'M-20 532Q215 468 450 532V940H-20V532Z' : 'M-20 572Q215 516 450 572V940H-20V572Z'}
            fill={`url(#sand-${uid})`}
          />
          <path
            d={
              isLobby
                ? 'M-20 532Q215 468 450 532Q215 492 -20 546Z'
                : 'M-20 572Q215 516 450 572Q215 538 -20 588Z'
            }
            fill="#FFE29E"
            opacity="0.62"
          />

          {/* Coastal Tropical Foliage Corners */}
          <g>
            <circle cx="10" cy="544" r="36" fill="#8C393B" />
            <circle cx="48" cy="560" r="24" fill="#AE4A42" />
            <circle cx="14" cy="894" r="56" fill="#782E36" />
            <circle cx="64" cy="918" r="44" fill="#9E423E" />
            <circle cx="422" cy="542" r="38" fill="#8C393B" />
            <circle cx="382" cy="560" r="24" fill="#AE4A42" />
            <circle cx="416" cy="884" r="58" fill="#782E36" />
            <circle cx="366" cy="918" r="46" fill="#9E423E" />
          </g>
        </svg>
      </div>
    );
  }

  if (themeId === 'starry_forest') {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden select-none">
        <svg
          viewBox="0 0 430 932"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full block"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={`sky-${uid}`} x1="215" y1="0" x2="215" y2="520" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#121E4A" />
              <stop offset="52%" stopColor="#1E3C6E" />
              <stop offset="100%" stopColor="#2A657E" />
            </linearGradient>
            <linearGradient id={`aurora-${uid}`} x1="40" y1="120" x2="390" y2="260" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#46F5C4" stopOpacity="0" />
              <stop offset="35%" stopColor="#46F5C4" stopOpacity="0.34" />
              <stop offset="68%" stopColor="#9A7CFF" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#46F5C4" stopOpacity="0" />
            </linearGradient>
            <linearGradient id={`lake-${uid}`} x1="215" y1="430" x2="215" y2="570" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#23577E" />
              <stop offset="50%" stopColor="#2E7598" />
              <stop offset="100%" stopColor="#1B4666" />
            </linearGradient>
            <linearGradient id={`hill-${uid}`} x1="215" y1="485" x2="215" y2="932" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={isLobby ? '#164656' : '#1E5B68'} />
              <stop offset="38%" stopColor={isLobby ? '#113545' : '#154454'} />
              <stop offset="100%" stopColor="#0C2434" />
            </linearGradient>
          </defs>

          <rect width="430" height="932" fill={`url(#sky-${uid})`} />

          {/* Soft Aurora Ribbon in Night Sky */}
          <path
            d="M-20 226Q96 144 214 198T450 156V236Q332 276 214 234T-20 264Z"
            fill={`url(#aurora-${uid})`}
          />

          {/* Glowing Crescent Moon */}
          <g>
            <circle cx="354" cy="144" r="34" fill="#FFF3B0" opacity="0.16" />
            <path
              d="M362 122A22 22 0 1 0 374 158A17 17 0 1 1 362 122Z"
              fill="#FFF5C2"
            />
          </g>

          {/* Twinkling Stars */}
          <g className="animate-twinkle" fill="#FFFBE0">
            <circle cx="44" cy="116" r="2.2" />
            <circle cx="96" cy="158" r="1.6" />
            <circle cx="156" cy="112" r="2.6" />
            <circle cx="222" cy="134" r="1.8" />
            <circle cx="276" cy="106" r="2.4" />
            <circle cx="310" cy="176" r="1.5" />
            <circle cx="64" cy="216" r="1.8" />
            <circle cx="192" cy="198" r="2.2" />
            <circle cx="388" cy="212" r="2.0" />
            <circle cx="128" cy="242" r="1.6" />
            <circle cx="294" cy="236" r="1.8" />
          </g>

          {/* Moonlit Mountains */}
          <path
            d="M-10 412L68 248L148 354L206 290L278 368L364 268L440 344V450H-10V412Z"
            fill="#1C4669"
          />
          <path d="M68 248L108 320L82 314L68 248Z" fill="#5CA8C8" opacity="0.34" />
          <path d="M364 268L402 332L376 322L364 268Z" fill="#5CA8C8" opacity="0.38" />

          {/* Rolling Evergreen Hills */}
          <path
            d="M-10 432Q72 346 154 390T306 376T440 398V472H-10V432Z"
            fill="#173D5A"
          />

          {/* Moonlit Pine Forest Silhouettes */}
          <g fill="#12324A">
            <path d="M22 318L44 374H0L22 318Z" />
            <path d="M22 348L48 408H-4L22 348Z" />
            <path d="M66 334L86 386H46L66 334Z" />
            <path d="M66 364L90 418H42L66 364Z" />
            <path d="M112 356L130 406H94L112 356Z" />
            <path d="M406 312L428 370H384L406 312Z" />
            <path d="M406 346L432 408H380L406 346Z" />
            <path d="M362 338L382 390H342L362 338Z" />
            <path d="M362 368L386 420H338L362 368Z" />
            <path d="M318 364L336 414H300L318 364Z" />
          </g>

          {/* Starlight Lake */}
          <rect
            x="0"
            y={isLobby ? 444 : 458}
            width="430"
            height={isLobby ? 84 : 112}
            fill={`url(#lake-${uid})`}
          />
          <g opacity="0.55" fill="#9AF2FF">
            <rect x="28" y={isLobby ? 464 : 478} width="84" height="4" rx="2" />
            <rect x="150" y={isLobby ? 474 : 490} width="106" height="4" rx="2" />
            <rect x="306" y={isLobby ? 466 : 482} width="76" height="5" rx="2.5" fill="#FFF4B8" />
            <rect x="74" y={isLobby ? 488 : 508} width="124" height="3.5" rx="1.8" />
          </g>

          {/* Shore Pines */}
          <g fill="#0E2A3F">
            <path d="M18 432L44 504H-8L18 432Z" />
            <path d="M58 460L78 518H38L58 460Z" />
            <path d="M408 424L436 502H380L408 424Z" />
            <path d="M366 456L388 516H344L366 456Z" />
          </g>

          {/* Curved Night Forest Hill */}
          <path
            d={isLobby ? 'M-20 532Q215 468 450 532V940H-20V532Z' : 'M-20 572Q215 516 450 572V940H-20V572Z'}
            fill={`url(#hill-${uid})`}
          />
          <path
            d={
              isLobby
                ? 'M-20 532Q215 468 450 532Q215 492 -20 546Z'
                : 'M-20 572Q215 516 450 572Q215 538 -20 588Z'
            }
            fill="#4BE6C8"
            opacity="0.22"
          />

          {/* Foreground Night Bushes */}
          <g>
            <circle cx="8" cy="542" r="36" fill="#0D2C3D" />
            <circle cx="48" cy="558" r="24" fill="#133A4E" />
            <circle cx="14" cy="894" r="56" fill="#0B2433" />
            <circle cx="64" cy="918" r="44" fill="#113447" />
            <circle cx="422" cy="540" r="38" fill="#0D2C3D" />
            <circle cx="382" cy="558" r="24" fill="#133A4E" />
            <circle cx="416" cy="884" r="58" fill="#0B2433" />
            <circle cx="366" cy="918" r="46" fill="#113447" />
          </g>

          {/* Warm Glowing Forest Fireflies */}
          <g className="animate-firefly">
            {[
              {x: 68, y: 492, r: 3.4},
              {x: 136, y: 422, r: 2.8},
              {x: 298, y: 446, r: 3.2},
              {x: 368, y: 512, r: 3.6},
              {x: 96, y: 618, r: 3.0},
              {x: 342, y: 636, r: 2.8},
            ].map((ff, idx) => (
              <g key={idx}>
                <circle cx={ff.x} cy={ff.y} r={ff.r * 3} fill="#FFE97D" opacity="0.26" />
                <circle cx={ff.x} cy={ff.y} r={ff.r} fill="#FFF8B8" />
              </g>
            ))}
          </g>
        </svg>
      </div>
    );
  }

  /* Default: Mint Meadow */
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden select-none">
      <svg
        viewBox="0 0 430 932"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full block"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`sky-${uid}`} x1="215" y1="0" x2="215" y2="520" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#65E5D6" />
            <stop offset="46%" stopColor="#9AF4E4" />
            <stop offset="100%" stopColor="#C8FBF1" />
          </linearGradient>

          <linearGradient id={`lake-${uid}`} x1="215" y1="430" x2="215" y2="530" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#70E0FB" />
            <stop offset="52%" stopColor="#94EEFF" />
            <stop offset="100%" stopColor="#58CEF5" />
          </linearGradient>

          <linearGradient id={`hill-lobby-${uid}`} x1="215" y1="485" x2="215" y2="932" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#26917B" />
            <stop offset="28%" stopColor="#1B7566" />
            <stop offset="100%" stopColor="#145F55" />
          </linearGradient>

          <linearGradient id={`hill-gameplay-${uid}`} x1="215" y1="535" x2="215" y2="932" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#5ED691" />
            <stop offset="34%" stopColor="#3AB87E" />
            <stop offset="72%" stopColor="#1F8D6F" />
            <stop offset="100%" stopColor="#16705D" />
          </linearGradient>

          <linearGradient id={`mtn-far-${uid}`} x1="215" y1="210" x2="215" y2="450" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6BDCC8" />
            <stop offset="100%" stopColor="#91EDD9" />
          </linearGradient>

          <linearGradient id={`mtn-mid-${uid}`} x1="215" y1="270" x2="215" y2="470" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4BC8B2" />
            <stop offset="100%" stopColor="#6CE0C8" />
          </linearGradient>
        </defs>

        {/* Pastel Aqua-Mint Sky */}
        <rect width="430" height="932" fill={`url(#sky-${uid})`} />

        {/* Fluffy Pastel White Clouds */}
        <g opacity="0.72">
          <path
            d="M-6 186H86C86 177 79 170 70 170C68 170 66 170.5 64 171C60 158 48 149 34 149C18 149 5 161 3 176C-2 177 -6 181 -6 186Z"
            fill="#E8FFFB"
          />
          <path
            d="M342 246H438C438 238 432 232 424 232C422 232 420 232.4 418 233C414 221 402 213 389 213C374 213 361 224 359 238C350 238 343 241 342 246Z"
            fill="#E8FFFB"
          />
          {!isLobby && (
            <path
              d="M352 176H436C436 168 430 162 422 162C418 150 406 142 393 142C379 142 368 152 365 165C357 166 352 170 352 176Z"
              fill="#E8FFFB"
            />
          )}
        </g>

        {/* Tiny Birds Silhouette */}
        {isLobby && (
          <g stroke="#2B867C" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.72">
            <path d="M376 156C380 151 384 152 387 157C390 152 394 151 398 155" />
            <path d="M396 172C399 169 402 169 404 173C406 169 409 168 412 171" />
          </g>
        )}

        {/* Far Mountain Silhouettes */}
        <path
          d="M-10 410L68 242L146 352L204 286L278 368L364 264L440 344V450H-10V410Z"
          fill={`url(#mtn-far-${uid})`}
        />
        <path d="M68 242L108 320L82 314L68 242Z" fill="#B2F7E9" opacity="0.65" />
        <path d="M364 264L402 332L376 322L364 264Z" fill="#B2F7E9" opacity="0.55" />

        {/* Mid-Far Rolling Hills & Pine Tree Silhouettes */}
        <path
          d="M-10 432Q72 346 154 390T306 376T440 398V472H-10V432Z"
          fill={`url(#mtn-mid-${uid})`}
        />

        {/* Stylized Pine Forest Silhouettes (Left & Right Banks) */}
        <g fill="#2FA68F">
          <path d="M22 318L44 374H0L22 318Z" />
          <path d="M22 348L48 408H-4L22 348Z" />
          <path d="M66 334L86 386H46L66 334Z" />
          <path d="M66 364L90 418H42L66 364Z" />
          <path d="M112 356L130 406H94L112 356Z" />
          <path d="M148 372L164 418H132L148 372Z" />
          <path d="M406 312L428 370H384L406 312Z" />
          <path d="M406 346L432 408H380L406 346Z" />
          <path d="M362 338L382 390H342L362 338Z" />
          <path d="M362 368L386 420H338L362 368Z" />
          <path d="M318 364L336 414H300L318 364Z" />
          <path d="M282 378L298 422H266L282 378Z" />
        </g>

        {/* Bright Meadow Slope Behind Lake */}
        <path d="M-10 442Q90 402 186 426T440 420V468H-10V442Z" fill="#69DA9C" />

        {/* Tranquil Shimmering Turquoise Lake */}
        <rect
          x="0"
          y={isLobby ? 444 : 458}
          width="430"
          height={isLobby ? 84 : 112}
          fill={`url(#lake-${uid})`}
        />
        <g opacity="0.65" fill="#D4FAFF">
          <rect x="28" y={isLobby ? 464 : 478} width="84" height="5" rx="2.5" />
          <rect x="148" y={isLobby ? 474 : 490} width="110" height="4" rx="2" />
          <rect x="304" y={isLobby ? 466 : 482} width="76" height="5" rx="2.5" />
          <rect x="74" y={isLobby ? 488 : 508} width="128" height="4" rx="2" />
          <rect x="256" y={isLobby ? 492 : 514} width="96" height="4" rx="2" />
        </g>

        {/* Mid-Foreground Pine Trees on Lake Shore */}
        <g fill="#228B72">
          <path d="M18 432L44 504H-8L18 432Z" />
          <path d="M58 460L78 518H38L58 460Z" />
          <path d="M408 424L436 502H380L408 424Z" />
          <path d="M366 456L388 516H344L366 456Z" />
        </g>

        {/* Curved Foreground Hill */}
        {isLobby ? (
          <>
            <path d="M-20 532Q215 468 450 532V940H-20V532Z" fill={`url(#hill-lobby-${uid})`} />
            <path d="M-20 532Q215 468 450 532Q215 492 -20 546Z" fill="#35AB8A" opacity="0.65" />
          </>
        ) : (
          <>
            <path d="M-20 572Q215 516 450 572V940H-20V572Z" fill={`url(#hill-gameplay-${uid})`} />
            <path d="M-20 572Q215 516 450 572Q215 538 -20 588Z" fill="#84EAAC" opacity="0.55" />
          </>
        )}

        {/* Lush Foreground Leafy Bushes */}
        <g>
          <circle cx="8" cy="542" r="36" fill="#186D5B" />
          <circle cx="48" cy="558" r="24" fill="#1F816B" />
          <circle cx="14" cy="894" r="56" fill="#177861" />
          <circle cx="64" cy="918" r="44" fill="#239675" />
          <circle cx="4" cy="842" r="34" fill="#1D886C" />
          <circle cx="422" cy="540" r="38" fill="#186D5B" />
          <circle cx="382" cy="558" r="24" fill="#1F816B" />
          <circle cx="416" cy="884" r="58" fill="#177861" />
          <circle cx="366" cy="918" r="46" fill="#239675" />
          <circle cx="426" cy="832" r="34" fill="#2DA87F" />
        </g>
      </svg>
    </div>
  );
};
