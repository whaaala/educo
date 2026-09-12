import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { DriveBreadcrumbs } from '../../components/drive/DriveBreadcrumbs';

jest.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      background: '#ffffff',
      backgroundSecondary: '#f8fafc',
      text: '#0f172a',
      textSecondary: '#334155',
      textMuted: '#94a3b8',
      primary: '#3b82f6',
    },
  }),
}));

describe('DriveBreadcrumbs', () => {
  const mockOnNavigate = jest.fn();

  beforeEach(() => {
    mockOnNavigate.mockClear();
  });

  it('returns null when path is empty', () => {
    const { toJSON } = render(
      <DriveBreadcrumbs path={[]} onNavigate={mockOnNavigate} isTablet={false} />
    );
    expect(toJSON()).toBeNull();
  });

  it('renders a single breadcrumb segment', () => {
    const { getByText } = render(
      <DriveBreadcrumbs
        path={[{ id: 'root', name: 'My Drive' }]}
        onNavigate={mockOnNavigate}
        isTablet={true}
      />
    );
    expect(getByText('My Drive')).toBeTruthy();
  });

  it('renders multiple breadcrumb segments', () => {
    const path = [
      { id: 'folder-my-drive', name: 'My Drive' },
      { id: 'folder-documents', name: 'Documents' },
    ];
    const { getByText } = render(
      <DriveBreadcrumbs path={path} onNavigate={mockOnNavigate} isTablet={true} />
    );
    expect(getByText('My Drive')).toBeTruthy();
    expect(getByText('Documents')).toBeTruthy();
  });

  it('calls onNavigate when a non-last segment is tapped', () => {
    const path = [
      { id: 'folder-my-drive', name: 'My Drive' },
      { id: 'folder-documents', name: 'Documents' },
    ];
    const { getByText } = render(
      <DriveBreadcrumbs path={path} onNavigate={mockOnNavigate} isTablet={true} />
    );
    fireEvent.press(getByText('My Drive'));
    expect(mockOnNavigate).toHaveBeenCalledWith('folder-my-drive');
  });

  it('does not call onNavigate when the last segment is tapped', () => {
    const path = [
      { id: 'folder-my-drive', name: 'My Drive' },
      { id: 'folder-documents', name: 'Documents' },
    ];
    const { getByText } = render(
      <DriveBreadcrumbs path={path} onNavigate={mockOnNavigate} isTablet={true} />
    );
    fireEvent.press(getByText('Documents'));
    expect(mockOnNavigate).not.toHaveBeenCalled();
  });

  it('renders three-level deep breadcrumbs', () => {
    const path = [
      { id: 'folder-my-drive', name: 'My Drive' },
      { id: 'folder-documents', name: 'Documents' },
      { id: 'folder-sub', name: 'Subfolder' },
    ];
    const { getByText } = render(
      <DriveBreadcrumbs path={path} onNavigate={mockOnNavigate} isTablet={true} />
    );
    expect(getByText('My Drive')).toBeTruthy();
    expect(getByText('Documents')).toBeTruthy();
    expect(getByText('Subfolder')).toBeTruthy();
  });
});
