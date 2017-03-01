// Imports for WebSpeech API
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent


// for testing purposes I need a log on the html
var log = document.querySelector('.output');

var recognizing = false;


// Grammar and Speech variable set up
var recognition = new SpeechRecognition();
var SpeechRecognitionList = new SpeechGrammarList();






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

    }

    return;

}
