import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import Navbar from '../../../../src/components/layout/Navbar';

// Mock the context modules
jest.mock('../../../../src/context/auth/authContext', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: React.createContext({
      isAuthenticated: false,
      logout: jest.fn(),
      user: null
    })
  };
});

jest.mock('../../../../src/context/contact/contactContext', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: React.createContext({
      clearContacts: jest.fn()
    })
  };
});

describe('Navbar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default props', () => {
    render(
      <Router>
        <Navbar />
      </Router>
    );
    expect(screen.getByText('אנשי הקשר שלי')).toBeInTheDocument();
    expect(screen.getByRole('heading').querySelector('i')).toHaveClass('fas fa-id-badge');
  });

  it('renders with custom props', () => {
    render(
      <Router>
        <Navbar title="Custom Title" icon="custom-icon" />
      </Router>
    );
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByRole('heading').querySelector('i')).toHaveClass('custom-icon');
  });

  it('renders guest links when not authenticated', () => {
    render(
      <Router>
        <Navbar />
      </Router>
    );
    expect(screen.getByText('אודות')).toBeInTheDocument();
    expect(screen.getByText('כניסה')).toBeInTheDocument();
    expect(screen.getByText('הרשמה')).toBeInTheDocument();
  });

  it('renders auth links when authenticated', () => {
    jest.spyOn(React, 'useContext').mockImplementation(() => ({
      isAuthenticated: true,
      logout: jest.fn(),
      user: { name: 'Test User' }
    }));

    render(
      <Router>
        <Navbar />
      </Router>
    );
    expect(screen.getByText('שלום Test User')).toBeInTheDocument();
    expect(screen.getByText('אודות')).toBeInTheDocument();
    expect(screen.getByText('יציאה')).toBeInTheDocument();
  });

  it('calls logout and clearContacts when logout is clicked', () => {
    const mockLogout = jest.fn();
    const mockClearContacts = jest.fn();

    jest.spyOn(React, 'useContext')
      .mockImplementationOnce(() => ({
        isAuthenticated: true,
        logout: mockLogout,
        user: { name: 'Test User' }
      }))
      .mockImplementationOnce(() => ({
        clearContacts: mockClearContacts
      }));

    render(
      <Router>
        <Navbar />
      </Router>
    );

    fireEvent.click(screen.getByText('יציאה'));
    expect(mockLogout).toHaveBeenCalled();
    expect(mockClearContacts).toHaveBeenCalled();
  });

  it('renders correct link for home', () => {
    render(
      <Router>
        <Navbar />
      </Router>
    );
    const homeLink = screen.getByRole('link', { name: 'אנשי הקשר שלי' });
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('renders correct link for about page', () => {
    render(
      <Router>
        <Navbar />
      </Router>
    );
    const aboutLink = screen.getByRole('link', { name: 'אודות' });
    expect(aboutLink).toHaveAttribute('href', '/about');
  });

  it('renders login and register links for guests', () => {
    render(
      <Router>
        <Navbar />
      </Router>
    );
    const loginLink = screen.getByRole('link', { name: 'כניסה' });
    const registerLink = screen.getByRole('link', { name: 'הרשמה' });
    expect(loginLink).toHaveAttribute('href', '/login');
    expect(registerLink).toHaveAttribute('href', '/register');
  });

  it('does not render login and register links for authenticated users', () => {
    jest.spyOn(React, 'useContext').mockImplementation(() => ({
      isAuthenticated: true,
      logout: jest.fn(),
      user: { name: 'Test User' }
    }));

    render(
      <Router>
        <Navbar />
      </Router>
    );
    expect(screen.queryByText('כניסה')).not.toBeInTheDocument();
    expect(screen.queryByText('הרשמה')).not.toBeInTheDocument();
  });
});