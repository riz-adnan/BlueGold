import React, { useState } from 'react';
import { auth } from '../firebase'; // Firebase initialized earlier
import { createUserWithEmailAndPassword } from 'firebase/auth';
import ReCAPTCHA from 'react-google-recaptcha';
import VerifyEmail from './VerifyEmail';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaValid, setCaptchaValid] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [userId, setUserId] = useState(null);

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
    setCaptchaValid(!!token); // valid if token is not null
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaValid) {
      alert('Please verify the CAPTCHA.');
      return;
    }

    setLoading(true);

    try {
      // Verify reCAPTCHA with backend
      const recaptchaResponse = await fetch('https://bluegold.onrender.com/verify-captcha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recaptchaToken: captchaToken,
        }),
      });

      const recaptchaResult = await recaptchaResponse.json();

      if (!recaptchaResult.success) {
        alert('reCAPTCHA verification failed');
        setLoading(false);
        return;
      }
      console.log("recaptchaResult",recaptchaResult)

      // Register user with Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("user",user)
      // Call backend to send verification email
      const registerResponse = await fetch('https://bluegold.onrender.com/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const registerResult = await registerResponse.json();

      if (registerResponse.ok) {
        setRegistered(true);
        setUserId(user.uid);
      } else {
        alert(registerResult.error);
      }

    } catch (error) {
      alert('Error: ' + error.message);
    }

    setLoading(false);
  };

  if (registered) {
    return <VerifyEmail userId={userId} />;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <ReCAPTCHA
        sitekey="6LcRMDwqAAAAAJaQ4kyjfqsOFvgJWc1tA9UHiHfP"
        onChange={handleCaptchaChange}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Register'}
      </button>
    </form>
  );
};

export default AuthForm;
