(function($){
    $.fn.syncedCenters = function(){
        var rows = $(this).get(0);
        var qr = '<syncedcenters>{ let $allItems := /xmldb/centers/center for $date in distinct-values($allItems/meetingdate) return <synccenterdate value="{$date}"><centers> {           let $dateItems := $allItems[meetingdate = $date]        for $id in distinct-values($dateItems/@id) return <center id="{$id}" > <totaldue> {sum($dateItems[@id=$id]/groups/group/members/member/loandetails/loan/prdue)} </totaldue> </center> }</centers></synccenterdate>}</syncedcenters>'
        
        var nobj = jQuery.parseJSON(getdata(qr).toString());
        
        $.each(nobj.syncedcenters, function(i, syncedcenter){ //looping syncedcenter
            var row = document.createElement("row");
            
            var hbox = document.createElement("hbox");
            hbox.setAttribute("align", "center");
            
            var rowsid = 'id' + Math.round(Math.random() * 10000000);
            
            var image = document.createElement("image");
            image.setAttribute("onclick", "$('#" + rowsid + "').toggle('showOrHide ');");
            image.setAttribute("src", "chrome://flamingo/skin/images/extra/calendar.png");
            image.setAttribute("width", "16");
            image.setAttribute("height", "16");
            
            var label = document.createElement("label");
            label.setAttribute("value", syncedcenter['@value']);
            
            hbox.appendChild(image);
            hbox.appendChild(label);
            row.appendChild(hbox);
            rows.appendChild(row);
            
            
            var syncrows = document.createElement("rows");
            syncrows.setAttribute("id", rowsid);
            
            
            $.each(syncedcenter.centers, function(j, center){ //looping syncedcenter
                var row = document.createElement("row");
                row.setAttribute("align", "center");
                row.setAttribute("flex", "1");
                
                var label = document.createElement("label");
                label.setAttribute("value", center['@id']);
                row.appendChild(label);
                
                var label = document.createElement("label");
                label.setAttribute("value", "FE1");
                row.appendChild(label);
                
                var label = document.createElement("label");
                label.setAttribute("value", "26/11/2010");
                row.appendChild(label);
                
                var label = document.createElement("label");
                label.setAttribute("value", "26/11/2010");
                row.appendChild(label);
                
                var label = document.createElement("label");
                label.setAttribute("value", "26/11/2010");
                row.appendChild(label);
                
                var label = document.createElement("label");
                label.setAttribute("value", center.totaldue);
                row.appendChild(label);
                
                var label = document.createElement("label");
                label.setAttribute("value", "90000000");
                row.appendChild(label);
                
                var box = document.createElement("box");
                box.setAttribute("align", "center");
                
                var image = document.createElement("image");
                image.setAttribute("onclick", "alert('need to write code');");
                image.setAttribute("src", "chrome://flamingo/skin/images/extra/delete-icon.png");
                image.setAttribute("width", "16");
                image.setAttribute("height", "16");
                box.appendChild(image);
                row.appendChild(box);
                
                
                var checkbox = document.createElement("checkbox");
                checkbox.setAttribute("checked", "false");
                row.appendChild(checkbox);
                
                syncrows.appendChild(row);
            });
            rows.appendChild(syncrows);
        });
        
        return this;
    };
})(jQuery);
