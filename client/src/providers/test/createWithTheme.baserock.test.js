import { describe, it, expect, jest } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import createWithTheme from '../../../src/providers/createWithTheme';

// Mock dependencies
jest.mock('deepmerge', () => ({
  __esModule: true,
  default: (a, b) => ({ ...a, ...b }),
}));

jest.mock('hoist-non-react-statics', () => ({
  __esModule: true,
  default: (target, source) => target,
}));

describe('createWithTheme', () => {
  const MockThemeProvider = ({ children }) => children;
  const MockThemeContext = React.createContext({ color: 'blue' });

  const withTheme = createWithTheme(MockThemeProvider, MockThemeContext);

  const TestComponent = React.forwardRef(({ theme }, ref) => (
    <div data-testid="test-component" ref={ref}>
      Theme color: {theme.color}
    </div>
  ));

  const ThemedComponent = withTheme(TestComponent);

  it('should pass the theme to the wrapped component', () => {
    render(
      <MockThemeContext.Provider value={{ color: 'red' }}>
        <ThemedComponent />
      </MockThemeContext.Provider>
    );

    expect(screen.getByTestId('test-component')).toHaveTextContent('Theme color: red');
  });

  it('should merge theme from context and props', () => {
    render(
      <MockThemeContext.Provider value={{ color: 'red' }}>
        <ThemedComponent theme={{ fontSize: '16px' }} />
      </MockThemeContext.Provider>
    );

    const component = screen.getByTestId('test-component');
    expect(component).toHaveTextContent('Theme color: red');
  });

  it('should use theme from props if no context is provided', () => {
    render(<ThemedComponent theme={{ color: 'green' }} />);

    expect(screen.getByTestId('test-component')).toHaveTextContent('Theme color: green');
  });

  it('should forward refs to the wrapped component', () => {
    const ref = React.createRef();
    render(<ThemedComponent ref={ref} />);

    expect(ref.current).not.toBeNull();
    expect(ref.current).toHaveAttribute('data-testid', 'test-component');
  });

  it('should have correct displayName', () => {
    expect(ThemedComponent.displayName).toBe('withTheme(ForwardRef)');
  });

  it('should correctly merge themes', () => {
    const ThemedComponentWithMerge = withTheme(({ theme }) => (
      <div data-testid="merge-test">
        Color: {theme.color}, Font Size: {theme.fontSize}
      </div>
    ));

    render(
      <MockThemeContext.Provider value={{ color: 'blue' }}>
        <ThemedComponentWithMerge theme={{ fontSize: '20px' }} />
      </MockThemeContext.Provider>
    );

    const component = screen.getByTestId('merge-test');
    expect(component).toHaveTextContent('Color: blue, Font Size: 20px');
  });
});