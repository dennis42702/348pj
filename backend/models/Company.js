
const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  companyId: { type: String, required: true, unique: true }, // Unique identifier for each company
});

module.exports = mongoose.model('Company', companySchema);
