var SheetList = []; // type Sheet
var activeIndex;
//----------------------------------------------------------------
// Data structures for undlerying spreadsheet data to be passed to 
// Web Speech implementation to dynamically define a grammar
//
// TODO : current configuration stores some redundant data when
//  multiple sheets in the same dashboard have overlapping fields;
//  task: modify functions: Field(), Sheet(), getUnderlying(), and printUnderlying() to 
//  create only unique instances of Field() with a list of associated Sheets 
//  stored as a list of strings.

function Field(name, type){
    //var worksheetName; 
    //alert("field created");
    this.name = name; 

    this.type = type; //float, integer, string, boolean, date, datetime

    this.values = []; // if(type == string){values = an array of strings for all unique values}
    // else { : array[0] = minVal, array[1] = maxVal}
}

function Sheet(name, type){
    //alert("sheet create");
    this.name = name;
    this.type = type;
    this.visited = false;
    this.fields = [];
    //var workSheets = [];
}
//----------------------------------------------------------------
// called each time a new tab is loaded, which adds fields for that tab to SheetList
function updateData(){
    getUnderlyingDataD();
}
//----------------------------------------------------------------
// gets field data for active sheet

function getUnderlyingDataD() {
            var sheet = viz.getWorkbook().getActiveSheet();//.getWorksheets();

            if(SheetList[sheet.getIndex()].visited){
                //console.log("already visited sheet");
                return;
            }
            else{
                //console.log("not yet visited");
            }

            if(sheet.getSheetType() === "dashboard"){
                var sheets = sheet.getWorkbook().getActiveSheet().getWorksheets();
                printUnderlyingD(sheets[0]);
            }
            else{
                printUnderlyingD(sheet);
            }
}

function printUnderlyingD(sheet){

    var summaryData;
    var columns;
    var numColumns;
    var i;
    var dash = sheet.getParentDashboard();
    
    var dname;
    var idx;


    if(dash){
        dname = dash.getName();    
        idx = dash.getIndex();
        //console.log("dashboard name: ", dname);
        //console.log("dashboard index: ", idx);
    }
    else{
        dname = sheet.getName();
        idx = sheet.getIndex();
        // console.log("worksheet name: ", sheet.getName());
        // console.log("worksheet index: ", sheet.getIndex());
    }
    
     options = {
                ignoreAliases: true,
                ignoreSelection: true,
                includeAllColumns: true,
                maxRows: 0, // Max rows to return. Use 0 to return all rows
            };

    sheet.getUnderlyingDataAsync(options).then(function(summaryData){
        this.summaryData = summaryData;
        columns = summaryData.getColumns();
        numColumns = columns.length;

        var rawdata = summaryData.getData();
        var strData = rawdata.map(JSON.stringify);
        var flds = [];
        var dta = [];
        
        // columns[] contains tableau-column objects
        // with methods: getFieldName(), getDataType() {string/int/float/date}, 
        // getIsReferenced() {boolean: is field referenced in worksheet?}, 
        // getIndex() {index of object in columns[i]}
        for(i = 0; i < numColumns; i++){
            var fld = new Field(columns[i].getFieldName(), columns[i].getDataType());
            flds.push(fld);
        }

        // parse strData
        for(j = 0; j < strData.length; j++){
            var sdsplit = strData[j].split("},{");
            var row = [];
    
            for(i = 0; i < sdsplit.length; i++){
                var rw = sdsplit[i].split("\"");
                row.push(rw[rw.length-2]);
            }
            dta.push(row);
        }
        
        dlen = dta[0].length;

        for(i = 0; i < dlen; i++){
            var col = dta.map(function(value,index) { return value[i]; });
            col = uniqueD(col, columns[i].getDataType());

            if(flds[i].type === "string"){
                flds[i].values = col;  
            }
            else{
                flds[i].values = [col[0], col[col.length-1]]; 
            }

        }
        //console.log("sheet index: ", sheet.getIndex());

        SheetList[idx].fields = flds;
        SheetList[idx].visited = true;

        activeIndex = idx;

    });
    
}
//----------------------------------------------------------------

//----------------------------------------------------------------
// populates SheetList with Sheet objects, called right after Viz 
// initialized
function querySheetsD() {
    workbook = viz.getWorkbook();
    sheets = workbook.getPublishedSheetsInfo();
    var numSheets = sheets.length;    
    var i;
    var actS = workbook.getActiveSheet();

    for(i = 0; i < numSheets; i++){
        SheetList.push(new Sheet(sheets[i].getName(), sheets[i].getSheetType()));
    }

}
//----------------------------------------------------------------
// returns properly formatted sheet name if str is a valid sheet name
function isSheet(str){
    sL = getSheetNames();
    sl = sL.map(function(value){return value.toLowerCase()})
    strl = str.toLowerCase();
    var idx;
    strl = strl.split(" ");

    for(x in strl){
        if(sl.indexOf(strl[x])){
            idx = sl.indexOf(strl[x]);
        }
    }
    return sL[idx];
}

// returns an array of all legal sheet names
function getSheetNames(){
    shts = SheetList.map(function(value){return value.name});
    //console.log(shts);
    return shts;
}

//----------------------------------------------------------------
// utility function: returns ascending-ordered array of unique items from xs
// used to efficiently store/search array 'values' in function-object 'Field'
var uniqueD = function(xs, type) {
  var seen = {};
  
  var dtypes = ["string", "integer", "float", "date", "datetime"];

  /*
  switch(type){
    case 
  }
  */

  xs.sort();

  
  return xs.filter(function(x) {
    if (seen[x])
      return;
    seen[x] = true;
    return x;
  })
    
}
//----------------------------------------------------------------
function printSheetList(){
    console.log(SheetList);
}

function printActive(){
    console.log("SheetList[activeIndex] returns:\n", SheetList[activeIndex]);
}
//----------------------------------------------------------------