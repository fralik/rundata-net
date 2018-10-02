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

      if (columnName == 'crosses') {
        colData = [];
        let crossesObj = row[columnName];
        for (var cId = 0; cId < crossesObj.length; cId++) {
          var crossObj = crossesObj[cId];
          var oneCross = [];

          if (crossObj[0].length > 0) {
            // this cross has something in group 0, thus it must not
            // contain anything in other groups
            colData.push(crossObj[0][0].name);
            continue;
          }

          for (var gId = 1; gId < crossObj.length; gId++) {
            var groupItems = crossObj[gId];
            if (groupItems.length == 0) {
              oneCross.push('');
              continue;
            }

            var oneGroup = [];
            for (var fId = 0; fId < groupItems.length; fId++) {
              var crossForm = groupItems[fId];
              if (crossForm.isCertain) {
                oneGroup.push(crossForm.name);
              } else {
                oneGroup.push(`${crossForm.name} ?`);
              }
            }
            oneCross.push(oneGroup.join(',')); // join individual cross forms with ,
          }
          colData.push(oneCross.join(';')); // join groups with ;
        }
        colData = colData.join(' & '); // join crosses with &
      }

      if (colData.constructor === Array) {
        colData = colData.join(';');
      }

      if (typeof colData === 'string' || colData instanceof String) {
        colData = colData.replace(/"/g, '""');
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
