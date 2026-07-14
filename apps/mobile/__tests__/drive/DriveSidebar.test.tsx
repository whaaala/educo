import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { DriveSidebar } from '../../components/drive/DriveSidebar';
import { SIDEBAR_SECTIONS } from '../../components/drive/driveMockData';

// Mock ThemeContext
jest.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      background: '#ffffff',
      backgroundSecondary: '#f8fafc',
      backgroundTertiary: '#f1f5f9',
      surface: '#ffffff',
      text: '#0f172a',
      textSecondary: '#334155',
      textMuted: '#94a3b8',
      border: '#e2e8f0',
      primary: '#3b82f6',
      primaryLight: '#dbeafe',
      warning: '#f59e0b',
    },
  }),
}));

describe('DriveSidebar (Tablet)', () => {
  const mockOnSectionChange = jest.fn();

  beforeEach(() => {
    mockOnSectionChange.mockClear();
  });

  it('renders the Drive title', () => {
    const { getByText } = render(
      <DriveSidebar activeSection="myDrive" onSectionChange={mockOnSectionChange} />
    );
    expect(getByText('Drive')).toBeTruthy();
  });

  it('renders all sidebar sections', () => {
    const { getByText } = render(
      <DriveSidebar activeSection="myDrive" onSectionChange={mockOnSectionChange} />
    );
    SIDEBAR_SECTIONS.forEach((section) => {
      expect(getByText(section.label)).toBeTruthy();
    });
  });

  it('calls onSectionChange when a section is tapped', () => {
    const { getByText } = render(
      <DriveSidebar activeSection="myDrive" onSectionChange={mockOnSectionChange} />
    );
    fireEvent.press(getByText('My Drive'));
    expect(mockOnSectionChange).toHaveBeenCalledWith('myDrive');
  });

  it('calls onSectionChange with correct section IDs', () => {
    const { getByText } = render(
      <DriveSidebar activeSection="myDrive" onSectionChange={mockOnSectionChange} />
    );
    fireEvent.press(getByText('Starred'));
    expect(mockOnSectionChange).toHaveBeenCalledWith('starred');

    fireEvent.press(getByText('Bin'));
    expect(mockOnSectionChange).toHaveBeenCalledWith('bin');

    fireEvent.press(getByText('Shared with me'));
    expect(mockOnSectionChange).toHaveBeenCalledWith('shared');
  });

  it('renders storage indicator', () => {
    const { getByText } = render(
      <DriveSidebar activeSection="myDrive" onSectionChange={mockOnSectionChange} />
    );
    expect(getByText('Storage')).toBeTruthy();
    expect(getByText('58.4 MB of 200 MB used')).toBeTruthy();
  });

  it('renders all section labels for each section ID', () => {
    // NB: there is no "Home" section — it was a dead member of the DriveSection union with no
    // sidebar entry and no screen behaviour, and has been removed.
    const sectionLabels = SIDEBAR_SECTIONS.map(s => s.label);
    expect(sectionLabels).toContain('My Drive');
    expect(sectionLabels).toContain('Shared with me');
    expect(sectionLabels).toContain('Recent');
    expect(sectionLabels).toContain('Starred');
    expect(sectionLabels).toContain('Bin');
  });
});
