import React, { useState, useEffect } from 'react';
import { t } from '../i18n/texts';
import { storage } from '../storage';
import { useParams, useNavigate } from 'react-router-dom';
import { capitalizeWords } from '../utils';

const initialState = {
  name: '',
  aliases: '',
  description: '',
  relatedTo: [] as { characterId: string; relation: string }[],
};

function NewCharacter() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [character, setCharacter] = useState(initialState);
  const [allCharacters, setAllCharacters] = useState<ICharacter[]>([]);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const chars = storage.getCharacters();
    setAllCharacters(chars);
    if (id) {
      const found = chars.find(c => c.id === id);
      if (found) {
        setCharacter({
          name: capitalizeWords(found.name),
          aliases: found.aliases.map(alias => capitalizeWords(alias)).join(', '),
          description: found.description,
          relatedTo: found.relatedTo || [],
        });
        setEditMode(true);
      }
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    let processedValue = value;
    
    // Auto-capitalize name as user types
    if (name === 'name') {
      processedValue = capitalizeWords(value);
    } else if (name === 'aliases') {
      // For aliases, capitalize words but preserve commas and spaces for typing
      processedValue = capitalizeWords(value);
    }
    
    setCharacter((prev) => ({ ...prev, [name]: processedValue }));
  };

  // ...existing code...
  const handleRemoveRelated = (index: number) => {
    setCharacter((prev) => ({
      ...prev,
      relatedTo: prev.relatedTo.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCharacter: ICharacter = {
      ...character,
      id: editMode && id ? id : '',
      name: capitalizeWords(character.name),
      aliases: character.aliases
        .split(',')
        .map(a => a.trim())
        .filter(a => a)
        .map(a => capitalizeWords(a)),
      relatedTo: character.relatedTo,
    };
    
    storage.saveCharacter(newCharacter);
    setCharacter(initialState);
    setAllCharacters(storage.getCharacters());
    navigate('/');
  };

  return (
    <div className='mx-auto'>
  <h2>{editMode ? t('editTitle') : t('newCharacter')}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">{t('name')}</label>
          <input id="name" name="name" value={character.name} onChange={handleChange} required title={t('nameTitle')} />
        </div>
        <div>
          <label htmlFor="aliases">{t('aliasesComma')}</label>
          <input
            id="aliases"
            name="aliases"
            value={character.aliases}
            onChange={handleChange}
            placeholder={t('aliasesPlaceholder')}
            title={t('aliasesTitle')}
          />
        </div>
        <div>
          <label htmlFor="description">{t('description')}</label>
          <textarea id="description" name="description" value={character.description} onChange={handleChange} title={t('descriptionTitle')} />
        </div>
        <div>
          <label>{t('relatedTo')}</label>
          <ul className="flex flex-col gap-2 mb-2">
            {character.relatedTo.map((rel, idx) => (
              <li key={idx} className="flex gap-2 items-center">
                <select
                  value={rel.characterId}
                  onChange={e => {
                    const newId = e.target.value;
                    setCharacter(prev => ({
                      ...prev,
                      relatedTo: prev.relatedTo.map((r, i) => i === idx ? { ...r, characterId: newId } : r)
                    }));
                  }}
                  title={t('relatedIdTitle')}
                >
                  <option value="">{t('relatedIdTitle')}</option>
                  {allCharacters.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={rel.relation}
                  onChange={e => {
                    const newRel = e.target.value;
                    setCharacter(prev => ({
                      ...prev,
                      relatedTo: prev.relatedTo.map((r, i) => i === idx ? { ...r, relation: newRel } : r)
                    }));
                  }}
                  placeholder={t('relationPlaceholder')}
                  title={t('relationTitle')}
                />
                <button type="button" onClick={() => handleRemoveRelated(idx)} className="mb-4">{t('remove')}</button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => setCharacter(prev => ({
              ...prev,
              relatedTo: [...prev.relatedTo, { characterId: '', relation: '' }]
            }))}
            className="mb-2"
          >
            {t('add')}
          </button>
        </div>
  <button type="submit" className="mt-4">{t('save')}</button>
      </form>
    </div>
  );
}

export default NewCharacter;
