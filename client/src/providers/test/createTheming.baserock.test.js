import { describe, it, expect, jest } from '@jest/globals';
import React from 'react';
import deepmerge from 'deepmerge';
import createTheming from '../../../src/providers/createTheming';

// Mock React
jest.mock('react', () => ({
  createContext: (defaultValue) => ({
    Provider: () => {},
    Consumer: () => {},
  }),
  useContext: () => {},
  useMemo: (fn) => fn(),
}));

// Mock deepmerge
jest.mock('deepmerge', () => ({
  __esModule: true,
  default: (a, b) => ({ ...a, ...b }),
}));

describe('createTheming', () => {
  const defaultTheme = { color: 'blue', fontSize: 16 };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a theming object with correct structure', () => {
    const theming = createTheming(defaultTheme);
    
    expect(theming).toHaveProperty('ThemeContext');
    expect(theming).toHaveProperty('ThemeProvider');
    expect(theming).toHaveProperty('withTheme');
    expect(theming).toHaveProperty('useTheme');
  });

  describe('useTheme', () => {
    it('should return theme from context when no overrides', () => {
      jest.spyOn(React, 'useContext').mockReturnValue({ color: 'red', fontSize: 18 });

      const theming = createTheming(defaultTheme);
      const result = theming.useTheme();

      expect(result).toEqual({ color: 'red', fontSize: 18 });
    });

    it('should merge theme from context with overrides', () => {
      jest.spyOn(React, 'useContext').mockReturnValue({ color: 'red', fontSize: 18 });

      const theming = createTheming(defaultTheme);
      const result = theming.useTheme({ fontSize: 20 });

      expect(result).toEqual({ color: 'red', fontSize: 20 });
    });

    it('should return overrides when no theme in context', () => {
      jest.spyOn(React, 'useContext').mockReturnValue(null);

      const theming = createTheming(defaultTheme);
      const result = theming.useTheme({ fontSize: 20 });

      expect(result).toEqual({ fontSize: 20 });
    });

    it('should return default theme when no context and no overrides', () => {
      jest.spyOn(React, 'useContext').mockReturnValue(null);

      const theming = createTheming(defaultTheme);
      const result = theming.useTheme();

      expect(result).toEqual(defaultTheme);
    });
  });
});