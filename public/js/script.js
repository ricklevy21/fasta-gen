$(document).ready(function() {

//GLOABL VARIABLES
//---------------------------------------------------------------------------------------------------------------
let sequences

let listOfSequences = []

let queryList

let dataForDownload = []

let showAlert = true

let downloadFileName

//EVENT LISTENERS
//---------------------------------------------------------------------------------------------------------------
    //hide elements
    $('#sequenceListForm').hide()
    $('#downloadFiles').hide()
    $('#downloadFasta').hide()
    $('#downloadSourceMod').hide()


    //event listener to erase all files in resources\static\assets\downloads + uploads and create stub source mod file
    $(window).on("load",function(){
        //call api to run function on backend
        $.ajax({
            url: "/api/csv/reset",
            type: "POST"
        })
    })


    //event listener to send csv to server and upload to database
    $('#uploadCSV').submit(function(e) {
        $.ajax({
        url: "/api/csv/upload",
        type: "POST",
        data: new FormData(this),
        processData: false,
        contentType: false,
        success: function(){
            alert("Data successfully uploaded")
        }
        });
    
        return false;
    });


    //event listener to sync GBIF data
    $('#syncGBIF').submit(function(e) {
        e.preventDefault()
        getAllSequences()
    })


    //event listener to display all sequences in database to page
    $('#selectSequences').submit(function(e) {
        e.preventDefault()
        listSequences()
    })

    //event listener for the download files button
    $('#downloadFiles').click(function(e) {
        e.preventDefault()
        buildQueryList()
    })

//FUNCTIONS
//---------------------------------------------------------------------------------------------------------------
    //function to query every record in the database and then prefrom API call to GBIF with data returned
    function getAllSequences() {
        $.ajax({
            url: "/api/csv/sequences",
            type: "GET"
        })
        .then((data) => {
            sequences = data
            getGBIF()
        })
    }


    //Loop through sequences returned from DB and preform GBIF API query for each. Then add selected data to the sequences object.
    function getGBIF() {
        showAlert=true
        for (let i = 0; i < sequences.length; i++){
            let queryURL = "https://api.gbif.org/v1/occurrence/search/?catalogNumber="+sequences[i].catalogNumber+"&collectionCode="+sequences[i].collectionCode
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
                //institution code
                sequences[i].institutionCode = gbifRecord.institutionCode
                //identifiedBy
                sequences[i].identifiedBy = gbifRecord.identifiedBy                
            }).done(function() {
                updateRecords()
                if (showAlert==true) {
                    alert ("GBIF data syncing, this may take a few minutes.");
                    showAlert = false;
                }
            }).catch((error) => {
                res.status(500).send({
                  message: "Failed to sync data from GBIF.",
                  error: error.message,
                });
              });
        }
    }

    //Update each record in the database with the newly requested data from GBIF.
    function updateRecords() {
        for (let i = 0; i < sequences.length; i++){
            $.ajax({
                url: "/api/csv/update",
                type: "PUT",
                data: sequences[i]
            }).catch((error) => {
                res.status(500).send({
                  message: "Failed to update database.",
                  error: error.message,
                });
              });
        }
    }

    //Show all sequences in select list
    function listSequences() {
        $.ajax({
            url: "/api/csv/sequences",
            type: "GET"
        })
        .then((sequenceList) => {
            listOfSequences = []
            $.each(sequenceList, function(i, sequenceListItem) {
                listOfSequences.push('<option value='+sequenceListItem.id+'>'
                +sequenceListItem.catalogNumber+'  |  '
                +sequenceListItem.scientificName+
                '</option>')
            })
        }).then(function(){
            $('#sequenceList').empty();
            $('#sequenceList').append(listOfSequences.join(''));
            $('#sequenceListForm').show();
            $('#downloadFiles').show();

        })
    }

    //submit selected sequences for file download
    function buildQueryList() {
            //empty queryList
            queryList = []
            //get all sequences selected by user
            var selectedSeqs = $('#sequenceList :selected').map(function(i, el) {
                return $(el).val()
            })
            if (selectedSeqs.length == 0){
                alert("Please select at least 1 sequence")
            }else {
                //add each selection to the global array 'queryList'
                for (var i = 0; i < selectedSeqs.length; i++){
                    queryList.push(selectedSeqs[i])
                }
                querySeqsForDownload()
            }
        }


    //query database for sequences to download
    function querySeqsForDownload(){
        dataForDownload = []
        for(let i = 0; i < queryList.length; i++){
            $.ajax({
                url: "/api/csv/sequencesDownload/"+queryList[i],
                method: "GET",
                // data: JSON.stringify(queryList),
                contentType: "application/json",
            })
            .then((res) => {
               //console.log(res)
               downloadFileName = res[0]
               sourceModFileName = res[1]
               requestFileForDownload()
               requestModsFileForDownload()
            })
            .catch((error) => {
                res.status(500).send({
                  message: "Failed to retrieve data from database.",
                  error: error.message
                });
            })
        }
    }

    //download the fasta file to the client
    function requestFileForDownload(){
        $.ajax({
            url: "/api/csv/files/"+downloadFileName,
            method: "GET"
        })
        .then(function() {
            var url = 'http://localhost:8080/api/csv/files/'+downloadFileName;
            $("#downloadFasta").attr("href", url)
            $("#downloadFasta").show()
            
        })
    }

    //download the source mod file to the client
    function requestModsFileForDownload(){
        $.ajax({
            url: "/api/csv/files/"+sourceModFileName,
            method: "GET"
        })
        .then(function() {
            var url = 'http://localhost:8080/api/csv/files/'+sourceModFileName;
            $("#downloadSourceMod").attr("href", url)
            $("#downloadSourceMod").show()
            
        })
    }




});