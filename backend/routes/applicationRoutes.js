const express = require('express');
const mongoose = require('mongoose');
const Application = require('../models/Application');
const Job = require('../models/Job');

const router = express.Router();

// Submit a new application
router.post('/', async (req, res) => {
  const { jobId, name, email, coverLetter } = req.body;

  const session = await mongoose.startSession({ readConcern: { level: 'local' } }); // Weakest isolation level
  session.startTransaction();

  try {
    // Check if jobId exists
    const job = await Job.findById(jobId).session(session);
    if (!job) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: 'Job not found' });
    }

    // Save the new application
    const application = new Application({ jobId, name, email, coverLetter });
    await application.save({ session });

    await session.commitTransaction();
    session.endSession();
    res.status(201).json(application);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error submitting application:", error.message);
    res.status(500).json({ error: 'Could not submit application. Please try again.' });
  }
});

// Get all applications by the applicant
router.get('/', async (req, res) => {
  const session = await mongoose.startSession({ readConcern: { level: 'local' } });
  session.startTransaction();

  try {
    const applications = await Application.find().populate({
      path: 'jobId',
      populate: { path: 'company' },
    }).session(session);

    await session.commitTransaction();
    session.endSession();
    res.json(applications);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error fetching applications:", error.message);
    res.status(500).json({ error: 'Could not fetch applications. Please try again.' });
  }
});

// Edit an application
router.put('/:id', async (req, res) => {
  const { coverLetter } = req.body;

  const session = await mongoose.startSession({ readConcern: { level: 'local' } });
  session.startTransaction();

  try {
    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      { coverLetter },
      { new: true }
    ).session(session);

    if (!updatedApplication) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: 'Application not found' });
    }

    await session.commitTransaction();
    session.endSession();
    res.json(updatedApplication);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error editing application:", error.message);
    res.status(500).json({ error: 'Could not edit application. Please try again.' });
  }
});

// Delete an application
router.delete('/:id', async (req, res) => {
  const session = await mongoose.startSession({ readConcern: { level: 'local' } });
  session.startTransaction();

  try {
    const deletedApplication = await Application.findByIdAndDelete(req.params.id).session(session);
    if (!deletedApplication) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: 'Application not found' });
    }

    await session.commitTransaction();
    session.endSession();
    res.json({ message: 'Application deleted' });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error deleting application:", error.message);
    res.status(500).json({ error: 'Could not delete application. Please try again.' });
  }
});

module.exports = router;
