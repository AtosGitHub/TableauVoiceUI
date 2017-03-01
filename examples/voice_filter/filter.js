var viz, workbook, activeSheet;        

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
    var wb = viz.getWorkbook(); //Workbook object
    var dta = wb.getFields();
    var dtLen = dta.length;
    var i;
    for(i = 0; i < dtLen; i++){
        console.log(dta[i].getName());
    }
    //var sheetInfo = wb.getPublishedSheetsInfo(); //Worksheet object
    var ds = ws.getSummaryDataAsync(); //
    var cd = ds.getColumns();
}

function querySheets() {
    var workbook = viz.getWorkbook();
    var sheets = workbook.getPublishedSheetsInfo();
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

function uFirst(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}

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

function printSheet(sheet){
    var msg = "";
    msg += "name: " + sheet.getName() + "\n"; 
    msg += "index: " + sheet.getIndex() + "\n";
    msg += "isActive: " + sheet.getIsActive() + "\n";
    msg += "isHidden: " + sheet.getIsHidden() + "\n";
    msg += "type: " + sheet.getSheetType() + "\n";
    msg += "size: " + sheet.getSize() + "\n";
    //msg += "URL: " + sheet.getUrl() + "\n";
    msg += "WorkBook: " + sheet.getWorkbook().getName() + "\n";
    var uData = sheet.getSummaryDataAsync();
    //alert("uData type: " + uData.getName());
    var cols = uData.getColumns();
    var nc = cols.length;
    var i;
    for(i = 0; i < nc; i++){
        msg += "field(" + i + "): " + cols[i].getName();
    }
    alert(msg);
}



function querySheets() {
  var sheets = workbook.getPublishedSheetsInfo();
  var text = getSheetsAlertText(sheets);
  text = "Sheets in the workbook:\n" + text;
  alert(text);
}