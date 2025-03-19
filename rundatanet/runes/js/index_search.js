/*
This file contains code to do search in the inscriptions
*/

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
    // Dictionary mapping operator names to functions
    this.operators = {
      equal: (a, b) => ({ match: a == b }),
      not_equal: (a, b) => ({ match: a != b }),
      in: (a, b) => ({ match: b.includes(a) }),
      not_in: (a, b) => ({ match: !b.includes(a) }),
      less: (a, b) => ({ match: a < b }),
      less_or_equal: (a, b) => ({ match: a <= b }),
      greater: (a, b) => ({ match: a > b }),
      greater_or_equal: (a, b) => ({ match: a >= b }),
      between: (a, b) => ({ match: b[0] <= a && a <= b[1] }),
      not_between: (a, b) => ({ match: !(b[0] <= a && a <= b[1]) }),
      begins_with: (a, b) => ({ match: String(a).startsWith(String(b)) }),
      not_begins_with: (a, b) => ({ match: !String(a).startsWith(String(b)) }),
      contains: (a, b) => ({ match: String(a).includes(String(b)) }),
      not_contains: (a, b) => ({ match: !String(a).includes(String(b)) }),
      ends_with: (a, b) => ({ match: String(a).endsWith(String(b)) }),
      not_ends_with: (a, b) => ({ match: !String(a).endsWith(String(b)) }),
      is_empty: (a) => ({ match: a === '' || a === null || a === undefined || (Array.isArray(a) && a.length === 0) }),
      is_not_empty: (a) => ({ match: a !== '' && a !== null && a !== undefined && (!Array.isArray(a) || a.length > 0) }),
      is_null: (a) => ({ match: a === null || a === undefined }),
      is_not_null: (a) => ({ match: a !== null && a !== undefined }),
      in_separated_list: (a, b) => ({ match: false }),
    };
    this.customSearchFunctions = customSearchFunctions;
  
    // Type converters for handling different data types
    this.typeConverters = {
      string: (x) => String(x),
      integer: (x) => parseInt(x, 10),
      double: (x) => parseFloat(x),
      date: (x) => {
        if (x instanceof Date) return x;
        return new Date(x);
      },
      time: (x) => {
        if (typeof x === 'string') {
          const [hours, minutes] = x.split(':').map(Number);
          const date = new Date();
          date.setHours(hours, minutes, 0, 0);
          return date;
        }
        return x;
      },
      datetime: (x) => {
        if (x instanceof Date) return x;
        return new Date(x);
      },
      boolean: (x) => {
        if (typeof x === 'string') {
          return ['true', 'yes', '1'].includes(x.toLowerCase());
        }
        return Boolean(x);
      }
    };
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
    if (!group.condition || !group.rules) {
      return { match: false };
    }

    const condition = group.condition.toUpperCase();
    const rules = group.rules;

    if (!rules || !rules.length) {
      return { match: true };
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
      
      return { 
        match: isMatch,
        details: combinedDetails
      };
    } else if (condition === 'OR') {
      const matchingResults = results.filter(result => result.match);
      const isMatch = matchingResults.length > 0;
      
      // For OR condition, we take the first matching details
      return {
        match: isMatch,
        details: isMatch ? matchingResults[0].details : null
      };
    } else {
      throw new Error(`Unknown condition: ${condition}`);
    }
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
    // Check if this is a special multi-field rule
    const isMultiFieldRule = rule.data && rule.data.multiField === true;

    // For standard single-field rules, verify the field exists
    if (!isMultiFieldRule && !(field in record)) {
      return { match: false };
    }

    const operatorName = rule.operator;
    if (!this.operators[operatorName]) {
      throw new Error(`Unknown operator: ${operatorName}`);
    }

    // For multi-field rules, pass the entire record
    // Otherwise, get the specific field value
    const fieldValue = isMultiFieldRule ? record : record[field];

    // Handle special operators that don't need a value
    if (['is_empty', 'is_not_empty', 'is_null', 'is_not_null'].includes(operatorName)) {
      const result = this.operators[operatorName](fieldValue);
      return {
        match: result.match,
        details: result.match && !isMultiFieldRule ? { [field]: true } : null
      };
    }

    // Get the rule value
    const ruleValue = rule.value;
    if (ruleValue === null || ruleValue === undefined) {
      return { match: false };
    }

    // For multi-field rules, skip type conversion as it would be
    // handled by the custom function
    let convertedFieldValue = fieldValue;
    let convertedRuleValue = ruleValue;

    if (!isMultiFieldRule) {
      const valueType = rule.type;
      if (valueType && this.typeConverters[valueType]) {
        const converter = this.typeConverters[valueType];
        try {
          if (Array.isArray(ruleValue)) {
            convertedRuleValue = ruleValue.map(v => converter(v));
          } else {
            convertedRuleValue = converter(ruleValue);
          }
          
          if (!Array.isArray(fieldValue)) {
            convertedFieldValue = converter(fieldValue);
          }
        } catch (e) {
          return { match: false };
        }
      }
    }

    // If a custom search function exists for this rule id and operator, call it.
    if (
      rule.id &&
      this.customSearchFunctions[rule.id] &&
      typeof this.customSearchFunctions[rule.id][operatorName] === "function"
    ) {
      const result = this.customSearchFunctions[rule.id][operatorName](convertedFieldValue, convertedRuleValue);
      return typeof result === 'object' && 'match' in result ? 
        result : 
        { match: Boolean(result) };
    }

    // For multi-field rules without a custom function, return false
    // as we don't know how to handle them with standard operators
    if (isMultiFieldRule) {
      return { match: false };
    }

    // Apply the operator
    const result = this.operators[operatorName](convertedFieldValue, convertedRuleValue);
    return typeof result === 'object' && 'match' in result ? 
      { ...result, details: result.match ? { [field]: true } : null } : 
      { match: Boolean(result) };
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

