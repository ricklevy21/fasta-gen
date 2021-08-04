//VIEW ROUTES FOR SERVING UP PAGE TEMPLATES
const { auth, requiresAuth } = require('express-openid-connect');

module.exports = function (app) {
    
    //auth0 config vars
    const config = {
        authRequired: false,
        auth0Logout: true,
        secret: '886a6498ec7c61b35588735ce6df51d698578dee0d27a531aa56997ceec48059',
        baseURL: 'http://localhost:8080',
        clientID: 'i4WoV5MLZw1KreLv6fQAosz5tO3X4WZN',
        issuerBaseURL: 'https://dev-bh957c52.us.auth0.com'
    };
    
    // auth router attaches /login, /logout, and /callback routes to the baseURL
    app.use(auth(config));
    
    //protected route
    app.get('/', requiresAuth(), (req, res) => {
        res.render("index");
      });
    
    
}