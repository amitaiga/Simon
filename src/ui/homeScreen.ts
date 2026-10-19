import { strings } from '../i18n/strings';
import { createBoard, type Board } from './board';

export interface HomeScreen {
  element: HTMLElement;
  board: Board;
  setLevel(level: number): void;
  setBest(level: number): void;
}

// Builds the home screen: header, game board and the personal-best card
// (the recent-games list comes in M3).
export function createHomeScreen(): HomeScreen {
  const screen = document.createElement('div');
  screen.className = 'home';

  const header = document.createElement('header');
  header.className = 'header';

  const title = document.createElement('h1');
  title.className = 'header__title';
  title.textContent = strings.appTitle;

  const levelPill = document.createElement('span');
  levelPill.className = 'level-pill';
  levelPill.setAttribute('aria-live', 'polite');
  levelPill.textContent = strings.level(1);

  header.append(title, levelPill);

  const board = createBoard();

  // Personal best card: hidden until the first game ends
  const bestCard = document.createElement('div');
  bestCard.className = 'best-card';
  bestCard.hidden = true;
  const bestLabel = document.createElement('span');
  bestLabel.className = 'best-card__label';
  bestLabel.textContent = strings.bestLabel;
  const bestValue = document.createElement('span');
  bestValue.className = 'best-card__value';
  bestCard.append(bestLabel, bestValue);

  const main = document.createElement('main');
  main.append(board.element, bestCard);

  screen.append(header, main);
  return {
    element: screen,
    board,
    setLevel: (level) => (levelPill.textContent = strings.level(level)),
    setBest: (level) => {
      bestValue.textContent = strings.bestValue(level);
      bestCard.hidden = false;
    },
  };
}
