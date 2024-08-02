import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BlobServiceClient } from '@azure/storage-blob';
import { doc, setDoc } from 'firebase/firestore';
import { auth, firestore } from './firebaseConfig'; // Ensure this import is correct

const AZURE_STORAGE_CONNECTION_STRING = 'DefaultEndpointsProtocol=https;AccountName=lexicus;AccountKey=oX+FMXctw0yCbjk6TNfCRpIrZ3mUz/zLe350thDo9U4MtMIDFwcsb2nDA1UOWQUauS1WWooA6Sm/+AStni7X/A==;EndpointSuffix=core.windows.net'; // Replace with your Azure connection string


const AddBook = () => {
  const [bookName, setBookName] = useState('');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
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

    if (!pdfFile) {
      setError('No file selected.');
      setIsLoading(false);
      return;
    }

    try {
      if (!AZURE_STORAGE_CONNECTION_STRING) {
        throw new Error('Azure Storage connection string is not configured.');
      }

      const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
      const containerClient = blobServiceClient.getContainerClient('$web'); // Replace with your container name
      const blobName = `external/pdf/web/PDFs/${Date.now()}-${pdfFile.name}`;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      // Upload file to Azure Blob Storage
      await blockBlobClient.uploadData(pdfFile, {
        blobHTTPHeaders: { blobContentType: pdfFile.type },
      });

      // Store book details in Firestore
      const bookId = Date.now().toString();
      await setDoc(doc(firestore, 'books', bookId), {
        name: bookName,
        genre,
        description,
        pdfUrl: blockBlobClient.url,
        userId: user.uid,
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
          <label className="block text-gray-700 mb-2">Book Name</label>
          <input
            type="text"
            value={bookName}
            onChange={(e) => setBookName(e.target.value)}
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
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">PDF File</label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
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