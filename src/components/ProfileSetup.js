// ProfileSetup.js
import React, { useState } from 'react';
import { auth, firestore } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const ProfileSetup = () => {
  const [bio, setBio] = useState('');
  const [genres, setGenres] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const user = auth.currentUser;

  const handleProfileSetup = async () => {
    setError('');
    setSuccess('');

    if (!user) {
      setError('User not authenticated.');
      return;
    }

    try {
      // Store bio and genres in Firestore
      const profileData = {
        bio,
        genres: genres.split(',').map((genre) => genre.trim()),
      };

      const docRef = await addDoc(collection(firestore, 'profiles'), {
        userId: user.uid,
        ...profileData,
      });

      console.log('Document written with ID: ', docRef.id);
      setSuccess('Profile setup completed successfully.');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Error updating profile.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h2 className="text-3xl font-bold mb-4">Setup Your Profile</h2>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">Bio</label>
        <textarea
          rows="4"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="Tell us about yourself..."
        ></textarea>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">Genres (comma-separated)</label>
        <input
          type="text"
          value={genres}
          onChange={(e) => setGenres(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="e.g., Mystery, Thriller, Crime Fiction"
        />
      </div>
      <button
        onClick={handleProfileSetup}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
      >
        Save Profile
      </button>
    </div>
  );
};

export default ProfileSetup;
