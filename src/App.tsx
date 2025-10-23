import { useState, useEffect, type ChangeEvent } from 'react';
import { languages, t } from './i18n/texts';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import NewCharacter from './pages/NewCharacter';
import ShowCharacters from './pages/ShowCharacters';
import { storage } from './storage';
import { ToastProvider } from './contexts/ToastContext';
import ToastContainer from './components/ToastContainer';

function App() {
  const [theme, setTheme] = useState('light');
  const [selectedLanguage, setSelectedLanguage] = useState(storage.getSelectedLanguage());
  const languagesList = Object.keys(languages);
  const [direction, setDirection] = useState(languages[selectedLanguage].direction);

  useEffect(() => {
    // Theme should be defaulted to system
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    updateTheme(systemTheme);
    window.document.body.setAttribute('dir', direction);
  }, [direction]);

  const updateTheme = (newTheme: string) => {
    setTheme(newTheme);
    document.body.setAttribute('data-theme', newTheme);
  };

  function changeLanguage(event: ChangeEvent<HTMLSelectElement>): void {
    const lang = event.target.value as "fa" | "en";
    storage.setSelectedLanguage(lang);
    setSelectedLanguage(lang);
    setDirection(languages[lang].direction);
  }

  return (
    <ToastProvider>
      <BrowserRouter>
        <header className="sticky bottom-0 md:top-0 md:bottom-auto z-40 flex justify-between items-center px-6 py-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-t md:border-t-0 md:border-b border-gray-300 dark:border-gray-700 shadow-sm transition-all duration-300">
          <div className="flex items-center gap-4">
            <div>
              <img src="/logo.svg" alt={t('logoAlt')} className='w-8 h-auto' />
            </div>
            
            {/* Desktop Navigation */}
            <nav className="flex gap-4 items-center">
              <Link 
                to="/" 
                className="text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              >
                {t('list')}
              </Link>
              <Link 
                to="/character" 
                className="text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              >
                {t('new')}
              </Link>
            </nav>
          </div>

          <div className="flex gap-2 align-middle items-center">
            {/* Desktop Controls */}
            <div className="flex gap-2 items-center">
              <select
                value={selectedLanguage}
                onChange={changeLanguage}
                name="language"
                id="language"
                className="m-0! text-sm"
                >
                {languagesList.map(lang => (
                  <option key={lang} value={lang}>
                    {lang.toUpperCase()}
                  </option>
                ))}
              </select>
              <button
                onClick={() => updateTheme(theme === 'light' ? 'dark' : 'light')}
                className="rounded !bg-transparent font-semibold border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                title={t('toggleTheme')}
                >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
            </div>
          </div>
        </header>

    <div className="p-4 flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<ShowCharacters />} />
            <Route path="/character" element={<NewCharacter />} />
            <Route path="/character/:id" element={<NewCharacter />} />
          </Routes>
        </div>
        <ToastContainer />
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
