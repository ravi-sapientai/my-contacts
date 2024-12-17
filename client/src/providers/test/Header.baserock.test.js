import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, jest } from '@jest/globals';

// Mock the styled-components
jest.mock('styled-components', () => ({
  __esModule: true,
  default: {
    div: (strings, ...interpolations) => {
      return ({ children, ...props }) => (
        <div data-testid="styled-div" {...props}>
          {children}
        </div>
      );
    },
  },
}));

// Mock the theming module
jest.mock('../../../src/providers/theming', () => ({
  withTheme: (Component) => (props) => {
    const defaultTheme = { textColor: 'black', backgroundColor: 'white' };
    return <Component theme={defaultTheme} {...props} />;
  },
  Theme: {
    textColor: 'black',
    backgroundColor: 'white',
  },
}));

// Import the Header component
import Header from '../../../src/providers/Header';

describe('Header Component', () => {
  it('renders with default theme', () => {
    render(<Header />);
    
    const headerElement = screen.getByTestId('styled-div');
    expect(headerElement).toHaveTextContent('@callstack/react-theme-provider');
    expect(headerElement).toHaveAttribute('textcolor', 'black');
    expect(headerElement).toHaveAttribute('background', 'white');
  });

  it('renders with custom theme', () => {
    const customTheme = { textColor: 'red', backgroundColor: 'blue' };
    render(<Header theme={customTheme} />);
    
    const headerElement = screen.getByTestId('styled-div');
    expect(headerElement).toHaveTextContent('@callstack/react-theme-provider');
    expect(headerElement).toHaveAttribute('textcolor', 'red');
    expect(headerElement).toHaveAttribute('background', 'blue');
  });

  it('applies correct styling', () => {
    const theme = { textColor: 'green', backgroundColor: 'yellow' };
    render(<Header theme={theme} />);
    
    const headerElement = screen.getByTestId('styled-div');
    expect(headerElement).toHaveAttribute('textcolor', 'green');
    expect(headerElement).toHaveAttribute('background', 'yellow');
  });

  it('renders without theme prop', () => {
    render(<Header />);
    
    const headerElement = screen.getByTestId('styled-div');
    expect(headerElement).toBeInTheDocument();
    expect(headerElement).toHaveTextContent('@callstack/react-theme-provider');
    expect(headerElement).toHaveAttribute('textcolor', 'black');
    expect(headerElement).toHaveAttribute('background', 'white');
  });
});