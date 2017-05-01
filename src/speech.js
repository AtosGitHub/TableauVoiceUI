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
var assistantName = "howard";
var requireName = false;
var recognizing = false;
var recReset = true;


var utterance = new SpeechSynthesisUtterance();
utterance.lang = 'en-US';
var synth = window.speechSynthesis;
voiceList = speechSynthesis.getVoices();
var synthPause = false;

var msgTypes = {narrate: true, debug: false, question: true, welcome: true};




//-----------------------------------------------------------------------
//
// what runs after the click on the mic
function startReco(event){

    var log = document.getElementById('output');
    // if app is listening already, then stop
    if(recognizing){
      recognition.stop();
      recReset = false;

      return;

    } else {
      recognition.start();
      recReset = true;
    }

}


//-----------------------------------------------------------------------
recognition.onstart = function(event) {
  recognizing = true;
  console.log("### recognition.onstart");
    start_img.src = 'mic-slash.gif';

  }
//-----------------------------------------------------------------------
recognition.onend = function(event){
  recognizing = false;
  start_img.src = 'mic.gif';
  console.log("### recognition.onend; synthPause: ", synthPause);

  if(!synthPause && recReset){
    recognition.start();
    // synthPause = false;
  }
  
}

//-----------------------------------------------------------------------
utterance.onstart = function(event){
          synthPause = true;
          console.log("begin speaking"); 
          recognition.abort();
}
//-----------------------------------------------------------------------
//recognition.start();
utterance.onend = function(event){
          synthPause = false; 
          console.log("stopped speaking"); 
          if(!recognizing && recReset){
              recognition.start();  
          }
          
}

//-----------------------------------------------------------------------

// after the app gets a voice result it prints it to log
recognition.onresult = function(event) {
    var last = event.results.length - 1;
    var command = event.results[last][0].transcript;
    parser(command);
}


//-----------------------------------------------------------------------




//----------------------------------------------------------------------
function speak(msg, spk){

  if(msgTypes[spk]){

    synthPause = true;
    recognition.stop();

    console.log("01speaking? ", synth.speaking);

    // console.log("speak: ", msg);
    //utterance = new SpeechSynthesisUtterance(msg);
    utterance.text = msg;
    utterance.rate = 1.2;

    synth.speak(utterance);
    console.log("01  speaking? ", synth.speaking);


    console.log("speaking: ", msg);

    //recognition.start();
  }
  else{
    console.log("Message type: ", spk, " = false/undefined.");
  }

}


//############################################################
//####################_________################################
//############################################################















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
