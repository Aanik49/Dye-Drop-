import type {DyeCode} from './types';

const BG_MUSIC_URL = '/assets/aistudio/Watercolor_Afternoon_c01ce484.mp3';

class DyeDropAudioEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled = true;
  private musicEnabled = true;
  private lastSwirlTime = 0;
  private bgMusic: HTMLAudioElement | null = null;
  private visibilityBound = false;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext || (window as unknown as {webkitAudioContext?: typeof AudioContext}).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private ensureBgMusic(): HTMLAudioElement | null {
    if (typeof window === 'undefined') return null;
    if (!this.bgMusic) {
      const el = new Audio(BG_MUSIC_URL);
      el.loop = true;
      el.preload = 'auto';
      el.volume = 0.42;
      this.bgMusic = el;
    }
    if (!this.visibilityBound && typeof document !== 'undefined') {
      this.visibilityBound = true;
      document.addEventListener('visibilitychange', () => {
        if (!this.bgMusic) return;
        if (document.hidden) {
          this.bgMusic.pause();
        } else if (this.musicEnabled) {
          this.bgMusic.play().catch(() => {});
        }
      });
    }
    return this.bgMusic;
  }

  public unlock(): void {
    this.ensureContext();
    if (this.musicEnabled) {
      this.startMusicLoop();
    }
  }

  public setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
  }

  public setMusicEnabled(enabled: boolean): void {
    this.musicEnabled = enabled;
    if (enabled) {
      this.ensureContext();
      this.startMusicLoop();
    } else {
      this.stopMusicLoop();
    }
  }

  private playTone(
    freq: number,
    type: OscillatorType = 'sine',
    dur = 0.22,
    delay = 0,
    vol = 0.14,
    endFreq?: number
  ): void {
    if (!this.soundEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (endFreq !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), now + dur);
    }

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(vol, now + 0.014);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + dur + 0.02);
  }

  public playSplash(): void {
    if (!this.soundEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    // Liquid droplet plop into glass
    this.playTone(300, 'sine', 0.16, 0, 0.24, 680);
    this.playTone(440, 'sine', 0.14, 0.09, 0.2, 880);
    // Shimmering pop-art title chime
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((f, idx) => {
      this.playTone(f, 'triangle', 0.38, 0.18 + idx * 0.07, 0.13);
    });
  }

  public playClick(): void {
    this.playTone(480, 'triangle', 0.065, 0, 0.11, 690);
  }

  public playLocked(): void {
    this.playTone(210, 'triangle', 0.11, 0, 0.13, 150);
    this.playTone(165, 'triangle', 0.12, 0.08, 0.11, 125);
  }

  public playDrop(dye: DyeCode = 'R', dropIndex = 0): void {
    if (!this.soundEnabled) return;
    const baseMap: Record<DyeCode, number> = {
      R: 390,
      Y: 465,
      B: 340,
      W: 520,
      K: 255,
      D: 590,
    };
    const base = baseMap[dye] ?? 390;
    const offset = (dropIndex % 5) * 24;
    this.playTone(base + offset, 'sine', 0.16, 0, 0.24, (base + offset) * 1.9);
  }

  public playSwirl(intensity = 0.6): void {
    if (!this.soundEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    if (now - this.lastSwirlTime < 0.2) return;
    this.lastSwirlTime = now;

    const duration = 0.24;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320 + intensity * 240, now);
    filter.frequency.exponentialRampToValueAtTime(640 + intensity * 260, now + duration);
    filter.Q.setValueAtTime(3.0, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.065 * Math.min(1, intensity), now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + duration);
  }

  public playVialCork(): void {
    this.playTone(260, 'sine', 0.08, 0, 0.18, 640);
  }

  public playVialBeam(step = 0): void {
    const scale = [523.25, 659.25, 783.99, 987.77, 1174.66];
    const f = scale[step % scale.length];
    this.playTone(f, 'triangle', 0.34, 0, 0.14);
    this.playTone(f * 2, 'sine', 0.2, 0.015, 0.05);
  }

  public playCrystalVictory(): void {
    const chord = [523.25, 659.25, 783.99, 1046.5, 1318.5];
    chord.forEach((f, idx) => {
      this.playTone(f, 'triangle', 0.5, idx * 0.07, 0.14);
      this.playTone(f * 1.5, 'sine', 0.32, idx * 0.07 + 0.02, 0.05);
    });
  }

  public playStarPop(starIdx: number): void {
    const notes = [659.25, 783.99, 1046.5];
    const f = notes[starIdx % notes.length];
    this.playTone(f, 'triangle', 0.28, 0, 0.16);
    this.playTone(f * 2, 'sine', 0.18, 0.01, 0.06);
  }

  public playFail(): void {
    this.playTone(340, 'triangle', 0.18, 0, 0.16, 250);
    this.playTone(250, 'triangle', 0.26, 0.16, 0.16, 170);
  }

  public playBuy(): void {
    this.playTone(587.33, 'triangle', 0.14, 0, 0.16);
    this.playTone(880, 'triangle', 0.22, 0.08, 0.16);
    this.playTone(1174.66, 'sine', 0.3, 0.16, 0.14);
  }

  public playChapterUnlock(): void {
    const fanfare = [523.25, 659.25, 783.99, 1046.5, 1174.66, 1567.98];
    fanfare.forEach((f, idx) => {
      this.playTone(f, 'triangle', 0.48, idx * 0.085, 0.15);
    });
  }

  public playTick(urgent = false): void {
    this.playTone(urgent ? 940 : 680, 'triangle', 0.055, 0, urgent ? 0.13 : 0.08, urgent ? 1120 : 620);
  }

  public playComboMatch(streak: number): void {
    const semitones = Math.min(12, Math.max(0, streak - 1));
    const root = 523.25 * Math.pow(2, semitones / 12);
    this.playTone(root, 'triangle', 0.18, 0, 0.16);
    this.playTone(root * 1.25, 'triangle', 0.22, 0.055, 0.15);
    if (streak >= 2) {
      this.playTone(root * 1.5, 'sine', 0.26, 0.11, 0.13);
    }
  }

  public playTimeUp(): void {
    const notes = [783.99, 659.25, 587.33, 523.25];
    notes.forEach((f, idx) => {
      this.playTone(f, 'triangle', 0.26, idx * 0.08, 0.14);
    });
  }

  private startMusicLoop(): void {
    if (!this.musicEnabled) return;
    const el = this.ensureBgMusic();
    if (!el) return;
    if (el.paused) {
      el.play().catch(() => {
        // Browser autoplay policy may wait until first user interaction; unlock() will retry
      });
    }
  }

  private stopMusicLoop(): void {
    if (this.bgMusic && !this.bgMusic.paused) {
      this.bgMusic.pause();
    }
  }
}

export const audio = new DyeDropAudioEngine();
