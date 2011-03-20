
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
    setUpJavaDependencies();
    $('#todayLOAndCenters').populateTodaysLOAndCenters();
    /**set the color of sync button**/
    var condition = navigator.onLine ? "syncboxgreen" : "syncboxred";
    document.getElementById('syncButton').setAttribute("class", condition);
    
    /****save and sync actions**/
    alert("datta");
    $("#unsyncedSaveButton").click(function(){
        saveCenterCollectionSheet('unsynced', false, $('#unsyncedMeetingDate').val());
    });
    $("#unsyncedSyncButton").click(function(){
        alert("datta");
        saveCenterCollectionSheet('unsynced', true, $('#unsyncedMeetingDate').val());
    });
    
}

function onTreeClicked(event){
    var tree = document.getElementById("my-tree");
    var tbo = tree.treeBoxObject;
    
    var row = {}, col = {}, child = {};
    tbo.getCellAt(event.clientX, event.clientY, row, col, child);
    
    var cellText = tree.view.getCellText(row.value, col.value);
    $('#centercollectionsheet').centerCollectionSheet(cellText);
}

function getTodaysDate(){
    var d = new Date();
    var curr_date = d.getDate();
    var curr_month = d.getMonth();
    curr_month++;
    curr_month = curr_month > 9 ? curr_month : "0" + curr_month;
    var curr_year = d.getFullYear();
    var todayDate = curr_year + "-" + curr_month + "-" + curr_date;
    return todayDate;
}


