// Extracts word boundaries from inscription texts. These texts
// have multiple separators (whitespaces, punctuation) that often
// go together, i.e. space,punctuation,space
// returns array of objects. Each object:
// {start: num, end: num, text: string}
// Arguments:
//   str - search string
function getWordBoundaries(str, sourceIsEscaped = false) {
  // regex used to detect word boundaries
  const wordBoundariesSource = "((\\s+|^(·|:|×|¤|'|\\+|÷|¶))(·|:|×|¤|'|\\+|÷|¶){0,1}\\s*)";
  // the reason it is written so complex via | is because we can do html escaping on that string
  const punctuationSource = "(·|:|×|¤|'|\\||\\+|÷|¶|\\(|\\)|\\[|\\])+"
  //const punctuationSource = "([·|:×¤'+÷¶()|[\]\\])+";
  const reg = new RegExp(sourceIsEscaped ? escapeHtml(wordBoundariesSource) : wordBoundariesSource, 'g');
  // regex used to check if detected word is pure punctuational
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
    if (wordText.startsWith('"') || wordText.startsWith('&quot;')) {
      oneWord.isPersonal = 1;
    }

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

// Utility function to get display name for a field
function getFieldDisplayName(fieldName) {
  switch (fieldName) {
    case 'signature_text':
      return 'Signature';
    case 'normalisation_norse':
      return 'Normalisation Norse';
    case 'normalisation_scandinavian':
      return 'Normalisation Scandinavian';
    case 'transliteration':
      return 'Transliteration';
    default:
      return fieldName;
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

function highlightWordsFromWordBoundaries(str, wordBoundaries) {
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
