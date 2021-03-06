const express = require("express");
const router = express.Router();
const csvController = require("../controllers/fasta/csv");
const upload = require("../middlewares/upload");

let routes = (app) => {
    //POST /api/csv/upload
  router.post("/upload", upload.single("file"), csvController.upload);
    //GET /api/csv/sequences
  router.get("/sequences", csvController.getSequences);

  app.use("/api/csv", router);
};

module.exports = routes;