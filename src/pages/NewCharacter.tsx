import React, { useState, useEffect } from 'react';
import { t } from '../i18n/texts';
import { storage } from '../storage';
import { useParams, useNavigate } from 'react-router-dom';
import { capitalizeWords } from '../utils';
import { useToast } from '../contexts/ToastContext';

const initialState = {
  name: '',
  aliases: '',
  description: '',
  relatedTo: [] as { characterId: string; relation: string }[],
};

function NewCharacter() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [character, setCharacter] = useState(initialState);
  const [allCharacters, setAllCharacters] = useState<ICharacter[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

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

  const handleRemoveRelated = (index: number) => {
    setCharacter((prev) => ({
      ...prev,
      relatedTo: prev.relatedTo.filter((_, i) => i !== index),
    }));
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newRelatedTo = [...character.relatedTo];
    const draggedItem = newRelatedTo[draggedIndex];
    newRelatedTo.splice(draggedIndex, 1);
    newRelatedTo.splice(index, 0, draggedItem);

    setCharacter(prev => ({ ...prev, relatedTo: newRelatedTo }));
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
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
    addToast(
      editMode ? t('characterUpdated') : t('characterCreated'), 
      'success'
    );
    setCharacter(initialState);
    setAllCharacters(storage.getCharacters());
    navigate('/');
  };

  return (
    <div className='max-w-3xl mx-auto'>
      <h2>{editMode ? t('editTitle') : t('newCharacter')}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-300 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Basic Information
          </h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block font-medium mb-2">
                {t('name')}
              </label>
              <input 
                id="name" 
                name="name" 
                value={character.name} 
                onChange={handleChange} 
                required 
                title={t('nameTitle')}
                className="mb-0"
              />
            </div>

            <div>
              <label htmlFor="aliases" className="block font-medium mb-2">
                {t('aliasesComma')}
              </label>
              <input
                id="aliases"
                name="aliases"
                value={character.aliases}
                onChange={handleChange}
                placeholder={t('aliasesPlaceholder')}
                title={t('aliasesTitle')}
                className="mb-0"
              />
            </div>

            <div>
              <label htmlFor="description" className="block font-medium mb-2">
                {t('description')}
              </label>
              <textarea 
                id="description" 
                name="description" 
                value={character.description} 
                onChange={handleChange} 
                title={t('descriptionTitle')}
                rows={4}
                className="mb-0"
              />
            </div>
          </div>
        </div>

        {/* Related Characters Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-300 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {t('relatedTo')}
            </h3>
            <button
              type="button"
              onClick={() => setCharacter(prev => ({
                ...prev,
                relatedTo: [...prev.relatedTo, { characterId: '', relation: '' }]
              }))}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-3"
            >
              + {t('add')}
            </button>
          </div>

          {character.relatedTo.length > 0 ? (
            <ul className="space-y-3">
              {character.relatedTo.map((rel, idx) => (
                <li 
                  key={idx} 
                  className={`flex gap-2 items-start bg-gray-50 dark:bg-gray-900 p-3 rounded cursor-move transition-opacity ${draggedIndex === idx ? 'opacity-50' : 'opacity-100'}`}
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing pt-2">
                    <span className="text-xl">⋮⋮</span>
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
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
                      className="mb-0"
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
                      className="mb-0"
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveRelated(idx)} 
                    className="bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-3 mb-0"
                  >
                    {t('remove')}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No related characters yet. Click "+ Add" to add one.
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <button 
            type="button" 
            onClick={() => navigate('/')}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
          >
            {t('cancel')}
          </button>
          <button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {t('save')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewCharacter;
