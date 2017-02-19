// Test browser support
window.SpeechRecognition = window.SpeechRecognition       ||
                           window.webkitSpeechRecognition ||
                           null;

if (window.SpeechRecognition === null) {
  document.getElementById('ws-unsupported').classList.remove('hidden');
  document.getElementById('button-play-ws').setAttribute('disabled', 'disabled');
  document.getElementById('button-stop-ws').setAttribute('disabled', 'disabled');
} else {
  var recognizer = new window.SpeechRecognition();
  var transcription = document.getElementById('transcription');
  var log = document.getElementById('log');

  // Recogniser doesn't stop listening even if the user pauses
  recognizer.continuous = true;

  // Start recognising
  recognizer.onresult = function(event) {
    transcription.textContent = '';

    for (var i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        transcription.textContent = event.results[i][0].transcript + ' (Confidence: ' + event.results[i][0].confidence + ')';
      } else {
        transcription.textContent += event.results[i][0].transcript;
      }
    }
   };

  // Listen for errors
  recognizer.onerror = function(event) {
    log.innerHTML = 'Recognition error: ' + event.message + '<br />' + log.innerHTML;
  };

  document.getElementById('button-play-ws').addEventListener('click', function() {
    // Set if we need interim results
    recognizer.interimResults = document.querySelector('input[name="recognition-type"][value="interim"]').checked;

    try {
      recognizer.start();
      log.innerHTML = 'Recognition started' + '<br />' + log.innerHTML;
    } catch(ex) {
      log.innerHTML = 'Recognition error: ' + ex.message + '<br />' + log.innerHTML;
    }
  });

  document.getElementById('button-stop-ws').addEventListener('click', function() {
    recognizer.stop();
    log.innerHTML = 'Recognition stopped' + '<br />' + log.innerHTML;
  });

  document.getElementById('clear-all').addEventListener('click', function() {
    transcription.textContent = '';
    log.textContent = '';
  });
}


//  Corresponding to the search box recognition form

function startDictation() {

    if (window.hasOwnProperty('webkitSpeechRecognition')) {

      var recognition = new webkitSpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.lang = "en-US";
      recognition.start();

      recognition.onresult = function(e) {
        document.getElementById('transcript').value
                                 = e.results[0][0].transcript;
        recognition.stop();
        document.getElementById('labnol').submit();
      };

      recognition.onerror = function(e) {
        recognition.stop();
      }

    }
  }
