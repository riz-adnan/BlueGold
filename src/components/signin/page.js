import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import ReCAPTCHA from 'react-google-recaptcha'; // Import reCAPTCHA

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState(null); // For reCAPTCHA token
  const [errorMessage, setErrorMessage] = useState('');
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();
  // Handle reCAPTCHA
  const handleRecaptcha = (token) => {
    setRecaptchaToken(token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recaptchaToken) {
      setErrorMessage('Please complete the reCAPTCHA');
      return;
    }

    try {
      // Step 1: Verify reCAPTCHA with the backend
      const verifyCaptchaResponse = await fetch('https://bluegold.onrender.com/verify-captcha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recaptchaToken }),
      });

      const captchaResult = await verifyCaptchaResponse.json();
      if (!captchaResult.success) {
        setErrorMessage('reCAPTCHA verification failed.');
        return;
      }

      // Step 2: Proceed with Firebase sign-in
      console.log('Signing in with email and password...');
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      console.log('User signed in successfully:', user);
      if (user) {

        localStorage.setItem('BlueGold_uid', user.uid);
        console.log('User signed in successfully');
      }
    } catch (error) {
      setErrorMessage(error.message || 'Error signing in.');
      console.error('Sign-in error:', error);
    }
    console.log('Sign-in process completed');
    navigate('/');
  };

  return (
    <>
      <section className="relative bg-neutral-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="pt-32 pb-12 md:pt-40 md:pb-20">
            <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
              <h1 className="h1">Welcome back. We exist to make entrepreneurship easier.</h1>
            </div>

            <div className="max-w-sm mx-auto">
              <form onSubmit={handleSubmit}>
                <div className="flex flex-wrap -mx-3 mb-4">
                  <div className="w-full px-3">
                    <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="email">Email</label>
                    <input
                      id="email"
                      type="email"
                      className="form-input w-full text-gray-300"
                      placeholder="you@yourcompany.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-4">
                  <div className="w-full px-3">
                    <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="password">Password</label>
                    <input
                      id="password"
                      type="password"
                      className="form-input w-full text-gray-300"
                      placeholder="Password (at least 10 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* reCAPTCHA widget */}
                <div className="mb-4">
                  <ReCAPTCHA
                    sitekey="6LcRMDwqAAAAAJaQ4kyjfqsOFvgJWc1tA9UHiHfP" // Replace with your actual site key
                    onChange={handleRecaptcha}
                  />
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <div className="text-red-500 mb-4">
                    {errorMessage}
                  </div>
                )}

                <div className="flex flex-wrap -mx-3 mt-6">
                  <div className="w-full px-3">
                    <button type="submit" className="btn text-white rounded-full bg-purple-600 hover:bg-purple-700 w-full">
                      Sign in
                    </button>
                  </div>
                </div>
              </form>

              <div className="text-gray-400 text-center mt-6">
                Don’t you have an account? <Link to="/signup" className="text-purple-600 hover:text-gray-200 transition duration-150 ease-in-out">Sign In</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
