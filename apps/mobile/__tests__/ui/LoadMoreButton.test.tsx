import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { LoadMoreButton } from '../../components/ui/LoadMoreButton';

jest.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      primary: '#3b82f6',
      textMuted: '#94a3b8',
    },
  }),
}));

describe('LoadMoreButton', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    mockOnPress.mockClear();
  });

  it('renders with default text "Load More"', () => {
    const { getByText } = render(<LoadMoreButton onPress={mockOnPress} />);
    expect(getByText('Load More')).toBeTruthy();
  });

  it('renders with custom text', () => {
    const { getByText } = render(<LoadMoreButton onPress={mockOnPress} text="Show More Files" />);
    expect(getByText('Show More Files')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const { getByText } = render(<LoadMoreButton onPress={mockOnPress} />);
    fireEvent.press(getByText('Load More'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('shows loading text when isLoading is true', () => {
    const { getByText } = render(<LoadMoreButton onPress={mockOnPress} isLoading />);
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('shows custom loading text', () => {
    const { getByText } = render(<LoadMoreButton onPress={mockOnPress} isLoading loadingText="Fetching..." />);
    expect(getByText('Fetching...')).toBeTruthy();
  });

  it('does not call onPress when disabled', () => {
    const { getByText } = render(<LoadMoreButton onPress={mockOnPress} disabled />);
    fireEvent.press(getByText('Load More'));
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('does not call onPress when loading', () => {
    const { getByText } = render(<LoadMoreButton onPress={mockOnPress} isLoading />);
    fireEvent.press(getByText('Loading...'));
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('shows item count when totalItems and displayedItems are provided', () => {
    const { getByText } = render(
      <LoadMoreButton onPress={mockOnPress} totalItems={50} displayedItems={10} />
    );
    expect(getByText('Showing 10 of 50')).toBeTruthy();
  });

  it('does not show item count when totalItems is undefined', () => {
    const { queryByText } = render(<LoadMoreButton onPress={mockOnPress} />);
    expect(queryByText(/Showing/)).toBeNull();
  });
});
