(function( $ ){
  $.fn.loanOffCenter = function() {

    var rows = $(this).get(0);
	
	var d = new Date();
	var curr_date = d.getDate();
	var curr_month = d.getMonth();
	curr_month++;
	curr_month = curr_month > 9 ? curr_month : "0" + curr_month;
	var curr_year = d.getFullYear();
	var todayDate = curr_year + "-" + curr_month + "-" + curr_date;


    var qr =  '<locenter>{for $d in distinct-values(/xmldb/centers/center/cfe/@empid) let $items := /xmldb/centers/center[cfe/@empid = $d and  meetingdate/text() = "' + todayDate + '"] order by $d  return if (exists($items)) then (  <cfe><lo><loid>{$d}</loid><loname>{distinct-values($items/cfe/text())}</loname ></lo><centers>{ for  $i  in $items order by $i return <center><cid>{$i/@id}</cid><cname>{$i/cname/text()} </cname></center> }</centers></cfe> ) else () } </locenter> '	
 	var nobj = jQuery.parseJSON(getdata(qr).toString());
 	$.each(nobj.locenter, function(i, loanofficers) {           //looping LO
			
			var row = document.createElement("row");
			row.setAttribute("class","todaylo");
			
			var label = document.createElement("label");
			label.setAttribute("value",loanofficers.lo.loname);
			row.appendChild(label);
			var box = document.createElement("box");
			box.setAttribute("align","center");
			
			
			var image = document.createElement("image");
			image.setAttribute("onclick","$('#" + loanofficers.lo.loid + "').toggle('showOrHide');");
			image.setAttribute("src","chrome://myapp/skin/images/extra/icon.collapse.png");

			box.appendChild(image);
			row.appendChild(box);
			rows.appendChild(row);	
			
			var lrows = document.createElement("rows");
			lrows.setAttribute("id",loanofficers.lo.loid);
	
				$.each(loanofficers.centers, function(j, center) {           //looping Center
				
					var row = document.createElement("row");
					row.setAttribute("class","todayCenter");

					var label = document.createElement("label");
					label.setAttribute("value",center.cname);
					label.setAttribute("class","todayCenter");
					label.setAttribute("onclick","$('#centercollectionsheet').centerCollectionSheet('"+ center.cid["@id"] + "');");
					row.appendChild(label);
					lrows.appendChild(row);
				});		
			
			rows.appendChild(lrows);
		
	});	
	
 	return this;
  };
})( jQuery );
