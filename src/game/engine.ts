import { COLORS, type ColorId } from './config';

export type GameState = 'Idle' | 'ShowingSequence' | 'AwaitingInput' | 'GameOver';

export type PressResult =
  | { kind: 'ignored' }
  | { kind: 'correct' }
  | { kind: 'levelUp'; level: number }
  | { kind: 'lost'; levelReached: number };

// Pure game rules (endless levels, ends on the first wrong press): no DOM, audio, timers or storage. The random source is injectable for tests.
export class GameEngine {
  private _state: GameState = 'Idle';
  private _sequence: ColorId[] = [];
  private inputIndex = 0;

  constructor(private readonly rng: () => number = Math.random) {}

  get state(): GameState {
    return this._state;
  }

  // Current level equals the sequence length (0 before the first game)
  get level(): number {
    return this._sequence.length;
  }

  get sequence(): readonly ColorId[] {
    return [...this._sequence];
  }

  start(): void {
    if (this._state !== 'Idle' && this._state !== 'GameOver') return;
    this._sequence = [];
    this.addColor();
    this._state = 'ShowingSequence';
  }

  sequenceShown(): void {
    if (this._state !== 'ShowingSequence') return;
    this.inputIndex = 0;
    this._state = 'AwaitingInput';
  }

  press(color: ColorId): PressResult {
    if (this._state !== 'AwaitingInput') return { kind: 'ignored' };

    if (color !== this._sequence[this.inputIndex]) {
      this._state = 'GameOver';
      return { kind: 'lost', levelReached: this.level };
    }

    this.inputIndex++;
    if (this.inputIndex < this._sequence.length) return { kind: 'correct' };

    // No level limit: the game continues until the first wrong press
    this.addColor();
    this._state = 'ShowingSequence';
    return { kind: 'levelUp', level: this.level };
  }

  reset(): void {
    this._state = 'Idle';
    this._sequence = [];
    this.inputIndex = 0;
  }

  private addColor(): void {
    const index = Math.min(Math.floor(this.rng() * COLORS.length), COLORS.length - 1);
    this._sequence.push(COLORS[index]);
  }
}
