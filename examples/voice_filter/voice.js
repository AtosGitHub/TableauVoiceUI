// This code is a modified version of 
// ":examples/web-speech-api-mdn/speech-color-changer/script.js"
// It is not currently functional.
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var commands = [ 'show year All', 'show year 2013', 'show year 2014', 'show gender All', 'show gender Men', 'show gender Women'];
var grammar = '#JSGF V1.0; grammar commands; public <command> = ' + commands.join(' | ') + ' ;'


var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

//var diagnostic = document.querySelector('.output');
//var bg = document.querySelector('html');
//var hints = document.querySelector('.hints');

//var colorHTML= '';
colors.forEach(function(v, i, a){
  console.log(v, i);
  colorHTML += '<span style="background-color:' + v + ';"> ' + v + ' </span>';
});
hints.innerHTML = 'Tap/click then say a color to change the background color of the app. Try '+ colorHTML + '.';

function startRecognition() {
  //alert('hello startRecognition');
  recognition.start();
  console.log('Ready to receive a filter command.');
}

recognition.onresult = function(event) {
  // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
  // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
  // It has a getter so it can be accessed like an array
  // The [last] returns the SpeechRecognitionResult at the last position.
  // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
  // These also have getters so they can be accessed like arrays.
  // The [0] returns the SpeechRecognitionAlternative at position 0.
  // We then return the transcript property of the SpeechRecognitionAlternative object

  var last = event.results.length - 1;
  var command = event.results[last][0].transcript;

  alert('hello onresult');
  alert(command);

  diagnostic.textContent = 'Result received: ' + command + '.';

  var measure = command.split(" ");
  var msr = (command.contains("year"))? 2 : 0;
  msr = (command.contains("gender"))? 1 : 0;

  switch(msr) {
    case 2:
      yearFilter(msr[2]);
      break;

    case 1:
      genderFilter(msr[2]);
      break;

    default:
      alert('invalid input');
  }

  //bg.style.backgroundColor = color;
  console.log('Confidence: ' + event.results[0][0].confidence);
}

recognition.onspeechend = function() {
  alert('ended');
  recognition.stop();
}

recognition.onnomatch = function(event) {
  alert("I didn't recognize that command.");
  diagnostic.textContent = "I didn't recognise that command.";
}

recognition.onerror = function(event) {
  alert("Returned error.");
  diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
}
