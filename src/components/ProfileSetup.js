import { useState } from 'react';
import { auth, firestore } from '../firebase'; // Adjust import paths as per your project setup

const ProfileSetup = () => {
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [genres, setGenres] = useState('');

  const handleProfileSetup = async () => {
    const userId = auth.currentUser.uid;

    try {
      await firestore.collection('users').doc(userId).set({
        displayName: displayName,
        bio: bio,
        genres: genres.split(',').map(genre => genre.trim()),
      }, { merge: true }); // Using merge: true to update existing fields without overwriting

      console.log('Profile updated successfully!');
      // Redirect or handle success as needed
    } catch (error) {
      console.error('Error updating profile:', error);
      // Handle error
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">Profile Setup</h1>
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <label className="block mb-2">
          Display Name
          <input
            type="text"
            className="form-input mt-1 block w-full"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </label>

        <label className="block mb-2 mt-4">
          Bio
          <textarea
            className="form-textarea mt-1 block w-full"
            rows="4"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          ></textarea>
        </label>

        <label className="block mb-2 mt-4">
          Genres (comma-separated)
          <input
            type="text"
            className="form-input mt-1 block w-full"
            value={genres}
            onChange={(e) => setGenres(e.target.value)}
          />
        </label>

        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 hover:bg-blue-600 transition duration-300"
          onClick={handleProfileSetup}
        >
          Save Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileSetup;
