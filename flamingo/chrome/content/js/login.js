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
    jsdump("User " + username + "with password " + password);
    /**Check credentials**/
    if (Account.login(username, password)) {
        navigateToNextPage();
    }
    else {
        enableControls()
    }
}

var Account = {
    login: function(username, password){
        var req = new XMLHttpRequest();
        var postBody = {
            PersonnelDetails: {
                userName: username,
                password: password
            }
        };
        jsdump("setting up authentication post parameters");
        req.open('POST', "http://localhost:8080/mifoslive/authenticate", false);
        //req.setRequestHeader('Authorization', authHeader);
        //req.setRequestHeader('Content-length', postBody.length);
        req.setRequestHeader('Content-Type', 'application/json');
        jsdump("Data to be posted" + JSON.stringify(postBody));
        req.send(JSON.stringify(postBody));
        
        jsdump("Request status" + req.status + "Response" + req.responseText);
        
        if (req.status == 200 && req.responseText != null) {
            jsdump("user Authenticated" + req.responseText);
            var response = JSON.parse(req.responseText);
            jsdump("user Validity :" + response.PersonnelDetails.valid);
            if (response.PersonnelDetails.valid) {
                authenticationUtils.addUser(username, password);
                setContext(username, password, response.PersonnelDetails.authenticationKey, response.PersonnelDetails.level);
                return true;
            }
            else {
                return false;
            }
        }
        else {
            jsdump("Bummmer! Somethings wrong buddy");
            return false;
        }
        return true;
    }
}


function setContext(username, password, token, role){
    jsdump("setting Context as " + username + "token: " + token + "role: " + role)
    Ctx.user = username;
    Ctx.password = password;
    Ctx.token = "TOKEN";
    Ctx.role = "ROLE";
}

