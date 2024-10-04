import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase'; // Ensure auth is correctly imported
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; // Import Firestore functions
import { db } from '../../firebase'; // Ensure db is correctly imported (Firestore instance)
import ReCAPTCHA from 'react-google-recaptcha';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [captchaValid, setCaptchaValid] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
    setCaptchaValid(!!token); // valid if token is not null
  };

  const handleSignUp = async (e) => {
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

      // Register user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user information to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        fullName: fullName,
        email: email,
        wallet_money: 0, // Initial wallet money
        address: "" // Empty address
      });

      // After registration, navigate the user to another page
      localStorage.setItem('BlueGold_uid', user.uid);
      navigate('/');
    } catch (error) {
      alert('Error: ' + error.message);
    }

    setLoading(false);
  };

  return (
    <section className="relative bg-neutral-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-32 pb-12 md:pt-40 md:pb-20">
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
            <h1 className="h1">Welcome to BlueGold</h1>
          </div>

          <div className="max-w-sm mx-auto">
            <form onSubmit={handleSignUp}>
              <div className="flex flex-wrap -mx-3 mb-4">
                <div className="w-full px-3">
                  <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="full-name">Full Name <span className="text-red-600">*</span></label>
                  <input id="full-name" type="text" className="form-input w-full text-gray-300" placeholder="First and last name" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
              </div>
              
              <div className="flex flex-wrap -mx-3 mb-4">
                <div className="w-full px-3">
                  <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="email">Work Email <span className="text-red-600">*</span></label>
                  <input id="email" className="form-input w-full text-gray-300" placeholder="you@yourcompany.com" required value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-4">
                <div className="w-full px-3">
                  <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="password">Password <span className="text-red-600">*</span></label>
                  <input id="password" type="password" className="form-input w-full text-gray-300" placeholder="Password (at least 10 characters)" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
              </div>

              <ReCAPTCHA
                sitekey="6LcRMDwqAAAAAJaQ4kyjfqsOFvgJWc1tA9UHiHfP"
                onChange={handleCaptchaChange}
              />

              <div className="flex flex-wrap -mx-3 mt-6">
                <div className="w-full px-3">
                  <button className="btn text-white rounded-full bg-purple-600 hover:bg-purple-700 w-full" disabled={loading}>Sign up</button>
                </div>
              </div>
            </form>
            <div className="text-gray-400 text-center mt-6">
              Already using Blue Gold? <Link to="/signin" className="text-purple-600 hover:text-gray-200 transition duration-150 ease-in-out">Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
