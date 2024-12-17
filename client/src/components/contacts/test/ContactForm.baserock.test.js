import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Mock functions
const mockAddContact = jest.fn();
const mockUpdateContact = jest.fn();
const mockClearCurrent = jest.fn();

// Mock the ContactContext
const MockContactContext = React.createContext({
  addContact: mockAddContact,
  updateContact: mockUpdateContact,
  clearCurrent: mockClearCurrent,
  current: null
});

jest.mock('../../../../src/context/contact/contactContext', () => ({
  __esModule: true,
  default: MockContactContext
}));

// Import after mocking
import ContactForm from '../../../../src/components/contacts/ContactForm';

const renderWithContext = (ui, contextValue) => {
  return render(
    <MockContactContext.Provider value={contextValue}>
      {ui}
    </MockContactContext.Provider>
  );
};

describe('ContactForm', () => {
  let mockContextValue;

  beforeEach(() => {
    mockContextValue = {
      addContact: mockAddContact,
      updateContact: mockUpdateContact,
      clearCurrent: mockClearCurrent,
      current: null
    };
    jest.clearAllMocks();
  });

  it('renders correctly with initial state', () => {
    const { getByText, getByPlaceholderText } = renderWithContext(<ContactForm />, mockContextValue);
    
    expect(getByText('הוספת איש קשר')).toBeInTheDocument();
    expect(getByPlaceholderText('שם')).toHaveValue('');
    expect(getByPlaceholderText('דוא"ל')).toHaveValue('');
    expect(getByPlaceholderText('טלפון')).toHaveValue('');
    expect(getByText('פרטי')).toBeChecked();
  });

  it('updates state on input change', () => {
    const { getByPlaceholderText } = renderWithContext(<ContactForm />, mockContextValue);
    
    const nameInput = getByPlaceholderText('שם');
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    expect(nameInput).toHaveValue('John Doe');
  });

  it('submits the form with new contact', async () => {
    const { getByPlaceholderText, getByText } = renderWithContext(<ContactForm />, mockContextValue);
    
    fireEvent.change(getByPlaceholderText('שם'), { target: { value: 'John Doe' } });
    fireEvent.change(getByPlaceholderText('דוא"ל'), { target: { value: 'john@example.com' } });
    fireEvent.change(getByPlaceholderText('טלפון'), { target: { value: '1234567890' } });
    
    fireEvent.click(getByText('הוספת איש קשר'));
    
    await waitFor(() => {
      expect(mockAddContact).toHaveBeenCalledWith({
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

    const { getByText, getByPlaceholderText } = renderWithContext(<ContactForm />, mockContextValue);

    expect(getByText('עריכת איש קשר')).toBeInTheDocument();
    expect(getByPlaceholderText('שם')).toHaveValue('Jane Doe');
    
    fireEvent.change(getByPlaceholderText('טלפון'), { target: { value: '1111111111' } });
    fireEvent.click(getByText('עדכון איש קשר'));

    await waitFor(() => {
      expect(mockUpdateContact).toHaveBeenCalledWith({
        ...currentContact,
        phone: '1111111111'
      });
    });
  });

  it('clears the form when clearAll is called', () => {
    mockContextValue.current = { name: 'Test', email: 'test@example.com', phone: '1234567890', type: 'פרטי' };

    const { getByText } = renderWithContext(<ContactForm />, mockContextValue);
    const clearButton = getByText('ניקוי');
    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton);
    expect(mockClearCurrent).toHaveBeenCalled();
  });

  it('changes contact type when radio button is clicked', () => {
    const { getByLabelText } = renderWithContext(<ContactForm />, mockContextValue);
    
    const businessRadio = getByLabelText('עסקי');
    fireEvent.click(businessRadio);
    expect(businessRadio).toBeChecked();

    const privateRadio = getByLabelText('פרטי');
    expect(privateRadio).not.toBeChecked();
  });

  it('prevents form submission with empty name', async () => {
    const { getByText, getByPlaceholderText } = renderWithContext(<ContactForm />, mockContextValue);
    
    fireEvent.change(getByPlaceholderText('דוא"ל'), { target: { value: 'test@example.com' } });
    fireEvent.change(getByPlaceholderText('טלפון'), { target: { value: '1234567890' } });
    
    fireEvent.click(getByText('הוספת איש קשר'));
    
    await waitFor(() => {
      expect(mockAddContact).not.toHaveBeenCalled();
    });
  });

  it('handles form submission when current is null', async () => {
    mockContextValue.current = null;
    const { getByText, getByPlaceholderText } = renderWithContext(<ContactForm />, mockContextValue);

    fireEvent.change(getByPlaceholderText('שם'), { target: { value: 'New Contact' } });
    fireEvent.click(getByText('הוספת איש קשר'));
    
    await waitFor(() => {
      expect(mockAddContact).toHaveBeenCalled();
      expect(mockClearCurrent).toHaveBeenCalled();
    });
  });

  it('renders clear button only when current is not null', () => {
    const { queryByText } = renderWithContext(<ContactForm />, mockContextValue);
    expect(queryByText('ניקוי')).not.toBeInTheDocument();

    mockContextValue.current = { name: 'Test' };
    const { getByText } = renderWithContext(<ContactForm />, mockContextValue);
    expect(getByText('ניקוי')).toBeInTheDocument();
  });
});