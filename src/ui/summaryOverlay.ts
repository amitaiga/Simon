import { strings } from '../i18n/strings';

export interface SummaryOverlay {
  element: HTMLElement;
  show(levelReached: number): void;
  hide(): void;
  onPlayAgain(cb: () => void): void;
}

// End-of-game summary (DESIGN 1.2): scrim + card with the title and a single "play again" button.
// While open, the element behind it is made inert so the board and start button can't be used.
export function createSummaryOverlay(behind: HTMLElement): SummaryOverlay {
  const scrim = document.createElement('div');
  scrim.className = 'overlay';
  scrim.hidden = true;

  const card = document.createElement('div');
  card.className = 'overlay__card';
  card.setAttribute('role', 'dialog');
  card.setAttribute('aria-modal', 'true');
  card.setAttribute('aria-labelledby', 'overlay-title');

  const title = document.createElement('h2');
  title.id = 'overlay-title';
  title.className = 'overlay__title';

  const playAgain = document.createElement('button');
  playAgain.type = 'button';
  playAgain.className = 'overlay__play-again';
  playAgain.textContent = strings.playAgain;

  card.append(title, playAgain);
  scrim.append(card);

  let playAgainCb: () => void = () => {};
  playAgain.addEventListener('click', () => {
    if (scrim.hidden) return;
    playAgainCb();
  });

  function hide(): void {
    scrim.hidden = true;
    behind.inert = false;
  }

  return {
    element: scrim,
    show: (levelReached) => {
      title.textContent = strings.lostAt(levelReached);
      behind.inert = true;
      scrim.hidden = false;
      playAgain.focus({ preventScroll: true });
    },
    hide,
    onPlayAgain: (cb) => (playAgainCb = cb),
  };
}
