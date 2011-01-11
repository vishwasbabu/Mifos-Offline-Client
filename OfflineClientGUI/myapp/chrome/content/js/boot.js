/*
 * This is the "bootstrap" code that runs when Mifos Offline first starts up.  It
 * checks the password manager to see if there's a login that we can auto-login
 * with, and if not, it presents the user with a page where they can enter their
 * login info.
 */

 function getMainWindow() {
	var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
	                   .getInterface(Components.interfaces.nsIWebNavigation)
	                   .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
	                   .rootTreeItem
	                   .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
	                   .getInterface(Components.interfaces.nsIDOMWindow);
	return mainWindow;
}
 
 
function manualFirstLogin() {
getMainWindow().document.getElementById("mainbox").collapsed = false;
getMainWindow().document.getElementById("loginhtml").collapsed = true;
/*	var username = getBrowser().contentDocument.getElementById('username').value;
	var password = getBrowser().contentDocument.getElementById('password').value;
	var service = getBrowser().contentDocument.getElementById('service').value;
	var save = getBrowser().contentDocument.getElementById('saveCredentials').checked;

	Statusbar.message("Authenticating");
	getBrowser().contentDocument.getElementById('loginThrobber').style.display = 'inline';
	getBrowser().contentDocument.getElementById('username').disabled = true;
	getBrowser().contentDocument.getElementById('password').disabled = true;
	getBrowser().contentDocument.getElementById('loginOkButton').disabled = true;

	var token = Account.login(username,password,service)
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
				'username':username,
				'password':password,
				'service':service,
				'token':accessToken,
				'tokenSecret':accessTokenSecret
			});
		}
		var interval = getIntPref('buzzbird.update.interval',180000);
		Global.updateTimer = getMainWindow().setInterval( function(that) { that.Fetch.go(); }, interval, getMainWindow());
		
		alert("qq");
		
		getBrowser().loadURI("chrome://buzzbird/content/main.html",null,"UTF-8");
		alert("qq2");
		
	} else {
		Statusbar.message("");
		getBrowser().contentDocument.getElementById('badAuth').style.display = 'inline';
		getBrowser().contentDocument.getElementById('loginThrobber').style.display = 'none';
		getBrowser().contentDocument.getElementById('username').disabled = false;
		getBrowser().contentDocument.getElementById('password').disabled = false;
		getBrowser().contentDocument.getElementById('loginOkButton').disabled = false;
		getBrowser().contentDocument.getElementById('password').focus(); 
	}*/
}

