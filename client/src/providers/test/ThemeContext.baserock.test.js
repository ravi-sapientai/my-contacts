import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import { ThemeProvider, ThemeContext } from '../../../src/providers/ThemeContext';

describe('ThemeProvider', () => {
  it('provides the initial theme value', () => {
    const TestComponent = () => {
      const { theme } = React.useContext(ThemeContext);
      return <div data-testid="theme-value">{theme}</div>;
    };

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-value').textContent).toBe('light');
  });

  it('toggles the theme when toggleTheme is called', () => {
    const TestComponent = () => {
      const { theme, toggleTheme } = React.useContext(ThemeContext);
      return (
        <div>
          <div data-testid="theme-value">{theme}</div>
          <button onClick={toggleTheme}>Toggle Theme</button>
        </div>
      );
    };

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-value').textContent).toBe('light');

    fireEvent.click(screen.getByText('Toggle Theme'));
    expect(screen.getByTestId('theme-value').textContent).toBe('dark');

    fireEvent.click(screen.getByText('Toggle Theme'));
    expect(screen.getByTestId('theme-value').textContent).toBe('light');
  });

  it('provides the theme context to nested components', () => {
    const NestedComponent = () => {
      const { theme } = React.useContext(ThemeContext);
      return <div data-testid="nested-theme-value">{theme}</div>;
    };

    const TestComponent = () => (
      <div>
        <NestedComponent />
      </div>
    );

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('nested-theme-value').textContent).toBe('light');
  });

  it('updates theme context for all consumers when theme changes', () => {
    const ToggleButton = () => {
      const { toggleTheme } = React.useContext(ThemeContext);
      return <button onClick={toggleTheme}>Toggle Theme</button>;
    };

    const ThemeDisplay = () => {
      const { theme } = React.useContext(ThemeContext);
      return <div data-testid="theme-display">{theme}</div>;
    };

    render(
      <ThemeProvider>
        <ToggleButton />
        <ThemeDisplay />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-display').textContent).toBe('light');

    fireEvent.click(screen.getByText('Toggle Theme'));
    expect(screen.getByTestId('theme-display').textContent).toBe('dark');
  });
});