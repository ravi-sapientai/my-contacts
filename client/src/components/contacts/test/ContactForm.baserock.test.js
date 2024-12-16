import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Mock the entire ContactContext module
jest.mock('../../../../src/context/contact/contactContext', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: React.createContext(null)
  };
});

// Import the component after mocking its dependencies
import ContactForm from '../../../../src/components/contacts/ContactForm';

describe('ContactForm', () => {
  let mockContextValue;

  beforeEach(() => {
    mockContextValue = {
      addContact: jest.fn(),
      updateContact: jest.fn(),
      clearCurrent: jest.fn(),
      current: null
    };

    jest.spyOn(React, 'useContext').mockImplementation(() => mockContextValue);
  });

  it('renders correctly with initial state', () => {
    const { getByText, getByPlaceholderText } = render(<ContactForm />);
    
    expect(getByText('הוספת איש קשר')).toBeInTheDocument();
    expect(getByPlaceholderText('שם')).toHaveValue('');
    expect(getByPlaceholderText('דוא"ל')).toHaveValue('');
    expect(getByPlaceholderText('טלפון')).toHaveValue('');
    expect(getByText('פרטי')).toBeChecked();
  });

  it('updates state on input change', () => {
    const { getByPlaceholderText } = render(<ContactForm />);
    
    const nameInput = getByPlaceholderText('שם');
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    expect(nameInput).toHaveValue('John Doe');
  });

  it('submits the form with new contact', async () => {
    const { getByPlaceholderText, getByText } = render(<ContactForm />);
    
    fireEvent.change(getByPlaceholderText('שם'), { target: { value: 'John Doe' } });
    fireEvent.change(getByPlaceholderText('דוא"ל'), { target: { value: 'john@example.com' } });
    fireEvent.change(getByPlaceholderText('טלפון'), { target: { value: '1234567890' } });
    
    fireEvent.click(getByText('הוספת איש קשר'));
    
    await waitFor(() => {
      expect(mockContextValue.addContact).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        type: 'פרטי'
      });
    });
  });

  it('updates existing contact when current is not null', async () => {
    const currentContact = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '0987654321',
      type: 'עסקי'
    };

    mockContextValue.current = currentContact;

    const { getByText, getByPlaceholderText } = render(<ContactForm />);

    expect(getByText('עריכת איש קשר')).toBeInTheDocument();
    expect(getByPlaceholderText('שם')).toHaveValue('Jane Doe');
    
    fireEvent.change(getByPlaceholderText('טלפון'), { target: { value: '1111111111' } });
    fireEvent.click(getByText('עדכון איש קשר'));

    await waitFor(() => {
      expect(mockContextValue.updateContact).toHaveBeenCalledWith({
        ...currentContact,
        phone: '1111111111'
      });
    });
  });

  it('clears the form when clearAll is called', () => {
    mockContextValue.current = { name: 'Test', email: 'test@example.com', phone: '1234567890', type: 'פרטי' };

    const { getByText } = render(<ContactForm />);
    const clearButton = getByText('ניקוי');
    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton);
    expect(mockContextValue.clearCurrent).toHaveBeenCalled();
  });

  it('changes contact type when radio button is clicked', () => {
    const { getByLabelText } = render(<ContactForm />);
    
    const businessRadio = getByLabelText('עסקי');
    fireEvent.click(businessRadio);
    expect(businessRadio).toBeChecked();

    const privateRadio = getByLabelText('פרטי');
    expect(privateRadio).not.toBeChecked();
  });
});