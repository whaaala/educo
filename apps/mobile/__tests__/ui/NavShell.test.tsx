import { existsSync } from 'fs';
import { join } from 'path';
import { fireEvent, render } from '@testing-library/react-native';

/**
 * A-2 change 3 — the app's navigation is DATA (config/app-shell.json): the bar and the rail draw the parent's places from it,
 * every place has a drawing and a real screen, the rail marks the place you are on and goes where its data says, and the
 * sidebar shows the words beside the icons. The tablet (rail) and the phone (bar) are both covered.
 */
const mockPush = jest.fn();
let mockPath = '/';
jest.mock('expo-router', () => ({ useRouter: () => ({ push: mockPush }), usePathname: () => mockPath }));
jest.mock('react-native-safe-area-context', () => ({ useSafeAreaInsets: () => ({ top: 24, bottom: 16, left: 0, right: 0 }) }));
jest.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({ theme: 'light', isDark: false, colors: { background: '#fff', backgroundSecondary: '#fafafa', surface: '#fff', surfaceHover: '#eee', border: '#ddd', primary: '#00f', textSecondary: '#555', textTertiary: '#777' } }),
}));
jest.mock('expo-linear-gradient', () => ({ LinearGradient: () => null }));

import NavRail from '../../components/ui/NavRail';
import BottomTabBar, { APP_PLACES, TAB_ICONS } from '../../components/ui/BottomTabBar';

beforeEach(() => { mockPush.mockReset(); mockPath = '/'; });

describe('the app shell reads its places from config/app-shell.json', () => {
  it('every place has a drawing and a screen to go to', () => {
    for (const p of APP_PLACES) {
      expect(TAB_ICONS[p.icon]).toBeDefined();
      const file = p.href === '/' ? 'index' : p.href.slice(1);
      expect(existsSync(join(__dirname, '..', '..', 'app', '(tabs)', `${file}.tsx`))).toBe(true);
    }
  });

  it.each([false, true])('the rail (sidebar: %s) shows every place, marks the one you are on, and goes where its data says', (expanded) => {
    mockPath = '/fees/history';
    const r = render(<NavRail expanded={expanded} />);
    for (const p of APP_PLACES) expect(r.getByLabelText(p.label)).toBeTruthy();
    expect(r.getByLabelText('Fees').props.accessibilityState).toEqual({ selected: true });
    expect(r.getByLabelText('Home').props.accessibilityState).toEqual({ selected: false });
    fireEvent.press(r.getByLabelText('Chat'));
    expect(mockPush).toHaveBeenCalledWith('/messages');
  });

  it('the phone bar shows the same places and goes where they say', () => {
    const r = render(<BottomTabBar />);
    for (const p of APP_PLACES) expect(r.getByText(p.label)).toBeTruthy();
    fireEvent.press(r.getByText('Children'));
    expect(mockPush).toHaveBeenCalledWith('/children');
  });

  it('neither shows over the website builder, which needs the whole screen', () => {
    mockPath = '/site-editor';
    expect(render(<NavRail expanded={false} />).toJSON()).toBeNull();
    expect(render(<BottomTabBar />).toJSON()).toBeNull();
  });
});
