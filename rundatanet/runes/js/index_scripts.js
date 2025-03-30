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
    highlight: true,
  },
  {
    schemaName: 'normalisation_scandinavian',
    text: {
      en: 'Normalisation to Old Scandinavian',
    },
    css: 'normalization',
    highlight: true,
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
    highlight: true,
  },
  {
    schemaName: 'num_crosses',
    text: {
      en: 'Number of crosses',
    },
  },
  {
    schemaName: 'cross_form',
    text: {
      en: 'Cross form',
    },
  },
  {
    schemaName: 'crosses',
    text: {
      en: 'Cross',
    },
  },
  {
    schemaName: 'images',
    text: {
      en: 'Images',
    }
  },
];

const allButNames = /[\$\[\]\{\}\(\)\?<>\^`´\|¬°·:×¤\+÷']|¶+,\./g;
const punctuation = /[\.,;]/g;

// Two tables below are true for DB 20240910. Assembled manually.
const normalizationWordsToSkip = {
  'U 166': [3, 7],
  'Sm 1': [24, 28],
  'U 637': [10, 12],
  'U 1036': [14, 16],
  'M 11': [16, 35],
  'G 280': [5, 7],
  'GR 56': [8],
  'N KJ72': [22],
  'N B625': [69],
  'N B311': [4],
  'N B265': [25],
  'N B259': [1],
  'N B255': [20],
  'N B27': [3],
  'N A197': [3],
  'N A5': [1],
  'N A144': [1],
  'N 603': [5],
  'N 362': [2],
  'N 208': [8],
  'N 171': [13],
  'N 124': [2],
  'N 114': [3],
  'N 26': [8],
  'N 19': [12],
  'DR NOR2004;7': [18],
  'DR NOR1999;21': [47],
  "G 306": [3],
  "G 129": [11],
  "G 119": [24],
  "Gs 8": [7],
  "Vs 27": [10],
  "Vs 22": [6],
  "Vs 3": [15],
  "U THS10;58": [15],
  "U NOR1998;25": [19],
  "U Fv1976;104": [3],
  "U Fv1953;263": [18],
  "U Fv1948;168": [16],
  "U 1168": [6],
  "U 1162": [11],
  "U 1158": [10],
  "U 1132": [13],
  "U 1111": [11],
  "U 1097": [3],
  "U 1060": [5],
  "U 1042": [10],
  "U 1005": [12],
  "U 968": [3],
  "U 952": [16],
  "U 917": [3],
  "U 896": [10],
  "U 805": [40],
  "U 662": [1],
  "U 618": [12],
  "U 545": [24],
  "U 459": [11],
  "U 423": [11],
  "U 351": [14],
  "Vg 219": [13],
  "Vg 67": [25],
  "Sö Fv1986;218": [8],
  "Sö 344": [3],
  "Sö 320": [5],
  "Sö 256": [10],
  "Sö 205": [3],
  "Sö 130": [20],
  "Sö 109": [13],
  "Sö 105": [5],
  "Sö 82": [9],
  "Sö 46": [19],
  "Sö 21": [6],
  "Ög 180": [4],

};
const transliterationWordsToSkip = {
  "IS IR;166": [12],
  'N 157': [4],
  "DR NOR2002;7": [9],
  "G 325": [8],
  "Nä 20": [6],
  "U Sl115": [1],
  "U Fv1992;156": [7],
  "U Fv1986;84": [1, 14],
  "U 775": [13],
  "U 558": [6],
  "U 431": [12],
  "U 29": [29],
  "Sö 196": [34],
  "Ög 51": [4],
};


let gRenderInProgress = false;

/**
 * Retrieves a human-readable name for a schema field in the specified language.
 * 
 * @param {string} schemaName - The machine name of the schema field.
 * @param {string} [lang='en'] - The language code to get the translation for (defaults to 'en').
 * @returns {string} The translated human-readable name if available, otherwise returns the schemaName.
 */
export function getHumanName(schemaName, lang = 'en') {
  const field = schemaFieldsInfo.find(field => field.schemaName === schemaName);
  if (!field) {
    return schemaName; // Return the schemaName as is if not found
  }
  return field.text[lang] || schemaName; // Return the human name or schemaName if translation is missing
}

/**
 * Checks if a given word is a personal name.
 * @param {string} word - The word to check.
 * @returns {boolean} - True if the word is a personal name, false otherwise.
 */
export function isPersonalName(word) {
  return word.startsWith('"') || word.startsWith("&quot;")
    || word.includes('/"') || word.includes('/&quot;');
}


// Extracts word boundaries from inscription texts. These texts
// have multiple separators (whitespaces, punctuation) that often
// go together, i.e. space,punctuation,space
// returns array of objects. Each object:
// {start: num, end: num, text: string, isPersonal: 0|1}
// Arguments:
//   str - search string
function getWordBoundaries(str, sourceIsEscaped = false) {
  // regex used to detect word boundaries
  const wordBoundariesSource = "((\\s+|^(·|:|×|¤|'|\\+|÷|¶))(·|:|×|¤|'|\\+|÷|¶){0,1}\\s*)";
  // the reason it is written so complex via | is because we can do html escaping on that string
  const punctuationSource = "(·|:|×|¤|'|\\||\\+|÷|¶|\\(|\\)|\\[|\\])+"
  //const punctuationSource = "([·|:×¤'+÷¶()|[\]\\])+";
  const reg = new RegExp(sourceIsEscaped ? escapeHtml(wordBoundariesSource) : wordBoundariesSource, 'g');
  // regex used to check if detected word is pure punctuation
  const purePunctuation = new RegExp(sourceIsEscaped ? escapeHtml(punctuationSource) : punctuationSource);

  const words = [];
  let wordBegin = 0;

  function processWord(wordBegin, wordEnd) {
    const wordText = str.slice(wordBegin, wordEnd);

    // Skip double sides character
    if (str.slice(wordBegin, wordBegin + 2) === '¶¶') {
      return null;
    }
    // skip {÷
    if (str.slice(wordBegin, wordBegin+2) === "{÷") {
      return null;
    }

    // Check if the word is pure punctuation
    const punctuationCheck = purePunctuation.exec(wordText);
    if (punctuationCheck && punctuationCheck[0].length === wordText.length) {
      return null;
    }

    // skip ^
    if (wordText == "^") {
      return null;
    }


    const oneWord = {
      start: wordBegin,
      end: wordEnd,
      text: wordText,
      isPersonal: 0,
    };

    // Check if the word is personal
    oneWord.isPersonal = isPersonalName(wordText) ? 1 : 0;

    return oneWord;
  }

  let arr;
  while ((arr = reg.exec(str)) !== null) {
    if (wordBegin === arr.index) {
      wordBegin += arr[0].length;
      continue;
    }
    const oneWord = processWord(wordBegin, arr.index);
    if (oneWord) {
      words.push(oneWord);
    }
    wordBegin = arr.index + arr[0].length;
  }

  // Process any remaining text after the last regex match
  if (wordBegin < str.length) {
    const oneWord = processWord(wordBegin, str.length);
    if (oneWord) {
      words.push(oneWord);
    }
  }

  return words;
}

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
  const wordColumns = ['transliteration', 'normalisation_norse', 'normalisation_scandinavian'];
  
  const allDbImages = fetchAllImages(db);
  let numDiffers = 0;

  const dbArray = allRows.map(row => {
    let objSignature = {};
    const metaId = row[metaColumn];
    for (let j = 0; j < row.length; j++) {
      const columnName = columns[j];
      
      objSignature[columnName] = row[j];
      // handle NULL values
      if (row[j] === null) {
        objSignature[columnName] = "";
      }

      /////////////////////////////////////
      // pre-split words and store arrays
      if (wordColumns.includes(columnName)) {
        objSignature[`${columnName}_html`] = escapeHtml(row[j]);
        objSignature[`${columnName}_word_boundaries`] = getWordBoundaries(objSignature[`${columnName}_html`], true);
      }
    }

    /////////////////////////////////////////
    // Handle exceptions for word searches

    // special treatment for "Sö 145"
    if (objSignature.signature_text === "Sö 145") {
      // treat `ata i` as a single word
      objSignature['transliteration_html'] = escapeHtml(objSignature.transliteration.replace(": ata i ::", ": ata_i ::"));
      objSignature['transliteration_word_boundaries'] = getWordBoundaries(objSignature['transliteration_html'], true);
      // replace it back
      objSignature['transliteration_word_boundaries'][22].text = 'ata i';
    }
    if (normalizationWordsToSkip.hasOwnProperty(objSignature.signature_text)) {
      const wordsToSkip = normalizationWordsToSkip[objSignature.signature_text];
      objSignature.normalisation_norse_word_boundaries = objSignature.normalisation_norse_word_boundaries.filter((_, i) => !wordsToSkip.includes(i));
      objSignature.normalisation_scandinavian_word_boundaries = objSignature.normalisation_scandinavian_word_boundaries.filter((_, i) => !wordsToSkip.includes(i));
    }
    if (transliterationWordsToSkip.hasOwnProperty(objSignature.signature_text)) {
      const wordsToSkip = transliterationWordsToSkip[objSignature.signature_text];
      objSignature.transliteration_word_boundaries = objSignature.transliteration_word_boundaries.filter((_, i) => !wordsToSkip.includes(i));
    }
    // End of exception handling
    /////////////////////////////////////

    // Adjust small mismatches
    if (objSignature.transliteration_word_boundaries.length == 0 && objSignature.normalisation_norse_word_boundaries.length == 1) {
      if (objSignature.normalisation_norse_word_boundaries[0].text == '...') {
        // reset the normalisation_norse_word_boundaries
        objSignature.normalisation_norse_word_boundaries = [];
        objSignature.normalisation_scandinavian_word_boundaries = [];
      }
    }

    wordColumns.forEach(name => {
      // `${name}_word_boundaries` is a list of objects with keys: start, end, text
      // create a new array out of it with only the text
      objSignature[`${name}_words`] = objSignature[`${name}_word_boundaries`].map(boundary => {
        return boundary.text;
      });
    });
    numDiffers += objSignature.transliteration_word_boundaries.length !== objSignature.normalisation_norse_word_boundaries.length ? 1 : 0;

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

  console.log(`Number of signatures with different word boundaries (it should be 0): ${numDiffers}`);
  
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
    const selectedSignatureIds = $('#jstree').jstree(true).get_selected();
    const selectedSignatures = gViewModel.getInscriptions(selectedSignatureIds);

    const html = inscriptions2markup(selectedSignatures);
    document.getElementById('mainDisplay').innerHTML = html.join('');
  } catch (e) {
    console.error(`Error rendering signatures: ${e}`);
  } finally {
    gRenderInProgress = false;
  }
}

function escapeHtml(string) {
  const entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };

  return String(string).replace(/[&<>"'`=\/]/g, function (s) {
    return entityMap[s];
  });
}

