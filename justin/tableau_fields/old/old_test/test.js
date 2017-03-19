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

    msg += "name: " + sheet.getName() + "<br>"; 
    
    sheet.getSummaryDataAsync().then(function(summaryData){
        this.summaryData = summaryData;
        columns = summaryData.getColumns();
        numColumns = columns.length;

        msg += "Field Names:<br>";
    
        for(i = 0; i < numColumns; i++){
            msg += columns[i].getFieldName() + " " 
            + columns[i].getDataType() + " " + columns[i].getIndex() + "<br>";
        }

        msg += "Data:<br>" + JSON.stringify(summaryData.getData());

        var tgt = document.getElementById("dataTarget");
                tgt.innerHTML = "<h4>Underlying Data:</h4><p>" + msg + "</p>";
    });
    
}