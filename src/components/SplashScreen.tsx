import React, {useEffect, useRef, useState} from 'react';
import {Play} from 'lucide-react';
import {audio} from '../game/audio';
import {DyeDropHeroLogo, LobbyHeroFlask} from './ComicIcons';
import {PastelNatureBackdrop} from './PastelNatureBackdrop';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({onComplete}) => {
  const [stage, setStage] = useState<'falling' | 'ready'>('falling');
  const playedAutoSoundRef = useRef(false);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setStage('ready');
      if (!playedAutoSoundRef.current) {
        playedAutoSoundRef.current = true;
        audio.playSplash();
      }
    }, 450);

    return () => window.clearTimeout(t);
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
      className="relative w-full h-full flex flex-col items-center justify-between py-12 px-6 overflow-hidden cursor-pointer select-none"
    >
      <PastelNatureBackdrop variant="lobby" />

      {/* Hero Stacked Cartoon Logo */}
      <div
        className={`relative z-10 flex flex-col items-center mt-4 transition-all duration-500 ${
          stage === 'falling' ? 'opacity-0 -translate-y-4 scale-95' : 'opacity-100 translate-y-0 scale-100'
        }`}
      >
        <DyeDropHeroLogo className="w-[266px] h-[134px] drop-shadow-[0_8px_14px_rgba(12,68,78,0.22)]" />
        <p className="font-display font-bold text-sm tracking-wide text-[#134D59] mt-1">
          Mix · Match · Complete
        </p>
      </div>

      {/* Center Layered Erlenmeyer Flask */}
      <div
        className={`relative z-10 transition-all duration-500 ${
          stage === 'falling' ? 'scale-90 opacity-0' : 'scale-100 opacity-100 animate-float-slow'
        }`}
      >
        <LobbyHeroFlask className="w-[172px] h-[186px]" />
      </div>

      {/* Bottom Glossy Emerald Play CTA */}
      <div className="relative z-10 w-full max-w-[264px] flex flex-col items-center gap-3 mb-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleEnter();
          }}
          className="relative w-full h-[62px] rounded-full pastel-play-btn flex items-center justify-center gap-3 cursor-pointer overflow-hidden"
        >
          <span className="pointer-events-none absolute top-1.5 left-6 w-12 h-2 rounded-full bg-white/50" />
          <Play className="w-7 h-7 text-white fill-white" />
          <span className="font-display font-bold text-[28px] text-white tracking-wide cartoon-text-shadow leading-none">
            Tap to Play
          </span>
        </button>
        <p className="text-xs font-bold text-[#C8FBF1] text-center">
          Drop Pigments · Mix &amp; Match the Target
        </p>
      </div>
    </div>
  );
};
