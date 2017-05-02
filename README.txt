UTD & Atos: Tableau VUI

//---------------------------------------------------------------------
About this branch "final"

	This branch collects a list of matches and asks the user to specify which they
	want to apply instead of assuming the first match it good. 

	The matching process is functional, but further work is needed to synchronize
	stopping voice recognition when synthesis starts and then immediately restarting it.

	


//---------------------------------------------------------------------
API links:

Web Speech API
https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html

Tableau Javascript API
https://onlinehelp.tableau.com/current/api/js_api/en-us/JavaScriptAPI/js_api_ref.htm

//---------------------------------------------------------------------
Overview:

The Tableau Javascript API supports almost all the user interactions they can experience with a mouse.
The Tableau methods require arguments in most cases in the form of strings representing which field
(column of spreadsheet data source) to operate on, what filter values to apply, and how. These methods
 do not accept arguments unless they are formatted exactly as stored in the workbook's data source, so 
 we first extract the column names (fields), unique/appropriate values, and type of record. This 
 information is compared against the speech recognition results, and when a match is found, the 
 correctly formatted string is passed to the appropriate Tableau method. Legal sheet names, field 
 names, and filter values are obtained for any workbook with its data source sharing permissions 
 allowed with Tableau API; and stored locally in a hierarchical, programmer defined object by 
 'data.js' and is used by 'parser.js' in identifying legal words and returning the proper format (
 Tableau is case sensitive).

This software uses the Web Speech API, which returns a structured object containing information about 
the speech results. It includes a multi-dimensional array [i][j] which contains the sequential 
recognition results in the first index (i), and corresponding alternate results along the second index 
(j) where recognition certainty decreases with increasing j.  Speech recognition is handled by 
'speech.js'. Each time a speech recognition result is returned, the primary result is passed to 
function parser(command) in 'parser.js' where user's voice command is compared against legal sheet 
names, field names, filter values, and other commands and keywords. When legal combinations of words 
are identified, the properly formatted string names are passed as arguments to the Tableau Javascript 
API methods. 

Methods that are directly involved with user interactions with Tableau are in 'tableau.js'. From the 
user's perspective, it can perform: changing tabs/sheets within a workbook (part of the Viz class in 
Tableau), perform four variants of categorical filtering (add, remove, replace, all) where all is 
quivalent to clearing the filter and each must be associated with a field and legal filter value to 
fulfill the argument requirements for the Tableau filter method.  	


	filterByName() and its helper functionn applyFilter() perform the majority of user interactions 
	which is applying a categorical filter. A categorical filter is one that can be  identified by a 
	unique string/value/date and is associated with a field.


Filtering numeric fields (e.g. date, time, percentage, etc.) requires different arguments and some 
improvement in 'data.js' in the formatting of the legal values for each field when numbers are sorted 
and stored as strings.



//---------------------------------------------------------------------
To Run: 

- In our experience, Web Speech API does not work from pages hosted locally, so for testing, we used 
Web Server for Chrome which allowed us to bypass the restriction. Other methods of hosting this 
directory on a server are expected to operate similarly.

Web Server for Chrome: https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb?hl=en

- Open tableau.html in Google Chrome

- Click microphone to speak a command. Continuous listening mode is on our to do list.

//---------------------------------------------------------------------
Commands:

-Change tabs by saying  a tab name.

-Filter by saying a filter name. If two fields share a filter name, whichever is stored in a lower 
index in the field array will be chosen unless the user also specifies the field name.

e.g. Texas is a State and County name on the 'Obesity' tab and County comes first in the array of 
fields for this tab, so saying 'Texas' without specifying State will show Counties named 'Texas'. 
Saying 'State Texas' or 'Texas State' will filter by state.

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

-The text box next to the microphone icon processes text commands the same as it would if it received 
the command from speech recognition. Alternatively users can call parser(<string command>) at the 
console.

-Demo video is included in this directory

//---------------------------------------------------------------------
Tableau JavaScript API:

A data structure "SheetList[]" is created which holds all legal string and numeric values that apply 
to the current workbook and can be used as arguments to methods from the Tableau API. "SheetList[]" is 
created, maintained and updated by 

The Tableau API allows us to apply filters to fields by passing appropriate string names/numeric 
values to functions. Our application currently supports applying named filters by calling 
applyFilterAsync(field, filter, type). 

var fTypes = ["ALL", "REPLACE", "ADD", "REMOVE"]; (Tableau enums for filtering)

The filter methods in the Tableau API are sensitive to the exact spelling and capitalization of the 
arguments, so retrieve the legal values by retrieving the raw spreadsheet data, which must be allowed 
in the settings on the Tableau server hosting the Vizs you wish to access.

We then compare the speech recognition results with legal values and pass the legal values to filter 
methods.

Data structure used to hold this data is described below.

//---------------------------------------------------------------------
SheetList data structure:

*holds sheet data for comparing with speech results

-'SheetList[]' is created on initialization, but the 'fields[]' attribute for each Sheet (tab) is not 
filled until the tab is visited. 

-'activeSheet' is the member of 'SheetList' associated with the current tab. It contains field names 
and their corresponding legal valus/range of values.  

*Analytical buttons appear at the bottom left of the page which will print object's structure and data 
to the console.


This data is used to validate speech recognition results with appropriate values and their 
corresponding Field to be applied to. And are passed as arguments.

//-------------------------------------------------------------------------