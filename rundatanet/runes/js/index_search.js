/*
This file contains code to do search in the inscriptions
*/

// Standard comparison operators that can be used both in QueryBuilderParser and custom search functions
export const operators = {
  equal: (a, b) => a == b,
  not_equal: (a, b) => a != b,
  in: (a, b) => b.includes(a),
  not_in: (a, b) => !b.includes(a),
  less: (a, b) => a < b,
  less_or_equal: (a, b) => a <= b,
  greater: (a, b) => a > b,
  greater_or_equal: (a, b) => a >= b,
  between: (a, b) => b[0] <= a && a <= b[1],
  not_between: (a, b) => !(b[0] <= a && a <= b[1]),
  begins_with: (a, b) => String(a).startsWith(String(b)),
  not_begins_with: (a, b) => !String(a).startsWith(String(b)),
  contains: (a, b) => String(a).includes(String(b)),
  not_contains: (a, b) => !String(a).includes(String(b)),
  ends_with: (a, b) => String(a).endsWith(String(b)),
  not_ends_with: (a, b) => !String(a).endsWith(String(b)),
  is_empty: (a) => a === '' || a === null || a === undefined || (Array.isArray(a) && a.length === 0),
  is_not_empty: (a) => a !== '' && a !== null && a !== undefined && (!Array.isArray(a) || a.length > 0),
  is_null: (a) => a === null || a === undefined,
  is_not_null: (a) => a !== null && a !== undefined,
};

/**
 * JavaScript processor for jQuery QueryBuilder rules.
 * This module allows searching through data using rules
 * generated by jQuery QueryBuilder's getRules() function.
 */

export class QueryBuilderParser {
  /**
   * Initialize the parser with standard operators
   */
  constructor(customSearchFunctions = {}) {
    // Use the external operators
    this.operators = { ...operators };
    this.customSearchFunctions = customSearchFunctions;
  }

  /**
   * Apply rules from jQuery QueryBuilder to filter a list of data.
   *
   * @param {Object} rules - Rules object from jQuery QueryBuilder's getRules() method
   * @param {Array} data - Array of objects (records) to filter
   * @returns {Array} Filtered list of records with match details
   */
  parseRules(rules, data) {
    if (!rules || !data) {
      return [];
    }

    // If rules are invalid, return empty array
    if (rules.valid === false) {
      return [];
    }

    const result = [];
    // If data is an array, process each item
    if (Array.isArray(data)) {
      data.forEach(item => {
        const resultWithDetails = this._evaluateGroup(rules, item);
        if (resultWithDetails.match) {
          result.push({
            record: item,
            matchDetails: resultWithDetails.details || null
          });
        }
      });
    }
    // If data is any iterable (e.g. a generator, Set, etc.)
    else if (typeof data[Symbol.iterator] === 'function') {
      for (const item of data) {
        const resultWithDetails = this._evaluateGroup(rules, item);
        if (resultWithDetails.match) {
          result.push({
            record: item,
            matchDetails: resultWithDetails.details || null
          });
        }
      }
    }
    // Fallback: if data implements the iterator protocol (has a next() method)
    else if (typeof data.next === 'function') {
      let nextItem = data.next();
      while (!nextItem.done) {
        const resultWithDetails = this._evaluateGroup(rules, nextItem.value);
        if (resultWithDetails.match) {
          result.push({
            record: nextItem.value,
            matchDetails: resultWithDetails.details || null
          });
        }
        nextItem = data.next();
      }
    } else {
      throw new Error('Data is not iterable. It must be an array or implement the iterator protocol.');
    }

    return result;
  }

