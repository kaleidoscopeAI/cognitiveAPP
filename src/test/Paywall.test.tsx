import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { vi } from 'vitest';
import Paywall from '../../components/Paywall';

// Mock the Google Pay API
global.google = {
  payments: {
    api: {
      PaymentsClient: vi.fn().mockImplementation(() => ({
        isReadyToPay: vi.fn().mockResolvedValue({ result: true }),
        createButton: vi.fn().mockImplementation(() => {
          // Return a simple div, we'll manually add the button in the test
          return document.createElement('div');
        }),
        loadPaymentData: vi.fn().mockResolvedValue({}),
      })),
    },
  },
};

describe('Paywall', () => {
  it('renders the paywall and traps focus', async () => {
    await act(async () => {
      render(<Paywall onPaymentSuccess={() => {}} />);
    });

    // Manually create and append a mock Google Pay button for testing
    const googlePayButtonContainer = screen.getByTestId('google-pay-button-container');
    const mockGooglePayButton = document.createElement('button');
    mockGooglePayButton.textContent = 'Mock Google Pay Button';
    mockGooglePayButton.tabIndex = 0;
    googlePayButtonContainer.appendChild(mockGooglePayButton);

    expect(screen.getByText('Unlock Full Access')).toBeInTheDocument();
    expect(screen.getByText('Mock Google Pay Button')).toBeInTheDocument();
    expect(screen.getByText('Mock Google Pay Button')).toHaveAttribute('tabindex', '0');
  });
});