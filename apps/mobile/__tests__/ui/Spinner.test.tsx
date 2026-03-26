import React from 'react';
import { render } from '@testing-library/react-native';
import { Spinner } from '../../components/ui/Spinner';

jest.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      primary: '#3b82f6',
      primaryLight: '#dbeafe',
      textMuted: '#94a3b8',
    },
  }),
}));

describe('Spinner', () => {
  it('renders with default message "Loading..."', () => {
    const { getByText } = render(<Spinner />);
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('renders with custom message', () => {
    const { getByText } = render(<Spinner message="Fetching files..." />);
    expect(getByText('Fetching files...')).toBeTruthy();
  });

  it('renders without message when message is empty', () => {
    const { queryByText } = render(<Spinner message="" />);
    expect(queryByText('Loading...')).toBeNull();
  });

  it('renders with sm size', () => {
    const { getByText } = render(<Spinner size="sm" />);
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('renders with lg size', () => {
    const { getByText } = render(<Spinner size="lg" />);
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('renders in inline mode', () => {
    const { getByText } = render(<Spinner inline />);
    expect(getByText('Loading...')).toBeTruthy();
  });
});
