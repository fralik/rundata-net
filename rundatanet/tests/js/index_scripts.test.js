import { test } from 'uvu';
import * as assert from 'uvu/assert';
//import Database from 'better-sqlite3';
import { convertDbToKeyMap, fetchAllImages, makeImagesMarkup } from '../../runes/js/index_scripts.js';
import { mockDb } from './mockDb.js';

test('convertDbToKeyMap() function', async () => {
  //const dbPath = 'rundatanet/static/runes/runes.sqlite3';
  //const db = new Database(dbPath, { readonly: true });
  const result = convertDbToKeyMap(mockDb);

  const expectedInscriptions = 6815;
  assert.is(result.size, expectedInscriptions, `The resulting object should be of size: ${expectedInscriptions}`);

  //const expectedNum = 3;
  //assert.is(Object.keys(result).length, expectedNum, `The resulting object should contain ${expectedNum} keys/values`);
});

test('fetchAllImages() function', async () => {
  const result = fetchAllImages(mockDb);
  const expectedDirectUrl = "https://pub.raa.se/dokumentation/00c46e71-67aa-4893-b5a2-de89615a4de9/visning/1/miniatyr";
  const expectedLinkUrl = "https://pub.raa.se/visa/dokumentation/00c46e71-67aa-4893-b5a2-de89615a4de9";

  // images of the first inscription
  const images = result['1'];
  
  assert.is(images.links.length, 41, `The first inscription should have 41 images`);
  
  assert.is(images.links[0].direct, expectedDirectUrl, `The first inscription should have a direct link to: ${expectedDirectUrl}`);
  assert.is(images.links[0].indirect, expectedLinkUrl, `The first inscription should have a link to: ${expectedLinkUrl}`);
});

test('makeImagesMarkup() function', async () => {
  const images = {
    links: [
      {
        direct: "http://example.com/image1.jpg",
        indirect: "http://example.com/image1-link"
      }
    ],
  };
  const expectedDirect = `<div class="container-fluid"><div class="row"><div class="col-md-4"><a href="${images.links[0].indirect}" contentEditable="false" target="_blank"><img src="${images.links[0].direct}" class="img-responsive"></a></div></div></div>`;
  const results = makeImagesMarkup(images);
  assert.is(results.directImages, expectedDirect, `The direct images markup should be: ${expectedDirect}`);
  assert.is(results.indirectImages, 'No images.', `The indirect images markup should be: No images.`);
});

test.run();