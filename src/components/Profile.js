import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../firebase';
import { doc, getDoc, updateDoc, query, where, getDocs, collection } from 'firebase/firestore';
import { signOut, updateProfile } from 'firebase/auth';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const user = auth.currentUser;

  useEffect(() => {
    const fetchUsername = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(firestore, 'users', user.uid));
          if (userDoc.exists()) {
            setUsername(userDoc.data().username);
          }
        } catch (error) {
          console.error('Error fetching username:', error);
          setError('Error fetching username.');
        }
      }
    };

    fetchUsername();
  }, [user]);

  const isUsernameUnique = async (username) => {
    const q = query(collection(firestore, 'users'), where('username', '==', username));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
  };

  const handleChangeUsername = async () => {
    setError('');
    setSuccess('');
    if (!newUsername) {
      setError('Username cannot be empty.');
      return;
    }

    try {
      const unique = await isUsernameUnique(newUsername);
      if (!unique) {
        setError('Username already taken.');
        return;
      }

      // Update the user's profile in Firebase Authentication
      await updateProfile(user, { displayName: newUsername });

      // Update the user's profile in Firestore
      await updateDoc(doc(firestore, 'users', user.uid), {
        username: newUsername,
        displayName: newUsername,
      });

      setUsername(newUsername);
      setSuccess('Username updated successfully.');
      setNewUsername('');
    } catch (error) {
      console.error('Error updating username:', error);
      setError('Error updating username.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/signin';
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Error signing out.');
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl mb-4">You are not logged in</h1>
        <a href="/signin" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          Sign In
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <p className="mb-4"><strong>Name:</strong> {user.displayName}</p>
        <p className="mb-4"><strong>Email:</strong> {user.email}</p>
        <p className="mb-4"><strong>Username:</strong> {username}</p>
        <img src={user.photoURL} alt="Profile" className="w-32 h-32 rounded-full mb-4" />
        <input
          type="text"
          placeholder="New Username"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg"
        />
        <button
          onClick={handleChangeUsername}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4"
        >
          Change Username
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
