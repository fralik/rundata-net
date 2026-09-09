import { test } from 'uvu';
import * as assert from 'uvu/assert';
import {
  COMPACT_DB_LAYOUT_MEDIA_QUERY,
  COMPACT_DB_LAYOUT_PREFERENCE_KEY,
  getCompactDbLayoutPreference,
  isCompactDbLayout,
  setCompactDbLayoutPreference,
} from '../../runes/js/index_layout.js';


function makeStorage(initialValue = null) {
  const values = new Map();
  if (initialValue !== null) {
    values.set(COMPACT_DB_LAYOUT_PREFERENCE_KEY, initialValue);
  }
  return {
    getItem: key => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key),
  };
}

function makeWindow({matches = false, innerWidth = 1024, touch = false} = {}) {
  const windowObject = {
    innerWidth,
    document: {documentElement: {clientWidth: innerWidth}},
    matchMedia: query => ({matches, media: query}),
  };
  if (touch) {
    windowObject.ontouchstart = () => {};
  }
  return windowObject;
}

function makeCapabilityWindow({innerWidth, coarsePointer, storedPreference = null}) {
  return {
    innerWidth,
    document: {documentElement: {clientWidth: innerWidth}},
    localStorage: makeStorage(storedPreference),
    matchMedia: () => ({
      matches: innerWidth <= 767.98 || (innerWidth <= 1366 && coarsePointer),
    }),
  };
}

test('compact layout query covers phones and coarse-pointer tablets', () => {
  assert.ok(COMPACT_DB_LAYOUT_MEDIA_QUERY.includes('max-width: 767.98px'));
  assert.ok(COMPACT_DB_LAYOUT_MEDIA_QUERY.includes('max-width: 1366px'));
  assert.ok(COMPACT_DB_LAYOUT_MEDIA_QUERY.includes('pointer: coarse'));
  assert.is(isCompactDbLayout(makeWindow({matches: true})), true);
});

test('ordinary laptop width does not activate compact layout', () => {
  const windowObject = makeWindow({matches: false, innerWidth: 1024});
  const navigatorObject = {userAgent: 'Mozilla/5.0', platform: 'MacIntel', maxTouchPoints: 0};

  assert.is(isCompactDbLayout(windowObject, navigatorObject), false);
});

test('iPadOS Mac user-agent fallback activates at tablet width', () => {
  const windowObject = makeWindow({matches: false, innerWidth: 1366, touch: true});
  const navigatorObject = {userAgent: 'Mozilla/5.0 Macintosh Safari', platform: 'MacIntel', maxTouchPoints: 5};

  assert.is(isCompactDbLayout(windowObject, navigatorObject), true);
});

test('Android tablet fallback activates when pointer media is unavailable', () => {
  const windowObject = makeWindow({matches: false, innerWidth: 1280, touch: true});
  const navigatorObject = {userAgent: 'Mozilla/5.0 Android 14', platform: 'Linux armv8l', maxTouchPoints: 5};

  assert.is(isCompactDbLayout(windowObject, navigatorObject), true);
});

test('tablet fallback stays desktop above the supported width', () => {
  const windowObject = makeWindow({matches: false, innerWidth: 1440, touch: true});
  const navigatorObject = {userAgent: 'Mozilla/5.0 iPad', platform: 'MacIntel', maxTouchPoints: 5};

  assert.is(isCompactDbLayout(windowObject, navigatorObject), false);
});

test('iPad and Android tablet viewport matrix uses compact layout', () => {
  const tabletViewports = [
    {name: 'iPad Air portrait', width: 820},
    {name: 'iPad Air landscape', width: 1180},
    {name: 'iPad Pro 13 landscape', width: 1366},
    {name: 'Android tablet portrait', width: 800},
    {name: 'Android tablet landscape', width: 1280},
  ];

  tabletViewports.forEach(({name, width}) => {
    assert.is(
      isCompactDbLayout(makeCapabilityWindow({innerWidth: width, coarsePointer: true})),
      true,
      name
    );
  });
});

test('fine-pointer desktops keep desktop layout at tablet-like widths', () => {
  [768, 1024, 1180, 1366, 1440].forEach(width => {
    assert.is(
      isCompactDbLayout(makeCapabilityWindow({innerWidth: width, coarsePointer: false})),
      false,
      `desktop width ${width}`
    );
  });
});

test('stored desktop preference overrides compact auto detection', () => {
  const windowObject = makeCapabilityWindow({
    innerWidth: 1280,
    coarsePointer: true,
    storedPreference: 'desktop',
  });

  assert.is(getCompactDbLayoutPreference(windowObject), 'desktop');
  assert.is(isCompactDbLayout(windowObject), false);
});

test('stored mobile preference overrides desktop auto detection', () => {
  const windowObject = makeCapabilityWindow({innerWidth: 1440, coarsePointer: false});

  assert.is(setCompactDbLayoutPreference('mobile', windowObject), 'mobile');
  assert.is(getCompactDbLayoutPreference(windowObject), 'mobile');
  assert.is(isCompactDbLayout(windowObject), true);
});

test('stored layout preference can return to automatic detection', () => {
  const windowObject = makeCapabilityWindow({innerWidth: 1280, coarsePointer: true});

  assert.is(setCompactDbLayoutPreference('desktop', windowObject), 'desktop');
  assert.is(isCompactDbLayout(windowObject), false);
  assert.is(setCompactDbLayoutPreference('auto', windowObject), 'auto');
  assert.is(isCompactDbLayout(windowObject), true);
});

test.run();
