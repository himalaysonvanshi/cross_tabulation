/**
 * find cross tabulation on given data for given columns
 * @param {data} csv file data
 * @param {col1} column 1
 * @param {col2} column 2
 * @returns {object} result object containing map of result and row and column array
 */
var findCrossTabulation = function(data, col1, col2) {
	
	var mapTabulation = {};
	var mapColumn = {};
	var mapRow = {};

	// loop through data and create a map for cross tabulation
	for(var i = 0; i < data.length; i++) {
		var row = data[i];
		if(!mapTabulation[row[col1]]) {
			mapTabulation[row[col1]] = {};
		}
		if(!mapTabulation[row[col1]][row[col2]]) {
			mapTabulation[row[col1]][row[col2]] = 0;
		}
		mapTabulation[row[col1]][row[col2]]++;

		mapColumn[row[col1]] = 1;
		mapRow[row[col2]] = 1;
	}

	return {
		data: mapTabulation,
		column: Object.keys(mapColumn),
		row: Object.keys(mapRow)
	};
};

/**
 * on load function, initialize datatable to show csv data
 */
var OnLoad = function() {
	var col = [];
	for(var i in csvHeader) {
		col.push({"title" : csvHeader[i]});
	}

	// initializing
	$('#csvDataTable').dataTable(
    {
        data: csvData,
        columns: col,
        "pagingType": "full",
        "aLengthMenu": [
            [10, 25, 50, 100, 200, -1],
            [10, 25, 50, 100, 200, "All"]
        ],
        "autoWidth" : false
        	
    });
};

/**
 * cross tabulation data table, needed to destroy before reinitializing
 */
var CTTable = null;

/**
 * on show cross tabulation clicked, calculate and show data of cross tabulation of selected columns
 */
var ShowCrossTabulation = function() {
	var col1 = $("#CTCol1 option:selected").val();
	var col2 = $("#CTCol2 option:selected").val();

	var res = findCrossTabulation(csvData, col1, col2);
	var arrColumn = res.column;
	var arrRow = res.row;
	var mapData = res.data;

	// create drawable array for datatable from map
	var arrData = [];
	for(var i = 0; i < arrRow.length; i++) {
		arrData[i] = [arrRow[i]];
		for(var j = 0; j < arrColumn.length; j++) {
			if (mapData[arrColumn[j]][arrRow[i]]) {
				arrData[i][j + 1] = mapData[arrColumn[j]][arrRow[i]];	
			}
			else {
				arrData[i][j + 1] = 0;	
			}			
		}				
	}

	var col = [{"title" : ""}];
	for(var i in arrColumn) {
		col.push({"title" : arrColumn[i]});
	}

	// Destroy CTTable before reinitializing
	if(CTTable) {
		CTTable.fnDestroy();
		$('#CTResultTable').empty();
	}

	// initialize datatable for cross tabulation result
	CTTable = $('#CTResultTable').dataTable(
    {
    	data: arrData,
        columns: col,
        "pagingType": "full",
        "aLengthMenu": [
            [10, 25, 50, 100, 200, -1],
            [10, 25, 50, 100, 200, "All"]
        ],
        "autoWidth" : false,
        
    });		

    $('#CTResult').show();
    window.location.href = window.location.pathname + "#CTResult"; 
}