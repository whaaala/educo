import { renderHook } from '@testing-library/react-native';
import { useIsTablet, useWindowClass } from '@/hooks/useIsTablet';
import { RUNG_PX, HEIGHT_PX, NARROWEST_PHONE_PX } from '@core/educo-ui/layout';

/**
 * A-2 (2), A2-3 / A2-4 — the app asks the SAME windowClass as the web (config/layout.json), and asks it LIVE: a tablet from the
 * tablet-portrait rung is a tablet (it was `width >= 768`), a phone on its side keeps the phone layout, and turning the
 * device re-renders with the new answer (the 15 copies read the width once and never again). isTablet true AND false.
 */
const dims = (width: number, height: number) => ({ width, height, scale: 1, fontScale: 1 });
let mockDims = dims(360, 800);
// RN's own module, which the react-native index re-exports through a getter (a spy on the index does not reach it)
jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({ __esModule: true, default: () => mockDims }));
const spy = { mockReturnValue: (d: ReturnType<typeof dims>) => { mockDims = d; } };

describe('useIsTablet', () => {
  it.each([
    ['a low-cost phone upright', NARROWEST_PHONE_PX, 800, false],
    ['that phone on its side (compact height)', 800, NARROWEST_PHONE_PX, false],
    ['a small tablet upright, under the old 768', RUNG_PX.tabletPortrait, 960, true],
    ['one px under the tablet rung', RUNG_PX.tabletPortrait - 1, 960, false],
    ['a tablet on its side', 1280, 800, true],
  ] as const)('%s (%i × %i) → %s', (_who, w, h, want) => {
    spy.mockReturnValue(dims(w, h));
    expect(renderHook(() => useIsTablet()).result.current).toBe(want);
  });

  it('follows a turn without a reload: a tablet upright → on its side → a phone-height window', () => {
    spy.mockReturnValue(dims(800, 1280));
    const { result, rerender } = renderHook(() => useWindowClass());
    expect(result.current).toMatchObject({ shell: 'rail', panes: 1 });
    spy.mockReturnValue(dims(1280, 800)); rerender({});
    expect(result.current).toMatchObject({ shell: 'sidebar', panes: 2 });
    spy.mockReturnValue(dims(1280, HEIGHT_PX.medium - 1)); rerender({});
    expect(result.current.shell).toBe('bar');
  });
});
