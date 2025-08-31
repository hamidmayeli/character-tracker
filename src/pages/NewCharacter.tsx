import React, { useState, useEffect } from 'react';
import { t } from '../i18n/texts';
import { storage } from '../storage';
import { useParams, useNavigate } from 'react-router-dom';

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
          name: found.name,
          aliases: found.aliases.join(', '),
          description: found.description,
          relatedTo: found.relatedTo || [],
        });
        setEditMode(true);
      }
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCharacter((prev) => ({ ...prev, [name]: value }));
  };

  // Add related character
  const [relatedId, setRelatedId] = useState('');
  const [relation, setRelation] = useState('');
  const handleAddRelated = () => {
    if (relatedId && relation) {
      setCharacter((prev) => ({
        ...prev,
        relatedTo: [...prev.relatedTo, { characterId: relatedId, relation }],
      }));
      setRelatedId('');
      setRelation('');
    }
  };
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
      aliases: character.aliases.split(',').map(a => a.trim()).filter(a => a),
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
          <label htmlFor="relatedTo">{t('relatedTo')}</label>
          <div className="flex gap-2 mb-2">
            <select
              id="relatedId"
              value={relatedId}
              onChange={e => setRelatedId(e.target.value)}
              title={t('relatedIdTitle')}
            >
              <option value="">{t('relatedIdTitle')}</option>
              {allCharacters.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <input
              type="text"
              value={relation}
              onChange={e => setRelation(e.target.value)}
              placeholder={t('relationPlaceholder')}
              title={t('relationTitle')}
            />
            <div><button type="button" onClick={handleAddRelated}>{t('add')}</button></div>
          </div>
          <ul>
            {character.relatedTo.map((rel, idx) => (
              <li key={idx} className="flex gap-2 items-center">
                <span>{allCharacters.find(c => c.id === rel.characterId)?.name || rel.characterId} ({rel.relation})</span>
                <button type="button" onClick={() => handleRemoveRelated(idx)}>{t('remove')}</button>
              </li>
            ))}
          </ul>
        </div>
  <button type="submit" className="mt-4">{t('save')}</button>
      </form>
    </div>
  );
}

export default NewCharacter;
