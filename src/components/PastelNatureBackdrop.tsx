import React from 'react';

interface PastelNatureBackdropProps {
  variant?: 'lobby' | 'gameplay';
}

/* Full-bleed illustrated pastel mint-forest landscape matching both mockups */
export const PastelNatureBackdrop: React.FC<PastelNatureBackdropProps> = ({
  variant = 'lobby',
}) => {
  const isLobby = variant === 'lobby';

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
          <linearGradient id={`sky-${variant}`} x1="215" y1="0" x2="215" y2="520" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#65E5D6" />
            <stop offset="46%" stopColor="#9AF4E4" />
            <stop offset="100%" stopColor="#C8FBF1" />
          </linearGradient>

          <linearGradient id={`lake-${variant}`} x1="215" y1="430" x2="215" y2="530" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#70E0FB" />
            <stop offset="52%" stopColor="#94EEFF" />
            <stop offset="100%" stopColor="#58CEF5" />
          </linearGradient>

          <linearGradient id={`hill-lobby`} x1="215" y1="485" x2="215" y2="932" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#26917B" />
            <stop offset="28%" stopColor="#1B7566" />
            <stop offset="100%" stopColor="#145F55" />
          </linearGradient>

          <linearGradient id={`hill-gameplay`} x1="215" y1="535" x2="215" y2="932" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#5ED691" />
            <stop offset="34%" stopColor="#3AB87E" />
            <stop offset="72%" stopColor="#1F8D6F" />
            <stop offset="100%" stopColor="#16705D" />
          </linearGradient>

          <linearGradient id={`mtn-far-${variant}`} x1="215" y1="210" x2="215" y2="450" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6BDCC8" />
            <stop offset="100%" stopColor="#91EDD9" />
          </linearGradient>

          <linearGradient id={`mtn-mid-${variant}`} x1="215" y1="270" x2="215" y2="470" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4BC8B2" />
            <stop offset="100%" stopColor="#6CE0C8" />
          </linearGradient>
        </defs>

        {/* Pastel Aqua-Mint Sky */}
        <rect width="430" height="932" fill={`url(#sky-${variant})`} />

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
          fill={`url(#mtn-far-${variant})`}
        />
        {/* Mountain Snow/Light Facet Highlight */}
        <path d="M68 242L108 320L82 314L68 242Z" fill="#B2F7E9" opacity="0.65" />
        <path d="M364 264L402 332L376 322L364 264Z" fill="#B2F7E9" opacity="0.55" />

        {/* Mid-Far Rolling Hills & Pine Tree Silhouettes */}
        <path
          d="M-10 432Q72 346 154 390T306 376T440 398V472H-10V432Z"
          fill={`url(#mtn-mid-${variant})`}
        />

        {/* Stylized Pine Forest Silhouettes (Left & Right Banks) */}
        <g fill="#2FA68F">
          {/* Left Pines */}
          <path d="M22 318L44 374H0L22 318Z" />
          <path d="M22 348L48 408H-4L22 348Z" />
          <path d="M66 334L86 386H46L66 334Z" />
          <path d="M66 364L90 418H42L66 364Z" />
          <path d="M112 356L130 406H94L112 356Z" />
          <path d="M148 372L164 418H132L148 372Z" />
          {/* Right Pines */}
          <path d="M406 312L428 370H384L406 312Z" />
          <path d="M406 346L432 408H380L406 346Z" />
          <path d="M362 338L382 390H342L362 338Z" />
          <path d="M362 368L386 420H338L362 368Z" />
          <path d="M318 364L336 414H300L318 364Z" />
          <path d="M282 378L298 422H266L282 378Z" />
        </g>

        {/* Bright Meadow Slope Behind Lake */}
        <path
          d="M-10 442Q90 402 186 426T440 420V468H-10V442Z"
          fill="#69DA9C"
        />

        {/* Tranquil Shimmering Turquoise Lake */}
        <rect
          x="0"
          y={isLobby ? 444 : 458}
          width="430"
          height={isLobby ? 84 : 112}
          fill={`url(#lake-${variant})`}
        />
        {/* Water Shimmer Highlights */}
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
            <path
              d="M-20 532Q215 468 450 532V940H-20V532Z"
              fill="url(#hill-lobby)"
            />
            {/* Soft meadow rim highlight */}
            <path
              d="M-20 532Q215 468 450 532Q215 492 -20 546Z"
              fill="#35AB8A"
              opacity="0.65"
            />
          </>
        ) : (
          <>
            <path
              d="M-20 572Q215 516 450 572V940H-20V572Z"
              fill="url(#hill-gameplay)"
            />
            {/* Soft sunlit grass crest */}
            <path
              d="M-20 572Q215 516 450 572Q215 538 -20 588Z"
              fill="#84EAAC"
              opacity="0.55"
            />
          </>
        )}

        {/* Lush Foreground Leafy Bushes (Left & Right Corners) */}
        <g>
          {/* Left Bush Cluster */}
          <circle cx="8" cy="542" r="36" fill="#186D5B" />
          <circle cx="48" cy="558" r="24" fill="#1F816B" />
          <circle cx="14" cy="894" r="56" fill="#177861" />
          <circle cx="64" cy="918" r="44" fill="#239675" />
          <circle cx="4" cy="842" r="34" fill="#1D886C" />
          {/* Right Bush Cluster */}
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
