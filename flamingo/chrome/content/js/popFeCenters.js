(function($){
    $.fn.loanOffCenter = function(){
    
        var rows = $(this).get(0);
        
        var d = new Date();
        var curr_date = d.getDate();
        var curr_month = d.getMonth();
        curr_month++;
        curr_month = curr_month > 9 ? curr_month : "0" + curr_month;
        var curr_year = d.getFullYear();
        var todayDate = curr_year + "-" + curr_month + "-" + curr_date;
        
        
        /*    var qr =  '<locenter>{for $d in distinct-values(/xmldb/centers/center/cfe/@empid) let $items := /xmldb/centers/center[cfe/@empid = $d and  meetingdate/text() = "' + todayDate + '"] order by $d  return if (exists($items)) then (  <cfe><lo><loid>{$d}</loid><loname>{distinct-values($items/cfe/text())}</loname ></lo><centers>{ for  $i  in $items order by $i return <center><cid>{$i/@id}</cid><cname>{$i/cname/text()} </cname></center> }</centers></cfe> ) else () } </locenter> '	*/
        var query = "for $collection in //CollectionSheets/CollectionSheet where $collection/date = '2011-02-23+05:30' order by $collection/LoanOfficers/LoanOfficer/name return $collection/LoanOfficers"
        jsdump(getdata(query).toString());
        var nobj = jQuery.parseJSON(getdata(query).toString());
        
        $.each(nobj.LoanOfficers, function(i, loanofficers){ //looping LO
            var row = document.createElement("row");
            row.setAttribute("class", "todaylo");
            
            var label = document.createElement("label");
            var loanOfficerName = loanofficers.name;
            label.setAttribute("value", loanOfficerName);
            row.appendChild(label);
            var box = document.createElement("box");
            box.setAttribute("align", "center");
            
            
            var image = document.createElement("image");
            image.setAttribute("onclick", "$('#" + loanofficers.personnelId + "').toggle('showOrHide');");
            image.setAttribute("src", "chrome://flamingo/skin/images/extra/icon.collapse.png");
            /****/
            $(image).toggle(function(){
                $(this).attr('src', "chrome://flamingo/skin/images/extra/icon.expand.png");
            }, function(){
                $(this).attr('src', "chrome://flamingo/skin/images/extra/icon.collapse.png");
            })
            
            box.appendChild(image);
            row.appendChild(box);
            rows.appendChild(row);
            
            var lrows = document.createElement("rows");
            lrows.setAttribute("id", loanofficers.personnelId);
            jsdump("started looping loan officer" + loanofficers.personnelId);
            $.each(loanofficers.Centers, function(j, center){ //looping Center
                jsdump("started looping center" + center.name);
                var row = document.createElement("row");
                row.setAttribute("class", "todayCenter");
                
                var label = document.createElement("label");
                label.setAttribute("value", center.name);
                label.setAttribute("class", "todayCenter");
                label.setAttribute("onclick", "$('#centercollectionsheet').centerCollectionSheet({loanOfficerName:'" + loanOfficerName + "',centerid : '" + center.centerId + "'});");
                //jsdump(label.getAttribute("onclick"));
                row.appendChild(label);
                lrows.appendChild(row);
                jsdump("finished looping center" + center.name)
            });
            
            rows.appendChild(lrows);
            
        });
        
        return this;
    };
})(jQuery);
