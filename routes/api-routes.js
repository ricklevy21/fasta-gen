const express = require("express");
const router = express.Router();
const csvController = require("../controllers/fasta/csv");
const upload = require("../middlewares/upload");
const { auth, requiresAuth } = require('express-openid-connect');
require('dotenv').config();



let routes = (app) => {
  //POST /api/csv/upload
  router.post("/upload", upload.single("file"), csvController.upload);
    
  //GET /api/csv/sequences
  router.get("/sequences/:nickname", csvController.getSequences);

  //GET /api/csv/ITS
  router.get("/ITS/:nickname", csvController.getITSSequences);
 
  //GET /api/csv/ITS1
  router.get("/ITS1/:nickname", csvController.getITS1Sequences);
 
  //GET /api/csv/ITS2
  router.get("/ITS2/:nickname", csvController.getITS2Sequences);
 
  //GET /api/csv/SSU
  router.get("/SSU/:nickname", csvController.getSSUSequences);
 
  //GET /api/csv/LSU
  router.get("/LSU/:nickname", csvController.getLSUSequences);  
  
  //PUT /api/csv/update
  router.put("/update", csvController.updateSequences);

  //GET /api/csv/sequencesDownload
  router.get("/sequencesDownload/:id", csvController.getSequencesForDownload);

  //GET /api/csv/files
  router.get("/files/:name", csvController.downloadFile);

  //truncate fasta and mods files on backend
  router.post("/truncateFiles", csvController.truncateFiles);

  // //delete user generated files on backend
  // router.post("/deleteFiles", csvController.deleteFiles);

  //prepend the headers to the source mod file
  router.post("/createSourceMod", csvController.createSourceMod);


  //send user profile info to client
      //auth0 config vars
      const config = {
        authRequired: false,
        auth0Logout: true,
        secret: process.env.AUTH0_SECRET,
        baseURL: process.env.AUTH0_BASEURL,
        clientID: process.env.AUTH0_ClientID,
        issuerBaseURL: 'https://dev-bh957c52.us.auth0.com'
    };


	
  
  //AUTH) MIDDLEWARE
  // auth router attaches /login, /logout, and /callback routes to the baseURL
  app.use(auth(config));
  
  //protected route
  router.get('/user', requiresAuth(), (req, res) => {
      res.send(req.oidc.user);
    });

  //views
    //index
    app.get('/', (req, res) => {
      res.render("index");
    });

    //user
    app.get('/user', requiresAuth(),(req, res) => {
      res.render("user");
    });

    //template
    app.get('/template', (req, res) => {
      res.render("template")
    })


  app.use("/api/csv", router);
};

module.exports = routes;