  /**
   * Recursively evaluate a group of rules.
   *
   * @param {Object} group - Group object with condition and rules
   * @param {Object} record - Data record to evaluate against
   * @returns {Object} Object with match (boolean) and details (object) properties
   * @private
   */
  _evaluateGroup(group, record) {
    // Helper function to apply negation if needed
    const applyNegation = (result, shouldNegate) => {
      if (!shouldNegate) return result;

      return {
        match: !result.match
      };
    };

    if (!group.condition || !group.rules) {
      return applyNegation({ match: false }, group.not);
    }

    const condition = group.condition.toUpperCase();
    const rules = group.rules;

    if (!rules || !rules.length) {
      return applyNegation({ match: true }, group.not);
    }

    const results = rules.map(rule => {
      // If it's a nested group
      if (rule.rules) {
        return this._evaluateGroup(rule, record);
      }
      // It's a rule
      else if (rule.id && rule.operator) {
        return this._evaluateRule(rule, record);
      }
      return { match: false };
    });

    // Combine the results based on the condition
    let combinedResult = null;

    if (condition === 'AND') {
      const isMatch = results.every(result => result.match);
      // For AND condition, we collect all details
      const combinedDetails = isMatch ?
        results.reduce((acc, result) => {
          if (result.details) {
            Object.entries(result.details).forEach(([field, details]) => {
              if (!acc[field]) acc[field] = details;
              else if (Array.isArray(acc[field]) && Array.isArray(details)) {
                // Merge arrays and remove duplicates
                acc[field] = [...new Set([...acc[field], ...details])];
              }
            });
          }
          return acc;
        }, {}) : null;

      combinedResult = {
        match: isMatch,
        details: combinedDetails
      };
    } else if (condition === 'OR') {
      const matchingResults = results.filter(result => result.match);
      const isMatch = matchingResults.length > 0;

      // For OR condition, we take the first matching details
      combinedResult = {
        match: isMatch,
        details: isMatch ? matchingResults[0].details : null
      };
    } else {
      throw new Error(`Unknown condition: ${condition}`);
    }

    return applyNegation(combinedResult, group.not);
  }

  /**
   * Evaluate a single rule against a record.
   *
   * @param {Object} rule - Rule object with id, operator, and value
   * @param {Object} record - Data record to check against
   * @returns {Object} Object with match (boolean) and details (object) properties
   * @private
   */
  _evaluateRule(rule, record) {
    const field = rule.field || rule.id;
    const operatorName = rule.operator;
    const isMultiFieldRule = rule.data && rule.data.multiField === true;

    // Fast path: handle custom search functions first
    if (rule.id &&
        this.customSearchFunctions[rule.id] &&
        typeof this.customSearchFunctions[rule.id][operatorName] === "function") {

      // For custom functions, provide field value or entire record as needed
      const valueToCheck = isMultiFieldRule ? record : record[field];
      const result = this.customSearchFunctions[rule.id][operatorName](valueToCheck, rule.value);

      // Normalize the result to always have match and details properties
      return typeof result === 'object' && 'match' in result ?
        result : { match: Boolean(result) };
    }

    // For standard single-field rules, verify the field exists
    if (!isMultiFieldRule && !(field in record)) {
      return { match: false };
    }

    // For multi-field rules without custom handlers, we can't process with standard operators
    if (isMultiFieldRule) {
      return { match: false };
    }

    const fieldValue = record[field];

    // Handle special operators that don't need a value
    if (['is_empty', 'is_not_empty', 'is_null', 'is_not_null'].includes(operatorName)) {
      const result = this.operators[operatorName](fieldValue);
      return {
        match: result,
        details: result ? { [field]: true } : null
      };
    }

    // For regular operators, ensure we have a value to compare against
    const ruleValue = rule.value;
    if (ruleValue === null || ruleValue === undefined) {
      return { match: false };
    }

    if (typeof ruleValue === 'number' && fieldValue === '') {
      // Handle case where fieldValue is an empty string but ruleValue is a number
      return { match: false };
    }

    // Apply the operator and normalize the result
    const result = this.operators[operatorName](fieldValue, ruleValue);
    const isMatch = Boolean(result);

    return {
      match: isMatch,
      details: isMatch ? { [field]: true } : null
    };
  }

  /**
   * Add a custom operator function.
   *
   * @param {string} name - Name of the operator
   * @param {Function} func - Function that takes two arguments (fieldValue, ruleValue) and returns an object with match and details properties
   */
  addOperator(name, func) {
    this.operators[name] = func;
  }

  /**
   * Add a custom type converter.
   *
   * @param {string} typeName - Name of the type
   * @param {Function} func - Function that converts a value to the specified type
   */
  addTypeConverter(typeName, func) {
    this.typeConverters[typeName] = func;
  }
}

// Custom search functions using the new interface
const searchViaList = (fieldValue, ruleValue) => {
  const items = ruleValue.split('|');
  const match = items.some(item => item === fieldValue);
  return { match };
};

/**
 * Wrapper function for searching in signature_text and aliases
 * @param {Object} record - The complete record object containing signature_text and aliases
 * @param {string|Array} ruleValue - The value to search for
 * @param {Function} operatorFn - The comparison function to apply (e.g., String.includes, String.startsWith)
 * @param {boolean} [negate=false] - Whether to negate the result
 * @returns {Object} Result object with match property
 */
