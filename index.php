<?php

// needed for php to detect linux style line endings
ini_set('auto_detect_line_endings', true);

// if file is uploaded, parse csv
$bCsvUploaded = isset($_FILES["inputFile"]["tmp_name"]);

if($bCsvUploaded) 
{
	$mapTabulation = array();
	$csvData = array();
	$csvHeader = array();
	
	$row = 0;
	if (($handle = fopen($_FILES["inputFile"]["tmp_name"], "r")) !== FALSE) {
	    while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
	        $num = count($data);
        	if($row == 0) {
        		for ($col = 0; $col < $num; $col++) {
		        	$csvHeader[$col] = htmlspecialchars($data[$col]);
		        }
        	}
        	else {
	        	for ($col = 0; $col < $num; $col++) {
		        	$csvData[$row - 1][$col] = htmlspecialchars($data[$col]);
		        }
		    }
	        		    
	        $row++;	        
	    }
	    fclose($handle);
	}
}
?>
<!DOCTYPE html>
<html>
<head>

	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
	<script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
	
	<script type="text/javascript" charset="utf8" src="//cdn.datatables.net/1.10.12/js/jquery.dataTables.js"></script>	

	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" type="text/css"/>
	<link rel="stylesheet" type="text/css" href="//cdn.datatables.net/1.10.12/css/jquery.dataTables.css">



	<?php if($bCsvUploaded) { ?>
			<script type="text/javascript">
				var csvData = <?= json_encode($csvData) ?>;
				var csvHeader = <?= json_encode($csvHeader) ?>;
			</script>

			<script src="style.js"></script>
			<link rel="stylesheet" href="style.css" type="text/css"/>
	<?php } ?> 

	<title>Cross Tabulation</title>
</head>
<body <?= $bCsvUploaded ? 'onload="OnLoad()"' : '' ?>>

<div class="container">

	<!-- upload csv file form -->

	<div id="uploadfile" class="panel panel-default">
		<div class="panel-heading">
	    	<h3 class="panel-title">Please select the csv file</h3>
		</div>
		<div class="panel-body">
  
			<form enctype="multipart/form-data" method="post">
				<div class="form-group">
			    	<input name="inputFile" type="file" class="btn btn-default" accept=".csv" id="inputFile">
			  	</div>
			  	<button type="submit" class="btn btn-primary">Submit</button>
			</form>	
			
		</div>
	</div>


	<?php
	if($bCsvUploaded) 
	{
	?>

	<!-- display csv data table here -->

	<div id="uploadedfileData" class="panel panel-default">
		<div class="panel-heading">
	    	<h3 class="panel-title">Uploaded csv file data</h3>
		</div>
		<div class="panel-body">
	
			<div class="row">
				<div class="col-md-12">
					<table class="table table-bordered table-condensed table-striped" id="csvDataTable"></table>
				</div>
			</div>
		</div>
	</div>


	<!-- display select columns for cross tabulation -->

	<div id="selectcolumn" class="panel panel-default">
		<div class="panel-heading">
	    	<h3 class="panel-title">Select columns to calculate Cross Tabulation</h3>
		</div>
		<div class="panel-body">

			<div class="row">
				<div class="col-sm-4">
					<select class="form-control" id="CTCol1">
						<?php
							//skip the first column from selection as it is mostly the id column for the data 
							for($col = 1; $col < count($csvHeader); $col++) {
								echo "<option value=\"" . $col . "\"" . ($col==1 ? " selected" : "") . ">" . $csvHeader[$col] . "</option>";
							}

						?>
					</select>
				</div>
				<div class="col-sm-4">
					<select class="form-control" id="CTCol2">
						<?php
							//skip the first column from selection as it is mostly the id column for the data 
							for($col = 1; $col < count($csvHeader); $col++) {
								echo "<option value=\"" . $col . "\"" . ($col==2 ? " selected" : "") . ">" . $csvHeader[$col] . "</option>";
							}

						?>
					</select>
				</div>
				<div class="col-sm-4">
					<button class="btn btn-primary" onclick="ShowCrossTabulation()">Calucate Cross Tabulation</button>
				</div>
			</div>

		</div>
	</div>

	<!-- show cross tabulation results here -->
	<div id="CTResult" class="panel panel-default">
		<div class="panel-heading">
	    	<h3 class="panel-title">Cross Tabulation result</h3>
		</div>
		<div class="panel-body">

				<div class="row">
					<div class="col-md-12">
						<table class="table table-bordered table-condensed table-striped" id="CTResultTable"></table>
					</div>
				</div>
		</div>
	</div>


	<?php
	}
	?>

</div>

</body>
</html>
