// Author: Justin Brewer
// Contact: this.justinbrewer@gmail.com
// from folder project_demo_v01

//----------------------------------------------------------------
// global variables

var viz, workbook, activeSheet, sheets, views;        

var urls = ["https://public.tableau.com/views/RegionalSampleWorkbook_9/Obesity?:embed=y&:display_count=yes", 
            "https://public.tableau.com/views/Retail-New-Site-Analysis_10_0_3/NewRetailSites?:embed=y&:display_count=yes",
            "https://public.tableau.com/views/Oil_and_Gas_10_0_2/Dashboard?:embed=y&:display_count=yes",
            "https://public.tableau.com/views/BPWorldEnergy_10_0_0/Consumption?:embed=y&:display_count=yes",
            
            // -Cannot seem to get checkboxes or radio buttons to select. Are there special key words for these?
            // -Filtering years seems to be problematic as well. Are numbers in this format recognized? 
            //     Even typing them did not seem to result in what one might expect.
            // -Ampersand issue discussed previously.
            // "https://public.tableau.com/en-us/s/gallery/goat-music",
            "https://public.tableau.com/views/G_O_A_T_Music_5/G_O_A_T_Music?:embed=y&:display_count=yes",
            
            // -I’m not sure how much this would come up for us specifically, 
            // but Roman numerals don’t parse (it works if you say “I I I” but not “the third”)
            // "https://public.tableau.com/en-us/s/gallery/monarchy-uk",
            "https://public.tableau.com/views/Dieuetmondroit_0/DieuetMonDroit?:embed=y&:display_count=yes",
            
            // -I could filter this one by state, but I believe I was having issues with the energy source
            // "https://public.tableau.com/en-us/s/gallery/energy-america"
            "https://public.tableau.com/views/EnergyinAmerica_6/Energy?:embed=y&:display_count=yes",
            ];


var initVizBool = true;
//----------------------------------------------------------------
// initialize Tableau Viz

function initViz(vz) {

    var welcome;

    if(!initVizBool){
        return;
    }

    var containerDiv = document.getElementById("vizContainer");
    var url;

    if(vz != null){
        viz.dispose();
        url = vz;
        welcome = false;
    }
    else{
        url = urls[0];
        welcome = true;
    }

    //console.log("new url: ", url);
  
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

    if(welcome){
        speak("Welcome", "welcome");  
        recognition.start();
        recognizing = true;
          
    }
    
}

//----------------------------------------------------------------
// called when a new workbook is selected from the drop-down in 'HomePage.html'
function changeViz(){
    var vu = document.getElementById("vizSelect");
    var nu = vu.options[vu.selectedIndex].value;

    // console.log("new viz index: ", nu);

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
function filterByName(field, filter, type) {

    // console.log("filter: ", field, filter, type);

    sheet = activeSheet;
    // if(filter.includes(";")){
    //     filter = filter.split(";");
    // }

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

    var fTypes = ["ALL", "REPLACE", "ADD", "REMOVE"];
    var t = fTypes.indexOf(type.toUpperCase());

    switch(t){
        case 0:
            msg = "Showing all " + field + "s";
            break;
        case 1:
            msg = "Showing " + field + ", " + filter;
            break;
        case 2:
            msg = "Added " + filter + " to " + field;
            break;
        case 3:
            msg = "Removed " + filter + " from " + field;
            break;
        default:
            console.log("invalid filter type");
    }

    speak(msg, "narrate");

    
    
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
        console.log("applied filter: ", field, ", ", filter, ", ", type);
        refreshData();
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