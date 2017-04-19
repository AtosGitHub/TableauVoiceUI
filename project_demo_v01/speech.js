// Imports for WebSpeech API
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent


// for testing purposes I need a log on the html
//var log = document.getElementById('output');


//command array
var comms = ['start', 'exit', 'test'];

// This is the Grammar we would like to target for commands
var grammar = '#JSGF V1.0; grammer commands; public <commands> = (start | exit | test);'


// Grammar and Speech variable set up
var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);

// Recognition attributes
//recognition will continue even if the user pauses while speaking
recognition.continuous = true;
recognition.grammars = speechRecognitionList;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;


var recognizing = false;





// what runs after the click on the mic
function startReco(event){


    var log = document.getElementById('output');


    // if app is listening already, then stop
    if(recognizing){


      recognition.stop();
      recognizing = false;

      start_img.src = 'mic.gif';
      console.log("recognition stopped");
      //log.textContent = 'recognition stopped';

      return;
    }
    else {


      recognition.start();

      recognizing = true;
      start_img.src = 'mic-slash.gif';
      console.log("recognition started");
      //log.textContent = 'recognition started';

    }

}

recognition.onstart = function(event) {
    recognizing = true;

  }



// no match for the voice calls this
// I believe this only applies if you're using a grammar
//    which we aren't because it isn't supported in chrome. -Justin
recognition.onnomatch = function(event) {
      //log.textContent = 'No match for Command';
      //console.log('No match for Command');
  }


// after the app gets a voice result it prints it to log
recognition.onresult = function(event) {

    var last = event.results.length - 1;
    var command = event.results[last][0].transcript;

    parser(command);

    //var log = document.getElementById('output');
    //console.log('Command Received to be '+ command + ' ');
    //log.textContent = 'Command Received to be '+ command + ' ';

}

var viz, workbook, activeSheet;

function hide() {

	viz.hide();
}

// only for testing local storage usage for url
function testLocal() {

  if (typeof(Storage) !== "undefined") {

  document.getElementById("test").innerHTML = localStorage.getItem("url");
} else {
  document.getElementById("test").innerHTML = "Sorry, your browser does not support Web Storage...";
}


}


function speechParse() {
  var command = document.getElementById('command').value.toLowerCase();

  parser(command);

}
