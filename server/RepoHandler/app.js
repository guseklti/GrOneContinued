var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var morgan = require('morgan');
var path = require('path');
var cors = require('cors');

// var mongoose = require('mongoose');

// =========== "npm run repohandler" ============//

// Variables

// Please only modify port here.
var repo_fetcher_port = process.env.PORT || 8001;

// var mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/urlDB';
//
// // Connect to MongoDB
// mongoose.connect(mongoURI, { useNewUrlParser: true }, function(err) {
//     if (err) {
//         console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`);
//         console.error(err.stack);
//         process.exit(1);
//     }
//     console.log(`Connected to MongoDB with URI: ${mongoURI}`);
// });


// Create Express app
var app = express();
//use cors to allow github
app.use(cors());
// Parse requests of content-type 'application/json'
app.use(bodyParser.json({limit: '500mb', extended: true}));
// HTTP request logger
app.use(morgan('dev'));
// Serve static assets (for frontend client)
var root = path.normalize(__dirname + '/..');
app.use(express.static(path.join(root, 'client')));
app.set('appPath', 'client');

// Import routes
app.use(require('./index'));

/**********TARGET SERVER **************/
// target server listens on different port than proxy server
// proxy server sends request to this port

// DISTRIBUTED
// let repo_fetcher = '192.168.43.168';      //want to replace this later with a constand from the constants file

// LOCAL TESTING - POINTS TO SELF
let repo_fetcher = '127.0.0.1';


app.listen(repo_fetcher_port, function(err) {
    if ( err ) throw err;
    console.log("repo_fetcher listening on port " + repo_fetcher_port);
});
/**************************************/

// Error handler (must be registered last)
var env = app.get('env');
app.use(function(err, req, res, next) {
    console.error(err.stack);
    var err_res = {
        "message": err.message,
        "error": {}
    };
    if (env === 'development') {
        err_res["error"] = err;
    }
    res.status(err.status || 500);
    res.json(err_res);
});

module.exports = app;
