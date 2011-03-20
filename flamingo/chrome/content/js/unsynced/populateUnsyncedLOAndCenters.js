(function($){
    $.fn.populateUnsyncedLOAndCenters = function(){
        var d = new Date();
        var curr_date = d.getDate();
        var curr_month = d.getMonth();
        curr_month++;
        curr_month = curr_month > 9 ? curr_month : "0" + curr_month;
        var curr_year = d.getFullYear();
        var todayDate = curr_year + "-" + curr_month + "-" + curr_date;
        
        /***delete all previous data**/
        $(this).empty();
        
        var rows = $(this).get(0);
        
        
        var query = "<CollectionSheets>" +
        " {" +
        " for $collectionSheet in (//CollectionSheet[date < '" +
        todayDate +
        "'])" +
        " order by $collectionSheet/date" +
        " return" +
        " <CollectionSheet date='{$collectionSheet/date}'>" +
        "	<LoanOfficers>" +
        "	{" +
        "	for $todayLoanOfficers in distinct-values($collectionSheet/LoanOfficers/LoanOfficer/name) " +
        "	let $loanOfficer := $collectionSheet/LoanOfficers/LoanOfficer[name/text() = $todayLoanOfficers]" +
        "	order by $loanOfficer " +
        "	return <LoanOfficer>" +
        "					<name>{$todayLoanOfficers}</name>" +
        "					<personnelId>{$loanOfficer/personnelId/text()}</personnelId>" +
        "					<Centers>" +
        "						{" +
        "							for $center in $loanOfficer/Centers/Center" +
        "							return " +
        "								if(empty($center/status/node()))" +
        "									then" +
        "											<Center>" +
        "												<name>{$center/name/text()}</name>" +
        "												<centerId>{$center/centerId/text()}</centerId>" +
        "											</Center>" +
        "									else" +
        "												null" +
        "						}" +
        "					</Centers>" +
        "			</LoanOfficer>" +
        "	}" +
        "	</LoanOfficers>" +
        " </CollectionSheet>" +
        " }" +
        " </CollectionSheets>";
        
        jsdump(query);
        
        
        var nobj = jQuery.parseJSON(getdata(query).toString());
        jsdump(JSON.stringify(nobj));
        
        
        $.each(nobj.CollectionSheets, function(h, collectionSheet){
        
            var drow = document.createElement("row");
            drow.setAttribute("class", "todaylo");
            
            var dlabel = document.createElement("label");
            
            dlabel.setAttribute("value", collectionSheet['@date']);
            drow.appendChild(dlabel);
            
            rows.appendChild(drow);
            var drows = document.createElement("rows");
            jsdump("loop1");
            
            $.each(collectionSheet.LoanOfficers, function(i, loanofficer){ //looping LO
                var row = document.createElement("row");
                row.setAttribute("class", "todaylo");
                
                var box = document.createElement("box");
                box.setAttribute("align", "left");
                
                var rowsfeid = 'id' + Math.round(Math.random() * 10000000);
                
                var image = document.createElement("image");
                image.setAttribute("onclick", "$('#" + rowsfeid + "').toggle('showOrHide');");
                image.setAttribute("src", "chrome://flamingo/content/images/icon.collapse.png");
                $(image).toggle(function(){
                    $(this).attr('src', "chrome://flamingo/content/images/icon.expand.png");
                }, function(){
                    $(this).attr('src', "chrome://flamingo/content/images/icon.collapse.png");
                })
                box.appendChild(image);
                row.appendChild(box);
                
                var label = document.createElement("label");
                label.setAttribute("value", loanofficer.name);
                row.appendChild(label);
                
                drows.appendChild(row);
                
                var lrows = document.createElement("rows");
                lrows.setAttribute("id", rowsfeid);
                $.each(loanofficer.Centers, function(j, center){ //looping Center
                    var row = document.createElement("row");
                    row.setAttribute("class", "todayCenter");
                    
                    var label = document.createElement("label");
                    label.setAttribute("value", center.name);
                    label.setAttribute("class", "todayCenter");
                    label.setAttribute("onclick", "$('#unsyncedCenterCollectionSheet').populateCenterCollectionSheet({loanOfficerName:'" + loanofficer.name + "',date:'" + collectionSheet['@date'] + "',centerid : '" + center.centerId + "',idPrefix :" + "'unsynced'" + "});");
                    row.appendChild(label);
                    lrows.appendChild(row);
                });
                
                drows.appendChild(lrows);
                
            });
            rows.appendChild(drows);
            
        });
        return this;
    };
})(jQuery);
