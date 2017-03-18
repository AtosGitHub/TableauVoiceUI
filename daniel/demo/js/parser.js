/*
    This javacript file is meant to hold all the
    parsing from the speech processor and call the
    necessary Tableau API functions

*/


// this function is called with each voice command
// so far it is a bunch of if statements based on the word spoken
function parser(command){

  var cm = document.getElementById("command").value;
  var bog = document.querySelector('.output');
  var legal = false;

  var info = tableau.getInfo();

  var currentWorkbook = tableau.match(workbooks[0]);

  bog.textContent = command;

  for (var i=0; i< workbooks.length; i++)
  {
    if (command.includes(workbooks[i]))
    {
      //Switch to that workbook
      tableau.switchWorkbook(workbooks[i]);
      currentWorkbook = tableau.match(workbooks[i]);
      legal = true;
    }
  }
    
  if(command.includes('start') || cm.includes('start')){
      initViz();
  }
  else if(command.includes('switch') || cm.includes('switch')){
      switchToMapTab();

  }

  

  //library variables that can guess which function user want to use
  var addLibrary = {'list of words that can tell the user want to use add function'};
  var removeLibrary = {'list of words that can tell the user want to use remove function'};
  var allLibrary = {'list of words that can tell the user want to use reset function'};

//it search for every field name to see if any of the fields appears in the command
  for (var i=0; i< currentWorkbooks.fieldNames.length; i++)
  {
    //this loop search search through each word of the command, check which type of command it belongs to
    //the checking order still needs some research
    for (var j=0; j< words.length; j++)
    {
    
      if (command.includes(currentWorkbooks.fieldNames[i]))
      {
        if (addLibrary.includes(words[j]))
        {
          //call the add function from tableau side
          tableau.add(currentWorkbooks.fieldNames[i]);
        }
        else if (removeLibrary.includes(words[j]))
        {
          //call the remove function from tableau side
          tableau.remove(currentWorkbooks.fieldNames[i]);
        }
      
        else 
        {
          //call the default replace function from tableau side
          tableau.replace(currentWorkbooks.fieldNames[i]);
        }
      }
      legal = true;
    }
  
    //call the reset function from tableau side 
  }

  if (allLibrary.includes(words[j]))
  {
    //call the reset function from tableau side
    tableau.reset(currentWorkbooks.fieldNames[i]);
    legal = true;
  }
  
  //if we still dont know what to do with this command, then report the error
  if (legal == false)
  {
    log.textContent('This is not a legal command');
  }
}

// this function runs to switch the tab in the viz
function switchToMapTab() {
  workbook.activateSheetAsync("GDP per capita map");
}
