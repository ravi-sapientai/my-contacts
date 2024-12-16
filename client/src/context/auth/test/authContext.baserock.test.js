import { describe, it, expect } from '@jest/globals';
import authContext from '../../../../src/context/auth/authContext.js';
import { createContext } from 'react';

describe('authContext', () => {
  it('should be a valid React context', () => {
    expect(authContext).toBeDefined();
    expect(authContext).toEqual(expect.any(Object));
    expect(authContext.Provider).toBeDefined();
    expect(authContext.Consumer).toBeDefined();
  });

  it('should be created using createContext', () => {
    const mockContext = createContext();
    expect(Object.getPrototypeOf(authContext)).toEqual(Object.getPrototypeOf(mockContext));
  });

  it('should have default value undefined', () => {
    expect(authContext._currentValue).toBeUndefined();
  });
});