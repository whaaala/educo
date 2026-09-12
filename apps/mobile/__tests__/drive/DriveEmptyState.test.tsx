import React from 'react';
import { render } from '@testing-library/react-native';
import { DriveEmptyState } from '../../components/drive/DriveEmptyState';

jest.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      text: '#0f172a',
      textMuted: '#94a3b8',
      primary: '#3b82f6',
      primaryLight: '#dbeafe',
    },
  }),
}));

describe('DriveEmptyState', () => {
  it('renders title text', () => {
    const { getByText } = render(
      <DriveEmptyState title="No recent files" />
    );
    expect(getByText('No recent files')).toBeTruthy();
  });

  it('renders subtitle text', () => {
    const { getByText } = render(
      <DriveEmptyState title="Bin is empty" subtitle="Items you delete will appear here" />
    );
    expect(getByText('Items you delete will appear here')).toBeTruthy();
  });

  it('renders without subtitle', () => {
    const { getByText } = render(
      <DriveEmptyState title="No items" />
    );
    expect(getByText('No items')).toBeTruthy();
  });

  it('renders each empty state configuration', () => {
    const configs = [
      { title: 'No recent files', subtitle: 'Files you open or edit will appear here' },
      { title: 'No starred items', subtitle: 'Star important files and folders for quick access' },
      { title: 'Nothing shared with you', subtitle: 'Files shared with you will appear here' },
      { title: 'Bin is empty', subtitle: 'Items you delete will appear here' },
      { title: 'This folder is empty', subtitle: 'Upload files or create folders to get started' },
      { title: 'No results found', subtitle: 'No files or folders match "test"' },
    ];

    configs.forEach(({ title, subtitle }) => {
      const { getByText, unmount } = render(
        <DriveEmptyState icon="folder-open-outline" title={title} subtitle={subtitle} />
      );
      expect(getByText(title)).toBeTruthy();
      expect(getByText(subtitle)).toBeTruthy();
      unmount();
    });
  });
});
