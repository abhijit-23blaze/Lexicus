import React from 'react';

const BookCard = ({ book, toggleFavorite, isFavorite }) => {
  const handleCardClick = () => {
    window.location.href = book.link;
  };

  return (
    <div 
      className="bg-white p-4 rounded-lg shadow flex flex-col h-full relative cursor-pointer" 
      onClick={handleCardClick}
    >
      <div className="flex flex-col sm:flex-row h-full">
        <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4 w-full sm:w-1/3 lg:w-1/4 relative">
          <div className="aspect-[2/3] w-full">
            <img 
              src={book.coverUrl} 
              alt={book.title} 
              className="absolute inset-0 w-full h-full object-cover rounded"
              style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
            />
          </div>
        </div>
        <div className="flex flex-col justify-between flex-grow">
          <div>
            <h3 className="font-semibold text-lg">{book.title}</h3>
            <p className="text-sm text-gray-600">Author: {book.author}</p>
            <p className="text-sm text-gray-600 mt-2 line-clamp-3">{book.description || 'No description available'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;