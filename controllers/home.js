"use strict";

const Project = require('../models/Project');
const Report = require('../models/Report');
const nodegit = require('nodegit');
const fse = require('fs-extra');

exports.index = (req, res) => {

  Project.find()
      .sort({ _id: -1 })
      .exec((err, projects) => {
        var theProjects = [];
        if (!err) theProjects = projects; // if there is an error, render with no files
        res.render('home', {
          title: 'Home',
          projects: theProjects
        });
      });
};

function callReportProgram(callback){
  const exec = require('child_process').exec;
  //TODO This will be a call to the golang program running on the server.
  exec('cat *.js | grep require', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return callback(error);
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
    //TODO How to deal with stderr?
    callback(null, stdout);
  });
}

function initRepo(fileSystemName, repoName, callback){

  var repo;
  var index;
  var oid;

  fse.copy(fileSystemName, './repos/' + repoName + '/' + repoName, function (err) {
    if (err) return console.error(err);
    var pathToRepo = require("path").resolve("./repos/" + repoName);
    var isBare = 0;
    nodegit.Repository.init(pathToRepo, isBare).then(function (theRepo) {
      repo = theRepo;
      return theRepo.index();
    })
    .then(function(indexResult) {
      index = indexResult;
      return index.read(1);
    })
    .then(function() {
      return index.addByPath(repoName);
    })
    .then(function() {
      return index.write();
    })
    .then(function() {
      return index.writeTree();
    })
    .then(function(oidResult) {
      var author = nodegit.Signature.create("Scott Chacon", "reproducible_research@gmail.com", 123456789, 60);
      var committer = nodegit.Signature.create("Scott A Chacon", "reproducible_research@github.com", 987654321, 90);

      return repo.createCommit("HEAD", author, committer, "Initial import of Dataset from upload", oidResult, []);
    })
    .then(function(commitId) {
      return callback(null, commitId);
    })
    .catch(function (reasonForFailure) {
      // If the repo cannot be created for any reason we can handle that case here.
      console.log(reasonForFailure); //TODO Set the Project repo URL to failed?
      callback(reasonForFailure);
    });
  });

}

exports.postFileUpload = (req, res, next) => {

  console.log(req.file.filename);
  const project = new Project({
    email: req.user.email,
    fileSystemName: req.file.path,
    fileName: req.file.originalname,
    reportFileName: req.file.filename,
    description: req.body.description
  });

  // This is an Async call that will be ready at some stage, so we won't block the UI for this. Just let it process.
  // If the user attempts to see the report before it's been saved, they will be informed that it does not exist yet.
  callReportProgram(function(err, data){

    //TODO FAKING the data for now
    data = require('../test/report_data.json');
    if (err) return next(err);
    const report = new Report({
      fileSystemName: req.file.path,
      fileName: req.file.originalname,
      reportFileName: req.file.filename,
      description: req.body.description,
      data: data
    });

    report.save((err) => {
      if (err) { return next(err); }
    });
  });

  // This is also Async; goes off and makes a git repo
  initRepo(project.fileSystemName, project.reportFileName, function(err, commitId){
    console.log('Repo is all done; if it Worked!!! Commit Id: ' + commitId);
  });

  project.save((err) => {
    if (err) { return next(err); }
    req.flash('success', { msg: 'File was uploaded successfully. Project created!' });
    res.render('home', {
      title: 'Home',
      originalname: req.file.originalname,
      projects: [project]
    });
  });
};