import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import ContactFilter from '../../../../src/components/contacts/ContactFilter';
import ContactContext from '../../../../src/context/contact/contactContext';

// Mock the ContactContext
const mockFilterContacts = jest.fn();
const mockClearFilter = jest.fn();
const mockContextValue = {
  filterContacts: mockFilterContacts,
  clearFilter: mockClearFilter,
  filtered: null
};

// Wrap the component with the mocked context
const renderWithContext = (component) => {
  return render(
    <ContactContext.Provider value={mockContextValue}>
      {component}
    </ContactContext.Provider>
  );
};

describe('ContactFilter Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    renderWithContext(<ContactFilter />);
    expect(screen.getByPlaceholderText('חיפוש אנשי קשר...')).toBeInTheDocument();
  });

  it('calls filterContacts when input value changes', () => {
    renderWithContext(<ContactFilter />);
    const input = screen.getByPlaceholderText('חיפוש אנשי קשר...');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(mockFilterContacts).toHaveBeenCalledWith('test');
  });

  it('calls clearFilter when input is cleared', () => {
    renderWithContext(<ContactFilter />);
    const input = screen.getByPlaceholderText('חיפוש אנשי קשר...');
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.change(input, { target: { value: '' } });
    expect(mockClearFilter).toHaveBeenCalled();
  });

  it('clears input when filtered is null', () => {
    const { rerender } = renderWithContext(<ContactFilter />);
    const input = screen.getByPlaceholderText('חיפוש אנשי קשר...');
    fireEvent.change(input, { target: { value: 'test' } });
    
    // Update context value and re-render
    mockContextValue.filtered = null;
    rerender(
      <ContactContext.Provider value={mockContextValue}>
        <ContactFilter />
      </ContactContext.Provider>
    );
    
    expect(input.value).toBe('');
  });
});