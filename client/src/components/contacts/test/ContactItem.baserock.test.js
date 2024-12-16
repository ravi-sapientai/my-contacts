import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContactItem from '../../../../src/components/contacts/ContactItem';

// Mock the ContactContext
jest.mock('../../../../src/context/contact/contactContext', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: React.createContext({
      deleteContact: jest.fn(),
      setCurrent: jest.fn(),
      clearCurrent: jest.fn()
    })
  };
});

describe('ContactItem', () => {
  const mockContact = {
    _id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    type: 'עסקי'
  };

  it('renders contact information correctly', () => {
    render(<ContactItem contact={mockContact} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('עסקי')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('123-456-7890')).toBeInTheDocument();
  });

  it('applies correct badge class based on contact type', () => {
    render(<ContactItem contact={mockContact} />);
    
    const badge = screen.getByText('עסקי');
    expect(badge).toHaveClass('badge-success');
  });

  it('applies correct badge class for non-business type', () => {
    const nonBusinessContact = { ...mockContact, type: 'אישי' };
    render(<ContactItem contact={nonBusinessContact} />);
    
    const badge = screen.getByText('אישי');
    expect(badge).toHaveClass('badge-primary');
  });

  it('calls setCurrent when edit button is clicked', () => {
    const setCurrent = jest.fn();
    jest.spyOn(React, 'useContext').mockImplementation(() => ({
      setCurrent,
      deleteContact: jest.fn(),
      clearCurrent: jest.fn()
    }));

    render(<ContactItem contact={mockContact} />);
    
    fireEvent.click(screen.getByText('עריכה'));
    expect(setCurrent).toHaveBeenCalledWith(mockContact);
  });

  it('calls deleteContact and clearCurrent when delete button is clicked', () => {
    const deleteContact = jest.fn();
    const clearCurrent = jest.fn();
    jest.spyOn(React, 'useContext').mockImplementation(() => ({
      deleteContact,
      clearCurrent,
      setCurrent: jest.fn()
    }));

    render(<ContactItem contact={mockContact} />);
    
    fireEvent.click(screen.getByText('הסר'));
    expect(deleteContact).toHaveBeenCalledWith('1');
    expect(clearCurrent).toHaveBeenCalled();
  });

  it('does not render email if not provided', () => {
    const contactWithoutEmail = { ...mockContact, email: '' };
    render(<ContactItem contact={contactWithoutEmail} />);
    
    expect(screen.queryByText('john@example.com')).not.toBeInTheDocument();
  });

  it('does not render phone if not provided', () => {
    const contactWithoutPhone = { ...mockContact, phone: '' };
    render(<ContactItem contact={contactWithoutPhone} />);
    
    expect(screen.queryByText('123-456-7890')).not.toBeInTheDocument();
  });
});