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
      schemaName: 'full_address',
      text: {
        'en': 'Any location',
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
  function getHumanName(schemaName, lang = 'en') {
    const field = schemaFieldsInfo$1.find(field => field.schemaName === schemaName);
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
  function isPersonalName$1(word) {
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
    const punctuationSource = "(·|:|×|¤|'|\\||\\+|÷|¶|\\(|\\)|\\[|\\])+";
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
      oneWord.isPersonal = isPersonalName$1(wordText) ? 1 : 0;

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

  function inscriptions2markup(inscriptions) {
    // array of selected inscription IDs
    //const selectedSignatureIds = $('#jstree').jstree(true).get_selected();
    const lang = 'en';
    const paragraphSymbol = '§';
    const sidesHeader = "Sides or/and reading variants:";

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
        const columnName = field.schemaName == "signature_text" ? "signature_header" : field.schemaName;
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
  function onExportWorkerMessage(e) {
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
        closeResultsIoModal$1();
      }
    } catch (error) {
      onExportError(error);
    } finally {
      hideLoading$1();
    }
  }

  /**
   * Handle export errors
   */
  function onExportError(error) {
    console.error('Export error:', error);
    hideLoading$1();
    gExportInProgress = false;

    // Display error to user
    showAlert("Export error: " + (error.message || 'Unknown error'));
  }

  function showAlert(message) {
    const alertObj = document.getElementById('alertObj');
    alertObj.textContent = message;
    alertObj.style.display = 'block';

    // Hide the alert after 5 seconds
    setTimeout(() => {
      alertObj.style.display = 'none';
    }, 5000);
  }

  /**
   * Helper function to show loading indicator
   * @param {string} [description] - Optional loading description text
   */
  function showLoading$1(description) {
    const defaultDescription = "It can take up to a minute.";
    const txtLoadingDescription = document.getElementById('txtLoadingDescription');

    if (txtLoadingDescription) {
      txtLoadingDescription.textContent = description || defaultDescription;
    }
    $('#loading').show();
  }

  /**
   * Helper function to hide loading indicator
   */
  function hideLoading$1() {
    $('#loading').hide();
  }

  function closeResultsIoModal$1() {
    $('#modalResultsIo').modal('hide');
  }

  var module1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    arraysEqual: arraysEqual$1,
    closeResultsIoModal: closeResultsIoModal$1,
    convertDbToKeyMap: convertDbToKeyMap,
    crossesForMeta: crossesForMeta,
    displaySignatureInfo: displaySignatureInfo,
    fetchAllImages: fetchAllImages,
    getHumanName: getHumanName,
    hideLoading: hideLoading$1,
    initClipboardButtons: initClipboardButtons,
    inscriptions2Select: inscriptions2Select,
    inscriptions2markup: inscriptions2markup,
    inscriptions2treeNodes: inscriptions2treeNodes,
    isPersonalName: isPersonalName$1,
    makeImagesMarkup: makeImagesMarkup,
    onExportError: onExportError,
    onExportWorkerMessage: onExportWorkerMessage,
    prepareSignumForDisplay: prepareSignumForDisplay,
    schemaFieldsInfo: schemaFieldsInfo$1,
    selectFirstSignature: selectFirstSignature,
    showAlert: showAlert,
    showLoading: showLoading$1
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

  /*
   This script assumes that you reference leaflet.js and leaflet.css in your HTML file.
   It allows relies on defined `isSafari` function.
  */

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

  function getGeoIntentURL(lat, lng) {
    if (typeof isSafari !== 'function') {
      console.error('isSafari function is not defined');
      throw new Error('isSafari function is not defined');
    }
    
    if (isSafari()) {
      return `http://maps.apple.com/?daddr=${lat},${lng}`;
    }
    else {
      return `geo:${lat},${lng}?q=${lat},${lng}`;
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


  /**
   * Displays markers on the map based on the provided parameters.
   *
   * @param {Object} options - The options for displaying markers.
   * @param {boolean} [options.preserveMapArea=false] - If true, the map area will not be adjusted to fit the markers.
   * @param {boolean} [options.showOriginalLocation=false] - If true, markers will be shown for the original (found) location of inscriptions, otherwise for the present location.
   * @param {Array<string>} [options.inscriptionIds=[]] - An array of inscription IDs to display markers for.
   * @param {Map<string, Object>} [options.allMarkers=new Map()] - A map containing all markers, keyed by inscription ID.
   * @param {Object} [options.mapObject=null] - The Leaflet map object.
   * @param {Object} [options.markersLayer=null] - The Leaflet layer group to which markers will be added.
   */
  function showMarkers({
    preserveMapArea = false,
    showOriginalLocation = false,
    inscriptionIds = [],
    allMarkers = new Map(),
    mapObject = null,
    markersLayer = null,
  } = {}) {
    // array of all marker's lat/lon. Used to calculate new bounds.
    let markersLatLon = [];
    
    if (!markersLayer || !mapObject) {
      console.log('No markers layer or map object provided');
      return;
    }

    // clear any markers from the map
    markersLayer.clearLayers();

    for (let i = 0; i < inscriptionIds.length; i++) {
      const key = inscriptionIds[i];
      if (!allMarkers.has(key)) {
        continue;
      }
      const inscriptionMarkers = allMarkers.get(key);
      const markerToShow = showOriginalLocation ? inscriptionMarkers.found : inscriptionMarkers.present;
      markersLayer.addLayers(markerToShow);
      markersLatLon.push(markerToShow.getLatLng());
    }

    if (markersLatLon.length > 0 && !preserveMapArea) {
      mapObject.fitBounds(markersLatLon);
    }
  }

  var map_module = /*#__PURE__*/Object.freeze({
    __proto__: null,
    initMap: initMap,
    inscriptions2markers: inscriptions2markers,
    onHideMapClicked: onHideMapClicked,
    showMarkers: showMarkers
  });

  /*
  This file contains code to work with jquery query builder. The query builder must be
  included in your code prior to using this file.
  */


  const queryBuilderPlugins = {
    'bt-tooltip-errors': null,
    'sortable': null,
    'not-group': null,
    // 'case-rule': null,
  };

  const optGroups = {
    "gr_signature": {
      "en": "Inscription",
      "sv": "Signatura",
    },
    "gr_texts": "Texts",
    "gr_location": "Location",
    "other": "---",
  };

  // QueryBuilder plugin for case-(in)sensitive search
  $.fn.queryBuilder.define('case-rule', function(options) {
    let self = this;

    // Bind events
    this.on('afterInit', function() {
      self.$el.on('click.queryBuilder', '[data-case=rule]', function () {
        let $rule = $(this).closest($.fn.queryBuilder.constructor.selectors.rule_container);
        let rule = self.getModel($rule);
        rule.ignoreCase = !rule.ignoreCase;
        // console.log(`afterInit: ${rule.id}, ignoreCase: ${rule.ignoreCase}`);
        // print rule configuration
        // console.log(rule);
      });

      self.model.on('update', function(e, node, field) {
        if (node instanceof $.fn.queryBuilder.constructor.Rule && field === 'ignoreCase') {
          // console.log(`update: ${node.id}, ignoreCase: ${node.ignoreCase}`);
          self.updateRuleCaseIgnore(node);
        }
      });
    });

    // Init case-sensitivity property
    this.on('afterAddRule', function(e, rule) {
      rule.__.ignoreCase = false;
    });

    this.on('afterCreateRuleInput.filter', function(e, rule) {
      // Show plugin's button only for text fields
      if (!rule.filter || typeof rule.filter.input !== 'string') {
        rule.$el.find(cssSelectorPluginCaseRule).hide();
        return;
      }

      if (rule.filter.input.indexOf('text') === -1) {
        rule.$el.find(cssSelectorPluginCaseRule).hide();
      } else {
        rule.$el.find(cssSelectorPluginCaseRule).show();
      }
    });

    // Modify templates
    if (!options.disable_template) {
      this.on('getRuleTemplate.filter', function(h) {
        var $h = $($.parseHTML(h.value));
        $h.find($.fn.queryBuilder.constructor.selectors.rule_actions).prepend(
            '\n<button type="button" class="btn btn-xs btn-default" active data-case="rule">' +
            '<i class="' + options.icon_checked + '"></i> ' +
            '<span class="case-rule-text">' + self.translate('Match case') + '</span>' +
            '</button>'
        );
        h.value = $h.prop('outerHTML');
      });
    }

    // Export "case-rule" to JSON
    this.on('ruleToJson.filter', function(e, rule) {
      e.value.ignoreCase = rule.ignoreCase;
    });

    // Read "case-rule" from JSON
    this.on('jsonToRule.filter', function(e, json) {
      e.value.ignoreCase = !!json.ignoreCase;
    });

    // Export case selector to SQL
    this.on('ruleToSQL.filter', function(e, rule, value, sqlFn) {
      console.log(`ruleToSQL.filter: ${rule.id}, ignoreCase: ${rule.ignoreCase}`);
      if (rule.ignoreCase) {
        e.value = 'NOCASE ( ' + e.value + ' )';
      }
    });
  }, {
    icon_checked: 'bi bi-check2-square',
    disable_template: false
  });

  $.fn.queryBuilder.constructor.utils.defineModelProperties($.fn.queryBuilder.constructor.Rule, ['ignoreCase']);

  const cssSelectorPluginCaseRule = $.fn.queryBuilder.constructor.selectors.rule_actions + ' [data-case=rule]';

  $.fn.queryBuilder.extend({
    /**
     * Performs actions when a rule's case selector changes
     * @param {Rule} rule
     * @fires module:plugins.CaseSelector.updateRuleCaseIgnore
     * @private
     */
    updateRuleCaseIgnore: function(rule) {
        // console.log(`updateRuleCaseIgnore: ${rule.id}, ignoreCase: ${rule.ignoreCase}`);
        rule.$el.find(cssSelectorPluginCaseRule + "> .case-rule-text")
            .text(this.translate(rule.ignoreCase ? 'Ignore case' : 'Match case'));

        /**
         * After the rule's case selector has been modified
         * @event afterUpdateRuleCaseSelector
         * @memberof module:plugins.CaseSelector
         * @param {Rule} rule
         */
        this.trigger('afterUpdateRuleCaseSelector', rule);

        this.trigger('rulesChanged');
    }
  });


  function sortGroupsByOrder(items, groupOrder) {
    const key = 'optgroup'; // The key in items to group by
    groupOrder.forEach((group, index) => {
    });

    // Group items by their key
    const groups = {};
    items.forEach(item => {
      const groupKey = item[key] || '';
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(item);
    });

    // Sort each group alphabetically by label
    Object.keys(groups).forEach(groupKey => {
      groups[groupKey].sort((a, b) => {
        const labelA = a.label || '';
        const labelB = b.label || '';
        return labelA.localeCompare(labelB);
      });
    });

    // Create result array by concatenating groups in specified order
    let result = [];
    groupOrder.forEach(groupKey => {
      if (groups[groupKey]) {
        result = result.concat(groups[groupKey]);
        delete groups[groupKey];
      }
    });

    // Add any remaining groups not specified in groupOrder
    Object.values(groups).forEach(group => {
      result = result.concat(group);
    });

    return result;
  }

  /**
   * Gets the minimum and maximum values of a numerical field from a data source
   *
   * @param {Map|Array} dataSource - Either a Map containing database records or an array of items
   * @param {string} fieldName - The name of the field to analyze
   * @returns {Object} Object containing min and max values, or null if field doesn't exist or has no numeric values
   */
  function getMinMaxValues(dataSource, fieldName) {
    if (!dataSource) {
      throw new Error("dataSource parameter is required");
    }

    if (!fieldName || typeof fieldName !== 'string') {
      throw new Error("fieldName parameter is required and must be a string");
    }

    let min = null;
    let max = null;
    let hasValues = false;

    // Function to process each item
    const processItem = (item) => {
      // Skip if item doesn't have the field or value isn't numeric
      if (!item || item[fieldName] === undefined || item[fieldName] === null) {
        return;
      }

      // Convert to number if it's a string
      const value = typeof item[fieldName] === 'string' ?
        parseFloat(item[fieldName]) : item[fieldName];

      // Skip if not a valid number
      if (isNaN(value)) {
        return;
      }

      // Initialize min/max on first valid value
      if (!hasValues) {
        min = value;
        max = value;
        hasValues = true;
        return;
      }

      // Update min/max
      if (value < min) min = value;
      if (value > max) max = value;
    };

    // Handle different data source types
    if (dataSource instanceof Map) {
      // Process Map values
      for (const item of dataSource.values()) {
        processItem(item);
      }
    } else if (Array.isArray(dataSource)) {
      // Process array items
      for (const item of dataSource) {
        processItem(item);
      }
    } else {
      throw new Error("dataSource must be either a Map or an Array");
    }

    return hasValues ? { min, max } : null;
  }

  function getValuesFromAllData(term, suggest, fieldName, dbMap, isTomSelect = false) {
    // Get all unique values from dbMap for the specified fieldName
    let allValues = [];
    const uniqueTracker = new Set();
    let nextArtificialId = 20000; // Starting ID for aliases

    Array.from(dbMap.values()).forEach(item => {
      const visited = uniqueTracker.has(item[fieldName]);
      if (item[fieldName] && item[fieldName] !== '' && !visited) {
        uniqueTracker.add(item[fieldName]);
        allValues.push({
          text: item[fieldName],
          id: item[fieldName],
          score: item.id || 0
        });
        if (fieldName === 'signature_text' && item.aliases) {
          const aliases = item.aliases.split('|').map(a => a.trim()).filter(a => a);

          // Add each alias with an artificial ID
          aliases.forEach(alias => {
            if (!uniqueTracker.has(alias)) {
              uniqueTracker.add(alias);
              allValues.push({
                text: alias,
                id: alias,
                score: nextArtificialId++,
              });
            }
          });
        }
      }
    });

    allValues.sort((a, b) => a.score - b.score);

    // Comparison without diacritics:
    if (term !== '') {
      // Normalize strings to remove diacritics
      const normalizedTerm = term.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      allValues = allValues.filter(item => {
        const normalizedText = item.text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        return normalizedText.includes(normalizedTerm);
      });
    }

    if (isTomSelect) {
      suggest(allValues);
      return allValues;
    }

    const values = allValues.map(item => item.text);
    suggest(values);
    return values;
  }


  /**
   * Creates an autocomplete configuration object for QueryBuilder.
   *
   * @param {string} ruleId - The unique identifier for the rule.
   * @param {Map} dbMap - A Map containing the database values for autocomplete.
   * @param {Function} humanNameGetter - Function that returns a human-readable name for the given rule ID.
   * @param {Object} [opt={}] - Optional configuration parameters.
   * @param {string} [opt.fieldId] - The field ID to use (defaults to ruleId if not provided).
   * @param {string[]} [opt.operators] - Array of operators to use with this field.
   * @param {string} [opt.type='string'] - The data type for the field.
   * @param {number} [opt.size=100] - The display size of the field.
   * @param {string} [opt.optgroup='other'] - The option group to which this field belongs.
   * @returns {Object} Configuration object for QueryBuilder autocomplete field.
   * @throws {Error} If required parameters are missing or invalid.
   */
  function prepareAutoComplete(ruleId, dbMap, humanNameGetter, opt = {}) {
    // Check required arguments
    if (ruleId === undefined) {
      throw new Error("prepareAutoComplete: 'ruleId' parameter is required");
    }
    if (!dbMap || !(dbMap instanceof Map)) {
      throw new Error("prepareAutoComplete: 'dbMap' parameter is required and must be a Map");
    }
    if (!humanNameGetter || typeof humanNameGetter !== 'function') {
      throw new Error("prepareAutoComplete: 'humanNameGetter' parameter is required and must be a function");
    }

    const fieldId = opt.fieldId || ruleId;
    const operators = opt.operators || ["contains", "not_contains",
          'equal', 'not_equal', 'begins_with', "not_begins_with",
          "ends_with", "not_ends_with", "is_empty", 'is_not_empty'];
    const type = opt.type || 'string';
    const size = opt.size || 100;
    const optgroup = opt.optgroup || "other";

    return {
      id: ruleId,
      field: fieldId,
      optgroup: optgroup,
      label: humanNameGetter(ruleId),
      type: type,
      plugin: 'autoComplete',
      plugin_config: {
        minChars: 0,
        delay: 100,
        source: function (term, suggest) {
          getValuesFromAllData(term, suggest, fieldId, dbMap);
        },
        menuClass: ' clusterize-content ',
        attachToParent: true,
      },
      size: size,
      operators: operators,
    }
  }

  /**
   * Creates a jQuery QueryBuilder filter configuration for integer rules
   *
   * @param {string} ruleId - ID for the rule/filter
   * @param {Map} dbMap - A Map containing the database values for autocomplete.
   * @param {Function} humanNameGetter - Function that returns a human-readable name for the given rule ID.
   * @param {Object} opt - Optional configuration parameters
   * @param {string} opt.fieldId - Field name in data (defaults to ruleId if not provided)
   * @param {Array} opt.operators - Array of operators to use for this filter
   * @param {number} opt.size - Size attribute for the input field
   * @param {string} opt.optgroup - Group to which this filter belongs
   * @param {number} opt.min - Minimum allowed value (optional)
   * @param {number} opt.max - Maximum allowed value (optional)
   * @param {number} opt.step - Step value for input (optional)
   * @param {number} opt.default_value - Default value for the field (optional)
   * @returns {Object} Filter configuration object for QueryBuilder
   */
  function prepareIntegerRule(ruleId, dbMap, humanNameGetter, opt) {
    // Check required arguments
    if (ruleId === undefined) {
      throw new Error("prepareIntegerRule: 'ruleId' parameter is required");
    }
    if (!dbMap || !(dbMap instanceof Map)) {
      throw new Error("prepareIntegerRule: 'dbMap' parameter is required and must be a Map");
    }
    if (!humanNameGetter || typeof humanNameGetter !== 'function') {
      throw new Error("prepareIntegerRule: 'humanNameGetter' parameter is required and must be a function");
    }
    if (!opt) opt = {};
    const fieldId = opt.fieldId || ruleId;
    const operators = opt.operators || ['equal', 'not_equal', 'less', 'less_or_equal', 'greater', 'greater_or_equal', 'between', 'not_between'];
    const size = opt.size || 10;
    const optgroup = opt.optgroup || "other";

    let config = {
      id: ruleId,
      field: fieldId,
      optgroup: optgroup,
      label: humanNameGetter(fieldId),
      type: 'integer',
      size: size,
      operators: operators,
      input: 'number'
    };
    const dataLimitValues = getMinMaxValues(dbMap, fieldId);
    opt.min = opt.min || (dataLimitValues && dataLimitValues.min);
    opt.max = opt.max || (dataLimitValues && dataLimitValues.max);

    // Add validation if any constraints are specified
    if (opt.min !== undefined || opt.max !== undefined || opt.step !== undefined) {
      config.validation = {
        allow_empty_value: true
      };

      if (opt.min !== undefined) config.validation.min = opt.min;
      if (opt.max !== undefined) config.validation.max = opt.max;
      if (opt.step !== undefined) config.validation.step = opt.step;
    }

    // Add default value if provided
    if (opt.default_value !== undefined) {
      config.default_value = opt.default_value;
    }

    return config;
  }


  /**
   * Adjusts the input element in a query rule by applying either TomSelect or AutoComplete plugin
   * based on the rule's operator type.
   *
   * @param {Object} rule - The query rule object containing the element and operator information
   * @param {Object} [tomSelectConfig={}] - Configuration options for TomSelect plugin
   * @param {Object} [autoCompleteConfig={}] - Configuration options for AutoComplete plugin
   *
   * @description This function first cleans up any existing TomSelect or AutoComplete plugins
   * attached to the input element, then initializes the appropriate plugin based on the
   * operator type. If the operator is 'in' or 'not_in', TomSelect is applied; otherwise,
   * AutoComplete is used.
   */
  function adjustTomSelectAndAutoComplete(rule, tomSelectConfig = {}, autoCompleteConfig = {}) {
    var $input = rule.$el.find('.rule-value-container input');
    const operator = rule.operator.type;

    // Clean up existing plugins
    if ($input.data('tomSelect') !== undefined) {
      $input.tomSelect('destroy');
    }
    if ($input.hasClass('autocomplete')) {
      $input.autoComplete('destroy');
    }

    // Initialize the appropriate plugin based on operator
    if (operator === 'in' || operator === 'not_in') {
      $input.tomSelect(tomSelectConfig);
    } else {
      $input.autoComplete(autoCompleteConfig);
    }
  }

  /**
   * Creates a rule for word search in runic texts
   *
   * @param {Object} config Configuration object
   * @param {string} config.id Rule ID
   * @param {string} config.field Field name in data
   * @param {string} config.label Human-readable label
   * @param {string} config.optgroup Option group
   * @param {string[]} config.operators Array of supported operators
   * @returns {Object} Configured QueryBuilder rule
   */
  function createWordSearchRule(config) {
    const input1Label = "Normalization";
    const input2Label = "Transliteration";
    return {
      id: config.id,
      field: config.field,
      label: config.label,
      type: 'string',
      optgroup: config.optgroup || 'gr_texts',
      data: {
        multiField: true,
      },
      input: function(rule, name) {
        return `
        <div class="form-group">
          <div class="input-group mb-3 pt-2">
            <span class="input-group-text" id="${name}_normalization_input_span">${input1Label}</span>
            <input type="text" id="${name}_normalizationInput" class="form-control" placeholder="" aria-label="${input1Label}" aria-describedby="${name}_normalization_input_span">
          </div>
          <div class="input-group">
            <span class="input-group-text" id="${name}_transliteration_input_span">${input2Label}</span>
            <input type="text" id="${name}_transliterationInput" class="form-control" placeholder="" aria-label="${input2Label}" aria-describedby="${name}_transliteration_input_span">
          </div>
          <div class="mt-2">
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" name="${name}_personalNamesMode" value="includeAll" id="${name}_includeAddInput" checked>
              <label class="form-check-label" for="${name}_includeAddInput">Include personal names</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" name="${name}_personalNamesMode" value="excludeNames" id="${name}_excludeNamesInput">
              <label class="form-check-label" for="${name}_excludeNamesInput">Exclude personal names</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" name="${name}_personalNamesMode" value="namesOnly" id="${name}_namesOnlyInput">
              <label class="form-check-label" for="${name}_namesOnlyInput">Personal names only</label>
            </div>
          </div>
        </div>
      `;
      },
      operators: config.operators || ['contains', 'equal', 'begins_with', 'ends_with'],
      valueGetter: function(rule) {
        var $container = rule.$el.find('.rule-value-container');
        return {
          normalization: $container.find('[id$=_normalizationInput]').val(),
          transliteration: $container.find('[id$=_transliterationInput]').val(),
          names_mode: $container.find('[name$=_personalNamesMode]:checked').val()
        };
      },
      valueSetter: function(rule, value) {
        const names_mode = value.names_mode || 'includeAll';
        var $container = rule.$el.find('.rule-value-container');
        $container.find('[id$=_normalizationInput]').val(value.normalization || '');
        $container.find('[id$=_transliterationInput]').val(value.transliteration || '');
        $container.find('[name$=_personalNamesMode][value="' + names_mode + '"]').prop('checked', true);
      }
    };
  }

  /*export const rundataOperators = [
    { type: 'texts_contains', nb_inputs: 2, multiple: false, apply_to: ['string'] },
    { type: 'texts_equal', nb_inputs: 2, multiple: false, apply_to: ['string'] },
    { type: 'texts_begins_with', nb_inputs: 2, multiple: false, apply_to: ['string'] },
    { type: 'texts_ends_with', nb_inputs: 2, multiple: false, apply_to: ['string'] },
  ];*/

  function initQueryBuilder(containerId, viewModel, getHumanName) {
    const dbMap = viewModel.getAllInscriptions();
    const queryBuilder = $(`#${containerId}`);

    const qbOperators = $.fn.queryBuilder.constructor.DEFAULTS.operators.concat([
      // Add to default operators
      { type: 'in_separated_list', nb_inputs: 1, multiple: false, apply_to: ['string'] },
      { type: 'cross_form', nb_inputs: 1, multiple: false, apply_to: ['string'] },
    ]);
    const qbLang = {
      operators: {
        'in_separated_list': "is in |-separated list",
        'cross_form': " ",
      }
    };
    const qbSqlOperators = {
      'in_separated_list': { 'op': 'IN', mod: '{0}' },
      'cross_form': { 'op': 'IN' },
    };

    const signature_text_autocomplete_cfg = {
      minChars: 0,
      delay: 100,
      source: function(term, suggest) {
        getValuesFromAllData(term, suggest, 'signature_text', dbMap);
      },
      menuClass: 'clusterize-content',
      attachToParent: true,
    };

    const signature_text_tomselect_cfg = {
      plugins: ['remove_button'],
      // options: getValuesFromAllData('', undefined, 'signature_text', dbMap),
      load: function(query, callback) {
        let self = this;
        getValuesFromAllData(query, callback, 'signature_text', dbMap, true);
        // prevent further loading
        self.settings.load = null;
      },
      // invoke data loading at once
      preload: true,
      valueField: 'id',
      hideSelected: true,
      delimiter: '|',
    };

    let queryBuilderFilters = [
      {
        id: 'inscription_id',
        optgroup: 'gr_signature',
        field: 'signature_text',
        label: getHumanName('signature_text'),
        type: 'string',
        multiple: true,
        data: {
          multiField: true,
        },
        operators: [
          'in', 'in_separated_list', 'begins_with', 'not_begins_with',
          'ends_with', 'not_ends_with', 'contains', 'not_contains',
        ],
        valueSetter: function (rule, value) {
          const $input = rule.$el.find('.rule-value-container input');
          $input.val(value);
          adjustTomSelectAndAutoComplete(rule, signature_text_tomselect_cfg, signature_text_autocomplete_cfg);
        },
        plugin: 'tomSelect',
        plugin_config: signature_text_tomselect_cfg,
      },
      prepareAutoComplete('carver', dbMap, getHumanName),
      {
        id: 'inscription_country',
        optgroup: "gr_signature",
        field: 'signature_text',
        label: 'Country or Swedish province',
        type: 'string',
        input: 'select',
        multiple: true,
        data: {
          multiField: true,
        },
        operators: ['in'],
        plugin: 'tomSelect',
        plugin_config: {
          plugins: ['remove_button'],
          options: [
            {text: 'Sweden, whole', value: 'all_sweden'},
            {text: 'Öland (Öl)', value: 'Öl '}, {text: 'Östergötland (Ög)', value: 'Ög '}, {text: 'Södermanland (Sö)', value: 'Sö '},
            {text: 'Småland (Sm)', value: 'Sm '}, {text: 'Västergötland (Vg)', value: 'Vg '}, {text: 'Uppland (U)', value: 'U '},
            {text: 'Västmanland (Vs)', value: 'Vs '}, {text: 'Närke (Nä)', value: 'Nä '}, {text: 'Värmland (Vr)', value: 'Vr '},
            {text: 'Gästrikland (Gs)', value: 'Gs '}, {text: 'Hälsingland (Hs)', value: 'Hs '}, {text: 'Medelpad (M)', value: 'M '},
            {text: 'Ångermanland (Ån)', value: 'Ån '}, {text: 'Dalarna (D)', value: 'D '}, {text: 'Härjedalen (Hr)', value: 'Hr '},
            {text: 'Jämtland (J)', value: 'J '}, {text: 'Lappland (Lp)', value: 'Lp '}, {text: 'Dalsland (Ds)', value: 'Ds '},
            {text: 'Bohuslän (Bo)', value: 'Bo '}, {text: 'Gotland (G)', value: 'G '}, {text: 'Sweden, other (SE)', value: 'SE '},
            {text: 'Denmark (DR)', value: 'DR '}, {text: 'Norway (N)', value: 'N '}, {text: 'Faroe Islands (FR)', value: 'FR '},
            {text: 'Greenland (GR)', value: 'GR '}, {text: 'Iceland (IS)', value: 'IS '}, {text: 'Finland (FI)', value: 'FI '},
            {text: 'Shetland (Sh)', value: 'Sh '}, {text: 'Orkney (Or)', value: 'Or '}, {text: 'Scotland (Sc)', value: 'Sc '},
            {text: 'England (E)', value: 'E '}, {text: 'Isle of Man (IM)', value: 'IM '}, {text: 'Ireland (IR)', value: 'IR '},
            {text: 'France (F)', value: 'F '}, {text: 'Netherlands (NL)', value: 'NL '}, {text: 'Germany (DE)', value: 'DE '},
            {text: 'Poland (PL)', value: 'PL '}, {text: 'Latvia (LV)', value: 'LV '}, {text: 'Russia (RU)', value: 'RU '},
            {text: 'Ukraine (UA)', value: 'UA '}, {text: 'Byzantium (By)', value: 'By '}, {text: 'Italy (IT)', value: 'IT '},
            {text: 'Other areas (X)', value: 'X '}
          ],
          hideSelected: true,
        },
        valueSetter: function (rule, value) {
          const $input = rule.$el.find('.rule-value-container select');
          $input.tomSelect('setValue', value);
        }
      },
      createWordSearchRule({
        id: 'normalization_norse_to_transliteration',
        field: 'normalization_norse',
        label: 'Normalization Norse to Transliteration',
        optgroup: 'gr_texts',
      }),
      createWordSearchRule({
        id: 'normalization_scandinavian_to_transliteration',
        field: 'normalisation_scandinavian',
        label: 'Normalization Scandinavian to Transliteration',
        optgroup: 'gr_texts',
      }),
      prepareAutoComplete('english_translation', dbMap, getHumanName, { optgroup: 'gr_texts' }),
      prepareAutoComplete('swedish_translation', dbMap, getHumanName, { optgroup: 'gr_texts' }),

      prepareAutoComplete('full_address', dbMap, getHumanName, { optgroup: 'gr_location', operators: ['contains'] }),
      prepareAutoComplete('found_location', dbMap, getHumanName, { optgroup: 'gr_location' }),
      prepareAutoComplete('parish', dbMap, getHumanName, { optgroup: 'gr_location' }),
      prepareAutoComplete('district', dbMap, getHumanName, { optgroup: 'gr_location' }),
      prepareAutoComplete('municipality', dbMap, getHumanName, { optgroup: 'gr_location' }),
      prepareAutoComplete('current_location', dbMap, getHumanName, { optgroup: 'gr_location' }),
      prepareAutoComplete('original_site', dbMap, getHumanName),
      prepareAutoComplete('parish_code', dbMap, getHumanName, { optgroup: 'gr_location' }),
      prepareAutoComplete('rune_type', dbMap, getHumanName),
      prepareAutoComplete('dating', dbMap, getHumanName),
      prepareIntegerRule('year_from', dbMap, getHumanName, { operators: ['equal', 'less', 'greater', 'between'] }),
      prepareIntegerRule('year_to', dbMap, getHumanName, { operators: ['equal', 'less', 'greater', 'between'] }),
      prepareAutoComplete('style', dbMap, getHumanName),
      prepareAutoComplete('material', dbMap, getHumanName),
      prepareAutoComplete('material_type', dbMap, getHumanName),
      prepareAutoComplete('objectInfo', dbMap, getHumanName),
      prepareAutoComplete('reference', dbMap, getHumanName),
      prepareAutoComplete('additional', dbMap, getHumanName),
      prepareIntegerRule('num_crosses', dbMap, getHumanName, { operators: ['equal', 'less', 'greater', 'between'] }),
      {
        id: 'cross_form',
        field: 'crosses',
        label: getHumanName('cross_form'),
        operators: ['cross_form'],
        optgroup: 'other',
        input: function (rule, name) {
          // this is a bit of a hack as getValuesFromAllData function is intended for other use
          const allCrossForms = viewModel.getAllCrossForms().map(item => {
            return `<option value="${item}">${item}</option>`;
          }).join('');
          return `
          <select name="${name}_1" class="form-select" aria-label="Cross form">${allCrossForms}</select>
          <div>Certain?
            <div class="form-check form-check-inline">
              <input type="radio" name="${name}_2" value="0" class="form-check-input" id="${name}_2_0">
              <label for="${name}_2_0" class="form-check-label">No</label>
            </div>

            <div class="form-check form-check-inline">
              <input type="radio" name="${name}_2" value="1" class="form-check-input" id="${name}_2_1">
              <label for="${name}_2_1" class="form-check-label">Yes</label>
            </div>

            <div class="form-check form-check-inline">
              <input type="radio" name="${name}_2" value="2" class="form-check-input" id="${name}_2_2" checked>
              <label for="${name}_2_2" class="form-check-label">Doesn't matter</label>
            </div>
          </div>`;
        },
        valueGetter: function (rule) {
          const val1 = rule.$el.find('.rule-value-container [name$=_1]').val();
          const val2 = rule.$el.find('.rule-value-container [name$=_2]:checked').val();
          return {form: val1, is_certain: val2};
        },
        valueSetter: function (rule, value) {
          $(rule.$el.find('.rule-value-container [name$=_1]')[0]).val(value.form);
          rule.$el.find(`.rule-value-container [name$=_2][value=${value.is_certain}]`).prop('checked', true);
        },
      },
      {
        id: 'has_personal_name',
        label: "Has personal name(s)?",
        field: 'num_names',
        optgroup: 'other',
        type: 'integer',
        input: 'radio',
        values: [
          {0: 'No'},
          {1: 'Yes'},
        ],
        default_value: 1,
        operators: ['equal'],
      }
    ];

    const my_rule_template = ({ rule_id, icons, settings, translate, builder }) => {
      return `
  <div id="${rule_id}" class="rule-container d-flex align-items-center w-100">
    <div class="rule-header">
    </div>
    ${settings.display_errors ? `
      <div class="error-container flex-shrink-0"><i class="${icons.error}"></i></div>
    ` : ''}
    <div class="rule-filter-container flex-shrink-0"></div>
    <div class="rule-operator-container flex-shrink-0"></div>
    <div class="rule-value-container flex-grow-1 me-2"></div>
    <div class="rule-footer d-flex align-items-center ms-auto">
      <div class="btn-group flex-shrink-0 rule-actions">
        <button type="button" class="btn btn-sm btn-danger" data-delete="rule">
          <i class="${icons.remove_rule}"></i> ${translate("delete_rule")}
        </button>
      </div>
    </div>
  </div>`;
    };

    // sort groups
    queryBuilderFilters = sortGroupsByOrder(queryBuilderFilters, Object.keys(optGroups));

    // swap two first filters, so that signature is on the first place!
    const tmp = queryBuilderFilters[0];
    queryBuilderFilters[0] = queryBuilderFilters[1];
    queryBuilderFilters[1] = tmp;

    queryBuilder.queryBuilder({
      display_empty_filter: false,
      //operators: $.fn.queryBuilder.constructor.DEFAULTS.operators.concat(rundataOperators),

      plugins: queryBuilderPlugins,
      filters: queryBuilderFilters,
      sort_filters: false,
      allow_empty: false,
      optgroups: optGroups,

      operators: qbOperators,
      lang: qbLang,
      sqlOperators: qbSqlOperators,

      templates: {
        rule: my_rule_template,
      },
    });

    // Event handler when rule is created and rule operator is changed
    $('#builder').on('afterCreateRuleInput.queryBuilder afterUpdateRuleOperator.queryBuilder', function(e, rule) {
      if (rule.filter.id !== 'inscription_id') {
        return;
      }
      adjustTomSelectAndAutoComplete(rule, signature_text_tomselect_cfg, signature_text_autocomplete_cfg);
    });

  }

  var query_builder_module = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getMinMaxValues: getMinMaxValues,
    getValuesFromAllData: getValuesFromAllData,
    initQueryBuilder: initQueryBuilder,
    sortGroupsByOrder: sortGroupsByOrder
  });

  /*
  This file contains code to do search in the inscriptions
  */

  /**
   * Normalizes whitespace in a string by replacing all whitespace characters
   * (including non-breaking spaces, tabs, etc.) with regular spaces.
   * This ensures consistent matching regardless of the type of whitespace used.
   * 
   * @param {*} value - The value to normalize
   * @returns {string} The normalized string
   */
  function normalizeWhitespace(value) {
    return String(value).replace(/\s/g, ' ');
  }

  // Standard comparison operators that can be used both in QueryBuilderParser and custom search functions
  const operators = {
    equal: (a, b) => a == b,
    not_equal: (a, b) => a != b,
    in: (a, b) => b.includes(a),
    not_in: (a, b) => !b.includes(a),
    less: (a, b) => a < b,
    less_or_equal: (a, b) => a <= b,
    greater: (a, b) => a > b,
    greater_or_equal: (a, b) => a >= b,
    between: (a, b) => b[0] <= a && a <= b[1],
    not_between: (a, b) => !(b[0] <= a && a <= b[1]),
    begins_with: (a, b) => normalizeWhitespace(a).startsWith(normalizeWhitespace(b)),
    not_begins_with: (a, b) => !normalizeWhitespace(a).startsWith(normalizeWhitespace(b)),
    contains: (a, b) => normalizeWhitespace(a).includes(normalizeWhitespace(b)),
    not_contains: (a, b) => !normalizeWhitespace(a).includes(normalizeWhitespace(b)),
    ends_with: (a, b) => normalizeWhitespace(a).endsWith(normalizeWhitespace(b)),
    not_ends_with: (a, b) => !normalizeWhitespace(a).endsWith(normalizeWhitespace(b)),
    is_empty: (a) => a === '' || a === null || a === undefined || (Array.isArray(a) && a.length === 0),
    is_not_empty: (a) => a !== '' && a !== null && a !== undefined && (!Array.isArray(a) || a.length > 0),
    is_null: (a) => a === null || a === undefined,
    is_not_null: (a) => a !== null && a !== undefined,
  };

  /**
   * JavaScript processor for jQuery QueryBuilder rules.
   * This module allows searching through data using rules
   * generated by jQuery QueryBuilder's getRules() function.
   */

  class QueryBuilderParser {
    /**
     * Initialize the parser with standard operators
     */
    constructor(customSearchFunctions = {}) {
      // Use the external operators
      this.operators = { ...operators };
      this.customSearchFunctions = customSearchFunctions;
    }

    /**
     * Apply rules from jQuery QueryBuilder to filter a list of data.
     *
     * @param {Object} rules - Rules object from jQuery QueryBuilder's getRules() method
     * @param {Array} data - Array of objects (records) to filter
     * @returns {Array} Filtered list of records with match details
     */
    parseRules(rules, data) {
      if (!rules || !data) {
        return [];
      }

      // If rules are invalid, return empty array
      if (rules.valid === false) {
        return [];
      }

      const result = [];
      // If data is an array, process each item
      if (Array.isArray(data)) {
        data.forEach(item => {
          const resultWithDetails = this._evaluateGroup(rules, item);
          if (resultWithDetails.match) {
            result.push({
              record: item,
              matchDetails: resultWithDetails.details || null
            });
          }
        });
      }
      // If data is any iterable (e.g. a generator, Set, etc.)
      else if (typeof data[Symbol.iterator] === 'function') {
        for (const item of data) {
          const resultWithDetails = this._evaluateGroup(rules, item);
          if (resultWithDetails.match) {
            result.push({
              record: item,
              matchDetails: resultWithDetails.details || null
            });
          }
        }
      }
      // Fallback: if data implements the iterator protocol (has a next() method)
      else if (typeof data.next === 'function') {
        let nextItem = data.next();
        while (!nextItem.done) {
          const resultWithDetails = this._evaluateGroup(rules, nextItem.value);
          if (resultWithDetails.match) {
            result.push({
              record: nextItem.value,
              matchDetails: resultWithDetails.details || null
            });
          }
          nextItem = data.next();
        }
      } else {
        throw new Error('Data is not iterable. It must be an array or implement the iterator protocol.');
      }

      return result;
    }

    /**
     * Recursively evaluate a group of rules.
     *
     * @param {Object} group - Group object with condition and rules
     * @param {Object} record - Data record to evaluate against
     * @returns {Object} Object with match (boolean) and details (object) properties
     * @private
     */
    _evaluateGroup(group, record) {
      // Helper function to apply negation if needed
      const applyNegation = (result, shouldNegate) => {
        if (!shouldNegate) return result;

        return {
          match: !result.match
        };
      };

      if (!group.condition || !group.rules) {
        return applyNegation({ match: false }, group.not);
      }

      const condition = group.condition.toUpperCase();
      const rules = group.rules;

      if (!rules || !rules.length) {
        return applyNegation({ match: true }, group.not);
      }

      const results = rules.map(rule => {
        // If it's a nested group
        if (rule.rules) {
          return this._evaluateGroup(rule, record);
        }
        // It's a rule
        else if (rule.id && rule.operator) {
          return this._evaluateRule(rule, record);
        }
        return { match: false };
      });

      // Combine the results based on the condition
      let combinedResult = null;

      if (condition === 'AND') {
        const isMatch = results.every(result => result.match);
        // For AND condition, we collect all details
        const combinedDetails = isMatch ?
          results.reduce((acc, result) => {
            if (result.details) {
              Object.entries(result.details).forEach(([field, details]) => {
                if (!acc[field]) acc[field] = details;
                else if (Array.isArray(acc[field]) && Array.isArray(details)) {
                  // Merge arrays and remove duplicates
                  acc[field] = [...new Set([...acc[field], ...details])];
                }
              });
            }
            return acc;
          }, {}) : null;

        combinedResult = {
          match: isMatch,
          details: combinedDetails
        };
      } else if (condition === 'OR') {
        const matchingResults = results.filter(result => result.match);
        const isMatch = matchingResults.length > 0;

        // For OR condition, we take the first matching details
        combinedResult = {
          match: isMatch,
          details: isMatch ? matchingResults[0].details : null
        };
      } else {
        throw new Error(`Unknown condition: ${condition}`);
      }

      return applyNegation(combinedResult, group.not);
    }

    /**
     * Evaluate a single rule against a record.
     *
     * @param {Object} rule - Rule object with id, operator, and value
     * @param {Object} record - Data record to check against
     * @returns {Object} Object with match (boolean) and details (object) properties
     * @private
     */
    _evaluateRule(rule, record) {
      const field = rule.field || rule.id;
      const operatorName = rule.operator;
      const isMultiFieldRule = rule.data && rule.data.multiField === true;

      // Fast path: handle custom search functions first
      if (rule.id &&
          this.customSearchFunctions[rule.id] &&
          typeof this.customSearchFunctions[rule.id][operatorName] === "function") {

        // For custom functions, provide field value or entire record as needed
        const valueToCheck = isMultiFieldRule ? record : record[field];
        const result = this.customSearchFunctions[rule.id][operatorName](valueToCheck, rule.value);

        // Normalize the result to always have match and details properties
        return typeof result === 'object' && 'match' in result ?
          result : { match: Boolean(result) };
      }

      // For standard single-field rules, verify the field exists
      if (!isMultiFieldRule && !(field in record)) {
        return { match: false };
      }

      // For multi-field rules without custom handlers, we can't process with standard operators
      if (isMultiFieldRule) {
        return { match: false };
      }

      const fieldValue = record[field];

      // Handle special operators that don't need a value
      if (['is_empty', 'is_not_empty', 'is_null', 'is_not_null'].includes(operatorName)) {
        const result = this.operators[operatorName](fieldValue);
        return {
          match: result,
          details: result ? { [field]: true } : null
        };
      }

      // For regular operators, ensure we have a value to compare against
      const ruleValue = rule.value;
      if (ruleValue === null || ruleValue === undefined) {
        return { match: false };
      }

      if (typeof ruleValue === 'number' && fieldValue === '') {
        // Handle case where fieldValue is an empty string but ruleValue is a number
        return { match: false };
      }

      // Apply the operator and normalize the result
      const result = this.operators[operatorName](fieldValue, ruleValue);
      const isMatch = Boolean(result);

      return {
        match: isMatch,
        details: isMatch ? { [field]: true } : null
      };
    }

    /**
     * Add a custom operator function.
     *
     * @param {string} name - Name of the operator
     * @param {Function} func - Function that takes two arguments (fieldValue, ruleValue) and returns an object with match and details properties
     */
    addOperator(name, func) {
      this.operators[name] = func;
    }

    /**
     * Add a custom type converter.
     *
     * @param {string} typeName - Name of the type
     * @param {Function} func - Function that converts a value to the specified type
     */
    addTypeConverter(typeName, func) {
      this.typeConverters[typeName] = func;
    }
  }

  /**
   * Wrapper function for searching in signature_text and aliases
   * @param {Object} record - The complete record object containing signature_text and aliases
   * @param {string|Array} ruleValue - The value to search for
   * @param {Function} operatorFn - The comparison function to apply (e.g., String.includes, String.startsWith)
   * @param {boolean} [negate=false] - Whether to negate the result
   * @returns {Object} Result object with match property
   */
  const searchSignatureWrapper = (record, ruleValue, operatorFn, negate = false) => {
    // Get the main signature text
    const signatureText = record.signature_text;

    // Get the aliases (if any) as an array
    const aliases = record.aliases ?
      record.aliases.split('|').map(a => a.trim()).filter(a => a) :
      [];

    // Combine into one array of values to check
    const allSignatures = [signatureText, ...aliases];

    // Process the rule value based on the input type
    const items = Array.isArray(ruleValue) ? ruleValue :
      (typeof ruleValue === 'string' && ruleValue.indexOf('|') > -1) ?
      ruleValue.split('|') :
      [ruleValue];

    // Apply the operator function to check if any signature matches any item
    let match = allSignatures.some(sig =>
      items.some(item => operatorFn(sig, item))
    );

    // Negate the result if needed
    if (negate) {
      match = !match;
    }

    return { match };
  };

  const doWordSearch = (entry, ruleValue, searchDirection, searchMode) => {
    const isAHit = getWordSearchFunction(searchMode);
    // key names defined in valueGetter, e.g. normalization_norse_to_transliteration
    const normalisationQuery = ruleValue['normalization'];
    const transliterationQuery = ruleValue['transliteration'];
    const namesMode = ruleValue['names_mode'];

    // Determine which normalization field to use
    const normalizationField = searchDirection.includes('norse') ?
      'normalisation_norse' : 'normalisation_scandinavian';

    const normalWords = entry[`${normalizationField}_words`];
    const transliterationWords = entry['transliteration_words'];

    let matchFound = false;
    let matchedWords = [];
    let numFoundNames = 0;

    // Helper function to check personal name constraints and record matches
    const processMatch = (index, isPersonal) => {
      // Skip if filtering by personal names and constraints are not met
      if ((namesMode === 'excludeNames' && isPersonal) ||
          (namesMode === 'namesOnly' && !isPersonal)) {
        return false;
      }

      matchFound = true;
      matchedWords.push(index);
      if (isPersonal) numFoundNames++;
      return true;
    };

    // Case 1: Both normalization and transliteration queries are present
    if (normalisationQuery && transliterationQuery) {
      for (let i = 0; i < Math.min(normalWords.length, transliterationWords.length); i++) {
        if (isAHit(normalWords[i], normalisationQuery) && isAHit(transliterationWords[i], transliterationQuery)) {
          processMatch(i, isPersonalName(normalWords[i]));
        }
      }
    }
    // Case 2: Only one query type is present
    else {
      // Check normalization words
      if (normalisationQuery) {
        normalWords.forEach((word, i) => {
          if (isAHit(word, normalisationQuery)) {
            processMatch(i, isPersonalName(word));
          }
        });
      }

      // Check transliteration words
      if (transliterationQuery) {
        transliterationWords.forEach((word, i) => {
          if (isAHit(word, transliterationQuery)) {
            // transliterated words don't contain personal name annotation
            const isPersonal = (i < normalWords.length) && isPersonalName(normalWords[i]);
            processMatch(i, isPersonal);
          }
        });
      }
    }

    return {
      match: matchFound,
      details: matchFound ? {
        wordIndices: matchedWords,
        numPersonalNames: numFoundNames
      } : null
    };
  };

  const searchCrossForm = (crosses, ruleValue) => {
    if (!crosses || crosses.length === 0) {
      return { match: false };
    }

    const ruleIsCertain = parseInt(ruleValue.is_certain, 10);
    const searchForm = ruleValue.form;

    // Flatten the array structure and search through all elements
    for (const cross of crosses) {
      if (!Array.isArray(cross)) continue;

      for (const group of cross) {
        if (!Array.isArray(group)) continue;

        for (const element of group) {
          // Check if the form name matches
          if (element.name === searchForm) {
            // If certainty doesn't matter (option 2) or certainty matches
            if (ruleIsCertain === 2 || ruleIsCertain === element.isCertain) {
              return { match: true };
            }
          }
        }
      }
    }

    return { match: false };
  };

  const searchHasPersonalName = (numNames, ruleValue) => {
    const isMatch = ruleValue === 0 ? numNames === 0 : numNames > 0;
    return { match: isMatch };
  };

  const searchCountryOrProvince = (entry, ruleValues) => {
    for (let i = 0; i < ruleValues.length; i++) {
      // let areaCode = ruleValues[i];
      if (ruleValues[i] == 'all_sweden') {
        const areaCodes = ['Öl ', 'Ög ', 'Sö ', 'Sm ', 'Vg ', 'U ', 'Vs ', 'Nä ', 'Vr ', 'Gs ', 'Hs ', 'M ', 'Ån ', 'D ', 'Hr ', 'J ', 'Lp ', 'Ds ', 'Bo ', 'G ', 'SE ', 'Bo'];
        for (let j = 0; j < areaCodes.length; j++) {
          if (operators.begins_with(entry['signature_text'], areaCodes[j])) {
            return { match: true };
          }
        }
        const districts = ['Skåne', 'Halland', 'Blekinge'];
        for (let j = 0; j < districts.length; j++) {
          if (operators.contains(entry['district'], districts[j])) {
            return { match: true };
          }
        }
        return { match: false };
      }
      if (operators.begins_with(entry['signature_text'], ruleValues[i])) {
        return { match: true };
      }
    }
    return { match: false };
  };

  const customSearchFunctions = {
    inscription_id: {
      in: (record, ruleValue) => searchSignatureWrapper(record, ruleValue, operators.equal),
      in_separated_list: (record, ruleValue) => searchSignatureWrapper(record, ruleValue, operators.equal),
      begins_with: (record, ruleValue) => searchSignatureWrapper(record, ruleValue, operators.begins_with),
      not_begins_with: (record, ruleValue) => searchSignatureWrapper(record, ruleValue, operators.begins_with, true),
      ends_with: (record, ruleValue) => searchSignatureWrapper(record, ruleValue, operators.ends_with),
      not_ends_with: (record, ruleValue) => searchSignatureWrapper(record, ruleValue, operators.ends_with, true),
      contains: (record, ruleValue) => searchSignatureWrapper(record, ruleValue, operators.contains),
      not_contains: (record, ruleValue) => searchSignatureWrapper(record, ruleValue, operators.contains, true),
      equal: (record, ruleValue) => searchSignatureWrapper(record, ruleValue, operators.equal),
      not_equal: (record, ruleValue) => searchSignatureWrapper(record, ruleValue, operators.not_equal),
    },
    inscription_country: {
      in: searchCountryOrProvince,
    },
    normalization_norse_to_transliteration: {
      contains: (fieldValue, ruleValue) => {
        return doWordSearch(fieldValue, ruleValue, 'norseToTransliteration', 'includes');
      },
      equal: (fieldValue, ruleValue) => {
        return doWordSearch(fieldValue, ruleValue, 'norseToTransliteration', 'exact');
      },
      begins_with: (fieldValue, ruleValue) => {
        return doWordSearch(fieldValue, ruleValue, 'norseToTransliteration', 'beginsWith');
      },
      ends_with: (fieldValue, ruleValue) => {
        return doWordSearch(fieldValue, ruleValue, 'norseToTransliteration', 'endsWith');
      },
    },
    normalization_scandinavian_to_transliteration: {
      contains: (fieldValue, ruleValue) => {
        return doWordSearch(fieldValue, ruleValue, 'scandinavianToTransliteration', 'includes');
      },
      equal: (fieldValue, ruleValue) => {
        return doWordSearch(fieldValue, ruleValue, 'scandinavianToTransliteration', 'exact');
      },
      begins_with: (fieldValue, ruleValue) => {
        return doWordSearch(fieldValue, ruleValue, 'scandinavianToTransliteration', 'beginsWith');
      },
      ends_with: (fieldValue, ruleValue) => {
        return doWordSearch(fieldValue, ruleValue, 'scandinavianToTransliteration', 'endsWith');
      },
    },
    cross_form: {
      cross_form: searchCrossForm,
    },
    has_personal_name: {
      equal: searchHasPersonalName,
      not_equal: (fieldValue, ruleValue) => {
        const result = searchHasPersonalName(fieldValue, ruleValue);
        return { match: !result.match };
      },
    },
  };

  /**
   * Returns a word search function based on the specified search mode
   * @param {string} searchMode - The search mode ('exact', 'beginsWith', 'endsWith', 'regex', 'includes')
   * @param {Object} options - Additional options
   * @param {boolean} [options.ignoreCase=false] - Whether to ignore case when searching
   * @returns {Function} A search function that takes (word, query) parameters
   * @throws {Error} When an invalid regex pattern is provided in regex mode
   */
  function getWordSearchFunction(searchMode, options = {}) {
    const { ignoreCase = false } = options;

    // Create a function to handle case sensitivity
    const prepareString = ignoreCase
      ? str => String(str).toLowerCase()
      : str => String(str);

    const prepareWord = (word) => {
      // Check if this might be a list of personal names (divided by HTML escaped / symbol)
      if (word.includes('&#x2F;') || word.includes('/')) {
        // Split by the HTML escaped slash or regular slash
        const names = word.split(/&#x2F;|\//).map(name => {
          // Trim whitespace and remove quotes (both regular and HTML escaped) from the beginning
          return name.trim().replace(/^(&quot;|")/, '');
        });
        // Return the array of individual names
        return names;
      }

      // If it's not a list, just return the original word
      return [word];
    };

    switch (searchMode) {
      case 'exact':
        return (word, query) => {
          const words = prepareWord(word);
          // Check if any of the words match the query
          return words.some(w => prepareString(w) === prepareString(query));
        }

      case 'beginsWith':
        return (word, query) => {
          const words = prepareWord(word);
          // Check if any of the words start with the query
          return words.some(w => prepareString(w).startsWith(prepareString(query)));
        }

      case 'endsWith':
        return (word, query) => {
          const words = prepareWord(word);
          // Check if any of the words end with the query
          return words.some(w => prepareString(w).endsWith(prepareString(query)));
        }

      case 'regex': {
        return (word, query) => {
          try {
            const flags = ignoreCase ? 'i' : '';
            // Create RegExp only once per query
            const regex = new RegExp(query, flags);
            return regex.test(word);
          } catch (error) {
            throw new Error(`Invalid regex pattern: ${query}`);
          }
        };
      }

      case 'includes':
      default:
        return (word, query) => {
          const words = prepareWord(word);
          // Check if any of the words include the query
          return words.some(w => prepareString(w).includes(prepareString(query)));
        }
    }
  }


  /**
   * Perform a search using QueryBuilder rules
   * @param {Object} rules - Rules object from jQuery QueryBuilder's getRules() method
   * @param {Array|Iterable} dbMap - Data to search through
   * @returns {Array} Array of objects that match search rules. Each item includes record data from
   *                  dbMap and matchDetails property with details of the match.
   */
  function doSearch(rules, dbMap) {
    const parser = new QueryBuilderParser(customSearchFunctions);
    const resultsRaw = parser.parseRules(rules, dbMap);
    const results = resultsRaw.map(({ record, matchDetails }) => ({
      ...record,
      matchDetails
    }));

    return results;
  }

  function calcWordsAndPersonalNames(dbMap) {
    let totalWordMatches = 0;
    let totalPersonalNames = 0;
    let totalSignatures = 0;

    try {
      const entries = dbMap.values();
      for (const entry of entries) {
        if (entry.matchDetails && entry.matchDetails.wordIndices) {
          totalWordMatches += entry.matchDetails.wordIndices.length;
          totalPersonalNames += entry.matchDetails.numPersonalNames;
        } else {
          totalWordMatches += entry.normalisation_norse_word_boundaries.length;
          entry.normalisation_norse_word_boundaries.forEach(boundary => {
            totalPersonalNames += boundary.isPersonal;
          });
        }
        totalSignatures++;
      }
    } catch (error) {
      console.error('Error calculating words and personal names:', error);
    }

    $(document).trigger('updateSignatureCount', { count: totalSignatures });
    $(document).trigger('updateWordCount', { count: totalWordMatches });
    $(document).trigger('updatePersonalNameCount', { count: totalPersonalNames });
  }

  function highlightWordsFromWordBoundaries$1(str, wordBoundaries) {
    // Sort the indices to ensure they are processed in the correct order
    wordBoundaries.sort((a, b) => a.start - b.start);

    let highlightedStr = '';
    let lastIndex = 0;

    wordBoundaries.forEach(({start, end, text}) => {
      // Append the part of the string before the current word
      highlightedStr += str.slice(lastIndex, start);
      // Wrap the word in a <span> tag and append it
      highlightedStr += `<span class="highlight">${str.slice(start, end)}</span>`;
      // Update the lastIndex to the end of the current word
      lastIndex = end;
    });

    // Append the remaining part of the string after the last word
    highlightedStr += str.slice(lastIndex);

    return highlightedStr;
  }

  var search_module = /*#__PURE__*/Object.freeze({
    __proto__: null,
    QueryBuilderParser: QueryBuilderParser,
    calcWordsAndPersonalNames: calcWordsAndPersonalNames,
    doSearch: doSearch,
    getWordSearchFunction: getWordSearchFunction,
    highlightWordsFromWordBoundaries: highlightWordsFromWordBoundaries$1,
    operators: operators
  });

  // view-model.js
  class RunicViewModel {
    constructor(dbMap) {
      this.dbMap = dbMap;            // Original data source
      this.searchResults = null;     // Last search results (or null if no search active)
      this.currentSelectionIds = []; // Currently selected IDs
      this.allCrossForms = new Set();

      for (const inscription of dbMap.values()) {
        if (inscription.crosses && Array.isArray(inscription.crosses)) {
          for (const cross of inscription.crosses) {
            if (Array.isArray(cross)) {
              for (const group of cross) {
                if (Array.isArray(group)) {
                  for (const element of group) {
                    this.allCrossForms.add(element.name);
                  }
                }
              }
            }
          }
        }
      }
      this.allCrossForms = Array.from(this.allCrossForms).sort();
    }
    
    // Get data for a specific ID, prioritizing search results if available
    getInscriptionData(id) {
      if (this.searchResults && this.searchResults.has(id)) {
        return this.searchResults.get(id);
      }
      return this.dbMap.get(id);
    }

    getAllCrossForms() {
      return this.allCrossForms;
    }

    getInscriptions(ids) {
      if (this.searchResults && this.searchResults.size > 0) {
        return ids.map(id => this.searchResults.get(parseInt(id, 10)));
      }
      return ids.map(id => this.dbMap.get(parseInt(id, 10)));
    }
    
    /**
     * Retrieves all inscriptions from the database map.
     * @returns {Iterator} An iterator over all values in the database map.
     */
    getAllInscriptions() {
      return this.dbMap;
    }

    // Get all currently active inscriptions (filtered by search if a search is active)
    getActiveInscriptions() {
      if (this.searchResults) {
        return Array.from(this.searchResults.values());
      }
      return Array.from(this.dbMap.values());
    }
    
    // Get all currently active inscription IDs (filtered by search if a search is active)
    getActiveInscriptionIds() {
      if (this.searchResults) {
        return Array.from(this.searchResults.keys());
      }
      return Array.from(this.dbMap.keys());
    }

    // Update search results
    setSearchResults(results) {
      if (!results) {
        this.searchResults = null;
        return;
      }
      
      // Convert array to Map for O(1) lookups
      this.searchResults = new Map();
      results.forEach(result => {
        this.searchResults.set(result.id, result);
      });
      
      // Update current selection to match search results
      // this.currentSelectionIds = Array.from(this.searchResults.keys());
      
      // Notify subscribers that data has changed
      $(document).trigger('viewModelUpdated', { 
        source: 'search',
        count: this.searchResults.size,
        model: this
      });
    }

    // Clear search results
    clearSearchResults() {
      this.searchResults = null;
      //this.currentSelectionIds = Array.from(this.dbMap.keys());
      
      $(document).trigger('viewModelUpdated', { 
        source: 'reset',
        count: this.dbMap.size,
        model: this
      });
    }
    
    // Update current selections
    // setSelection(ids) {
    //   this.currentSelectionIds = ids;
    //   $(document).trigger('selectionChanged', { ids });
    // }
  }

  var view_model_module = /*#__PURE__*/Object.freeze({
    __proto__: null,
    RunicViewModel: RunicViewModel
  });

  function handleImportWrapper(evt) {
    handleFiles(evt.target.files);
    closeResultsIoModal();

    // reset form, so that we can import the same file again if we need to
    $('form#form-signature-import').get(0).reset();
  }

  function handleFiles(files) {
    if (files.length == 0) {
      return;
    }
    var fileReader = new FileReader();
    var file = files[0]; // be sure to take just a single file
    fileReader.onloadend = function(evt) {
      if (evt.target.readyState == FileReader.DONE) {
        $('#loading-sub-text').html('This dialog will disappear once data is ready');
        showLoading();
        setTimeout(importSignaturesHandler, 10, evt.target.result);
      }
    };
    fileReader.readAsText(file);
  }

  function handleDrop(e) {
    let dt = e.dataTransfer;
    let files = dt.files;

    handleFiles(files);
    closeResultsIoModal();
  }

  // Event handler that stops event propagation. Used for drag and drop support
  function preventDefaults (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  function highlight(e) {
    dropArea.classList.add('highlight');
  }

  function unhighlight(e) {
    dropArea.classList.remove('highlight');
  }

  // Import list of signatures provided from a file
  // Function argument fileContent is the actual file content.
  function importSignaturesHandler(fileContent) {
    if (fileContent === null) {
      return;
    }
    if (/[\x00-\x08\x0E-\x1F]/.test(fileContent)) {
      alert("Seems like the file you've selected is not textual. Please select a different file.");
      hideLoading();
      return;
    }

    const csvData = Papa.parse(fileContent);
    let numLines = csvData.data.length;
    let firstDataRow = 0;
    let signatureColumn = 0;
    let numEntries = 0;
    let values = [];

    if (numLines == 2) {
      // check if csvData.data[1] is a string or array
      if (typeof csvData.data[1] === 'string') {
        if (csvData.data[1].trim().length == 0) {
          numLines = 1;
        }
      } else {
        if (csvData.data[1][0].trim().length == 0) {
          numLines = 1;
        }
      }
    }

    if (numLines > 1) {
      let signatureCandidate = csvData.data[0].findIndex(item => 'signature' === item.toLowerCase());
      if (signatureCandidate != -1) {
        firstDataRow = 1;
        signatureColumn = signatureCandidate;
      }

      numEntries = csvData.data.length;
      for (var i = firstDataRow; i < numEntries; i++) {
        // iterate over rows
        if (!csvData.data[i][signatureColumn] || csvData.data[i][signatureColumn].trim().length == 0) {
          continue;
        }
        values.push(csvData.data[i][signatureColumn].trim());
      }
    } else {
      // single line, treat every value as a signature
      numEntries = csvData.data[0].length;
      for (var i = 0; i < numEntries; i++) {
        // iterate over columns
        if (!csvData.data[0][i] || csvData.data[0][i].trim().length == 0) {
          continue;
        }
        values.push(csvData.data[0][i].trim());
      }
    }

    // Concatenate values into a string with '|' as separator
    values = values.join('|');

    var rule = [{
      id: "signature_text",
      field: "signature_text",
      type: "string",
      input: "text",
      operator: "in_separated_list",
      value: values,
      ignoreCase: false,
    }];

    var allRules = {
      condition: 'OR',
      rules: rule,
      not: false,
    };

    $(`#${inpQueryBuilder}`).queryBuilder('setRules', allRules, true);
    // doSearch();
    hideLoading();
    // After importing signatures, automatically trigger the search
    document.getElementById('btnSearch').click();
  }

  function initDragAndDrop() {
    const dropArea = document.getElementById('drop-area');
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, preventDefaults, false);
    });
    ['dragenter', 'dragover'].forEach(eventName => {
      dropArea.addEventListener(eventName, highlight, false);
    });
    ['dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, unhighlight, false);
    });
    dropArea.addEventListener('drop', handleDrop, false);
    document.getElementById('fileElem').addEventListener('change', handleImportWrapper, false);
  }

  var import_utils_module = /*#__PURE__*/Object.freeze({
    __proto__: null,
    initDragAndDrop: initDragAndDrop
  });

  // src/index.js

  Object.assign(window, module1, module2, map_module, query_builder_module, search_module, view_model_module, import_utils_module);

})();