const searchSignatureWrapper = (record, ruleValue, operatorFn, negate = false) => {
  // Get the main signature text
  const signatureText = record.signature_text;

  // Get the aliases (if any) as an array
  const aliases = record.aliases ?
    record.aliases.split('|').map(a => a.trim()).filter(a => a) :
    [];

  // Combine into one array of values to check
  const allSignatures = [signatureText, ...aliases];

  // Process the rule value based on the input type
  const items = Array.isArray(ruleValue) ? ruleValue :
    (typeof ruleValue === 'string' && ruleValue.indexOf('|') > -1) ?
    ruleValue.split('|') :
    [ruleValue];

  // Apply the operator function to check if any signature matches any item
  let match = allSignatures.some(sig =>
    items.some(item => operatorFn(sig, item))
  );

  // Negate the result if needed
  if (negate) {
    match = !match;
  }

  return { match };
};

const doWordSearch = (entry, ruleValue, searchDirection, searchMode) => {
  const isAHit = getWordSearchFunction(searchMode);
  // key names defined in valueGetter, e.g. normalization_norse_to_transliteration
  const normalisationQuery = ruleValue['normalization'];
  const transliterationQuery = ruleValue['transliteration'];
  const namesMode = ruleValue['names_mode'];

  // Determine which normalization field to use
  const normalizationField = searchDirection.includes('norse') ?
    'normalisation_norse' : 'normalisation_scandinavian';

  const normalWords = entry[`${normalizationField}_words`];
  const transliterationWords = entry['transliteration_words'];

  let matchFound = false;
  let matchedWords = [];
  let numFoundNames = 0;

  // Helper function to check personal name constraints and record matches
  const processMatch = (index, isPersonal) => {
    // Skip if filtering by personal names and constraints are not met
    if ((namesMode === 'excludeNames' && isPersonal) ||
        (namesMode === 'namesOnly' && !isPersonal)) {
      return false;
    }

    matchFound = true;
    matchedWords.push(index);
    if (isPersonal) numFoundNames++;
    return true;
  };

  // Case 1: Both normalization and transliteration queries are present
  if (normalisationQuery && transliterationQuery) {
    for (let i = 0; i < Math.min(normalWords.length, transliterationWords.length); i++) {
      if (isAHit(normalWords[i], normalisationQuery) && isAHit(transliterationWords[i], transliterationQuery)) {
        processMatch(i, isPersonalName(normalWords[i]));
      }
    }
  }
  // Case 2: Only one query type is present
  else {
    // Check normalization words
    if (normalisationQuery) {
      normalWords.forEach((word, i) => {
        if (isAHit(word, normalisationQuery)) {
          processMatch(i, isPersonalName(word));
        }
      });
    }

    // Check transliteration words
    if (transliterationQuery) {
      transliterationWords.forEach((word, i) => {
        if (isAHit(word, transliterationQuery)) {
          // transliterated words don't contain personal name annotation
          const isPersonal = (i < normalWords.length) && isPersonalName(normalWords[i]);
          processMatch(i, isPersonal);
        }
      });
    }
  }

  return {
    match: matchFound,
    details: matchFound ? {
      wordIndices: matchedWords,
      numPersonalNames: numFoundNames
    } : null
  };
};

const searchCrossForm = (crosses, ruleValue) => {
  if (!crosses || crosses.length === 0) {
    return { match: false };
  }

  const ruleIsCertain = parseInt(ruleValue.is_certain, 10);
  const searchForm = ruleValue.form;

  // Flatten the array structure and search through all elements
  for (const cross of crosses) {
    if (!Array.isArray(cross)) continue;

    for (const group of cross) {
      if (!Array.isArray(group)) continue;

      for (const element of group) {
        // Check if the form name matches
        if (element.name === searchForm) {
          // If certainty doesn't matter (option 2) or certainty matches
          if (ruleIsCertain === 2 || ruleIsCertain === element.isCertain) {
            return { match: true };
          }
        }
      }
    }
  }

  return { match: false };
};

const searchHasPersonalName = (numNames, ruleValue) => {
  const isMatch = ruleValue === 0 ? numNames === 0 : numNames > 0;
  return { match: isMatch };
};

