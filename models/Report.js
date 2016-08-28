const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  fileSystemName: String,
  fileName: String,
  description: String,
  reportFileName: String,
  data: String
}, { timestamps: true });

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;