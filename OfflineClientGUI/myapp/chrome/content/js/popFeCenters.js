(function( $ ){
  $.fn.loanOffCenter = function() {

    var rows = $(this).get(0);

	var loCentersData = '{"loanofficers":[{"name":"Loan Offcer 1","empid":"1","centers":[{"name":"Center11" , "id":"100011000"}, {"name":"Center12" , "id":"10991000"}]} , {"name":"Loan Officer 2","empid":"2","centers":[{"name":"Center21" , "id":"200011000"}]}]}';
	var obj = jQuery.parseJSON(loCentersData);
   // var qr = '<locenter>{for $d in distinct-values(/xmldb/centers/center/cfe/@empid) let $items := /xmldb/centers/center[cfe/@empid = $d] order by $d return <cfe><loname empid="{$d}">{distinct-values($items/cfe/text())}</loname> <centers>{ for  $i  in $items order by $i return <cname id="{$i/@id}">{$i/cname/text()} </cname> }</centers></cfe>}</locenter>'
	
    var qr =  '<locenter>{for $d in distinct-values(/xmldb/centers/center/cfe/@empid) let $items := /xmldb/centers/center[cfe/@empid = $d] order by $d  return <cfe><lo><loid>{$d}</loid><loname>{distinct-values($items/cfe/text())}</loname ></lo><centers>{ for  $i  in $items order by $i return <center><cid>{$i/@id}</cid><cname>{$i/cname/text()} </cname></center> }</centers></cfe>}</locenter> '	
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
