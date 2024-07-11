import React, { useState } from 'react';
import { auth, firestore } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

const ProfileSetup = () => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [genres, setGenres] = useState('');
  const [username, setUsername] = useState('');

  const handleProfileSetup = async () => {
    const userId = auth.currentUser.uid;

    try {
      await auth.currentUser.updateProfile({ displayName: name });
      await setDoc(doc(firestore, 'users', userId), {
        name,
        bio,
        genres: genres.split(',').map(genre => genre.trim()),
        username,
      });
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-4">Profile Setup</h1>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-4 px-4 py-2 border rounded"
      />
      <input
        type="text"
        placeholder="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        className="mb-4 px-4 py-2 border rounded"
      />
      <input
        type="text"
        placeholder="Genres (comma separated)"
        value={genres}
        onChange={(e) => setGenres(e.target.value)}
        className="mb-4 px-4 py-2 border rounded"
      />
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="mb-4 px-4 py-2 border rounded"
      />
      <button
        onClick={handleProfileSetup}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        Save Profile
      </button>
    </div>
  );
};

export default ProfileSetup;
