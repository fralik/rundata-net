import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { doSearch, highlightWordsFromWordBoundaries, isTranslationSearch } from '../../runes/js/index_search.js';
import { mockDb } from './mockDb.js';
import { convertDbToKeyMap } from '../../runes/js/index_scripts.js';

// Process mockDb once at the module level
const dbMap = convertDbToKeyMap(mockDb);

// Test suite for isTranslationSearch function
test('isTranslationSearch with english_translation field', () => {
  const rules = {
    condition: 'AND',
    rules: [
      {
        id: 'english_translation',
        field: 'english_translation',
        type: 'string',
        input: 'text',
        operator: 'contains',
        value: 'horse'
      }
    ],
    valid: true
  };
  const result = isTranslationSearch(rules);
  assert.is(result, true, 'Should return true for english_translation search');
});

test('isTranslationSearch with swedish_translation field', () => {
  const rules = {
    condition: 'AND',
    rules: [
      {
        id: 'swedish_translation',
        field: 'swedish_translation',
        type: 'string',
        input: 'text',
        operator: 'contains',
        value: 'häst'
      }
    ],
    valid: true
  };
  const result = isTranslationSearch(rules);
  assert.is(result, true, 'Should return true for swedish_translation search');
});

test('isTranslationSearch with non-translation field', () => {
  const rules = {
    condition: 'AND',
    rules: [
      {
        id: 'transliteration',
        field: 'transliteration',
        type: 'string',
        input: 'text',
        operator: 'contains',
        value: 'test'
      }
    ],
    valid: true
  };
  const result = isTranslationSearch(rules);
  assert.is(result, false, 'Should return false for non-translation search');
});

test('isTranslationSearch with nested rules containing translation field', () => {
  const rules = {
    condition: 'AND',
    rules: [
      {
        condition: 'OR',
        rules: [
          {
            id: 'english_translation',
            field: 'english_translation',
            type: 'string',
            input: 'text',
            operator: 'contains',
            value: 'horse'
          },
          {
            id: 'transliteration',
            field: 'transliteration',
            type: 'string',
            input: 'text',
            operator: 'contains',
            value: 'test'
          }
        ]
      }
    ],
    valid: true
  };
  const result = isTranslationSearch(rules);
  assert.is(result, true, 'Should return true for nested rules with translation field');
});

test('isTranslationSearch with nested rules without translation field', () => {
  const rules = {
    condition: 'AND',
    rules: [
      {
        condition: 'OR',
        rules: [
          {
            id: 'transliteration',
            field: 'transliteration',
            type: 'string',
            input: 'text',
            operator: 'contains',
            value: 'test'
          },
          {
            id: 'signature_text',
            field: 'signature_text',
            type: 'string',
            input: 'text',
            operator: 'contains',
            value: 'test2'
          }
        ]
      }
    ],
    valid: true
  };
  const result = isTranslationSearch(rules);
  assert.is(result, false, 'Should return false for nested rules without translation field');
});

test('isTranslationSearch with null rules', () => {
  const result = isTranslationSearch(null);
  assert.is(result, false, 'Should return false for null rules');
});

test('isTranslationSearch with empty rules', () => {
  const rules = {
    condition: 'AND',
    rules: [],
    valid: true
  };
  const result = isTranslationSearch(rules);
  assert.is(result, false, 'Should return false for empty rules');
});

// Test suite for highlightWordsFromWordBoundaries function
test('highlightWordsFromWordBoundaries with single word', () => {
  const str = 'This is a test string';
  const wordBoundaries = [
    { start: 5, end: 7, text: 'is' }
  ];
  const result = highlightWordsFromWordBoundaries(str, wordBoundaries);
  const expected = 'This <span class="highlight">is</span> a test string';
  assert.is(result, expected, 'Should highlight a single word correctly');
});

test('highlightWordsFromWordBoundaries with multiple words', () => {
  const str = 'Testing multiple words in this string';
  const wordBoundaries = [
    { start: 0, end: 7, text: 'Testing' },
    { start: 17, end: 22, text: 'words' },
    { start: 26, end: 30, text: 'this' }
  ];
  const result = highlightWordsFromWordBoundaries(str, wordBoundaries);
  const expected = '<span class="highlight">Testing</span> multiple <span class="highlight">words</span> in <span class="highlight">this</span> string';
  assert.is(result, expected, 'Should highlight multiple words correctly');
});

test('highlightWordsFromWordBoundaries with unsorted boundaries', () => {
  const str = 'Words in random order';
  const words = ['order', 'Words', 'random'];
  const wordBoundaries = words.map(word => {
    const start = str.indexOf(word);
    const end = start + word.length;
    return { start, end, text: word };
  });

  const result = highlightWordsFromWordBoundaries(str, wordBoundaries);
  const expected = '<span class="highlight">Words</span> in <span class="highlight">random</span> <span class="highlight">order</span>';
  assert.is(result, expected, 'Should sort boundaries and highlight words correctly');
});

