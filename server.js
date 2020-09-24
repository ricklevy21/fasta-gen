//dependencies
var express = require("express");
var exphbs = require("express-handlebars");

//create the server
var app = express();

//define the PORT
var PORT = process.env.PORT || 8080;

//require db models for syncing
var db = require("./models");

//set up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//set the static directory
app.use(express.static("public"));

// setup handelbars
app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// routes
require("./routes/api-routes.js")(app);
//require("./routes/view-routes.js")(app);

// start the server
db.sequelize.sync({
    force: false
}).then(function () {
    app.listen(PORT, function () {
        console.log("App listening at http://localhost:" + PORT);
    });
});

