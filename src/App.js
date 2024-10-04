import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { Search, Library, Menu, Info, Folder, X } from 'lucide-react';
// import { collection, getDocs, query, orderBy } from 'firebase/firestore';
// import ImportBook from './components/ImportBook';
import BookCard from './components/BookCard';
// import SignIn from './components/SignIn';
// import Profile from './components/Profile';
// import { auth, firestore } from './firebase';
import shelvesData from './data/shelves.json';
// import ProfileSetup from './components/ProfileSetup';
// import AddBook from './components/AddBook';
import booksData from './data/books.json';

const AboutPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-lg w-3/4 sm:w-1/2">
        <h2 className="text-2xl font-semibold mb-4">Welcome to Lexicus Beta!!</h2>
        <p className="text-gray-700 font-semibold mb-4">What is Lexicus ??</p>
        <p className="text-gray-700 mb-4">
          Lexicus is a place where you can read books and magzines without the hassle of ads and other annoying designs, 
          or if you are an author you can upload your books here for free and gain an audience.
        </p>
        <p className="text-gray-700 mb-4">
          This is just the beta version of the site. The full version will be coming soon!!
        </p>
        <p className="text-gray-700 mb-4">
          <a 
            href="https://abhijit-23blaze.github.io/Portfolio/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-800 underline"
          >
            Made by Abhijit Patil (UG-2)
          </a>
        </p>
        <p className="text-gray-700 mb-6">
          If you liked the site or have any feedback related to it, just drop me a DM! I am always open to new ideas!
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

const Sidebar = ({ isOpen, toggleSidebar, setShelf, currentShelf }) => {
  const navigate = useNavigate(); // Hook for navigation

  const handleShelfClick = (shelfId) => {
    setShelf(shelfId);
    navigate(`/Lexicus/shelf/${shelfId}`); // Navigate to the corresponding URL
  };

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white p-4 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0`}>
      <button onClick={toggleSidebar} className="absolute top-4 right-4 text-gray-600 lg:hidden">
        <X size={24} />
      </button>
      <nav className="mt-8 lg:mt-0">
        <ul>
          {shelvesData.map(shelf => (
            <li className="mb-2" key={shelf.id}>
              <button 
                onClick={() => handleShelfClick(shelf.id)} 
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
};

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
  const { shelfId } = useParams(); // Get shelf ID from URL
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAboutPopupOpen, setIsAboutPopupOpen] = useState(false);

  useEffect(() => {
    if (shelfId) {
      setShelf(shelfId); // Update the current shelf based on the URL parameter
    }
  }, [shelfId, setShelf]);

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
        <Route 
          path="/Lexicus" 
          element={<HomePage 
            books={getBooksByShelf(currentShelf)} 
            toggleFavorite={toggleFavorite} 
            setShelf={setCurrentShelf} 
            currentShelf={currentShelf} 
            favorites={favorites} 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />} 
        />
        <Route 
          path="/Lexicus/shelf/:shelfId" 
          element={<HomePage 
            books={getBooksByShelf(currentShelf)} 
            toggleFavorite={toggleFavorite} 
            setShelf={setCurrentShelf} 
            currentShelf={currentShelf} 
            favorites={favorites} 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />} 
        />
      </Routes>
    </Router>
  );
};

export default App;
