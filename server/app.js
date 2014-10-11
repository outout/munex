/**
 * Created by pipas on 28.9.14..
 */

// app.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express'); // call express
var path = require('path');
var compress = require('compression');
var bodyParser = require('body-parser');
var linkRoutes = require ('./routes/link');

var app        = express(); 				// define our app using express

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// should be placed before express.static
app.use(compress({
    filter: function (req, res) {
        return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
    },
    level: 9
}));

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..')));

var port = process.env.PORT || 8080; 		// set our port
app.set('port', port);

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 				// get an instance of the express Router


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);
app.use('/link', linkRoutes());

// START THE SERVER
// =============================================================================
//app.listen(port);
console.log('Magic happens on port ' + port);

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
