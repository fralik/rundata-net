import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { highlightWordsFromWordBoundaries } from '../../runes/js/index_search.js';

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

test.run();