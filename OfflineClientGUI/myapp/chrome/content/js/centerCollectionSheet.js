(function( $ ){
  $.fn.centerCollectionSheet = function(centerid) {

    var richchildren = $(this).get(0);
	var centertotal = document.getElementById("centercollectionsheettotal");

	while(richchildren.hasChildNodes()){
		richchildren.removeChild(richchildren.firstChild);
	}
	
	while(centertotal.hasChildNodes()){
		centertotal.removeChild(centertotal.firstChild);
	}
	
	//var synchedData = '{"collectionsheet":{"center":[{"name":"C1","group":[{"name":"G11","member":[{"name":"mem111"},{"name":"mem112"}]},{"name":"G12","member":[{"name":"mem121"},{"name":"mem122"}]}]},{"name":"C2","group":[{"name":"G21","member":[{"name":"mem211"},{"name":"mem212"}]},{"name":"G22","member":[{"name":"mem221"},{"name":"mem222"}]}]}]}}';
	//var obj = jQuery.parseJSON(synchedData);

	var loadbox = document.createElement("box");
		loadbox.setAttribute("class","loadbox");
				richchildren.appendChild(loadbox);	
		
	var obj = jQuery.parseJSON(getdata('//xmldb/centers/center[@id="' + centerid +'"]').toString());

	while(richchildren.hasChildNodes()){
		richchildren.removeChild(richchildren.firstChild);
	}	
	
	
	
	var centerdisbsum = 0;
	var centerprnsum = 0;
	var centerintsum = 0;
	
	// Center Details
	
	document.getElementById("centername").value = obj.center.cname;
	
	
	

	$.each(obj.center.groups, function(i, groupvalues) {           //looping group
			
			var row = document.createElement("row");
			row.setAttribute("flex","1");
			var hbox = document.createElement("hbox");
			hbox.setAttribute("class","todaygrouphd");
			hbox.setAttribute("align","center");
			var image = document.createElement("image");
			image.setAttribute("onclick","$('#" + groupvalues.name + "').toggle('showOrHide ');");
			image.setAttribute("src","chrome://myapp/skin/images/extra/icon.collapse.png");
			var label = document.createElement("label");
			label.setAttribute("value",groupvalues.name);
			
			hbox.appendChild(image);
			hbox.appendChild(label);
			row.appendChild(hbox);
			richchildren.appendChild(row);	
			
			var rows = document.createElement("rows");
			rows.setAttribute("id",groupvalues.name);  //need to use groupid otherwise duplicate prblem
			
			var grpdisbsum = 0;
			var grpprnsum = 0;
			var grpintsum = 0;
			
			
				$.each(groupvalues.members, function(j, membervalues) {
						var memname = membervalues.fname + " " +  membervalues.lname;
							$.each(membervalues.loandetails, function(k, loanvalues) {
							
											grpdisbsum +=  Number(loanvalues.disbAmount);
											grpprnsum +=  Number(loanvalues.prdue);
											grpintsum +=  Number(loanvalues.indue);
											
											centerdisbsum +=  Number(loanvalues.disbAmount);
											centerprnsum +=  Number(loanvalues.prdue);
											centerintsum +=  Number(loanvalues.indue);
											
												var row = document.createElement("row");
												row.setAttribute("flex","1");
												row.setAttribute("id",memname);  // Need use member id
												row.setAttribute("class","todayrow");
												row.setAttribute("align","center");
											var labelmn = document.createElement("label");
												labelmn.setAttribute("value",memname);
												row.appendChild(labelmn);
											var label = document.createElement("label");
												label.setAttribute("value",loanvalues.productname);
												row.appendChild(label);											
											var label = document.createElement("label");
												label.setAttribute("value",loanvalues.disbAmount);
												row.appendChild(label);											
											var label = document.createElement("label");	
												label.setAttribute("value","13");
												row.appendChild(label);		
											var label = document.createElement("label");	
												label.setAttribute("value",loanvalues.prdue);
												row.appendChild(label);
											var label = document.createElement("label");	
												label.setAttribute("value",loanvalues.indue);
												row.appendChild(label);								
											var textbox = document.createElement("textbox");
												textbox.setAttribute("value",Number(loanvalues.prdue) + Number(loanvalues.indue));
												textbox.setAttribute("width","60");
												textbox.setAttribute("id","prdue");  //need o decide
												row.appendChild(textbox);								
											var textbox = document.createElement("textbox");
												textbox.setAttribute("value","0.0");
												textbox.setAttribute("width","60");
												textbox.setAttribute("id","xxx");  //need o decide
												row.appendChild(textbox);
											
											var menulist = document.createElement("menulist");
											menulist.setAttribute("label","Attn");
											var menupopup = document.createElement("menupopup");
											var menuitem = document.createElement("menuitem");
											menuitem.setAttribute("label","A");
											menupopup.appendChild(menuitem);
											var menuitem = document.createElement("menuitem");
											menuitem.setAttribute("label","LP");
											menupopup.appendChild(menuitem);
											var menuitem = document.createElement("menuitem");
											menuitem.setAttribute("label","L");
											menupopup.appendChild(menuitem);
											var menuitem = document.createElement("menuitem");
											menuitem.setAttribute("label","P");
											menuitem.setAttribute("selected","true");
											menupopup.appendChild(menuitem);
											menulist.appendChild(menupopup);
											row.appendChild(menulist);	
											rows.appendChild(row);
											memname = "";
									});	
									
				});	

				richchildren.appendChild(rows);	
			
				var gtrows = document.createElement("rows");
				gtrows.setAttribute("class","todaygrouptotal");
				
				var grouprow = document.createElement("row");
							grouprow.setAttribute("flex","1");
								grouprow.setAttribute("id","xxx");  // Need use member id
								grouprow.setAttribute("align","center");
							var labelmn = document.createElement("label");
								labelmn.setAttribute("value","");
								grouprow.appendChild(labelmn);
							var labelmn = document.createElement("label");
								labelmn.setAttribute("value","Group Sum");
								grouprow.appendChild(labelmn);
							var labelmn = document.createElement("label");
								labelmn.setAttribute("value",grpdisbsum);
								grouprow.appendChild(labelmn);														
							var labelmn = document.createElement("label");
								labelmn.setAttribute("value","");
								grouprow.appendChild(labelmn);														
							var labelmn = document.createElement("label");
								labelmn.setAttribute("value",grpprnsum);
								grouprow.appendChild(labelmn);														
							var labelmn = document.createElement("label");
								labelmn.setAttribute("value",grpintsum);
								grouprow.appendChild(labelmn);														
							var textbox = document.createElement("textbox");
								textbox.setAttribute("value","0.0");
								textbox.setAttribute("width","60");
								textbox.setAttribute("id","grptotaldisb");  //need o decide
								grouprow.appendChild(textbox);
							var textbox = document.createElement("textbox");
								textbox.setAttribute("value","0.0");
								textbox.setAttribute("width","60");
								textbox.setAttribute("id","xxx");  //need o decide
								grouprow.appendChild(textbox);
							var labelmn = document.createElement("label");
								labelmn.setAttribute("value","");
								grouprow.appendChild(labelmn);														
				gtrows.appendChild(grouprow);
				richchildren.appendChild(gtrows);	
								
								
	});	
	

		richchildren.appendChild(document.createElement("separator"));	
		richchildren.appendChild(document.createElement("separator"));	
				
		var centerrow = document.createElement("row");
					centerrow.setAttribute("flex","1");
					centerrow.setAttribute("id","xxx");  // Need use member id
					centerrow.setAttribute("align","center");
				var labelmn = document.createElement("label");
					labelmn.setAttribute("value","Center Sum");
					centerrow.appendChild(labelmn);
				var labelmn = document.createElement("label");
					labelmn.setAttribute("value","");
					centerrow.appendChild(labelmn);
				var labelmn = document.createElement("label");
					labelmn.setAttribute("value",centerdisbsum);
					centerrow.appendChild(labelmn);														
				var labelmn = document.createElement("label");
					labelmn.setAttribute("value","");
					centerrow.appendChild(labelmn);														
				var labelmn = document.createElement("label");
					labelmn.setAttribute("value",centerprnsum);
					centerrow.appendChild(labelmn);														
				var labelmn = document.createElement("label");
					labelmn.setAttribute("value",centerintsum);
					centerrow.appendChild(labelmn);														
				var textbox = document.createElement("textbox");
					textbox.setAttribute("value","");
					textbox.setAttribute("width","60");
					textbox.setAttribute("id","xxx");  //need o decide
					centerrow.appendChild(textbox);
				var textbox = document.createElement("textbox");
					textbox.setAttribute("value","");
					textbox.setAttribute("width","60");
					textbox.setAttribute("id","xxx");  //need o decide
					centerrow.appendChild(textbox);
				var labelmn = document.createElement("label");
					labelmn.setAttribute("value","");
					centerrow.appendChild(labelmn);														
					
				centertotal.appendChild(centerrow);	
 	return this;
  };
})( jQuery );
