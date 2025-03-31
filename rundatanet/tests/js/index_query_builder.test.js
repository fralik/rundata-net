import './setup-mocks.js';

import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { convertDbToKeyMap } from '../../runes/js/index_scripts.js';
import { mockDb } from './mockDb.js';

// Now import the module
import { sortGroupsByOrder, getValuesFromAllData } from '../../runes/js/index_query_builder.js';

test('sortGroupsByOrder() with specified order', () => {
  const items = [
    { id: 1, label: 'B Item', optgroup: 'group2' },
    { id: 2, label: 'A Item', optgroup: 'group1' },
    { id: 4, label: 'D Item', optgroup: 'group1' },
    { id: 3, label: 'C Item', optgroup: 'group3' },
  ];
  
  const groupOrder = ['group1', 'group2', 'group3'];
  const result = sortGroupsByOrder(items, groupOrder);
  
  // Check groups are in correct order
  assert.is(result[0].optgroup, 'group1', 'First group should be group1');
  assert.is(result[1].optgroup, 'group1', 'Second item should also be group1');
  assert.is(result[2].optgroup, 'group2', 'Third item should be group2');
  assert.is(result[3].optgroup, 'group3', 'Fourth item should be group3');
  
  // Check alphabetical sorting within groups
  assert.is(result[0].label, 'A Item', 'Items within group1 should be alphabetically sorted');
  assert.is(result[1].label, 'D Item', 'Items within group1 should be alphabetically sorted');
});

test('sortGroupsByOrder() with unspecified groups', () => {
  const items = [
    { id: 1, label: 'A Item', optgroup: 'group1' },
    { id: 2, label: 'B Item', optgroup: 'group2' },
    { id: 3, label: 'C Item', optgroup: 'unspecified1' },
    { id: 4, label: 'D Item', optgroup: 'unspecified2' }
  ];
  
  const groupOrder = ['group1', 'group2'];
  const result = sortGroupsByOrder(items, groupOrder);
  
  // Specified groups should come first in the correct order
  assert.is(result[0].optgroup, 'group1', 'First group should be group1');
  assert.is(result[1].optgroup, 'group2', 'Second group should be group2');
  
  // Unspecified groups should be included at the end
  assert.ok(
    (result[2].optgroup === 'unspecified1' && result[3].optgroup === 'unspecified2') ||
    (result[2].optgroup === 'unspecified2' && result[3].optgroup === 'unspecified1'),
    'Unspecified groups should be included at the end'
  );
});

test('sortGroupsByOrder() with items without optgroup', () => {
  const items = [
    { id: 1, label: 'B Item', optgroup: 'group1' },
    { id: 2, label: 'A Item', optgroup: '' },
    { id: 3, label: 'C Item' }
  ];
  
  const groupOrder = ['group1'];
  const result = sortGroupsByOrder(items, groupOrder);
  
  assert.is(result[0].optgroup, 'group1', 'Items with specified optgroup should come first');
  assert.is(result[1].label, 'A Item', 'Items without optgroup should be included');
  assert.is(result[2].label, 'C Item', 'Items without optgroup property should be included');
});

test('sortGroupsByOrder() with empty arrays', () => {
  // Test with empty items array
  const result1 = sortGroupsByOrder([], ['group1', 'group2']);
  assert.is(result1.length, 0, 'Empty items array should return empty array');
  
  // Test with empty groupOrder array
  const items = [
    { id: 1, label: 'B Item', optgroup: 'group1' },
    { id: 2, label: 'A Item', optgroup: 'group1' },
    { id: 3, label: 'E Item', optgroup: 'group2' },
    { id: 4, label: 'Z Item', optgroup: 'group2' }
  ];
  
  const result2 = sortGroupsByOrder(items, []);
  assert.is(result2.length, 4, 'All items should be included with empty groupOrder');
  
  // Items should still be sorted alphabetically within their groups
  const group1Items = result2.filter(item => item.optgroup === 'group1');
  const group2Items = result2.filter(item => item.optgroup === 'group2');
  
  assert.is(group1Items.length, 2, 'Group1 items should be present');
  assert.is(group2Items.length, 2, 'Group2 items should be present');
});

//  const result = convertDbToKeyMap(mockDb);

// Helper function to simulate the 'suggest' callback
function createSuggestMock() {
  const suggested = [];
  return {
    callback: (values) => {
      suggested.push(...(Array.isArray(values) ? values : [values]));
    },
    suggested
  };
}

test('getValuesFromAllData() with empty term and aliases', () => {
  const mockDbMap = new Map([
    [1, { 
      id: 1, 
      testField: 'Alpha', 
      aliases: 'AlphaAlias1|AlphaAlias2'
    }],
    [2, { 
      id: 2, 
      testField: 'Bravo', 
      aliases: 'BravoAlias'
    }],
    [3, { 
      id: 3, 
      testField: 'Charlie',
      aliases: ''
    }],
    [4, { 
      id: 4, 
      testField: 'Delta',
      aliases: ''
    }],
    [5, { 
      id: 5, 
      testField: 'Åkerman',
      aliases: ''
    }],
    [6, { 
      id: 6, 
      testField: '',
      aliases: ''
    }],
  ]);    
  const { callback, suggested } = createSuggestMock();
  
  // Act
  getValuesFromAllData('', callback, 'testField', mockDbMap);
  
  // Assert
  assert.is(suggested.length, 5, 'Should return 5 values (all non-empty)');
  assert.ok(suggested.includes('Alpha'), 'Should include Alpha');
  assert.ok(suggested.includes('Bravo'), 'Should include Bravo');
  assert.ok(suggested.includes('Charlie'), 'Should include Charlie');
  assert.ok(suggested.includes('Delta'), 'Should include Delta');
  assert.ok(suggested.includes('Åkerman'), 'Should include Åkerman');
});

test('getValuesFromAllData() with signature_text', () => {
  const mockDbMap = new Map([
    [1, { 
      id: 1, 
      signature_text: 'Alpha', 
      aliases: 'AlphaAlias1|AlphaAlias2'
    }],
    [2, { 
      id: 2, 
      signature_text: 'Bravo', 
      aliases: 'BravoAlias'
    }],
    [3, { 
      id: 3, 
      signature_text: 'Charlie',
      aliases: ''
    }],
    [4, { 
      id: 4, 
      signature_text: 'Delta',
      aliases: ''
    }],
    [5, { 
      id: 5, 
      signature_text: 'Åkerman',
      aliases: ''
    }],
    [6, { 
      id: 6, 
      signature_text: '',
      aliases: ''
    }],
  ]);
  const { callback, suggested } = createSuggestMock();
  
  // Act
  getValuesFromAllData('', callback, 'signature_text', mockDbMap);
  
  // Assert
  assert.is(suggested.length, 8, 'Should return 8 values (5 non-empty + 3 aliases)');
});

test.run();
