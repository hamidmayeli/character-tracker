interface IStorage {
  saveCharacter: (character: ICharacter) => void;
  deleteCharacter: (id: string) => void;
  getCharacters: () => ICharacter[];
}

interface ICharacter {
  id: string;
  name: string;
  aliases: string[];
  description: string;
  relatedTo: string[];
}
