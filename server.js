const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const leadRoutes = require('./routes/leads');
const superadminRoutes = require('./routes/superadmin');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/leads',leadRoutes);
app.use('/api/superadmin', superadminRoutes);
app.use('/api/dashboard', dashboardRoutes);


// Test route
app.get('/', (req, res) => {
  res.send('CRM Backend is running');
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log('Server running on port',PORT));
})
.catch((err) => console.error('MongoDB connection error:', err));