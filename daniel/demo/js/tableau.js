//temp JavaScript file to enable the function of tableau api call for testing purpose

function tableau(){
	var getInfo = function(){
		var info = {
			workbooks = {'obesity', 'college admission'};
			var college= {
				filterNames = {'academic year', 'college', 'select gender'};
				fieldNames = {'2013', '2014', 'male', 'female', 'arts and sciences', 'business', 'communication', 'education', 'engineering', 'music', 'public affairs', 'public health'};
				academicYear = {'2013', '2014'};
				college ={'arts and sciences', 'business', 'communication', 'education', 'engineering', 'music', 'public affairs', 'public health'};
				gender = {'male', 'female'};
			};
		};
	};

	function switchWorkbook() {
  		workbook.activateSheetAsync("GDP per capita map");
	}
}

