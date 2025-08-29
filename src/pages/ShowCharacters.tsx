import { useState, useEffect } from 'react';
import { storage } from '../storage';
import { useNavigate } from 'react-router-dom';

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
    if (window.confirm('Are you sure you want to delete this character?')) {
      storage.deleteCharacter(id);
      setCharacters(storage.getCharacters());
      setSelectedId(null);
    }
  };

  return (
    <div>
      <h2>Characters</h2>
      <input
        type="text"
        placeholder="Filter by name or alias"
        value={filter}
        onChange={e => setFilter(e.target.value)}
        title="Type to filter characters by name or alias"
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
        {filtered.length === 0 && <li className="px-4 py-2">No characters found.</li>}
      </ul>
      {selected && (
        <div className="mt-6 p-4 border rounded border-gray-300 dark:border-gray-700 flex flex-col gap-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{selected.name}</h3>
          {selected.aliases.length > 0 && <p className="mb-1"><span className="font-semibold">Aliases:</span> {selected.aliases.join(', ')}</p>}
          <p className="mb-1"><span className="font-semibold">Description:</span> {selected.description || 'No description.'}</p>
          {selected.relatedTo.length > 0 && (
            <div className="mb-1">
              <span className="font-semibold">Related To:</span>
              <ul className="list-disc ml-6">
                {selected.relatedTo.map((rel, idx) => {
                  const relChar = characters.find(c => c.id === rel.characterId);
                  return (
                    <li key={idx}>
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
                Edit
            </button>

            <button
                onClick={() => deleteCharacter(selected.id)}
            >
                Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShowCharacters;
