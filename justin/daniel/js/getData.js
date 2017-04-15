// justin/daniel

var viz, workbook, activeSheet, fields, sheets;
var SheetList = [];
var FieldList = [];

//----------------------------------------------------------------
// initialize Tableau Viz

function initViz() {
    var containerDiv = document.getElementById("vizContainer");
    //url = "http://public.tableau.com/views/ATOSCarrierReport/Sheet1?:retry=yes&:embed=y&:display_count=yes&:showTabs=y";
    //url = "http://public.tableau.com/views/RegionalSampleWorkbook/College";
    url = "https://public.tableau.com/views/RegionalSampleWorkbook_9/Obesity?:embed=y&:display_count=yes";

    var options = {
        hideTabs: false,
        hideToolBar: false,
        //instanceIdToClone:   ,
        //height: ,
        //width: ,
        //device: ,
        //"filterName": ,
        onFirstInteractive: function () {
            workbook = viz.getWorkbook();
            activeSheet = workbook.getActiveSheet();
            getUnderlyingDataB();
            viz.addEventListener(tableau.TableauEventName.TAB_SWITCH, getUnderlyingDataB);
        },
        onFirstVizSizeKnown: function(){

        },
    };

    viz = new tableau.Viz(containerDiv, url, options);
}


//----------------------------------------------------------------


function showData(){
    console.log(FieldList);
}

//----------------------------------------------------------------
// get and print underlying spreadsheet data

function getUnderlyingDataB() {
            var sheet = viz.getWorkbook().getActiveSheet();//.getWorksheets();
            var sheets;
            var i;
            //FieldList = [];


            if(sheet.getSheetType() === "dashboard"){
                sheets = sheet.getWorkbook().getActiveSheet().getWorksheets();
                printUnderlyingB(sheets[0]);
                //var sLen = sheets.length;
                // for(i = 0; i < sLen; i++){
                //     printUnderlyingB(sheets[i]);
                // }
            }
            else{
                printUnderlyingB(sheet);
            }
}

function printUnderlyingB(sheet){

    console.log("printUnderlyingB");

    var msg = "";
    var summaryData;
    var columns;
    var numColumns;
    var i;

    //msg += "Name: " + sheet.getName() +  "<br>";

    //var sht = new Sheet(sheet.getName());

     options = {
                ignoreAliases: true,
                ignoreSelection: true,
                includeAllColumns: true,
                maxRows: 0, // Max rows to return. Use 0 to return all rows
            };

    /*sheet.clearFilterAsync(columns[i].getFieldName()).then(function() {
        console.log("cleared filter");

    });*/

    sheet.getUnderlyingDataAsync(options).then(function(summaryData){
        this.summaryData = summaryData;
        columns = summaryData.getColumns();
        numColumns = columns.length;
        msg += "Field Names:<br>";

        var rawdata = summaryData.getData();
        var strData = rawdata.map(JSON.stringify);
        var flds = [];
        var dta = [];

        // columns[] contains tableau-column objects
        // with methods: getFieldName(), getDataType() {string/int/float/date},
        // getIsReferenced() {boolean: is field referenced in worksheet?},
        // getIndex() {index of object in columns[i]}
        for(i = 0; i < numColumns; i++){
            msg += columns[i].getIndex() + "_/_" + columns[i].getFieldName() + "_/_"
            + columns[i].getDataType() + "<br>";
            var fld = new Field(columns[i].getFieldName(), columns[i].getDataType());
            flds.push(fld);
        }

        msg += "<br>Data Column:<br>";



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

        msg += "#<br>";
        msg += dta[0] + "<br>";
        msg += dta[1] + "<br>";
        msg += dta[2] + "<br>";
        //msg += dta[0][0] + "<br>"; // experiment; uncomment to test

        //var col0 = dta.map(function(value,index) { return value[0]; });
        //col0 = unique(col0);

        msg += "<br>";
        msg += "<br>####<br>";
        msg += dta[0] + "<br>";

        msg += "<br>after parse:<br>";

        msgg = "";

        dlen = dta[0].length;

        for(i = 0; i < dlen; i++){

            var col = dta.map(function(value,index) { return value[i]; });
            col = unique(col, columns[i].getDataType());
            //console.log("len: ", dlen);
            //console.log("col[0]: ", col[0]);
            //console.log("# : ", columns[i].getFieldName(), ", type: ", flds[i].type);

            if(flds[i].type === "string"){
                //console.log("string");
                flds[i].values = col;
                //flds[i].values.push(col);
                //console.log("after push");
                //console.log("values[0]/[1]: ", flds[i].values[0], ', ', flds[i].values[1]);
            }
            else{
                //console.log("not string");
                //console.log("col.length: ", col.length);
                //console.log("col[0]: ", col[0], "col[col.length-1]: ", col[col.length-1]);
                //console.log(col);
                //console.log("after col");

                if( flds[i].type === "date" || flds[i].type === "datetime"){
                    //console.log(col);
                }
                //console.log("after col 2");
                flds[i].values = [col[0], col[col.length-1]];
                //flds[i].values[0] = col[0];
                //flds[i].values[1] = col[col.length-1];
                //console.log("after push");
                //console.log("non-string values: ", flds[i].values);
                //console.log("col: ", col);

                //console.log("###values[0]/[1]: ", flds[i].values[0], ', ', flds[i].values[1]);

            }
            //console.log("fields 0, 1: ", flds[i].values[0], ", ", flds[i].values[1]);

            //msgg += flds[i].values[0] + ", " + flds[i].values[1] + "<br>";

        }

        FieldList.push(flds);
        //FieldList = flds;

        console.log("FieldList in printUnderlyingB): ", FieldList);

        //tgt.innerHTML += "<h4>values</h4><p>" + msg + "</p>";

    });

}

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


    var sheets = [];

    var values = []; // if(type == string){values = an array of strings for all unique values}
    // else { : array[0] = minVal, array[1] = maxVal}
}

