import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [newUsername, setNewUsername] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = auth.currentUser.uid;
      try {
        const userDoc = await getDoc(doc(firestore, 'users', userId));
        if (userDoc.exists()) {
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

  const handleChangeUsername = async () => {
    const userId = auth.currentUser.uid;
    try {
      await updateDoc(doc(firestore, 'users', userId), { username: newUsername });
      setUserProfile(prevProfile => ({ ...prevProfile, username: newUsername }));
      console.log('Username updated successfully');
    } catch (error) {
      console.error('Error updating username:', error);
    }
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
      window.location.href = '/signin';
    });
  };

  if (!userProfile) {
    return <div>Loading...</div>; // Handle loading state if needed
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex justify-end mb-4 space-x-2">
        <button
          className="bg-tahiti hover:bg-tahiti-600 text-black font-bold py-2 px-4 rounded"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <div className="bg-black bg-opacity-30 rounded-lg p-6 backdrop-blur-sm mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          <img
            src={auth.currentUser.photoURL || "/api/placeholder/150/150"}
            alt="Author Profile"
            className="w-32 h-32 rounded-full mb-4 md:mb-0 md:mr-8 border-4 border-tahiti"
          />
          <div className="flex-grow text-center md:text-left">
            <h2 className="font-bold text-2xl mb-2">{userProfile.name || 'Name not set'}</h2>
            <div className="flex justify-center md:justify-start space-x-4 mb-4">
              <div className="text-center">
                <span className="font-bold block text-tahiti">{userProfile.booksCount || 0}</span>
                <span className="text-sm">books</span>
              </div>
              <div className="text-center">
                <span className="font-bold block text-tahiti">{userProfile.readersCount || 0}</span>
                <span className="text-sm">readers</span>
              </div>
            </div>
            <p className="text-sm mb-2">{userProfile.bio || 'Bio not set'}</p>
            <p className="text-sm italic mb-4">"Writing stories that keep you up all night"</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
              {userProfile.genres && userProfile.genres.map((genre, index) => (
                <span key={index} className="bg-midnight bg-opacity-50 text-tahiti text-xs font-semibold px-3 py-1 rounded-full">{genre}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Your Books</h3>
          <button className="bg-tahiti hover:bg-tahiti-600 text-white font-bold py-2 px-4 rounded">
            <i className="fas fa-plus mr-2"></i>Add New Book
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Add book rendering logic here */}
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <input
          type="text"
          placeholder="New Username"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          className="mb-4 px-4 py-2 border rounded"
        />
        <button
          onClick={handleChangeUsername}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Change Username
        </button>
      </div>
    </div>
  );
};

export default Profile;
