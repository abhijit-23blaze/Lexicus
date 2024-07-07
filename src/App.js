import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { Search, SquareLibrary, Library, Menu, Settings, Folder, Home, X } from 'lucide-react';
import ImportBook from './components/ImportBook';
import BookCard from './components/BookCard';
import booksData from './data/books.json'; // Import the JSON file
import SignIn from './components/SignIn';
import { auth } from './firebase'; // Adjust the import path  

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
        <button 
          className="text-gray-600"
          onClick={() => navigate('/signin')}
        >
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
        <li className="mb-2">
          <button 
            onClick={() => setShelf('all')} 
            className={`flex items-center ${currentShelf === 'all' ? 'text-purple-600 font-semibold' : 'text-gray-600'}`}>
            <Home className="mr-2" /> Books
          </button>
        </li>
        {/* Add the other shelf buttons similarly */}
      </ul>
    </nav>
    <div className="mt-8">
      <h3 className="font-semibold mb-2 flex items-center"><SquareLibrary className="mr-2" /> Shelf</h3>
      <ul>
        <li className="mb-2">
          <button 
            onClick={() => setShelf('study')} 
            className={`flex items-center ${currentShelf === 'study' ? 'text-purple-600 font-semibold' : 'text-gray-600'}`}>
            <Library className="mr-2" /> Study
          </button>
        </li>
        <li className="mb-2">
          <button 
            onClick={() => setShelf('work')} 
            className={`flex items-center ${currentShelf === 'work' ? 'text-purple-600 font-semibold' : 'text-gray-600'}`}>
            <Library className="mr-2" /> Work
          </button>
        </li>
        <li className="mb-2">
          <button 
            onClick={() => setShelf('entertainment')} 
            className={`flex items-center ${currentShelf === 'entertainment' ? 'text-purple-600 font-semibold' : 'text-gray-600'}`}>
            <Library className="mr-2" /> Entertainment
          </button>
        </li>
        <li className="mb-2">
          <button 
            onClick={() => setShelf('selfHelp')} 
            className={`flex items-center ${currentShelf === 'selfHelp' ? 'text-purple-600 font-semibold' : 'text-gray-600'}`}>
            <Library className="mr-2" /> Self Help
          </button>
        </li>
        <li className="mb-2">
          <button 
            onClick={() => setShelf('blueLock')} 
            className={`flex items-center ${currentShelf === 'blueLock' ? 'text-purple-600 font-semibold' : 'text-gray-600'}`}>
            <Library className="mr-2" /> Blue Lock
          </button>
        </li>
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
  const [favorites, setFavorites] = useState([]);
  const [currentShelf, setCurrentShelf] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

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

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <HomePage
                books={getBooksByShelf(currentShelf)}
                toggleFavorite={toggleFavorite}
                setShelf={setCurrentShelf}
                currentShelf={currentShelf}
                favorites={favorites}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            ) : (
              <SignIn />
            )
          }
        />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/import" element={<ImportBook />} />
        {/* Add routes for each book link */}
        {books.map(book => (
          <Route
            key={book.id}
            path={book.link}
            element={<BookDetails book={book} />}
          />
        ))}
      </Routes>
    </Router>
  );
};

// A simple BookDetails component to render the book details page
const BookDetails = ({ book }) => (
  <div className="p-6 bg-white">
    <h1 className="text-3xl font-semibold mb-4">{book.title}</h1>
    <p className="text-lg mb-2">Author: {book.author}</p>
    <p className="text-lg mb-4">Description: {book.description}</p>
    <img src={book.coverUrl} alt={book.title} className="w-full max-w-xs rounded shadow-lg" />
  </div>
);

export default App;