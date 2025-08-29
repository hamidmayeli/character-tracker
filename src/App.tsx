import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import NewCharacter from './pages/NewCharacter';
import ShowCharacters from './pages/ShowCharacters';

function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.body.style.background = theme === 'dark' ? '#222' : '#fff';
    document.body.style.color = theme === 'dark' ? '#fff' : '#222';
  }, [theme]);

  return (
    <BrowserRouter>
      <header style={{ padding: '1rem', background: theme === 'dark' ? '#333' : '#eee', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <nav>
          <Link to="/" style={{ marginRight: '1rem' }}>Show Characters</Link>
          <Link to="/new">New Character</Link>
        </nav>
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', background: theme === 'dark' ? '#444' : '#ddd', color: theme === 'dark' ? '#fff' : '#222', cursor: 'pointer' }}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </header>
      <div className='p-4'>
        <Routes>
        <Route path="/" element={<ShowCharacters />} />
        <Route path="/new" element={<NewCharacter />} />
      </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
