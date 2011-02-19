(function( $ ){
  $.fn.unsynedloanOffCenter = function() {
  
  	var d = new Date();
	var curr_date = d.getDate();
	var curr_month = d.getMonth();
	curr_month++;
	curr_month = curr_month > 9 ? curr_month : "0" + curr_month;
	var curr_year = d.getFullYear();
	var todayDate = curr_year + "-" + curr_month + "-" + curr_date;
	
	var rows = $(this).get(0);
	var qr = '<unsynceddates> { let $allItems := /xmldb/centers/center[meetingdate < "'+ todayDate + '" ] for $date in distinct-values($allItems/meetingdate) return <usdate value="{$date}"><locenter>{ for $d in distinct-values($allItems/cfe/@empid)  let $items := /xmldb/centers/center[cfe/@empid = $d and meetingdate/text() = $date] order by $d  return if (exists($items)) then (  <cfe><lo><loid>{$d}</loid><loname>{distinct-values($items/cfe/text())}</loname ></lo> <centers>{ 	for  $i  in $items order by $i return <center><cid>{$i/@id}</cid><cname>{$i/cname/text()} </cname> </center> } </centers> </cfe>) else() } </locenter></usdate> }</unsynceddates>'
	var nobj = jQuery.parseJSON(getdata(qr).toString());
	
	$.each(nobj.unsynceddates, function(h, unsynceddates) {  
	
		var drow = document.createElement("row");
			drow.setAttribute("class","todaylo");
			
			var dlabel = document.createElement("label");
			
			dlabel.setAttribute("value",unsynceddates['@value']);
			drow.appendChild(dlabel);
			
			rows.appendChild(drow);	
			var drows = document.createElement("rows");
			
	
		$.each(unsynceddates.locenter, function(i, loanofficers) {           //looping LO
			
			var row = document.createElement("row");
			row.setAttribute("class","todaylo");
			
			var label = document.createElement("label");
			label.setAttribute("value",loanofficers.lo.loname);
			row.appendChild(label);
			var box = document.createElement("box");
			box.setAttribute("align","center");
			
			var rowsfeid = 'id' + Math.round( Math.random() * 10000000 );
			
			var image = document.createElement("image");
			image.setAttribute("onclick","$('#" + rowsfeid + "').toggle('showOrHide');");
			image.setAttribute("src","chrome://myapp/skin/images/extra/icon.collapse.png");

			box.appendChild(image);
			row.appendChild(box);
			drows.appendChild(row);	
			
			var lrows = document.createElement("rows");
			lrows.setAttribute("id",rowsfeid);
	
				$.each(loanofficers.centers, function(j, center) {           //looping Center
				
					var row = document.createElement("row");
					row.setAttribute("class","todayCenter");

					var label = document.createElement("label");
					label.setAttribute("value",center.cname);
					label.setAttribute("class","todayCenter");
					label.setAttribute("onclick","$('#unsyncedcentercollectionsheet').centerCollectionSheet('"+ center.cid["@id"] + "');");
					row.appendChild(label);
					lrows.appendChild(row);
				});		
			
			drows.appendChild(lrows);
		
		});	
		
			rows.appendChild(drows);
		
	});	
	
 	return this;
  };
})( jQuery );
