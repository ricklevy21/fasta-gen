//VIEW ROUTES FOR SERVING UP PAGE TEMPLATES
const { auth, requiresAuth } = require('express-openid-connect');
require('dotenv').config()


module.exports = function (app) {
    
    //auth0 config vars
    const config = {
        authRequired: false,
        auth0Logout: true,
        secret: process.env.AUTH0_SECRET,
        baseURL: 'http://localhost:8080',
        clientID: process.env.AUTH0_ClientID,
        issuerBaseURL: 'https://dev-bh957c52.us.auth0.com'
    };
    
    // auth router attaches /login, /logout, and /callback routes to the baseURL
    app.use(auth(config));
    
    //protected route
    app.get('/', requiresAuth(), (req, res) => {
        res.render("index");
      });
    
    
}