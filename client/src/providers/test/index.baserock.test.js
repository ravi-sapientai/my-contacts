import { jest, describe, it, expect } from '@jest/globals';
import { createTheming } from '../../../src/providers/index.js';

// Mock the createTheming module
jest.mock('../../../src/providers/createTheming', () => ({
  __esModule: true,
  default: () => ({ mockThemingObject: true }),
  ThemingType: 'MockThemingType'
}));

describe('Theming Provider', () => {
  it('should export createTheming function', () => {
    expect(createTheming).toBeDefined();
    expect(typeof createTheming).toBe('function');
  });

  it('should return the result of createTheming', () => {
    const result = createTheming({});
    expect(result).toEqual({ mockThemingObject: true });
  });

  it('should export ThemingType', () => {
    const { ThemingType } = require('../../../src/providers/index.js');
    expect(ThemingType).toBeDefined();
    expect(ThemingType).toBe('MockThemingType');
  });
});