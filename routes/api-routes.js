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
  router.get("/sequences", csvController.getSequences);
  
  //PUT /api/csv/update
  router.put("/update", csvController.updateSequences);

  //GET /api/csv/sequencesDownload
  router.get("/sequencesDownload/:id", csvController.getSequencesForDownload);

  //GET /api/csv/files
  router.get("/files/:name", csvController.downloadFile);

  //reset files on backend
  router.post("/reset", csvController.resetFiles);

  //send user profile info to client
      //auth0 config vars
      const config = {
        authRequired: false,
        auth0Logout: true,
        secret: 'process.env.AUTH0_SECRET',
        baseURL: 'http://localhost:8080',
        clientID: process.env.AUTH0_ClientID,
        issuerBaseURL: 'https://dev-bh957c52.us.auth0.com'
    };
  
  //AUTH) MIDDLEWARE
  // auth router attaches /login, /logout, and /callback routes to the baseURL
  app.use(auth(config));
  
  //protected route
  router.get('/user', requiresAuth(), (req, res) => {
      res.send(req.oidc.user);
      console.log(req.oidc.user)
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


  app.use("/api/csv", router);
};

module.exports = routes;