import { test } from 'uvu';
import * as assert from 'uvu/assert';
import {
  getSearchDirectionConfig,
  getPhraseMatchFunction,
  splitPhraseTokens,
} from '../../runes/js/search_core.js';

// ── getSearchDirectionConfig ──────────────────────────────────────────────────

test('getSearchDirectionConfig norseToTransliteration returns correct field mapping', () => {
  const config = getSearchDirectionConfig('norseToTransliteration');
  assert.is(config.normalisationField, 'normalisation_norse');
  assert.is(config.fromField, 'normalisation_norse');
  assert.is(config.toField, 'transliteration');
});

test('getSearchDirectionConfig scandinavianToTransliteration returns correct field mapping', () => {
  const config = getSearchDirectionConfig('scandinavianToTransliteration');
  assert.is(config.normalisationField, 'normalisation_scandinavian');
  assert.is(config.fromField, 'normalisation_scandinavian');
  assert.is(config.toField, 'transliteration');
});

test('getSearchDirectionConfig transliterationToNorse returns correct field mapping', () => {
  const config = getSearchDirectionConfig('transliterationToNorse');
  assert.is(config.normalisationField, 'normalisation_norse');
  assert.is(config.fromField, 'transliteration');
  assert.is(config.toField, 'normalisation_norse');
});

test('getSearchDirectionConfig transliterationToScandinavian returns correct field mapping', () => {
  const config = getSearchDirectionConfig('transliterationToScandinavian');
  assert.is(config.normalisationField, 'normalisation_scandinavian');
  assert.is(config.fromField, 'transliteration');
  assert.is(config.toField, 'normalisation_scandinavian');
});

test('getSearchDirectionConfig returns null for unknown direction', () => {
  assert.is(getSearchDirectionConfig('unknown'), null);
  assert.is(getSearchDirectionConfig(''), null);
  assert.is(getSearchDirectionConfig(undefined), null);
});

// ── splitPhraseTokens ─────────────────────────────────────────────────────────

test('splitPhraseTokens splits on whitespace runs', () => {
  assert.equal(splitPhraseTokens('hello world'), ['hello', 'world']);
  assert.equal(splitPhraseTokens('a  b   c'), ['a', 'b', 'c']);
  assert.equal(splitPhraseTokens('a\tb\nc'), ['a', 'b', 'c']);
});

test('splitPhraseTokens trims and returns single token for single word', () => {
  assert.equal(splitPhraseTokens('  hello  '), ['hello']);
  assert.equal(splitPhraseTokens('hello'), ['hello']);
});

test('splitPhraseTokens returns empty array for empty/nullish input', () => {
  assert.equal(splitPhraseTokens(''), []);
  assert.equal(splitPhraseTokens('   '), []);
  assert.equal(splitPhraseTokens(null), []);
  assert.equal(splitPhraseTokens(undefined), []);
});

// ── getPhraseMatchFunction ────────────────────────────────────────────────────

test('getPhraseMatchFunction exact matches N consecutive words', () => {
  const fn = getPhraseMatchFunction('exact');
  const words = ['raised', 'the', 'stone', 'in', 'memory', 'of'];
  assert.equal(fn(words, 'stone in memory'), [[2, 3, 4]]);
  assert.equal(fn(words, 'in memory of'), [[3, 4, 5]]);
});

test('getPhraseMatchFunction exact returns empty when phrase not consecutive', () => {
  const fn = getPhraseMatchFunction('exact');
  const words = ['the', 'stone', 'of', 'memory'];
  // "stone memory" is not consecutive
  assert.equal(fn(words, 'stone memory'), []);
  // wrong order
  assert.equal(fn(words, 'memory stone'), []);
});

test('getPhraseMatchFunction exact returns multiple windows when phrase appears multiple times', () => {
  const fn = getPhraseMatchFunction('exact');
  const words = ['a', 'b', 'c', 'a', 'b', 'd'];
  assert.equal(fn(words, 'a b'), [[0, 1], [3, 4]]);
});

test('getPhraseMatchFunction includes uses substring match on every token', () => {
  const fn = getPhraseMatchFunction('includes');
  const words = ['alpha', 'beta', 'gamma'];
  // Exact tokens match
  assert.equal(fn(words, 'beta gamma'), [[1, 2]]);
  // Prefix on last token matches
  assert.equal(fn(words, 'beta gam'), [[1, 2]]);
  // Suffix on first token matches
  assert.equal(fn(words, 'pha beta'), [[0, 1]]);
  // Substring in the middle also matches (every token uses .includes)
  assert.equal(fn(words, 'alpha et gamma'), [[0, 1, 2]]);
  // Partial match on every token is allowed
  assert.equal(fn(words, 'ph et am'), [[0, 1, 2]]);
});

test('getPhraseMatchFunction contains is alias for includes', () => {
  const fn = getPhraseMatchFunction('contains');
  const words = ['alpha', 'beta', 'gamma'];
  assert.equal(fn(words, 'pha beta'), [[0, 1]], 'suffix on first token works');
  assert.equal(fn(words, 'alpha bet'), [[0, 1]], 'prefix on last token works');
  assert.equal(fn(words, 'ph et'), [[0, 1]], 'substring on every token works');
});

