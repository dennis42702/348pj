
const express = require('express');
const Job = require('../models/Job');
const Company = require('../models/Company'); // Import the Company model

const router = express.Router();

// Route to create a new job and associate it with a company
router.post('/', async (req, res) => {
  const { title, description, requirements, companyId, companyName } = req.body;
  try {
    // Find or create the company by companyId
    let company = await Company.findOne({ companyId });
    if (!company) {
      company = new Company({ name: companyName, companyId });
      await company.save();
    }

    // Create the job and link it to the company
    const job = new Job({
      title,
      description,
      requirements,
      company: company._id, // Link job to the company
    });
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    console.error("Error creating job:", error.message);
    res.status(500).json({ error: 'Could not create job. Please try again.' });
  }
});

// Route to get all jobs with optional sorting and populate company details
router.get('/', async (req, res) => {
  const { sortBy = 'title', order = 'asc' } = req.query;
  const sortOptions = { [sortBy]: order === 'asc' ? 1 : -1 };

  try {
    // Populate 'company' 
    const jobs = await Job.find().populate('company').sort(sortOptions);
    res.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error.message);
    res.status(500).json({ error: 'Could not fetch jobs. Please try again.' });
  }
});

module.exports = router;
