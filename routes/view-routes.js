//VIEW ROUTES FOR SERVING UP PAGE TEMPLATES

module.exports = function (app) {

    app.get("/", function(req, res) {
        res.render("index")
    })
}