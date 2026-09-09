export const COMPACT_DB_LAYOUT_MEDIA_QUERY =
  '(max-width: 767.98px), (max-width: 1366px) and (pointer: coarse)';

export const COMPACT_DB_LAYOUT_PREFERENCE_KEY = 'rundata.dbLayoutPreference';

const TABLET_MAX_WIDTH = 1366;
const DESKTOP_LAYOUT_PREFERENCE = 'desktop';

function getViewportWidth(windowObject) {
  const documentWidth = windowObject.document
    && windowObject.document.documentElement
    ? windowObject.document.documentElement.clientWidth
    : 0;
  return Math.max(documentWidth || 0, windowObject.innerWidth || 0);
}

function getLocalStorage(windowObject) {
  try {
    return windowObject && windowObject.localStorage ? windowObject.localStorage : null;
  } catch (error) {
    return null;
  }
}

export function getCompactDbLayoutPreference(
  windowObject = typeof window !== 'undefined' ? window : null
) {
  const storage = getLocalStorage(windowObject);
  if (!storage) {
    return 'auto';
  }

  try {
    return storage.getItem(COMPACT_DB_LAYOUT_PREFERENCE_KEY) === DESKTOP_LAYOUT_PREFERENCE
      ? DESKTOP_LAYOUT_PREFERENCE
      : 'auto';
  } catch (error) {
    return 'auto';
  }
}

export function setCompactDbLayoutPreference(
  preference,
  windowObject = typeof window !== 'undefined' ? window : null
) {
  const storage = getLocalStorage(windowObject);
  if (!storage) {
    return getCompactDbLayoutPreference(windowObject);
  }

  try {
    if (preference === DESKTOP_LAYOUT_PREFERENCE) {
      storage.setItem(COMPACT_DB_LAYOUT_PREFERENCE_KEY, DESKTOP_LAYOUT_PREFERENCE);
    } else {
      storage.removeItem(COMPACT_DB_LAYOUT_PREFERENCE_KEY);
    }
  } catch (error) {
    // Ignore private-mode storage failures and keep automatic layout.
  }

  return getCompactDbLayoutPreference(windowObject);
}

function isTouchTabletFallback(windowObject, navigatorObject) {
  const viewportWidth = getViewportWidth(windowObject);
  if (!viewportWidth || viewportWidth > TABLET_MAX_WIDTH) {
    return false;
  }

  const userAgent = String(navigatorObject.userAgent || '');
  const platform = String(navigatorObject.platform || '');
  const hasTouch = Number(navigatorObject.maxTouchPoints || 0) > 0
    || 'ontouchstart' in windowObject;
  const isIPadOS = /iPad/i.test(userAgent)
    || (platform === 'MacIntel' && Number(navigatorObject.maxTouchPoints || 0) > 1);
  const isAndroidTablet = /Android|Silk|Kindle/i.test(userAgent);

  return hasTouch && (isIPadOS || isAndroidTablet);
}

function isAutomaticCompactDbLayout(windowObject, navigatorObject) {
  try {
    if (typeof windowObject.matchMedia === 'function'
      && windowObject.matchMedia(COMPACT_DB_LAYOUT_MEDIA_QUERY).matches) {
      return true;
    }
    return isTouchTabletFallback(windowObject, navigatorObject);
  } catch (error) {
    return false;
  }
}

export function isCompactDbLayout(
  windowObject = typeof window !== 'undefined' ? window : null,
  navigatorObject = typeof navigator !== 'undefined' ? navigator : {}
) {
  if (!windowObject) {
    return false;
  }

  if (getCompactDbLayoutPreference(windowObject) === DESKTOP_LAYOUT_PREFERENCE) {
    return false;
  }

  return isAutomaticCompactDbLayout(windowObject, navigatorObject);
}

export function syncCompactDbLayoutClass() {
  if (typeof document === 'undefined' || !document.documentElement) {
    return false;
  }
  const desktopPreference = getCompactDbLayoutPreference() === DESKTOP_LAYOUT_PREFERENCE;
  const compact = isCompactDbLayout();
  document.documentElement.classList.toggle('db-desktop-layout', desktopPreference);
  document.documentElement.classList.toggle('db-compact-layout', compact);
  return compact;
}

function updateLayoutPreferenceControl(button) {
  const desktopPreference = getCompactDbLayoutPreference() === DESKTOP_LAYOUT_PREFERENCE;
  const compact = syncCompactDbLayoutClass();

  button.hidden = !desktopPreference && !compact;
  button.textContent = desktopPreference ? 'Auto view' : 'Desktop view';
  button.title = desktopPreference ? 'Return to automatic layout' : 'Use desktop layout on this device';
  button.setAttribute('aria-pressed', String(desktopPreference));
}

export function initLayoutPreferenceControl() {
  if (typeof document === 'undefined') {
    return;
  }

  const button = document.getElementById('btnLayoutPreference');
  if (!button) {
    return;
  }

  button.addEventListener('click', () => {
    const desktopPreference = getCompactDbLayoutPreference() === DESKTOP_LAYOUT_PREFERENCE;
    setCompactDbLayoutPreference(desktopPreference ? 'auto' : DESKTOP_LAYOUT_PREFERENCE);
    updateLayoutPreferenceControl(button);

    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      window.dispatchEvent(new Event('resize'));
    }
  });

  updateLayoutPreferenceControl(button);

  if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
    window.addEventListener('resize', () => updateLayoutPreferenceControl(button));
    window.addEventListener('orientationchange', () => updateLayoutPreferenceControl(button));
  }
}

export function initCompactDbLayout() {
  const compact = syncCompactDbLayoutClass();
  if (typeof window === 'undefined' || typeof window.addEventListener !== 'function') {
    return compact;
  }

  window.addEventListener('resize', syncCompactDbLayoutClass);
  window.addEventListener('orientationchange', syncCompactDbLayoutClass);
  return compact;
}
