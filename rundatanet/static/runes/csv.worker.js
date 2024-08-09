// This function prepares data for export
// Despite the name (csv) it returns data as javascript arrays.
//
// Input: e.data is a dictionary with fields:
//   inscriptions - gDbAsMap for selected signatures
//   rows - JSON of selected inscrptions. Use field id.
//   columns - columns to include
//
// Returns:
// posts a message with an object with two fields:
//   rows - array of arrays with data
//   columns - array of column names
//
onmessage = function(e) {
  let csv = [];
  let inscriptions = e.data.inscriptions;
  let columns = e.data.columns;
  let rows = e.data.rows;

  // check if columns contains 'signature_text' and add 'aliases' (right after 'signature_text') if needed
  if (columns.includes('signature_text') && !columns.includes('aliases')) {
    const signatureIndex = columns.indexOf('signature_text');
    columns.splice(signatureIndex + 1, 0, 'aliases');
  }

  for (let i = 0; i < rows.length; i++) {
    let inscriptionId = rows[i].id;
    let row = inscriptions[inscriptionId];
    let rowData = [];
    for (let j = 0; j < columns.length; j++) {
      let columnName = columns[j];
      let colData = row[columnName];
      if (colData === null) {
        colData = '';
      }

      if (columnName == 'signature_text') {
        colData = row['signature_text_raw'];
      }

      if (columnName == 'crosses') {
        colData = [];
        let crossesObj = row[columnName];
        for (let cId = 0; cId < crossesObj.length; cId++) {
          let crossObj = crossesObj[cId];
          let oneCross = [];

          if (crossObj[0].length > 0) {
            // this cross has something in group 0, thus it must not
            // contain anything in other groups
            colData.push(crossObj[0][0].name);
            continue;
          }

          for (let gId = 1; gId < crossObj.length; gId++) {
            let groupItems = crossObj[gId];
            if (groupItems.length == 0) {
              oneCross.push('');
              continue;
            }

            let oneGroup = [];
            for (let fId = 0; fId < groupItems.length; fId++) {
              let crossForm = groupItems[fId];
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

      rowData.push(colData);
    }
    csv.push(rowData);
  }

  postMessage({rows: csv, columns: columns});
}
