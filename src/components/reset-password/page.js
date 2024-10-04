import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResetPassword = (e) => {
    e.preventDefault();
    const auth = getAuth();

    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Email sent
        setMessage('Password reset email sent! Please check your inbox.');
        setError('');
      })
      .catch((error) => {
        // Error occurred
        setMessage('');
        setError('Failed to send password reset email. Please check your email address and try again.');
        console.error('Error resetting password:', error);
      });
  };

  return (
    <section className="relative bg-neutral-900 h-[100vh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-32 pb-12 md:pt-40 md:pb-20">
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
            <h1 className="h1 mb-4">Forgot your password?</h1>
            <p className="text-xl text-gray-400">We'll email you instructions on how to reset it.</p>
          </div>

          <div className="max-w-sm mx-auto">
            {message && <p className="text-green-500 mb-4">{message}</p>}
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleResetPassword}>
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
              <div className="flex flex-wrap -mx-3 mt-6">
                <div className="w-full px-3">
                  <button type="submit" className="btn text-white bg-purple-600 hover:bg-purple-700 w-full">
                    Reset Password
                  </button>
                </div>
              </div>
            </form>
            <div className="text-gray-400 text-center mt-6">
              <Link to="/signin" className="text-purple-600 rounded-full hover:text-gray-200 transition duration-150 ease-in-out">
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
