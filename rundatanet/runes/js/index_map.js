// This script assummes that you reference leaflet.js and leaflet.css in your HTML file.

// Initialize the map on the user-provided div with a given center and zoom level
// Default center is [56.607512, 16.439838] and default zoom is 8.
export function initMap(divId, center = [56.607512, 16.439838], zoom = 8) {
  const map = L.map(divId, {
    fullscreenControl: true,
  }).setView(center, zoom);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
  }).addTo(map);

  // add location control to global name space for testing only
  // on a production site, omit the "lc = "!
  L.control.locate({
    strings: {
      title: "My location"
    }
  })
  .addTo(map);

  const markers = L.markerClusterGroup({
    showCoverageOnHover: true,
    chunkedLoading: true,
    maxClusterRadius: 60,
  });
  markers.on('click', function (e) {
    scrollToInscription(e.layer.options.signature, e.layer.options.id);
  });
  markers.addTo(map);

  return {map, markers};
}

export function onHideMapClicked(mapContainerId, menuItemId) {
  const mapContainerJquery = `#${mapContainerId}`;
  const menuItemJquery = `#${menuItemId}`;

  $(mapContainerJquery).toggle();
  if ($(mapContainerJquery).is(":visible")) {
    $(menuItemJquery).html('Hide map');
  } else {
    $(menuItemJquery).html('Show map');
  }
}

function isMobileDevice() {
  try {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  } catch (e) {
    return false;
  }
}

function inscription2marker(inscriptionData, lat, lon, leaflet=L) {
  // Inscriptions have two sets of latitude and longitude values: one for the
  // original location and one for the present location. We will always create two
  // markers for each inscription. This means that even if the present location is
  // the same as the original location, we will still create two markers.

  if (lat === 0.0 || lon === 0.0) {
    return null;
  }
  let marker = leaflet.marker([lat, lon], {
    signature: inscriptionData.signature_text,
    id: inscriptionData.id,
  });
  let popupText = `${inscriptionData.signature_text}<br>`;
  if (isMobileDevice()) {
    popupText += `<a href="${getGeoIntentURL(lat, lon)}" target="_self">Drive here!</a>`;
  }
  // Tooltip is simple and is always on, popup supports HTML and is opened  /closed by user
  if (isMobileDevice()) {
    marker.bindPopup(popupText, {autoClose: false});
  }
  marker.bindTooltip(inscriptionData.signature_text, {permanent: true}).openTooltip();

  return marker;
}

/**
 * Converts inscription data to map markers and returns a collection of markers.
 *
 * @param {Map} dbMap - A map containing inscription data with keys as unique identifiers.
 * @param {Object} [leaflet=L] - The Leaflet library instance to use for creating markers.
 * @returns {Map} A map where each key corresponds to an inscription and the value is an object
 *                containing 'found' and 'present' markers. The key is the same as in dbMap.
 */
export function inscriptions2markers(dbMap, leaflet=L) {
  const mapMarkers = new Map(); // Collection of all created map markers. This is used
  // in order to create markers only once.

  dbMap.forEach((inscriptionData, key) => {
    const signatureName = inscriptionData.signature_text;

    const found_lat = parseFloat(inscriptionData.latitude) || 0.0;
    const found_lon = parseFloat(inscriptionData.longitude) || 0.0;
    const present_lat = parseFloat(inscriptionData.present_latitude) || 0.0;
    const present_lon = parseFloat(inscriptionData.present_longitude) || 0.0;
    const marker_found = inscription2marker(inscriptionData, found_lat, found_lon, leaflet);
    if (!marker_found) {
      return;
    }
    if (!mapMarkers.has(key)) {
      mapMarkers.set(key, {found: null, present: null});
    }
    mapMarkers.get(key).found = marker_found;

    const marker_present = inscription2marker(inscriptionData, present_lat, present_lon, leaflet);
    mapMarkers.get(key).present = marker_present ? marker_present : marker_found;
  });
  return mapMarkers;
}

export function clearMarkers() {
  markers.clearLayers();
}
