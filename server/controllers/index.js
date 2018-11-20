var path = require('path');
var express = require('express');
var router = express.Router()

router.use('/api/urls', require('./url_inputs.js'));

//gets to actual repository using the url
router.use('/api/repos', require('./repofetcher/repos.js'))

/***********PROXY SERVER**************************/
var httpProxy = require('http-proxy');
var apiProxy = httpProxy.createProxyServer();
// IP address of target server. should be designated in proxy server.
var serverOne = 'http://192.168.1.101:8001';
var filterDataServer = 'http://localhost:8002';

router.all("/app1/*", function ( req, res ) {
    console.log("fetch repo server");
    apiProxy.web(req, res, { target : serverOne} );
});
/*************************************************/

router.route('/').get(function (req, res) { //??
    res.sendfile(req.app.get('appPath') + '/index.html');
});

// Insert routes below
//router.use('/api/camels', require('./camels'));

// All other routes redirect to the index.html
// router.route('/owner').get(function (req, res) {
//     res.sendfile(req.app.get('appPath') + '/owner.html');
// });

// router.route('/buyer').get(function (req, res) {
//     res.sendfile(req.app.get('appPath') + '/buyer.html');
// });

router.route('/*').get(function (req, res) {
    var relativeAppPath = req.app.get('appPath');
    var absoluteAppPath = path.resolve(relativeAppPath);
    res.sendFile(absoluteAppPath + '/index.html');
});

router.get('/api', function(req, res) {
    res.json({"message": "Welcome to your backend"});
});

module.exports = router
