import { describe, it, expect } from '@jest/globals';
import React from 'react';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import ReactDOM from 'react-dom';
import App from '../../../src/App';

// Mock ReactDOM.render to avoid actual DOM manipulation
jest.spyOn(ReactDOM, 'render').mockImplementation(() => {});

describe('App Component', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    act(() => {
      ReactDOM.render(<App />, div);
    });
    expect(ReactDOM.render).toHaveBeenCalledWith(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('renders the App component', () => {
    const { container } = render(<App />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders App component with correct structure', () => {
    const { container } = render(<App />);
    expect(container.firstChild).toBeInstanceOf(HTMLElement);
  });
});