import React from 'react';

const BookCard = ({ book, toggleFavorite, isFavorite }) => {

  const handleCardClick = () => {
    window.location.href = book.link;
  };

  return (
    <div 
      className="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row h-full relative cursor-pointer" 
      onClick={handleCardClick}
    >
      <div className="flex-shrink-0 mb-4 sm:mb-0">
        <img 
          src={book.coverUrl} 
          alt={book.title} 
          className="w-full sm:w-24 h-36 object-cover rounded mx-auto sm:mx-0"
          style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
        />
      </div>
      <div className="sm:ml-4 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="font-semibold text-lg">{book.title}</h3>
          <p className="text-sm text-gray-600">Author: {book.author}</p>
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{book.description || 'No description available'}</p>
        </div>
      </div>
      {/* Uncomment the favorite button if needed */}
      {/* <button 
        className="absolute top-4 right-4 text-gray-600"
        onClick={(e) => {
          e.stopPropagation(); 
          toggleFavorite(book.id);
        }}
      >
        <BookAIcon size={24} className={isFavorite ? 'text-red-500' : 'text-green-400'} />
      </button> */}
    </div>
  );
};

export default BookCard;
