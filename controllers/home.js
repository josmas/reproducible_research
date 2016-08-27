"use strict";

const Project = require('../models/Project');

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

exports.postFileUpload = (req, res, next) => {
  const project = new Project({
    email: req.user.email,
    fileSystemName: req.file.path,
    fileName: req.file.originalname,
    reportFileName: 'in_process',
    description: req.body.description
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