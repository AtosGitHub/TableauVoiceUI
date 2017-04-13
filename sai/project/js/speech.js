// Imports for WebSpeech API
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent


// for testing purposes I need a log on the html
//var log = document.getElementById('output');


//command array
var comms = ['start', 'exit', 'test'];

// This is the Grammar we would like to target for commands
var grammar = '#JSGF V1.0; grammer commands; public <commands> = (exit | test);'


// Grammar and Speech variable set up
var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);

// Recognition attributes
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
      log.textContent = 'recognition stopped';

      return;
    }
    else {


      recognition.start();

      recognizing = true;
      start_img.src = 'js/mic-slash.gif';
      log.textContent = 'recognition started';


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



    speechParse(command);



    //log.textContent = 'Command Received to be '+ command + ' ';

}


var viz, workbook, activeSheet;


// this function fills the div for the worksheet in the html
// only if the command is start
function initViz() {
    var containerDiv = document.getElementById("vizContainer");
    url = "http://public.tableau.com/views/WorldIndicators/GDPpercapita";

    var options = {


        onFirstInteractive: function (){
            workbook = viz.getWorkbook();
            activeSheet = workbook.getActiveSheet();
        }
    };

    viz = new tableau.Viz(containerDiv, url, options);
}

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


function speechParse(command) {


  if(command == 'start'){
    initViz();

    //bog.textContent == 'Command received is '+ command ' note the sample workbook is now loaded';
  }
  else if(command == 'switch' || command == 'tab'){

      switchToMapTab();

    //bog.textContent == 'Command received is '+ command + ' note how the tab switched';


  }
  else if(command == 'exit' || command == 'hide' || command == 'close') {

    hide();

    //bog.textContent == 'Command received is '+ command + ' note how the Workbook is hidden';


  }
  else if(command == 'reload'){

    window.location.reload();

  }










}
