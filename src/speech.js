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

// program currently ignores audio while it speaks
// to force program to ignore when not being addressed explicitly
// set 'var requireName' to true and set your preferred assistantName
var assistantName = "assistant";
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
  if(synth.speaking){
    recognition.abort();
    // console.log("aborting");
    return;
  } else{
    recognizing = true;
    // console.log("### recognition.onstart");
    start_img.src = 'mic-slash.gif';
  }
}
//-----------------------------------------------------------------------
recognition.onend = function(event){
  recognizing = false;
  start_img.src = 'mic.gif';
  // console.log("### recognition.onend; \nsynthPause: ", synthPause, "\nrecReset: ", recReset);
  synth.resume();

  if(!synthPause && recReset){
    recognition.start();
    // synthPause = false;
  }
  
}

utterance.onpause = function(event){
  // console.log("synth paused");
}

utterance.onresume = function(event){
  // console.log("synth resumed");
}
//-----------------------------------------------------------------------
utterance.onstart = function(event){
          synthPause = true;
          // console.log("begin speaking"); 
          recognition.abort();
}
//-----------------------------------------------------------------------
//recognition.start();
utterance.onend = function(event){
          synthPause = false; 
          // console.log("stopped speaking"); 
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

  synth.pause();
  if(msgTypes[spk]){

    synthPause = true;
    recognition.stop();

    utterance.text = msg;
    utterance.rate = 1.2;

    synth.speak(utterance);


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
