import { fireEvent, render } from '@testing-library/react-native';
import { LISTS, LIST_WORDS, WORDS } from '@core/app-shell';
import { RUNG_PX } from '@core/educo-ui/layout';

/**
 * A-2 change 4 in the app — the list-detail, as a phone (isTablet false, one pane) and as a tablet on its side (two panes):
 * a row pushes its own route on a phone and Back returns; on a tablet both panes show, the first row chosen, a row swaps the
 * detail in place; a missing id and an empty list both say so. Every row is marked as a sample.
 */
const mockPush = jest.fn(), mockReplace = jest.fn(), mockBack = jest.fn();
let mockCanGoBack = true;
jest.mock('expo-router', () => ({ useRouter: () => ({ push: mockPush, replace: mockReplace, back: mockBack, canGoBack: () => mockCanGoBack }) }));
jest.mock('@expo/vector-icons', () => ({ Ionicons: () => null }));
jest.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({ colors: { background: '#fff', backgroundSecondary: '#fafafa', surfaceHover: '#eee', border: '#ddd', primary: '#00f', text: '#111', textSecondary: '#555' } }),
}));
let mockDims = { width: 390, height: 844, scale: 1, fontScale: 1 };
jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({ __esModule: true, default: () => mockDims }));

import ListDetail from '../../components/ui/ListDetail';

const kids = LISTS.children.rows;
const phone = () => { mockDims = { width: 390, height: 844, scale: 1, fontScale: 1 }; };
const tablet = () => { mockDims = { width: RUNG_PX.tabletLandscape + 200, height: 800, scale: 1, fontScale: 1 }; };
beforeEach(() => { [mockPush, mockReplace, mockBack].forEach((m) => m.mockReset()); mockCanGoBack = true; });

describe('ListDetail — a phone (one pane)', () => {
  it('shows the list, every row marked as a sample; a row pushes its own route', () => {
    phone(); const r = render(<ListDetail listId="children" base="/children" openId={null} />);
    expect(r.getAllByText(WORDS.sample)).toHaveLength(kids.length);
    fireEvent.press(r.getByLabelText(`${kids[1].title}, ${kids[1].subtitle}`));
    expect(mockPush).toHaveBeenCalledWith(`/children/${kids[1].id}`);
  });
  it('the detail has Back, which goes back — or to the list when the detail was opened from a link', () => {
    phone(); const r = render(<ListDetail listId="children" base="/children" openId={kids[0].id} />);
    expect(r.getByText(kids[0].fields[0].value)).toBeTruthy();
    fireEvent.press(r.getByLabelText(LIST_WORDS.back)); expect(mockBack).toHaveBeenCalled();
    mockCanGoBack = false; fireEvent.press(r.getByLabelText(LIST_WORDS.back)); expect(mockReplace).toHaveBeenCalledWith('/children');
  });
});

describe('ListDetail — a tablet on its side (two panes)', () => {
  it('shows the list beside the first row, chosen; a row swaps the detail in place (no history step)', () => {
    tablet(); const r = render(<ListDetail listId="children" base="/children" openId={null} />);
    expect(r.getByText(kids[0].fields[0].value)).toBeTruthy();
    expect(r.getByLabelText(`${kids[0].title}, ${kids[0].subtitle}`).props.accessibilityState).toEqual({ selected: true });
    expect(r.queryByLabelText(LIST_WORDS.back)).toBeNull();
    fireEvent.press(r.getByLabelText(`${kids[1].title}, ${kids[1].subtitle}`));
    expect(mockReplace).toHaveBeenCalledWith(`/children/${kids[1].id}`); expect(mockPush).not.toHaveBeenCalled();
  });
});

describe('ListDetail — nothing to show', () => {
  it.each([[false], [true]])('a missing id says so (tablet: %s)', (isTab) => {
    (isTab ? tablet : phone)(); const r = render(<ListDetail listId="children" base="/children" openId="nobody" />);
    expect(r.getByText(LIST_WORDS.missing)).toBeTruthy();
  });
  it('an empty list says so', () => {
    phone(); expect(render(<ListDetail listId="empty" base="/x" openId={null} />).getByText(LIST_WORDS.empty)).toBeTruthy();
  });
});
