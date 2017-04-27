/*
    Author: Sai Saripella
    Email:  rahulsaripella@gmail.com

    This file has functions to start the speech recognition navigate commands to the parser file.
    Other functions included are for the recent worksheet functionality and to manipulate items on
    the application page such as the user's profile and the speech recognition button

*/


// Imports for WebSpeech API
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent


// for testing purposes I need a log on the html
//var log = document.getElementById('output');


//command array
var comms = ['start', 'exit', 'test'];

// This is the Grammar we would like to target for commands
// This is no longer necessary
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

/*
  Quick function to remember User's name from Login
  This is run as page loads and gives application a personal touch using local storage
*/

window.onload = function() {

    if (typeof(Storage) !== "undefined") {

          var username = localStorage.getItem("userName");
          var usernameFinal = capitalizeFirstLetter(username);
          document.getElementById("NAME").textContent = " " + usernameFinal + " ";
      }
    else {

          document.getElementById("NAME").textContent = "User";

      }

      fillRecent();




};


// this function fills all the recent URL into the dropdown box
function fillRecent() {



      if (localStorage.getItem("recent1") != null) {

          var rec1 = localStorage.getItem("recent1");
          var tag1 = urlToTag(rec1);

          document.getElementById('recent1').innerHTML = tag1;


          if (localStorage.getItem("recent2") != null) {

              var rec2 = localStorage.getItem("recent2");
              var tag2 = urlToTag(rec2);

              document.getElementById('recent2').innerHTML = tag2;



              if (localStorage.getItem("recent3") != null) {

                  var rec3 = localStorage.getItem("recent3");
                  var tag3 = urlToTag(rec3);

                  document.getElementById('recent3').innerHTML = tag3;



              }


          }

      }

}


// function that runs if user clicks on a recent URL tag
// It reloads the page with the clicked URL set up to run
function clickRecent(n) {

      if (n == 0) {

          var newLink = localStorage.getItem("recent1");
          localStorage.setItem("urlSet", newLink);

          location.reload();


      }
      else if (n == 1) {

          var newLink = localStorage.getItem("recent2");
          localStorage.setItem("urlSet", newLink);

          location.reload();


      }
      else {

          var newLink = localStorage.getItem("recent3");
          localStorage.setItem("urlSet", newLink);

          location.reload();



      }






}



// this function takes in a url and returns just the worksheet title
// which gets placed in the dropdown box for one click opening
function urlToTag(s) {

    var temp = s.split("http://public.tableau.com/views/");
    var holder = temp[1];

    var finalTag = holder.split("/");

    return finalTag[0];



}


// function is to merely capitlise first letter of string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}





// what runs after the click on the mic
// IMPORTANT: For some systems, the recognizing only occurs
// if these javascript files are being hosted on a web server
// if you are having trouble starting the speech recognition, simply
// run the application again from a web server environment
function startReco(event) {

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



    parser(command);



    //log.textContent = 'Command Received to be '+ command + ' ';

}

function hide() {

	viz.hide();



}




// this function is when you log out, clears your session and takes you to the homepage
function clearStorage() {




    window.localStorage.clear();

    location.href ="../login/login.html";


}



/*
    This is an elementary speech-parse-to-command function.
    It only executes select commands and displays what its doing
    in the log
*/




function speechParse() {
  var command = document.getElementById('command').value.toLowerCase();

  parser(command);

}