const searchCountryOrProvince = (entry, ruleValues) => {
  for (let i = 0; i < ruleValues.length; i++) {
    // let areaCode = ruleValues[i];
    if (ruleValues[i] == 'all_sweden') {
      const areaCodes = ['Öl ', 'Ög ', 'Sö ', 'Sm ', 'Vg ', 'U ', 'Vs ', 'Nä ', 'Vr ', 'Gs ', 'Hs ', 'M ', 'Ån ', 'D ', 'Hr ', 'J ', 'Lp ', 'Ds ', 'Bo ', 'G ', 'SE ', 'Bo'];
      for (let j = 0; j < areaCodes.length; j++) {
        if (operators.begins_with(entry['signature_text'], areaCodes[j])) {
          return { match: true };
        }
      }
      const districts = ['Skåne', 'Halland', 'Blekinge'];
      for (let j = 0; j < districts.length; j++) {
        if (operators.contains(entry['district'], districts[j])) {
          return { match: true };
        }
      }
      return { match: false };
    }
    if (operators.begins_with(entry['signature_text'], ruleValues[i])) {
      return { match: true };
    }
  }
  return { match: false };
}

const customSearchFunctions = {
  inscription_id: {
    in: (record, ruleValue) => searchSignatureWrapper(record, ruleValue, operators.equal),
    in_separated_list: (record, ruleValue) => searchSignatureWrapper(record, ruleValue, operators.equal),
    begins_with: (record, ruleValue) => searchSignatureWrapper(record, ruleValue, operators.begins_with),
    not_begins_with: (record, ruleValue) => searchSignatureWrapper(record, ruleValue, operators.begins_with, true),
    ends_with: (record, ruleValue) => searchSignatureWrapper(record, ruleValue, operators.ends_with),
    not_ends_with: (record, ruleValue) => searchSignatureWrapper(record, ruleValue, operators.ends_with, true),
    contains: (record, ruleValue) => searchSignatureWrapper(record, ruleValue, operators.contains),
    not_contains: (record, ruleValue) => searchSignatureWrapper(record, ruleValue, operators.contains, true),
    equal: (record, ruleValue) => searchSignatureWrapper(record, ruleValue, operators.equal),
    not_equal: (record, ruleValue) => searchSignatureWrapper(record, ruleValue, operators.not_equal),
  },
  inscription_country: {
    in: searchCountryOrProvince,
  },
  normalization_norse_to_transliteration: {
    contains: (fieldValue, ruleValue) => {
      return doWordSearch(fieldValue, ruleValue, 'norseToTransliteration', 'includes');
    },
    equal: (fieldValue, ruleValue) => {
      return doWordSearch(fieldValue, ruleValue, 'norseToTransliteration', 'exact');
    },
    begins_with: (fieldValue, ruleValue) => {
      return doWordSearch(fieldValue, ruleValue, 'norseToTransliteration', 'beginsWith');
    },
    ends_with: (fieldValue, ruleValue) => {
      return doWordSearch(fieldValue, ruleValue, 'norseToTransliteration', 'endsWith');
    },
  },
  normalization_scandinavian_to_transliteration: {
    contains: (fieldValue, ruleValue) => {
      return doWordSearch(fieldValue, ruleValue, 'scandinavianToTransliteration', 'includes');
    },
    equal: (fieldValue, ruleValue) => {
      return doWordSearch(fieldValue, ruleValue, 'scandinavianToTransliteration', 'exact');
    },
    begins_with: (fieldValue, ruleValue) => {
      return doWordSearch(fieldValue, ruleValue, 'scandinavianToTransliteration', 'beginsWith');
    },
    ends_with: (fieldValue, ruleValue) => {
      return doWordSearch(fieldValue, ruleValue, 'scandinavianToTransliteration', 'endsWith');
    },
  },
  cross_form: {
    cross_form: searchCrossForm,
  },
  has_personal_name: {
    equal: searchHasPersonalName,
    not_equal: (fieldValue, ruleValue) => {
      const result = searchHasPersonalName(fieldValue, ruleValue);
      return { match: !result.match };
    },
  },
};

/**
 * Returns a word search function based on the specified search mode
 * @param {string} searchMode - The search mode ('exact', 'beginsWith', 'endsWith', 'regex', 'includes')
 * @param {Object} options - Additional options
 * @param {boolean} [options.ignoreCase=false] - Whether to ignore case when searching
 * @returns {Function} A search function that takes (word, query) parameters
 * @throws {Error} When an invalid regex pattern is provided in regex mode
 */
