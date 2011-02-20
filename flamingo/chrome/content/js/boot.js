/*
 * This is the "bootstrap" code that runs when Mifos Offline first starts up.  It
 * checks the password manager to see if there's a login that we can auto-login
 * with, and if not, it presents the user with a page where they can enter their
 * login info.
 */
Components.utils.import("resource://app/chrome/content/js/global.js");



function getMainWindow(){
    var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor).getInterface(Components.interfaces.nsIWebNavigation).QueryInterface(Components.interfaces.nsIDocShellTreeItem).rootTreeItem.QueryInterface(Components.interfaces.nsIInterfaceRequestor).getInterface(Components.interfaces.nsIDOMWindow);
    return mainWindow;
}

function disableControls(){
    jsdump("disabling all controls");
    getBrowser().contentDocument.getElementById('loginThrobber').style.display = 'inline';
    getBrowser().contentDocument.getElementById('username').disabled = true;
    getBrowser().contentDocument.getElementById('signupusername').disabled = true;
    getBrowser().contentDocument.getElementById('password').disabled = true
    getBrowser().contentDocument.getElementById('signuppassword').disabled = true;
    getBrowser().contentDocument.getElementById('loginOkButton').disabled = true;
    getBrowser().contentDocument.getElementById('registerButton').disabled = true;
}

function enableControls(){
    jsdump("enabling all controls");
    getBrowser().contentDocument.getElementById('badAuth').style.display = 'inline';
    getBrowser().contentDocument.getElementById('loginThrobber').style.display = 'none';
    
    getBrowser().contentDocument.getElementById('username').disabled = false;
    getBrowser().contentDocument.getElementById('signupusername').disabled = false;
    getBrowser().contentDocument.getElementById('password').disabled = false;
    getBrowser().contentDocument.getElementById('signuppassword').disabled = false;
    getBrowser().contentDocument.getElementById('loginOkButton').disabled = false;
    getBrowser().contentDocument.getElementById('registerButton').disabled = false;
}

function navigateToNextPage(){
    getMainWindow().document.getElementById("mainbox").collapsed = false;
    getMainWindow().document.getElementById("health").collapsed = false;
    getMainWindow().document.getElementById("loginhtml").collapsed = true;
    
}

function authenticate(){
	alert(dummy);
	alert(authenticationUtils);
    disableControls();
    var username = getBrowser().contentDocument.getElementById('username').value;
    jsdump(username + "being authenticated");
    var password = getBrowser().contentDocument.getElementById('password').value;
    var save = getBrowser().contentDocument.getElementById('saveCredentials').checked;
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
    var username = getBrowser().contentDocument.getElementById('signupusername').value;
    var password = getBrowser().contentDocument.getElementById('signuppassword').value;
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
				alert(authenticationUtils);
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

