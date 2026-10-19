import { FREQUENCIES, type ColorId } from '../game/config';

const ATTACK_S = 0.01;
const RELEASE_S = 0.04;
const VOLUME = 0.3;

// Generates the four color tones with Web Audio. Any failure is swallowed:
// the game keeps working with visual feedback only.
export class AudioService {
  private ctx: AudioContext | null = null;

  // Must be called from a user gesture (the start button)
  unlock(): void {
    try {
      this.ctx ??= new AudioContext();
      void this.ctx.resume().catch(() => {});
    } catch {
      this.ctx = null;
    }
  }

  play(color: ColorId, durationMs: number): void {
    const ctx = this.ctx;
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const end = now + durationMs / 1000;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = FREQUENCIES[color];
      // Short fade in/out to avoid clicks
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(VOLUME, now + ATTACK_S);
      gain.gain.setValueAtTime(VOLUME, Math.max(now + ATTACK_S, end - RELEASE_S));
      gain.gain.linearRampToValueAtTime(0, end);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(end + 0.01);
    } catch {
      // Ignore audio errors
    }
  }
}