test('getPhraseMatchFunction contains: query "es satt" matches doc "es sattr"', () => {
  // Mirrors real-world use case: user searches for "es satt" expecting to
  // find "es sattr" in an inscription, the same way single-word "sat"
  // matches "sattr".
  const fn = getPhraseMatchFunction('contains');
  const words = ['foo', 'es', 'sattr', 'bar'];
  assert.equal(fn(words, 'es satt'), [[1, 2]]);
});

test('getPhraseMatchFunction exact requires strict token equality (no partial)', () => {
  const fn = getPhraseMatchFunction('exact');
  const words = ['alpha', 'beta', 'gamma'];
  // Full exact works
  assert.equal(fn(words, 'alpha beta'), [[0, 1]]);
  // Partial tokens do NOT match under exact
  assert.equal(fn(words, 'alph beta'), []);
  assert.equal(fn(words, 'alpha bet'), []);
});

test('getPhraseMatchFunction beginsWith allows prefix on last token only', () => {
  const fn = getPhraseMatchFunction('beginsWith');
  const words = ['in', 'memory', 'of'];
  // Middle tokens exact, last token prefix
  assert.equal(fn(words, 'in mem'), [[0, 1]]);
  // Full exact also works
  assert.equal(fn(words, 'in memory'), [[0, 1]]);
  // Prefix on first token is NOT allowed in beginsWith semantics
  assert.equal(fn(words, 'i memory'), []);
});

test('getPhraseMatchFunction beginsWith matches anywhere (not anchored to start)', () => {
  const fn = getPhraseMatchFunction('beginsWith');
  const words = ['raised', 'the', 'stone', 'in', 'memory', 'of'];
  assert.equal(fn(words, 'in mem'), [[3, 4]]);
});

test('getPhraseMatchFunction endsWith allows suffix on first token only', () => {
  const fn = getPhraseMatchFunction('endsWith');
  const words = ['raised', 'stone', 'memory'];
  // First token suffix, rest exact
  assert.equal(fn(words, 'sed stone'), [[0, 1]]);
  // Full exact also works
  assert.equal(fn(words, 'raised stone'), [[0, 1]]);
  // Suffix on last token is NOT allowed in endsWith semantics
  assert.equal(fn(words, 'raised sto'), []);
});

test('getPhraseMatchFunction endsWith matches anywhere (not anchored to end)', () => {
  const fn = getPhraseMatchFunction('endsWith');
  const words = ['raised', 'stone', 'memory', 'of', 'father'];
  assert.equal(fn(words, 'sed stone'), [[0, 1]]);
});

test('getPhraseMatchFunction respects ignoreCase', () => {
  const fnSens = getPhraseMatchFunction('exact');
  const fnIns = getPhraseMatchFunction('exact', { ignoreCase: true });
  const words = ['Hello', 'World', 'Foo'];
  assert.equal(fnSens(words, 'hello world'), []);
  assert.equal(fnIns(words, 'hello world'), [[0, 1]]);
  assert.equal(fnIns(words, 'HELLO WORLD'), [[0, 1]]);
});

test('getPhraseMatchFunction strips special symbols by default', () => {
  const fn = getPhraseMatchFunction('exact');
  const words = ['&quot;Þórr&quot;', 'sonr'];
  // Symbols stripped on both sides
  assert.equal(fn(words, 'Þórr sonr'), [[0, 1]]);
});

test('getPhraseMatchFunction preserves special symbols when includeSpecialSymbols=true', () => {
  const fn = getPhraseMatchFunction('exact', { includeSpecialSymbols: true });
  const words = ['&quot;Þórr&quot;', 'sonr'];
  // With symbols preserved, stripped query should not match
  assert.equal(fn(words, 'Þórr sonr'), []);
  // But full-entity query matches
  assert.equal(fn(words, '&quot;Þórr&quot; sonr'), [[0, 1]]);
});

test('getPhraseMatchFunction handles slash-separated personal-name variants', () => {
  const fn = getPhraseMatchFunction('exact');
  // A doc word may be annotated like "&quot;Þórr/X" — either variant should match
  const words = ['&quot;Þórr/X', 'sonr'];
  assert.equal(fn(words, 'Þórr sonr'), [[0, 1]]);
  assert.equal(fn(words, 'X sonr'), [[0, 1]]);
});

test('getPhraseMatchFunction returns empty when doc is shorter than phrase', () => {
  const fn = getPhraseMatchFunction('exact');
  assert.equal(fn(['single'], 'two words'), []);
  assert.equal(fn([], 'anything'), []);
});

test('getPhraseMatchFunction returns empty for empty query', () => {
  const fn = getPhraseMatchFunction('exact');
  assert.equal(fn(['a', 'b'], ''), []);
  assert.equal(fn(['a', 'b'], '   '), []);
});

test('getPhraseMatchFunction returns empty when any prepared query token is empty', () => {
  const fnInc = getPhraseMatchFunction('includes');
  const fnBeg = getPhraseMatchFunction('beginsWith');
  const fnEnd = getPhraseMatchFunction('endsWith');
  const words = ['alpha', 'beta'];

  assert.equal(fnInc(words, '"'), []);
  assert.equal(fnInc(words, 'alpha "'), []);
  assert.equal(fnBeg(words, '" beta'), []);
  assert.equal(fnEnd(words, 'alpha "'), []);
});

test.run();
