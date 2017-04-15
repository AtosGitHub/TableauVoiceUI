// justin/daniel

//temp JavaScript file to enable the function of tableau api call for testing purpose
function getInfo(){
	initViz();
	var c = {
		var worksheetName = "College";
		var fieldName = "Academic Year";
		var type = "integer";
		var values = {2013, 2014};	
	}
	var b = {
		var worksheetName = "College";
		var fieldName = "College";
		var type = "string";
		var values = {'Arts and Sciences', 'Business', 'Communication', 'Education', 'Engineering', 'Music', 'Public Affairs', 'Public Health'};	
	}
	var a = {
		var worksheetName = "College";
		var fieldName = "Select Gender";
		var type = "string";
		var values = {'All','Male', 'Female'};
	};
	var info = {a, b, c};
	return info;
}

	function switchWorkbook(worksheet) {
  		workbook.activateSheetAsync(worksheet);
	}

	function initViz() {
    	var containerDiv = document.getElementById("vizContainer");
    	url = "http://public.tableau.com/views/RegionalSampleWorkbook/College";

    	var options = {
  			onFirstInteractive: function () {
            	workbook = viz.getWorkbook();
            	activeSheet = workbook.getActiveSheet();
        	}
    	};
    	viz = new tableau.Viz(containerDiv, url, options);
	}


