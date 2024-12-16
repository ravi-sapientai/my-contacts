import { describe, it, expect } from '@jest/globals';
import alertReducer from '../alertReducer';

// Mock the types since we can't import them
const SET_ALERT = 'SET_ALERT';
const REMOVE_ALERT = 'REMOVE_ALERT';

describe('alertReducer', () => {
  it('should return the initial state', () => {
    expect(alertReducer(undefined, {})).toEqual([]);
  });

  it('should handle SET_ALERT', () => {
    const initialState = [];
    const alert = { id: '1', msg: 'Test alert', type: 'success' };
    const action = { type: SET_ALERT, payload: alert };
    const newState = alertReducer(initialState, action);
    expect(newState).toEqual([alert]);
  });

  it('should handle multiple SET_ALERT actions', () => {
    const initialState = [];
    const alert1 = { id: '1', msg: 'Test alert 1', type: 'success' };
    const alert2 = { id: '2', msg: 'Test alert 2', type: 'error' };
    const state1 = alertReducer(initialState, { type: SET_ALERT, payload: alert1 });
    const state2 = alertReducer(state1, { type: SET_ALERT, payload: alert2 });
    expect(state2).toEqual([alert1, alert2]);
  });

  it('should handle REMOVE_ALERT', () => {
    const initialState = [
      { id: '1', msg: 'Test alert 1', type: 'success' },
      { id: '2', msg: 'Test alert 2', type: 'error' }
    ];
    const action = { type: REMOVE_ALERT, payload: '1' };
    const newState = alertReducer(initialState, action);
    expect(newState).toEqual([{ id: '2', msg: 'Test alert 2', type: 'error' }]);
  });

  it('should not modify state for unknown action type', () => {
    const initialState = [{ id: '1', msg: 'Test alert', type: 'success' }];
    const action = { type: 'UNKNOWN_ACTION', payload: {} };
    const newState = alertReducer(initialState, action);
    expect(newState).toEqual(initialState);
  });

  it('should handle REMOVE_ALERT with non-existent id', () => {
    const initialState = [{ id: '1', msg: 'Test alert', type: 'success' }];
    const action = { type: REMOVE_ALERT, payload: '2' };
    const newState = alertReducer(initialState, action);
    expect(newState).toEqual(initialState);
  });
});