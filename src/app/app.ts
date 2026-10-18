import { createHomeScreen } from '../ui/homeScreen';

// App shell: mounts the single home screen.
export function mountApp(root: HTMLElement): void {
  root.replaceChildren(createHomeScreen());
}
