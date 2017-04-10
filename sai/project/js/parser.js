/*
    This javacript file is meant to hold all the
    parsing from the speech processor and call the
    necessary Tableau API functions

*/


// this function is called with each voice command
// so far it is a bunch of if statements based on the word spoken
function parser(){

  var command = document.getElementById("command").value;
  var bog = document.querySelector('.output');


  bog.textContent = command;

		if(command == 'start'){
			initViz();
	  
			bog.textContent == 'Command received is '+ command ' note the sample workbook is now loaded';
		}
		else if(command == 'switch' || command == 'tab'){
		  
		    switchToMapTab();
	  
			bog.textContent == 'Command received is '+ command + ' note how the tab switched';


		}
		else if(command == 'exit' || command == 'hide' || command == 'close') {
	  
			hide();
	  
			bog.textContent == 'Command received is '+ command + ' note how the Workbook is hidden';

	  
		}
		else if(command == 'reload'){
			
			window.location.reload();
			
		}
  




}

// this function runs to switch the tab in the viz
function switchToMapTab() {
  workbook.activateSheetAsync("GDP per capita map");
}
