/*
    This javacript file is meant to hold all the
    parsing from the speech processor and call the
    necessary Tableau API functions

*/
var info;
var addLibrary = ['add', 'ad', 'ed', 'at', 'plus', 'put in', 'include'];
var removeLibrary = ['remove', 'reduce', 'delete'];
var allLibrary = ['reset','all', 'everything', 'clear'];

// this function is called with each voice command
// so far it is a bunch of if statements based on the word spoken
function parser(command) {
  console.log("parser recieved command: ", command);
  info = getActiveSheetData();
  var legal = false;
  var tabs = getSheetNames();

  var cmd = command.toLowerCase();
  console.log("Command recieved as:\""+command+'\".');
  //document.getElementById("output").innerHTML = "Command recieved as:"+command+'...';
  //var bog = document.getElementById("output");


  //bog.textContent = command;

  //First check for stricly match command
	if(cmd == 'start'){
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

	else if(cmd == 'exit' || cmd == 'hide' || cmd == 'close') {
    console.log("hiding");
    hide();
    //bog.textContent == 'Command received is '+ command + ' note how the Workbook is hidden';
    legal = true;
	}

	else if(cmd == 'reload'){
    console.log("reloading");
		window.location.reload();
    legal = true;
	}

  else if(cmd == 'get information'){
    //info = getActiveSheetData();
    console.log("ActiveSheetData (in get information): \n", info);
    legal = true;
    //console.log("get info: ", info.name, info[0][0].values[1], 'replace');
    //filterByName(info[0][0].name, info[0][0].values[1], 'replace');
  }




  //-----------------------------------------------------------------------------
  // Switch Tab

  //Below starts to check flexible command
  else if(legal == false){
    console.log("in tab: ", info.name, ", switch tab to: ", cmd);
    //This part check for tab switching
    for (t in tabs){
      if (cmd.includes(tabs[t].toLowerCase()) && legal === false && tabs[t] != info.name){
        switchToMapTab(tabs[t]);
        legal = true;
        break;
      }
    }

    //-----------------------------------------------------------------------------
    // Filter By Name ALL
    // var allLibrary = ['reset','all', 'everything', 'clear'];

    //This part check for reseting the field
    if(legal == false){
      console.log("filter all");
      allLoop:
      for (k in allLibrary){
        if (cmd.includes(allLibrary[k])){
          for (i in info.fields){
            if (cmd.includes(info.fields[i].name.toLowerCase())){
              filterByName(info.fields[i].name, '', 'all');
              console.log("cleared filter for: ", info.fields.name);
              legal = true;
              break allLoop;
            }
          }
        }
      }
    }

    //-----------------------------------------------------------------------------
    // Filter By Name ADD
    // var addLibrary = ['add', 'plus', 'put in'];

    //This part check for adding new filter
    if(legal == false){

      console.log("filter add");

      addLoop:
      for (k in addLibrary){
        if (cmd.includes(addLibrary[k])){ 

          for (i in info.fields){
            if (info.fields[i].type == 'string'){

              for (j in info.fields[i].values){
                if (cmd.includes(info.fields[i].values[j].toLowerCase())){
                  filterByName(info.fields[i].name, info.fields[i].values[j], 'add');
                  console.log("added ", info.fields[i].values[j], "to filter ", info.fields[i].name);
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

    //-----------------------------------------------------------------------------
    // mostly works, but both 'remove men' and 'remove women' removes men
    // I think this is caused by using includes because both words con
    //
    // Filter By Name REMOVE
    // var removeLibrary = ['remove', 'reduce', 'delete'];

    //This part check for remvoe an exist filter
    if(legal == false){
      console.log("filter remove");

      removeLoop:
      for (k in removeLibrary){
        if (cmd.includes(removeLibrary[k])){ 

          for (i in info.fields){
            if (info.fields[i].type == 'string'){

              for (j in info.fields[i].values){
                if (cmd.includes(info.fields[i].values[j].toLowerCase())){
                  filterByName(info.fields[i].name, info.fields[i].values[j], 'remove');
                  console.log("removed ", info.fields[i].values[j], "to filter ", info.fields[i].name);
                  legal = true;
                  break removeLoop;
                }
              }
            }
          }
        }
      }
    }


    //-----------------------------------------------------------------------------
    // Filter By Name REPLACE

    //This part is a defaulat option that replace an filter
    if(legal == false){
      console.log("filter replace");

      replaceLoop:
      for (i in info.fields){
        if (info.fields[i].type == 'string'){
          for (j in info.fields[i].values){
            if (cmd.includes(info.fields[i].values[j].toLowerCase())){
              filterByName(info.fields[i].name, info.fields[i].values[j], 'replace');
              console.log("replaced ", info.fields[i].values[j], "on filter ", info.fields[i].name);
              legal = true;
              break replaceLoop;
            }
          }
        }
      }
    }

  }

  //-----------------------------------------------------------------------------
  // Invalid Command

  if (legal === false){
    console.log("invalid command");

    //document.getElementById("output").innerHTML = "Sorry, your Command is not legal...";
  }


}

// this function runs to switch the tab in the viz
function switchToMapTab(toTab) {
  workbook.activateSheetAsync(toTab);
}
