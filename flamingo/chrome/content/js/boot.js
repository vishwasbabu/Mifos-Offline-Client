/*
 * This is the "bootstrap" code that runs when Mifos Offline first starts up.  It
 * checks the password manager to see if there's a login that we can auto-login
 * with, and if not, it presents the user with a page where they can enter their
 * login info.
 */
var authenticationUtils;


function getMainWindow(){
    var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor).getInterface(Components.interfaces.nsIWebNavigation).QueryInterface(Components.interfaces.nsIDocShellTreeItem).rootTreeItem.QueryInterface(Components.interfaces.nsIInterfaceRequestor).getInterface(Components.interfaces.nsIDOMWindow);
    return mainWindow;
}

var Statusbar = {
    // Writes a message to the statusbar.
    //
    message: function(text){
        getChromeElement('statusid').value = text;
    }
}

function authenticate(){
    /*getMainWindow().document.getElementById("mainbox").collapsed = false;
     getMainWindow().document.getElementById("health").collapsed = false;
     getMainWindow().document.getElementById("loginhtml").collapsed = true;
     */
    var username = getBrowser().contentDocument.getElementById('username').value;
    jsdump(username);
    var password = getBrowser().contentDocument.getElementById('password').value;
    jsdump("here");
    jsdump("here");
    var save = getBrowser().contentDocument.getElementById('saveCredentials').checked;
    jsdump("bye");
    jsdump("User " + username + "with password " + password);
    
    getBrowser().contentDocument.getElementById('loginThrobber').style.display = 'inline';
    getBrowser().contentDocument.getElementById('username').disabled = true;
    getBrowser().contentDocument.getElementById('password').disabled = true;
    jsdump("disabled login buttons");
    getBrowser().contentDocument.getElementById('loginOkButton').disabled = true;
    jsdump("making ajax call");
    var token = Account.login(username, password)
    if (token) {
        if (save) {
            var accessToken = null;
            var accessTokenSecret = null;
            if (Social.service(service).support.xAuth) {
                accessToken = token.accessToken;
                accessTokenSecret = token.accessTokenSecret;
            }
            var am = new AccountManager();
            am.addAccount({
                'username': username,
                'password': password,
                'service': service,
                'token': accessToken,
                'tokenSecret': accessTokenSecret
            });
        }
        
    }
    else {
        jsdump("exit");
        getBrowser().contentDocument.getElementById('badAuth').style.display = 'inline';
        getBrowser().contentDocument.getElementById('loginThrobber').style.display = 'none';
        getBrowser().contentDocument.getElementById('username').disabled = false;
        getBrowser().contentDocument.getElementById('password').disabled = false;
        getBrowser().contentDocument.getElementById('loginOkButton').disabled = false;
        getBrowser().contentDocument.getElementById('password').focus();
    }
}



function signup(){
    /*getMainWindow().document.getElementById("mainbox").collapsed = false;
     getMainWindow().document.getElementById("health").collapsed = false;
     getMainWindow().document.getElementById("loginhtml").collapsed = true;
     */
    setUpJavaDependencies();
    var username = getBrowser().contentDocument.getElementById('signupusername').value;
    jsdump(username);
    var password = getBrowser().contentDocument.getElementById('signuppassword').value;
    jsdump("in sign up password");
    jsdump("here");
    
    jsdump("User " + username + "with password " + password);
    
    getBrowser().contentDocument.getElementById('loginThrobber').style.display = 'inline';
    getBrowser().contentDocument.getElementById('username').disabled = true;
    getBrowser().contentDocument.getElementById('signupusername').disabled = true;
    getBrowser().contentDocument.getElementById('password').disabled = true
    getBrowser().contentDocument.getElementById('password').disabled = true;
    jsdump("disabled login buttons");
    
    
    getBrowser().contentDocument.getElementById('loginOkButton').disabled = true;
    jsdump("making ajax call");
    if (Account.login(username, password)) {
        jsdump("welcome");
        
    }
    else {
        jsdump("you are a bad boy");
        jsdump("exit");
        getBrowser().contentDocument.getElementById('badAuth').style.display = 'inline';
        getBrowser().contentDocument.getElementById('loginThrobber').style.display = 'none';
        getBrowser().contentDocument.getElementById('username').disabled = false;
        getBrowser().contentDocument.getElementById('password').disabled = false;
        getBrowser().contentDocument.getElementById('loginOkButton').disabled = false;
        getBrowser().contentDocument.getElementById('password').focus();
    }
    
}


