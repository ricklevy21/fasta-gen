$(document).ready(function() {

    //event listener to send csv to server and upload to database
    $("#uploadCSV").submit(function(e) {
        $.ajax({
        url: "http://localhost:8080/api/csv/upload",
        type: "POST",
        data: new FormData(this),
        processData: false,
        contentType: false
        });
    
        return false;
    });

    //event listener to display all sequences in database to page
    $("#selectSequences").submit(function(e) {
        e.preventDefault()
        console.log("button clicked")
    })


});