import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import React from 'react';
import { render, act } from '@testing-library/react';
import AlertState from '../../../../src/context/alert/AlertState';
import AlertContext from '../../../../src/context/alert/alertContext';
import { SET_ALERT, REMOVE_ALERT } from '../../../../src/context/types';

// Mock uuid module
jest.mock('uuid', () => ({
  v4: () => 'test-uuid'
}));

// Mock React's useReducer
const mockDispatch = jest.fn();
let mockState = [];
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useReducer: () => [mockState, mockDispatch]
}));

describe('AlertState', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockState = [];
    mockDispatch.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('should set an alert and remove it after the specified time', () => {
    const TestComponent = () => {
      const { setAlert } = React.useContext(AlertContext);
      React.useEffect(() => {
        setAlert('Test message', 'success', 2);
      }, []);
      return null;
    };

    render(
      <AlertState>
        <TestComponent />
      </AlertState>
    );

    expect(mockDispatch).toHaveBeenCalledWith({
      type: SET_ALERT,
      payload: { message: 'Test message', type: 'success', id: 'test-uuid' }
    });

    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 2000);

    act(() => {
      jest.runAllTimers();
    });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: REMOVE_ALERT,
      payload: 'test-uuid'
    });
  });

  it('should use default timeout of 3 seconds if not specified', () => {
    const TestComponent = () => {
      const { setAlert } = React.useContext(AlertContext);
      React.useEffect(() => {
        setAlert('Test message', 'error');
      }, []);
      return null;
    };

    render(
      <AlertState>
        <TestComponent />
      </AlertState>
    );

    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 3000);
  });

  it('should render children correctly', () => {
    const TestChild = () => <div>Test Child</div>;

    const { getByText } = render(
      <AlertState>
        <TestChild />
      </AlertState>
    );

    expect(getByText('Test Child')).toBeInTheDocument();
  });

  it('should provide alerts state through context', () => {
    mockState = [{ id: '1', message: 'Test Alert', type: 'info' }];

    const TestComponent = () => {
      const { alerts } = React.useContext(AlertContext);
      return <div>{alerts[0].message}</div>;
    };

    const { getByText } = render(
      <AlertState>
        <TestComponent />
      </AlertState>
    );

    expect(getByText('Test Alert')).toBeInTheDocument();
  });
});