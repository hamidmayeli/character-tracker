import { useState, useEffect, type ChangeEvent } from 'react';
import { languages, t } from './i18n/texts';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import NewCharacter from './pages/NewCharacter';
import ShowCharacters from './pages/ShowCharacters';
import { storage } from './storage';
import FloatingNewButton from './components/FloatingNewButton';
import { ToastProvider } from './contexts/ToastContext';
import ToastContainer from './components/ToastContainer';

function App() {
  const [theme, setTheme] = useState('light');
  const [selectedLanguage, setSelectedLanguage] = useState(storage.getSelectedLanguage());
  const languagesList = Object.keys(languages);
  const [direction, setDirection] = useState(languages[selectedLanguage].direction);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        <header className="sticky top-0 z-40 flex justify-between items-center px-6 py-4 mb-8 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-b border-gray-300 dark:border-gray-700 shadow-sm transition-all duration-300">
          <div className="flex items-center gap-4">
            <div>
              <img src="/logo.svg" alt={t('logoAlt')} className='w-8 h-auto' />
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-4 items-center">
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
            <div className="hidden md:flex gap-2 items-center">
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

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden rounded !bg-transparent font-semibold border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 px-3 py-2"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </header>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed top-[73px] left-0 right-0 z-30 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-b border-gray-300 dark:border-gray-700 shadow-lg animate-slide-down">
            <nav className="flex flex-col p-4 gap-2">
              <Link 
                to="/" 
                className="text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('list')}
              </Link>
              <Link 
                to="/character" 
                className="text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('new')}
              </Link>
              <div className="flex gap-2 mt-2 pt-2 border-t border-gray-300 dark:border-gray-700">
                <select
                  value={selectedLanguage}
                  onChange={(e) => {
                    changeLanguage(e);
                    setMobileMenuOpen(false);
                  }}
                  name="language-mobile"
                  id="language-mobile"
                  className="flex-1 m-0! text-sm"
                  >
                  {languagesList.map(lang => (
                    <option key={lang} value={lang}>
                      {lang.toUpperCase()}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    updateTheme(theme === 'light' ? 'dark' : 'light');
                    setMobileMenuOpen(false);
                  }}
                  className="rounded !bg-transparent font-semibold border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                  title={t('toggleTheme')}
                >
                  {theme === 'light' ? '🌙' : '☀️'}
                </button>
              </div>
            </nav>
          </div>
        )}

    <div className="p-4 pb-24">
          <Routes>
            <Route path="/" element={<ShowCharacters />} />
            <Route path="/character" element={<NewCharacter />} />
            <Route path="/character/:id" element={<NewCharacter />} />
          </Routes>
        </div>
        <FloatingNewButton />
        <ToastContainer />
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