function Sheet(name){
    //alert("sheet create");
    this.name = name;
    var fields = [];
}

//----------------------------------------------------------------
// calls alert(<list of sheets (tabs), their index, and indicates active sheet)
// called by pressing 'querySheets' button
function querySheets() {
    workbook = viz.getWorkbook();
    sheets = workbook.getPublishedSheetsInfo();
    var numSheets = sheets.length;
    var i;
    var actS = workbook.getActiveSheet();
    var actN = actS.getName();
    var actN = "active sheet : " + actN + "\n";
    for(i = 0; i < numSheets; i++){
        actN += i + " : " + sheets[i].getName() + "; ";
        actN += sheets[i].getSheetType() + "\n";
    }
    alert(actN);
}

//----------------------------------------------------------------
// changes active sheet (tab) by name
function changeSheet(){
    var newSheet = document.getElementById("changeSheet").value;
    workbook = viz.getWorkbook();
    workbook.activateSheetAsync(newSheet);
}


//----------------------------------------------------------------
// get tableau field-object info
function getFields(){
    var sheet = viz.getWorkbook().getActiveSheet();
    var sheets;
    var i;

    if(sheet.getSheetType() === "dashboard"){
        sheets = sheet.getWorkbook().getActiveSheet().getWorksheets();
        var sLen = sheets.length;
        for(i = 0; i < sLen; i++){
            printFields(sheets[i]);
        }
    }
    else{
        printFields(sheet);
    }

}

function printFields(sheet){
    var dSource, fields, len;
    console.log("printing sheet: " + sheet.getName());

    sheet.getDataSourcesAsync().then(function (dSources){
        dSource = dSources[0];
        console.log("geting data sources");
        var fields = dSource.getFields();
        console.log("2");
        var len = fields.length;
        console.log("3");
        var i;
        var msg = "";

        var nds = dSources.length;
        var dslens = '';

        //msg += "DataSource: " + dSource;

        //console.log("num data sources: ", nds);
        //console.log("dSource.length: ", dSource.length);



        for(i = 0; i < nds; i++){
            dslens += dSources[i].getFields().length + ", ";
        }

        console.log("dslens: ", dslens);


        for(i = 0; i < len; i++){
            msg += "name: " + fields[i].getName() + ", ";
            msg += "aggr: " + fields[i].getAggregation() + ", ";
            msg += "role: " + fields[i].getRole() + "\n";
        }


        console.log(msg);
    }, console.log("failed to get fields"));
}

