/**
 * Shared search helpers used by both the main index page and the EDA page.
 */

/**
 * Checks if a given word is a personal name.
 * @param {string} word - The word to check.
 * @returns {boolean} - True if the word is a personal name, false otherwise.
 */
export function isPersonalName(word) {
  return word.startsWith('"') || word.startsWith('&quot;')
    || word.includes('/"') || word.includes('/&quot;');
}

/**
 * Normalizes whitespace in a string by replacing all whitespace characters
 * with regular spaces.
 *
 * @param {*} value - The value to normalize
 * @returns {string} The normalized string
 */
export function normalizeWhitespace(value) {
  return String(value).replace(/\s/g, ' ');
}

/**
 * Prepares a string for comparison by normalizing whitespace and optionally lowercasing.
 * @param {*} value - The value to prepare
 * @param {boolean} ignoreCase - Whether to lowercase the string
 * @returns {string} The prepared string
 */
export function prepareForComparison(value, ignoreCase) {
  const normalizedValue = normalizeWhitespace(value);
  return ignoreCase ? normalizedValue.toLowerCase() : normalizedValue;
}

/**
 * Strips editorial special symbols from a string so that searches can match
 * text regardless of annotation markers.
 *
 * Handles both literal characters and HTML-entity forms.
 *
 * @param {string} str - The string to strip
 * @returns {string} The string with special symbols removed
 */
export function stripSpecialSymbols(str) {
  return String(str)
    .replace(/&quot;/g, '')
    .replace(/&lt;/g, '')
    .replace(/&gt;/g, '')
    .replace(/["<>|[\](){}^\u00b4?]/g, '');
}

/**
 * Returns a word search function based on the specified search mode.
 * @param {string} searchMode - The search mode ('exact', 'beginsWith', 'endsWith', 'regex', 'includes', 'contains'). 'contains' is an alias for 'includes'.
 * @param {Object} options - Additional options
 * @param {boolean} [options.ignoreCase=false] - Whether to ignore case when searching
 * @param {boolean} [options.includeSpecialSymbols=false] - Whether to keep editorial symbols in comparisons
 * @returns {Function} A search function that takes (word, query) parameters
 * @throws {Error} When an invalid regex pattern is provided in regex mode
 */
export function getWordSearchFunction(searchMode, options = {}) {
  const { ignoreCase = false, includeSpecialSymbols = false } = options;
  const normalizedSearchMode = searchMode === 'contains' ? 'includes' : searchMode;

  const prepareString = (str) => {
    let preparedValue = prepareForComparison(str, ignoreCase);
    if (!includeSpecialSymbols) {
      preparedValue = stripSpecialSymbols(preparedValue);
    }
    return preparedValue;
  };

  const prepareWord = (word) => {
    if (word.includes('&#x2F;') || word.includes('/')) {
      return word.split(/&#x2F;|\//).map(name => {
        return name.trim().replace(/^(&quot;|")/, '');
      });
    }

    return [word];
  };

  switch (normalizedSearchMode) {
    case 'exact':
      return (word, query) => {
        const words = prepareWord(word);
        return words.some(oneWord => prepareString(oneWord) === prepareString(query));
      };

    case 'beginsWith':
      return (word, query) => {
        const words = prepareWord(word);
        return words.some(oneWord => prepareString(oneWord).startsWith(prepareString(query)));
      };

    case 'endsWith':
      return (word, query) => {
        const words = prepareWord(word);
        return words.some(oneWord => prepareString(oneWord).endsWith(prepareString(query)));
      };

    case 'regex':
      return (word, query) => {
        try {
          const flags = ignoreCase ? 'i' : '';
          const regex = new RegExp(query, flags);
          return regex.test(word);
        } catch (error) {
          throw new Error(`Invalid regex pattern: ${query}`);
        }
      };

    case 'includes':
    default:
      return (word, query) => {
        const words = prepareWord(word);
        return words.some(oneWord => prepareString(oneWord).includes(prepareString(query)));
      };
  }
}

/**
 * Returns field mapping for supported directional word searches.
 * @param {string} searchDirection - Direction identifier
 * @returns {{normalisationField: string, fromField: string, toField: string}|null}
 */
export function getSearchDirectionConfig(searchDirection) {
  switch (searchDirection) {
    case 'norseToTransliteration':
      return {
        normalisationField: 'normalisation_norse',
        fromField: 'normalisation_norse',
        toField: 'transliteration',
      };
    case 'scandinavianToTransliteration':
      return {
        normalisationField: 'normalisation_scandinavian',
        fromField: 'normalisation_scandinavian',
        toField: 'transliteration',
      };
    case 'transliterationToNorse':
      return {
        normalisationField: 'normalisation_norse',
        fromField: 'transliteration',
        toField: 'normalisation_norse',
      };
    case 'transliterationToScandinavian':
      return {
        normalisationField: 'normalisation_scandinavian',
        fromField: 'transliteration',
        toField: 'normalisation_scandinavian',
      };
    default:
      return null;
  }
}
