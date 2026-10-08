import React from 'react';
import { render } from '@testing-library/react-native';

const mockStatusBar = jest.fn();
let mockDark = false;
jest.mock('expo-status-bar', () => ({ StatusBar: (p: { style: string }) => { mockStatusBar(p.style); return null; } }));
jest.mock('../../contexts/ThemeContext', () => ({ useTheme: () => ({ isDark: mockDark }) }));

const { ThemedStatusBar } = require('../../components/ui/ThemedStatusBar');

describe('ThemedStatusBar (E5d-6)', () => {
  it.each([[true, 'light'], [false, 'dark']])('isDark=%s → the status bar draws %s', (dark, style) => {
    mockDark = dark;
    render(<ThemedStatusBar />);
    expect(mockStatusBar).toHaveBeenLastCalledWith(style);
  });
});
