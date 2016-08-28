"use strict";

const Project = require('../models/Project');
const Report = require('../models/Report');

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