function inputLocal() {

    var location = document.getElementById('locationURL').value;

    localStorage.setItem("urlSet", location);


    location.href = "../project/blank-page.html";




}


function mainLocal() {

    var user = document.getElementById('userid').value;

    localStorage.setItem("userName", user);

    location.href = "input.html";




}
