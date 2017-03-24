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

  var workbooks = [];

  for (var i=0; i< info.length; i++)
  {
    if(workbooks.indexOf(info[i].worksheetName) != -1)
      {workbooks.push(info[i].worksheetName);}
  }

  var currentWorkbook = workbooks[0];

  bog.textContent = command;

  for (var i=0; i< workbooks.length; i++)
  {
    if (command.includes(workbooks[i]))
    {
      //Switch to that workbook
      switchWorkbook(workbooks[i]);
      currentWorkbook = workbooks[i];
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
  var addLibrary = {'add'};
  var removeLibrary = {'remove'};
  var allLibrary = {'reset'};

//it search for every field name to see if any of the fields appears in the command
  for (var i=0; i< info.length; i++)
  {
    if (info[i].type == 'string')
    {
      for (var j=0; j< info[i].values.length; j++)
      {
        if (command.includes(info[i].values[j].toLowerCase()))
        {
          if (addLibrary.includes(words[j]))
          {
            filterByName(info[i].fieldName, info[i].values[j], 'ADD');
          }
          else if (removeLibrary.includes(words[j]))
          {
            //call the remove function from tableau side
            filterByName(info[i].fieldName, info[i].values[j], 'REMOVE');
          }      
          else 
          {
            //call the default replace function from tableau side
            filterByName(info[i].fieldName, info[i].values[j], 'REPLACE');
          }
        }
        legal = true;
        break;
      }
    }
    else if (info[i].type == 'integer' && legal == false)
    {
      var temp = parseFloat(command.replace( /[^\d\.]*/g, ''));
    }
  }

  if (legal == false)
  {
    for (var k=0; k< allLibrary.length; k++)
    {
      if (command.includes(allLibrary[k]))
        {filterByName(info[0].fieldName, info[0].values[0], 'ALL');}
    }
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

