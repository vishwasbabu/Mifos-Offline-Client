Components.utils.import("resource://app/chrome/content/js/global.js");

function init(){


    $('#futurecentercollectionsheet').centerCollectionSheet({
        'centerid': '0000100004'
    });
    
    $('#futurelocenter').futureloanOffCenter();
    
    $('#syncedcenters').syncedCenters();
    
    $('#unsyncedlocenter').unsynedloanOffCenter();
    
    $('#unsyncedcentercollectionsheet').centerCollectionSheet({
        'centerid': '0000100004'
    });
    
    $('#todaygetdata').toggle('showOrHide');
    $('#futuregetdata').toggle('showOrHide');
    
    $('#centercollectionsheet').centerCollectionSheet({
        'centerid': '0000100004'
    });
    
    
    $('#todaylocenter').loanOffCenter();
    
    var condition = navigator.onLine ? "syncboxgreen" : "syncboxred";
    document.getElementById('syncbutton').setAttribute("class", condition);
    
    //		document.getElementById('todaydaterpt').value = new Date();
    //		document.getElementById('todaydatetrx').value = new Date();

};


function tempInit(){
    alert("hello");
    alert(dummy);
    setUpJavaDependencies();
    alert(authenticationUtils);
    $('#todaylocenter').loanOffCenter();
}

function onTreeClicked(event){
    var tree = document.getElementById("my-tree");
    var tbo = tree.treeBoxObject;
    
    var row = {}, col = {}, child = {};
    tbo.getCellAt(event.clientX, event.clientY, row, col, child);
    
    var cellText = tree.view.getCellText(row.value, col.value);
    $('#centercollectionsheet').centerCollectionSheet(cellText);
}


function centerTotal(){
    jsdump("calculating the center Total");
    var centerSum = 0;
    var centerMiscSum = 0;
    /**assume max 500 groups in a center**/
    for (i = 0; i < 500; i++) {
        var groupAmtSumId = "group" + i + "amtsum";
        var groupMiscSumId = "group" + i + "miscsum";
        
        if (document.getElementById(groupAmtSumId) != null) {
            jsdump("entered group " + groupAmtSumId + "for calculating the group total");
            var grpSum = 0;
            var grpMiscSum = 0;
            //calculate the group sum (assume max 500 loans for members in a group)
            for (j = 0; j < 500; j++) {
                var loanAmountIdName = "group" + i + "memberloan" + j + "amt";
                var miscAmountIdName = "group" + i + "memberloan" + j + "misc";
                if (document.getElementById(loanAmountIdName) != null) {
                    alert(loanAmountIdName + ":" + Number(document.getElementById(loanAmountIdName).value));
                    grpSum = grpSum + Number(document.getElementById(loanAmountIdName).value);
                    grpMiscSum = grpMiscSum + Number(document.getElementById(miscAmountIdName).value);
                }
                else {
                    centerSum = centerSum + grpSum;
                    centerMiscSum = centerMiscSum + grpMiscSum;
                    document.getElementById(groupAmtSumId).value = grpSum.toFixed(2);
                    document.getElementById(groupMiscSumId).value = grpMiscSum.toFixed(2);
                    jsdump("calculated group sum for " + groupAmtSumId);
                    break;
                }
                
            }
        }
        else {
            document.getElementById("centerCollectionAmount").value = centerSum.toFixed(2);
            document.getElementById("centerMiscCollectionAmount").value = centerMiscSum.toFixed(2);
            jsdump("calculated sum for selected center");
            break;
        }
    }
}

function getdata(query){
    return baseXUtils.process(query);
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
    jsdump("setting up java dependencies");
    var basePath = getAppPath('flamingo');
    jsdump("basepath" + basePath);
    var classLoaderJarpath = basePath + "java/javaFirefoxExtensionUtils.jar";
    // Add the paths for all the other JAR files that  you will be using
    var myJarpath = basePath + "java/flamingoUtils-1.0-jar-with-dependencies.jar";
    jsdump("custom jar path" + myJarpath)
    var urlArray = []; // Build a regular JavaScript array (LiveConnect will auto-convert to a Java array)
    urlArray[0] = new java.net.URL(myJarpath);
    urlArray[1] = new java.net.URL(classLoaderJarpath);
    var cl = java.net.URLClassLoader.newInstance(urlArray);
    policyAdd(cl, urlArray);
    jsdump("changed classloader policies for enhanced permissions");
    
    
    
    //var aClass = java.lang.Class.forName('com.confluxtechnologies.mifos',true,cl);
    var authenticationUtilsClass = cl.loadClass("com.confluxtechnologies.mifos.AuthenticationUtils");
    authenticationUtils = authenticationUtilsClass.newInstance();
    jsdump("completed classLoading....AuthenticationUtils");
    
    var baseXUtilsClass = cl.loadClass("com.confluxtechnologies.mifos.BaseXUtils");
    baseXUtils = baseXUtilsClass.newInstance();
    jsdump("completed classLoading....BaseXUtils");
    
    jsdump("Trying to check if XMLDB exists, if not initialize for first use");
    var initStatus = baseXUtils.init();
    jsdump("Able to Initialized DB ? " + initStatus);
}




