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



var utterance;
var synth = window.speechSynthesis;
var synthPause = false;

var msgTypes = {narrate: true, debug: false, question: true, welcome: true};





// what runs after the click on the mic
function startReco(event){


    var log = document.getElementById('output');


    // if app is listening already, then stop
    if(recognizing){


      recognition.stop();
      recognizing = false;

      //start_img.src = 'mic.gif';
      console.log("recognition stopped");
      //log.textContent = 'recognition stopped';

      return;
    }
    else {


      recognition.start();

      recognizing = true;
      //start_img.src = 'mic-slash.gif';
      console.log("recognition started");
      //log.textContent = 'recognition started';

    }

}

recognition.onstart = function(event) {
  console.log("### recognition.onstart");
    start_img.src = 'mic-slash.gif';
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
}


recognition.onend = function(event){
  recognizing = false;
  start_img.src = 'mic.gif';
  console.log("### recognition.onend: ", recognizing);
  //sythPause = false;

  // while(synthPause){

  // }

  // if(recognizing){
  //   recognition.start();
  // } else{
  //   recognizing = false;
  // }

  // if(recognizing){
  //   recognition.start();  
  // } else{
  //   recognizing = false;
  // }
  
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


//----------------------------------------------------------------------
function speak(msg, spk){

  if(msgTypes[spk]){

    synthPause = true;
    recognition.stop();
    console.log("rec stop");
    // recognizing = false;

    t = new Date().getTime()/1000;
    var tDiff = 0;

    // console.log("rec 152");
    // while(synthPause & tDiff > 5){
    //     tDiff = new Date().getTime() - t;
    // }

    console.log("01speaking? ", synth.speaking);

    // console.log("speak: ", msg);
    utterance = new SpeechSynthesisUtterance(msg);
    synth.speak(utterance);
    console.log("01speaking? ", synth.speaking);



    while(synth.speaking & tDiff  < 4){
      tDiff = (new Date().getTime()/1000) - t;

    }


    //synthPause = false;

    console.log("speaking: ", msg);

    //recognition.start();
  }
  else{
    console.log("Message type: ", spk, " = false/undefined.");
  }

}

function resumeReco(){

}

function sayIt(msg){

}
