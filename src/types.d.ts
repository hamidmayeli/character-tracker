interface IStorage {
  saveCharacter: (character: ICharacter) => void;
  getCharacters: () => ICharacter[];
}

interface ICharacter {
  id: string;
  name: string;
  aliases: string[];
  description: string;
  relatedTo: string[];
}
