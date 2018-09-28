// e.data is a dictionary with fields:
// inscriptions - gDbAsMap for selected signatures
// rows - JSON of selected inscrptions. Use field id.
// columns - columns to include
onmessage = function(e) {
  var csv = [];
  var inscriptions = e.data.inscriptions;
  var columns = e.data.columns;
  var rows = e.data.rows;
  var csvSeparator = ',';
  var newline = '\r\n';

  for (var i = 0; i < rows.length; i++) {
    var inscriptionId = rows[i].id;
    var row = inscriptions[inscriptionId];
    var rowData = [];
    for (var j = 0; j < columns.length; j++) {
      var columnName = columns[j];
      var colData = row[columnName];

      if (columnName == 'signature_text') {
        colData = row['signature_text_raw'];
      }

      if (colData.constructor === Array) {
        colData = colData.join(';');
      }

      rowData.push('"' + colData + '"');
      if (columnName == 'signature_text') {
        rowData.push('"' + row['aliases'] + '"');
      }
    }
    csv.push(rowData.join(csvSeparator));
  }

  postMessage({csv: csv.join(newline), columns: columns});
}
