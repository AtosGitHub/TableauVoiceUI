// Author: Justin Brewer
// Contact: this.justinbrewer@gmail.com
// from folder project_demo_v01

//----------------------------------------------------------------
// global variables

var viz, workbook, activeSheet, sheets, views;



function initViz() {
    var containerDiv = document.getElementById("vizContainer");
    var url = localStorage.getItem("urlSet");


    var options = {
        hideTabs: false,
        hideToolBar: false,
        width: "850px",
        height: "730px",
        //(other options) instanceIdToClone: , height: ,width: ,device: ,"filterName": ,
        onFirstInteractive: function () {
            workbook = viz.getWorkbook();
            activeSheet = workbook.getActiveSheet();
            loadSheetList();
            updateSheetList();
            views = [];
            viz.addEventListener(tableau.TableauEventName.TAB_SWITCH, updateSheetList);
            // see function refreshData() comments below and uncomment next line if desired
            //viz.addEventListener(tableau.TableauEventName.FILTER_CHANGE, refreshData);
        }
    };

    viz = new tableau.Viz(containerDiv, url, options);
}

//----------------------------------------------------------------
// called when a new workbook is selected from the drop-down in 'HomePage.html'
/*
function changeViz(){
    var vu = document.getElementById("vizSelect");
    var nu = vu.options[vu.selectedIndex].value;

    console.log("new viz index: ", nu);

    initViz(urls[nu]);

}

*/

//----------------------------------------------------------------
// changes active sheet (tab) by name from string (voice)
function changeSheetByName(sheet){
    var newSheet = sheet.charAt(0).toUpperCase() + sheet.substr(1, sheet.length);
    workbook = viz.getWorkbook();
    workbook.activateSheetAsync(newSheet);
}

// early debugging utility: changes active sheet (tab)
// by name from text box
// may or may not be called anywhwere
function changeSheet(){
    var newSheet = document.getElementById("changeSheet").value;
    workbook = viz.getWorkbook();
    workbook.activateSheetAsync(newSheet);
}

//----------------------------------------------------------------
// process and apply categorical filter
function filterByName(field, filter, type) {

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
// helper function
function applyFilter(sheet, field, filter, type){
    var fTypes = ["ALL", "REPLACE", "ADD", "REMOVE"];
    var t = fTypes.indexOf(type.toUpperCase());

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
        // refreshData() shouldn't be necessary, but one particular worksheet
        // started getting hung up and not displaying properly after filters were
        // applied, this method was a workaround;
        //refreshData();
    });

//----------------------------------------------------------------
// this method was added because some workbooks were not displaying properly
// after a filter was applied; it only affected one worksheet which is hosted on
// Tableau Public and has over 1000 views (I suspect that is the issue, but haven't confirmed)
// from the development process; calling  viz.refreshDataAsync() after the filter
// is applied fixed this problem;
function refreshData(){
    viz.refreshDataAsync();
}


}
//----------------------------------------------------------------
