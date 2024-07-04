import React from 'react';

const BookCard = ({ book }) => (
  <div className="bg-dark-800 p-4 rounded-lg shadow flex flex-col sm:flex-row h-full">
    <div className="flex-shrink-0 mb-4 sm:mb-0">
      <img 
        src={book.coverUrl} 
        alt={book.title} 
        className="w-full sm:w-24 h-36 object-cover rounded mx-auto sm:mx-0"
        style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
      />
    </div>
    <div className="sm:ml-4 flex flex-col justify-between flex-grow text-white">
      <div>
        <h3 className="font-semibold text-lg">{book.title}</h3>
        <p className="text-sm text-gray-400">Author: {book.author}</p>
        <p className="text-sm text-gray-400">Publisher: {book.publisher}</p>
        <p className="text-sm text-gray-400 mt-2 line-clamp-2">{book.description || 'No description available'}</p>
      </div>
      {book.progress !== undefined && (
        <div className="mt-2">
          <div className="text-xs text-gray-500 mb-1">Progress: {book.progress}%</div>
          <div className="bg-gray-700 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full" 
              style={{width: `${book.progress}%`}}
            ></div>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default BookCard;