function centerTotal(idPrefix){
    jsdump("calculating the center Total with idPrefix " + idPrefix);
    var centerSum = 0;
    var centerMiscSum = 0;
    /**assume max 500 groups in a center**/
    for (i = 0; i < 500; i++) {
        var groupAmtSumId = idPrefix + "group" + i + "amtsum";
        var groupMiscSumId = idPrefix + "group" + i + "miscsum";
        if (document.getElementById(groupAmtSumId) != null) {
            jsdump("entered group " + groupAmtSumId + "for calculating the group total");
            var grpSum = 0;
            var grpMiscSum = 0;
            //calculate the group sum (assume max 500 members in a group)
            for (j = 0; j < 500; j++) {
                //assume maximum 10 loans for a member
                for (k = 0; k < 10; k++) {
                    var loanAmountIdName = idPrefix + "group" + i + "member" + j + "loan" + k + "amt";
                    var miscAmountIdName = idPrefix + "group" + i + "member" + j + "loan" + k + "misc";
                    if (document.getElementById(loanAmountIdName) != null) {
                        //jsdump(loanAmountIdName + ":" + Number(document.getElementById(loanAmountIdName).value));
                        grpSum = grpSum + Number(document.getElementById(loanAmountIdName).value);
                        grpMiscSum = grpMiscSum + Number(document.getElementById(miscAmountIdName).value);
                    }
                    else {
                        break;
                    }
                }
                /**If a member was found**/
                if (document.getElementById(idPrefix + "group" + i + "member" + j + "loan" + 0 + "amt") != null) {
                    continue;
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
            document.getElementById(idPrefix + "centerCollectionAmount").value = centerSum.toFixed(2);
            document.getElementById(idPrefix + "centerMiscCollectionAmount").value = centerMiscSum.toFixed(2);
            jsdump("calculated sum for selected center");
            break;
        }
    }
}



function saveCenterCollectionSheet(idPrefix, performSync, meetingDate){
    jsdump("Parameters for saving collection sheet: idPrefix " + idPrefix + "performSync" + performSync + "meetingdate" + meetingDate);
    var syncedDate = getTodaysDate();
    var centerName = $("#" + idPrefix + "CenterName").val();
    var centerId = $("#" + idPrefix + "CenterId").val();
    /**Basic  json Structure**/
    var centerJSON = {
        name: centerName,
        centerId: centerId,
        Groups: {
            Group: []
        }
    }
    
    /**Alternate structure for syncing**/
    if (performSync) {
        centerJSON = {
            name: centerName,
            centerId: centerId,
            status: "synced",
            syncedDate: syncedDate,
            Groups: {
                Group: []
            }
        }
    }
    jsdump("started iterating over the groups for populating center JSON")
    for (i = 0; i < 500; i++) {
        var groupAmtSumId = idPrefix + "group" + i + "amtsum";
        var groupMiscSumId = idPrefix + "group" + i + "miscsum";
        if (document.getElementById(groupAmtSumId) != null) {
            jsdump("entered group " + groupAmtSumId + "for saving as XML");
            centerJSON.Groups.Group.push({
                name: document.getElementById(idPrefix + "group" + i + "name").value,
                groupId: i,
                Members: {
                    Member: []
                }
            });
            jsdump("Iterating through members in the group " + document.getElementById(idPrefix + "group" + i + "name").value);
            //iterate through members (assume max 500 members in a group)
            for (j = 0; j < 500; j++) {
                if (null == document.getElementById(idPrefix + "group" + i + "member" + j + "loan" + 0 + "name")) {
                    break;
                }
                var memberName = document.getElementById(idPrefix + "group" + i + "member" + j + "loan" + 0 + "name").value;
                var memberId = document.getElementById(idPrefix + "group" + i + "member" + j + "loan" + 0 + "memberId").value;
                
                /**Is this member present, then start creating XML**/
                if (document.getElementById(idPrefix + "group" + i + "member" + j + "loan" + 0 + "amt") != null) {
                    centerJSON.Groups.Group[i].Members.Member.push({
                        name: memberName,
                        memberId: memberId,
                        LoanAccounts: {
                            LoanAccount: []
                        }
                    });
                }
                jsdump("Iterating thorugh loans for the member" + memberName);
                //assume maximum 10 loans for a member
                for (k = 0; k < 10; k++) {
                    var loanAmountIdName = idPrefix + "group" + i + "member" + j + "loan" + k + "amt";
                    var miscAmountIdName = idPrefix + "group" + i + "member" + j + "loan" + k + "misc";
                    if (document.getElementById(loanAmountIdName) != null) {
                        var accountId = document.getElementById(idPrefix + "group" + i + "member" + j + "loan" + k + "accountId").value;
                        var disbursedAmount = document.getElementById(idPrefix + "group" + i + "member" + j + "loan" + k + "disbursedAmount").value;
                        var outstandingAmount = document.getElementById(idPrefix + "group" + i + "member" + j + "loan" + k + "memberId").value;
                        var interestDemand = document.getElementById(idPrefix + "group" + i + "member" + j + "loan" + k + "interestDemand").value;
                        var principalDemand = document.getElementById(idPrefix + "group" + i + "member" + j + "loan" + k + "principalDemand").value;
                        var amountRepaid = document.getElementById(loanAmountIdName).value;
                        var miscCollection = document.getElementById(miscAmountIdName).value;
                        centerJSON.Groups.Group[i].Members.Member[j].LoanAccounts.LoanAccount.push({
                            accountId: accountId,
                            disbursedAmount: disbursedAmount,
                            outStandingAmount: outstandingAmount,
                            interestDemand: interestDemand,
                            principalDemand: principalDemand,
                            amountRepaid: amountRepaid,
                            miscCollection: miscCollection
                        });
                    }
                    else {
                        jsdump("loan break");
                        break;
                    }
                }
            }
        }
        else {
            jsdump("all groups done");
            break;
        }
    }
    jsdump("finished creating a centre JSON object");
    var options = {
        formatOutput: true,
        rootTagName: "Center",
        nodes: ["name", "centerId", "status", "syncedDate", "Groups.Group.groupId", "Groups.Group.name", "Groups.Group.Members.Member.name", "Groups.Group.Members.Member.memberId", "Groups.Group.Members.Member.LoanAccounts.LoanAccount.accountId", "Groups.Group.Members.Member.LoanAccounts.LoanAccount.disbursedAmount", "Groups.Group.Members.Member.LoanAccounts.LoanAccount.outStandingAmount", "Groups.Group.Members.Member.LoanAccounts.LoanAccount.interestDemand", "Groups.Group.Members.Member.LoanAccounts.LoanAccount.principalDemand", "Groups.Group.Members.Member.LoanAccounts.LoanAccount.amountRepaid", "Groups.Group.Members.Member.LoanAccounts.LoanAccount.miscCollection"]
    };
    
    var centerXML = $.json2xml(centerJSON, options);
    jsdump(centerXML);
    
    /***for sync upload to server**/
    if (performSync) {
        alert("Unable to upload to server....please save for now,try syncing again later");
    }
    
    //save the result
    var query = "for $center in //CollectionSheets/CollectionSheet/LoanOfficers/LoanOfficer/Centers/Center where $center/centerId =" +
    "'" +
    centerId +
    "'" +
    "and $center/../../../../date='" +
    meetingDate +
    "' " +
    "return ( delete node $center, insert node" +
    centerXML +
    "as first into $center/..)";
    
    //execute the query
    updateXMLDB(query);
    
}


function deleteSyncedCenter(centerId, meetingDate){


    var query = "for $center in //CollectionSheets/CollectionSheet/LoanOfficers/LoanOfficer/Centers/Center " +
    "where $center/centerId =" +
    "'" +
    centerId +
    "'" +
    "and $center/../../../../date='" +
    meetingDate +
    "'return ( " +
    "   delete node $center" +
    ")";
    
    //execute the query
    updateXMLDB(query);
}

function getdata(query){
    return baseXUtils.process(query);
}

function updateXMLDB(query){
    return baseXUtils.process(query);
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




