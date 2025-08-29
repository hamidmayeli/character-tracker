export const storage: IStorage = {
  saveCharacter: (character) => {
    if (character.id === '') {
      character.id = Date.now().toString();
    }

    const characters = storage.getCharacters();
    characters.push(character);
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
