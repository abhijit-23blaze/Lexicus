import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { Search, Menu, Settings, Folder, Home, Heart, Lightbulb, BookOpen, Trash, X } from 'lucide-react';
import ImportBook from './components/ImportBook';
import BookCard from './components/BookCard';
import booksData from './data/books.json'; // Import the JSON file

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  
  return (
    <header className="flex items-center justify-between p-4 bg-white">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="mr-4 text-gray-600 lg:hidden">
          <Menu size={24} />
        </button>
        <h1 className="text-2xl font-semibold">Lexicus</h1>
      </div>
      <div className="flex-1 mx-8 hidden md:block">
        <div className="relative">
          <input
            type="text"
            placeholder="Search my library"
            className="w-full py-2 px-4 bg-purple-100 rounded-full text-sm"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      <div className="flex items-center">
        <Settings className="mr-4 text-gray-600 hidden sm:block" />
        <Folder className="mr-4 text-gray-600 hidden sm:block" />
        <button 
          className="bg-purple-600 text-white px-4 py-2 rounded-md"
          onClick={() => navigate('/import')}
        >
          Import
        </button>
      </div>
    </header>
  );
};

const Sidebar = ({ isOpen, toggleSidebar, setShelf }) => (
  <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white p-4 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0`}>
    <button onClick={toggleSidebar} className="absolute top-4 right-4 text-gray-600 lg:hidden">
      <X size={24} />
    </button>
    <nav className="mt-8 lg:mt-0">
      <ul>
        <li className="mb-2"><button onClick={() => setShelf('books')} className="flex items-center text-purple-600 font-semibold"><Home className="mr-2" /> Books</button></li>
        <li className="mb-2"><button onClick={() => setShelf('favorites')} className="flex items-center text-gray-600"><Heart className="mr-2" /> Favorites</button></li>
        <li className="mb-2"><button onClick={() => setShelf('notes')} className="flex items-center text-gray-600"><Lightbulb className="mr-2" /> Notes</button></li>
        <li className="mb-2"><button onClick={() => setShelf('highlights')} className="flex items-center text-gray-600"><BookOpen className="mr-2" /> Highlights</button></li>
        <li className="mb-2"><button onClick={() => setShelf('trash')} className="flex items-center text-gray-600"><Trash className="mr-2" /> Trash</button></li>
      </ul>
    </nav>
    <div className="mt-8">
      <h3 className="font-semibold mb-2">Shelf</h3>
      <ul>
        <li className="mb-2"><button onClick={() => setShelf('study')} className="text-gray-600">Study</button></li>
        <li className="mb-2"><button onClick={() => setShelf('work')} className="text-gray-600">Work</button></li>
        <li className="mb-2"><button onClick={() => setShelf('entertainment')} className="text-gray-600">Entertainment</button></li>
        <li className="mb-2"><button onClick={() => setShelf('selfHelp')} className="text-gray-600">Self Help</button></li>
        <li className="mb-2"><button onClick={() => setShelf('blueLock')} className="text-gray-600">Blue Lock</button></li>
      </ul>
    </div>
  </aside>
);

const BookGrid = ({ books, toggleFavorite, favorites }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
    {books.map(book => (
      <BookCard 
        key={book.id} 
        book={book} 
        toggleFavorite={toggleFavorite} 
        isFavorite={favorites.includes(book.id)} 
      />
    ))}
  </div>
);

const HomePage = ({ books, toggleFavorite, setShelf, currentShelf, favorites }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} setShelf={setShelf} />
        <main className="flex-1 overflow-y-auto">
          <BookGrid books={books} toggleFavorite={toggleFavorite} favorites={favorites} />
        </main>
      </div>
    </div>
  );
};

const App = () => {
  const [books, setBooks] = useState(booksData);
  const [favorites, setFavorites] = useState([]);
  const [currentShelf, setCurrentShelf] = useState('books');

  const toggleFavorite = (bookId) => {
    setFavorites(prevFavorites => {
      if (prevFavorites.includes(bookId)) {
        return prevFavorites.filter(id => id !== bookId);
      } else {
        return [...prevFavorites, bookId];
      }
    });
  };

  const getBooksByShelf = (shelf) => {
    if (shelf === 'favorites') {
      return books.filter(book => favorites.includes(book.id));
    }
    return books.filter(book => book.shelf === shelf);
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <HomePage 
              books={getBooksByShelf(currentShelf)} 
              toggleFavorite={toggleFavorite} 
              setShelf={setCurrentShelf} 
              currentShelf={currentShelf}
              favorites={favorites}
            />
          } 
        />
        <Route path="/import" element={<ImportBook />} />
      </Routes>
    </Router>
  );
};

export default App;
