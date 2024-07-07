import React from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

const SignIn = () => {
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log(result.user);
      // Redirect to profile setup if user doesn't have a username
      if (!result.user.displayName) {
        window.location.href = '/profile-setup';
      } else {
        window.location.href = '/';
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
      <div className="bg-white text-black p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-center">Welcome to Lexicus</h1>
        <p className="mb-6 text-center">Sign in to start reading and publishing amazing books</p>
        <button
          className="flex items-center bg-red-500 text-white px-6 py-3 rounded-lg shadow hover:bg-red-600 transition duration-300"
          onClick={signInWithGoogle}
        >
          <svg className="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#4285F4" d="M24 9.5c3.49 0 6.39 1.43 8.39 3.72l6.29-6.29C34.79 3.72 29.74 1 24 1 14.54 1 6.71 6.74 3.21 15.26l7.43 5.76C11.83 14.42 17.51 9.5 24 9.5z"/><path fill="#34A853" d="M46.26 24.62c-.55-1.87-1.49-3.63-2.8-5.11L37.4 22c.46.87.82 1.78 1.07 2.7.35 1.32.53 2.69.53 4.05s-.18 2.73-.53 4.05c-.25.92-.61 1.83-1.07 2.7l6.05 2.48c1.31-1.48 2.25-3.24 2.8-5.11.36-1.23.56-2.51.56-3.82s-.2-2.59-.56-3.82z"/><path fill="#FBBC05" d="M24 46c5.74 0 10.79-2.72 14.31-7.11l-6.29-6.29C30.39 35.07 27.49 36.5 24 36.5c-6.49 0-12.17-4.92-13.36-11.52l-7.43 5.76C6.71 41.26 14.54 46 24 46z"/><path fill="#EA4335" d="M5.21 10.5l7.43 5.76c1.19-6.6 6.87-11.52 13.36-11.52 3.49 0 6.39 1.43 8.39 3.72l6.29-6.29C34.79 3.72 29.74 1 24 1 14.54 1 6.71 6.74 3.21 15.26l7.43 5.76C11.83 14.42 17.51 9.5 24 9.5z"/></svg>
          Sign In with Google
        </button>
      </div>
    </div>
  );
};

export default SignIn;
