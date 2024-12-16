import * as React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Contacts from '../../../../src/components/contacts/Contacts';

// Mock the dependencies
jest.mock('react-transition-group', () => ({
  TransitionGroup: ({ children }) => <div data-testid="transition-group">{children}</div>,
  CSSTransition: ({ children }) => <div data-testid="css-transition">{children}</div>
}));

jest.mock('../../../context/contact/contactContext', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: React.createContext(null)
  };
});

jest.mock('../../layout/Spinner', () => ({
  __esModule: true,
  default: () => <div data-testid="spinner">Loading...</div>
}));

jest.mock('../ContactItem', () => ({
  __esModule: true,
  default: ({ contact }) => <div data-testid="contact-item">{contact.name}</div>
}));

const mockGetContacts = jest.fn();
const mockUseContext = jest.fn();

describe('Contacts Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    React.useContext = mockUseContext;
  });

  it('renders Spinner when loading', () => {
    mockUseContext.mockReturnValue({
      contacts: null,
      filtered: null,
      getContacts: mockGetContacts,
      loading: true
    });

    render(<Contacts />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders message when no contacts and not loading', () => {
    mockUseContext.mockReturnValue({
      contacts: [],
      filtered: null,
      getContacts: mockGetContacts,
      loading: false
    });

    render(<Contacts />);
    expect(screen.getByText('נא להוסיף אנשי קשר')).toBeInTheDocument();
  });

  it('renders contacts when available', () => {
    const mockContacts = [
      { _id: '1', name: 'John Doe' },
      { _id: '2', name: 'Jane Doe' }
    ];
    mockUseContext.mockReturnValue({
      contacts: mockContacts,
      filtered: null,
      getContacts: mockGetContacts,
      loading: false
    });

    render(<Contacts />);
    expect(screen.getByTestId('transition-group')).toBeInTheDocument();
    expect(screen.getAllByTestId('contact-item')).toHaveLength(2);
  });

  it('renders filtered contacts when available', () => {
    const mockContacts = [
      { _id: '1', name: 'John Doe' },
      { _id: '2', name: 'Jane Doe' }
    ];
    const mockFiltered = [{ _id: '1', name: 'John Doe' }];
    mockUseContext.mockReturnValue({
      contacts: mockContacts,
      filtered: mockFiltered,
      getContacts: mockGetContacts,
      loading: false
    });

    render(<Contacts />);
    expect(screen.getByTestId('transition-group')).toBeInTheDocument();
    expect(screen.getAllByTestId('contact-item')).toHaveLength(1);
  });

  it('calls getContacts on mount', () => {
    mockUseContext.mockReturnValue({
      contacts: [],
      filtered: null,
      getContacts: mockGetContacts,
      loading: false
    });

    render(<Contacts />);
    expect(mockGetContacts).toHaveBeenCalledTimes(1);
  });
});