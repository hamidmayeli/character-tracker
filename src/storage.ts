export const storage: IStorage = {
  saveCharacter: (character) => {
    const characters = storage.getCharacters();
    characters.push(character);
    localStorage.setItem('characters', JSON.stringify(characters));
  },
  getCharacters: () => {
    const characters = localStorage.getItem('characters');
    return characters ? JSON.parse(characters) : [];
  },
};
