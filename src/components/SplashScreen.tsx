import React, {useEffect, useRef, useState} from 'react';
import {audio} from '../game/audio';
import {DyeDropHeroLogo, LobbyHeroFlask} from './ComicIcons';
import {PastelNatureBackdrop} from './PastelNatureBackdrop';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({onComplete}) => {
  const [stage, setStage] = useState<'enter' | 'ready' | 'exit'>('enter');
  const [progress, setProgress] = useState<number>(8);
  const completedRef = useRef(false);

  const finishSplash = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete();
  };

  useEffect(() => {
    const enterTimer = window.setTimeout(() => {
      setStage('ready');
      setProgress(100);
      audio.playSplash();
    }, 120);

    const fadeTimer = window.setTimeout(() => {
      setStage('exit');
    }, 1320);

    const doneTimer = window.setTimeout(() => {
      finishSplash();
    }, 1620);

    return () => {
      window.clearTimeout(enterTimer);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  return (
    <div
      onClick={() => {
        audio.unlock();
        finishSplash();
      }}
      className={`relative w-full h-full flex flex-col items-center justify-between py-14 px-6 overflow-hidden cursor-pointer select-none transition-opacity duration-300 ${
        stage === 'exit' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <PastelNatureBackdrop variant="lobby" />

      {/* Hero Stacked Cartoon Logo */}
      <div
        className={`relative z-10 flex flex-col items-center mt-4 transition-all duration-500 ${
          stage === 'enter'
            ? 'opacity-0 -translate-y-4 scale-95'
            : 'opacity-100 translate-y-0 scale-100'
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
          stage === 'enter'
            ? 'scale-90 opacity-0'
            : 'scale-100 opacity-100 animate-float-slow'
        }`}
      >
        <LobbyHeroFlask className="w-[176px] h-[190px]" />
      </div>

      {/* Smooth Auto-Advancing Progress Bar (Opens Lobby Automatically) */}
      <div className="relative z-10 w-full max-w-[230px] flex flex-col items-center gap-2.5 mb-2">
        <div className="w-full h-3.5 rounded-full pastel-track overflow-hidden p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#3AD986] via-[#5EEB72] to-[#34B6FA] transition-all duration-[1150ms] ease-out"
            style={{width: `${progress}%`}}
          />
        </div>
        <p className="text-xs font-bold text-[#C8FBF1] tracking-wide text-center">
          Mixing your studio...
        </p>
      </div>
    </div>
  );
};
