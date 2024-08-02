// components/AddBook.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { BlobServiceClient } from '@azure/storage-blob'; // Import Azure Blob Service Client

const AZURE_STORAGE_CONNECTION_STRING = 'your-azure-connection-string'; // Replace with your Azure connection string

const AddBook = () => {
  const [bookName, setBookName] = useState('');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user) {
      setError('User is not logged in.');
      return;
    }

    if (!pdfFile) {
      setError('No file selected.');
      return;
    }

    try {
      const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
      const containerClient = blobServiceClient.getContainerClient('your-container-name'); // Replace with your container name
      const blobName = `${Date.now()}-${pdfFile.name}`;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      await blockBlobClient.uploadData(pdfFile, {
        blobHTTPHeaders: { blobContentType: pdfFile.type },
      });

      // Optionally, store book details in Firestore
      // await setDoc(doc(collection(firestore, 'books'), bookId), {
      //   name: bookName,
      //   genre,
      //   description,
      //   pdfUrl: blockBlobClient.url,
      //   userId: user.uid,
      // });

      setSuccess('Book uploaded successfully.');
      navigate('/'); // Redirect to main page
    } catch (error) {
      console.error('Error uploading book:', error);
      setError('Error uploading book.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl mb-4">Add a New Book</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Book Name</label>
          <input
            type="text"
            value={bookName}
            onChange={(e) => setBookName(e.target.value)}
            className="w-full px-4 py-2 mt-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Genre</label>
          <input
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full px-4 py-2 mt-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 mt-2 border rounded-lg"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">PDF File</label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full px-4 py-2 mt-2 border rounded-lg"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg">
          Upload Book
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {success && <p className="text-green-500 mt-4">{success}</p>}
      </form>
    </div>
  );
};

export default AddBook;
