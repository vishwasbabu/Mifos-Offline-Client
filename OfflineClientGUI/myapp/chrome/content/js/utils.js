		function init () {
		
		
		$('#todaygetdata').toggle('showOrHide ');
		$('#centercollectionsheet').centerCollectionSheet("0000100001");
		$('#todaylocenter').loanOffCenter();

		var condition = navigator.onLine ? "syncboxgreen" : "syncboxred";
		document.getElementById('syncbutton').setAttribute("class" ,condition);
		
		};

		function recalc(){
			alert("ccc");
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
		
		
		function onTreeClicked(event){
		  var tree = document.getElementById("my-tree");
		  var tbo = tree.treeBoxObject;

		  var row = { }, col = { }, child = { };
		  tbo.getCellAt(event.clientX, event.clientY, row, col, child);

		  var cellText = tree.view.getCellText(row.value, col.value);
		  $('#centercollectionsheet').centerCollectionSheet(cellText);
		}
		
	function getdata(query){
			//alert("done");
		var basePath = getAppPath('myapp');
		//alert(basePath);
		var classLoaderJarpath = basePath + "java/javaFirefoxExtensionUtils.jar";
		// Add the paths for all the other JAR files that  you will be using
		var myJarpath = basePath + "java/XMLDBConnector-1.0-jar-with-dependencies.jar"; 
		//alert("custom jar path" + myJarpath)
		var urlArray = []; // Build a regular JavaScript array (LiveConnect will auto-convert to a Java array)
		urlArray[0] = new java.net.URL(myJarpath);
		urlArray[1] = new java.net.URL(classLoaderJarpath);
		var cl = java.net.URLClassLoader.newInstance(urlArray);
		policyAdd(cl, urlArray);
		//alert("came to end");
		//alert(cl);
		
		/**Code execution**/
		//var aClass = java.lang.Class.forName('org.conflux.mifos.XMLDBQuery',true,cl);
		var aClass = cl.loadClass("org.conflux.mifos.XMLDBQuery");
		//alert(aClass);
		var inst = aClass.newInstance();
		//alert("came here too??????");
		//call this method for pointing to a (baseX) XML Store
		inst.setUpObject("xmldb:basex://localhost:1984/OfflineStore");
		//call this method for executing a query on the selected XML store
		return inst.executeXQuery(query);
		  
		}
