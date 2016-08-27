"use strict";

const Project = require('../models/Project');

exports.index = (req, res) => {

  Project.find()
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
    fileName: req.file.originalname,
    reportFileName: 'in_process',
    description: req.body.description
  });

  project.save((err) => {
    if (err) { return next(err); }
    req.flash('success', { msg: 'File was uploaded successfully. Project created!' });
    console.log(req.file.originalname);
    res.render('home', {
      title: 'Home',
      originalname: req.file.originalname,
      projects: [project]
    });
  });
};