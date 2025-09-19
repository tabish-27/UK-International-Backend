const express = require('express');
const cors = require('cors');
const enquiryRoutes = require('./routes/enquiryRoutes');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();
require('./config/db');

const app = express();

// Middleware
app.use(cors({
  origin: ["https://ukinternationalbeautyschool.com", "http://localhost:5173"],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api', enquiryRoutes);
app.use('/api', authRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));