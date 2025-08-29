export const storage: IStorage = {
  saveCharacter: (character) => {
    if (character.id === '') {
      character.id = Date.now().toString();
    }

    const characters = storage.getCharacters();

    // Add or update character
    const index = characters.findIndex(c => c.id === character.id);
    if (index !== -1) {
      characters[index] = character;
    } else {
      characters.push(character);
    }

    // For each relation, add reciprocal relation to related character
    character.relatedTo.filter(rel => !rel.relation.startsWith('!')).forEach(rel => {
      const targetChar = characters.find(c => c.id === rel.characterId);
      if (targetChar) {
        // Check if reciprocal already exists
        const reciprocalExists = targetChar.relatedTo.some(r => r.characterId === character.id);
        if (!reciprocalExists) {
          targetChar.relatedTo.push({ characterId: character.id, relation: '!' + rel.relation });
        } else {
          const reciprocal = targetChar.relatedTo.find(r => r.characterId === character.id);
          if (reciprocal) {
            reciprocal.relation = '!' + rel.relation;
          }
        }
      }
    });

    localStorage.setItem('characters', JSON.stringify(characters));
  },
  getCharacters: () => {
    const characters = localStorage.getItem('characters');
    return characters ? JSON.parse(characters) : [];
  },
  deleteCharacter: function (id: string): void {
    const characters = storage.getCharacters();
    const updated = characters.filter(c => c.id !== id);
    localStorage.setItem('characters', JSON.stringify(updated));
  }
};
