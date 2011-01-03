		function init () {
		
		$('#todaygetdata').toggle('showOrHide ');
		
		
		};


		function policyAdd (loader, givenUrls) {
			try {
				var str = 'edu.mit.simile.javaFirefoxExtensionUtils.URLSetPolicy';
				var policyClass = java.lang.Class.forName(str,true,loader);
				var policy = policyClass.newInstance();
				policy.setOuterPolicy(java.security.Policy.getPolicy());
				java.security.Policy.setPolicy(policy);
				policy.addPermission(new java.security.AllPermission());
				
					policy.addURL(givenUrls[0]);
					policy.addURL(givenUrls[1]);
				
			}catch(e) {
			   alert(e+'::'+e.lineNumber);
			}
		};
		
		function getAppPath(appName) {
			var chromeRegistry = Components
					.classes["@mozilla.org/chrome/chrome-registry;1"]
					.getService(Components.interfaces.nsIChromeRegistry);

			var uri =Components.classes["@mozilla.org/network/standard-url;1"]
							.createInstance(Components.interfaces.nsIURI);

			uri.spec = "chrome://" + appName + "/content/";

			var path = chromeRegistry.convertChromeURL(uri);
			if (typeof(path) == "object") {
				path = path.spec;
			}

			path = path.substring(0, path.indexOf("/chrome/") + 1);

			return path;
		};
