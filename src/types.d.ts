interface IStorage {
  saveCharacter: (character: ICharacter) => void;
  deleteCharacter: (id: string) => void;
  getCharacters: () => ICharacter[];
}

interface IRelatedCharacter {
  characterId: string;
  relation: string;
}

interface ICharacter {
  id: string;
  name: string;
  aliases: string[];
  description: string;
  relatedTo: IRelatedCharacter[];
}
