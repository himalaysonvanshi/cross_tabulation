var findCrossTabulation = function(data, col1, col2) {
	
	var mapTabulation = {};
	var mapColumn = {};
	var mapRow = {};


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

var OnLoad = function() {
	var col = [];
	for(var i in csvHeader) {
		col.push({"title" : csvHeader[i]});
	}

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

var ShowCrossTabulation = function() {
	var col1 = $("#CTCol1 option:selected").val();
	var col2 = $("#CTCol2 option:selected").val();

	var res = findCrossTabulation(csvData, col1, col2);
	var arrColumn = res.column;
	var arrRow = res.row;
	var mapData = res.data;

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

	console.log(arrData);
	console.log(arrColumn);
	console.log(col);


	$('#CTResultTable').dataTable(
    {
    	"bDestroy": true,
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