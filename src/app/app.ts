import { createHomeScreen } from '../ui/homeScreen';
import { createSummaryOverlay } from '../ui/summaryOverlay';
import { AudioService } from '../services/audio';
import { createGameController } from './gameController';

// App shell: mounts the single home screen with the summary overlay above it and starts the game controller.
export function mountApp(root: HTMLElement): void {
  const screen = createHomeScreen();
  const overlay = createSummaryOverlay(screen.element);
  root.replaceChildren(screen.element, overlay.element);
  createGameController(screen, overlay, new AudioService());
}
