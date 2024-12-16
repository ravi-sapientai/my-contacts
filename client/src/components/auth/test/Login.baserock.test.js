import { render, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import * as React from 'react'

// Mock the context hooks
jest.mock('../../../context/alert/alertContext', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: React.createContext(null),
  };
});

jest.mock('../../../context/auth/authContext', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: React.createContext(null),
  };
});

const mockSetAlert = jest.fn();
const mockLogin = jest.fn();
const mockClearErrors = jest.fn();
const mockHistoryPush = jest.fn();

const mockUseContext = jest.fn().mockImplementation((context) => {
  if (context.displayName === 'AlertContext') {
    return { setAlert: mockSetAlert };
  }
  if (context.displayName === 'AuthContext') {
    return {
      login: mockLogin,
      error: null,
      clearErrors: mockClearErrors,
      isAuthenticated: false,
    };
  }
});

const actualReact = jest.requireActual('react');
jest.mock('react', () => ({
  ...actualReact,
  useContext: mockUseContext,
}));

import Login from '../../../../src/components/auth/Login';

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { getByText, getByLabelText } = render(<Login history={{}} />);
    expect(getByText('כניסה לחשבון')).toBeTruthy();
    expect(getByLabelText('דוא"ל')).toBeTruthy();
    expect(getByLabelText('סיסמה')).toBeTruthy();
  });

  it('updates state on input change', () => {
    const { getByLabelText } = render(<Login history={{}} />);
    const emailInput = getByLabelText('דוא"ל');
    const passwordInput = getByLabelText('סיסמה');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('calls setAlert when form is submitted with empty fields', () => {
    const { getByText } = render(<Login history={{}} />);
    const submitButton = getByText('כניסה');

    fireEvent.click(submitButton);

    expect(mockSetAlert).toHaveBeenCalledWith('נא למלא את כל השדות', 'danger');
  });

  it('calls login when form is submitted with valid data', () => {
    const { getByLabelText, getByText } = render(<Login history={{}} />);
    const emailInput = getByLabelText('דוא"ל');
    const passwordInput = getByLabelText('סיסמה');
    const submitButton = getByText('כניסה');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(mockLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('redirects to home page when authenticated', async () => {
    mockUseContext.mockImplementation((context) => {
      if (context.displayName === 'AuthContext') {
        return {
          login: mockLogin,
          error: null,
          clearErrors: mockClearErrors,
          isAuthenticated: true,
        };
      }
      return { setAlert: mockSetAlert };
    });

    render(<Login history={{ push: mockHistoryPush }} />);

    await waitFor(() => {
      expect(mockHistoryPush).toHaveBeenCalledWith('/');
    });
  });

  it('displays alert when there is an error', async () => {
    mockUseContext.mockImplementation((context) => {
      if (context.displayName === 'AuthContext') {
        return {
          login: mockLogin,
          error: 'הפרטים שהוזנו אינם תקינים.',
          clearErrors: mockClearErrors,
          isAuthenticated: false,
        };
      }
      return { setAlert: mockSetAlert };
    });

    render(<Login history={{}} />);

    await waitFor(() => {
      expect(mockSetAlert).toHaveBeenCalledWith('הפרטים שהוזנו אינם תקינים.', 'danger');
      expect(mockClearErrors).toHaveBeenCalled();
    });
  });
});