function init(){


    $('#futurecentercollectionsheet').centerCollectionSheet({
        'centerid': '0000100004'
    });
    
    $('#futurelocenter').futureloanOffCenter();
    
    $('#syncedcenters').syncedCenters();
    
    $('#unsyncedlocenter').unsynedloanOffCenter();
    
    $('#unsyncedcentercollectionsheet').centerCollectionSheet({
        'centerid': '0000100004'
    });
    
    $('#todaygetdata').toggle('showOrHide');
    $('#futuregetdata').toggle('showOrHide');
    
    $('#centercollectionsheet').centerCollectionSheet({
        'centerid': '0000100004'
    });
    
    
    $('#todaylocenter').loanOffCenter();
    
    var condition = navigator.onLine ? "syncboxgreen" : "syncboxred";
    document.getElementById('syncbutton').setAttribute("class", condition);
    
    //		document.getElementById('todaydaterpt').value = new Date();
    //		document.getElementById('todaydatetrx').value = new Date();

};

function onTreeClicked(event){
    var tree = document.getElementById("my-tree");
    var tbo = tree.treeBoxObject;
    
    var row = {}, col = {}, child = {};
    tbo.getCellAt(event.clientX, event.clientY, row, col, child);
    
    var cellText = tree.view.getCellText(row.value, col.value);
    $('#centercollectionsheet').centerCollectionSheet(cellText);
}

function getdata(query){
    alert("hello");
    var a = $.ajax({
        type: 'POST',
        url: "http://localhost:8984/basex/jax-rx/OfflineStore",
        dataType: 'xml',
        async: false,
        contentType: "application/xml",
        accept: "application/xml"
    }).responseText;
    alert(a);
    
}
