import { useState, useEffect, type ChangeEvent } from 'react';
import { languages, t } from './i18n/texts';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import NewCharacter from './pages/NewCharacter';
import ShowCharacters from './pages/ShowCharacters';
import { storage } from './storage';

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
    <BrowserRouter>
      <header className="flex justify-between items-center px-6 py-4 mb-8 bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
        <nav className="flex gap-4">
          <div>
            <img src="/logo.svg" alt={t('logoAlt')} className='w-8 h-auto' />
          </div>
          <Link to="/" className="text-gray-800 dark:text-gray-100 hover:underline">{t('list')}</Link>
          <Link to="/character" className="text-gray-800 dark:text-gray-100 hover:underline">{t('new')}</Link>
        </nav>
        <div className="flex gap-1 align-middle items-center">
          <select
            value={selectedLanguage}
            onChange={changeLanguage}
            name="language"
            id="language"
            className="m-0!"
            >
            {languagesList.map(lang => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        <button
          onClick={() => updateTheme(theme === 'light' ? 'dark' : 'light')}
          className="rounded !bg-transparent font-semibold border border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          title={t('toggleTheme')}
          >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
          </div>
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
