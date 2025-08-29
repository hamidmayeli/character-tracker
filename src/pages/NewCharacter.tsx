import React, { useState, useEffect } from 'react';
import { storage } from '../storage';

const initialState = {
  name: '',
  aliases: '',
  description: '',
  relatedTo: [] as string[],
};

function NewCharacter() {
  const [character, setCharacter] = useState(initialState);
  const [allCharacters, setAllCharacters] = useState<ICharacter[]>([]);

  useEffect(() => {
    setAllCharacters(storage.getCharacters());
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'relatedTo') {
      const options = (e.target as HTMLSelectElement).selectedOptions;
      const selected = Array.from(options).map(opt => opt.value);
      setCharacter((prev) => ({ ...prev, relatedTo: selected }));
    } else {
      setCharacter((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCharacter: ICharacter = {
        ...character,
        id: '',
        aliases: character.aliases.split(',').map(a => a.trim()).filter(a => a),
    };
    storage.saveCharacter(newCharacter);
    alert('Character created!');
    setCharacter(initialState);
    setAllCharacters(storage.getCharacters());
  };

  return (
    <div className='mx-auto'>
      <h2>New Character</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input id="name" name="name" value={character.name} onChange={handleChange} required title="Enter the character's name" />
        </div>
        <div>
          <label htmlFor="aliases">Aliases (comma separated):</label>
          <input
            id="aliases"
            name="aliases"
            value={character.aliases}
            onChange={handleChange}
            placeholder="e.g. Alias1, Alias2, Alias3"
            title="Enter aliases separated by commas"
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea id="description" name="description" value={character.description} onChange={handleChange} title="Enter a description for the character" />
        </div>
        <div>
          <label htmlFor="relatedTo">Related To:</label>
          <select
            id="relatedTo"
            name="relatedTo"
            title="Select related characters"
            multiple
            value={character.relatedTo}
            onChange={handleChange}
            style={{ minWidth: '200px', minHeight: '40px' }}
          >
            {allCharacters
              .filter(c => c.id !== character.id)
              .map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
          </select>
        </div>
        <button type="submit" className="mt-4">Create Character</button>
      </form>
    </div>
  );
}

export default NewCharacter;
