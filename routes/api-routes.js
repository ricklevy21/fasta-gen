//IMPORT DEPENDENCIES
var db = require("../models");

module.exports = function(app) {
    // @route: GET /
    // @desc: Read all records from the fasta table
    app.get("/api/fasta", function(req, res) {
        db.Fasta.findAll({
        }).then(function(dbFasta) {
            res.json(dbFasta);
        });
    });

    // @route: POST /
    // @desc: Add one record to the fasta table
    app.post("/api/fasta", function(req, res) {
        db.Fasta.bulkCreate(req.body).then(function(dbFasta) {
            res.json(dbFasta);
        });
    });
};