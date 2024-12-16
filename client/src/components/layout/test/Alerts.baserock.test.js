import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Alerts from '../../../../src/components/layout/Alerts';
import AlertContext from '../../../../src/context/alert/alertContext';

// Mock the AlertContext
jest.mock('../../../../src/context/alert/alertContext', () => ({
  __esModule: true,
  default: {
    Consumer: ({ children }) => children({ alerts: [] }),
    Provider: ({ children, value }) => <div data-testid="alert-provider">{children(value)}</div>,
  },
}));

const renderWithContext = (component, contextValue) => {
  return render(
    <AlertContext.Provider value={contextValue}>
      {component}
    </AlertContext.Provider>
  );
};

describe('Alerts Component', () => {
  it('renders nothing when there are no alerts', () => {
    renderWithContext(<Alerts />, { alerts: [] });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('renders alerts when they exist', () => {
    const alerts = [
      { id: 1, type: 'success', message: 'Success alert' },
      { id: 2, type: 'danger', message: 'Danger alert' }
    ];
    renderWithContext(<Alerts />, { alerts });

    expect(screen.getAllByRole('alert')).toHaveLength(2);
    expect(screen.getByText('Success alert')).toBeInTheDocument();
    expect(screen.getByText('Danger alert')).toBeInTheDocument();
  });

  it('renders alerts with correct CSS classes', () => {
    const alerts = [
      { id: 1, type: 'success', message: 'Success alert' },
      { id: 2, type: 'danger', message: 'Danger alert' }
    ];
    renderWithContext(<Alerts />, { alerts });

    const successAlert = screen.getByText('Success alert').closest('div');
    const dangerAlert = screen.getByText('Danger alert').closest('div');

    expect(successAlert).toHaveClass('alert alert-success');
    expect(dangerAlert).toHaveClass('alert alert-danger');
  });

  it('renders alerts with info icon', () => {
    const alerts = [
      { id: 1, type: 'info', message: 'Info alert' }
    ];
    renderWithContext(<Alerts />, { alerts });

    const infoIcon = screen.getByTestId('info-icon');
    expect(infoIcon).toBeInTheDocument();
    expect(infoIcon).toHaveClass('fas fa-info-circle');
  });
});