import { describe, it, expect } from '@jest/globals';
import React from 'react';
import { render } from '@testing-library/react';
import createThemeProvider from '../../../src/providers/createThemeProvider';

describe('createThemeProvider', () => {
  it('should create a ThemeProvider component', () => {
    const defaultTheme = { color: 'blue' };
    const ThemeContext = React.createContext(defaultTheme);
    const ThemeProvider = createThemeProvider(defaultTheme, ThemeContext);

    expect(ThemeProvider).toBeDefined();
    expect(typeof ThemeProvider).toBe('function');
  });

  it('should render children and provide theme through context', () => {
    const defaultTheme = { color: 'blue' };
    const ThemeContext = React.createContext(defaultTheme);
    const ThemeProvider = createThemeProvider(defaultTheme, ThemeContext);

    const TestComponent = () => {
      const theme = React.useContext(ThemeContext);
      return <div data-testid="test-component">{theme.color}</div>;
    };

    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const testComponent = getByTestId('test-component');
    expect(testComponent.textContent).toBe('blue');
  });

  it('should use provided theme when passed as a prop', () => {
    const defaultTheme = { color: 'blue' };
    const customTheme = { color: 'red' };
    const ThemeContext = React.createContext(defaultTheme);
    const ThemeProvider = createThemeProvider(defaultTheme, ThemeContext);

    const TestComponent = () => {
      const theme = React.useContext(ThemeContext);
      return <div data-testid="test-component">{theme.color}</div>;
    };

    const { getByTestId } = render(
      <ThemeProvider theme={customTheme}>
        <TestComponent />
      </ThemeProvider>
    );

    const testComponent = getByTestId('test-component');
    expect(testComponent.textContent).toBe('red');
  });

  it('should use default theme when no theme prop is provided', () => {
    const defaultTheme = { color: 'blue' };
    const ThemeContext = React.createContext(defaultTheme);
    const ThemeProvider = createThemeProvider(defaultTheme, ThemeContext);

    const TestComponent = () => {
      const theme = React.useContext(ThemeContext);
      return <div data-testid="test-component">{theme.color}</div>;
    };

    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const testComponent = getByTestId('test-component');
    expect(testComponent.textContent).toBe('blue');
  });
});