$(document).ready(function() {

    // using jQuery
    $("#2020data").submit(function(e) {

        $.ajax({
        url: "http://localhost:8080/api/csv/upload",
        type: "POST",
        data: new FormData(this),
        processData: false,
        contentType: false
        });
    
        return false;
    });




});