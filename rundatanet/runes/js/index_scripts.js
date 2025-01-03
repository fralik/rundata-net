export const schemaFieldsInfo = [
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
export function convertDbToKeyMap(db) {
  let content = db.exec("SELECT all_data.*, signatures_with_aliases.aliases FROM all_data LEFT JOIN signatures_with_aliases ON all_data.signature_id = signatures_with_aliases.signature_id");
  const columns = content[0].columns;
  const allRows = content[0].values;
  const signatureIdColumn = columns.indexOf("signature_id");
  const numCrossesColumn = columns.indexOf("num_crosses");
  const latitudeColumn = columns.indexOf('latitude');
  const longitudeColumn = columns.indexOf('longitude');
  const presentLatitudeColumn = columns.indexOf('present_latitude');
  const presentLongitudeColumn = columns.indexOf('present_longitude');
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

export function prepareSignumForDisplay({signature_text, lost, new_reading}) {
  let additional = "";
  if (lost) {
    additional += "†"
  }
  if (new_reading) {
    additional += "$"
  }
  if (additional.length > 0) {
    additional = " " + additional;
  }

  return signature_text + additional;
}

export function fetchAllImages(db) {
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

export function makeImagesMarkup(signatureImageLinks) {
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
export function crossesForMeta(db, metaId) {
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
export function inscriptions2treeNodes(inscriptions) {
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

export function selectFirstSignature() {
  let root = $('#jstree').jstree(true).get_node('#');
  $('#jstree').jstree(true).select_node(root.children[0]);
}

/**
 * Convert list of inscriptions to a list of select options in html format.
 */
export function inscriptions2Select(container, dbMap) {
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

export function initClipboardButtons() {
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

export function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export function displaySignatureInfo() {
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

export function inscriptions2markup() {
  // array of selected inscription IDs
  const selectedSignatureIds = $('#jstree').jstree(true).get_selected();
  const lang = 'en';
  const paragraphSymbol = '§';
  const sidesHeader = "Sides or/and reading variants:"

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