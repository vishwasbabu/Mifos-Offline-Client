(function( $ ){
  $.fn.loanOffCenter = function() {

    var pvbox = $(this).get(0);
  	
	var loCentersData = '{"loanofficers":[{"name":"Loan Offcer 1","centers":[{"name":"Center11" , "id":"100011000"}, {"name":"Center12" , "id":"10991000"}]} , {"name":"Loan Officer 2","centers":[{"name":"Center21" , "id":"200011000"}]}]}';
	var obj = jQuery.parseJSON(loCentersData);
	
	$.each(obj.loanofficers, function(i, loanofficers) {           //looping LO

			var box = document.createElement("box");
			var label = document.createElement("label");
			label.setAttribute("value",loanofficers.name);
			box.appendChild(label);
			pvbox.appendChild(box);
			var vbox = document.createElement("vbox");
									
				$.each(loanofficers.centers, function(j, center) {           //looping Center
					var label = document.createElement("label");
					label.setAttribute("value",center.name);
					label.setAttribute("onclick","$('#centercollectionsheet').centerCollectionSheet('"+ center.id+" ');");
					vbox.appendChild(label);
					
				});		
			
			pvbox.appendChild(vbox);
		
	});	
	
 	return this;
  };
})( jQuery );
