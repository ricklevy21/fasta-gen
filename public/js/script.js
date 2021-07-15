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


    //event listener to sync GBIF data
    $("#syncGBIF").submit(function(e) {
        e.preventDefault()
        getAllSequences()
    })


    //event listener to display all sequences in database to page
    $("#selectSequences").submit(function(e) {
        e.preventDefault()
        console.log("select sequences")
    })


    //function to query each record in the database
    function getAllSequences() {
        $.ajax({
            url: "http://localhost:8080/api/csv/sequences",
            type: "GET"
        })
        .then((data) => {
            console.log(data)
        })
    }


});