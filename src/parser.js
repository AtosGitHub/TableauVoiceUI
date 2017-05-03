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
    console.log("ignoring: ", command);
    return;
  }

  // this turn the recieved command into lower case, in case to do strict comparison
  var cmd = command.toLowerCase();

  console.log("parser; command: ", command, "; clarify: ", clarify);

  if(cmd == "cancel"){
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
    console.log("IGNORING: as I am not being spoken to...");
    return;
  }


  //------------------------------------------------------------------
  // ME
  //
  if(cmd.includes("help") || cmd.includes("get information") || cmd.includes("what can i say")){
    getStringFields();
    return;
  }
  //------------------------------------------------------------------

  matches = [];

  // information section
  // info is the sheet object of the current sheet,
  // it has an array of field object and a name of itself
  info = getActiveSheetData();
  // tabs is an array of all the tab's names
  var tabs = getSheetNames();


  // flag section
  // this flag shows whether the command is found legal so far
  var legal = false;


  //------------------------------------------------------------------------------
  // CHECK HIDE VIZ
  //
	// if(cmd == 'exit' || cmd == 'hide' || cmd == 'close') {
 //    console.log("hiding");
 //    hide();
 //    //bog.textContent == 'Command received is '+ command + ' note how the Workbook is hidden';
 //    legal = true;
	// }


  //------------------------------------------------------------------------------
  // STOP LISTENING
  //
   if(cmd.includes('exit') || cmd.includes('hide') || cmd.includes('close') || cmd.includes('stop') || cmd.includes('ignore')) {
      console.log("stop listening from voice command");
      recReset = false;
      recognition.abort();
      speak("goodbye", "narrate");
      return;
      //bog.textContent == 'Command received is '+ command + ' note how the Workbook is hidden';
      //legal = true;
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

        console.log("Switch to tab: ", tabs[t]);
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
      if (exactMatch(info.fields[i].name, cmd)){

        //-------------------------------------------------------------------
        // CHECK "ALL" FILTER ON FIELD
        //
        // check if the command contains a key word to apply the "ALL" filter option
        // which clears the filter and shows all data values for the given field

        for (var allIndex in allLibrary){
          if (exactMatch(allLibrary[allIndex], cmd)){

            filterByName(info.fields[i].name, 'placeholder', 'all');
            return;
             //#talk
             msg = "Showing all " + info.fields[i].name + 's';
            // print out the action for debug purpose
            console.log(msg);
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
          for (var j in info.fields[i].values){
            if (exactMatch(info.fields[i].values[j], cmd)){
              legal = removeFilter(info.fields[i].name, info.fields[i].values[j], cmd);


              //-----------------------------------------------------
              // TEST "ADD" FILTER
              //
              console.log(legal);
              if (legal == false){
                legal = addFilter(info.fields[i].name, info.fields[i].values[j], cmd);
              }

              // default action is replace, which means if no action type
              // found in command, then we do replace
              if (legal == false){
                // replace the field with the specific filter
                // #matches
                //matches.push([info.fields[i].name, info.fields[i].values[j], 'replace', 257]);
                filterByName(info.fields[i].name, info.fields[i].values[j], 'replace');
                return;
                //console.log("Replaced: ", info.fields[i].values[j], " on: ", info.fields[i].name);
                legal = true;
                // #matches
                //break searchLoop;
              }
            }
          }
        }
        else if (legal == false){
          legal = numberFiltering(info.fields[i], cmd);
        }
      }

    }
    // END searchLoop
    //------------------------------------------------------------------------------
//academic year 2013


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

          for (var b in info.fields[a].values){
            if (exactMatch(info.fields[a].values[b], cmd)){

              //--------------------------------------------------------
              // TEST "ADD" FILTER
              //

              for (var addIndex1 in addLibrary){
                if (exactMatch(addLibrary[addIndex1], cmd)){

                  // #matches
                  matches.push([info.fields[a].name, info.fields[a].values[b], 'add', 340]);
                  //filterByName(info.fields[a].name, info.fields[a].values[b], 'add');

                  console.log("Added: ", info.fields[a].values[b], "to: ", info.fields[a].name);
                  //legal = true;
                  // #matches
                  //break searchLoop1;
                }
              }

              //--------------------------------------------------------------
              // TEST "REMOVE" LIBRARY
              //

              for (var removeIndex1 in removeLibrary){
                if (exactMatch(removeLibrary[removeIndex1], cmd)){

                  // #matches
                  matches.push([info.fields[a].name, info.fields[a].values[b], 'remove', 365]);
                  //filterByName(info.fields[a].name, info.fields[a].values[b], 'remove');

                  console.log("Removed ", info.fields[a].values[b], "from: ", info.fields[a].name);
                  //legal = true;
                  // #matches
                  //break searchLoop1;
                }
              }

              if (legal == false){
                // #matches
                matches.push([info.fields[a].name, info.fields[a].values[b], 'replace', 379]);
                //filterByName(info.fields[a].name, info.fields[a].values[b], 'replace');

                console.log("Replaced: ", info.fields[a].values[b], "on: ", info.fields[a].name);
                //legal = true;
                // #matches
                //break searchLoop1;
              }
            }
          }
        }
        // else if (legal == false){
        //   legal = numberFiltering(info.fields[a], cmd);
        // }
        else if ((info.fields[a].type == 'integer' || info.fields[a].type == 'float') && legal == false){

          if(numberMatch(info.fields[a].values, cmd, info.fields[a].type)){
            var filterNum = findLegalNum(info.fields[i].values);
            console.log('select number: ' + filterNum + " in field: " + info.fields[a].name);

            for (var addIndex1 in addLibrary){
              if (exactMatch(addLibrary[addIndex1], cmd)){
                matches.push([info.fields[a].name, filterNum, 'add', 340]);
                console.log("Added: ", filterNum, "to: ", info.fields[a].name);
              }
            }
            // legal = removeFilter(info.fields[a].name, filterNum, cmd);
            for (var removeIndex1 in removeLibrary){
              if (exactMatch(removeLibrary[removeIndex1], cmd)){
                matches.push([info.fields[a].name, filterNum, 'remove', 365]);
                console.log("Removed ", filterNum, "from: ", info.fields[a].name);
              }
            }

            if (legal == false){
              matches.push([info.fields[a].name, filterNum, 'replace', 379]);
              console.log("Replaced: ", filterNum, "on: ", info.fields[a].name);
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
    console.log("multiple matches: ", matches);

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
      if (cmd.includes(allLibrary[reloadIndex])){

      //talk reload
      msg = "reloading";
      speak(msg, "narrate");

        console.log("reloading");
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

  console.log("checkMatches");
  cmd = command.toLowerCase();
  cntnu = true;
  //cmd = cmd.split(' ');

  matchLoop:
  for(i in matches){
    for(j in cmd){
      console.log("command: ", command, "; matches[", i, "][0]: ", matches[i][0]);
      if(cmd.indexOf(matches[i][0].toLowerCase()) >= 0){
        console.log("match found");
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

// Remove certain filter from a field
function removeFilter(field, filter, cmd){
  for (var removeIndex in removeLibrary){
    if (exactMatch(removeLibrary[removeIndex], cmd)){
      // remove the specific filter from the sheet
      // #matches
      //matches.push([info.fields[i].name, info.fields[i].values[j], 'remove', 202]);
      filterByName(field, filter, 'remove');
      //console.log("Removed: ", info.fields[i].values[j], " from: ", info.fields[i].name);
      return true;

    }
    else{
      return false;
    }
  }
}

// Add certain filter from a field
function addFilter(field, filter, cmd){
  for (var addIndex in addLibrary){
    if (exactMatch(addLibrary[addIndex], cmd)){
      // add the specific filter intom the sheet
      // #matches
      //matches.push([info.fields[i].name, info.fields[i].values[j], 'add', 241]);
      filterByName(field, filter, 'add');
      return true;
      //console.log("Added: ", info.fields[i].values[j], " to: ", info.fields[i].name);
    }
    else {
      return false;
    }
  }
}

function numberFiltering(field, cmd){
  var fl = false;
  if (field.type == 'integer' || field.type == 'float'){

    if(numberMatch(field.values, cmd, field.type)){
      var filterNum = findLegalNum(field.values);
      console.log('select number: ' + filterNum + " in field: " + field.name);

      fl = removeFilter(field.name, filterNum, cmd);
      if (fl == false){
        fl = addFilter(field.name, filterNum, cmd);
      }

      if (fl == false){
        filterByName(field.name, filterNum, 'replace');
        return;
        fl = true;
      }
    }
  }
  return fl;
}

//---------------------------------------------------
