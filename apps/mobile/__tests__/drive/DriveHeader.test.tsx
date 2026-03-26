import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { DriveHeader } from '../../components/drive/DriveHeader';
import { SIDEBAR_SECTIONS } from '../../components/drive/driveMockData';

jest.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      background: '#ffffff',
      backgroundSecondary: '#f8fafc',
      surface: '#ffffff',
      text: '#0f172a',
      textSecondary: '#334155',
      textMuted: '#94a3b8',
      border: '#e2e8f0',
      primary: '#3b82f6',
      primaryLight: '#dbeafe',
      inputPlaceholder: '#94a3b8',
    },
  }),
}));

describe('DriveHeader', () => {
  const defaultProps = {
    searchQuery: '',
    onSearchChange: jest.fn(),
    viewMode: 'grid' as const,
    onViewModeChange: jest.fn(),
    isTablet: true,
  };

  beforeEach(() => {
    defaultProps.onSearchChange.mockClear();
    defaultProps.onViewModeChange.mockClear();
  });

  it('renders search bar with placeholder', () => {
    const { getByPlaceholderText } = render(<DriveHeader {...defaultProps} />);
    expect(getByPlaceholderText('Search files and folders...')).toBeTruthy();
  });

  it('calls onSearchChange when text is typed', () => {
    const { getByPlaceholderText } = render(<DriveHeader {...defaultProps} />);
    fireEvent.changeText(getByPlaceholderText('Search files and folders...'), 'test');
    expect(defaultProps.onSearchChange).toHaveBeenCalledWith('test');
  });

  it('does NOT render section pills on tablet', () => {
    const { queryByText } = render(<DriveHeader {...defaultProps} />);
    expect(queryByText('Home')).toBeNull();
    expect(queryByText('Starred')).toBeNull();
  });

  it('renders section pills on mobile', () => {
    const { getByText } = render(
      <DriveHeader
        {...defaultProps}
        isTablet={false}
        sections={SIDEBAR_SECTIONS}
        activeSection="home"
        onSectionChange={jest.fn()}
      />
    );
    expect(getByText('Home')).toBeTruthy();
    expect(getByText('My Drive')).toBeTruthy();
    expect(getByText('Starred')).toBeTruthy();
  });

  it('calls onSectionChange when a pill is tapped on mobile', () => {
    const onSectionChange = jest.fn();
    const { getByText } = render(
      <DriveHeader
        {...defaultProps}
        isTablet={false}
        sections={SIDEBAR_SECTIONS}
        activeSection="home"
        onSectionChange={onSectionChange}
      />
    );
    fireEvent.press(getByText('Starred'));
    expect(onSectionChange).toHaveBeenCalledWith('starred');
  });

  it('displays the current search query', () => {
    const { getByDisplayValue } = render(
      <DriveHeader {...defaultProps} searchQuery="Budget" />
    );
    expect(getByDisplayValue('Budget')).toBeTruthy();
  });
});
