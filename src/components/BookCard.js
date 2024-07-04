import React from 'react';

const BookCard = ({ book }) => (
  <div className="bg-white p-4 rounded-lg shadow flex">
    <div className="flex-shrink-0">
      <img 
        src={book.coverUrl} 
        alt={book.title} 
        className="w-24 h-36 object-cover rounded"
        style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
      />
    </div>
    <div className="ml-4 flex flex-col justify-between flex-grow">
      <div>
        <h3 className="font-semibold text-lg">{book.title}</h3>
        <p className="text-sm text-gray-600">Author: {book.author}</p>
        <p className="text-sm text-gray-600">Publisher: {book.publisher}</p>
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{book.description || 'No description available'}</p>
      </div>
      {book.progress !== undefined && (
        <div className="mt-2">
          <div className="text-xs text-gray-500 mb-1">Progress: {book.progress}%</div>
          <div className="bg-gray-200 rounded-full h-2">
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