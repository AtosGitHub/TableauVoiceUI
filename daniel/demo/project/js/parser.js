/*
    This javacript file is meant to hold all the
    parsing from the speech processor and call the
    necessary Tableau API functions

*/
var info;
var addLibrary = ['add', 'plus', 'put in'];
var removeLibrary = ['remove', 'reduce', 'delete'];
var allLibrary = ['reset','all', 'everything', 'clear'];

// this function is called with each voice command
// so far it is a bunch of if statements based on the word spoken
function parser() {
  var legal = false;
  var tabs = ['Obesity', 'College', 'Economy', 'Stocks', 'Storms ', 'Flights'];

  var command = document.getElementById('command').value.toLowerCase();
  document.getElementById("output").innerHTML = "Command recieved as:"+command+'...';
  //var bog = document.getElementById("output");


  //bog.textContent = command;

  //First check for stricly match command
	if(command == 'start'){
			initViz();
      legal = true;
			//bog.textContent == 'Command received is '+ command ' note the sample workbook is now loaded';
	}
  /*
	else if(command == 'switch' || command == 'tab'){
		   switchToMapTab();
		bog.textContent == 'Command received is '+ command + ' note how the tab switched';
	}*/

	else if(command == 'exit' || command == 'hide' || command == 'close') {
    hide();
    bog.textContent == 'Command received is '+ command + ' note how the Workbook is hidden';
    legal = true;
	}

	else if(command == 'reload'){
		window.location.reload();
    legal = true;
	}
  /* testing
  else if(command == 'exe'){
    filterByName(info[0][0].name, info[0][0].values[1], 'replace');
  }*/

  else if(command == 'get'){
    getUnderlyingDataB();
    info = FieldList;
    legal = true;
    filterByName(info[0][0].name, info[0][0].values[1], 'replace');
  }

  //Below starts to check flexible command
  else if(legal == false){
    //This part check for tab switching
    for (var t=0; t< tabs.length; t++){
      if (command.includes(tabs[t].toLowerCase()) && legal === false){
        switchToMapTab(tabs[t]);
        legal = true;
        break;
      }
    }

    //This part check for reseting the field
    if(legal == false){
      allLoop:
      for (var k=0; k<allLibrary.length; k++){
        if (command.includes(allLibrary[k])){
          for (var i=0; i< info[0].length; i++){
            if (command.includes(info[0][i].name.toLowerCase())){
              filterByName(info[0][i].name, '', 'all');
              console.log(info[0][i].name);
              legal = true;
              break allLoop;
            }
          }
        }
      }
    }

    //This part check for adding new filter
    if(legal == false){
      addLoop:
      for (var k=0; k<addLibrary.length; k++){
        if (command.includes(addLibrary[k])){
          for (var i=0; i< info[0].length; i++){
            if (info[0][i].type == 'string'){
              for (var j=0; j< info[0][i].values.length; j++){
                if (command.includes(info[0][i].values[j].toLowerCase())){
                  filterByName(info[0][i].name, info[0][i].values[j], 'add');
                  console.log(info[0][i].values[j]);
                  legal = true;
                  break addLoop;
                }
              }
            }
            //else if (info[0][i].type == 'int'){}
          }
        }
      }
    }

    //This part check for remvoe an exist filter
    if(legal == false){
      removeLoop:
      for (var k=0; k<removeLibrary.length; k++){
        if (command.includes(removeLibrary[k])){
          for (var i=0; i< info[0].length; i++){
            if (info[0][i].type == 'string'){
              for (var j=0; j< info[0][i].values.length; j++){
                if (command.includes(info[0][i].values[j].toLowerCase())){
                  filterByName(info[0][i].name, info[0][i].values[j], 'remove');
                  console.log(info[0][i].values[j]);
                  legal = true;
                  break removeLoop;
                }
              }
            }
            //else if (info[0][i].type == 'int'){}
          }
        }
      }
    }


    //This part is a defaulat option that replace an filter
    if(legal == false){
      replaceLoop:
      for (var i=0; i< info[0].length; i++){
        if (info[0][i].type == 'string'){
          for (var j=0; j< info[0][i].values.length; j++){
            if (command.includes(info[0][i].values[j].toLowerCase())){
              filterByName(info[0][i].name, info[0][i].values[j], 'replace');
              console.log(info[0][i].values[j]);
              legal = true;
              break replaceLoop;
            }
          }
        }
        //else if (info[0][i].type == 'int'){}
      }
    }

  }
  if (legal === false){
    document.getElementById("output").innerHTML = "Sorry, your Command is not legal...";
  }


}

// this function runs to switch the tab in the viz
function switchToMapTab(toTab) {
  workbook.activateSheetAsync(toTab);
}
