import React, { useState } from 'react';

const VerifyEmail = ({ userId }) => {
  const [emailSent, setEmailSent] = useState(false);

  const handleSendVerification = async () => {
    try {
      const response = await fetch('https://bluegold.onrender.com/send-verification-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      
      if (response.ok) {
        alert(data.message);
        setEmailSent(true);
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('Error sending verification email');
    }
  };

  return (
    <div>
      <h2>Please verify your email to activate your account</h2>
      <button onClick={handleSendVerification} disabled={emailSent}>
        {emailSent ? 'Verification Email Sent' : 'Resend Verification Email'}
      </button>
    </div>
  );
};

export default VerifyEmail;
