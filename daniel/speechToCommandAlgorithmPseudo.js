//Sudo of the speech to command algorithm
//version 1.0


//Assume we are getting an object 'info' from the tableau side by calling this function
var info = tableau.getInfo();//Assume the tableau side will initialize the workbook in this function

//the info object should contains every information we need, here is an example
/*
var info = {
	workbooks = {'obesity', 'college admission'};
	var college= {
		filterNames = {'academic year', 'college', 'select gender'};
		fieldNames = {'2013', '2014', 'male', 'female', 'arts and sciences', 'business', 'communication', 'education', 'engineering', 'music', 'public affairs', 'public health'};
		academicYear = {'2013', '2014'};
		college ={'arts and sciences', 'business', 'communication', 'education', 'engineering', 'music', 'public affairs', 'public health'};
		gender = {'male', 'female'};
	};
};*/

//'command' is the command is the translation of user's command, parsed from the speech recognition function
var command;

//this variable is used to keep track wether the command is legal or not
var legal = false;

//I think we need to keep track on which workbook the user are currently in 
//this variable is served for that purpose, initially it is set to the first workbook
//tableau.match is used to match the provided name that we search for and the name we use as the object name
//since we may have multiple words as a workbook name, while variable name can only be one word
//in this example the 'college admission' workbook will match to the college object
var currentWorkbook = tableau.match(workbooks[0]);

//Workbook switch goes first, since if user are calling fields in other workbook with the workbook name inside the command, this can prevent the not found error
for (var i=0; i< workbooks.length; i++)
{
	if (command.includes(workbooks[i]))
	{
		//Switch to that workbook
		 tableau.switchWorkbook(workbooks[i]);
		 currentWorkbook = tableau.match(workbooks[i]);
		 legal = true;
	}
}

//list of special commands we can support, here I use zoom in/out as example
if (command.includes('zoom in'))
{
	tableau.zoomIn();
	legal = true;
}
if (command.includes('zoom out'))
{
	tableau.zoomOut();
	legal = true;
}

//library variables that can guess which function user want to use
var addLibrary = {'list of words that can tell the user want to use add function'};
var removeLibrary = {'list of words that can tell the user want to use remove function'};
var allLibrary = {'list of words that can tell the user want to use reset function'};

//it search for every field name to see if any of the fields appears in the command
for (var i=0; i< currentWorkbooks.fieldNames.length; i++)
{
	if (command.includes(currentWorkbooks.fieldNames[i]))
	{
		//seperate the command into array of words
		var words = command.match(/\S+\s*/g);

		//this loop search search through each word of the command, check which type of command it belongs to
		//the checking order still needs some research
		for (var j=0; j< words.length; j++)
		{
			if (addLibrary.includes(words[j]))
			{
				//call the add function from tableau side
				tableau.add(currentWorkbooks.fieldNames[i]);
			}
			else if (removeLibrary.includes(words[j]))
			{
				//call the remove function from tableau side
				tableau.remove(currentWorkbooks.fieldNames[i]);
			}
			else if (allLibrary.includes(words[j]))
			{
				//call the reset function from tableau side
				tableau.reset(currentWorkbooks.fieldNames[i]);
			}
			else 
			{
				//call the default replace function from tableau side
				tableau.replace(currentWorkbooks.fieldNames[i]);
			}
		}
		legal = true;
	}

	//if we still dont know what to do with this command, then report the error
	else if (legal == false)
	{
		log.textContent('This is not a legal command');
	}
}

//this is what I get so far, currently I don't see the need to know the filter's information, but I still keep it inside the structure
//if later we find it useful then we can do some small modification to fit in
