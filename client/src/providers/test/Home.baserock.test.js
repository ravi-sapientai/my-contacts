import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, jest } from '@jest/globals';
import { Home } from '../../../src/providers/Home';
import { ThemeContext } from '../../../src/providers/ThemeContext';

describe('Home Component', () => {
  const mockToggleTheme = jest.fn();

  const renderWithThemeContext = (theme) => {
    return render(
      <ThemeContext.Provider value={{ theme, toggleTheme: mockToggleTheme }}>
        <Home />
      </ThemeContext.Provider>
    );
  };

  it('renders the Home component', () => {
    renderWithThemeContext('light');
    expect(screen.getByText('Home Component')).toBeTruthy();
  });

  it('displays the current theme', () => {
    renderWithThemeContext('dark');
    expect(screen.getByText('Theme: dark')).toBeTruthy();
  });

  it('calls toggleTheme when the button is clicked', () => {
    renderWithThemeContext('light');
    const button = screen.getByText('Switch Theme');
    fireEvent.click(button);
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('updates theme display when context changes', () => {
    const { rerender } = renderWithThemeContext('light');
    expect(screen.getByText('Theme: light')).toBeTruthy();

    rerender(
      <ThemeContext.Provider value={{ theme: 'dark', toggleTheme: mockToggleTheme }}>
        <Home />
      </ThemeContext.Provider>
    );
    expect(screen.getByText('Theme: dark')).toBeTruthy();
  });
});