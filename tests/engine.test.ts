import { describe, expect, it } from 'vitest';
import { GameEngine } from '../src/game/engine';
import { COLORS, type ColorId } from '../src/game/config';

// Deterministic random source cycling through the given values
function seq(...values: number[]): () => number {
  let i = 0;
  return () => values[i++ % values.length];
}

// Plays the current sequence correctly and returns the result of the last press
function playLevel(engine: GameEngine) {
  engine.sequenceShown();
  const [first, ...rest] = engine.sequence;
  let result = engine.press(first);
  for (const color of rest) result = engine.press(color);
  return result;
}

function wrongColor(color: ColorId): ColorId {
  return COLORS.find((c) => c !== color)!;
}

describe('GameEngine', () => {
  it('starts idle with an empty sequence', () => {
    const engine = new GameEngine();
    expect(engine.state).toBe('Idle');
    expect(engine.level).toBe(0);
  });

  it('has a sequence of length N at level N', () => {
    const engine = new GameEngine(seq(0.1, 0.3, 0.6, 0.9));
    engine.start();
    for (let level = 1; level <= 12; level++) {
      expect(engine.level).toBe(level);
      expect(engine.sequence).toHaveLength(level);
      playLevel(engine);
    }
  });

  it('maps random values to colors', () => {
    const engine = new GameEngine(seq(0, 0.3, 0.6, 0.99));
    engine.start();
    for (let i = 0; i < 3; i++) playLevel(engine);
    expect(engine.sequence).toEqual(['green', 'red', 'yellow', 'blue']);
  });

  it('extends the previous sequence by one color each level', () => {
    const engine = new GameEngine(seq(0.7, 0.2, 0.9, 0.4, 0.1));
    engine.start();
    for (let level = 1; level < 12; level++) {
      const before = engine.sequence;
      playLevel(engine);
      const after = engine.sequence;
      expect(after).toHaveLength(before.length + 1);
      expect(after.slice(0, before.length)).toEqual(before);
    }
  });

  it('ends the game on a single wrong press', () => {
    const engine = new GameEngine(seq(0.1, 0.5, 0.8));
    engine.start();
    playLevel(engine);
    playLevel(engine); // now at level 3
    engine.sequenceShown();
    const result = engine.press(wrongColor(engine.sequence[0]));
    expect(result).toEqual({ kind: 'lost', levelReached: 3 });
    expect(engine.state).toBe('GameOver');
  });

  it('has no level limit: each completed round raises the level by 1', () => {
    const engine = new GameEngine(seq(0.2, 0.6));
    engine.start();
    for (let level = 1; level <= 15; level++) {
      expect(playLevel(engine)).toEqual({ kind: 'levelUp', level: level + 1 });
    }
    expect(engine.state).toBe('ShowingSequence');
    expect(engine.level).toBe(16);
  });

  it('ignores presses while showing the sequence, idle or game over', () => {
    const engine = new GameEngine(seq(0.4));
    expect(engine.press('green')).toEqual({ kind: 'ignored' });

    engine.start();
    const before = engine.sequence;
    for (const color of COLORS) expect(engine.press(color)).toEqual({ kind: 'ignored' });
    expect(engine.state).toBe('ShowingSequence');
    expect(engine.sequence).toEqual(before);
    expect(engine.level).toBe(1);

    engine.sequenceShown();
    engine.press(wrongColor(engine.sequence[0]));
    expect(engine.press('green')).toEqual({ kind: 'ignored' });
  });

  it('checks rapid presses in arrival order', () => {
    const engine = new GameEngine(seq(0, 0.3, 0.6, 0.99));
    engine.start();
    for (let i = 0; i < 3; i++) playLevel(engine); // level 4: green, red, yellow, blue
    engine.sequenceShown();
    expect(['green', 'red', 'yellow', 'blue'].map((c) => engine.press(c as ColorId).kind)).toEqual([
      'correct',
      'correct',
      'correct',
      'levelUp',
    ]);
    // A press arriving after the level is complete is ignored
    expect(engine.press('green')).toEqual({ kind: 'ignored' });

    engine.sequenceShown();
    const results = ['green', 'blue', 'yellow'].map((c) => engine.press(c as ColorId).kind);
    expect(results).toEqual(['correct', 'lost', 'ignored']);
  });

  it('restarts from level 1 after game over', () => {
    const engine = new GameEngine(seq(0.1, 0.9));
    engine.start();
    playLevel(engine);
    engine.sequenceShown();
    engine.press(wrongColor(engine.sequence[0]));
    engine.start();
    expect(engine.state).toBe('ShowingSequence');
    expect(engine.level).toBe(1);
  });

  it('reset returns to idle', () => {
    const engine = new GameEngine();
    engine.start();
    engine.reset();
    expect(engine.state).toBe('Idle');
    expect(engine.level).toBe(0);
  });
});
