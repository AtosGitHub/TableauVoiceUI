// Author: Justin Brewer
// Contact: this.justinbrewer@gmail.com
// from folder project_demo_v01

//----------------------------------------------------------------
// global variables

var viz, workbook, activeSheet, sheets;        

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
            workbook = viz.getWorkbook();
            activeSheet = workbook.getActiveSheet();
            loadSheetList();
            updateSheetList();
            viz.addEventListener(tableau.TableauEventName.TAB_SWITCH, updateSheetList);
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
//#####################_________________________###################