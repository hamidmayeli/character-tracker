import { useState, useEffect } from 'react';
import { storage } from '../storage';
import { useNavigate } from 'react-router-dom';
import { t } from '../i18n/texts';
import Avatar from '../components/Avatar';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import { useToast } from '../contexts/ToastContext';

function ShowCharacters() {
  const [characters, setCharacters] = useState<ICharacter[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();
  const { addToast } = useToast();

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
    if (window.confirm(t('deleteConfirm'))) {
      storage.deleteCharacter(id);
      setCharacters(storage.getCharacters());
      setSelectedId(null);
      addToast(t('characterDeleted'), 'success');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="mb-0">{t('characters')}</h2>
        <Badge variant="primary" size="lg">
          {filter ? `${filtered.length} / ${characters.length}` : characters.length}
        </Badge>
      </div>
      <input
        type="text"
        placeholder={t('filterPlaceholder')}
        value={filter}
        onChange={e => setFilter(e.target.value)}
        title={t('filterTitle')}
      />
      {characters.length === 0 ? (
        <EmptyState
          title={t('noCharacters')}
          description={t('noCharactersDescription')}
          icon="🎭"
          actionLabel={t('createFirstCharacter')}
          onAction={() => navigate('/character')}
        />
      ) : (
        <>
          <ul className="list-none p-0 border rounded border-gray-300 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
            {filtered.map(c => (
              <li
                key={c.id}
                className={`px-4 py-3 cursor-pointer transition-colors flex items-center gap-3 ${selectedId === c.id ? 'bg-blue-100 dark:bg-blue-900' : ''} hover:bg-blue-50 dark:hover:bg-blue-800`}
                onClick={() => setSelectedId(c.id)}
              >
                <Avatar name={c.name} size="md" />
                <div className="flex-1">
                  <span className="font-semibold">{c.name}</span>
                  {c.aliases.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {c.aliases.map((alias, idx) => (
                        <Badge key={idx} variant="default" size="sm">
                          {alias}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
          {filtered.length === 0 && (
            <EmptyState
              title={t('noMatchingCharacters')}
              description={t('tryDifferentSearch')}
              icon="🔍"
            />
          )}
        </>
      )}
      {selected && (
        <div className="mt-6 p-6 border rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <Avatar name={selected.name} size="lg" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-0">{selected.name}</h3>
          </div>
          
          {selected.aliases.length > 0 && (
            <div className="mb-4">
              <span className="font-semibold text-gray-700 dark:text-gray-300">{t('aliases')}</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {selected.aliases.map((alias, idx) => (
                  <Badge key={idx} variant="primary" size="md">
                    {alias}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="mb-4">
            <span className="font-semibold text-gray-700 dark:text-gray-300">{t('description')}</span>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              {selected.description || t('noDescription')}
            </p>
          </div>
          
          {selected.relatedTo.length > 0 && (
            <div className="mb-6">
              <span className="font-semibold text-gray-700 dark:text-gray-300">{t('relatedTo')}</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {selected.relatedTo.map((rel, idx) => {
                  const relChar = characters.find(c => c.id === rel.characterId);
                  return (
                    <Badge 
                      key={idx} 
                      variant="default" 
                      size="md"
                      onClick={() => relChar && setSelectedId(rel.characterId)}
                      className="cursor-pointer hover:scale-105 transition-transform"
                    >
                      {relChar ? relChar.name : rel.characterId} • {rel.relation}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
          
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/character/${selected.id}`)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {t('edit')}
            </button>
            <button
              onClick={() => deleteCharacter(selected.id)}
              className="bg-red-600 hover:bg-red-700 text-white"
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
