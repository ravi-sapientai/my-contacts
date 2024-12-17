import { describe, it, expect, jest } from '@jest/globals';
import { createTheming } from '@callstack/react-theme-provider';
import { themes, ThemeProvider, withTheme } from '../../../src/providers/theming.js';

// Mock the createTheming function
jest.mock('@callstack/react-theme-provider', () => ({
  createTheming: () => ({
    ThemeProvider: function MockThemeProvider() {},
    withTheme: function mockWithTheme() {},
  }),
}));

describe('Theming', () => {
  describe('themes', () => {
    it('should have default and dark themes', () => {
      expect(themes).toHaveProperty('default');
      expect(themes).toHaveProperty('dark');
    });

    it('should have correct structure for default theme', () => {
      const expectedKeys = ['primaryColor', 'accentColor', 'backgroundColor', 'textColor', 'secondaryColor'];
      expect(Object.keys(themes.default)).toEqual(expect.arrayContaining(expectedKeys));
    });

    it('should have correct structure for dark theme', () => {
      const expectedKeys = ['primaryColor', 'accentColor', 'backgroundColor', 'textColor', 'secondaryColor'];
      expect(Object.keys(themes.dark)).toEqual(expect.arrayContaining(expectedKeys));
    });

    it('should have different background and text colors for default and dark themes', () => {
      expect(themes.default.backgroundColor).not.toBe(themes.dark.backgroundColor);
      expect(themes.default.textColor).not.toBe(themes.dark.textColor);
    });
  });

  describe('createTheming', () => {
    it('should export ThemeProvider', () => {
      expect(ThemeProvider).toBeDefined();
    });

    it('should export withTheme', () => {
      expect(withTheme).toBeDefined();
    });
  });
});