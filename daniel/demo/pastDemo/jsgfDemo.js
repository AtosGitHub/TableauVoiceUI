var info = tableau.getInfo();
var grammar[info.length()];
for (var i=0; i<info.length(); i++)
{
	var grammar[i] = '#JSGF V1.0; grammar colors; public <' + info[i].fieldName + '> = ';
	if (info[i].type === 'string') 
	{
		grammar[i] += info[i].values.join(' | ') + ' ;';
	}
	else
	{
		grammar[i] += info[i].fieldName + ' ;';
	}
}

var <addGrammar> = add|plus; //etc 
var <removeGrammar> = remove|erase; //etc 
var <allGrammar> = all|everything; //etc 
var <resetGrammar> = reset|clear; //etc 
var cmd =  '#JSGF V1.0; grammar colors; public <command> = [<addGrammar> | <removeGrammar> | <allGrammar> | <resetGrammar>] (' + grammar.join(' | ') + ') ;';

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

  diagnostic.textContent = 'Result received: ' + command + '.';
  console.log('Confidence: ' + event.results[0][0].confidence);


}
