import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import React from 'react';
import { render } from '@testing-library/react';
import { v4 as uuid } from 'uuid';
import AlertState from '../../../../src/context/alert/AlertState';
import AlertContext from '../../../../src/context/alert/alertContext';
import { SET_ALERT, REMOVE_ALERT } from '../../../../src/context/types';

// Mock the required modules
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useReducer: jest.fn(),
}));

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid'),
}));

describe('AlertState', () => {
  let mockDispatch;
  let mockState;

  beforeEach(() => {
    jest.useFakeTimers();
    mockDispatch = jest.fn();
    mockState = [];
    React.useReducer.mockReturnValue([mockState, mockDispatch]);
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

    // Check initial dispatch for setting alert
    expect(mockDispatch).toHaveBeenCalledWith({
      type: SET_ALERT,
      payload: { message: 'Test message', type: 'success', id: 'test-uuid' }
    });

    // Verify timeout was set
    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 2000);

    // Run all timers to trigger alert removal
    jest.runAllTimers();

    // Check dispatch for removing alert
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

    // Verify default timeout
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
});
