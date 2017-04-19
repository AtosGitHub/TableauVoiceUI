// Author: Justin Brewer
// Contact: this.justinbrewer@gmail.com
// from folder project_demo_v01 (bitbucket)

//---------------------------------------------------------------------
API links:

Web Speech API
https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html

Tableau Javascript API
https://onlinehelp.tableau.com/current/api/js_api/en-us/JavaScriptAPI/js_api_ref.htm


//---------------------------------------------------------------------
To Run: 

- In our experience, Web Speech API does not work from pages hosted locally, so for testing, we used Web Server for Chrome which allowed us to bypass the restriction. Other methods of hosting this directory on a server are expected to operate similarly.

Web Server for Chrome: https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb?hl=en

- Open tableau.html in Google Chrome

- Click microphone to speak a command. Continuous listening mode is on our to do list.

//---------------------------------------------------------------------
Commands:

-Change tabs by saying  a tab name.

-Filter by saying a filter name. If two fields share a filter name, whichever is stored in a lower index in the field array will be chosen unless the user also specifies the field name.

e.g. Texas is a State and County name on the 'Obesity' tab and County comes first in the array of fields for this tab, so saying 'Texas' without specifying State will show Counties named 'Texas'. Saying 'State Texas' or 'Texas State' will filter by state.

Tableau filtering is done in one of four ways: 
	
	REMOVE: removes what user asks 
		from parser.js, the words the user can say to indicate remove
		var removeLibrary = ['remove', 'reduce', 'delete'];

	ADD: add to whatever is already being shown
		words that indicate add to filter (including some words the speech recognition returns)
		var addLibrary = ['add', 'ad', 'ed', 'at', 'plus', 'put in', 'include'];


	ALL: show everything
		keywords to clear filter
		var allLibrary = ['reset','all', 'everything', 'clear', 'reload', 'refresh'];

	REPLACE: only show what user asks for 
		(this is currently the default if no distinction is made by the user)


-"Reload": refreshes page and clears all filters

-The text box next to the microphone icon processes text commands the same as it would if it received the command from speech recognition. Alternatively users can call parser(<string command>) at the console.

-Demo video is included in this directory
//---------------------------------------------------------------------
Tableau JavaScript API:

The Tableau API allows us to apply filters to fields by passing appropriate string names/numeric values to functions. Our application currently supports applying named filters by calling applyFilterAsync(field, filter, type). 

var fTypes = ["ALL", "REPLACE", "ADD", "REMOVE"]; (Tableau enums for filtering)

The filter methods in the Tableau API are sensitive to the exact spelling and capitalization of the arguments, so retrieve the legal values by retrieving the raw spreadsheet data, which must be allowed in the settings on the Tableau server hosting the Vizs you wish to access.

We then compare the speech recognition results with legal values and pass the legal values to filter methods.

Data structure used to hold this data is described below.

//---------------------------------------------------------------------
SheetList data structure: 

*holds sheet data for comparing with speech results

-'SheetList[]' is created on initialization, but the 'fields[]' attribute for each Sheet (tab) is not filled until the tab is visited. 

-'activeSheet' is the member of 'SheetList' associated with the current tab. It contains field names and their corresponding legal valus/range of values.  

*Analytical buttons appear at the bottom left of the page which will print object's structure and data to the console.


This data is used to validate speech recognition results with appropriate values and their corresponding Field to be applied to. And are passed as arguments.

//-------------------------------------------------------------------------
Web Speech API:






//-------------------------------------------------------------------------
Connecting Speech to Tableau:





//-------------------------------------------------------------------------


