import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import NewCharacter from './pages/NewCharacter';
import ShowCharacters from './pages/ShowCharacters';

function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Theme should be defaulted to system
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    updateTheme(systemTheme);
  }, []);

  const updateTheme = (newTheme: string) => {
    setTheme(newTheme);
    document.body.setAttribute('data-theme', newTheme);
  };

  return (
    <BrowserRouter>
      <header className="flex justify-between items-center px-6 py-4 mb-8 bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
        <nav className="flex gap-4">
          <div>
            <img src="/logo.svg" alt="Logo" className='w-8 h-auto' />
          </div>
          <Link to="/" className="text-gray-800 dark:text-gray-100 hover:underline">List</Link>
          <Link to="/character" className="text-gray-800 dark:text-gray-100 hover:underline">New</Link>
        </nav>
        <button
          onClick={() => updateTheme(theme === 'light' ? 'dark' : 'light')}
          className="px-4 py-2 rounded !bg-transparent font-semibold border border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          title="Toggle theme"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </header>
  <div className="p-4">
        <Routes>
          <Route path="/" element={<ShowCharacters />} />
          <Route path="/character" element={<NewCharacter />} />
          <Route path="/character/:id" element={<NewCharacter />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
