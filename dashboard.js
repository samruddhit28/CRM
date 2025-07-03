const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const Lead = require('../models/Lead');

router.get('/', authMiddleware, async (req, res) => {
  const role = req.user.role;
  const userId = req.user.id;

  try {
    if (role === 'Superadmin') {
      const totalUsers = await User.countDocuments({ role: 'User' });
      const totalAdmins = await User.countDocuments({ role: 'Admin' });
      const totalLeads = await Lead.countDocuments();

      const recentUsers = await User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email role');

      return res.json({
        role,
        totalUsers,
        totalAdmins,
        totalLeads,
        recentUsers
      });
    }

    if (role === 'Admin') {
      const totalLeads = await Lead.countDocuments();

      const leadsByStatus = await Lead.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);

      const statusBreakdown = {};
      leadsByStatus.forEach((item) => {
        statusBreakdown[item._id] = item.count;
      });

      return res.json({
        role,
        totalLeads,
        leadsByStatus: statusBreakdown
      });
    }

    if (role === 'User') {
      const myLeads = await Lead.find({ user: userId });

      const upcomingFollowups = myLeads
        .filter((lead) => lead.nextFollowUp && new Date(lead.nextFollowUp) >= new Date())
        .map((lead) => ({
          name: lead.name,
          nextFollowUp: lead.nextFollowUp
        }))
        .sort((a, b) => new Date(a.nextFollowUp) - new Date(b.nextFollowUp))
        .slice(0, 5);

      return res.json({
        role,
        myLeadCount: myLeads.length,
        upcomingFollowups
      });
    }

    return res.status(403).json({ message: 'Invalid role' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Dashboard error' });
  }
});

module.exports = router;
