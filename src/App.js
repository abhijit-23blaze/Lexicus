import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { Search, SquareLibrary, Library, Menu, Settings, Folder, Home, X, User } from 'lucide-react';
import ImportBook from './components/ImportBook';
import BookCard from './components/BookCard';
import booksData from './data/books.json'; // Import the JSON file
import SignIn from './components/SignIn';
import Profile from './components/Profile'; // Import the Profile component
import { auth } from './firebase'; // Import auth from firebase
import shelvesData from './data/shelves.json'; // Adjust the path if necessary

const Header = ({ toggleSidebar, searchQuery, setSearchQuery }) => {
  const navigate = useNavigate();

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
            placeholder="Search my library"
            className="w-full py-2 px-4 bg-purple-100 rounded-full text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      <div className="flex items-center">
        <Settings className="mr-4 text-gray-600 hidden sm:block" />
        <Folder className="mr-4 text-gray-600 hidden sm:block" />
        <button onClick={() => navigate('/profile')} className="text-gray-600">
          <User size={24} />
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
        {shelves.map(shelf => (
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

const HomePage = ({ books, toggleFavorite, setShelf, currentShelf, favorites, searchQuery, setSearchQuery }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header toggleSidebar={toggleSidebar} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} setShelf={setShelf} currentShelf={currentShelf} />
        <main className="flex-1 overflow-y-auto">
          <BookGrid books={books} toggleFavorite={toggleFavorite} favorites={favorites} />
        </main>
      </div>
    </div>
  );
};

const App = () => {
  const [books, setBooks] = useState(booksData);
  const [shelves, setShelves] = useState(shelvesData); // Load shelves from JSON
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
    const fetchBooks = async () => {
      try {
        const response = await fetch('/path-to-your-books-endpoint');
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error('Failed to fetch books:', error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage 
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
      </Routes>
    </Router>
  );
};

export default App;
