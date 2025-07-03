const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const superadminMiddleware = require('../middleware/superadminMiddleware');

router.post('/create-user', authMiddleware, superadminMiddleware, async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!['Admin', 'User'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role. Must be Admin or User.' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: `${role} created successfully` });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
// Superadmin-only: View all users or filter by role
router.get('/users', authMiddleware, superadminMiddleware, async (req, res) => {
    try {
      const { role } = req.query;
  
      let filter = {};
      if (role) {
        filter.role = role; // filter by role if provided
      }
  
      const users = await User.find(filter).select('-password');
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  

module.exports = router;
