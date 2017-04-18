function inputLocal() {


    if (checkURL()){

      outsourceSet();

      location.href = "../project/blank-page.html";


    }
    else {
        return;
    }




}


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

    localStorage.setItem("urlSet", location);



}
