import React from 'react';
import { auth, googleProvider } from '../firebase'; // Adjust the import path

const SignIn = () => {
  const signInWithGoogle = async () => {
    try {
      const result = await auth.signInWithPopup(googleProvider);
      console.log(result.user);
      window.location.href = '/';
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-4">Sign In</h1>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded-lg"
        onClick={signInWithGoogle}
      >
        Sign In with Google
      </button>
    </div>
  );
};

export default SignIn;
