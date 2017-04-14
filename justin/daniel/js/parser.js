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
function parser(command) {
  console.log("parser recieved command: ", command);
  var legal = false;
  var tabs = ['Obesity', 'College', 'Economy', 'Stocks', 'Storms ', 'Flights'];

  var cmd = document.getElementById('command').value.toLowerCase();
  document.getElementById("output").innerHTML = "Command recieved as:"+command+'...';
  //var bog = document.getElementById("output");


  //bog.textContent = command;

  //First check for stricly match command
	if(command == 'start'){
    console.log("starting");
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
    console.log("hiding");
    hide();
    bog.textContent == 'Command received is '+ command + ' note how the Workbook is hidden';
    legal = true;
	}

	else if(command == 'reload'){
    console.log("reloading");
		window.location.reload();
    legal = true;
	}

  else if(command == 'Apple'){
    console.log("appling\n", FieldList);
    getUnderlyingDataB();
    console.log("FieldList (in apple): \n", FieldList);
    info = FieldList;
    legal = true;
    console.log("apple: ", info[0][0].name, info[0][0].values[1], 'replace');
    filterByName(info[0][0].name, info[0][0].values[1], 'replace');
  }




  //--------------------------------works---------------------------------------------
  // Switch Tab

  //Below starts to check flexible command
  else if(legal == false){
    console.log("switch tab");
    //This part check for tab switching
    for (var t=0; t< tabs.length; t++){
      if (command.includes(tabs[t].toLowerCase()) && legal === false){
        switchToMapTab(tabs[t]);
        legal = true;
        break;
      }
    }

    //--------------------------------works part of time---------------------------------------------
    // Filter By Name ALL
    // var allLibrary = ['reset','all', 'everything', 'clear'];

    //This part check for reseting the field
    if(legal == false){
      info = FieldList;
      console.log("filter all");
      allLoop:
      for (var k = 0; k < allLibrary.length; k++){
        if (command.includes(allLibrary[k])){ // @# may need to use allLibrary[k].toLowerCase()
          for (var i=0; i< info[0].length; i++){
            if (command.includes(info[0][i].name.toLowerCase())){
              filterByName(info[0][i].name, '', 'all');
              console.log("cleared filter for: ", info[0][i].name);
              legal = true;
              break allLoop;
            }
          }
        }
      }
    }

    //------------------------------------works, needs synonyms and hominyms (e.g. ad for add)-----------------------------------------
    // Filter By Name ADD
    // var addLibrary = ['add', 'plus', 'put in'];

    //This part check for adding new filter
    if(legal == false){
      info = FieldList;
      console.log("filter add");
      addLoop:
      for (var k = 0; k < addLibrary.length; k++){
        if (command.includes(addLibrary[k])){ // @# may need to use addLibrary[k].toLowerCase()
          for (var i=0; i< info[0].length; i++){
            if (info[0][i].type == 'string'){
              for (var j=0; j< info[0][i].values.length; j++){
                if (command.includes(info[0][i].values[j].toLowerCase())){
                  filterByName(info[0][i].name, info[0][i].values[j], 'add');
                  console.log("added ", info[0][i].values[j], "to filter ", info[0][i].name);
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

    //-------------------------------------mostly works----------------------------------------
    // mostly works, but both 'remove men' and 'remove women' removes men
    // I think this is caused by using includes because both words con
    //
    // Filter By Name REMOVE
    // var removeLibrary = ['remove', 'reduce', 'delete'];

    //This part check for remvoe an exist filter
    if(legal == false){
      info = FieldList;
      console.log("filter remove");
      removeLoop:
      for (var k = 0; k < removeLibrary.length; k++){
        if (command.includes(removeLibrary[k])){  // @# may need to use removeLibrary[k].toLowerCase()
          for (var i=0; i< info[0].length; i++){
            if (info[0][i].type == 'string'){
              for (var j=0; j< info[0][i].values.length; j++){
                if (command.includes(info[0][i].values[j].toLowerCase())){
                  filterByName(info[0][i].name, info[0][i].values[j], 'remove');
                  console.log("removed ", info[0][i].values[j], "from filter ", info[0][i].name);
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


    //---------------------------------works--------------------------------------------
    // Filter By Name REPLACE

    //This part is a defaulat option that replace an filter
    if(legal == false){
      info = FieldList;
      console.log("filter replace");
      console.log("FieldList (in replace): ", FieldList);
      replaceLoop:
      for (var i=0; i< info[0].length; i++){
        if (info[0][i].type == 'string'){
          for (var j=0; j< info[0][i].values.length; j++){
            if (command.includes(info[0][i].values[j].toLowerCase())){
              filterByName(info[0][i].name, info[0][i].values[j], 'replace');
              console.log("replaced ", info[0][i].values[j], "on filter ", info[0][i].name);
              legal = true;
              break replaceLoop;
            }
          }
        }
        //else if (info[0][i].type == 'int'){}
      }
    }

  }

  //-----------------------------------------------------------------------------
  // Invalid Command

  if (legal === false){
    console.log("invalid command");
    document.getElementById("output").innerHTML = "Sorry, your Command is not legal...";
  }


}

// this function runs to switch the tab in the viz
function switchToMapTab(toTab) {
  workbook.activateSheetAsync(toTab);
}
