import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { Search, Menu, Settings, Folder, Home, Heart, Lightbulb, BookOpen, Trash, X } from 'lucide-react';
import ImportBook from './components/ImportBook';

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

const Sidebar = ({ isOpen, toggleSidebar }) => (
  <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white p-4 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0`}>
    <button onClick={toggleSidebar} className="absolute top-4 right-4 text-gray-600 lg:hidden">
      <X size={24} />
    </button>
    <nav className="mt-8 lg:mt-0">
      <ul>
        <li className="mb-2"><a href="#" className="flex items-center text-purple-600 font-semibold"><Home className="mr-2" /> Books</a></li>
        <li className="mb-2"><a href="#" className="flex items-center text-gray-600"><Heart className="mr-2" /> Favorites</a></li>
        <li className="mb-2"><a href="#" className="flex items-center text-gray-600"><Lightbulb className="mr-2" /> Notes</a></li>
        <li className="mb-2"><a href="#" className="flex items-center text-gray-600"><BookOpen className="mr-2" /> Highlights</a></li>
        <li className="mb-2"><a href="#" className="flex items-center text-gray-600"><Trash className="mr-2" /> Trash</a></li>
      </ul>
    </nav>
    <div className="mt-8">
      <h3 className="font-semibold mb-2">Shelf</h3>
      <ul>
        <li className="mb-2"><a href="#" className="text-gray-600">Study</a></li>
        <li className="mb-2"><a href="#" className="text-gray-600">Work</a></li>
        <li className="mb-2"><a href="#" className="text-gray-600">Entertainment</a></li>
        <li className="mb-2"><a href="#" className="text-gray-600">Self Help</a></li>
        <li className="mb-2"><a href="#" className="text-gray-600">Blue Lock</a></li>
      </ul>
    </div>
  </aside>
);

const BookCard = ({ book }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <img src={book.coverUrl} alt={book.title} className="w-full h-40 object-cover mb-4 rounded" />
    <h3 className="font-semibold">{book.title}</h3>
    <p className="text-sm text-gray-600">Author: {book.author}</p>
    <p className="text-sm text-gray-600">Publisher: {book.publisher}</p>
    <p className="text-sm text-gray-600">Description: {book.description || 'Empty'}</p>
    {book.progress && <div className="mt-2 bg-gray-200 rounded-full h-2">
      <div className="bg-green-500 h-2 rounded-full" style={{width: `${book.progress}%`}}></div>
    </div>}
  </div>
);

const BookGrid = ({ books }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
    {books.map(book => <BookCard key={book.id} book={book} />)}
  </div>
);

const HomePage = ({ books }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto">
          <BookGrid books={books} />
        </main>
      </div>
    </div>
  );
};


const App = () => {
  const [books] = useState([
    { id: 1, title: "THE PLAN", author: "Unknown author", publisher: "", coverUrl: "https://via.placeholder.com/150", description: "Empty" },
    { id: 2, title: "HACK4BIOHERITAGE.docx", author: "Unknown author", publisher: "Skia/PDF m125 Google Do...", coverUrl: "https://via.placeholder.com/150", description: "Empty", progress: 84 },
    { id: 3, title: "Blue Lock v01 (2021) (Digital) (danke-Empire)", author: "Unknown author", publisher: "", coverUrl: "https://via.placeholder.com/150", description: "Empty", progress: 84 },
    { id: 4, title: "-Problem Statement-", author: "Ritavan Dasgupta", publisher: "Canva", coverUrl: "https://via.placeholder.com/150", description: "Empty", progress: 100 },
    { id: 5, title: "The Subtle Art of Not Giving a F*ck - EnglishPDF", author: "Mark Manson", publisher: "calibre 3.44.0", coverUrl: "https://via.placeholder.com/150", description: "Empty" },
    { id: 6, title: "Zero to One: Notes on Startups, or How to Build the Future", author: "Peter Thiel & Blake Masters", publisher: "calibre 0.9.22", coverUrl: "https://via.placeholder.com/150", description: "Empty", progress: 75 },
    { id: 7, title: "Blue Lock - Volume 01", author: "CamScanner", publisher: "iLovePDF", coverUrl: "https://via.placeholder.com/150", description: "Empty", progress: 99 },
  ]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage books={books} />} />
        <Route path="/import" element={<ImportBook />} />
      </Routes>
    </Router>
  );
};

export default App;