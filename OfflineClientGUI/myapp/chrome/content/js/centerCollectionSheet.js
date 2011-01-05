(function( $ ){
  $.fn.centerCollectionSheet = function(centerid) {

    var richchildren = $(this).get(0);
	
	
	while(richchildren.hasChildNodes()){
		richchildren.removeChild(richchildren.firstChild);
	}
	
	//var synchedData = '{"collectionsheet":{"center":[{"name":"C1","group":[{"name":"G11","member":[{"name":"mem111"},{"name":"mem112"}]},{"name":"G12","member":[{"name":"mem121"},{"name":"mem122"}]}]},{"name":"C2","group":[{"name":"G21","member":[{"name":"mem211"},{"name":"mem212"}]},{"name":"G22","member":[{"name":"mem221"},{"name":"mem222"}]}]}]}}';
	//var obj = jQuery.parseJSON(synchedData);

	var obj = jQuery.parseJSON(getdata().toString());
	
	
	var row = document.createElement("row");
		row.setAttribute("flex","1");
		var labelmn = document.createElement("label");
			labelmn.setAttribute("value","Client Name");
			row.appendChild(labelmn);
		var labelmn = document.createElement("label");
			labelmn.setAttribute("value","Product Name");
			row.appendChild(labelmn);	
		var label = document.createElement("label");
			label.setAttribute("value","Disb amt");
			row.appendChild(label);											
		var label = document.createElement("label");
			label.setAttribute("value","Inst #");
			row.appendChild(label);				
		var label = document.createElement("label");
			label.setAttribute("value","Prn Amt");
			row.appendChild(label);
		var label = document.createElement("label");
			label.setAttribute("value","Int Amt");
			row.appendChild(label);
		var label = document.createElement("label");
			label.setAttribute("value","Prn Amt Paid");
			row.appendChild(label);
		var label = document.createElement("label");
			label.setAttribute("value","Int Amt Paid");
			row.appendChild(label);			
		var label = document.createElement("label");
			label.setAttribute("value","A/C Collections");
			row.appendChild(label);						
		var label = document.createElement("label");
			label.setAttribute("value","Attn");
			row.appendChild(label);			
		
		richchildren.appendChild(row);	

	$.each(obj.centers[0].groups, function(i, groupvalues) {           //looping group
			
			var row = document.createElement("row");
			row.setAttribute("flex","1");
			var hbox = document.createElement("hbox");
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

				$.each(groupvalues.members, function(j, membervalues) {
						var memname = membervalues.fname + " " +  membervalues.lname;
							$.each(membervalues.loandetails, function(k, loanvalues) {
											var row = document.createElement("row");
												row.setAttribute("flex","1");
												row.setAttribute("id",memname);  // Need use member id
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
												textbox.setAttribute("value",loanvalues.prdue);
												textbox.setAttribute("width","60");
												textbox.setAttribute("id","xxx");  //need o decide
												row.appendChild(textbox);								
											var textbox = document.createElement("textbox");
												textbox.setAttribute("value",loanvalues.indue);
												textbox.setAttribute("width","60");
												textbox.setAttribute("id","xxx");  //need o decide
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
											menuitem.setAttribute("label","LP");
											menupopup.appendChild(menuitem);
											menuitem.setAttribute("label","L");
											menupopup.appendChild(menuitem);
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
	});	
 	return this;
  };
})( jQuery );
