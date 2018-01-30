const controllers = require('../controllers');
const restrictedPages = require('./auth');

module.exports = app => {
    app.get('/', controllers.home.index);
    app.get('/about', restrictedPages.hasRole('Admin'), controllers.home.about);
    app.get('/loginRegister', controllers.user.registerGet);
    app.post('/register', controllers.user.registerPost);
    app.post('/logout', controllers.user.logout);
    app.get('/loginRegister', controllers.user.loginGet);
    app.post('/login', controllers.user.loginPost);


    //Add  hotel

    app.get('/addHotel', controllers.hotel.getAddHotelView);
    app.post('/addHotel', controllers.hotel.addHotel);

    app.get('/details', controllers.hotel.getDetails)
    app.get('/like/:id', controllers.hotel.likeDislike)

    app.all('*', (req, res) => {
        res.status(404);
        res.send('404 Not Found');
        res.end();
    });
};