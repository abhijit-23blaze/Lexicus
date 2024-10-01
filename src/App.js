import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { Search, Library, Menu, Info, Folder, X } from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import ImportBook from './components/ImportBook';
import BookCard from './components/BookCard';
import SignIn from './components/SignIn';
import Profile from './components/Profile';
import { auth, firestore } from './firebase';
import shelvesData from './data/shelves.json';
import ProfileSetup from './components/ProfileSetup';
import AddBook from './components/AddBook';
import booksData from './data/books.json';

const AboutPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4">Welcome to Lexicus Beta! 📚✨</h2>
        <p className="text-gray-700 mb-4">
          You're experiencing the beta version of Lexicus, your upcoming digital sanctuary for book lovers! 🏠📖
        </p>
        <p className="text-gray-700 mb-4">
          Current beta features:
        </p>
        <p className="text-gray-700 mb-4">
          📤 Access a curated library at your fingertips<br/>
          📱 Enjoy a smooth, intuitive reading experience<br/>
          🚀 Test our cutting-edge reader technology
        </p>
        <p className="text-gray-700 mb-4">
          Coming in the full version:
        </p>
        <p className="text-gray-700 mb-4">
          📚 Upload and share your own books<br/>
          🔍 Explore a vastly expanded collection of titles<br/>
          🌟 Experience enhanced features and functionality
        </p>
        <p className="text-gray-700 mb-6">
          🎉 Exciting news! This is just the beginning. Our full version is coming soon, packed with mind-blowing features that will revolutionize your reading experience! Stay tuned for a literary adventure like no other! 🔜✨
        </p>
        <button
          onClick={onClose}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};


const Header = ({ toggleSidebar, searchQuery, setSearchQuery, openAboutPopup }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-white">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="mr-4 text-gray-600 lg:hidden">
          <Menu size={24} />
        </button>
        <h1 className="text-2xl font-semibold">Lexicus</h1>
      </div>
      <div className="flex-1 mx-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full py-2 px-4 bg-purple-100 rounded-full text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      <div className="flex items-center">
        <button onClick={openAboutPopup} className="text-gray-600">
          <Info size={24} />
        </button>
      </div>
    </header>
  );
};

const Sidebar = ({ isOpen, toggleSidebar, setShelf, currentShelf }) => (
  <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white p-4 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0`}>
    <button onClick={toggleSidebar} className="absolute top-4 right-4 text-gray-600 lg:hidden">
      <X size={24} />
    </button>
    <nav className="mt-8 lg:mt-0">
      <ul>
        {shelvesData.map(shelf => (
          <li className="mb-2" key={shelf.id}>
            <button 
              onClick={() => setShelf(shelf.id)} 
              className={`flex items-center ${currentShelf === shelf.id ? 'text-purple-600 font-semibold' : 'text-gray-600'}`}>
              {React.createElement(Library, { className: "mr-2" })} {/* Adjust icon logic if necessary */}
              {shelf.name}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  </aside>
);

const BookGrid = ({ books, toggleFavorite, favorites }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 p-6">
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

const HomePage = ({ books, toggleFavorite, setShelf, currentShelf, favorites, searchQuery, setSearchQuery }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAboutPopupOpen, setIsAboutPopupOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const openAboutPopup = () => setIsAboutPopupOpen(true);
  const closeAboutPopup = () => setIsAboutPopupOpen(false);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header 
        toggleSidebar={toggleSidebar} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        openAboutPopup={openAboutPopup}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} setShelf={setShelf} currentShelf={currentShelf} />
        <main className="flex-1 overflow-y-auto">
          <BookGrid books={books} toggleFavorite={toggleFavorite} favorites={favorites} />
        </main>
      </div>
      <AboutPopup isOpen={isAboutPopupOpen} onClose={closeAboutPopup} />
    </div>
  );
};

const App = () => {
  const [books, setBooks] = useState([]);
  const [shelves] = useState(shelvesData);
  const [favorites, setFavorites] = useState([]);
  const [currentShelf, setCurrentShelf] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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
    let filteredBooks = books;
    
    if (shelf === 'favorites') {
      filteredBooks = books.filter(book => favorites.includes(book.id));
    } else if (shelf !== 'all') {
      filteredBooks = books.filter(book => book.shelf === shelf);
    }

    if (searchQuery) {
      filteredBooks = filteredBooks.filter(book => 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filteredBooks;
  };

  useEffect(() => {
    setBooks(booksData);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/Lexicus" element={<HomePage 
          books={getBooksByShelf(currentShelf)} 
          toggleFavorite={toggleFavorite} 
          setShelf={setCurrentShelf} 
          currentShelf={currentShelf} 
          favorites={favorites} 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/add-book" element={<AddBook />} />
      </Routes>
    </Router>
  );
};

export default App;