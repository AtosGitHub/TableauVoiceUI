// Author: Justin Brewer
// Contact: this.justinbrewer@gmail.com
// from folder project_demo_v01


var SheetList = []; // type Sheet
var activeSheetIndex;
var ignoreNonStrings = true;

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
    
    this.name = name; 

    //float, integer, string, boolean, date, datetime
    this.type = type; 

    // if(type == string){values = an array of strings for all unique values}
    // else { : array[0] = minVal, array[1] = maxVal}
    this.values = []; 
}

function Sheet(name, type){

    this.name = name;

    // dashboard or worksheet
    this.type = type;

    // used to indicate whether or not a tab has been visited
    // each Sheet in SheetList[] is created when the viz is loaded
    // but this.fields[] is not set until the tab is visited to avoid 
    // wasting time and space resources
    this.visited = false;

    this.fields = [];

}

//----------------------------------------------------------------
// populates SheetList with Sheet objects, called right after Viz 
// initialized
function loadSheetList() {
    SheetList = [];

    sheets = viz.getWorkbook().getPublishedSheetsInfo();
    var numSheets = sheets.length;    
    var i;
    var actS = workbook.getActiveSheet();

    for(i = 0; i < numSheets; i++){
        SheetList.push(new Sheet(sheets[i].getName(), sheets[i].getSheetType()));
    }
}

//----------------------------------------------------------------
// called each time a new tab is loaded, which adds fields for that tab to SheetList
function updateSheetList(){
    activeSheetIndex = workbook.getActiveSheet().getIndex();
    activeSheet = workbook.getActiveSheet();

    if(SheetList[activeSheetIndex].visited){
                return;
    }
    else{
        getData();
    }
}
//----------------------------------------------------------------
// gets field and field value data for active sheet
//
// getUnderlyingDataAsync() can only be called on worksheets and it seems all 
// worksheets in a tab share the same data, so it is only called on the first
// worksheet in the dashboard if applicable
function getData() {

            if(activeSheet.getSheetType() === "dashboard"){
                var sheets = activeSheet.getWorksheets();
                getWorksheetData(sheets[0]);
            }
            else{
                getWorksheetData(activeSheet);
            }
}

// helper function
// was more helpful when I thought I had to get separate data for 
// each worksheet in a dashboard
function getWorksheetData(sheet){

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
    }
    else{
        dname = sheet.getName();
        idx = sheet.getIndex();
    }
    
    options = {
                ignoreAliases: true,
                ignoreSelection: true,
                includeAllColumns: true,
                maxRows: 0, // Max rows to return. Use 0 to return all rows
    };

    sheet.getUnderlyingDataAsync(options).then(function(summaryData){

        //console.log("getUnderLyingData success");
        
        this.summaryData = summaryData;
        columns = summaryData.getColumns();
        numColumns = columns.length;

        // console.log("summaryData:", summaryData);
        // console.log("columns:", columns);

        var rawdata = summaryData.getData();
        // console.log("rawdata:", rawdata)
        var strData = rawdata.map(JSON.stringify);
        var flds = [];
        var dta = [];
        
        // columns[] contains tableau-column objects
        // with methods: getFieldName(), getDataType() {string/int/float/date}, 
        // getIsReferenced() {boolean: is field referenced in worksheet?}, 
        // getIndex() {index of object in columns[i]}
        for(i = 0; i < numColumns; i++){
            // typD = columns[i].getDataType();
            // console.log("typD: ", typD);
            // if(!(typD === "string") && ignoreNonStrings){
            //     console.log("ignoreNonStrings: ", typD);
            //     continue;
            // }
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

        SheetList[idx].fields = flds;
        SheetList[idx].visited = true;

    }, function(err){
        console.log("getUnderLyingData fail");
        console.log(err);
    });
    
}
//----------------------------------------------------------------


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



//----------------------------------------------------------------
// utility function: returns ascending-ordered array of unique items from xs
// used to efficiently store/search array 'values' in function-object 'Field'
var uniqueD = function(xs, type) {
  
  var seen = {};
  xs.sort();
  
  return xs.filter(function(x) {
    if (seen[x])
      return;
    seen[x] = true;
    return x;
  })
    
}

//----------------------------------------------------------------
// Sheet Names
// returns an array of all legal sheet names
function getSheetNames(){
    shts = SheetList.map(function(value){return value.name});
    return shts;
}

function logSheetNames(){
    shts = SheetList.map(function(value){return value.name});
    console.log("Sheet Names:", shts);
}
//_____________________________________________
// SheetList[] object
function getSheetList(){
    return SheetList;
}

function logSheetList(){
    console.log( "SheetList[]:", SheetList);
}
//_____________________________________________
// Active Sheet Data from SheetList[]
// returns member of SheetList[] which pertains to the current
// sheet (tab)
function getActiveSheetData(){
    return SheetList[activeSheetIndex];
}

function logActiveSheet(){
    console.log("activeSheet:", SheetList[activeSheetIndex]);
}
//----------------------------------------------------------------

function getStringFields(){
    var info = getActiveSheetData();
    console.log("info: ", info);
    var flds = info.fields;
    console.log("flds: ", flds);
    var strFields = ["Available fields are: "];
    var count = 0;

    for(i in flds){
        console.log("flds[i].type: ", flds[i].type);
        if(flds[i].type === "string" || flds[i].type == "integer"){
            if(flds[i].values.length > 1 && flds[i].values[0] != flds[i].values[1]){
                strFields.push(flds[i].name + ", ");    
                count++;
            }
        }
    }
    if(count == 0){
        return;
    } else if(count > 1){
        strFields.splice(strFields.length - 1, 0, "and");    
    }
    speak(strFields, "narrate");
}
//#####################_________________________###################
//##__End of used code, the following functions should be useful for future 
// functionality

//----------------------------------------------------------------
function getFilters(){

    var sheet = activeSheet;

    if(sheet.getSheetType() === "dashboard"){
        
        sheets = sheet.getWorksheets();
        slen = sheets.length;
        //console.log("dashboard size: ", sheets.length);
        for(i = 0; i < slen; i++){
            //console.log("sheet in dashboard: ", i);
            getWorksheetFilters(sheets[i]);
        }
    }
    else{
        //console.log("not dashboard: ", sheet.getSheetType());
        getWorksheetFilters(sheet);
    }
}

function getWorksheetFilters(sheet){
    // console.log("sheet: ", sheet);
    // console.log("sheet name: ", sheet.getName());
    // console.log("sheet type: ", sheet.getSheetType());
    sheet.getFiltersAsync().then(function(filters){
        console.log(filters.length, "filters applied to ", sheet.getName(), ":", filters);

        for(i in filters){
            console.log("filter: ", i, ", ", filter[i].getName(), filter[i]);
        }
    });
}
//----------------------------------------------------------------
var fieldList = [];

function getDataSources(){
    sheet = activeSheet;

    if(sheet.getSheetType() === "dashboard"){
        sheets = sheet.getWorksheets();

        for(i in sheets){
            getWorksheetDataSources(sheets[i]);
        }
    }
    else{
        getWorksheetDataSources(sheet);
    }
}

function getWorksheetDataSources(sheet){

    sheet.getDataSourcesAsync().then(function(ds){
        for(i in ds){
            console.log("ds: ", i, ": ", ds[i].getName());
            fieldList.push(ds[i].getFields());
        }
    });

    console.log("fieldList: ", fieldList);
}



//----------------------------------------------------------------
//###############################_____EOF____________________###################################