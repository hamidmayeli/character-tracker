import { storage } from '../storage';
import en from './en.json';
import fa from './fa.json';

export const languages = {
  en,
  fa,
};

export type LanguageKey = Exclude<keyof typeof en, 'direction'>;

export function t(key: LanguageKey): string {
  return languages[storage.getSelectedLanguage()][key] || key;
}
