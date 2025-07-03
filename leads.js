const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const authMiddleware = require('../middleware/authMiddleware');

// Create a new lead
router.post('/', authMiddleware, async (req, res) => {
  try {
    const newLead = new Lead({ ...req.body, user: req.user.id });
    const savedLead = await newLead.save();
    res.status(201).json(savedLead);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all leads for the user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const leads = await Lead.find({ user: req.user.id });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a lead
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a lead
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Lead.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: 'Lead deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;