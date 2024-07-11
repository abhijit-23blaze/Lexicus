import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase'; // Adjust import paths as per your project setup

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = auth.currentUser.uid;
      try {
        const userDoc = await db.collection('users').doc(userId).get();
        if (userDoc.exists) {
          setUserProfile(userDoc.data());
        } else {
          console.log('User profile not found');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleUpdateProfile = async () => {
    const userId = auth.currentUser.uid;

    try {
      await db.collection('users').doc(userId).update({
        bio: 'Updated bio', // Example: Replace with updated bio text
        genres: ['Updated Genre'] // Example: Replace with updated genres array
      });
      console.log('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!userProfile) {
    return <div>Loading...</div>; // Handle loading state if needed
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">Your Profile</h1>
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="flex items-center mb-4">
          <img
            src={userProfile.photoURL || 'https://via.placeholder.com/150'}
            alt="Profile"
            className="w-20 h-20 rounded-full mr-4"
          />
          <div>
            <h2 className="text-2xl font-bold">{userProfile.displayName}</h2>
            <p className="text-gray-600">{userProfile.email}</p>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-bold mb-2">Bio</h3>
          <p>{userProfile.bio || 'No bio provided'}</p>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-2">Genres</h3>
          <ul className="flex flex-wrap gap-2">
            {userProfile.genres && userProfile.genres.map((genre, index) => (
              <li
                key={index}
                className="bg-gray-200 px-2 py-1 rounded-full text-sm"
              >
                {genre}
              </li>
            ))}
          </ul>
        </div>

        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 hover:bg-blue-600 transition duration-300"
          onClick={handleUpdateProfile}
        >
          Update Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;
