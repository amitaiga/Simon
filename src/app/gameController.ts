import { GAP_MS, LEVEL_PAUSE_MS, LIT_MS, PRESS_MS, type ColorId } from '../game/config';
import { GameEngine } from '../game/engine';
import type { AudioService } from '../services/audio';
import type { HomeScreen } from '../ui/homeScreen';

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

// Connects the pure game engine to the board, the level pill, audio and timing.
export function createGameController(
  screen: HomeScreen,
  audio: AudioService,
  engine = new GameEngine(),
): void {
  const { board } = screen;
  const offTimers = new Map<ColorId, ReturnType<typeof setTimeout>>();
  // Highest level reached in this page session (not saved; persistence comes in M3)
  let best = 0;

  function flash(color: ColorId, ms: number): void {
    clearTimeout(offTimers.get(color));
    board.lightUp(color);
    audio.play(color, ms);
    offTimers.set(
      color,
      setTimeout(() => board.lightOff(color), ms),
    );
  }

  async function showSequence(): Promise<void> {
    board.setCenter('watch');
    for (const color of engine.sequence) {
      flash(color, LIT_MS);
      await wait(LIT_MS + GAP_MS);
    }
    engine.sequenceShown();
    board.setCenter('yourTurn');
  }

  // Temporary end of game for M1: back to the initial state (the summary overlay comes in M2)
  function endGame(levelReached: number): void {
    if (levelReached > best) {
      best = levelReached;
      screen.setBest(best);
    }
    engine.reset();
    screen.setLevel(1);
    board.setCenter('ready');
  }

  board.onStart(() => {
    if (engine.state !== 'Idle' && engine.state !== 'GameOver') return;
    audio.unlock();
    engine.start();
    screen.setLevel(engine.level);
    void showSequence();
  });

  board.onColorPress((color) => {
    if (engine.state !== 'AwaitingInput') return;
    flash(color, PRESS_MS);
    const result = engine.press(color);
    if (result.kind === 'levelUp') {
      board.setCenter('watch');
      screen.setLevel(result.level);
      void wait(LEVEL_PAUSE_MS).then(showSequence);
    } else if (result.kind === 'lost') {
      endGame(result.levelReached);
    }
  });
}
