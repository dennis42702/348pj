
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    requirements: String,
    postingDate: { type: Date, default: Date.now },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true }, // Reference to Company model
});

module.exports = mongoose.model('Job', jobSchema);
