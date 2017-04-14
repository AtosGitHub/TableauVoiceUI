function getUnderlyingData() {
    sheet = viz.getWorkbook().getActiveSheet().getWorksheets().get("Storm Map Sheet");
    // If the active sheet is not a dashboard, then you can just enter:
    // viz.getWorkbook().getActiveSheet();
    options = {
        maxRows: 10, // Max rows to return. Use 0 to return all rows
        ignoreAliases: false,
        ignoreSelection: true,
        includeAllColumns: false
    };
    sheet.getUnderlyingDataAsync(options).then(function(t) {
        table = t;
        var tgt = document.getElementById("dataTarget");
        tgt.innerHTML = "<h4>Underlying Data:</h4><p>" + JSON.stringify(table.getData()) + "</p>";
    });
}