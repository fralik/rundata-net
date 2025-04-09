import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { doSearch, highlightWordsFromWordBoundaries } from '../../runes/js/index_search.js';
import { mockDb } from './mockDb.js';
import { convertDbToKeyMap } from '../../runes/js/index_scripts.js';

// Process mockDb once at the module level
const dbMap = convertDbToKeyMap(mockDb);

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

function testInscriptionSearch({
  operator, 
  value, 
  expectedCount, 
  testName,
  id = null,
  firstResultCheck = null,
  multiField = true,
  condition = 'AND',
  field = 'signature_text'
}) {
  test(testName || `search inscription via ${operator} (${value})`, () => {
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
      assert.is(result[0][field], firstResultCheck, `First result should be ${firstResultCheck}`);
    }
  });
}

testInscriptionSearch({
  operator: 'in',
  value: 'Öl 1',
  expectedCount: 1,
  testName: 'search one inscription',
  firstResultCheck: 'Öl 1'
});
testInscriptionSearch({
  operator: 'in',
  value: ['Öl 1', 'Öl 2'],
  expectedCount: 2,
  testName: 'search multiple inscriptions by id'
});
testInscriptionSearch({
  operator: 'in_separated_list',
  value: 'Öl 1|Öl 2|Öl 12',
  expectedCount: 3,
});
testInscriptionSearch({
  operator: 'begins_with',
  value: 'Öl 1',
  expectedCount: 11,
  firstResultCheck: 'Öl 1'
});
testInscriptionSearch({
  operator: 'not_begins_with',
  value: 'Öl 1',
  expectedCount: 6804,
  firstResultCheck: 'Öl 2'
});
testInscriptionSearch({
  operator: 'ends_with',
  value: '4',
  expectedCount: 1026,
  firstResultCheck: 'Öl 2'
});
testInscriptionSearch({
  operator: 'not_ends_with',
  value: '4',
  expectedCount: 5789,
  firstResultCheck: 'Öl 1'
});
testInscriptionSearch({
  operator: 'contains',
  value: 'Öl',
  expectedCount: 190,
  firstResultCheck: 'Öl 1'
});
testInscriptionSearch({
  operator: 'not_contains',
  value: 'Öl',
  expectedCount: 6625,
  firstResultCheck: 'Ög 1'
});


testInscriptionSearch({
  id: 'signature_country',
  field: 'signature_text',
  operator: 'in',
  value: ['Öl', 'Sm'],
  expectedCount: 385,
  firstResultCheck: 'Öl 1',
  multiField: true,
});
testInscriptionSearch({
  id: 'signature_country',
  field: 'signature_text',
  operator: 'in',
  value: ['all_sweden'],
  expectedCount: 4049,
  firstResultCheck: 'Öl 1',
  multiField: true,
});

test.run();