export function inscriptions2markup(inscriptions) {
  // array of selected inscription IDs
  //const selectedSignatureIds = $('#jstree').jstree(true).get_selected();
  const lang = 'en';
  const paragraphSymbol = '§';
  const sidesHeader = "Sides or/and reading variants:"

  const showHeaders = $('#chkDisplayHeaders').is(":checked");
  const userSelectedFields =  getUserSelectedFields();
  let markupData = [];
  for (let i = 0; i < inscriptions.length; i++) {

    const inscriptionData = inscriptions[i];
    const signatureId = inscriptionData.id;
    const signatureName = inscriptionData.signature_text;
    
    let paragraph = `<article signature="${signatureName}" id="${signatureName}" rundata-db-id="${signatureId}" class="inscription-section">`;
    for (let j = 0; j < userSelectedFields.length; j++) {
      const field = userSelectedFields[j];
      const columnName = field.schemaName;
      const humanName = field.text[lang];
      const cssStyle = field.css || "";
      const shouldHighlight = field.highlight || false;

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

      if (columnName === "crosses") {
        if (inscriptionData['num_crosses'] == 0) {
          paragraph += '<i>No crosses.</i>';
          continue;
        }

        paragraph += '<table class="crosses" border="1">';
        paragraph += '<thead><tr>';
        paragraph += '<th>A</th>';
        paragraph += '<th>B</th>';
        paragraph += '<th>C</th>';
        paragraph += '<th>D</th>';
        paragraph += '<th>E</th>';
        paragraph += '<th>F</th>';
        paragraph += '<th>G</th>';
        paragraph += '</th></thead>';
        paragraph += '<tbody>';

        const allCrosses = inscriptionData['crosses'];
        for (let k = 0; k < allCrosses.length; k++) {
          if (allCrosses[k][0].length > 0) {
            // this is a cross from an undefined group
            paragraph += '<tr><td colspan="7">' + allCrosses[k][0][0].name + '</td></tr>';
            continue;
          }
          paragraph += '<tr>';
          // we have 8 groups in total, 0 being free-text and not a real group
          for (let gr = 1; gr < 8; gr++) {
            if (allCrosses[k][gr].length == 0) {
              paragraph += '<td><span class="null">&#8709;</span></td>';
              continue;
            }
            paragraph += '<td>';
            paragraph += allCrosses[k][gr].map(function (v, i) {
              let res = '<img src="' + getCrossUrl(v.name) + '" alt="'+v.name+'" title="'+v.name+'" width="32" height="32">';
              if (v.isCerain == 0) {
                res += '?';
              }
              return res;
            }).join(', ');
            paragraph += '</td>';
          }
        }
        paragraph += '</tbody></table>';
        continue;
      }

      columnData = escapeHtml(columnData);

      if (shouldHighlight && inscriptionData.hasOwnProperty('matchDetails') && inscriptionData.matchDetails !== null && inscriptionData.matchDetails.hasOwnProperty('wordIndices')) {
        const entryWordBoundaries = inscriptionData[`${columnName}_word_boundaries`];
        const matchedWords = inscriptionData.matchDetails.wordIndices;
        const matchedWordBoundaries = entryWordBoundaries.filter((_, i) => matchedWords.includes(i));
        columnData = highlightWordsFromWordBoundaries(columnData, matchedWordBoundaries);
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

/**
 * Handle message from export worker
 */
export function onExportWorkerMessage(e) {
  gExportInProgress = false;
  
  if (e.data.error) {
    onExportError({message: e.data.message});
    return;
  }
  
  try {
    // Create a download for the XLSX file
    if (e.data.buffer) {
      // Convert ArrayBuffer to Blob with the correct MIME type
      const blob = new Blob([e.data.buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      
      // Create a download link and trigger the download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'rundata-net_results.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Close the modal after successful export
      $('#modalResultsIo').modal('hide');
    }
  } catch (error) {
    onExportError(error);
  } finally {
    hideLoading();
  }
}

/**
 * Handle export errors
 */
export function onExportError(error) {
  console.error('Export error:', error);
  hideLoading();
  gExportInProgress = false;
  
  // Display error to user
  const alertObj = document.getElementById('alertObj');
  alertObj.textContent = `Export error: ${error.message || 'Unknown error'}`;
  alertObj.style.display = 'block';
  
  // Hide the alert after 5 seconds
  setTimeout(() => {
    alertObj.style.display = 'none';
  }, 5000);
}

/**
 * Helper function to show loading indicator
 */
export function showLoading() {
  $('#loading').show();
}

/**
 * Helper function to hide loading indicator
 */
export function hideLoading() {
  $('#loading').hide();
}
