function getData1(){
    var medrecid = document.getElementById("medrecid").value;
    var url = "http://localhost:3001/med/" + medrecid;
    $.get (url, function(data, status){
        /* ***This code was written before we started to send the JSON as a string ***
            console.log(data);
            console.log(JSON.stringify(data));
            var jsonstring = JSON.stringify(data).replace(/\\n/g, "\\\\n");
        */
        /* *** Testing purposes ***
        var jsonObject = data;
        console.log(JSON.stringify(jsonObject.Data[0]));
        */
        document.getElementById('data').innerHTML = JSON.stringify(data,null,2);
    })    
}

function getData2(){
    var dropdown = document.getElementById("field");
    var val = dropdown.options[dropdown.selectedIndex].value;    
    var element = document.getElementById("element").value;
    var url = "http://localhost:3001/med/" + val + "/" + element + "/";
    $.get (url, function(data, status){
        document.getElementById('data').innerHTML = JSON.stringify(data,null,2);
    })        
}

function getData3(){
    var dropdown = document.getElementById("field2");
    var val = dropdown.options[dropdown.selectedIndex].value;    
    var element = document.getElementById("element2").value;
    var dropdown = document.getElementById("column2");
    var val2 = dropdown.options[dropdown.selectedIndex].value;        

    var url = "http://localhost:3001/med/" + val + "/" + element + "/" + val2 + "/";    
    $.get (url, function(data, status){
        document.getElementById('data').innerHTML = JSON.stringify(data,null,2);
    })        
}