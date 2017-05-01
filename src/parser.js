/*
    This javacript file is meant to hold all the
    parsing from the speech processor and call the
    necessary Tableau API functions

*/

//------------------------------------------------------------------------------
// GLOBAL VARIABLES
//
var info;
var clarify = false;
var addLibrary = ['add', 'ad', 'ed', 'at', 'plus', 'put in', 'include'];
var removeLibrary = ['remove', 'reduce', 'delete'];
var allLibrary = ['reset','all', 'everything', 'clear', 'reload', 'refresh'];
var matches;


//------------------------------------------------------------------------------
// PARSER
//
// this function is called with each voice command
// so far it is a bunch of if statements based on the word spoken
function parser(command) {

  if(synth.speaking){
    // console.log("ignoring: ", command);
    return;
  }

  // this turn the recieved command into lower case, in case to do strict comparison
  var cmd = command.toLowerCase();

  // console.log("parser; command: ", command, "; clarify: ", clarify);

  if(cmd == "cancel"){
    speak("canceled pending command", "narrate");
    clarify = false;
    return;
  }

  if(clarify){
    checkMatches(command);
    return;
  }

  // for testing purposes, print the recieved command into console
  console.log("Recieved command: \n\t", "\"", command, "\"");

  if(!cmd.includes(assistantName) && requireName){
    // console.log("IGNORING: as I am not being spoken to...");
    return;
  }

  if(cmd.includes("help") || cmd.includes("get information") || cmd.includes("what can i say")){
    getStringFields();
    return;
  }

  matches = [];

  // information section
  // info is the sheet object of the current sheet, 
  // it has an array of field object and a name of itself
  info = getActiveSheetData();
  // tabs is an array of all the tab's names
  var tabs = getSheetNames();
  

  // temporary data section
  // this is an array that split the command into words
  var cmdArray = cmd.split(' ');
  // this later will hold an word array that split form the found field name
  var fieldTemp = '';
  // this later will hold an word array that split form the found filter name
  var filterTemp = '';
  // this later will hold an word array that split form the found action type
  var operationTemp = '';

  // flag section
  // this flag shows whether the command is found legal so far
  var legal = false;
  // this flag shows whether the field name that turns true in .includes() 
  // function is actually in the command
  var fieldFlag = false;
  // this flag shows whether the action type that turns true
  // in .includes() function is actually in the command
  var operationFlag = false;
  // this flag shows whether the filter name that returns 
  //true in .includes() function is actually in the command
  var filterFlag = false;


  //------------------------------------------------------------------------------
  // STOP LISTENING
  //
   if(cmd.includes('exit') || cmd.includes('hide') || cmd.includes('close') || cmd.includes('stop') || cmd.includes('ignore')) {
      // console.log("stop listening from voice command");
      recReset = false;
      recognition.abort();
      speak("goodbye", "narrate");
      return;
  }

  
  if(legal == false){
    
    //------------------------------------------------------------------------------
    // CHECK CHANGE TAB
    //
    for (t in tabs){
      // it will switch to a tab when a tab name other than the the current one is found
      if (cmd.includes(tabs[t].toLowerCase()) && legal === false && tabs[t] != info.name){
        //#talk
        msg = SheetList[t].type + ', ' + tabs[t];

        speak(msg, "narrate");
        
        // console.log("Switch to tab: ", tabs[t]);
        switchToMapTab(tabs[t]);
        legal = true;
        return;
      }
    }

    //---------------------------------------------------------------------------
    // SEARCH FIELD NAMES
    //
    // the first loop search through all the field names in the current sheet
    searchLoop:
    for (var i in info.fields){
      fieldFlag = false;
      // use .includes() to find if any field name is part of the command
      if (cmd.includes(info.fields[i].name.toLowerCase())){
        // because true in .includes() does not mean the words are strictly match, 
        // so use indexOf to double check
        fieldTemp = info.fields[i].name.toLowerCase().split(' ');
        for (var x in fieldTemp){
          if (cmdArray.indexOf(fieldTemp[x]) == -1){
            // if any word of the found field name is not an element of command array, 
            // then set the flag to true
            fieldFlag = true;
          }
        }

        // #? : {should it be "break searchLoop;"?}
        // if the flag is true, then skip this searching iteration,
        // reason not to break or keep going is because the rest of 
        // the field names may still meet the requirement
        if (fieldFlag == true){
          continue searchLoop;
        }

        //-------------------------------------------------------------------
        // CHECK "ALL" FILTER ON FIELD
        //
        // check if the command contains a key word to apply the "ALL" filter option
        // which clears the filter and shows all data values for the given field
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
            filterByName(info.fields[i].name, 'placeholder', 'all');
            return;
             //#talk
             msg = "Showing all " + info.fields[i].name + 's';
            // print out the action for debug purpose
            // console.log(msg);
            legal = true;
            break searchLoop;
          }
        }


        //------------------------------------------------------------------------
        // SEARCH FILTER VALUES IN FIELD 
        //
        // if a field name is found in command and it is not about reseting this field, 
        // then search filters only in this field
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
            
              //----------------------------------------
              // TEST "REMOVE" FILTER
              //
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
                  return;
                    
                  //console.log("Removed: ", info.fields[i].values[j], " from: ", info.fields[i].name);
                  legal = true;
                }
              }


              //-----------------------------------------------------
              // TEST "ADD" FILTER
              //
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
                  return;
                    
                  //console.log("Added: ", info.fields[i].values[j], " to: ", info.fields[i].name);
                  legal = true;
                }
              }

              // default action is replace, which means if no action type 
              // found in command, then we do replace
              if (legal == false){
                // replace the field with the specific filter
                filterByName(info.fields[i].name, info.fields[i].values[j], 'replace');
                return;
                //console.log("Replaced: ", info.fields[i].values[j], " on: ", info.fields[i].name);
                legal = true;

              }
            }
          }
        }

      }

    }
    // END searchLoop
    //------------------------------------------------------------------------------    



    //##############################################################################
    //###################_________END_EXPLICIT_FIELD_STATED______###################
    //##############################################################################






    //------------------------------------------------------------------------------
    // SEARCH ALL FILTERS
    //
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

                idxOf = cmdArray.indexOf(filterTemp[z]);
  
                if (idxOf == -1){
  
                  filterFlag = true;
                }
              }
  
              if (filterFlag == true){
  
                continue filterLoop1;
              }
  
              //--------------------------------------------------------
              // TEST "ADD" FILTER
              //
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

                  // #matches
                  matches.push([info.fields[a].name, info.fields[a].values[b], 'add', 340]);
                }
              }

              //--------------------------------------------------------------
              // TEST "REMOVE" LIBRARY
              //
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
                  // #matches
                  matches.push([info.fields[a].name, info.fields[a].values[b], 'remove', 365]);      
                  // console.log("Removed ", info.fields[a].values[b], "from: ", info.fields[a].name);
            
                }
              }

              if (legal == false){
                // #matches
                matches.push([info.fields[a].name, info.fields[a].values[b], 'replace', 379]);
                // console.log("Replaced: ", info.fields[a].values[b], "on: ", info.fields[a].name);
            
              }
            }
          }
        }

      }
    }
  }
  //------------------------------------------------------------------------------
  // END Tabelau Data Search
  //#############################################################################
  //#############################################################################
  //#############################################################################




  //---------------------------------------------------------
  // IF MULTIPLE MATCHES FOUND
  //
  if(matches.length > 1){
    // console.log("multiple matches: ", matches);

    mt = [];

    for(i in matches){
      mt.push(matches[i][0]);
    }
    mt = uniqueD(mt);

    mats = [];
    
    if(mt.length > 1){
      msg  = "Multiple fields with " + matches[0][1] + '. ';
      for(i in mt){
        mats.push(mt[i]);
      }

      mats.splice(mats.length-1, 0, "and");

      msg += mats + ". ";

      //strFields.splice(strFields.length - 1, 0, "and");

      //msg.splice
      msg += "Which would you like?";
      speak(msg, "question");
      clarify = true;
      return;
    } else{
      filterByName(matches[0][0], matches[0][1], matches[0][2]);
      return;
    }
   
  }
  else if(matches.length == 1){

    filterByName(matches[0][0], matches[0][1], matches[0][2]);
    return;
  }

  //---------------------------------------------------------
  // CHECK RELOAD
  //
  //refresh the page use allLibrary, but only when no field or filter found
  if(legal == false){
    for (var reloadIndex in allLibrary){
      fieldFlag = false;
      if (cmd.includes(allLibrary[reloadIndex])){
      //recognition.abort();
      //talk reload
      msg = "reloading";
      speak(msg, "narrate");
         
		    window.location.reload();
        legal = true;
      }
    }
	}

  //-----------------------------------------------------------------------------
  // INVALID COMMAND
  //
  // at last if no legal action found, then notice the user it is a illegal command
  if (legal === false){
    //#talk
    msg = "invalid command";
    speak(msg, "narrate");
    console.log("invalid command");
    //document.getElementById("output").innerHTML = "Sorry, your Command is not legal...";
  }
}

function checkMatches(command){

  cmd = command.toLowerCase();
  cntnu = true;
  //cmd = cmd.split(' ');

  matchLoop:
  for(i in matches){
    for(j in cmd){
      if(cmd.indexOf(matches[i][0].toLowerCase()) >= 0){
        clarify = false;
        filterByName(matches[i][0], matches[i][1], matches[i][2]);
        matches = [];
        cntnu = false;
        break matchLoop;
      }
    }
  }

  if(cntnu){
    clarify = false;
    parser(command);
  }
}

// this function runs to switch the tab in the viz
function switchToMapTab(toTab) {
  workbook.activateSheetAsync(toTab);
}

//---------------------------------------------------
// TRANSPOSE ARRAY
//

function transpose(array){

  return array[0].map(function(col, i) { 
  return array.map(function(row) { 
    return row[i] 
  })
});

}

//---------------------------------------------------
