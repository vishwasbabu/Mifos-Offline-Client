(function($){
    $.fn.populateSyncedLOAndCenters = function(){
        var d = new Date();
        var curr_date = d.getDate();
        var curr_month = d.getMonth();
        curr_month++;
        curr_month = curr_month > 9 ? curr_month : "0" + curr_month;
        var curr_year = d.getFullYear();
        var todayDate = curr_year + "-" + curr_month + "-" + curr_date;
        
        
        var rows = $(this).get(0);
        
        /**delete any existing entries**/
        $(this).find("row:gt(0)").remove();
        $(this).find("rows").remove();
        
        var query = "<CollectionSheets>" +
        "{" +
        "	for $collectionSheet in (//CollectionSheet[date <= '" +
        todayDate +
        "'])" +
        "    order by $collectionSheet/date" +
        "	return" +
        "	<CollectionSheet date='{$collectionSheet/date}'>" +
        "		<LoanOfficers>" +
        "		{" +
        "		for $todayLoanOfficers in distinct-values($collectionSheet/LoanOfficers/LoanOfficer/name) " +
        "		let $loanOfficer := $collectionSheet/LoanOfficers/LoanOfficer[name/text() = $todayLoanOfficers]" +
        "		order by $loanOfficer " +
        "		return <LoanOfficer>" +
        "						<name>{$todayLoanOfficers}</name>" +
        "						<personnelId>{$loanOfficer/personnelId/text()}</personnelId>" +
        "						<Centers>" +
        "							{" +
        "								for $center in $loanOfficer/Centers/Center" +
        "								return " +
        "									if($center/status/text()='synced')" +
        "										then" +
        "												<Center>" +
        "													<name>{$center/name/text()}</name>" +
        "													<synchedDate>{$center/syncedDate/text()}</synchedDate>" +
        "													<centerId>{$center/centerId/text()}</centerId>" +
        "													<interestDemand>{sum($center/Groups/Group/Members/Member/LoanAccounts/LoanAccount/interestDemand)}</interestDemand>" +
        "													<principalDemand>{sum($center/Groups/Group/Members/Member/LoanAccounts/LoanAccount/principalDemand)}</principalDemand>" +
        "											    	<collectedAmount>{sum($center/Groups/Group/Members/Member/LoanAccounts/LoanAccount/amountRepaid)}</collectedAmount>" +
        "											  	    <miscCollections>{sum($center/Groups/Group/Members/Member/LoanAccounts/LoanAccount/miscCollection)}</miscCollections>" +
        "									 		 	</Center>" +
        "									else" +
        "										null" +
        "							}" +
        "						</Centers>" +
        "			   </LoanOfficer>" +
        "		}" +
        "		</LoanOfficers>" +
        "	</CollectionSheet>" +
        "}" +
        "</CollectionSheets>";
        
        var syncedCollectionSheets = jQuery.parseJSON(getdata(query).toString());
        
        var numberOfsyncedCenters = 0;
        
        $.each(syncedCollectionSheets.CollectionSheets, function(i, collectionSheet){
            var meetingDate = collectionSheet["@date"];
            //looping syncedcenter
            var row = document.createElement("row");
            
            var hbox = document.createElement("hbox");
            hbox.setAttribute("align", "center");
            
            var rowsId = 'id' + Math.round(Math.random() * 10000000);
            
            
            var image = document.createElement("image");
            image.setAttribute("onclick", "$('#" + rowsId + "').toggle('showOrHide');");
            image.setAttribute("src", "chrome://flamingo/content/images/calendar.png");
            image.setAttribute("width", "16");
            image.setAttribute("height", "16");
            image.setAttribute("class", "button");
            
            var label = document.createElement("label");
            label.setAttribute("value", meetingDate);
            
            
            
            hbox.appendChild(image);
            hbox.appendChild(label);
            row.appendChild(hbox);
            rows.appendChild(row);
            
            
            var syncrows = document.createElement("rows");
            syncrows.setAttribute("id", rowsId);
            
            
            $.each(collectionSheet.LoanOfficers, function(k, loanOfficer){
            
                var loanOfficerName = loanOfficer.name;
                
                
                $.each(loanOfficer.Centers, function(j, center){ //looping syncedcenter
                    var row = document.createElement("row");
                    row.setAttribute("align", "center");
                    row.setAttribute("flex", "1");
                    
                    var label = document.createElement("label");
                    label.setAttribute("value", center.name);
                    row.appendChild(label);
                    
                    var label = document.createElement("label");
                    label.setAttribute("value", center.centerId);
                    label.setAttribute("style", "display:none");
                    label.setAttribute("id", "syncedCenterId" + numberOfsyncedCenters);
                    row.appendChild(label);
                    
                    var label = document.createElement("label");
                    label.setAttribute("value", loanOfficerName);
                    row.appendChild(label);
                    
                    var label = document.createElement("label");
                    label.setAttribute("value", meetingDate);
                    label.setAttribute("id", "syncedCenterMeetingDate" + numberOfsyncedCenters);
                    
                    row.appendChild(label);
                    
                    var label = document.createElement("label");
                    label.setAttribute("value", meetingDate);
                    row.appendChild(label);
                    
                    var label = document.createElement("label");
                    label.setAttribute("value", center.synchedDate);
                    row.appendChild(label);
                    
                    var label = document.createElement("label");
                    label.setAttribute("value", (Number(center.interestDemand) + Number(center.principalDemand)).toFixed(2));
                    row.appendChild(label);
                    
                    var label = document.createElement("label");
                    label.setAttribute("value", (Number(center.collectedAmount) + Number(center.miscCollections)).toFixed(2));
                    row.appendChild(label);
                    
                    var box = document.createElement("box");
                    box.setAttribute("align", "center");
                    
                    var image = document.createElement("image");
                    image.setAttribute("src", "chrome://flamingo/content/images/delete-icon.png");
                    image.setAttribute("width", "16");
                    image.setAttribute("height", "16");
                    image.setAttribute("class", "button");
                    image.setAttribute("onclick", "deleteSingleSyncedCenter('" + center.centerId + "','" + meetingDate + "')");
                    image.setAttribute("id", "deleteSyncedCenterButton" + numberOfsyncedCenters);
                    
                    box.appendChild(image);
                    row.appendChild(box);
                    
                    
                    var checkbox = document.createElement("checkbox");
                    checkbox.setAttribute("id", "markSyncedCenterCheckBox" + numberOfsyncedCenters);
                    
                    row.appendChild(checkbox);
                    
                    //append number of synced centers
                    numberOfsyncedCenters++;
                    
                    syncrows.appendChild(row);
                });
                rows.appendChild(syncrows);
            });
        });
        
        return this;
    };
})(jQuery);
