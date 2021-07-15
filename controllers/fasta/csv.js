//dependencies
const db = require("../../models");
const Fasta = db.fasta;
const fs = require("fs");
const csv = require("fast-csv");

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
        catlogNumber: req.body.catalogNumber
      }
    })
    .then(function(dbFasta){
      res.json(dbFasta)
    })
  }
  
  module.exports = {
    upload,
    getSequences,
    updateSequences
  };