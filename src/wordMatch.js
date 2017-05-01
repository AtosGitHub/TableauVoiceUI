// This is a word macthing file


// This fucntion first use .includes() to check if the key word is inside the command
// If .includes() returns ture, then it makes both cmd and key word into string array
// Use a indexOf() function inside a for loop to do exact matching
// This function will returns true if it find a exact match, false if not
function exactMatch(matchWord, cmd){
  var legal = false;

  // Hard coded solution for special symbol
  // Adding new found special symbol in this format below this statement
    var matchWord = matchWord.replace('&', 'and');


  if(cmd.includes(matchWord.toLowerCase())){

    legal = true;
    console.log(matchWord + " found, flag is " + legal);
    var wordArray = matchWord.toLowerCase().split(' ');
    var cmdArray = cmd.split(' ');
    for (var x in wordArray){
      if (cmdArray.indexOf(wordArray[x]) == -1){
        legal = false;
        console.log("not exact match, word not match is: " + wordArray[x]);
      }
    }
  }
  return legal;
}

// This function checks wether the number inside command is in any of the numeric field's range 
// It convert the minimun, maximun value of this field and the number inside command to pure numbers
// Then if check if the number inside command is in range
var command = 0;

function numberMatch(value, cmd, type){
  var min = 0;
  var max = 0;
  var legal = false;

  if (type == 'float'){
    var justOneDot = cmd.replace(/[.](?=.*?\.)/g, '');//look-ahead to replace all but last dot
    command = parseFloat(justOneDot.replace(/[^0-9.]/g,''));

    var minTemp = value[0].replace(/[.](?=.*?\.)/g, '');
    min = parseFloat(minTemp.replace(/[^0-9.]/g,''));

    var maxTemp = value[1].replace(/[.](?=.*?\.)/g, '');
    max = parseFloat(maxTemp.replace(/[^0-9.]/g,''));
  }
  else{
    command = parseInt(cmd.replace(/[^0-9.]/g,''));
    min = parseFloat(value[0].replace(/[^0-9.]/g,''));
    max = parseFloat(value[1].replace(/[^0-9.]/g,''));
    console.log('command: ' + command);
    console.log('min: ' + min);
    console.log('max: ' + max);
  }
  if(min > max){
    var temp = min;
    min = max;
    max = temp;
  }
  if (command >= min && command <= max){
    legal = true;
  }
  else {
    legal = false;
  }
  return legal
}

// This function convert the number inside command into suitable type
// i.e. if the field has value like "13.2%", it will convert the "52.2" inside command into "52.2"
// if the field has value like "2,014", it will convert the "15400613" inside command into "15,400,613"

function findLegalNum(value){
  var legalNum = '';
  if (value[0].includes(',')){
    legalNum = command.toLocaleString()
  }
  else if (value[0].includes('%')){
    legalNum = command.toString() + "%";
  }
  else {
    legalNum = command.toString();
  }
  return legalNum;
}
