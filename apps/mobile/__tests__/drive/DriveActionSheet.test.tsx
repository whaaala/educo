import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { DriveActionSheet } from '../../components/drive/DriveActionSheet';
import type { DriveItem } from '../../components/drive/driveMockData';

jest.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      background: '#ffffff',
      backgroundSecondary: '#f8fafc',
      backgroundTertiary: '#f1f5f9',
      surface: '#ffffff',
      surfaceHover: '#f8fafc',
      text: '#0f172a',
      textSecondary: '#334155',
      textMuted: '#94a3b8',
      border: '#e2e8f0',
      primary: '#3b82f6',
      primaryLight: '#dbeafe',
      error: '#ef4444',
      errorLight: '#fee2e2',
      modalBackground: '#ffffff',
    },
  }),
}));

const mockFile: DriveItem = {
  id: 'file-001',
  parentId: 'folder-documents',
  name: 'School Policy 2025.pdf',
  type: 'file',
  sourceType: 'document',
  size: 2400000,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  owner: 'Me',
  starred: true,
};

const mockFolder: DriveItem = {
  id: 'folder-documents',
  parentId: 'folder-my-drive',
  name: 'Documents',
  type: 'folder',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  owner: 'Me',
};

const mockBinItem: DriveItem = {
  id: 'file-bin-001',
  parentId: 'folder-bin',
  name: 'Old Timetable.pdf',
  type: 'file',
  sourceType: 'document',
  size: 560000,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  owner: 'Me',
  previousParentId: 'folder-documents',
};

describe('DriveActionSheet', () => {
  const mockOnClose = jest.fn();
  const mockOnAction = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnAction.mockClear();
  });

  it('renders file name in header', () => {
    const { getByText } = render(
      <DriveActionSheet visible={true} onClose={mockOnClose} item={mockFile} onAction={mockOnAction} />
    );
    expect(getByText('School Policy 2025.pdf')).toBeTruthy();
  });

  it('shows file actions for a regular file', () => {
    const { getByText } = render(
      <DriveActionSheet visible={true} onClose={mockOnClose} item={mockFile} onAction={mockOnAction} />
    );
    expect(getByText('Open')).toBeTruthy();
    expect(getByText('Rename')).toBeTruthy();
    expect(getByText('Move')).toBeTruthy();
    expect(getByText('Unstar')).toBeTruthy(); // starred file shows Unstar
    expect(getByText('Share')).toBeTruthy();
    expect(getByText('Save')).toBeTruthy();
    expect(getByText('Bin')).toBeTruthy();
  });

  it('shows folder actions for a folder', () => {
    const { getByText, queryByText } = render(
      <DriveActionSheet visible={true} onClose={mockOnClose} item={mockFolder} onAction={mockOnAction} />
    );
    expect(getByText('Open')).toBeTruthy();
    expect(getByText('Rename')).toBeTruthy();
    expect(getByText('Move')).toBeTruthy();
    expect(getByText('Star')).toBeTruthy();
    expect(getByText('Bin')).toBeTruthy();
    expect(queryByText('Share')).toBeNull();
    expect(queryByText('Save')).toBeNull();
  });

  it('shows bin actions for a bin item', () => {
    const { getByText, queryByText } = render(
      <DriveActionSheet visible={true} onClose={mockOnClose} item={mockBinItem} onAction={mockOnAction} />
    );
    expect(getByText('Restore')).toBeTruthy();
    expect(getByText('Delete')).toBeTruthy();
    expect(queryByText('Open')).toBeNull();
    expect(queryByText('Rename')).toBeNull();
  });

  it('calls onAction and onClose when an action is tapped', () => {
    const { getByText } = render(
      <DriveActionSheet visible={true} onClose={mockOnClose} item={mockFile} onAction={mockOnAction} />
    );
    fireEvent.press(getByText('Rename'));
    expect(mockOnAction).toHaveBeenCalledWith('rename', mockFile);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('shows Star for unstarred files', () => {
    const unstarredFile = { ...mockFile, starred: false };
    const { getByText } = render(
      <DriveActionSheet visible={true} onClose={mockOnClose} item={unstarredFile} onAction={mockOnAction} />
    );
    expect(getByText('Star')).toBeTruthy();
  });

  it('shows Unstar for starred files', () => {
    const { getByText } = render(
      <DriveActionSheet visible={true} onClose={mockOnClose} item={mockFile} onAction={mockOnAction} />
    );
    expect(getByText('Unstar')).toBeTruthy();
  });
});
