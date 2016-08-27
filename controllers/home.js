"use strict";

const fs = require('fs');

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
  req.flash('success', { msg: 'File was uploaded successfully.' });
  console.log(req.file.originalname);
  res.render('home', {
    title: 'Home',
    originalname: req.file.originalname,
    theFiles: []
  });
};