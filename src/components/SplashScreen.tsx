import React, {useEffect, useRef, useState} from 'react';
import {audio} from '../game/audio';
import {APP_ICON_URL} from '../game/data';
import {StarburstSpark} from './ComicIcons';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({onComplete}) => {
  const [stage, setStage] = useState<'falling' | 'splash' | 'ready'>('falling');
  const playedAutoSoundRef = useRef(false);

  useEffect(() => {
    const t1 = window.setTimeout(() => {
      setStage('splash');
      if (!playedAutoSoundRef.current) {
        playedAutoSoundRef.current = true;
        audio.playSplash();
      }
    }, 520);

    const t2 = window.setTimeout(() => {
      setStage('ready');
    }, 1150);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleEnter();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const handleEnter = () => {
    audio.unlock();
    audio.playSplash();
    onComplete();
  };

  return (
    <div
      onClick={handleEnter}
      className="relative w-full h-full flex flex-col items-center justify-between py-10 px-6 overflow-hidden cursor-pointer select-none"
      style={{
        backgroundColor: '#FFF8D6',
        ['--dot-color' as string]: 'rgba(245, 180, 50, 0.36)',
      }}
    >
      {/* Halftone comic background */}
      <div className="absolute inset-0 comic-halftone-edge opacity-80 pointer-events-none" />

      {/* Rotating Comic Sunburst Rays */}
      <svg
        viewBox="0 0 400 400"
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[155%] max-w-[680px] aspect-square pointer-events-none transition-all duration-700 ${
          stage === 'falling' ? 'scale-50 opacity-0' : 'scale-100 opacity-100'
        }`}
        aria-hidden="true"
      >
        <g transform="translate(200, 200)">
          {Array.from({length: 14}).map((_, i) => {
            const a1 = (i * 360) / 14;
            const a2 = a1 + 12;
            const rad1 = (a1 * Math.PI) / 180;
            const rad2 = (a2 * Math.PI) / 180;
            return (
              <polygon
                key={i}
                points={`0,0 ${Math.cos(rad1) * 210},${Math.sin(rad1) * 210} ${Math.cos(rad2) * 210},${
                  Math.sin(rad2) * 210
                }`}
                fill={i % 2 === 0 ? 'rgba(255, 133, 122, 0.24)' : 'rgba(255, 224, 71, 0.35)'}
              />
            );
          })}
        </g>
      </svg>

      {/* Top Tag */}
      <div className="relative z-10 text-xs font-extrabold tracking-[0.2em] uppercase text-[#141414]/70">
        Liquid Color Mixing Studio
      </div>

      {/* Center Animated Hero Emblem + Droplet Splash */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto">
        <div className="relative flex items-center justify-center mb-5">
          {/* Comic Starburst Accent behind Icon */}
          <StarburstSpark
            color="#FF7D78"
            className={`absolute -top-6 -left-7 w-11 h-11 transition-all duration-500 ${
              stage === 'falling' ? 'scale-0 opacity-0' : 'scale-100 opacity-100 animate-sparkle'
            }`}
          />
          <StarburstSpark
            color="#4CE4F2"
            className={`absolute -bottom-4 -right-7 w-10 h-10 transition-all duration-500 delay-100 ${
              stage === 'falling' ? 'scale-0 opacity-0' : 'scale-100 opacity-100 animate-sparkle'
            }`}
          />

          {/* Splash Ripple Rings */}
          <div
            className={`absolute w-44 h-44 rounded-full border-4 border-[#141414] transition-all duration-700 pointer-events-none ${
              stage === 'falling' ? 'scale-50 opacity-0' : 'scale-125 opacity-0'
            }`}
          />

          {/* Bouncing Game Icon Frame */}
          <div
            className={`w-36 h-36 sm:w-40 sm:h-40 rounded-[32px] overflow-hidden comic-box-lg bg-[#FFE047] transition-transform duration-500 ease-out ${
              stage === 'falling'
                ? '-translate-y-24 scale-75'
                : stage === 'splash'
                ? 'translate-y-0 scale-110'
                : 'translate-y-0 scale-100 animate-float-slow'
            }`}
          >
            <img
              src={APP_ICON_URL}
              alt="Dye Drop Mascot Icon"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Stacked Comic Title Lockup */}
        <div
          className={`relative text-center transition-all duration-500 ${
            stage === 'falling' ? 'opacity-0 scale-75 translate-y-6' : 'opacity-100 scale-100 translate-y-0'
          }`}
        >
          <div className="font-display font-bold text-6xl sm:text-7xl leading-[0.88] tracking-tight text-[#FF6B63] comic-text-stroke-lg">
            DYE
          </div>
          <div className="font-display font-bold text-6xl sm:text-7xl leading-[0.9] tracking-tight text-[#FFE047] comic-text-stroke-lg -mt-1">
            DROP
          </div>
        </div>

        {/* Animated Liquid Color Dots */}
        <div className="flex items-center gap-3 mt-5">
          <span className="w-5 h-5 rounded-full bg-[#E83848] border-[3px] border-[#141414] shadow-[2px_2px_0_#141414]" />
          <span className="w-5 h-5 rounded-full bg-[#FACC1C] border-[3px] border-[#141414] shadow-[2px_2px_0_#141414]" />
          <span className="w-5 h-5 rounded-full bg-[#246CE0] border-[3px] border-[#141414] shadow-[2px_2px_0_#141414]" />
        </div>
      </div>

      {/* Bottom Start CTA */}
      <div className="relative z-10 w-full max-w-[300px] flex flex-col items-center gap-2.5">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleEnter();
          }}
          className={`w-full py-3.5 px-6 rounded-2xl bg-[#B8FF00] hover:bg-[#C6FF2E] comic-btn font-display font-bold text-2xl text-[#141414] tracking-wide flex items-center justify-center gap-3 cursor-pointer transition-opacity duration-300 ${
            stage === 'ready' ? 'opacity-100' : 'opacity-90'
          }`}
        >
          <span>TAP TO PLAY</span>
          <span className="text-2xl leading-none">➔</span>
        </button>
        <p className="text-xs font-bold text-[#141414]/75 text-center">
          Tap to Drop · Swipe or Tilt to Swirl
        </p>
      </div>
    </div>
  );
};
