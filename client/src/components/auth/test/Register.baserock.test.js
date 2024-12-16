import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import Register from '../../../../src/components/auth/Register';

// Mock the context hooks
jest.mock('../../context/alert/alertContext', () => ({
  __esModule: true,
  default: {
    Consumer: ({ children }) => children({ setAlert: null }),
    Provider: ({ children }) => children
  }
}));

jest.mock('../../context/auth/authContext', () => ({
  __esModule: true,
  default: {
    Consumer: ({ children }) => children({
      register: null,
      clearErrors: null,
      isAuthenticated: false,
      error: null
    }),
    Provider: ({ children }) => children
  }
}));

// Mock the history object
const mockHistoryPush = jest.fn();
const mockProps = {
  history: {
    push: mockHistoryPush
  }
};

describe('Register Component', () => {
  let mockSetAlert, mockRegister, mockClearErrors;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSetAlert = jest.fn();
    mockRegister = jest.fn();
    mockClearErrors = jest.fn();
    jest.spyOn(React, 'useContext').mockImplementation(() => ({
      setAlert: mockSetAlert,
      register: mockRegister,
      clearErrors: mockClearErrors,
      isAuthenticated: false,
      error: null
    }));
  });

  it('renders without crashing', () => {
    const { getByText, getByLabelText } = render(<Register {...mockProps} />);
    expect(getByText('טופס הרשמה')).toBeTruthy();
    expect(getByLabelText('שם')).toBeTruthy();
    expect(getByLabelText('דוא"ל')).toBeTruthy();
    expect(getByLabelText('סיסמה')).toBeTruthy();
    expect(getByLabelText('אימות סיסמה')).toBeTruthy();
  });

  it('updates state on input change', () => {
    const { getByLabelText } = render(<Register {...mockProps} />);
    const nameInput = getByLabelText('שם');
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    expect(nameInput.value).toBe('John Doe');
  });

  it('shows alert when fields are empty', async () => {
    const { getByText } = render(<Register {...mockProps} />);
    const submitButton = getByText('הרשמה');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockSetAlert).toHaveBeenCalledWith('נא למלא את כל השדות', 'danger');
    });
  });

  it('shows alert when passwords do not match', async () => {
    const { getByLabelText, getByText } = render(<Register {...mockProps} />);
    fireEvent.change(getByLabelText('שם'), { target: { value: 'John Doe' } });
    fireEvent.change(getByLabelText('דוא"ל'), { target: { value: 'john@example.com' } });
    fireEvent.change(getByLabelText('סיסמה'), { target: { value: 'password123' } });
    fireEvent.change(getByLabelText('אימות סיסמה'), { target: { value: 'password456' } });
    
    const submitButton = getByText('הרשמה');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockSetAlert).toHaveBeenCalledWith('הסיסמאות אינן תואמות', 'danger');
    });
  });

  it('calls register function when form is valid', async () => {
    const { getByLabelText, getByText } = render(<Register {...mockProps} />);
    fireEvent.change(getByLabelText('שם'), { target: { value: 'John Doe' } });
    fireEvent.change(getByLabelText('דוא"ל'), { target: { value: 'john@example.com' } });
    fireEvent.change(getByLabelText('סיסמה'), { target: { value: 'password123' } });
    fireEvent.change(getByLabelText('אימות סיסמה'), { target: { value: 'password123' } });
    
    const submitButton = getByText('הרשמה');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      });
    });
  });

  it('redirects when authenticated', async () => {
    jest.spyOn(React, 'useContext').mockImplementation(() => ({ isAuthenticated: true }));
    
    render(<Register {...mockProps} />);
    
    await waitFor(() => {
      expect(mockHistoryPush).toHaveBeenCalledWith('/');
    });
  });

  it('shows alert when user already exists', async () => {
    jest.spyOn(React, 'useContext').mockImplementation(() => ({
      setAlert: mockSetAlert,
      clearErrors: mockClearErrors,
      error: 'המשתמש כבר קיים.'
    }));
    
    render(<Register {...mockProps} />);
    
    await waitFor(() => {
      expect(mockSetAlert).toHaveBeenCalledWith('המשתמש כבר קיים.', 'danger');
      expect(mockClearErrors).toHaveBeenCalled();
    });
  });
});