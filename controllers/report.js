"use strict";

const Report = require('../models/Report');

exports.index = (req, res, next) => {

  var fileName = req.query.fileName;
  Report.findOne({ reportFileName: fileName }, (err, report) => {
    if (err) next(err);
    res.render('report', {
      title: 'Report',
      report: report
    });
  });
};