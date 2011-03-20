(function( $ ){
  $.fn.myPlugin = function() {

 //alert($(this).get(0)); 

 var treechildren = $(this).get(0);
 
//var treechildren = document.getElementById("firstchild");

var synchedData = '{"collectionsheet":{"center":[{"name":"C1","group":[{"name":"G11","member":[{"name":"mem111"},{"name":"mem112"}]},{"name":"G12","member":[{"name":"mem121"},{"name":"mem122"}]}]},{"name":"C2","group":[{"name":"G21","member":[{"name":"mem211"},{"name":"mem212"}]},{"name":"G22","member":[{"name":"mem221"},{"name":"mem222"}]}]}]}}';
var obj = jQuery.parseJSON(synchedData);

$.each(obj.LoanOfficer.Centers, function(i, centervalues) {           //looping group
		
		var treeitem = document.createElement("treeitem");
		treeitem.setAttribute("container","true");
		treeitem.setAttribute("open","true");
		
		
		var treerow = document.createElement("treerow");
		var treecell = document.createElement("treecell");
		treecell.setAttribute("label",centervalues.name);
		treerow.appendChild(treecell);
		treeitem.appendChild(treerow);
		
		var centertreechildren = document.createElement("treechildren");
		jsdump( 'Center Name : ' + centervalues.name);
	
	$.each(centervalues.Groups, function(j, groupvalues) {
			jsdump('Group Name: ' + groupvalues.name);
			var grouptreeitem = document.createElement("treeitem");
			grouptreeitem.setAttribute("container","true");
			grouptreeitem.setAttribute("open","true");		
			var treerow = document.createElement("treerow");
			var treecell = document.createElement("treecell");
			treecell.setAttribute("label",groupvalues.name);
			treerow.appendChild(treecell);
			grouptreeitem.appendChild(treerow);
			
			
			var grouptreechildren = document.createElement("treechildren");
				
			$.each(groupvalues.Members, function(j, membervalues) {
					var membertreeitem = document.createElement("treeitem");
					membertreeitem.setAttribute("container","true");
					membertreeitem.setAttribute("open","true");		
					var treerow = document.createElement("treerow");
					
					var treecell = document.createElement("treecell");
					treecell.setAttribute("label",membervalues.name);
					treecell.setAttribute("editable","false");
					treerow.appendChild(treecell);
					
					var treecell = document.createElement("treecell");
					treecell.setAttribute("label",membervalues.name);
					treecell.setAttribute("editable","false");
					treerow.appendChild(treecell);
					
					var treecell = document.createElement("treecell");
					treecell.setAttribute("label",membervalues.name);
					treecell.setAttribute("editable","false");
					treerow.appendChild(treecell);
					
					var treecell = document.createElement("treecell");
					treecell.setAttribute("label","00.0");
					treerow.appendChild(treecell);
					
					var treecell = document.createElement("treecell");
					treecell.setAttribute("label","230.0");
					treerow.appendChild(treecell);
					
					var treecell = document.createElement("treecell");
					treecell.setAttribute("label","P");
					treerow.appendChild(treecell);
					
					
					var treecell = document.createElement("treecell");
					treecell.setAttribute("value","true");
					treecell.setAttribute("editable","true");
					treecell.setAttribute("onclick","alert('bbb');");
					
					treerow.appendChild(treecell);
					
					
					
					membertreeitem.appendChild(treerow);
					
					grouptreechildren.appendChild(membertreeitem);
					
					});	

			grouptreeitem.appendChild(grouptreechildren);
			centertreechildren.appendChild(grouptreeitem);	
			treeitem.appendChild(centertreechildren);
	});	
		treechildren.appendChild(treeitem);
});	

 
	return this;
  };
})( jQuery );
