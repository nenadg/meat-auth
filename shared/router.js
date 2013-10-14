var home = require('../routes/index');
var users = require('../routes/users');
var authenticate = require('../routes/login');
var restrict = require('../auth/module').restrict;

module.exports = function(app) {
    app.get('*', function(res, req, next){
        res.header('X-XSS-Protection' ,  '1; mode=block');
        
        next(); // http://expressjs.com/guide.html#passing-route control
    });
    
    app.get('/', home.index);
    app.get('/login', authenticate.login);
    app.post('/login', authenticate.login);
    app.get('/logout', authenticate.logout);
    app.get('/users', restrict, users.list);
    
    app.get('/users/create', restrict, users.create);
    app.post('/users/create', restrict, users.create);
    app.get('/users/remove/:id', restrict, users.remove);
    app.post('/users/register', users.register);
    app.get('/users/update/:name', restrict, users.user);
    app.post('/users/update/', restrict, users.user);
}
