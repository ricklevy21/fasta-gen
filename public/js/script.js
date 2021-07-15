$(document).ready(function() {

//GLOABL VARIABLES
//---------------------------------------------------------------------------------------------------------------
let sequences

//EVENT LISTENERS
//---------------------------------------------------------------------------------------------------------------

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

//FUNCTIONS
//---------------------------------------------------------------------------------------------------------------
    //function to query each record in the database
    function getAllSequences() {
        $.ajax({
            url: "http://localhost:8080/api/csv/sequences",
            type: "GET"
        })
        .then((data) => {
            sequences = data
            getGBIF()
        })
    }

    //Loo through sequences returned from DB and preform GBIF API query for each. Then add selected data to the sequences object.
    function getGBIF() {
        for (let i = 0; i < sequences.length; i++){
            let queryURL = "https://api.gbif.org/v1/occurrence/search/?q="+sequences[i].catalogNumber
            $.ajax({
                url: queryURL,
                method: "GET",
            }).then(function(response){
                var gbifRecord = response.results[0]
            //add selected fields from GBIF to the seqences object
                //scientificName
                sequences[i].scientificName = gbifRecord.scientificName
                //collectionCode
                sequences[i].collectionCode = gbifRecord.collectionCode
                //family
                sequences[i].family = gbifRecord.family
                //eventDate
                sequences[i].eventDate = gbifRecord.eventDate
                //recordedBy
                sequences[i].recordedBy = gbifRecord.recordedBy
                //country
                sequences[i].country = gbifRecord.country
                //decimalLatitude
                sequences[i].decimalLatitude = gbifRecord.decimalLatitude
                //decimalLongitude
                sequences[i].decimalLongitude = gbifRecord.decimalLongitude
                console.log(sequences[i])
            })
        }
    }




});