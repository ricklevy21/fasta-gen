//dependencies
const db = require("../../models");
const Fasta = db.fasta;
const fs = require("fs");
const csv = require("fast-csv");
const baseUrl = "http://localhost:8080/files/";
const { Op } = require("sequelize");
const findRemoveSync = require('find-remove')


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
            err.message || "Some error occurred while retrieving sequences." 
        });
      });
  };

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//get all ITS records from db
const getITSSequences = (req, res) => {
  Fasta.findAll(
    {
    where: {
      user: req.params.nickname,
      ITS: {
        [Op.or]: {
          [Op.not]: null,
          [Op.not]: ""
        }
      }
    }
  }
  )
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving sequences." 
      });
    });
};
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//get all ITS1 records from db
const getITS1Sequences = (req, res) => {
  Fasta.findAll(
    {
    where: {
      user: req.params.nickname,
      ITS1: {
        [Op.or]: {
          [Op.not]: null,
          [Op.not]: ""
        }
      }
    }
  }
  )
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving sequences." 
      });
    });
};
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//get all ITS2 records from db
const getITS2Sequences = (req, res) => {
  Fasta.findAll(
    {
    where: {
      user: req.params.nickname,
      ITS2: {
        [Op.or]: {
          [Op.not]: null,
          [Op.not]: ""
        }
      }
    }
  }
  )
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving sequences." 
      });
    });
};
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//get all SSUrRNA_18s records from db
const getSSUSequences = (req, res) => {
  Fasta.findAll(
    {
    where: {
      user: req.params.nickname,
      SSUrRNA_18s: {
        [Op.or]: {
          [Op.not]: null,
          [Op.not]: ""
        }
      }
    }
  }
  )
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving sequences." 
      });
    });
};
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//get all LSUrRNA_28s records from db
const getLSUSequences = (req, res) => {
  Fasta.findAll(
    {
    where: {
      user: req.params.nickname,
      LSUrRNA_28s: {
        [Op.or]: {
          [Op.not]: null,
          [Op.not]: ""
        }
      }
    }
  }
  )
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving sequences." 
      });
    });
};
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //update db records with data from gbif
  const updateSequences = (req, res) => {
    Fasta.update({
      scientificName: req.body.scientificName,
      species: req.body.species,
      genus: req.body.genus,
      specificEpithet: req.body.specificEpithet,
      infraspecificEpithet: req.body.infraspecificEpithet,
      taxonRank: req.body.taxonRank,
      collectionCode: req.body.collectionCode,
      family: req.body.family,
      eventDate: req.body.eventDate,
      recordedBy: req.body.recordedBy,
      country: req.body.country,
      waterBody: req.body.waterBody,
      stateProvince: req.body.stateProvince,
      county: req.body.county,
      municipality: req.body.municipality,
      locality: req.body.locality,
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
        //console.log(data)
        res.send([`${date.yyyymmdd()}_Specimods.fasta`,`${date.yyyymmdd()}_Specimods_mods.txt`])
        for (let i =0; i < data.length; i++){
          //console.log(Date.now())
          writeFASTA(`${date.yyyymmdd()}_Specimods.fasta`, data[i].dataValues)
          writeSourceMod(`${date.yyyymmdd()}_Specimods_mods.txt`, data[i].dataValues)
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
    })
}


//function that writes data to a source modifier file
function writeSourceMod(fileName, data) {
    fs.appendFile(`./resources/static/assets/downloads/${fileName}`, `${generateSourceModData(data)}`+`\n`, function(err) {
      if (err) {
          return console.log(err);
      }
    })
}

//function that defines how to write the fasta file
function generateFASTA(data) {
  //console.log(data)
  if (data.ITS != ""){
    return `> ${data.SeqID} [organism=${data.genus} ${data.specificEpithet}] ${data.scientificName} Specimen Voucher ${data.catalogNumber} ${data.sequenceTitle}\n${data.ITS}`;
  } else if (data.ITS1 != ""){
    return `> ${data.SeqID} [organism=${data.genus} ${data.specificEpithet}] ${data.scientificName} Specimen Voucher ${data.catalogNumber} ${data.sequenceTitle}\n${data.ITS1}`;
  }else if (data.ITS2 != ""){
    return `> ${data.SeqID} [organism=${data.genus} ${data.specificEpithet}] ${data.scientificName} Specimen Voucher ${data.catalogNumber} ${data.sequenceTitle}\n${data.ITS2}`;
  }else if (data.SSUrRNA_18s != ""){
    return `> ${data.SeqID} [organism=${data.genus} ${data.specificEpithet}] ${data.scientificName} Specimen Voucher ${data.catalogNumber} ${data.sequenceTitle}\n${data.SSUrRNA_18s}`;
  }else if (data.LSUrRNA_28s != ""){
    return `> ${data.SeqID} [organism=${data.genus} ${data.specificEpithet}] ${data.scientificName} Specimen Voucher ${data.catalogNumber} ${data.sequenceTitle}\n${data.LSUrRNA_28s}`;
  }
}

//function that defines how to write data the source modifier file
function generateSourceModData(data) {
  //console.log(data)
  // format the date
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  let eventDate = new Date(data.eventDate)
  let month = (monthNames[eventDate.getMonth()])
  let day = eventDate.getDate()
  let year = eventDate.getFullYear()
  let formattedDate = `${day}-${month}-${year}`
  
  return `${data.SeqID}\t${data.genus}\s${data.specificEpithet}\t${data.recordedBy}\t${formattedDate}\t${data.country}: ${data.stateProvince}, ${data.county}, ${data.locality}\t${data.identifiedBy}\t${data.decimalLatitude} ${data.decimalLongitude}\t${data.institutionCode}:${data.collectionCode}:${data.catalogNumber}`;
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

function createSourceMod(){
    const smHeaders = 'Sequence_ID\tOrganism\tCollected_by\tCollection_date\tCountry\tIdentified_by\tLat_Lon\tSpecimen_voucher\n'
    //var data = fs.readFileSync(`./resources/static/assets/downloads/${date.yyyymmdd()}_Specimods_mods.txt`); //read existing contents into data
    var fd = fs.openSync(`./resources/static/assets/downloads/${date.yyyymmdd()}_Specimods_mods.txt`, 'w+');
    var buffer = Buffer.from(smHeaders);
    fs.writeSync(fd, buffer, 0, buffer.length, 0); //write new data
    //fs.writeSync(fd, data, 0, data.length, buffer.length); //append old data
    // or fs.appendFile(fd, data);
    //fs.close(fd);
  }

//function to truncate FASTA and Source Modifier files
function truncateFiles(){
  //let modsFileName =  `resources/static/assets/downloads/${date.yyyymmdd()}_Specimods_mods.txt`
  let fastaFileName = `resources/static/assets/downloads/${date.yyyymmdd()}_Specimods.fasta`
  fs.truncate(fastaFileName, 0, function(){console.log('fasta truncated')})
  //fs.truncate(modsFileName, 0, function(){console.log('mods truncated')})
  }

// //function to delete the FASTA and Source Modifier files once meet the specified age
// function deleteFiles(){
//     var result = findRemoveSync('./resources/static/assets/downloads', {
//         age: { seconds: 60 },
//         extensions: ['.fasta', '.txt'],
//         limit: 100
//       })
//       console.log(">>>DELETING OLD FILES")
// }


// //function that overwrites an existing FASTA file with a blank one.
// function clearFasta(){
//   const blank = ''
//   fs.writeFile(`./resources/static/assets/downloads/${date.yyyymmdd()}_FASTA-GEN.fasta`, blank, function(err) {
//     if (err) {
//       return console.log(err);
//     }
//   })
// }

// //delete all existing files in downloads dir, and then create stub file for source mod, when page is loaded
// const resetFiles = () => {
// console.log("FILES RESET")
//   //if the source mods file does not exist, run function to create it
//   fs.access(`./resources/static/assets/downloads/${date.yyyymmdd()}_FASTA-GEN_mods.txt`, (err) => {
//     if (err) {
//       createSourceMod()
//       console.log("source mods file does not exist - creating one")
//   // if it does exist, write over it
//     } else {
//       console.log("writing over source mods file")
//       createSourceMod()
//     }
//   })
//   //if the fasta file does not exist, do nothing
//   fs.access(`./resources/static/assets/downloads/${date.yyyymmdd()}_FASTA-GEN_mods.txt`, (err) => {
//     if (err) {
//       console.log("all good")
//   // if it does exist, write over it
//     } else {
//       clearFasta()
//     }
//   })
// }

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
    getITSSequences,
    getITS1Sequences,
    getITS2Sequences,
    getSSUSequences,
    getLSUSequences,
    updateSequences,
    getSequencesForDownload,
    downloadFile,
    truncateFiles,
    //deleteFiles,
    createSourceMod
    //resetFiles

  };