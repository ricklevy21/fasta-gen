//dependencies
const db = require("../../models");
const Fasta = db.fasta;
const fs = require("fs");
const csv = require("fast-csv");
const baseUrl = "http://localhost:8080/files/";

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//upload csv into db
const upload = async (req, res) => {
    try {
      if (req.file == undefined) {
        return res.status(400).send("Please upload a CSV file!");
      }
  
      let sequences = [];
      let path = __basedir + "/resources/static/assets/uploads/" + req.file.filename;
  
      fs.createReadStream(path)
        .pipe(csv.parse({ headers: true }))
        .on("error", (error) => {
          throw error.message;
        })
        .on("data", (row) => {
          row.user = req.body.username
          sequences.push(row);
        })
        .on("end", () => {
          Fasta.bulkCreate(sequences)
            .then(() => {
              res.status(200).send({
                message:
                  "Uploaded the file successfully: " + req.file.originalname,
              });
            })
            .catch((error) => {
              res.status(500).send({
                message: "Fail to import data into database!",
                error: error.message,
              });
            });
        });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Could not upload the file: " + req.file.originalname,
      });
    }
  };
  
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //get all records from db
  const getSequences = (req, res) => {
    console.log(req.params)
    Fasta.findAll(
      {
      where: {
        user: req.params.nickname
      }
    }
    )
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving sequences.",
        });
      });
  };

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //update db records with data from gbif
  const updateSequences = (req, res) => {
    Fasta.update({
      scientificName: req.body.scientificName,
      collectionCode: req.body.collectionCode,
      family: req.body.family,
      eventDate: req.body.eventDate,
      recordedBy: req.body.recordedBy,
      country: req.body.country,
      decimalLatitude: req.body.decimalLatitude,
      decimalLongitude: req.body.decimalLongitude,
      institutionCode: req.body.institutionCode,
      identifiedBy: req.body.identifiedBy
    }, {
      where: {
        catalogNumber: req.body.catalogNumber
      }
    })
    .then(function(dbFasta){
      res.json(dbFasta)
    })
  }

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //get select records from db - queried on ID and make into a file
  const getSequencesForDownload = (req, res) => {
    Fasta.findAll({
      where: {
        id: req.params.id
      }
    })
      .then((data) => {
        res.send([`${date.yyyymmdd()}_FASTA-GEN.fasta`,`${date.yyyymmdd()}_FASTA-GEN_mods.txt`])
        for (let i =0; i < data.length; i++){
          console.log(Date.now())
          writeFASTA(`${date.yyyymmdd()}_FASTA-GEN.fasta`, data[i].dataValues)
          writeSourceMod(`${date.yyyymmdd()}_FASTA-GEN_mods.txt`, data[i].dataValues)
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving sequences from database.",
        });
      });
  };

//function that writes data to a FASTA file
function writeFASTA(fileName, data) {
    fs.appendFile(`./resources/static/assets/downloads/${fileName}`, `${generateFASTA(data)}`+`\n`, function(err) {
        if (err) {
            return console.log(err);
        }

        console.log("Success!")
    })
}


//function that writes data to a source modifier file
function writeSourceMod(fileName, data) {
    fs.appendFile(`./resources/static/assets/downloads/${fileName}`, `${generateSourceModData(data)}`+`\n`, function(err) {
      if (err) {
          return console.log(err);
      }

      console.log("Success!")
    })
}

//function that defines how to write the fasta file
function generateFASTA(data) {
    return `> ${data.catalogNumber} ${data.description}\n${data.sequence}`;
}

//function that defines how to write data the source modifier file
function generateSourceModData(data) {
  // format the date
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  let eventDate = new Date(data.eventDate)
  let month = (monthNames[eventDate.getMonth()])
  let day = eventDate.getDate()
  let year = eventDate.getFullYear()
  let formattedDate = `${day}-${month}-${year}`
  
  return `${data.catalogNumber}\t${data.recordedBy}\t${formattedDate}\t${data.country}\t${data.identifiedBy}\t${data.decimalLatitude} ${data.decimalLongitude}\t${data.institutionCode}:${data.collectionCode}:${data.catalogNumber}`;
}


//create the date object for the download file name
Date.prototype.yyyymmdd = function() {
  var mm = this.getMonth() + 1; // getMonth() is zero-based
  var dd = this.getDate();

  return [this.getFullYear(),
          (mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd
          ].join('');
};

var date = new Date();
console.log(date)

//function that creates the source modifier file
function createSourceMod(){
  const smHeaders = 'Sequence_ID\tCollected_by\tCollection_date\tCountry\tIdentified_by\tLat_Lon\tSpecimen_voucher\n'
  fs.writeFile(`./resources/static/assets/downloads/${date.yyyymmdd()}_FASTA-GEN_mods.txt`, smHeaders, function(err) {
    if (err) {
      return console.log(err);
    }
  })
}

//function that overwrites an existing FASTA file with a blank one.
function clearFasta(){
  const blank = ''
  fs.writeFile(`./resources/static/assets/downloads/${date.yyyymmdd()}_FASTA-GEN.fasta`, blank, function(err) {
    if (err) {
      return console.log(err);
    }
  })
}

//delete all existing files in downloads dir, and then create stub file for source mod, when page is loaded
const resetFiles = () => {
console.log("FILES RESET")
  //if the source mods file does not exist, run function to create it
  fs.access(`./resources/static/assets/downloads/${date.yyyymmdd()}_FASTA-GEN_mods.txt`, (err) => {
    if (err) {
      createSourceMod()
  // if it does exist, write over it
    } else {
      createSourceMod()
    }
  })
  //if the fasta file does not exist, do nothing
  fs.access(`./resources/static/assets/downloads/${date.yyyymmdd()}_FASTA-GEN_mods.txt`, (err) => {
    if (err) {
      console.log("all good")
  // if it does exist, write over it
    } else {
      clearFasta()
    }
  })
}



//create the source modifier file template

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//download the specified file
const downloadFile = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/resources/static/assets/downloads/";
  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file" + err,
      })
    }
  })
}
  
  module.exports = {
    upload,
    getSequences,
    updateSequences,
    getSequencesForDownload,
    downloadFile,
    resetFiles
  };