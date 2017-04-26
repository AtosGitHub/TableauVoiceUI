/*
    This file exists to give the loginLS outsourceSet function
    another function it call to add URL's to the local storage
    as three seperate keys that will persist as recent URL's
    for the user to open easily

*/


// add the URL from the "input buffer" which is the url in the urlSet local storage key
function addToFirst() {

  var recentURL = localStorage.getItem("urlSet");

  localStorage.setItem("recent1", recentURL);



}



// add the URL from the "input buffer" which is the url in the urlSet local storage key to the second recent URL key
function addToSecond() {

  var recentURL = localStorage.getItem("urlSet");

  localStorage.setItem("recent2", recentURL);



}



// add the URL from the "input buffer" which is the url in the urlSet local storage key to the third recent URL key
function addToThird() {

  var recentURL = localStorage.getItem("urlSet");

  localStorage.setItem("recent3", recentURL);



}


/*
  The following functions simply check if the recent URL localStorage keys have a URL
  accompanied with their key or not, if not the current old url goes to one of them from
  using one of the functions above

*/

function firstExists() {

  if(localStorage.getItem("recent1") == null){

      return false;

  }

  else {

      return true;

  }



}

function secondExists() {

  if(localStorage.getItem("recent2") == null){

      return false;

  }

  else {

      return true;

  }



}

function thirdExists() {

  if(localStorage.getItem("recent3") == null){

      return false;

  }

  else {

      return true;

  }



}
