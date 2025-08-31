import { useState, useEffect } from 'react';
import { storage } from '../storage';
import { useNavigate } from 'react-router-dom';
import { t } from '../i18n/texts'; // <-- Add this import

function ShowCharacters() {
  const [characters, setCharacters] = useState<ICharacter[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setCharacters(storage.getCharacters());
  }, []);

  const filtered = characters.filter(c => {
    const search = filter.toLowerCase();
    return (
      c.name.toLowerCase().includes(search) ||
      c.aliases.some(a => a.toLowerCase().includes(search))
    );
  });

  const selected = characters.find(c => c.id === selectedId);

  const deleteCharacter = (id: string) => {
    if (window.confirm(t('deleteConfirm'))) { // <-- Use t() here
      storage.deleteCharacter(id);
      setCharacters(storage.getCharacters());
      setSelectedId(null);
    }
  };

  return (
    <div>
      <h2>{t('characters')}</h2> {/* <-- Use t() here */}
      <input
        type="text"
        placeholder={t('filterPlaceholder')} // <-- Use t() here
        value={filter}
        onChange={e => setFilter(e.target.value)}
        title={t('filterTitle')} // <-- Use t() here
      />
      <ul className="list-none p-0 border rounded border-gray-300 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
        {filtered.map(c => (
          <li
            key={c.id}
            className={`px-4 py-2 cursor-pointer transition-colors ${selectedId === c.id ? 'bg-blue-100 dark:bg-blue-900' : ''} hover:bg-blue-50 dark:hover:bg-blue-800`}
            onClick={() => setSelectedId(c.id)}
          >
            <span className="font-semibold">{c.name}</span>
            {c.aliases.length > 0 && <span className="ml-2">({c.aliases.join(', ')})</span>}
          </li>
        ))}
        {filtered.length === 0 && <li className="px-4 py-2">{t('noCharacters')}</li>} {/* <-- Use t() here */}
      </ul>
      {selected && (
        <div className="mt-6 p-4 border rounded border-gray-300 dark:border-gray-700 flex flex-col gap-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{selected.name}</h3>
          {selected.aliases.length > 0 && <p className="mb-1"><span className="font-semibold">{t('aliases')}</span> {selected.aliases.join(', ')}</p>} {/* <-- Use t() here */}
          <p className="mb-1"><span className="font-semibold">{t('description')}</span> {selected.description || t('noDescription')}</p>
          {selected.relatedTo.length > 0 && (
            <div className="mb-1">
              <span className="font-semibold">{t('relatedTo')}</span> {/* <-- Use t() here */}
              <ul className="list-disc ml-6">
                {selected.relatedTo.map((rel, idx) => {
                  const relChar = characters.find(c => c.id === rel.characterId);
                  return (
                    <li key={idx} onClick={() => setSelectedId(rel.characterId)} role="button">
                      {relChar ? relChar.name : rel.characterId} ({rel.relation})
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          <div className="flex gap-2">
            <button
                onClick={() => navigate(`/character/${selected.id}`)}
            >
                {t('edit')}
            </button>

            <button
                onClick={() => deleteCharacter(selected.id)}
            >
                {t('delete')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShowCharacters;
