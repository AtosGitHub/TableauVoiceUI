/*
    This javacript file is meant to hold all the
    parsing from the speech processor and call the
    necessary Tableau API functions

*/
var info;
var utterance;
var synth = window.speechSynthesis;
var addLibrary = ['add', 'ad', 'ed', 'at', 'plus', 'put in', 'include'];
var removeLibrary = ['remove', 'reduce', 'delete'];
var allLibrary = ['reset','all', 'everything', 'clear', 'reload', 'refresh'];


// this function is called with each voice command
// so far it is a bunch of if statements based on the word spoken
function parser(command) {
  // for testing purposes, print the recieved command into console
  console.log("Recieved command: ", "\"", command, "\"");

  // information section
  info = getActiveSheetData();// info is the sheet object of the current sheet, it has an array of field object and a name of itself
  var tabs = getSheetNames();// tabs is an array of all the tab's names
  var cmd = command.toLowerCase();// this turn the recieved command into lower case, in case to do strict comparison

  // temporary data section
  var cmdArray = cmd.split(' ');// this is an array that split the command into words
  var fieldTemp = '';// this later will hold an word array that split form the found field name
  var filterTemp = '';// this later will hold an word array that split form the found filter name
  var operationTemp = '';// this later will hold an word array that split form the found action type

  // flag section
  var legal = false;// this flag shows whether the command is found legal so far
  var fieldFlag = false;// this flag shows whether the field name that turns true in .includes() function is actually in the command
  var operationFlag = false;// this flag shows whether the action type that turns true in .includes() function is actually in the command
  var filterFlag = false;// this flag shows whether the filter name that turns true in .includes() function is actually in the command




  /*
      First are the basic constant commands that do simple operations

  */
  if(cmd == 'start' || cmd == 'go' || cmd == 'begin' || cmd == 'run') {

      initViz();

      legal = true;



  }

  if (cmd == 'log out' || cmd == 'sign out' || cmd == 'log off') {

      clearStorage();

  }




	if(cmd == 'exit' || cmd == 'hide' || cmd == 'close') {
    console.log("hiding");
    hide();
    //bog.textContent == 'Command received is '+ command + ' note how the Workbook is hidden';
    legal = true;
	}


  // this part executes if the user would like to navigate to a recently opened URL
  if (cmd.contains('recent')) {



      if (cmd == 'recent 1') {

          if (localStorage.getItem("recent1") != null) {

          legal = true;
          clickRecent(0);
        }

      }
      else if (cmd == 'recent 2') {

          if (localStorage.getItem("recent2") != null) {

          legal = true;
          clickRecent(1);
        }

      }
      else if (cmd == 'recent 3') {

          if (localStorage.getItem("recent3") != null) {

          legal = true;
          clickRecent(2);
        }
      }

  }



  //Below starts to check flexible command
  if(legal == false){
    //This part check for tab switching
    for (t in tabs){
      // it will switch to a tab when a tab name other than the the current one is found
      if (cmd.includes(tabs[t].toLowerCase()) && legal === false && tabs[t] != info.name){
        //#talk
        msg = SheetList[t].type + ', ' + tabs[t];
        utterance=new SpeechSynthesisUtterance(msg);
        synth.speak(utterance);
        console.log("Switch to tab: ", tabs[t]);
        switchToMapTab(tabs[t]);
        legal = true;
        break;
      }
    }

    // the first loop search through all the field names in the current sheet
    searchLoop:
    for (var i in info.fields){
      fieldFlag = false;
      // use .includes() to find if any field name is part of the command
      if (cmd.includes(info.fields[i].name.toLowerCase())){
        // because true in .includes() does not mean the words are strictly match, so use indexOf to double check
        fieldTemp = info.fields[i].name.toLowerCase().split(' ');
        for (var x in fieldTemp){
          if (cmdArray.indexOf(fieldTemp[x]) == -1){
            // if any word of the found field name is not an element of command array, then set the flag to true
            fieldFlag = true;
          }
        }
        // if the flag is true, then skip this searching iteration,
        //reason not to break or keep going is because the rest of the field names may still meet the requirement
        if (fieldFlag == true){
          continue searchLoop;
        }
        // check if the command contains key word for reset option
        operationLoop1:
        for (var allIndex in allLibrary){
          operationFlag = false;
          if (cmd.includes(allLibrary[allIndex])){
            // same idea, but just another version to check action type
            operationTemp = allLibrary[allIndex].split(' ');
            for (var o in operationTemp){
              if (cmdArray.indexOf(operationTemp[o]) == -1){
                operationFlag = true;
              }
            }
            if (operationFlag == true){
              continue operationLoop1;
            }
            // reset this field
            filterByName(info.fields[i].name, '', 'all');

             //#talk
             msg = "Showing all " + info.fields[i].name + 's';
             utterance=new SpeechSynthesisUtterance(msg);
              synth.speak(utterance);

            // print out the action for debug purpose
            console.log(msg);
            legal = true;
            break searchLoop;
          }
        }
        // if a field name is found in command and it is not about reseting this field, then search filters only in this field
        if (info.fields[i].type == 'string'){
          filterLoop:
          for (var j in info.fields[i].values){
            filterFlag == false;
            if (cmd.includes(info.fields[i].values[j].toLowerCase())){
              // same double check, but just another version to check filter name
              filterTemp = info.fields[i].values[j].toLowerCase().split(' ');
              for (var y in filterTemp){
                if (cmdArray.indexOf(filterTemp[y]) == -1){
                  filterFlag = true;
                }
              }
              if (filterFlag == true){
                continue filterLoop;
              }
              operationLoop2:
              for (var removeIndex in removeLibrary){
                operationFlag == false;
                if (cmd.includes(removeLibrary[removeIndex])){
                  operationTemp = removeLibrary[removeIndex].split(' ');
                  for (var o in operationTemp){
                    if (cmdArray.indexOf(operationTemp[o]) == -1){
                      operationFlag = true;
                    }
                  }
                  if (operationFlag == true){
                    continue operationLoop2;
                  }
                  // remove the specific filter from the sheet
                  filterByName(info.fields[i].name, info.fields[i].values[j], 'remove');

                  //#talk
                  msg = "Removing " + info.fields[i].values[j] + " from " + info.fields[i].name;
                  utterance=new SpeechSynthesisUtterance(msg);
                  synth.speak(utterance);

                  console.log("Removed: ", info.fields[i].values[j], " from: ", info.fields[i].name);
                  legal = true;
                  break searchLoop;
                }
              }

              operationLoop3:
              for (var addIndex in addLibrary){
                operationFlag = false;
                if (cmd.includes(addLibrary[addIndex])){
                  operationTemp = addLibrary[addIndex].split(' ');
                  for (var o in operationTemp){
                    if (cmdArray.indexOf(operationTemp[o]) == -1){
                      operationFlag = true;
                    }
                  }
                  if (operationFlag == true){
                    continue operationLoop3;
                  }
                  // add the specific filter intom the sheet
                  filterByName(info.fields[i].name, info.fields[i].values[j], 'add');

                  //#talk
                  msg = "Adding " + info.fields[i].values[j] + " to: " + info.fields[i].name;
                  utterance=new SpeechSynthesisUtterance(msg);
                  synth.speak(utterance);

                  console.log("Added: ", info.fields[i].values[j], " to: ", info.fields[i].name);
                  legal = true;
                  break searchLoop;
                }
              }

              //default action is replace, which means if no action type found in command, then we do replace
              if (legal == false){
                // replace the field with the specific filter
                filterByName(info.fields[i].name, info.fields[i].values[j], 'replace');

                //#talk
                msg = "Showing " + info.fields[i].name + ', ' + info.fields[i].values[j];
                utterance=new SpeechSynthesisUtterance(msg);
                synth.speak(utterance);

                console.log("Replaced: ", info.fields[i].values[j], " on: ", info.fields[i].name);
                legal = true;
                break searchLoop;
              }
            }
          }
        }
        //else if (info.fields[i].type == 'integer')  {}
      }
    }

    // search all filters if no field name found
    if (legal == false){
      searchLoop1:
      for (var a in info.fields){
        if (info.fields[a].type == 'string'){
          filterLoop1:
          for (var b in info.fields[a].values){
            filterFlag = false;
            if (cmd.includes(info.fields[a].values[b].toLowerCase())){
              filterTemp = info.fields[a].values[b].toLowerCase().split(' ');
              for (var z in filterTemp){
                if (cmdArray.indexOf(filterTemp[z]) == -1){
                  filterFlag = true;
                  console.log(filterTemp[z]);
                }
              }
              if (filterFlag == true){
                continue filterLoop1;
              }
              operationLoop4:
              for (var addIndex1 in addLibrary){
                operationFlag = false;
                if (cmd.includes(addLibrary[addIndex1])){
                  operationTemp = addLibrary[addIndex1].split(' ');
                  for (var o in operationTemp){
                    if (cmdArray.indexOf(operationTemp[o]) == -1){
                      operationFlag = true;
                    }
                  }
                  if (operationFlag == true){
                    continue operationLoop4;//
                  }
                  filterByName(info.fields[a].name, info.fields[a].values[b], 'add');

                  //#talk
                  msg = "Adding " + info.fields[a].values[b] +  "to " + info.fields[a].name;
                  utterance=new SpeechSynthesisUtterance(msg);
                  synth.speak(utterance);

                  console.log("Added: ", info.fields[a].values[b], "to: ", info.fields[a].name);
                  legal = true;
                  break searchLoop1;
                }
              }

              operationLoop5:
              for (var removeIndex1 in removeLibrary){
                operationFlag = false;
                if (cmd.includes(removeLibrary[removeIndex1])){
                  operationTemp = removeLibrary[removeIndex1].split(' ');
                  for (var o in operationTemp){
                    if (cmdArray.indexOf(operationTemp[o]) == -1){
                      operationFlag = true;
                    }
                  }
                  if (operationFlag == true){
                    continue operationLoop5;
                  }
                  filterByName(info.fields[a].name, info.fields[a].values[b], 'remove');

                  //#talk
                  msg = "Removing" + info.fields[a].values[b] + "from: " + info.fields[a].name;
                  utterance=new SpeechSynthesisUtterance(msg);
                  synth.speak(utterance);

                  console.log("Removed ", info.fields[a].values[b], "from: ", info.fields[a].name);
                  legal = true;
                  break searchLoop1;
                }
              }

              if (legal == false){
                filterByName(info.fields[a].name, info.fields[a].values[b], 'replace');

                //#talk
                //msg = "Replacing "+ info.fields[a].values[b] + "on: " + info.fields[a].name;
                msg = "Showing " + info.fields[a].name + ', ' + info.fields[a].values[b];
               utterance=new SpeechSynthesisUtterance(msg);
               synth.speak(utterance);

                console.log("Replaced: ", info.fields[a].values[b], "on: ", info.fields[a].name);
                legal = true;
                break searchLoop1;
              }
            }
          }
        }
        //else if (info.fields[i].type == 'integer')  {}
      }
    }
  }

  //refresh the page use allLibrary, but only when no field or filter found
  if(legal == false){
    for (var reloadIndex in allLibrary){
      fieldFlag = false;
      if (cmd.includes(allLibrary[reloadIndex])){

      //talk reload
       utterance=new SpeechSynthesisUtterance("reloading");
       synth.speak(utterance);

        console.log("reloading");
		    window.location.reload();
        legal = true;
      }
    }
	}





  //-----------------------------------------------------------------------------
  // Invalid Command
  // at last if no legal action found, then notice the user it is a illegal command
  if (legal === false){

  //#talk
   utterance=new SpeechSynthesisUtterance("invalid command");
   synth.speak(utterance);

    console.log("invalid command");

    //document.getElementById("output").innerHTML = "Sorry, your Command is not legal...";
  }


}

// this function runs to switch the tab in the viz

function switchToMapTab(toTab) {
  workbook.activateSheetAsync(toTab);
}
