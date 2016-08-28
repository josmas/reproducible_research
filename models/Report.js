const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  fileSystemName: String,
  fileName: String,
  description: String,
  data: {
    data_one: String,
    data_two: String,
    data_three: String
  }
}, { timestamps: true });

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;