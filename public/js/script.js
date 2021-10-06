$(document).ready(function() {

//GLOABL VARIABLES
//---------------------------------------------------------------------------------------------------------------
let sequences

let listOfSequences = []

let queryList

let dataForDownload = []

let showAlert = true

let downloadFileName

let userInfo = {}

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
        var formdata = new FormData(this);
        //add username
        formdata.append("username", userInfo.nickname);

        $.ajax({
        url: "/api/csv/upload",
        type: "POST",
        data: formdata,
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
    $('#selectSequences').click(function(e) {
        e.preventDefault()
        listSequences()
    })
    
    //event listener to display ITS sequences in database to page
    $('#selectITS').click(function(e) {
        e.preventDefault()
        listITS()
    })
   
    //event listener to display ITS1 sequences in database to page
    $('#selectITS1').click(function(e) {
        e.preventDefault()
        listITS1()
    })
  
    //event listener to display ITS2 sequences in database to page
    $('#selectITS2').click(function(e) {
        e.preventDefault()
        listITS2()
    })
   
    //event listener to display SSU sequences in database to page
    $('#selectSSU').click(function(e) {
        e.preventDefault()
        listSSU()
    })
    
    //event listener to display LSU sequences in database to page
    $('#selectLSU').click(function(e) {
        e.preventDefault()
        listLSU()
    })

    
    //event listener for the download files button
    $('#downloadFiles').click(function(e) {
        e.preventDefault()
        //call api to run function on backend to reset files before every generation
        $.ajax({
            url: "/api/csv/reset",
            type: "POST",
            success: buildQueryList()
        })

    })




//FUNCTIONS
//---------------------------------------------------------------------------------------------------------------
    //function to query every record in the database and then prefrom API call to GBIF with data returned
    function getAllSequences() {
        $.ajax({
            url: "/api/csv/sequences/"+userInfo.nickname,
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
            url: "/api/csv/sequences/"+userInfo.nickname,
            type: "GET"
        })
        .then((sequenceList) => {
            listOfSequences = []
            $.each(sequenceList, function(i, sequenceListItem) {
                listOfSequences.push('<option value='+sequenceListItem.id+'>'
                +sequenceListItem.SeqID+'  |  '
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
    //Show ITS sequences in select list
    function listITS() {
        $.ajax({
            url: "/api/csv/ITS/"+userInfo.nickname,
            type: "GET"
        })
        .then((sequenceList) => {
            listOfSequences = []
            $.each(sequenceList, function(i, sequenceListItem) {
                listOfSequences.push('<option value='+sequenceListItem.id+'>'
                +sequenceListItem.SeqID+'  |  '
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
    //Show ITS1 sequences in select list
    function listITS1() {
        $.ajax({
            url: "/api/csv/ITS1/"+userInfo.nickname,
            type: "GET"
        })
        .then((sequenceList) => {
            listOfSequences = []
            $.each(sequenceList, function(i, sequenceListItem) {
                listOfSequences.push('<option value='+sequenceListItem.id+'>'
                +sequenceListItem.SeqID+'  |  '
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
    //Show ITS2 sequences in select list
    function listITS2() {
        $.ajax({
            url: "/api/csv/ITS2/"+userInfo.nickname,
            type: "GET"
        })
        .then((sequenceList) => {
            listOfSequences = []
            $.each(sequenceList, function(i, sequenceListItem) {
                listOfSequences.push('<option value='+sequenceListItem.id+'>'
                +sequenceListItem.SeqID+'  |  '
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
    //Show SSU sequences in select list
    function listSSU() {
        $.ajax({
            url: "/api/csv/SSU/"+userInfo.nickname,
            type: "GET"
        })
        .then((sequenceList) => {
            listOfSequences = []
            $.each(sequenceList, function(i, sequenceListItem) {
                listOfSequences.push('<option value='+sequenceListItem.id+'>'
                +sequenceListItem.SeqID+'  |  '
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
    //Show LSU sequences in select list
    function listLSU() {
        $.ajax({
            url: "/api/csv/LSU/"+userInfo.nickname,
            type: "GET"
        })
        .then((sequenceList) => {
            listOfSequences = []
            $.each(sequenceList, function(i, sequenceListItem) {
                listOfSequences.push('<option value='+sequenceListItem.id+'>'
                +sequenceListItem.SeqID+'  |  '
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
            var url = 'https://stormy-river-74459.herokuapp.com/api/csv/files/'+downloadFileName;
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
            var url = 'https://stormy-river-74459.herokuapp.com/api/csv/files/'+sourceModFileName;
            $("#downloadSourceMod").attr("href", url)
            $("#downloadSourceMod").show()
            
        })
    }

    //download the template file to the client
    function requestTemplateForDownload(){
        $.ajax({
            url: "/api/csv/files/fasta-gen_TEMPLATE.csv",
            method: "GET"
        })
        .then(function() {
            var url = 'https://stormy-river-74459.herokuapp.com/api/csv/files/fasta-gen_TEMPLATE.csv';          
        })
    }

    //get user info (if not logged in, then nothing really happens)
    function getUserInfo() {
        $.ajax({
            url: "/api/csv/user",
            method: "GET"
        })
        .then((res) => {
            userInfo = res
            $("#userName").append(res.nickname)
        })
    }

    getUserInfo()
    requestTemplateForDownload()

});