const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  email: String,
  fileName: String,
  reportFileName: String
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;