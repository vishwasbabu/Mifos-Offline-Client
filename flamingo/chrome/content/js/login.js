/*
 * This is the "bootstrap" code that runs when Mifos Offline first starts up.  It
 * checks the password manager to see if there's a login that we can auto-login
 * with, and if not, it presents the user with a page where they can enter their
 * login info.
 */
function disableControls(){
    jsdump("disabling all controls");
    $("#loginThrobber").toggle();
    //    $("#username").attr("disabled", "true");
    //    $("#registerUsername").attr("disabled", "true");
    //    $("#password").attr("disabled", "true");
    //    $("#registerPassword").attr("disabled", "true");
    //    $("#loginButton").attr("disabled", "disabled");
    //    
    //    $("#registerButton").attr("disabled", "disabled");
    //    jsdump("there?")

}

function enableControls(){
    jsdump("enabling all controls");
    $("#authError").toggle();
    $("#loginThrobber").toggle();
    
    //    $("#username").attr("disabled", "false");
    //    $("#registerUsername").attr("disabled", "false");
    //    $("#password").attr("disabled", "false");
    //    $("#registerPassword").attr("disabled", "false");
    //    $('#loginButton').removeAttr("disabled");
    //    $('#registerButton').removeAttr("disabled");

}

function navigateToNextPage(){
    document.getElementById("mainBox").collapsed = false;
    document.getElementById("health").collapsed = false;
    document.getElementById("login").collapsed = true;
    
}

function authenticate(){
    disableControls();
    var username = $('#username').val();
    jsdump(username + "being authenticated");
    var password = $('#password').val();
    // var save = $('saveCredentials').checked;
    if (authenticationUtils.authenticateUser(username, password)) {
        setContext(username, password, "", "");
        //get the mifos url that is registered on this machine
        mifosURL = authenticationUtils.getRegisteredMifosServerURL();
        navigateToNextPage();
    }
    else {
        enableControls();
    }
}



function signup(){
    disableControls();
    var username = $("#registerUsername").val();
    var password = $("#registerPassword").val();
    mifosURL = $("#mifosURL").val();
    jsdump("User " + username + "with password " + password);
    /**Check credentials**/
    if (MifosServer.login(username, password)) {
        navigateToNextPage();
    }
    else {
        enableControls()
    }
}



