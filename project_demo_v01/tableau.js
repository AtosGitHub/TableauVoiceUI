// Author: Justin Brewer
// Contact: this.justinbrewer@gmail.com
// from folder project_demo_v01

//----------------------------------------------------------------
// global variables

var viz, workbook, activeSheet, sheets, views;        

//----------------------------------------------------------------
// initialize Tableau Viz

function initViz() {
    var containerDiv = document.getElementById("vizContainer");
    url = "https://public.tableau.com/views/RegionalSampleWorkbook_9/Obesity?:embed=y&:display_count=yes";
  
    var options = {
        hideTabs: false,
        hideToolBar: false,
        //width: "808px",
        //height: "707px",
        //(optionl) instanceIdToClone: , height: ,width: ,device: ,"filterName": ,
        onFirstInteractive: function () {
            //viz.pauseAutomaticUpdatesAsync();
            workbook = viz.getWorkbook();
            activeSheet = workbook.getActiveSheet();
            loadSheetList();
            updateSheetList();
            views = [];
            //saveView();
            viz.addEventListener(tableau.TableauEventName.TAB_SWITCH, updateSheetList);
            //viz.addEventListener(tableau.TableauEventName.FILTER_CHANGE, refreshData);
        }
    };

    viz = new tableau.Viz(containerDiv, url, options);
}

//----------------------------------------------------------------
// changes active sheet (tab) by name from string (voice)
function changeSheetByName(sheet){
    var newSheet = sheet.charAt(0).toUpperCase() + sheet.substr(1, sheet.length);
    workbook = viz.getWorkbook();
    workbook.activateSheetAsync(newSheet);
}

// utility: changes active sheet (tab) by name from text box
function changeSheet(){
    var newSheet = document.getElementById("changeSheet").value;
    workbook = viz.getWorkbook();
    workbook.activateSheetAsync(newSheet);
}

//----------------------------------------------------------------
// process and apply categorical filter

function filterByName(field, filter, type) {

    //var sheet = viz.getWorkbook().getActiveSheet();
    sheet = activeSheet;
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

    //saveView();


    switch(t){
        case 0:
            type = tableau.FilterUpdateType.ALL;
            break;
        case 1:
            type = tableau.FilterUpdateType.REPLACE;
            break;
        case 2:
            type = tableau.FilterUpdateType.ADD;
            break;
        case 3:
            type = tableau.FilterUpdateType.REMOVE;
            break;
        default:
            console.log("invalid filter type");
    }

    sheet.applyFilterAsync(field, filter, type).then(function(){
        refreshData();
    })



    // switch(t){
    //     case 0:
    //         sheet.applyFilterAsync(field, filter, tableau.FilterUpdateType.ALL);
    //         break;
    //     case 1:
    //         sheet.applyFilterAsync(field, filter, tableau.FilterUpdateType.REPLACE);
    //         break;
    //     case 2:
    //         sheet.applyFilterAsync(field, filter, tableau.FilterUpdateType.ADD);
    //         break;
    //     case 3:
    //         sheet.applyFilterAsync(field, filter, tableau.FilterUpdateType.REMOVE);
    //         break;
    //     default:
    //         console.log("invalid filter type");
    // }

}

//----------------------------------------------------------------
function refreshData(){
    viz.refreshDataAsync();
}



//pauseAutomaticUpdatesAsync()
//----------------------------------------------------------------
function getMarks(){
    activeSheet.getSelectedMarksAsync().then(function(marks){
        pairs = marks[0].getPairs();
        for(i in pairs){
            console.log("pair ", i, ": ", pairs[i]);
        }
        //console.log("Selected Marks:", marks);
    });
}
//----------------------------------------------------------------
function saveView(){
    console.log("log saveView()");
    cv = "savedView";
    workbook = viz.getWorkbook();
    console.log(workbook);
    //cv = "view: " + views.length.toString();
    try{
        console.log("log saveView()  2");
        workbook.rememberCustomViewAsync("savedView").then(function(){
            console.log("Saved Custom View");
            views.push(cv);
        },function(err){
            console.log("err code: ", err.tableauSoftwareErrorCode);
            console.log("err message: ", err.message);

        });
    }
    catch(err){
        console.log("err code: ", err.tableauSoftwareErrorCode);
        console.log("err message: ", err.message);
    }
    
}

function getFilters(){

    var sheet = activeSheet;

    if(sheet.getSheetType() === "dashboard"){
        
        sheets = sheet.getWorksheets();
        slen = sheets.length;
        console.log("dashboard size: ", sheets.length);
        for(i = 0; i < slen; i++){
            console.log("sheet in dashboard: ", i);
            getWorksheetFilters(sheets[i]);
        }
    }
    else{
        //console.log("not dashboard: ", sheet.getSheetType());
        getWorksheetFilters(sheet);
    }


}

function getWorksheetFilters(sheet){
    console.log("sheet: ", sheet);
    console.log("sheet name: ", sheet.getName());
    console.log("sheet type: ", sheet.getSheetType());
    sheet.getFiltersAsync().then(function(filters){
        console.log(filters.length, "filters applied to ", sheet.getName(), ":", filters);

        for(i in filters){
            console.log("filter: ", i, ", ", filter[i].getName(), filter[i]);
        }
    });

}

function undo(){

    if(views.length > 0){
        last = views.pop();
    }
    workbook.showCustomViewAsync(last).then(function(cv){
        workbook.removeCustomViewAsync(cv.getName()).then(function(cv){

        });

    });

}

function alertViewChange(){
    console.log("view changed");
}

//----------------------------------------------------------------
//#####################_________________________###################