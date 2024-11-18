import React from 'react';
import ReactDOM from 'react-dom/client';
import { UserProvider } from './UserContext'
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51OCe4mKFcgoflAzwu3LrFejpbmwUG3z2qXESf2bhJcxPrKPLscOThB2ELVGRTn2ycFXOz3nEqaAOGunqHHXu2fwI00cGTZQIQ2')

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider>
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
    </UserProvider>
  </React.StrictMode>
); 

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
