//dependencies
const db = require("../../models");
const Fasta = db.fasta;
const fs = require("fs");
const csv = require("fast-csv");

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
  
  //get all records from db
  const getSequences = (req, res) => {
    Fasta.findAll()
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
      decimalLongitude: req.body.decimalLongitude
    }, {
      where: {
        catalogNumber: req.body.catalogNumber
      }
    })
    .then(function(dbFasta){
      res.json(dbFasta)
    })
  }

  //get select records from db - queried on ID
  const getSequencesForDownload = (req, res) => {
    Fasta.findAll({
      where: {
        id: req.params.id
      }
    })
      .then((data) => {
        for (let i =0; i < data.length; i++){
          console.log(data[i].dataValues)
          writeFASTA("FASTA-GEN.fasta", data[i].dataValues)
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
      fs.appendFile(fileName, `${generateFASTA(data)}`+`\n`, function(err) {
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

  
  module.exports = {
    upload,
    getSequences,
    updateSequences,
    getSequencesForDownload
  };