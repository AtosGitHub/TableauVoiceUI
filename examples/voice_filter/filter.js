var viz;
        
function initViz() {
    var containerDiv = document.getElementById("vizContainer"),
        //url = "https://public.tableau.com/views/13_Addinginteractivitytoadashboard_End_1/InteractiveDashboard?:embed=y&:display_count=yes";
        //url = "http://public.tableau.com/views/RegionalSampleWorkbook/College",
        url = "https://public.tableau.com/views/RegionalSampleWorkbook_9/Obesity?:embed=y&:display_count=yes",
        options = {
            "Academic Year": "",
            hideTabs: false
        };
    
    viz = new tableau.Viz(containerDiv, url, options);
}

function filterByName(field, filter, type) {
    var sheet = viz.getWorkbook().getActiveSheet();
    var fTypes = ["ALL", "REPLACE", "ADD", "REMOVE"];
    var fTypeEnum = {

    }

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
    var ws = wb.getPublishedSheetsInfo(); //Worksheet object
    var ds = ws.getSummaryDataAsync(); //
    
    var cd = ds.getColumns();

}

function uFirst(string) 
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}