function getMainWindow(){
    var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor).getInterface(Components.interfaces.nsIWebNavigation).QueryInterface(Components.interfaces.nsIDocShellTreeItem).rootTreeItem.QueryInterface(Components.interfaces.nsIInterfaceRequestor).getInterface(Components.interfaces.nsIDOMWindow);
    return mainWindow;
}

// Utility method to return the main browser window.
//
function getBrowser(){
    return getMainWindow().document.getElementById('browserid');
}

// Utility method to return the specified UI element.
//
function getChromeElement(id){
    return getMainWindow().document.getElementById(id);
}

/**Poor man's logger**/
function jsdump(str){
    var d = new Date();
    str = d + ': ' + str;
    Components.classes['@mozilla.org/consoleservice;1'].getService(Components.interfaces.nsIConsoleService).logStringMessage(str);
}

var Ctx = {
    user: "",
    password: "",
    token: "",
    list: "",
};

var Account = {
    login: function(username, password){
    
        jsdump('in verifyCredentials.');
        var req = new XMLHttpRequest();
        
        var postBody = {
            PersonnelDetails: {
                userName: username,
                password: password
            }
        };
        
        req.open('POST', "http://localhost:8080/mifoslive/authenticate", false);
        //req.setRequestHeader('Authorization', authHeader);
        //req.setRequestHeader('Content-length', postBody.length);
        req.setRequestHeader('Content-Type', 'application/json');
        jsdump(postBody);
        req.send(JSON.stringify(postBody));
        
        jsdump(req.status);
        jsdump(req.responseText);
        
        if (req.status == 200 && req.responseText != null) {
            jsdump("user Authenticated" + req.responseText);
            authenticationUtils.addUser(username, password);
        }
        else {
            jsdump("Bummmer! Somethings wrong buddy");
            return false;
        }
        return true;
    }
}


/**Script for loading java Jars from firefox**/
function policyAdd(loader, givenUrls){
    try {
        var str = 'edu.mit.simile.javaFirefoxExtensionUtils.URLSetPolicy';
        var policyClass = java.lang.Class.forName(str, true, loader);
        var policy = policyClass.newInstance();
        policy.setOuterPolicy(java.security.Policy.getPolicy());
        java.security.Policy.setPolicy(policy);
        policy.addPermission(new java.security.AllPermission());
        
        policy.addURL(givenUrls[0]);
        policy.addURL(givenUrls[1]);
        
    } 
    catch (e) {
        jsdump(e + '::' + e.lineNumber);
    }
};

function getAppPath(appName){
    var chromeRegistry = Components.classes["@mozilla.org/chrome/chrome-registry;1"].getService(Components.interfaces.nsIChromeRegistry);
    
    var uri = Components.classes["@mozilla.org/network/standard-url;1"].createInstance(Components.interfaces.nsIURI);
    
    uri.spec = "chrome://" + appName + "/content/";
    
    var path = chromeRegistry.convertChromeURL(uri);
    if (typeof(path) == "object") {
        path = path.spec;
    }
    
    path = path.substring(0, path.indexOf("/chrome/") + 1);
    
    return path;
};

function setUpJavaDependencies(){
    jsdump("done");
    var basePath = getAppPath('flamingo');
    //jsdump(basePath);
    var classLoaderJarpath = basePath + "java/javaFirefoxExtensionUtils.jar";
    // Add the paths for all the other JAR files that  you will be using
    var myJarpath = basePath + "java/flamingoUtils-1.0-jar-with-dependencies.jar";
    jsdump("custom jar path" + myJarpath)
    var urlArray = []; // Build a regular JavaScript array (LiveConnect will auto-convert to a Java array)
    urlArray[0] = new java.net.URL(myJarpath);
    urlArray[1] = new java.net.URL(classLoaderJarpath);
    var cl = java.net.URLClassLoader.newInstance(urlArray);
    policyAdd(cl, urlArray);
    jsdump("came to end");
    jsdump(cl);
    
    /**Code execution**/
    //var aClass = java.lang.Class.forName('com.confluxtechnologies.mifos',true,cl);
    var authenticationUtilsClass = cl.loadClass("com.confluxtechnologies.mifos.AuthenticationUtils");
    jsdump(authenticationUtilsClass);
    authenticationUtils = authenticationUtilsClass.newInstance();
    jsdump("came here too??????");
}



