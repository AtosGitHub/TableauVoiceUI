/*
    Author: Sai Saripella
    Email:  rahulsaripella@gmail.com

    This file has functions for taking in input from user on the main.html and input.html pages
    The data is then put in localStorage to be used by the app.html page

*/


// this function checks the url input and if user has already been in the app
// it stores the old url(s) in the 'recent' drop-down box on the app.html
function inputLocal() {


    if (checkURL()){

      outsourceSet();

      location.href = "../project/mainApplication.html";


    }
    else {
        return;
    }




}


// this function remembers the users name and
// takes the user to the input page
function mainLocal() {

    var user = document.getElementById('userid').value;

    if (checkLogin(user)) {

      localStorage.setItem("userName", user);

      location.href = "input.html";



    }
    else {

        alert("Please enter a username");
        return;


    }





}

// makes sure the url at input is valid
function checkURL() {

    var url = document.getElementById('locationURL').value;
    if (url.includes(".com")){
        return true;
    }
    else {
        alert("The URL you have provided is not a public supported Worksheet");
        return false;
    }


}

// ensures a username is provided
function checkLogin(user) {

    if (user.length > 0){

      return true;

    }

    else {

      return false;

    }



}

function outsourceSet() {

    var location = document.getElementById('locationURL').value;

    // check if there is already a URL in the current local storage key
    // if there already has been a URL inputted, it will be sent to one of the
    // three recent URL's local storage keys to be displayed on the application
    // if there isn't alredy a URL in the urlSet "input buffer", the entered URL
    // will take that place and will be on deck to be opened by command on application page
    if(localStorage.getItem("urlSet") != null){
        if (firstExists()){

                if (secondExists()){

                            if (thirdExists()){

                              // do nothing since all 3 recent keys are full

                            }
                            else {

              // recent1 and recent2 are taken so place in recent3
              addToThird();
                            }

                }
                else {


              // recent1 is taken so add to recent2
              addToSecond();

                }


        }
        else {


              // if recent1 localStorage key doesnt exist, add this URL to recent1
              addToFirst();

        }


    }



    localStorage.setItem("urlSet", location);



}
