var viz, workbook, activeSheet, fields, sheets;        

function initViz() {
    var containerDiv = document.getElementById("vizContainer");
    url = "https://public.tableau.com/views/RegionalSampleWorkbook_9/Obesity?:embed=y&:display_count=yes";
  
    var options = {
        onFirstInteractive: function () {
            workbook = viz.getWorkbook();
            activeSheet = workbook.getActiveSheet();
        }
    };

    viz = new tableau.Viz(containerDiv, url, options);
}

function filterByName(field, filter, type) {

    var sheet = viz.getWorkbook().getActiveSheet();
    var fTypes = ["ALL", "REPLACE", "ADD", "REMOVE"];
    var t = fTypes.indexOf(type.toUpperCase());
    field = uFirst(field);
    filter = uFirst(filter);
    
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

function getFields(){
    var workBook = viz.getWorkbook(); //Workbook object
    var activeSheet = workbook.getActiveSheet();
    var sheetType = activeSheet.getSheetType();
    var workSheets = activeSheet.getWorkSheets();
    var numWorkSheets = workSheets.length;


    alert('type = ' + typ);
    var dtLen = dta.length;
    var i;
    for(i = 0; i < dtLen; i++){
        console.log(dta[i].getName());
    }
    //var sheetInfo = wb.getPublishedSheetsInfo(); //Worksheet object
    var ds = ws.getSummaryDataAsync(); //
    var cd = ds.getColumns();
}


// IT WORKS!!!!!!
function querySheets() {
    workbook = viz.getWorkbook();
    sheets = workbook.getPublishedSheetsInfo();
    var numSheets = sheets.length;    
    var i;
    var actS = workbook.getActiveSheet();
    var actN = actS.getName();
   // var cols = sheets.getColumns();
    //var actv = workbook.getActiveSheet().getName();
    var actN = "active sheet : " + actN + "\n";
    for(i = 0; i < numSheets; i++){
        actN += i + " : " + sheets[i].getName() + "; ";
        actN += sheets[i].getSheetType() + "\n";
    }
    alert(actN);
}

function querySheetName() {
  var sheets = workbook.getPublishedSheetsInfo();
  var text = getSheetsAlertText(sheets);
  text = "Sheets in the workbook:\n" + text;
  alert(text);
}

function queryFields() {
    var wb = viz.getWorkbook();
    var actS = wb.getActiveSheet();
    var sType = actS.getSheetType();
    var i;
    var colList = "";
    var cols = dta.getColumns();
    var nCols = cols.length;
    
    var colList = "";
    for(i = 0; i < nCols; i++){
        colList += cols[i].getFieldName(); + "\n";
    }
    alert(colList);
}

// WORKS
function uFirst(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//getSummaryData() and combine with printSheet
function getUnderlyingData() {
            var sheet = viz.getWorkbook().getActiveSheet();//.getWorksheets();
            var sheets;
            var i;

            if(sheet.getSheetType() === "dashboard"){
                //alert("dashboard");
                sheets = sheet.getWorkbook().getActiveSheet().getWorksheets();
                //sheets = viz.getWorkbook().getActiveSheet().getWorksheets();
                var sLen = sheets.length;
                //alert("length: " + sLen);
                for(i = 0; i < sLen; i++){
                    printSheet(sheets[i]);
                }

            }
            else{
                printSheet(sheet);
            }
}
// combine with getUnderlyingData()
function printSheet(sheet){
    var msg = "";
    var summaryData;
    var columns;
    var numColumns;
    var i;

    //msg += "name: " + sheet.getName() + "\n";
    msg += "name: " + sheet.getName() + "<br>"; 

    //msg += "index: " + sheet.getIndex() + "\n";
    //msg += "isActive: " + sheet.getIsActive() + "\n";
    //msg += "isHidden: " + sheet.getIsHidden() + "\n";
    //msg += "type: " + sheet.getSheetType() + "\n";
    //msg += "size: " + sheet.getSize() + "\n";
    //msg += "URL: " + sheet.getUrl() + "\n";
    //msg += "WorkBook: " + sheet.getWorkbook().getName() + "\n";
    
    sheet.getSummaryDataAsync().then(function(summaryData){
        this.summaryData = summaryData;
        //msg += "SheetData \nName: " + summaryData.getName() + "\n";
        //msg += "RowCount: " + summaryData.getTotalRowCount(); + "\n";
        //msg += "Is Summary Data?: " + summaryData.getIsSummaryData() + "\n";
        columns = summaryData.getColumns();
        numColumns = columns.length;

        //msg += "\nField Names:\n";
        msg += "Field Names:<br>";
    
        //var colNames = [numColums];
        for(i = 0; i < numColumns; i++){
            msg += columns[i].getFieldName() + " " 
            + columns[i].getDataType() + " " + columns[i].getIndex() + "<br>";
        }

        msg += "Data:<br>" + JSON.stringify(summaryData.getData());
        //alert(msg);

        var tgt = document.getElementById("dataTarget");
                tgt.innerHTML = "<h4>Underlying Data:</h4><p>" + msg + "</p>";
    });
    
}


function storeData(){


    var Sheets = querySheets(Sheets);
    var Fields = getUnderlyingData(Fields); //need to change to getSummaryData()
}

// Class Field: Declared as function; create instance with
// var Field = new Field(name, type, range, index);
// or var Field [] = new ?
// if 'type' == string, range == array of acceptable string values
// else if 'type' == (integer | float | date | time), range == array {minVal, maxval}
function Field(name, type, range, index){
    var RangeEnum = {"minVal":0, "maxVal":1};
    Object.freeze(RangeEnum);
    if(type != 'string'){
        this.range[minVal] = range[minVal];
        this.range[maxval] = range[maxVal];
    }
    else{
        this.range = range;
    }
    this.name = name;
    this.type = type;
    this.index = index;
}

function Sheets(name, type, index){
    this.name = name;
    this.type = type;
    this.index = index;
}














