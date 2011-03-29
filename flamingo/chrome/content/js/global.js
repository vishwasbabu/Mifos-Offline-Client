/**java Objects connected using Live Connect**/
var authenticationUtils;
var baseXUtils;
var mifosURL;

var Ctx = {
    user: "",
    password: "",
    token: "",
    branchId: "",
};

var MifosServer = {
    login: function(username, password){
        var req = new XMLHttpRequest();
        var postBody = {
            PersonnelDetails: {
                userName: username,
                password: password
            }
        };
        jsdump("setting up authentication post parameters");
        req.open('POST', mifosURL + "/authenticate", false);
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
                authenticationUtils.addUser(username, password, mifosURL);
                setContext(username, password, response.PersonnelDetails.authenticationKey, response.PersonnelDetails.officeId);
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
    },
    getCollectionSheet: function(date, personnelId){
        if (!checkLogin()) {
            return false;
        }
        var req = new XMLHttpRequest();
        jsdump("getting all loan Officers in the branch");
        req.open('GET', mifosURL + "/branchid/" + Ctx.branchId + "/date/" + date + "/loanofficer/" + personnelId + "/collectionsheet", false);
        req.setRequestHeader('Authentication-Key', Ctx.token);
        req.setRequestHeader('Accept', 'application/xml');
        
        
        req.send();
        jsdump("Request status" + req.status);
        if (req.status == 200 && req.responseText != null) {
            //jsdump("response data" + req.responseText);
            /*****/
            var query = "boolean(//CollectionSheet[date='" + date + "'])";
            
            var xmlObject = (new DOMParser()).parseFromString(req.responseText, "application/xml");
            
            if (getStringData(query) == "true") {
                var tempXMLObj = xmlObject.getElementsByTagName("LoanOfficer")[0];
                var xmlString = (new XMLSerializer()).serializeToString(tempXMLObj);
                
                var updateQuery = "for $loanOfficers in //CollectionSheet[date='" + date + "']/LoanOfficers " +
                "return (insert node " +
                xmlString +
                " as first into $loanOfficers)";
                updateXMLDB(updateQuery);
            }
            else {
                var tempXMLObj = xmlObject.getElementsByTagName("CollectionSheet")[0];
                var xmlString = (new XMLSerializer()).serializeToString(tempXMLObj);
                
                var updateQuery = "for $collectionSheets in //CollectionSheets " +
                "return (insert node " +
                xmlString +
                " as first into $collectionSheets)";
                updateXMLDB(updateQuery);
            }
            return true;
        }
        else {
            jsdump("Unable to fetch Collection sheet for this loan officer");
            return false;
        }
        
        return true;
    },
    getLoanOfficers: function(){
        if (!checkLogin()) {
            return false;
        }
        
        /*****/
        var req = new XMLHttpRequest();
        jsdump("getting all loan Officers in the branch");
        req.open('GET', mifosURL + "/branchid/" + Ctx.branchId + "/LoanOfficers", false);
        req.setRequestHeader('Authentication-Key', Ctx.token);
        req.setRequestHeader('Accept', 'application/json');
        
        
        req.send();
        jsdump("Request status" + req.status + "Response" + req.responseText);
        if (req.status == 200 && req.responseText != null) {
            jsdump("response data" + req.responseText);
            var response = JSON.parse(req.responseText);
            populateDropDowns("todayLoanOfficerDropDown", response);
            populateDropDowns("futureLoanOfficerDropDown", response);
            return true;
        }
        else {
            jsdump("Unable to fetch Loan Officers for this Branch from the server");
            return false;
        }
    }
}


function setContext(username, password, token, officeId){
    jsdump("setting Context as " + username + "token: " + token + "branchId: " + officeId)
    Ctx.user = username;
    Ctx.password = password;
    Ctx.token = token;
    Ctx.branchId = officeId;
}

function checkLogin(){
    jsdump("check if this user has logged in");
    alert("token" + Ctx.token + "mifosURL" + mifosURL);
    if (Ctx.token == "") {
        alert("token was empty");
        var loginSuccessfull = MifosServer.login(Ctx.user, Ctx.password);
        if (!loginSuccessfull) {
            alert("Unable to authenticate this user on the Server...have you changed your password recently?")
            return false;
        }
    }
    return true;
}

function populateDropDowns(dropDownId, response){
    var menuList = document.getElementById(dropDownId);
    var mp = document.createElement("menupopup");
    jsdump("datta" + response.Loanofficers);
    $.each(response.LoanOfficers.LoanOfficer, function(j, loanOfficer){
        var menuItem = document.createElement("menuitem");
        menuItem.setAttribute("label", loanOfficer.name);
        menuItem.setAttribute("value", loanOfficer.personnelId);
        mp.appendChild(menuItem);
    })
    menuList.appendChild(mp);
}
