const BookCard = React.memo(({ book, toggleFavorite, isFavorite }) => {
  const handleCardClick = useCallback(() => {
    window.open(book.link, '_blank', 'noopener,noreferrer');
  }, [book.link]);

  return (
    <div 
      className="bg-white p-4 rounded-lg shadow flex flex-col h-full relative cursor-pointer" 
      onClick={handleCardClick}
    >
      <div className="flex flex-col h-full">
        <div className="mb-4 w-full aspect-[2/3] relative">
          <img 
            src={book.coverUrl} 
            alt={book.title} 
            className="absolute inset-0 w-full h-full object-cover rounded"
            style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
            loading="lazy"
          />
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
});