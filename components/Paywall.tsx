import React, { useState, useEffect, useRef } from 'react';
import FocusTrap from 'focus-trap-react';
import { Icon } from './Icons';

interface PaywallProps {
  onPaymentSuccess: () => void;
}

const Paywall: React.FC<PaywallProps> = ({ onPaymentSuccess }) => {
  const googlePayButtonContainerRef = useRef<HTMLDivElement>(null);
  const [isGooglePayReady, setIsGooglePayReady] = useState(false);

  useEffect(() => {
    if (!window.google) return; // Ensure Google Pay API is loaded

    const paymentsClient = new google.payments.api.PaymentsClient({ environment: 'TEST' });

    const baseRequest = {
      apiVersion: 2,
      apiVersionMinor: 0
    };

    const allowedPaymentMethods = ['CARD', 'TOKENIZED_CARD'];
    const allowedCardNetworks = ["AMEX", "DISCOVER", "INTERAC", "JCB", "MASTERCARD", "VISA"];

    const tokenizationSpecification = {
      type: 'PAYMENT_GATEWAY',
      parameters: {
        'gateway': 'example',
        'gatewayMerchantId': 'exampleGatewayMerchantId'
      }
    };

    const baseCardPaymentMethod = {
      type: 'CARD',
      parameters: {
        allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
        allowedCardNetworks: allowedCardNetworks
      }
    };

    const cardPaymentMethod = Object.assign(
      {},
      baseCardPaymentMethod,
      {
        tokenizationSpecification: tokenizationSpecification
      }
    );

    paymentsClient.isReadyToPay(Object.assign({}, baseRequest, { allowedPaymentMethods: [baseCardPaymentMethod] }))
      .then(function(response) {
        if (response.result) {
          setIsGooglePayReady(true);
          const button = paymentsClient.createButton({ onClick: onGooglePayClicked });
          if (googlePayButtonContainerRef.current) {
            googlePayButtonContainerRef.current.appendChild(button);
          }
        }
      })
      .catch(function(err) {
        console.error(err);
      });

    function onGooglePayClicked() {
      const paymentDataRequest = Object.assign({}, baseRequest);
      paymentDataRequest.allowedPaymentMethods = [cardPaymentMethod];
      paymentDataRequest.transactionInfo = {
        totalPriceStatus: 'FINAL',
        totalPrice: '1.00',
        currencyCode: 'USD',
        countryCode: 'US'
      };

      paymentDataRequest.merchantInfo = {
        merchantName: 'Example Merchant'
      };

      paymentsClient.loadPaymentData(paymentDataRequest)
        .then(function(paymentData) {
          console.log('Payment successful: ', paymentData);
          onPaymentSuccess();
        })
        .catch(function(err) {
          console.error(err);
        });
    }
  }, [onPaymentSuccess]);

  const paywallContent = (
    <div className="bg-stone-900 border-2 border-violet-700/50 rounded-2xl p-8 max-w-md text-center shadow-2xl shadow-violet-500/20">
      <Icon name="brainCircuit" className="w-20 h-20 text-violet-400 mx-auto mb-4" />
      <h2 className="text-3xl font-extrabold text-white mb-2">Unlock Full Access</h2>
      <p className="text-gray-400 mb-6">To continue, please complete the one-time activation fee. This supports our ongoing research and development.</p>
      {!isGooglePayReady && <p className="text-gray-500">Loading Google Pay...</p>}
      <div ref={googlePayButtonContainerRef} id="google-pay-button-container" data-testid="google-pay-button-container"></div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50">
      <FocusTrap active={isGooglePayReady}> {/* Activate trap only when button is ready */}
        <div className="bg-stone-900 border-2 border-violet-700/50 rounded-2xl p-8 max-w-md text-center shadow-2xl shadow-violet-500/20">
          <Icon name="brainCircuit" className="w-20 h-20 text-violet-400 mx-auto mb-4" />
          <h2 className="text-3xl font-extrabold text-white mb-2">Unlock Full Access</h2>
          <p className="text-gray-400 mb-6">To continue, please complete the one-time activation fee. This supports our ongoing research and development.</p>
          {isGooglePayReady ? (
            <div ref={googlePayButtonContainerRef} id="google-pay-button-container" data-testid="google-pay-button-container"></div>
          ) : (
            <p className="text-gray-500">Loading Google Pay...</p>
          )}
        </div>
      </FocusTrap>
    </div>
  );
};

export default Paywall;