var viz;
        
function initViz() {
    var containerDiv = document.getElementById("vizContainer"),
        url = "http://public.tableau.com/views/RegionalSampleWorkbook/College",
        options = {
            "Academic Year": "",
            hideTabs: true
        };
    
    viz = new tableau.Viz(containerDiv, url, options);
}

function yearFilter(year) {
    var sheet = viz.getWorkbook().getActiveSheet();
    if (year === "") {
        sheet.clearFilterAsync("Academic Year");
    } else {
        sheet.applyFilterAsync("Academic Year", year, tableau.FilterUpdateType.REPLACE);
    }
}

function collegeFilter(college) {
    var sheet = viz.getWorkbook().getActiveSheet();
    if (college === "") {
        sheet.clearFilterAsync("College");
    } else {
        sheet.applyFilterAsync("College", college, tableau.FilterUpdateType.REPLACE);
    }
}

function genderFilter(gender) {
    var sheet = viz.getWorkbook().getActiveSheet();
    if (gender === "") {
        sheet.clearFilterAsync("Gender");
    } else {
        sheet.applyFilterAsync("Gender", gender, tableau.FilterUpdateType.REPLACE);
    }
}