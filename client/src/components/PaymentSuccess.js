// PaymentSuccess.js
//import React from 'react';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the home page after 5 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);

    // Clean up the timer on component unmount
    return () => clearTimeout(timer);
  }, [navigate]);


  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Payment Successful</h1>
      <p>Thank you for your payment! Your transaction has been completed successfully.</p>
    </div>
  );
};

export default PaymentSuccess;
