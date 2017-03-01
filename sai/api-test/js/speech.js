// Imports for WebSpeech API
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent


// for testing purposes I need a log on the html
var log = document.querySelector('.output');

var recognizing = false;

// This is the Grammar we would like to target for commands
var grammar = '#JSGF V1.0; grammer commands; public <commands> = (start | exit | test);'


// Grammar and Speech variable set up
var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);

// Recognition attributes
recognition.grammars = speechRecognitionList;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;


// what runs after the click on the mic
function startReco(event){

    // if app is listening already, then stop
    if(recognizing){
      recognition.stop();
      return;
      log.textContent = 'recognition stopped';
    }
    else {
      recognition.start();
      recognizing = true;
      start_img.src = 'mic-slash.gif';
      log.textContent = 'recognition started';
    }

    return;

}

// after the app gets a voice result it prints it to log
recognition.onresult = function(event) {

    var last = event.results.length - 1;
    var command = event.results[last][0].transcript;

    log.textContent = 'Command Received to be '+ command + ' ';

}
