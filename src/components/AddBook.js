import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, firestore, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const AddBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('Empty');
  const [shelf, setShelf] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handlePdfChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleCoverChange = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    const user = auth.currentUser;

    if (!user) {
      setError('User is not logged in.');
      setIsLoading(false);
      return;
    }

    if (!pdfFile || !coverImage) {
      setError('Both PDF file and cover image are required.');
      setIsLoading(false);
      return;
    }

    try {
      // Upload cover image to Firebase Storage
      const coverImageRef = ref(storage, `covers/${user.uid}/${Date.now()}-${coverImage.name}`);
      await uploadBytes(coverImageRef, coverImage);
      const coverImageUrl = await getDownloadURL(coverImageRef);

      // Upload PDF file
      const formData = new FormData();
      formData.append('pdfFile', pdfFile);
      formData.append('title', title);
      formData.append('author', author);
      formData.append('genre', genre);
      formData.append('description', description);
      formData.append('userId', user.uid);

      const response = await fetch('http://localhost:3001/api/upload-book', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload book');
      }

      const data = await response.json();
      const pdfFilePath = data.pdfUrl.split('/PDFs/')[1];
      const pdfUrl = `https://lexicus.z29.web.core.windows.net/external/pdf/web/viewer.html?file=PDFs/${pdfFilePath}`;

      // Store book details in Firestore
      const bookId = Date.now().toString();
      await setDoc(doc(firestore, 'books', bookId), {
        title,
        author,
        coverUrl: coverImageUrl, // Use Firebase Storage URL here
        description,
        shelf,
        link: pdfUrl,
        userId: user.uid,
        views: 0,
        uploadTime: serverTimestamp(),
      });

      setSuccess('Book uploaded successfully.');
      setTimeout(() => navigate('/'), 2000); // Redirect after 2 seconds
    } catch (error) {
      console.error('Error uploading book:', error);
      setError(`Error uploading book: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl mb-4 font-bold">Add a New Book</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Genre</label>
          <input
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Description</label>
          <textarea
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Shelf</label>
          <input
            type="text"
            value={shelf}
            onChange={(e) => setShelf(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">PDF File</label>
          <input
            type="file"
            accept=".pdf"
            onChange={handlePdfChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Cover Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          disabled={isLoading}
        >
          {isLoading ? 'Uploading...' : 'Upload Book'}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {success && <p className="text-green-500 mt-4">{success}</p>}
      </form>
    </div>
  );
};

export default AddBook;
