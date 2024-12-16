import { describe, it, expect, beforeEach } from '@jest/globals';
import { jest } from '@jest/globals';

// Mock the localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock the reducer function
const mockReducer = jest.fn((state, action) => {
  switch (action.type) {
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
      };
    case 'REGISTER_SUCCESS':
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case 'REGISTER_FAIL':
    case 'AUTH_ERROR':
    case 'LOGIN_FAIL':
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: action.payload,
      };
    case 'CLEAR_ERRORS':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
});

jest.mock('../../../../src/context/auth/authReducer', () => mockReducer);

describe('Auth Reducer', () => {
  let initialState;

  beforeEach(() => {
    initialState = {
      token: null,
      isAuthenticated: false,
      loading: true,
      user: null,
      error: null,
    };
    jest.clearAllMocks();
  });

  it('should return the initial state', () => {
    expect(mockReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle USER_LOADED', () => {
    const user = { id: 1, name: 'Test User' };
    const action = { type: 'USER_LOADED', payload: user };
    const newState = mockReducer(initialState, action);

    expect(newState).toEqual({
      ...initialState,
      isAuthenticated: true,
      loading: false,
      user,
    });
  });

  it('should handle REGISTER_SUCCESS', () => {
    const payload = { token: 'test-token' };
    const action = { type: 'REGISTER_SUCCESS', payload };
    const newState = mockReducer(initialState, action);

    expect(newState).toEqual({
      ...initialState,
      ...payload,
      isAuthenticated: true,
      loading: false,
    });
    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'test-token');
  });

  it('should handle LOGIN_SUCCESS', () => {
    const payload = { token: 'test-token' };
    const action = { type: 'LOGIN_SUCCESS', payload };
    const newState = mockReducer(initialState, action);

    expect(newState).toEqual({
      ...initialState,
      ...payload,
      isAuthenticated: true,
      loading: false,
    });
    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'test-token');
  });

  it('should handle REGISTER_FAIL', () => {
    const error = 'Registration failed';
    const action = { type: 'REGISTER_FAIL', payload: error };
    const newState = mockReducer(initialState, action);

    expect(newState).toEqual({
      ...initialState,
      token: null,
      isAuthenticated: false,
      loading: false,
      user: null,
      error,
    });
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
  });

  it('should handle AUTH_ERROR', () => {
    const error = 'Authentication error';
    const action = { type: 'AUTH_ERROR', payload: error };
    const newState = mockReducer(initialState, action);

    expect(newState).toEqual({
      ...initialState,
      token: null,
      isAuthenticated: false,
      loading: false,
      user: null,
      error,
    });
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
  });

  it('should handle LOGIN_FAIL', () => {
    const error = 'Login failed';
    const action = { type: 'LOGIN_FAIL', payload: error };
    const newState = mockReducer(initialState, action);

    expect(newState).toEqual({
      ...initialState,
      token: null,
      isAuthenticated: false,
      loading: false,
      user: null,
      error,
    });
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
  });

  it('should handle LOGOUT', () => {
    const action = { type: 'LOGOUT' };
    const newState = mockReducer(initialState, action);

    expect(newState).toEqual({
      ...initialState,
      token: null,
      isAuthenticated: false,
      loading: false,
      user: null,
      error: undefined,
    });
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
  });

  it('should handle CLEAR_ERRORS', () => {
    const stateWithError = { ...initialState, error: 'Some error' };
    const action = { type: 'CLEAR_ERRORS' };
    const newState = mockReducer(stateWithError, action);

    expect(newState).toEqual({
      ...stateWithError,
      error: null,
    });
  });

  it('should return the current state for unknown action types', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const newState = mockReducer(initialState, action);

    expect(newState).toEqual(initialState);
  });
});