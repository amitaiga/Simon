import { createHomeScreen } from '../ui/homeScreen';
import { AudioService } from '../services/audio';
import { createGameController } from './gameController';

// App shell: mounts the single home screen and starts the game controller.
export function mountApp(root: HTMLElement): void {
  const screen = createHomeScreen();
  root.replaceChildren(screen.element);
  createGameController(screen, new AudioService());
}