export function getWordSearchFunction(searchMode, options = {}) {
  const { ignoreCase = false } = options;

  // Create a function to handle case sensitivity
  const prepareString = ignoreCase
    ? str => String(str).toLowerCase()
    : str => String(str);

  const prepareWord = (word) => {
    // Check if this might be a list of personal names (divided by HTML escaped / symbol)
    if (word.includes('&#x2F;') || word.includes('/')) {
      // Split by the HTML escaped slash or regular slash
      const names = word.split(/&#x2F;|\//).map(name => {
        // Trim whitespace and remove quotes (both regular and HTML escaped) from the beginning
        return name.trim().replace(/^(&quot;|")/, '');
      });
      // Return the array of individual names
      return names;
    }

    // If it's not a list, just return the original word
    return [word];
  }

  switch (searchMode) {
    case 'exact':
      return (word, query) => {
        const words = prepareWord(word);
        // Check if any of the words match the query
        return words.some(w => prepareString(w) === prepareString(query));
      }

    case 'beginsWith':
      return (word, query) => {
        const words = prepareWord(word);
        // Check if any of the words start with the query
        return words.some(w => prepareString(w).startsWith(prepareString(query)));
      }

    case 'endsWith':
      return (word, query) => {
        const words = prepareWord(word);
        // Check if any of the words end with the query
        return words.some(w => prepareString(w).endsWith(prepareString(query)));
      }

    case 'regex': {
      return (word, query) => {
        try {
          const flags = ignoreCase ? 'i' : '';
          // Create RegExp only once per query
          const regex = new RegExp(query, flags);
          return regex.test(word);
        } catch (error) {
          throw new Error(`Invalid regex pattern: ${query}`);
        }
      };
    }

    case 'includes':
    default:
      return (word, query) => {
        const words = prepareWord(word);
        // Check if any of the words include the query
        return words.some(w => prepareString(w).includes(prepareString(query)));
      }
  }
}


/**
 * Perform a search using QueryBuilder rules
 * @param {Object} rules - Rules object from jQuery QueryBuilder's getRules() method
 * @param {Array|Iterable} dbMap - Data to search through
 * @returns {Array} Array of objects that match search rules. Each item includes record data from
 *                  dbMap and matchDetails property with details of the match.
 */
export function doSearch(rules, dbMap) {
  const parser = new QueryBuilderParser(customSearchFunctions);
  const resultsRaw = parser.parseRules(rules, dbMap);
  const results = resultsRaw.map(({ record, matchDetails }) => ({
    ...record,
    matchDetails
  }));

  return results;
}

export function calcWordsAndPersonalNames(dbMap) {
  let totalWordMatches = 0;
  let totalPersonalNames = 0;
  let totalSignatures = 0;

  try {
    const entries = dbMap.values();
    for (const entry of entries) {
      if (entry.matchDetails && entry.matchDetails.wordIndices) {
        totalWordMatches += entry.matchDetails.wordIndices.length;
        totalPersonalNames += entry.matchDetails.numPersonalNames;
      } else {
        totalWordMatches += entry.normalisation_norse_word_boundaries.length;
        entry.normalisation_norse_word_boundaries.forEach(boundary => {
          totalPersonalNames += boundary.isPersonal;
        });
      }
      totalSignatures++;
    }
  } catch (error) {
    console.error('Error calculating words and personal names:', error);
  }

  $(document).trigger('updateSignatureCount', { count: totalSignatures });
  $(document).trigger('updateWordCount', { count: totalWordMatches });
  $(document).trigger('updatePersonalNameCount', { count: totalPersonalNames });
}

export function highlightWordsFromWordBoundaries(str, wordBoundaries) {
  // Sort the indices to ensure they are processed in the correct order
  wordBoundaries.sort((a, b) => a.start - b.start);

  let highlightedStr = '';
  let lastIndex = 0;

  wordBoundaries.forEach(({start, end, text}) => {
    // Append the part of the string before the current word
    highlightedStr += str.slice(lastIndex, start);
    // Wrap the word in a <span> tag and append it
    highlightedStr += `<span class="highlight">${str.slice(start, end)}</span>`;
    // Update the lastIndex to the end of the current word
    lastIndex = end;
  });

  // Append the remaining part of the string after the last word
  highlightedStr += str.slice(lastIndex);

  return highlightedStr;
}
