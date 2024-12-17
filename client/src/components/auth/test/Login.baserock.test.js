import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import Login from '../../../../src/components/auth/Login';

// Mock the context hooks
const mockSetAlert = jest.fn();
const mockLogin = jest.fn();
const mockClearErrors = jest.fn();

jest.mock('../../../../src/context/alert/alertContext', () => ({
  __esModule: true,
  default: React.createContext({
    setAlert: mockSetAlert,
  }),
}));

jest.mock('../../../../src/context/auth/authContext', () => ({
  __esModule: true,
  default: React.createContext({
    login: mockLogin,
    error: null,
    clearErrors: mockClearErrors,
    isAuthenticated: false,
  }),
}));

// Mock the history object
const mockHistoryPush = jest.fn();
const props = {
  history: {
    push: mockHistoryPush,
  },
};

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form correctly', () => {
    render(<Login {...props} />);
    expect(screen.getByText('כניסה לחשבון')).toBeInTheDocument();
    expect(screen.getByLabelText('דוא"ל')).toBeInTheDocument();
    expect(screen.getByLabelText('סיסמה')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'כניסה' })).toBeInTheDocument();
  });

  it('updates email and password state on input change', () => {
    render(<Login {...props} />);
    const emailInput = screen.getByLabelText('דוא"ל');
    const passwordInput = screen.getByLabelText('סיסמה');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('calls setAlert when form is submitted with empty fields', () => {
    render(<Login {...props} />);
    const submitButton = screen.getByRole('button', { name: 'כניסה' });

    fireEvent.click(submitButton);

    expect(mockSetAlert).toHaveBeenCalledWith('נא למלא את כל השדות', 'danger');
  });

  it('calls login function when form is submitted with valid data', () => {
    render(<Login {...props} />);
    const emailInput = screen.getByLabelText('דוא"ל');
    const passwordInput = screen.getByLabelText('סיסמה');
    const submitButton = screen.getByRole('button', { name: 'כניסה' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(mockLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('redirects to home page when authenticated', async () => {
    const mockAuthContext = {
      isAuthenticated: true,
      login: mockLogin,
      error: null,
      clearErrors: mockClearErrors,
    };
    jest.spyOn(React, 'useContext').mockImplementation(() => mockAuthContext);

    render(<Login {...props} />);

    await waitFor(() => {
      expect(mockHistoryPush).toHaveBeenCalledWith('/');
    });
  });

  it('displays alert when there is an error', async () => {
    const mockAuthContext = {
      isAuthenticated: false,
      login: mockLogin,
      error: 'הפרטים שהוזנו אינם תקינים.',
      clearErrors: mockClearErrors,
    };
    jest.spyOn(React, 'useContext').mockImplementation(() => mockAuthContext);

    render(<Login {...props} />);

    await waitFor(() => {
      expect(mockSetAlert).toHaveBeenCalledWith('הפרטים שהוזנו אינם תקינים.', 'danger');
      expect(mockClearErrors).toHaveBeenCalled();
    });
  });
});