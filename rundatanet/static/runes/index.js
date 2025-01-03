(function () {
  'use strict';

  const schemaFieldsInfo$1 = [
    {
      schemaName: 'signature_text',
      text: {
        'en': 'Inscription'
      },
    },
    {
      schemaName: 'found_location',
      text: {
        'en': 'Found location',
      },
    },
    {
      schemaName: 'parish',
      text: {
        'en': 'Parish',
      },
    },
    {
      schemaName: 'district',
      text: {
        'en': 'District',
      },
    },
    {
      schemaName: 'municipality',
      text: {
        'en': 'Municipality',
      },
    },
    {
      schemaName: 'current_location',
      text: {
        'en': 'Current location',
      },
    },
    {
      schemaName: 'original_site',
      text: {
        en: 'Original site',
      },
    },
    {
      schemaName: 'parish_code',
      text: {
        en: 'Parish code',
      }
    },
    {
      schemaName: 'rune_type',
      text: {
        en: 'Rune type',
      }
    },
    {
      schemaName: 'dating',
      text: {
        en: 'Dating',
      }
    },
    {
      schemaName: 'year_from',
      text: {
        en: 'Year (from)',
      },
    },
    {
      schemaName: 'year_to',
      text: {
        en: 'Year (to)',
      },
    },
    {
      schemaName: 'style',
      text: {
        en: 'Style',
      }
    },
    {
      schemaName: 'carver',
      text: {
        en: 'Carver',
      }
    },
    {
      schemaName: 'material',
      text: {
        en: 'Material',
      },
    },
    {
      schemaName: 'material_type',
      text: {
        en: 'Material type',
      },
    },
    {
      schemaName: 'objectInfo',
      text: {
        en: 'Object information',
      },
    },
    {
      schemaName: 'reference',
      text: {
        en: 'References',
      },
    },
    {
      schemaName: 'additional',
      text: {
        en: 'Other information',
      },
    },
    {
      schemaName: 'normalisation_norse',
      text: {
        en: 'Normalization to Old West Norse',
      },
      css: 'normalization',
    },
    {
      schemaName: 'normalisation_scandinavian',
      text: {
        en: 'Normalisation to Old Scandinavian',
      },
      css: 'normalization',
    },
    {
      schemaName: 'english_translation',
      text: {
        en: 'Translation to English',
      },
    },
    {
      schemaName: 'swedish_translation',
      text: {
        en: 'Translation to Swedish',
      }
    },
    {
      schemaName: 'transliteration',
      text: {
        en: 'Transliterated runic text',
      },
      css: 'transliteration',
    },
    {
      schemaName: 'num_crosses',
      text: {
        en: 'Number of crosses',
      },
    },
    {
      schemaName: 'crosses',
      text: {
        en: 'Cross form',
      },
    },
    {
      schemaName: 'images',
      text: {
        en: 'Images',
      }
    },
  ];

  let gRenderInProgress = false;


  /**
   * Convert a database object to a key map.
   * @param {Object} db - The database object that can be used to run queries.
   * @returns {Object} - The key map object. Key - signature ID, value - all signature info.
   */
  function convertDbToKeyMap(db) {
    let content = db.exec("SELECT all_data.*, signatures_with_aliases.aliases FROM all_data LEFT JOIN signatures_with_aliases ON all_data.signature_id = signatures_with_aliases.signature_id");
    const columns = content[0].columns;
    const allRows = content[0].values;
    columns.indexOf("signature_id");
    const numCrossesColumn = columns.indexOf("num_crosses");
    columns.indexOf('latitude');
    columns.indexOf('longitude');
    columns.indexOf('present_latitude');
    columns.indexOf('present_longitude');
    const metaColumn = columns.indexOf('id');
    
    const allDbImages = fetchAllImages(db);

    const dbArray = allRows.map(row => {
      let objSignature = {};
      const metaId = row[metaColumn];
      for (let j = 0; j < row.length; j++) {
        objSignature[columns[j]] = row[j];
        // handle NULL values
        if (row[j] === null) {
          objSignature[columns[j]] = "";
        }
      }
      objSignature["signature_display"] = prepareSignumForDisplay(objSignature);
      if (objSignature["aliases"]) {
        objSignature["signature_header"] = objSignature["signature_text"] + " (" + objSignature["aliases"] + ")";
      } else {
        objSignature["signature_header"] = objSignature["signature_text"];
      }

      /////////////////////////////////////
      // fill in images
      if (allDbImages.hasOwnProperty(metaId)) {
        const imagesMarkup = makeImagesMarkup(allDbImages[metaId]);
        objSignature["directImages"] = imagesMarkup.directImages;
        objSignature["indirectImages"] = imagesMarkup.indirectImages;
      } else {
        objSignature["directImages"] = "";
        objSignature["indirectImages"] = "No images.";
      }

      /////////////////////////////////////
      // fill in crosses
      let numCrosses = row[numCrossesColumn];
      if (numCrosses > 0) {
        objSignature['crosses'] = crossesForMeta(db, row[metaColumn]);
      } else {
        objSignature['crosses'] = [];
      }
      return objSignature;
    });
    const dbAsJson = new Map();
    dbArray.forEach(inscription => {
      dbAsJson.set(inscription.id, inscription);
    });
    
    return dbAsJson;
  }

  function prepareSignumForDisplay({signature_text, lost, new_reading}) {
    let additional = "";
    if (lost) {
      additional += "†";
    }
    if (new_reading) {
      additional += "$";
    }
    if (additional.length > 0) {
      additional = " " + additional;
    }

    return signature_text + additional;
  }

  function fetchAllImages(db) {
    const content = db.exec("SELECT meta_id, link_url, direct_url FROM runes_imagelink");
    const allRows = content[0].values;

    let allImages = {};

    for (let i = 0; i < allRows.length; i++) {
      const row = allRows[i];
      const metaId = row[0];
      if (!allImages.hasOwnProperty(metaId)) {
        allImages[metaId] = {links: []};
      }
      allImages[metaId].links.push({indirect: row[1], direct: row[2]});
    }
    return allImages;
  }

  function makeImagesMarkup(signatureImageLinks) {
    let directImages = "";
    let indirectImages = "No images.";

    // make image gallery of direct image links
    const galleryLinks = signatureImageLinks.links.slice(0, 9);
    const offsetIndirectImages = galleryLinks.length;

    directImages = '<div class="container-fluid"><div class="row">';
    galleryLinks.map(function (v, i) {
      if (i % 3 == 0 && i !== 0) {
        directImages += "</div><div class='row'>";
      }
      directImages += `<div class="col-md-4"><a href="${v.indirect}" contentEditable="false" target="_blank"><img src="${v.direct}" class="img-responsive"></a></div>`;
    });
    directImages += '</div></div>';

    const indirectImagesLinks = signatureImageLinks.links.slice(offsetIndirectImages);
    if (indirectImagesLinks.length > 0) {
      indirectImages = '<ul>';
      indirectImagesLinks.map(function (v, i) {
        indirectImages += `<li><a href="${v.indirect}" contentEditable="false" target="_blank">${v.indirect}</a></li>`;
      });
      indirectImages += '</ul>';
    }

    return {directImages, indirectImages};
  }

  /* Find all crosses related to particular metaId.
   * Returned variable is a multidimensional array. Dimensions:
   * 1. First dimension contains individual crosses.
   * 2. Second dimension denotes cross form group. There could only be 8 groups.
   * 3. Third dimension contains objects with 2 data fields (name, isCertain). Each object represents a particular cross form in a group.
   *    Note that some groups can be empty.
   */
  function crossesForMeta(db, metaId) {
    // we do not check that this meta contains any crosses. This should be done in parent call
    //let cc = db.exec("SELECT id FROM crosses WHERE meta_id = '" + metaId + "'");
    const contents = db.exec("SELECT cross_id, cross_forms.id, cross_forms.name, cross_forms.group_id, cross_definitions.is_certain FROM cross_definitions INNER JOIN cross_forms ON (cross_definitions.form_id = cross_forms.id) WHERE cross_id IN (SELECT id FROM crosses WHERE meta_id = '" + metaId + "') ORDER BY cross_id");
    if (!contents)
      return [];

    let lastCrossId = -1;
    let crosses = [];

    for (let i = 0; i < contents[0].values.length; i++) {
      let crossId = parseInt(contents[0].values[i][0], 10);
      if (crossId != lastCrossId) {
        lastCrossId = crossId;
        crosses.push(Array.apply(null, Array(8)).map(function() {return [];}));
      }

      let formName = contents[0].values[i][2];
      let groupId = contents[0].values[i][3];
      let isCertain = contents[0].values[i][4];

      crosses[crosses.length - 1][parseInt(groupId, 10)].push({name: formName, isCertain: isCertain});
    }
    return crosses;
  }

  /**
   * Convert list/map of inscriptions to tree nodes suitable for jsTree.
   * 
   * @param {*} inscriptions - Either a list of objects or a map. If map is provided, it will be converted to a list of map values.
   */
  function inscriptions2treeNodes(inscriptions) {
    const values = inscriptions instanceof Map ? Array.from(inscriptions.values()) : inscriptions;

    return values.map(inscription => {
      return {
        id: inscription.id.toString(),
        text: inscription.signature_display,
        normalizedText: inscription.signature_text.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        icon: false,
        signature: inscription.signature_text,
      };
    }); 
  }

  function selectFirstSignature() {
    let root = $('#jstree').jstree(true).get_node('#');
    $('#jstree').jstree(true).select_node(root.children[0]);
  }

  /**
   * Convert list of inscriptions to a list of select options in html format.
   */
  function inscriptions2Select(container, dbMap) {
    // clear container
    container.innerHTML = "";

    dbMap.forEach((inscription, id) => {
      const option = document.createElement("option");
      option.value = id;
      option.text = inscription.signature_display;

      container.appendChild(option);
    });
  }

  /**
   * Show tooltip message on a DOM element.
   * 
   * @param {object} el DOM element, e.g. document.getElementById("myBtn")
   * @param {string} message Tooltip message
   */
  function setTooltip(el, message) {
    const that = $(el);
    that.attr('data-bs-title', message).tooltip('show');
    // do not care about multiple calls to setTimeout
    setTimeout(function() {
      that.tooltip('hide');
    }, 900);
  }

  function initClipboardButtons() {
    /**
     * There is a collection of buttons that represent various tricky symbols, like umlauts.
     * Clicking on them should copy the relevant symbol to the clipboard.
     */
    const clipboardButtons = document.querySelectorAll('.clip');
    clipboardButtons.forEach(button => {
      button.addEventListener('click', function() {
        const symbol = button.innerText;
        navigator.clipboard.writeText(symbol).then(function() {
          setTooltip(button, 'Copied to clipboard!');
        }).catch(function(err) {
          setTooltip(button, 'Failed to copy!');
        });
      });
    });
  }

  function arraysEqual$1(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  function displaySignatureInfo() {
    const indices = $('#jstree').jstree(true).get_selected();
    if (indices.length == 0) {
      return;
    }

    if (gRenderInProgress) {
      gRenderInProgress = false;
      setTimeout(displaySignatureInfo, 300);
      return;
    }
    document.getElementById('mainDisplay').innerHTML = "<img src='https://cdnjs.cloudflare.com/ajax/libs/jstree/3.3.7/themes/default-dark/throbber.gif'><br>";
    gRenderInProgress = true;
    setTimeout(renderSignatures, 100);
  }

  function renderSignatures() {
    if (!gRenderInProgress)
      return;

    try {
      const html = inscriptions2markup();
      document.getElementById('mainDisplay').innerHTML = html.join('');
    } catch (e) {
      console.error(`Error rendering signatures: ${e}`);
    } finally {
      gRenderInProgress = false;
    }
  }

  function inscriptions2markup() {
    // array of selected inscription IDs
    const selectedSignatureIds = $('#jstree').jstree(true).get_selected();
    const lang = 'en';
    const paragraphSymbol = '§';
    const sidesHeader = "Sides or/and reading variants:";

    const showHeaders = $('#chkDisplayHeaders').is(":checked");
    const userSelectedFields =  getUserSelectedFields();
    let markupData = [];
    for (let i = 0; i < selectedSignatureIds.length; i++) {
      const signatureId = parseInt(selectedSignatureIds[i], 10);

      const inscriptionData = gDbMap.get(signatureId);
      const signatureName = inscriptionData.signature_text;
      
      let paragraph = `<article signature="${signatureName}" id="${signatureName}" rundata-db-id="${signatureId}" class="inscription-section">`;
      for (let j = 0; j < userSelectedFields.length; j++) {
        const field = userSelectedFields[j];
        const columnName = field.schemaName;
        const humanName = field.text[lang];
        const cssStyle = field.css || "";

        let columnData = "";
        if (columnName in inscriptionData) {
          columnData = inscriptionData[columnName].toString();
        }
        if (showHeaders) {
          paragraph += `<h4>${humanName}</h4>`;
        } else if (paragraph.length > 0 && columnData !== "") {
          paragraph += "<br>";
        }

        // Smiley is a special symbol: word substitute when word is not present
        // We do not need to show it.
        columnData = columnData.replace(/ ☺ /g, ' ');

        if (columnName === 'images') {
          if (inscriptionData['directImages'].length == 0) {
            paragraph += inscriptionData['indirectImages'];
            continue;
          }
          paragraph += inscriptionData['directImages'];
          if (inscriptionData['indirectImages'].length > 0) {
            // add image links as they have not been added yet
            paragraph += '<br>' + inscriptionData['indirectImages'];
          }

          continue;
        }

        if ((columnData == '' || columnData == null) && showHeaders) {
          paragraph += '<i>Absent, not in the database.</i>';
          continue;
        }

        if (columnData.indexOf(paragraphSymbol) !== -1) {
          const parts = columnData.split(paragraphSymbol);
          paragraph += sidesHeader + "<ul>";
          parts.forEach(part => {
            if (!part.trim()) {
              return;
            }

            paragraph += `<li><span class="${cssStyle}">${paragraphSymbol} ${part}</span></li>`;
          });
          paragraph += "</ul>";
        } else {
          paragraph += `<span class="${cssStyle}">${columnData}</span>`;
        }
      }
      paragraph += '</article>';
      markupData.push(paragraph);
    }
    return markupData;
  }

  var module1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    arraysEqual: arraysEqual$1,
    convertDbToKeyMap: convertDbToKeyMap,
    crossesForMeta: crossesForMeta,
    displaySignatureInfo: displaySignatureInfo,
    fetchAllImages: fetchAllImages,
    initClipboardButtons: initClipboardButtons,
    inscriptions2Select: inscriptions2Select,
    inscriptions2markup: inscriptions2markup,
    inscriptions2treeNodes: inscriptions2treeNodes,
    makeImagesMarkup: makeImagesMarkup,
    prepareSignumForDisplay: prepareSignumForDisplay,
    schemaFieldsInfo: schemaFieldsInfo$1,
    selectFirstSignature: selectFirstSignature
  });

  // Key in the local storage under which users display options are saved.
  // display options are information which is displayed per inscription.
  const gUserSelectedDisplayKey = "userSelectedDisplay";
  const gShowHeadersKey = "showHeaders";

  function storageAvailable(type) {
    let storage;
    try {
      storage = window[type];
      const x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    }
    catch(e) {
      return e instanceof DOMException && (
        // everything except Firefox
        e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
        // acknowledge QuotaExceededError only if there's something already stored
        (storage && storage.length !== 0);
    }
  }

  function getUserSelectedDisplay() {
    const defaults = ['signature_text', 'transliteration', 'english_translation', 'found_location',
      'parish', 'municipality', 'district', 'current_location', 'images'];

    if (!storageAvailable('localStorage')) {
      return defaults;
    }

    try {
      const storage = window['localStorage'];
      if (storage.getItem(gUserSelectedDisplayKey)) {
        return JSON.parse(storage.getItem(gUserSelectedDisplayKey));
      }
    } catch (e) {
      console.error('Error while reading user selected display from local storage:', e);
    }

    return defaults;
  }

  function saveUserSelectedDisplay(selectedValues = null) {
    if (!storageAvailable('localStorage')) {
      return;
    }
    const storage = window['localStorage'];

    //var selectedValues = $('#multiselect_to option').map((index, el) => $(el).val()).toArray();
    // ensure it is an array and encode it as json string, because local storage can work with string only.
    const selectedValuesArray = JSON.stringify(selectedValues ? [].concat(selectedValues) : []);

    storage.setItem(gUserSelectedDisplayKey, selectedValuesArray);
  }

  function getUserSelectedFields$1() {
    const selectedValues = getUserSelectedDisplay();
    return selectedValues.map(value => schemaFieldsInfo.find(prop => prop.schemaName === value));
  }


  function setMultiselectOptions(selectedValues, showHeaders) {
    let sortValue = 0;
    $('#multiselect_to').empty();
    $('#multiselect').empty();

    // Populate the list of already selected display options
    selectedValues.forEach(value => {
      const schemaField = schemaFieldsInfo.find(prop => prop.schemaName === value);
      if (schemaField) {
        $('#multiselect_to').append($('<option>', {
          value: schemaField.schemaName,
          text : schemaField.text['en'],
          sortValue: sortValue++,
        }));
      }
    });

    // Populate the list of available display options
    schemaFieldsInfo.forEach(schemaField => {
      if (selectedValues.indexOf(schemaField.schemaName) === -1) {
        $('#multiselect').append($('<option>', {
          value: schemaField.schemaName,
          text : schemaField.text['en'],
          sortValue: sortValue++,
        }));
      }
    });

    if (typeof showHeaders !== 'boolean') {
      showHeaders = showHeaders === 'true';
    }
    $('#chkDisplayHeaders').prop('checked', showHeaders);
  }

  function initMultiselect() {
    const defaultSelectedValues = [
      'signature_text', 'transliteration', 'normalisation_scandinavian', 'normalisation_norse',
      'english_translation', 'swedish_translation', 'found_location', 'parish', 'municipality', 'district', 'current_location',
      'original_site', 'images', 'rune_type', 'carver', 'num_crosses', 'crosses', 'dating', 'style',
      'material_type', 'material', 'objectInfo', 'reference', 'additional'
    ];

    const savedSelected = localStorage.getItem(gUserSelectedDisplayKey);
    const selectedValues = savedSelected ? JSON.parse(savedSelected) : defaultSelectedValues;
    const savedShowHeaders = localStorage.getItem(gShowHeadersKey);
    const showHeaders = savedShowHeaders ? savedShowHeaders === 'true' : true;

    setMultiselectOptions(selectedValues, showHeaders);
   
    $('#multiselect').multiselect({
      keepRenderingSortRight: false,
      skipInitSortRight: false,
      sort: {
        left: function (a, b) {
          const aValue = parseInt($(a).attr('sortValue'));
          const bValue = parseInt($(b).attr('sortValue'));

          return aValue > bValue ? 1 : -1;
        },
        right: function (a, b) {
          const aValue = parseInt($(a).attr('sortValue'));
          const bValue = parseInt($(b).attr('sortValue'));

          return aValue > bValue ? 1 : -1;
        }
      },
    });

    $('#formatDialogAlertObj').hide();

    document.getElementById('btnApplyDisplayFormat').addEventListener('click', onDisplayFormatClicked);
    document.getElementById('btnDismissDisplayFormat').addEventListener('click', () => {
      // revert the changes
      const savedShowHeaders = localStorage.getItem(gShowHeadersKey);
      const showHeaders = savedShowHeaders ? savedShowHeaders === 'true' : true;
      const savedSelected = localStorage.getItem(gUserSelectedDisplayKey);
      const selectedValues = savedSelected ? JSON.parse(savedSelected) : defaultSelectedValues;
      setMultiselectOptions(selectedValues, showHeaders);
    });

    const formatDialogEl = document.getElementById('divFormatDialog');
    formatDialogEl.addEventListener('shown.bs.modal', event => {
      $('#formatDialogAlertObj').hide();

      // preserve current display options in a local storage, so that we may compare it later to detect user edit
      const lastShowHeaders = $('#chkDisplayHeaders').is(":checked");
      const userSelectedDisplay = $('#multiselect_to option').map((index, el) => $(el).val()).toArray();
      saveUserSelectedDisplay(userSelectedDisplay);
      localStorage.setItem(gShowHeadersKey, lastShowHeaders);
    });
  }

  function onDisplayFormatClicked(e) {
    e.preventDefault();

    const alertObj = $('#formatDialogAlertObj');
    const selectedValues = $('#multiselect_to option').map((index, el) => $(el).val()).toArray();

    if (selectedValues === null || selectedValues.length == 0) {
      alertObj.html('Nothing is selected for display! Please select at least one property.');
      alertObj.show();
      return;
    }
    alertObj.hide();

    // read old values from the local storage
    const lastShowHeaders = localStorage.getItem(gShowHeadersKey);
    const lastUserSelectedValues = JSON.parse(localStorage.getItem(gUserSelectedDisplayKey));

    const showHeaders = $('#chkDisplayHeaders').is(":checked");
    if (!arraysEqual(lastUserSelectedValues, selectedValues) || lastShowHeaders != showHeaders) {
      saveUserSelectedDisplay(selectedValues);
      localStorage.setItem(gShowHeadersKey, showHeaders);

      // display signature info
      $('#multiselect').trigger('displayUpdated', {message: 'hello'});
    }

    $(this).prev().click();
  }

  var module2 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getUserSelectedDisplay: getUserSelectedDisplay,
    getUserSelectedFields: getUserSelectedFields$1,
    initMultiselect: initMultiselect,
    saveUserSelectedDisplay: saveUserSelectedDisplay
  });

  // This script assummes that you reference leaflet.js and leaflet.css in your HTML file.

  // Initialize the map on the user-provided div with a given center and zoom level
  // Default center is [56.607512, 16.439838] and default zoom is 8.
  function initMap(divId, center = [56.607512, 16.439838], zoom = 8) {
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

  function onHideMapClicked(mapContainerId, menuItemId) {
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
  function inscriptions2markers(dbMap, leaflet=L) {
    const mapMarkers = new Map(); // Collection of all created map markers. This is used
    // in order to create markers only once.

    dbMap.forEach((inscriptionData, key) => {
      inscriptionData.signature_text;

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

  function clearMarkers() {
    markers.clearLayers();
  }

  var map_module = /*#__PURE__*/Object.freeze({
    __proto__: null,
    clearMarkers: clearMarkers,
    initMap: initMap,
    inscriptions2markers: inscriptions2markers,
    onHideMapClicked: onHideMapClicked
  });

  // src/index.js

  Object.assign(window, module1, module2, map_module);

})();
