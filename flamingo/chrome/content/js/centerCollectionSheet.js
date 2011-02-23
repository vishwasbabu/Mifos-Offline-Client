(function($){
    $.fn.centerCollectionSheet = function(params){
        jsdump("inside centerCollectionSheetMethod");
        //centerid
        var d = new Date();
        var curr_date = d.getDate();
        var curr_month = d.getMonth();
        curr_month++;
        
        curr_month = curr_month > 9 ? curr_month : "0" + curr_month;
        
        
        var curr_year = d.getFullYear();
        var todayDate = curr_year + "-" + curr_month + "-" + curr_date;
        
        var settings = {
            'centerid': '0003-000006331',
            'Date': todayDate,
            'status': 'unsynced',
            'loanOfficerName': ''
        };
        
        
        if (params) {
            $.extend(settings, params);
        }
        
        
        var richchildren = $(this).get(0);
        
        var centertotal = document.getElementById(richchildren.getAttribute("id") + "total");
        
        while (richchildren.hasChildNodes()) {
            richchildren.removeChild(richchildren.firstChild);
        }
        
        while (centertotal.hasChildNodes()) {
            centertotal.removeChild(centertotal.firstChild);
        }
        
        var loadbox = document.createElement("box");
        loadbox.setAttribute("class", "loadbox");
        richchildren.appendChild(loadbox);
        
        
        
        /*var qr  = 'for $prod in //xmldb/centers/center let $prodDept := $prod where $prodDept[@id="' + settings.centerid + '"] and $prodDept/meetingdate = "' + settings.Date +'" return $prod';
         */
        var qr = "for $collection in //CollectionSheets/CollectionSheet/LoanOfficers/LoanOfficer/Centers/Center where $collection/centerId =" + "'" + settings.centerid + "'" + "and $collection/../../../../date='2011-02-23+05:30' return $collection";
        jsdump("executing query " + qr);
        
        var obj = jQuery.parseJSON(getdata(qr).toString());
        jsdump(JSON.stringify(obj));
        
        while (richchildren.hasChildNodes()) {
            richchildren.removeChild(richchildren.firstChild);
        }
        
        var centerdisbsum = 0;
        var centerprnsum = 0;
        var centerintsum = 0;
        
        /* -----         Center Details  	------	*/
        
        
        $("#todayCenterName").val(obj.Center.name);
        $("#todayLOName").val(settings.loanOfficerName);
        
        
        
        
        jsdump("populate center details table for " + obj.Center.name)
        
        $.each(obj.Center.Groups, function(i, groupvalues){ //looping group
            jsdump("start iterating over group" + groupvalues.groupId)
            var groupid = groupvalues.groupId;
            
            var row = document.createElement("row");
            row.setAttribute("flex", "1");
            var hbox = document.createElement("hbox");
            hbox.setAttribute("class", "todaygrouphd");
            hbox.setAttribute("align", "center");
            var image = document.createElement("image");
            image.setAttribute("onclick", "$('#" + groupid + "').toggle('showOrHide ');");
            image.setAttribute("src", "chrome://flamingo/skin/images/extra/icon.collapse.png");
            $(image).toggle(function(){
                $(this).attr('src', "chrome://flamingo/skin/images/extra/icon.expand.png");
            }, function(){
                $(this).attr('src', "chrome://flamingo/skin/images/extra/icon.collapse.png");
            })
            
            
            var label = document.createElement("label");
            label.setAttribute("value", groupvalues.name);
            
            hbox.appendChild(image);
            hbox.appendChild(label);
            row.appendChild(hbox);
            richchildren.appendChild(row);
            
            var rows = document.createElement("rows");
            rows.setAttribute("id", groupvalues.groupId); //need to use groupid otherwise duplicate prblem
            var grpdisbsum = 0;
            var grpprnsum = 0;
            var grpintsum = 0;
            
            var numberOfLoans = 0;
            $.each(groupvalues.Members, function(j, membervalues){
            
                var memname = membervalues.name;
                var memId = membervalues.memberId;
                $.each(membervalues.LoanAccounts, function(k, loanvalues){
                    jsdump("looping through member with memberId" + memId);
                    grpdisbsum += Number(loanvalues.disbursedAmount);
                    grpprnsum += Number(loanvalues.principalDemand);
                    grpintsum += Number(loanvalues.interestDemand);
                    
                    centerdisbsum += Number(loanvalues.disbursedAmount);
                    centerprnsum += Number(loanvalues.principalDemand);
                    centerintsum += Number(loanvalues.interestDemand);
                    
                    var row = document.createElement("row");
                    row.setAttribute("flex", "1");
                    row.setAttribute("id", memId);
                    row.setAttribute("class", "todayrow");
                    row.setAttribute("align", "center");
                    var labelmn = document.createElement("label");
                    labelmn.setAttribute("value", memname);
                    row.appendChild(labelmn);
                    var label = document.createElement("label");
                    label.setAttribute("value", "IGL");//Need product Name
                    row.appendChild(label);
                    var label = document.createElement("label");
                    label.setAttribute("value", loanvalues.disbursedAmount);
                    row.appendChild(label);
                    var label = document.createElement("label");
                    label.setAttribute("value", "13");
                    row.appendChild(label);
                    var label = document.createElement("label");
                    label.setAttribute("value", loanvalues.principalDemand);
                    row.appendChild(label);
                    var label = document.createElement("label");
                    label.setAttribute("value", loanvalues.interestDemand);
                    row.appendChild(label);
                    var textbox = document.createElement("textbox");
                    textbox.setAttribute("value", Number(loanvalues.principalDemand) + Number(loanvalues.interestDemand));
                    textbox.setAttribute("width", "60");
                    textbox.setAttribute("id", "group" + i + "memberloan" + numberOfLoans + "amt");
                    //jsdump("generated id" + "group" + i + "memberloan" + numberOfLoans + "amt");
                    textbox.setAttribute("onchange", "centerTotal()")
                    row.appendChild(textbox);
                    var textbox = document.createElement("textbox");
                    textbox.setAttribute("value", "0.0");
                    textbox.setAttribute("width", "60");
                    textbox.setAttribute("id", "group" + i + "memberloan" + numberOfLoans + "misc"); //need o decide
                    textbox.setAttribute("onchange", "centerTotal()")
                    row.appendChild(textbox);
                    
                    var menulist = document.createElement("menulist");
                    menulist.setAttribute("label", "Attn");
                    var menupopup = document.createElement("menupopup");
                    var menuitem = document.createElement("menuitem");
                    menuitem.setAttribute("label", "A");
                    menupopup.appendChild(menuitem);
                    var menuitem = document.createElement("menuitem");
                    menuitem.setAttribute("label", "LP");
                    menupopup.appendChild(menuitem);
                    var menuitem = document.createElement("menuitem");
                    menuitem.setAttribute("label", "L");
                    menupopup.appendChild(menuitem);
                    var menuitem = document.createElement("menuitem");
                    menuitem.setAttribute("label", "P");
                    menuitem.setAttribute("selected", "true");
                    menupopup.appendChild(menuitem);
                    menulist.appendChild(menupopup);
                    row.appendChild(menulist);
                    rows.appendChild(row);
                    memname = "";
                    
                    //append number of Loans
                    numberOfLoans++;
                    
                });
                
            });
            
            richchildren.appendChild(rows);
            
            var gtrows = document.createElement("rows");
            gtrows.setAttribute("class", "todaygrouptotal");
            
            var grouprow = document.createElement("row");
            grouprow.setAttribute("flex", "1");
            grouprow.setAttribute("id", "xxx"); // Need use member id
            grouprow.setAttribute("align", "center");
            var labelmn = document.createElement("label");
            labelmn.setAttribute("value", "");
            grouprow.appendChild(labelmn);
            var labelmn = document.createElement("label");
            labelmn.setAttribute("value", "Group Sum");
            grouprow.appendChild(labelmn);
            var labelmn = document.createElement("label");
            labelmn.setAttribute("value", grpdisbsum.toFixed(2));
            grouprow.appendChild(labelmn);
            var labelmn = document.createElement("label");
            labelmn.setAttribute("value", "");
            grouprow.appendChild(labelmn);
            var labelmn = document.createElement("label");
            labelmn.setAttribute("value", grpprnsum.toFixed(2));
            grouprow.appendChild(labelmn);
            var labelmn = document.createElement("label");
            labelmn.setAttribute("value", grpintsum.toFixed(2));
            grouprow.appendChild(labelmn);
            var textbox = document.createElement("textbox");
            textbox.setAttribute("value", "0.0");
            textbox.setAttribute("width", "60");
            textbox.setAttribute("id", "group" + i + "amtsum"); //need o decide
            grouprow.appendChild(textbox);
            var textbox = document.createElement("textbox");
            textbox.setAttribute("value", "0.0");
            textbox.setAttribute("width", "60");
            textbox.setAttribute("id", "group" + i + "miscsum"); //need o decide
            grouprow.appendChild(textbox);
            var labelmn = document.createElement("label");
            labelmn.setAttribute("value", "");
            grouprow.appendChild(labelmn);
            gtrows.appendChild(grouprow);
            richchildren.appendChild(gtrows);
            
            
        });
        
        
        richchildren.appendChild(document.createElement("separator"));
        richchildren.appendChild(document.createElement("separator"));
        
        var centerrow = document.createElement("row");
        centerrow.setAttribute("flex", "1");
        centerrow.setAttribute("id", "xxx"); // Need use member id
        centerrow.setAttribute("align", "center");
        var labelmn = document.createElement("label");
        labelmn.setAttribute("value", "Center Sum");
        centerrow.appendChild(labelmn);
        var labelmn = document.createElement("label");
        labelmn.setAttribute("value", "");
        centerrow.appendChild(labelmn);
        var labelmn = document.createElement("label");
        labelmn.setAttribute("value", centerdisbsum.toFixed(2));
        centerrow.appendChild(labelmn);
        var labelmn = document.createElement("label");
        labelmn.setAttribute("value", "");
        centerrow.appendChild(labelmn);
        var labelmn = document.createElement("label");
        labelmn.setAttribute("value", centerprnsum.toFixed(2));
        centerrow.appendChild(labelmn);
        var labelmn = document.createElement("label");
        labelmn.setAttribute("value", centerintsum.toFixed(2));
        centerrow.appendChild(labelmn);
        var textbox = document.createElement("textbox");
        textbox.setAttribute("value", "");
        textbox.setAttribute("width", "60");
        textbox.setAttribute("id", "centerCollectionAmount"); //need o decide
        centerrow.appendChild(textbox);
        var textbox = document.createElement("textbox");
        textbox.setAttribute("value", "");
        textbox.setAttribute("width", "60");
        textbox.setAttribute("id", "centerMiscCollectionAmount"); //need o decide
        centerrow.appendChild(textbox);
        var labelmn = document.createElement("label");
        labelmn.setAttribute("value", "");
        centerrow.appendChild(labelmn);
        
        centertotal.appendChild(centerrow);
        
        /**calculate the center Total**/
        centerTotal();
        return this;
    };
})(jQuery);