//----------------------------------------------------------------
// clears innerHTML attribute of <div> object that contains results
// getUnderlyingData()

function clearInnerHTML(){
    var tgt = document.getElementById("dataTarget");
        tgt.innerHTML = "";
}

//----------------------------------------------------------------
// process and apply categorical filter

function filterByName(field, filter, type) {

    var sheet = viz.getWorkbook().getActiveSheet();
    if(filter.includes(";")){
        filter = filter.split(";");
    }

    if(sheet.getSheetType() === "dashboard"){
        sheets = sheet.getWorkbook().getActiveSheet().getWorksheets();
        var sLen = sheets.length;
        for(i = 0; i < sLen; i++){
            applyFilter(sheets[i], field, filter, type);
        }
    }
    else{
        applyFilter(sheet, field, filter, type);
    }


}

function applyFilter(sheet, field, filter, type){
    var fTypes = ["ALL", "REPLACE", "ADD", "REMOVE"];
    var t = fTypes.indexOf(type.toUpperCase());

    switch(t){
        case 0:
            sheet.applyFilterAsync(field, filter, tableau.FilterUpdateType.ALL);
            break;
        case 1:
            sheet.applyFilterAsync(field, filter, tableau.FilterUpdateType.REPLACE);
            break;
        case 2:
            sheet.applyFilterAsync(field, filter, tableau.FilterUpdateType.ADD);
            break;
        case 3:
            sheet.applyFilterAsync(field, filter, tableau.FilterUpdateType.REMOVE);
            break;
        default:
            alert("invalid filter type");
    }

}

//----------------------------------------------------------------
// utility function: returns ascending-ordered array of unique items from xs
// used to efficiently store/search array 'values' in function-object 'Field'

