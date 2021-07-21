//dependencies
const express = require("express");
const exphbs = require("express-handlebars");
const fs = require("fs");

// require models for syncing
const db = require("./models");


//create express server
const app = express();

//define PORT where server will listen for requests (production || developement)
var PORT = process.env.PORT || 8080;

//set the global root dir
global.__basedir = __dirname + "/.";

//set up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// define static directory
app.use(express.static("public"));

// setup handelbars
app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

//routes
const initRoutes = require("./routes/api-routes");
//api routes for handling data exchanges
initRoutes(app);
require("./routes/view-routes.js")(app);

// start the server. {force:true} drops the tables from exisiting db. {force:false} keeps the existing db and tables and data in place
db.sequelize.sync({
  force: false
}).then(function () {
  app.listen(PORT, function () {
      console.log("App listening at http://localhost:" + PORT);
  });
});