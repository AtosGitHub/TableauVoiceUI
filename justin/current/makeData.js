var SheetList = [];


function getData() {
            var sheet = viz.getWorkbook().getActiveSheet();//.getWorksheets();
            var sheets;
            var i;

            if(sheet.getSheetType() === "dashboard"){
                sheets = sheet.getWorkbook().getActiveSheet().getWorksheets();
                var sLen = sheets.length;
                for(i = 0; i < sLen; i++){
                    printData(sheets[i]);
                }
            }
            else{
                printData(sheet);
            }
}

function printData(sheet){
    var msg = "";
    var summaryData;
    var columns;
    var numColumns;
    var i;


    //msg += "name: " + sheet.getName() + "\n";
    //msg += "Name: " + sheet.getName() + "<br>" + "Type: " + sheet.getSheetType() + "<br>"; 

    var sht = new Sheet(sheet.getName());

     options = {
                ignoreAliases: false,
                ignoreSelection: false,
                includeAllColumns: false,
                maxRows: 0, // Max rows to return. Use 0 to return all rows
            };
    
    sheet.getUnderlyingDataAsync(options).then(function(summaryData){
        this.summaryData = summaryData;
        //msg += "Name: " + summaryData.getName() + "<br>";
        columns = summaryData.getColumns();
        numColumns = columns.length;

        msg += "NumRows: " + summaryData.getTotalRowCount() + "<br>";

        msg += "Field Names:<br>";
        var rawdata = summaryData.getData();
        var strData = rawdata.map(JSON.stringify);
    
        for(i = 0; i < numColumns; i++){
            sht.fields.push(new Field(columns[i].getFieldName(), columns[i].getDataType()));
        }


        
        //var rawdata = String(summaryData.getData());
        //msg += "Data:<br>" + rawdata;
        //msg += "Data:<br>" + JSON.stringify(summaryData.getData()).substring(0,1000);

        //alert(msg);

        var tgt = document.getElementById("dataTarget");
            tgt.innerHTML += "<h4>Underlying Data:</h4><p>" + strData + "</p>";
    });
    
}


function Field(name, type){
    //var worksheetName; 
    this.fieldName = name; 

    this.type = type; //float, integer, string, boolean, date, datetime

    var values; // if(type == string){values = an array of strings for all unique values}
    // else {values = array[2] : array[0] = minVal, array[1] = maxVal}
}

function Sheet(name){
    this.name = name;
    var fields;
}

var unique = function(xs) {
  var seen = {};
  xs.sort();
  return xs.filter(function(x) {
    if (seen[x])
      return;
    seen[x] = true;
    return x;
  })
}
