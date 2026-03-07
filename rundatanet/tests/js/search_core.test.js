import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { getSearchDirectionConfig } from '../../runes/js/search_core.js';

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

test.run();
