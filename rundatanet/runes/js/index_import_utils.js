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
  }
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
  e.preventDefault()
  e.stopPropagation()
}
function highlight(e) {
  dropArea.classList.add('highlight')
}

function unhighlight(e) {
  dropArea.classList.remove('highlight')
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
  let multiline = false;
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

export function initDragAndDrop() {
  const dropArea = document.getElementById('drop-area');
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false)
  });
  ['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false)
  });
  ['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false)
  });
  dropArea.addEventListener('drop', handleDrop, false);
  document.getElementById('fileElem').addEventListener('change', handleImportWrapper, false);
}