const doWordSearch = (entry, ruleValue, searchDirection, searchMode) => {
  const isAHit = getWordSearchFunction(searchMode);
  const normalisationQuery = ruleValue['normalization'];
  const transliterationQuery = ruleValue['transliteration'];
  const namesMode = ruleValue['namesMode'];

  // Determine which normalization field to use
  let normalizationField;
  if (searchDirection.includes('norse')) {
    normalizationField = 'normalisation_norse';
  } else {
    normalizationField = 'normalisation_scandinavian';
  }

  const normalWords = entry[`${normalizationField}_words`];
  const normalisationText = entry[normalizationField];
  const transliterationWords = entry['transliteration_words'];
  const transliterationText = entry['transliteration'];

  let matchFound = false;
  let matchedWords = [];
  let numFoundNames = 0;
  let personalNamePresent = false;

  if (normalisationQuery && transliterationQuery) {
    for (let i = 0; i < Math.min(normalWords.length, transliterationWords.length); i++) {
      if (isAHit(normalWords[i], normalisationQuery) && isAHit(transliterationWords[i], transliterationQuery)) {
        personalNamePresent = isPersonalName(normalWords[i]);
        if (namesMode === 'excludeNames' && personalNamePresent) {
          continue;
        }
        if (namesMode === 'namesOnly' && !personalNamePresent) {
          continue;
        }

        matchFound = true;
        matchedWords.push(i);
        if (personalNamePresent) {
          numFoundNames++;
        }
      }
    }
  } else {
    if (normalisationQuery) {
      normalWords.forEach((word, i) => {
        if (isAHit(word, normalisationQuery)) {
          personalNamePresent = isPersonalName(word);
          if (namesMode === 'excludeNames' && personalNamePresent) {
            return;
          }
          if (namesMode === 'namesOnly' && !personalNamePresent) {
            return;
          }

          matchFound = true;
          matchedWords.push(i);
          if (personalNamePresent) {
            numFoundNames++;
          }
        }
      });
    }
    if (transliterationQuery) {
      transliterationWords.forEach((word, i) => {
        if (isAHit(word, transliterationQuery)) {
          // transliterated words do not contain personal name annotation, use normalised word instead
          personalNamePresent = true ? (i < normalWords.length) && isPersonalName(normalWords[i]) : false;

          if (namesMode == 'excludeNames' && personalNamePresent) {
            return;
          }
          if (namesMode == 'namesOnly' && !personalNamePresent) {
            return;
          }
          matchFound = true;
          matchedWords.push(i);
          if (personalNamePresent) {
            numFoundNames++;
          }
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

const customSearchFunctions = {
  signature_text: {
    in: searchViaList,
    in_separated_list: searchViaList,
  },
  normalization_norse_to_transliteration: {
    contains: (fieldValue, ruleValue) => {
      return doWordSearch(fieldValue, ruleValue, 'norseToTransliteration', 'includes');
    }
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
  
  switch (searchMode) {
    case 'exact':
      return (word, query) => prepareString(word) === prepareString(query);
      
    case 'beginsWith':
      return (word, query) => prepareString(word).startsWith(prepareString(query));
      
    case 'endsWith':
      return (word, query) => prepareString(word).endsWith(prepareString(query));
      
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
      return (word, query) => prepareString(word).includes(prepareString(query));
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

  dbMap.forEach(entry => {
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
  });

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
