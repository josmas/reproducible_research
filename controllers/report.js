"use strict";

const Report = require('../models/Report');

exports.index = (req, res, next) => {

  var fileName = req.query.fileName;
  console.log(req.query.fileName);
  Report.findOne({ fileName: fileName}, (err, report) => {
    console.log(err);
    console.log(report);
    if (err) next(err);
    res.render('report', {
      title: 'Report',
      report: report
    });
  });
};

exports.createReport = (req, res, next) => {

  //TODO Create a fake project for now, just to be able to list them!
  const report = new Report({
    fileSystemName: 'a file path that is different from the previous one and the previous one',
    fileName: 'original name again and again and again',
    description: 'a fake description with more stuff that is the third one now'
  });

  report.save((err) => {
    if (err) { return next(err); }
    req.flash('success', { msg: 'Report was created successfully.' });
    res.render('report', {
      title: 'Report',
      report: [report]
    });
  });
};