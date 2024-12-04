import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

import { useRef } from 'react';
import emailjs from '@emailjs/browser';

const PaymentComponent = ({ subtotal, user }) => {
  const form = useRef();
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState(user?.email || '');
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');
	const navigate = useNavigate();

  console.log('User passed to Payment Component: ', user);

  // Handle changes in the card element
  const handlePaymentChange = (e) => {
    setPaymentInfo({ ...paymentInfo, [e.target.name]: e.target.value });
  };

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm('service_qw4tqsp', 'template_2j6o6ua', form.current, {
        publicKey: 'zomtsQF384EML4F90',
      })
      .then(
        () => {
          console.log('SUCCESS!');
          alert('Email Confirmation Sent...');
        },
        (error) => {
          console.log('FAILED...', error.text);
          alert('Error sending Email Confirmation...');
        },
      );
  };

  console.log('User:', user);

  // Handle payment submission
  const handlePay = async (e) => {
    if (!stripe || !elements) {
      alert('Stripe has not loaded yet.');
      return;
    }

    setLoading(true);
    try {
      // Call your backend to create a PaymentIntent
      const { data } = await axios.post('http://localhost:5001/api/create-payment-intent', {
        amount: Math.round(subtotal * 100), // Convert to cents
        currency: 'usd',
        email,
      });
      
      const clientSecret = data.clientSecret;

      // Confirm the payment with Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setMessage(`Payment failed: ${result.error.message}`);
      } else if (result.paymentIntent.status === 'succeeded') {
		  setMessage('Payment successful!');
		  
      sendEmail(e);

		  navigate('/success');
      }
    } catch (error) {
      console.error('Payment Error:', error);
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="invoice">
      <form ref={form}>
      <input type="hidden" name="username" value={user.username} />
      <input type="hidden" name="email" value={user.email}/>
      </form>
      <h3>Invoice</h3>
      <p>
        <FontAwesomeIcon icon={faDollarSign} /> Subtotal: <strong>${subtotal.toFixed(2)}</strong>
      </p>
      <h3>
        <FontAwesomeIcon icon={faCreditCard} /> Payment Information
      </h3>

      {/* Email Input */}
      <div className='form-group'>
        <label>Email Address:</label>
        <input
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Enter your email'
          required
        />
      </div>

      {/* Stripe Card Element */}
      <div className="form-group">
        <label>Card Details:</label>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': { color: '#aab7c4' },
              },
              invalid: { color: '#9e2146' },
					  },
			  hidePostalCode: true
          }}
        />
      </div>

      <button onClick={handlePay} className="pay-button" disabled={loading}>
        {loading ? 'Processing...' : 'Pay'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default PaymentComponent;
