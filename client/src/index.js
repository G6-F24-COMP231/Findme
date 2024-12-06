import React from 'react';
import ReactDOM from 'react-dom/client';
import { UserProvider } from './UserContext'
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import GoogleMapsWrapper from './components/GoogleMapsWrapper';

const stripePromise = loadStripe('pk_test_51OCe4mKFcgoflAzwu3LrFejpbmwUG3z2qXESf2bhJcxPrKPLscOThB2ELVGRTn2ycFXOz3nEqaAOGunqHHXu2fwI00cGTZQIQ2')


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider>
      <Elements stripe={stripePromise}>
        <GoogleMapsWrapper>
          <App />
        </GoogleMapsWrapper>
      </Elements>
    </UserProvider>
  </React.StrictMode>
); 


reportWebVitals();