test('highlightWordsFromWordBoundaries with adjacent words', () => {
  const str = 'Adjacent words test';
  const wordBoundaries = [
    { start: 0, end: 8, text: 'Adjacent' },
    { start: 9, end: 14, text: 'words' }
  ];
  const result = highlightWordsFromWordBoundaries(str, wordBoundaries);
  const expected = '<span class="highlight">Adjacent</span> <span class="highlight">words</span> test';
  assert.is(result, expected, 'Should highlight adjacent words correctly');
});

test('highlightWordsFromWordBoundaries with empty string', () => {
  const str = '';
  const wordBoundaries = [
    { start: 0, end: 0, text: '' }
  ];
  const result = highlightWordsFromWordBoundaries(str, wordBoundaries);
  const expected = '<span class="highlight"></span>';
  assert.is(result, expected, 'Should handle empty string correctly');
});

test('highlightWordsFromWordBoundaries with no boundaries', () => {
  const str = 'No boundaries to highlight';
  const wordBoundaries = [];
  const result = highlightWordsFromWordBoundaries(str, wordBoundaries);
  const expected = 'No boundaries to highlight';
  assert.is(result, expected, 'Should return original string when no boundaries are provided');
});


// Helper function to create a readable string representation of the search value
function getValueAsString(value) {
  if (value === null) {
    return 'null';
  } else if (Array.isArray(value)) {
    return '[' + value.map(v => `"${v}"`).join(', ') + ']';
  } else if (typeof value === 'object') {
    return JSON.stringify(value);
  } else {
    return `"${value}"`;
  }
}

/**
 * Test function for searching inscriptions using a single rule
 * 
 * @param {Object} options - The options for the search test
 * @param {string} options.operator - The operator to use for the search rule (e.g., 'equal', 'contains')
 * @param {*} options.value - The value to search for
 * @param {number} options.expectedCount - The number of results expected to be found
 * @param {string} [options.testName] - Custom name for the test (defaults to a generated name using field and operator)
 * @param {string|null} [options.id] - Custom id for the rule (defaults to field name)
 * @param {*} [options.firstResultCheck] - Value to check against the first result's field (if provided)
 * @param {boolean} [options.multiField=false] - Whether the search rule is multi-field or not
 * @param {string} [options.condition='AND'] - The condition to use for combining rules
 * @param {string} [options.field='signature_text'] - The field to search in
 * @returns {void}
 */
function testSingleRuleSearch({
  operator, 
  value, 
  expectedCount, 
  testName,
  id = null,
  firstResultCheck = null,
  multiField = false,
  condition = 'AND',
  field = 'signature_text'
}) {
  test(testName || `search inscription via ${field}::${operator} (${getValueAsString(value)})`, () => {
    const rules = {
      condition: condition,
      rules: [
        {
          id: id || field,
          field: field,
          type: 'string',
          input: 'text',
          operator: operator,
          value: value,
          data: multiField ? { multiField: true } : {}
        }
      ],
      not: false,
      valid: true
    };
    
    const result = doSearch(rules, dbMap.values());
    
    assert.is(result.length, expectedCount, `Should find ${expectedCount} inscriptions`);
    
    if (firstResultCheck) {
      if (typeof firstResultCheck === 'object') {
        const fieldDataStr = JSON.stringify(result[0][field]);
        const firstResultCheckStr = JSON.stringify(firstResultCheck);
        assert.is(fieldDataStr, firstResultCheckStr, `First result should be ${firstResultCheckStr}`);
      } else {
        assert.is(result[0][field], firstResultCheck, `First result should be ${firstResultCheck}`);
      }
    }
  });
}

