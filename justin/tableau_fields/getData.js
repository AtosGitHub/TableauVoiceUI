var viz, workbook, activeSheet, fields, sheets;        

function initViz() {
    var containerDiv = document.getElementById("vizContainer");
    //url = "http://public.tableau.com/views/ATOSCarrierReport/Sheet1?:retry=yes&:embed=y&:display_count=yes&:showTabs=y";
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
        },
        onFirstVizSizeKnown: function(){

        },
    };

    viz = new tableau.Viz(containerDiv, url, options);
}

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

function changeSheet(){
    var newSheet = document.getElementById("changeSheet").value;
    workbook = viz.getWorkbook();
    workbook.activateSheetAsync(newSheet);
}

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
                ignoreSelection: false,
                maxRows: 1, // Max rows to return. Use 0 to return all rows
            };
    
    sheet.getSummaryDataAsync(options).then(function(summaryData){
        this.summaryData = summaryData;
        //msg += "Name: " + summaryData.getName() + "<br>";
        columns = summaryData.getColumns();
        numColumns = columns.length;

        msg += "Field Names:<br>";
    
        for(i = 0; i < numColumns; i++){
            msg += columns[i].getIndex() + "____" + columns[i].getFieldName() + "_" 
            + columns[i].getDataType() + "<br>";
        }

        msg += "Data:<br>" + JSON.stringify(summaryData.getData());
        //alert(msg);

        var tgt = document.getElementById("dataTarget");
                tgt.innerHTML += "<h4>Summary Data:</h4><p>" + msg + "</p>";
    });
    
}




function getUnderlyingData() {
            var sheet = viz.getWorkbook().getActiveSheet();//.getWorksheets();
            var sheets;
            var i;

            if(sheet.getSheetType() === "dashboard"){
                sheets = sheet.getWorkbook().getActiveSheet().getWorksheets();
                var sLen = sheets.length;
                for(i = 0; i < sLen; i++){
                    printUnderlying(sheets[i]);
                }
            }
            else{
                printUnderlying(sheet);
            }
}

function printUnderlying(sheet){
    var msg = "";
    var summaryData;
    var columns;
    var numColumns;
    var i;

    //msg += "name: " + sheet.getName() + "\n";
    msg += "Name: " + sheet.getName() + "<br>" + "Type: " + sheet.getSheetType() + "<br>"; 

     options = {
                ignoreAliases: false,
                ignoreSelection: false,
                includeAllColumns: false,
                maxRows: 3, // Max rows to return. Use 0 to return all rows
            };
    
    sheet.getUnderlyingDataAsync(options).then(function(summaryData){
        this.summaryData = summaryData;
        //msg += "Name: " + summaryData.getName() + "<br>";
        columns = summaryData.getColumns();
        numColumns = columns.length;

        msg += "Field Names:<br>";
    
        for(i = 0; i < numColumns; i++){
            msg += columns[i].getIndex() + "____" + columns[i].getFieldName() + "_" 
            + columns[i].getDataType() + "_" + columns[i].getIsReferenced() + "<br>";
        }

        //msg += "Data:<br>" + JSON.stringify(summaryData.getData());
        msg += "Data:<br>" + JSON.stringify(summaryData.getData());
        //alert(msg);

        var tgt = document.getElementById("dataTarget");
            tgt.innerHTML += "<h4>Underlying Data:</h4><p>" + msg + "</p>";
    });
    
}

function clearInnerHTML(){
    var tgt = document.getElementById("dataTarget");
        tgt.innerHTML = "";
}

function getParameters(){
    workbook.getParametersAsync().then(function(parameters){
        var plen = parameters.length;
        alert("num parameters: " + plen);
        var i;
        var pmsg = "";
        for(i = 0; i < plen; i++){
            pmsg += parameters[i].getName() + "<br>";
        }
        var tgt = document.getElementById("dataTarget");
                tgt.innerHTML = "<h4>Parameters:</h4><p>" + pmsg + "</p>";

    });

}

function filterHidden(){
    var sheet = viz.getWorkbook().getActiveSheet();
    sheet.applyFilterAsync("Major", "AUND", tableau.FilterUpdateType.REPLACE);
}

function rangeFilter(){
    var sheet = viz.getWorkbook().getActiveSheet();
    sheet.applyFilterAsync("Major", "AUND", tableau.FilterUpdateType.REPLACE);
}

function clearFilter(){
    var sheet = viz.getWorkbook().getActiveSheet();
    sheet.applyFilterAsync("Major", "AUND", tableau.FilterUpdateType.ALL);
}



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



function getFilters(){

    var sheet = viz.getWorkbook().getActiveSheet();

    if(sheet.getSheetType() === "dashboard"){
        sheets = sheet.getWorkbook().getActiveSheet().getWorksheets();
        var sLen = sheets.length;
        var filterList = "";
        var j, fLen;
        for(i = 0; i < sLen; i++){
            sheets[i].getFiltersAsync().then(function (filters){
                fLen = filters.length;
                for(j = 0; j < fLen; j++){
                    filterList += filters[j].getFieldName() + "\n";
                }
                filterList += "\n";
                alert(filterList);
                
            });
        }
    }
    else{
        sheet.getFiltersAsync().then(function (filters){
            fLen = filters.length;
            for(j = 0; j < fLen; j++){
                filterList += filters[j].getFieldName() + "\n";
            }2
            filterList += "\n";
            alert(filterList);
        });
    }
    

}



function getWorkbookName(){
    var wbn = viz.getWorkbook().getName();
    alert(wbn);
}



