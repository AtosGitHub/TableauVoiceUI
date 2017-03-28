
//--------------------------------------------
function changeSheet(sheet){
	
}


//--------------------------------------------
function categoricalFilter(field, value(s), type){
	
}

var filterType = {
	ALL,
	REPLACE,
	ADD,
	REMOVE
}

//--------------------------------------------
function rangeFilter(field, rangeOptions){
	
}


var rangeOptions = {
	min: val,
	max: val
}



//--------------------------------------------
function reset(){

}

//--------------------------------------------
function Field(name, type){
    this.name = name; 

    this.type = type; //float, integer, string, boolean, date, datetime

    var sheets;

    // if(type == string){values = an array of strings for all unique values}
    // else { : array[0] = minVal, array[1] = maxVal}
    var values = []; 
    
}

function Sheet(name){
    this.name = name;
    var fields = [];
}

//--------------------------------------------