testSingleRuleSearch({
  id: 'inscription_id',
  operator: 'in',
  value: 'Öl 1',
  expectedCount: 1,
  testName: 'search one inscription',
  firstResultCheck: 'Öl 1',
  multiField: true,
});
testSingleRuleSearch({
  id: 'inscription_id',
  operator: 'in',
  value: ['Öl 1', 'Öl 2'],
  expectedCount: 2,
  testName: 'search multiple inscriptions by id',
  multiField: true,
});
testSingleRuleSearch({
  id: 'inscription_id',
  operator: 'in_separated_list',
  value: 'Öl 1|Öl 2|Öl 12',
  expectedCount: 3,
  multiField: true,
});
testSingleRuleSearch({
  id: 'inscription_id',
  operator: 'begins_with',
  value: 'Öl 1',
  expectedCount: 11,
  firstResultCheck: 'Öl 1',
  multiField: true,
});
testSingleRuleSearch({
  id: 'inscription_id',
  operator: 'not_begins_with',
  value: 'Öl 1',
  expectedCount: 6804,
  firstResultCheck: 'Öl 2',
  multiField: true,
});
testSingleRuleSearch({
  id: 'inscription_id',
  operator: 'ends_with',
  value: '4',
  expectedCount: 1026,
  firstResultCheck: 'Öl 2',
  multiField: true,
});
testSingleRuleSearch({
  id: 'inscription_id',
  operator: 'not_ends_with',
  value: '4',
  expectedCount: 5789,
  firstResultCheck: 'Öl 1',
  multiField: true,
});
testSingleRuleSearch({
  id: 'inscription_id',
  operator: 'contains',
  value: 'Öl',
  expectedCount: 190,
  firstResultCheck: 'Öl 1',
  multiField: true,
});
testSingleRuleSearch({
  id: 'inscription_id',
  operator: 'not_contains',
  value: 'Öl',
  expectedCount: 6625,
  firstResultCheck: 'Ög 1',
  multiField: true,
});


testSingleRuleSearch({
  id: 'inscription_country',
  field: 'signature_text',
  operator: 'in',
  value: ['Öl', 'Sm'],
  expectedCount: 385,
  firstResultCheck: 'Öl 1',
  multiField: true,
});
testSingleRuleSearch({
  id: 'inscription_country',
  field: 'signature_text',
  operator: 'in',
  value: ['all_sweden'],
  expectedCount: 4049,
  firstResultCheck: 'Öl 1',
  multiField: true,
});


testSingleRuleSearch({
  field: 'carver',
  operator: 'is_empty',
  value: null,
  expectedCount: 5735,
  firstResultCheck: '',
});
testSingleRuleSearch({
  field: 'carver',
  operator: 'is_not_empty',
  value: null,
  expectedCount: 1080,
  firstResultCheck: 'Nilsson attribuerar stenen till Korp.',
});
testSingleRuleSearch({
  field: 'carver',
  operator: 'equal',
  value: 'Nilsson attribuerar stenen till Korp.',
  expectedCount: 3,
  firstResultCheck: 'Nilsson attribuerar stenen till Korp.',
});


testSingleRuleSearch({
  id: 'cross_form',
  field: 'crosses',
  operator: 'cross_form',
  value: {
    form: 'B1',
    is_certain: "1",
  },
  expectedCount: 662,
  multiField: false,
  firstResultCheck: JSON.parse('[[[],[{"name":"A4","isCertain":1}],[{"name":"B1","isCertain":1}],[{"name":"C9","isCertain":1},{"name":"C10","isCertain":1}],[{"name":"D5","isCertain":1}],[{"name":"E5","isCertain":1}],[{"name":"F3","isCertain":1}],[]]]'),
});


testSingleRuleSearch({
  field: 'year_from',
  operator: 'equal',
  value: 1100,
  expectedCount: 1876,
  multiField: false,
  firstResultCheck: 1100,
});

test('search inscription via year range', () => {
  const multiField = false;
  const rules = {
    condition: "AND",
    rules: [
      {
        id: "year_from",
        field: "year_from",
        operator: "greater",
        value: 1099,
        data: multiField ? { multiField: true } : {}
      },
      {
        id: "year_to",
        field: "year_to",
        operator: "less",
        value: 1101,
        data: multiField ? { multiField: true } : {}
      },
    ],
    not: false,
    valid: true
  };
  
  const results = doSearch(rules, dbMap.values());
  const expectedCount = 48;
  
  assert.not(results[0].signature_text === 'Ög 218', 'Should not find Ög 218');
  assert.is(results.length, expectedCount, `Should find ${expectedCount} inscriptions`);
});

// Test for style search - Issue: "Öl 4" has style "Pr 4" but search for "begins_with Pr 4" doesn't find it
test('search by style begins_with Pr 4 should find Öl 4', () => {
  const rules = {
    condition: 'AND',
    rules: [
      {
        id: 'style',
        field: 'style',
        type: 'string',
        input: 'text',
        operator: 'begins_with',
        value: 'Pr 4',
      }
    ],
    not: false,
    valid: true
  };
  
  const results = doSearch(rules, dbMap.values());
  
  // Find if Öl 4 is in the results
  const ol4 = results.find(r => r.signature_text === 'Öl 4');
  
  assert.ok(ol4, 'Should find Öl 4 in results');
  // The style field may contain non-breaking spaces, so we normalize for comparison
  assert.is(ol4.style.replace(/\s/g, ' '), 'Pr 4', 'Öl 4 should have style "Pr 4" (normalized)');
  
  // Verify we're finding many more results now (not just 3)
  assert.ok(results.length > 100, `Should find many results (found ${results.length})`);
});


test.run();
