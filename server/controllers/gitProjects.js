var express = require("express");
var router = express.Router();
//library to work with the api
var downloadRepo = require('download-git-repo');
var rimraf = require('rimraf');

// Return a list of all projects
router.get("/", function(req, res, next) {
  gitProject.find(function(err, gitProjects) {
    if (err) {
      return next(err);
    }
    res.json({ gitProjects });
  });
});

// Method to download the repo to the filesystem
router.post("/", function(req, res, next) {
  // the strings that we get from the front end
  var owner = req.body.owner;
  var repo = req.body.repo;
  var repoUrl = owner + "/" + repo;
  //The place to download the repo
  var destination = process.cwd() + '/repository' + "/" + repo;
  console.log("destination:           " + destination)
    //function to clear destination 
    rimraf(destination, function() {
      console.log("destination directory cleared.")
   })
   //Actual method that downloads the files taking as input: owner/repo,directory.
    downloadRepo(repoUrl, destination, function (err) {
      console.log(err ? 'Error': 'Successfully downloaded repository.')
      if (err) {
        return next(err);
      }
   })
   res.status(201).json("Project Downloaded.");

});




module.exports = router;
