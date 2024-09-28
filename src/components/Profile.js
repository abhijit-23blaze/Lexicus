// Profile.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { signOut, updateProfile } from 'firebase/auth';
import { ChevronLeft, Plus, Edit, LogOut, Book, Users } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const [authorName, setAuthorName] = useState('');
  const [bio, setBio] = useState('');
  const [genres, setGenres] = useState([]);
  const [editing, setEditing] = useState(false);
  const [newAuthorName, setNewAuthorName] = useState('');
  const [newBio, setNewBio] = useState('');
  const [newGenres, setNewGenres] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profileImage, setProfileImage] = useState('');

  const user = auth.currentUser;

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        try {
          const profileDoc = await getDoc(doc(firestore, 'profiles', user.uid));
          if (profileDoc.exists()) {
            const data = profileDoc.data();
            setAuthorName(data.authorName || '');
            setBio(data.bio || '');
            setGenres(data.genre ? data.genre.split(',').map((genre) => genre.trim()) : []);
          }
          
          // Set the profile image URL
          setProfileImage(user.photoURL || '/api/placeholder/200/200');
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
      await updateDoc(doc(firestore, 'profiles', user.uid), {
        authorName: newAuthorName,
        bio: newBio,
        genre: [...genres, newGenres.trim()].join(', '),
      });

      await updateProfile(user, { displayName: newAuthorName });

      setAuthorName(newAuthorName);
      setBio(newBio);
      setGenres([...genres, newGenres.trim()]);
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">You are not logged in</h1>
        <a href="/signin" className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300">
          Sign In
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex mb-8 items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-blue-100 transition duration-300 flex items-center"
          >
            <ChevronLeft className="mr-2" size={20} />
            Back
          </button>
          <div className="flex-grow"></div>
          <button
            onClick={() => navigate('/add-book')}
            className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300 flex items-center"
          >
            <Plus className="mr-2" size={20} />
            New Book
          </button>
          <button
            onClick={() => setEditing(true)}
            className="bg-yellow-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-yellow-600 transition duration-300 flex items-center"
          >
            <Edit className="mr-2" size={20} />
            Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300 flex items-center"
          >
            <LogOut className="mr-2" size={20} />
            Logout
          </button>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-xl mb-12">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <img
              src={profileImage}
              alt="Author Profile"
              className="w-40 h-40 rounded-full mb-6 md:mb-0 md:mr-8 border-4 border-blue-500 shadow-lg object-cover"
            />
            <div className="flex-grow text-center md:text-left">
              <h2 className="font-bold text-3xl mb-4 text-gray-800">{authorName}</h2>
              <div className="flex justify-center md:justify-start space-x-8 mb-6">
                <div className="text-center">
                  <span className="font-bold block text-3xl text-blue-600">5</span>
                  <span className="text-sm uppercase tracking-wide text-gray-600">books</span>
                </div>
                <div className="text-center">
                  <span className="font-bold block text-3xl text-blue-600">10.5K</span>
                  <span className="text-sm uppercase tracking-wide text-gray-600">readers</span>
                </div>
              </div>
              <p className="text-lg mb-4 leading-relaxed text-gray-700">{editing ? (
                <textarea
                  rows="4"
                  value={newBio}
                  onChange={(e) => setNewBio(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-100 rounded-lg text-gray-800 placeholder-gray-500"
                  placeholder="Tell us about yourself..."
                ></textarea>
              ) : bio}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                {genres.map((genre, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-1 rounded-full">
                    {genre}
                  </span>
                ))}
                {editing && (
                  <input
                    type="text"
                    value={newGenres}
                    onChange={(e) => setNewGenres(e.target.value)}
                    className="bg-gray-100 text-gray-800 text-sm font-semibold px-4 py-1 rounded-full placeholder-gray-500"
                    placeholder="Add Genre"
                  />
                )}
                {editing && (
                  <button
                    onClick={() => {
                      setGenres([...genres, newGenres.trim()]);
                      setNewGenres('');
                    }}
                    className="bg-blue-500 text-white text-sm font-semibold px-4 py-1 rounded-full hover:bg-blue-600 transition duration-300"
                  >
                    <Plus className="inline mr-1" size={16} />
                    Add Genre
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Your Books</h3>
            <button
              onClick={() => navigate('/add-book')}
              className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300 flex items-center"
            >
              <Plus className="mr-2" size={20} />
              New Book
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="relative group">
              <img
                src="/api/placeholder/300/400"
                alt="Book Cover"
                className="w-full aspect-[3/4] object-cover rounded-lg shadow-lg transition duration-300 group-hover:opacity-75"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-600 transition duration-300">Edit Book</button>
              </div>
            </div>
            {/* Repeat for other books */}
          </div>
        </div>

        {editing && (
          <button
            onClick={handleSaveChanges}
            className="bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
          >
            Save Changes
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;