// from folder justin/currentSpeech

// Imports for WebSpeech API

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;


// for testing purposes I need a log on the html
var log = document.querySelector('.output');

var recognizing = false;

var recognition = new SpeechRecognition();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;



// what runs after the click on the mic
function startReco(event){

    // if app is listening already, then stop
    if(recognizing){
      recognition.stop();
      recognizing = false;

      start_img.src = 'mic.gif';
      //log.textContent = 'recognition stopped';

      return;
    }
    else {
      recognition.start();
      start_img.src = 'mic-slash.gif';
      //log.textContent = 'recognition started';

    }

}

recognition.onstart = function(event) {
    recognizing = true;

  }



// no match for the voice calls this
recognition.onnomatch = function(event) {
      //log.textContent = 'No match for Command';
  }


// after the app gets a voice result it prints it to log
recognition.onresult = function(event) {

    var last = event.results.length - 1;
    var command = event.results[last][0].transcript;

    console.log("speech command: ", command);

    interpCommand(command);

    //log.textContent = 'Command Received to be '+ command + ' ';

}


function interpCommand(command){

  var cmd = command.toLowerCase();
  isTab = isSheet(cmd);
  isFilter = cmd.startsWith("show");


  if(isTab){
    changeSheetByName(isTab);
  }

  else if(isFilter){
    // get properly formatted field_name, filter_name, filter_type
    // and call filterByName(field, filter, type) in getData.js
  }
  
  else if(command == 'exit' || command == 'hide' || command == 'close') { 
    hide();
  }

  else if(command == 'reload'){
    window.location.reload();    
  }

  else if(command == 'show'){
    viz.show();
  }

}


// this function runs to switch the tab in the viz
function switchToMapTab(){
  workbook.activateSheetAsync("Storms");
}



function hide() {
		
	viz.hide();
}
