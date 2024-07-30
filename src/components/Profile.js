// Profile.js
import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { signOut, updateProfile } from 'firebase/auth';

const Profile = () => {
  const [bio, setBio] = useState('');
  const [genres, setGenres] = useState([]);
  const [editing, setEditing] = useState(false);
  const [newBio, setNewBio] = useState('');
  const [newGenres, setNewGenres] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const user = auth.currentUser;

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        try {
          const profileDoc = await getDoc(doc(firestore, 'profiles', user.uid));
          if (profileDoc.exists()) {
            const data = profileDoc.data();
            setBio(data.bio || '');
            setGenres(data.genres || []);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          setError('Error fetching profile.');
        }
      }
    };

    fetchProfileData();
  }, [user]);

  const handleSaveChanges = async () => {
    setError('');
    setSuccess('');

    try {
      // Update bio and genres in Firestore
      await updateDoc(doc(firestore, 'profiles', user.uid), {
        bio: newBio,
        genres: newGenres.split(',').map((genre) => genre.trim()),
      });

      // Update bio in Firebase Authentication
      await updateProfile(user, { displayName: newBio });

      setBio(newBio);
      setGenres(newGenres.split(',').map((genre) => genre.trim()));
      setEditing(false);
      setSuccess('Profile updated successfully.');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Error updating profile.');
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
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex justify-end mb-4 space-x-2">
        <button
          onClick={() => setEditing(true)}
          className="bg-tahiti hover:bg-tahiti-600 text-black font-bold py-2 px-4 rounded"
        >
          <i className="fas fa-edit mr-2"></i>Edit Profile
        </button>
        <button
          onClick={handleLogout}
          className="bg-tahiti hover:bg-tahiti-600 text-black font-bold py-2 px-4 rounded"
        >
          <i className="fas fa-sign-out-alt mr-2"></i>Logout
        </button>
      </div>

      <div className="bg-black bg-opacity-30 rounded-lg p-6 backdrop-blur-sm mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          <img
            src="/api/placeholder/150/150"
            alt="Author Profile"
            className="w-32 h-32 rounded-full mb-4 md:mb-0 md:mr-8 border-4 border-tahiti"
          />
          <div className="flex-grow text-center md:text-left">
            <h2 className="font-bold text-2xl mb-2">{user.displayName}</h2>
            <div className="flex justify-center md:justify-start space-x-4 mb-4">
              <div className="text-center">
                <span className="font-bold block text-tahiti">5</span>
                <span className="text-sm">books</span>
              </div>
              <div className="text-center">
                <span className="font-bold block text-tahiti">10.5K</span>
                <span className="text-sm">readers</span>
              </div>
            </div>
            <p className="text-sm mb-2">{editing ? (
              <textarea
                rows="4"
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Tell us about yourself..."
              ></textarea>
            ) : bio}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
              {genres.map((genre, index) => (
                <span key={index} className="bg-midnight bg-opacity-50 text-tahiti text-xs font-semibold px-3 py-1 rounded-full">
                  {genre}
                </span>
              ))}
              {editing && (
                <input
                  type="text"
                  value={newGenres}
                  onChange={(e) => setNewGenres(e.target.value)}
                  className="bg-transparent text-white text-xs font-semibold px-3 py-1 rounded-full"
                  placeholder="Add Genre"
                />
              )}
              {editing && (
                <button
                  onClick={() => {
                    setGenres([...genres, newGenres.trim()]);
                    setNewGenres('');
                  }}
                  className="bg-tahiti text-white text-xs font-semibold px-3 py-1 rounded-full hover:bg-tahiti-600"
                >
                  <i className="fas fa-plus mr-1"></i>Add Genre
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Your Books</h3>
          {/* <button className="bg-tahiti hover:bg-tahiti-600 text-white font-bold py-2 px-4 rounded">
            <i className="fas fa-plus mr-2"></i>Add New Book
          </button> */}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="relative group">
            <img
              src="/api/placeholder/300/400"
              alt="Book Cover"
              className="w-full aspect-[3/4] object-cover rounded-lg shadow-lg transition duration-300 group-hover:opacity-75"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
              <button className="bg-tahiti text-white px-3 py-1 rounded-full text-sm">Edit Book</button>
            </div>
          </div>
          {/* Repeat for other books */}
        </div>
      </div>

      {editing && (
        <button
          onClick={handleSaveChanges}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Save Changes
        </button>
      )}
    </div>
  );
};

export default Profile;