var unique = function(xs, type) {
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
// experiment that work's : filter a field that is not filterable
// through GUI
function filterHidden(){
    var sheet = viz.getWorkbook().getActiveSheet();
    sheet.applyFilterAsync("Major", "AUND", tableau.FilterUpdateType.REPLACE);
}

//----------------------------------------------------------------
// get summary of spreadsheet data, not used because it does not
// retrieve complete data; getUnderlyingData() is used instead


function getSummaryData() {
            var sheet = viz.getWorkbook().getActiveSheet();//.getWorksheets();
            var sheets;
            var i;

            if(sheet.getSheetType() === "dashboard"){
                sheets = sheet.getWorkbook().getActiveSheet().getWorksheets();
                var sLen = sheets.length;
                for(i = 0; i < sLen; i++){
                    printSummary(sheets[i]);
                }
            }
            else{
                printSummary(sheet);
            }
}

function printSummary(sheet){
    var msg = "";
    var summaryData;
    var columns;
    var numColumns;
    var i;

    msg += "Name: " + sheet.getName() + "<br>" + "Type: " + sheet.getSheetType() + "<br>";

    options = {
                ignoreAliases: false,
                ignoreSelection: true,
                maxRows: 0, // Max rows to return. Use 0 to return all rows
            };

    sheet.getSummaryDataAsync(options).then(function(summaryData){
        this.summaryData = summaryData;
        //msg += "Name: " + summaryData.getName() + "<br>";
        columns = summaryData.getColumns();
        numColumns = columns.length;

        msg += "NumRows: " + summaryData.getTotalRowCount() + "<br>";
        msg += "Field Names:<br>";

        for(i = 0; i < numColumns; i++){
            msg += columns[i].getIndex() + "_/_" + columns[i].getFieldName() + "_/_"
            + columns[i].getDataType() + "<br>";
        }

        msg += "Data:<br>" + JSON.stringify(summaryData.getData()).substring(0,1000);
        console.log(msg);


        /*
        var tgt = document.getElementById("dataTarget");
                tgt.innerHTML += "<h4>Summary Data:</h4><p>" + msg + "</p>";*/
    });

}

//----------------------------------------------------------------
// ideas and experiments that don't work

function rangeFilter(){
    var sheet = viz.getWorkbook().getActiveSheet();
    sheet.applyFilterAsync("Major", "AUND", tableau.FilterUpdateType.REPLACE);
}

function clearFilter(){
    var sheet = viz.getWorkbook().getActiveSheet();
    sheet.applyFilterAsync("Major", "AUND", tableau.FilterUpdateType.ALL);
}



function parseRow(row){
    var spl = row.split("},{");
    //console.log("parse");
    console.log("p1: " +  spl);
    //alert("p1: " + spl);
    var prow = [];
    var i, j;

    for(i = 0; i < spl.length; i++){
        //spl = spl[i].split(":");
        spl  = spl[i].split("\"");
        console.log("p2: " + spl);
        console.log("p2.len: " + spl.length);

        for(j = 0; j < spl.length; j++){

            prow.push(spl[spl.length-2]);
        }

    }
    //console.log("parse:\n" + row + "\n" + prow);
    return prow;
}

function testPush(){
    var arr = [];
    var a1 = ["abc", "bcd"];
    var a2 = ["efg", "hik"];
    arr.push(a1);
    arr.push(a2);
    //var col3 = arr.map(function(value,index) { return value[2]; });
    var msg = "array: \n" + arr[0][0] + "\n";
    msg += arr[1][0];

    alert(msg);

}

//----------------------------------------------------------------

function getParameters(){
    workbook = viz.getWorkbook();
    console.log("wb name; ", workbook.getName());
    workbook.getParametersAsync().then(function(parameters){
        var plen = parameters.length;
        console.log("num parameters: " + plen);
        var i;
        var pmsg = "";
        for(i = 0; i < plen; i++){
            pmsg += parameters[i].getName() + "\n";
            //pmsg += parameters[i].getName() + "<br>";
        }
        console.log("parameters\n", pmsg);
        // var tgt = document.getElementById("dataTarget");
        //         tgt.innerHTML = "<h4>Parameters:</h4><p>" + pmsg + "</p>";

    });

}

//----------------------------------------------------------------

function getFilters(){

    var sheet = viz.getWorkbook().getActiveSheet();

    var appliedVals = [];

    if(sheet.getSheetType() === "dashboard"){
        sheets = sheet.getWorkbook().getActiveSheet().getWorksheets();
        var sLen = sheets.length;
        var filterList = "";
        var j, fLen;
        for(i = 0; i < sLen; i++){
            sheets[i].getFiltersAsync().then(function (filters){
                fLen = filters.length;
                //filterList += "Sheet Name: " + sheets[i].getName() + "\n";
                for(j = 0; j < fLen; j++){
                    filterList += filters[j].getFieldName() + ", " + filters[j].getFilterType() + "\n";
                    if(filters[j].getFilterType() == "categorical"){
                        appliedVals.push(filters[j].getAppliedValues());
                    }
                }
                console.log(filterList);
                console.log(appliedVals);
                filterList = "";

            });
        }
    }
    else{
        sheet.getFiltersAsync().then(function (filters){
            fLen = filters.length;
            for(j = 0; j < fLen; j++){
                filterList += filters[j].getFieldName() + ", " + filters[j].getFilterType() + "\n";
                if(filters[j].getFilterType() == "categorical"){
                        appliedVals.push(filters[j].getAppliedValues());
                    }
            }
            filterList += "\n";
            console.log(filterList);
            console.log(appliedVals);
        });
    }


}



function getWorkbookName(){
    var wbn = viz.getWorkbook().getName();
    alert(wbn);
}

//----------------------------------------------------------------
