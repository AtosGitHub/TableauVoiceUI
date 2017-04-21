// Author: Justin Brewer
// Contact: this.justinbrewer@gmail.com
// from folder project_demo_v01

//----------------------------------------------------------------
// global variables

var viz, workbook, activeSheet, sheets, views;        

var urls = ["https://public.tableau.com/views/RegionalSampleWorkbook_9/Obesity?:embed=y&:display_count=yes", 
            "https://public.tableau.com/views/Retail-New-Site-Analysis_10_0_3/NewRetailSites?:embed=y&:display_count=yes",
            "https://public.tableau.com/views/Oil_and_Gas_10_0_2/Dashboard?:embed=y&:display_count=yes",
            "https://public.tableau.com/views/BPWorldEnergy_10_0_0/Consumption?:embed=y&:display_count=yes"];

//----------------------------------------------------------------
// initialize Tableau Viz

function initViz(vz) {
    var containerDiv = document.getElementById("vizContainer");
    var url;

    // console.log("new viz Index: ", vizIdx);
    // console.log("urls[", vizIdx, "]: ", urls[vizIdx]);

    if(vz != null){
        viz.dispose();
        url = vz;
    }
    else{
        url = urls[0];
    }

    //console.log("new url: ", url);
  
    var options = {
        hideTabs: false,
        hideToolBar: false,
        width: "850px",
        height: "730px",
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

function changeViz(){
    var vu = document.getElementById("vizSelect");
    var nu = vu.options[vu.selectedIndex].value;

    console.log("new viz index: ", nu);

    initViz(urls[nu]);

}

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
// 
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
        //refreshData();
    });

}
//----------------------------------------------------------------

//#############################################################################
//##########################__END_Main_Branch__#######################################
//############################################################################################

//#################################__Begin_Experimental__#####################################
//----------------------------------------------------------------
// INCLUDE IN MERGE
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