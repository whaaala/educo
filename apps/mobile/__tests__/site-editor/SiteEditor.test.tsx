import React from 'react';
import { act, fireEvent, render } from '@testing-library/react-native';
import { AppState, BackHandler, Linking } from 'react-native';

import { editorUrl, FLUSH_ON_HIDE, ORIGIN_WHITELIST, routeNavigation } from '../../lib/site-editor';

const mockPush = jest.fn();
const mockBack = jest.fn();
let mockIsTablet = false;
const mockGoBack = jest.fn();
const mockInject = jest.fn();
// Every WebView the screen mounts, newest last: its props, and how many times one has mounted.
const mockWebViews: Array<Record<string, unknown>> = [];
let mockMounts = 0;

jest.mock('expo-router', () => {
  const { useEffect } = jest.requireActual('react');
  return {
    useRouter: () => ({ push: mockPush, back: mockBack }),
    useFocusEffect: (cb: () => () => void) => useEffect(cb, [cb]),
  };
});
jest.mock('react-native-safe-area-context', () => ({ useSafeAreaInsets: () => ({ top: 24, bottom: 16, left: 0, right: 0 }) }));
jest.mock('../../hooks/useIsTablet', () => ({ useIsTablet: () => mockIsTablet }));
jest.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'midnight',
    colors: {
      background: '#000', surface: '#111', border: '#222', text: '#fff', warningLight: '#fee',
      primary: '#00f', primaryLight: '#eef', textMuted: '#999',
    },
  }),
}));
jest.mock('react-native-webview', () => {
  const R = jest.requireActual('react');
  const { View } = jest.requireActual('react-native');
  const WebView = R.forwardRef((props: Record<string, unknown>, ref: unknown) => {
    R.useImperativeHandle(ref, () => ({ goBack: mockGoBack, injectJavaScript: mockInject }));
    R.useEffect(() => {
      mockMounts += 1;
    }, []);
    mockWebViews.push(props);
    return R.createElement(View, { testID: props.testID });
  });
  return { WebView };
});

const SiteEditorScreen = require('../../app/site-editor').default;

const latest = () => mockWebViews[mockWebViews.length - 1] as Record<string, (...a: unknown[]) => unknown> & { source: { uri: string }; cacheMode: string };

beforeEach(() => {
  mockWebViews.length = 0;
  mockMounts = 0;
  jest.clearAllMocks();
});

describe('the WebView lets educo:// reach routeNavigation (E5d-5)', () => {
  // the library's own gate, not a copy of it: outside the whitelist it calls Linking and never asks us
  const { createOnShouldStartLoadWithRequest } = jest.requireActual('react-native-webview/lib/WebViewShared');
  const gate = (url: string) => {
    const ours = jest.fn(() => false);
    const load = jest.fn();
    createOnShouldStartLoadWithRequest(load, ORIGIN_WHITELIST, ours)({ nativeEvent: { url, lockIdentifier: 1 } });
    return ours.mock.calls.length > 0;
  };
  it('educo:// and our own pages are ours to route', () => {
    expect(gate('educo://fees')).toBe(true);
    expect(gate('http://localhost:3100/website/box-demo')).toBe(true);
  });
  it('tel: and whatsapp: still go to the phone (Linking)', () => {
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(false);
    expect(gate('tel:+2348000000000')).toBe(false);
    expect(gate('whatsapp://send?text=hi')).toBe(false);
  });
});

describe('routeNavigation', () => {
  const origin = 'http://localhost:3100';
  it('loads our own editor in place', () => {
    expect(routeNavigation('http://localhost:3100/website/box-demo?theme=dark', origin)).toEqual({ kind: 'load' });
  });
  it('opens an educo:// link as a screen of the app', () => {
    expect(routeNavigation('educo://fees', origin)).toEqual({ kind: 'native', path: '/fees' });
    expect(routeNavigation('educo:///reports', origin)).toEqual({ kind: 'native', path: '/reports' });
  });
  it('sends every other address to the system browser', () => {
    expect(routeNavigation('https://example.com/', origin)).toEqual({ kind: 'browser' });
    expect(routeNavigation('http://localhost:3101/', origin)).toEqual({ kind: 'browser' });
    expect(routeNavigation('javascript:alert(1)', origin)).toEqual({ kind: 'browser' });
    expect(routeNavigation('not a url', origin)).toEqual({ kind: 'browser' });
  });
  it('puts the theme in the editor address', () => {
    expect(editorUrl('purple', origin)).toBe('http://localhost:3100/website/box-demo?theme=purple');
  });
});

