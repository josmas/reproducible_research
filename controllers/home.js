"use strict";

const fs = require('fs');
const Project = require('../models/Project');

exports.index = (req, res) => {

  fs.readdir('./uploads', function(err, files){
    var theFiles = [];
    if (!err) theFiles = files; // if there is an error, render with no files
    res.render('home', {
      title: 'Home',
      theFiles: theFiles
    });
  });
};

exports.postFileUpload = (req, res, next) => {
  const project = new Project({
    email: req.user.email,
    fileName: req.file.originalname,
    reportFileName: 'in_process'
  });

  project.save((err) => {
    if (err) { return next(err); }
    req.flash('success', { msg: 'File was uploaded successfully. Project created!' });
    console.log(req.file.originalname);
    res.render('home', {
      title: 'Home',
      originalname: req.file.originalname,
      theFiles: []
    });
  });
};