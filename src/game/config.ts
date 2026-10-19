// Game constants (ARCHITECTURE 2ו). Timings are in milliseconds.
export type ColorId = 'green' | 'red' | 'yellow' | 'blue';

export const COLORS: readonly ColorId[] = ['green', 'red', 'yellow', 'blue'];

// Light duration of each color while the sequence is shown
export const LIT_MS = 500;
// Gap between colors while the sequence is shown
export const GAP_MS = 200;
// Light/tone duration when the player presses a color
export const PRESS_MS = 250;
// Pause after a completed level, before the next sequence starts
export const LEVEL_PAUSE_MS = 700;

// Tone per color (C major chord)
export const FREQUENCIES: Record<ColorId, number> = {
  green: 262,
  red: 330,
  yellow: 392,
  blue: 523,
};
