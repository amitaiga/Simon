import { COLORS, type ColorId } from '../game/config';
import { strings } from '../i18n/strings';

// ready: green "start" button; watch / yourTurn: disabled turn indicator during a game
export type CenterMode = 'ready' | 'watch' | 'yourTurn';

export interface Board {
  element: HTMLElement;
  lightUp(color: ColorId): void;
  lightOff(color: ColorId): void;
  setCenter(mode: CenterMode): void;
  onColorPress(cb: (color: ColorId) => void): void;
  onStart(cb: () => void): void;
}

const CENTER_TEXT: Record<CenterMode, string> = {
  ready: strings.start,
  watch: strings.watch,
  yourTurn: strings.yourTurn,
};

// Round Simon board: four quadrants with a center start button.
// Forced to LTR so the color layout never flips with the RTL document.
export function createBoard(): Board {
  const element = document.createElement('div');
  element.className = 'board';
  element.dir = 'ltr';
  element.addEventListener('contextmenu', (e) => e.preventDefault());

  const quadrants = {} as Record<ColorId, HTMLButtonElement>;
  let colorPress: (color: ColorId) => void = () => {};
  let start: () => void = () => {};

  for (const color of COLORS) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `quadrant quadrant--${color}`;
    btn.setAttribute('aria-label', strings.colorNames[color]);
    btn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      colorPress(color);
    });
    quadrants[color] = btn;
    element.append(btn);
  }

  const ring = document.createElement('div');
  ring.className = 'board__ring';
  const center = document.createElement('button');
  center.type = 'button';
  center.className = 'board__center';
  center.addEventListener('click', () => start());
  ring.append(center);
  element.append(ring);

  function setCenter(mode: CenterMode): void {
    center.dataset.mode = mode;
    center.textContent = CENTER_TEXT[mode];
    center.disabled = mode !== 'ready';
  }
  setCenter('ready');

  return {
    element,
    lightUp: (color) => quadrants[color].classList.add('is-lit'),
    lightOff: (color) => quadrants[color].classList.remove('is-lit'),
    setCenter,
    onColorPress: (cb) => (colorPress = cb),
    onStart: (cb) => (start = cb),
  };
}