describe.each([false, true])('SiteEditorScreen (isTablet=%s)', (tablet) => {
  beforeEach(() => {
    mockIsTablet = tablet;
  });

  it('opens the editor in the app theme, with a Back button that leaves', () => {
    const { getByLabelText, getByText } = render(<SiteEditorScreen />);
    expect(latest().source.uri).toContain('/website/box-demo?theme=midnight');
    expect(getByText('Website builder')).toHaveStyle({ fontSize: tablet ? 18 : 16 });
    fireEvent.press(getByLabelText('Back'));
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('Android Back walks the editor history first, then lets the screen go', () => {
    const add = jest.spyOn(BackHandler, 'addEventListener');
    render(<SiteEditorScreen />);
    const onBack = add.mock.calls[add.mock.calls.length - 1][1] as () => boolean;
    expect(onBack()).toBe(false);
    act(() => {
      latest().onNavigationStateChange({ canGoBack: true });
    });
    expect(onBack()).toBe(true);
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('routes navigations: own pages load, educo:// opens a screen, the rest the browser, embeds untouched', () => {
    const open = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
    render(<SiteEditorScreen />);
    const decide = latest().onShouldStartLoadWithRequest;
    expect(decide({ url: editorUrl('light'), isTopFrame: true })).toBe(true);
    expect(decide({ url: 'educo://messages', isTopFrame: true })).toBe(false);
    expect(mockPush).toHaveBeenCalledWith('/messages');
    expect(decide({ url: 'https://example.com/', isTopFrame: true })).toBe(false);
    expect(open).toHaveBeenCalledWith('https://example.com/');
    expect(decide({ url: 'https://www.youtube.com/embed/x', isTopFrame: false })).toBe(true);
  });

  it('offline: shows the saved copy from the cache, and Try again goes live', () => {
    const { getByText, getByLabelText, queryByText } = render(<SiteEditorScreen />);
    expect(latest().cacheMode).toBe('LOAD_DEFAULT');
    act(() => {
      latest().onError({});
    });
    expect(getByText(/You are offline/)).toBeTruthy();
    expect(latest().cacheMode).toBe('LOAD_CACHE_ONLY');
    fireEvent.press(getByLabelText('Try again online'));
    expect(queryByText(/You are offline/)).toBeNull();
    expect(latest().cacheMode).toBe('LOAD_DEFAULT');
  });

  it('remounts the editor when its process is gone (Android) or terminated (iOS)', () => {
    render(<SiteEditorScreen />);
    expect(mockMounts).toBe(1);
    act(() => {
      latest().onRenderProcessGone({});
    });
    expect(mockMounts).toBe(2);
    act(() => {
      latest().onContentProcessDidTerminate({});
    });
    expect(mockMounts).toBe(3);
  });

  it('E5d-4: leaving the app tells the page it is hidden, so words still being typed are saved', () => {
    const add = jest.spyOn(AppState, 'addEventListener');
    render(<SiteEditorScreen />);
    const onChange = add.mock.calls[add.mock.calls.length - 1][1] as (s: string) => void;
    act(() => onChange('active'));
    expect(mockInject).not.toHaveBeenCalled();
    act(() => onChange('background'));
    expect(mockInject).toHaveBeenCalledWith(FLUSH_ON_HIDE);
    expect(FLUSH_ON_HIDE).toContain("new Event('pagehide')");
  });

  it('keeps iOS swipe-back off over the canvas, and passes educo:// to its own routing', () => {
    render(<SiteEditorScreen />);
    expect(latest().originWhitelist).toEqual(ORIGIN_WHITELIST);
    expect(latest().allowsBackForwardNavigationGestures).toBe(false);
  });
});

describe('the offline notice reads in every theme (WCAG 1.4.3)', () => {
  const { getThemeColors } = jest.requireActual('../../contexts/ThemeContext');
  const lum = (hex: string) => {
    const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  it.each(['light', 'dark', 'midnight', 'purple'])('%s: text on warningLight ≥ 4.5:1', (theme) => {
    const c = getThemeColors(theme);
    const [a, b] = [lum(c.text), lum(c.warningLight)].sort((x, y) => y - x);
    expect((a + 0.05) / (b + 0.05)).toBeGreaterThanOrEqual(4.5);
  });
});
