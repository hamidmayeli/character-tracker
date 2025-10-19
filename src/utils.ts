/**
 * Capitalizes the first letter of each word in a string.
 * Handles multiple spaces and preserves original spacing.
 * 
 * @param text The text to capitalize
 * @returns The text with the first letter of each word capitalized
 * 
 * @example
 * capitalizeWords('hamid mayeli') // 'Hamid Mayeli'
 * capitalizeWords('john doe smith') // 'John Doe Smith'
 * capitalizeWords('  multiple   spaces  ') // '  Multiple   Spaces  '
 */
export function capitalizeWords(text: string): string {
  if (!text || typeof text !== 'string') {
    return text;
  }
  
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
}
