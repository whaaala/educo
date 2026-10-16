import { useWindowDimensions } from 'react-native';
import { windowClass, type WindowClass } from '@core/educo-ui/layout';

/**
 * What this window IS (A-2 (2)): its width rung, its height class, the navigation it gets and how many panes a list-detail
 * shows — the SAME answer the web app gets, from config/layout.json (RULE CFG). `useWindowDimensions` re-renders on every
 * rotation, split-screen and fold, so nothing reads the screen once and keeps a stale value (A2-4).
 */
export function useWindowClass(): WindowClass {
  const { width, height } = useWindowDimensions();
  return windowClass(width, height);
}

/**
 * The tablet layout: a window that gets a rail or a sidebar, never the phone's bar — so a tablet upright from the
 * tablet-portrait rung is a tablet (it was `width >= 768`, a width that matched no rung, A2-3) and a phone turned on its
 * side keeps the phone layout (its height is compact).
 */
export function useIsTablet(): boolean {
  return useWindowClass().shell !== 'bar';
}
