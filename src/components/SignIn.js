// components/SignIn.js
import React from 'react';
import { auth, googleProvider } from '../firebase';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    try {
      await auth.signInWithPopup(googleProvider);
      navigate('/profile-setup');
    } catch (error) {
      console.error('Error signing in with Google', error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <button
        onClick={signInWithGoogle}
        className="bg-blue-500 text-white px-4 py-2 rounded-full"
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default SignIn;
