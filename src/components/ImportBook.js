import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ImportBook = () => {
  const [bookDetails, setBookDetails] = useState({
    title: '',
    author: '',
    publisher: '',
    description: ''
  });
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Book Details:', bookDetails);
    console.log('File:', file);
    // For now, we'll just go back to the home page
    navigate('/');
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5">Import New Book</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-1">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={bookDetails.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="author" className="block mb-1">Author</label>
          <input
            type="text"
            id="author"
            name="author"
            value={bookDetails.author}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="publisher" className="block mb-1">Publisher</label>
          <input
            type="text"
            id="publisher"
            name="publisher"
            value={bookDetails.publisher}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="description" className="block mb-1">Description</label>
          <textarea
            id="description"
            name="description"
            value={bookDetails.description}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
            rows="3"
          ></textarea>
        </div>
        <div>
          <label htmlFor="file" className="block mb-1">PDF File</label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border rounded"
            accept=".pdf"
            required
          />
        </div>
        <button type="submit" className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700">
          Import Book
        </button>
      </form>
    </div>
  );
};

export default ImportBook;