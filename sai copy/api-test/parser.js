/*
    This javacript file is meant to hold all the
    parsing from the speech processor and call the
    necessary Tableau API functions

*/


// this function is called with each voice command
// so far it is a bunch of if statements based on the word spoken
function parser(command){

  //var command = document.getElementById("command").value;
  var bog = document.querySelector('.output');

  console.log("parser command: ", command);

  bog.textContent = command;

  if(command == 'start'){
      initViz();
  }
  else if(command == 'switch'){
      switchToMapTab();

  }




}

// this function runs to switch the tab in the viz
function switchToMapTab() {
  workbook.activateSheetAsync("GDP per capita map");
}
