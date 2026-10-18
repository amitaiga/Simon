import { strings } from '../i18n/strings';

// Builds the home screen. In M0 it contains only the header; the board and scoreboard come later.
export function createHomeScreen(): HTMLElement {
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
  screen.append(header, document.createElement('main'));
  return screen;
}
