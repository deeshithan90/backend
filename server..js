const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const UserModel = require('./model/EnquriyModel');
const MongoDBConnect = require('./db/ConnectionDB');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connect
MongoDBConnect()

// POST /api/en -> Create enquiry
app.post('/api/en', async (req, res) => {
  try {
    const { FullName, Phone, Email, DisCribe } = req.body;
    if (!FullName || !Phone || !Email || !DisCribe) {
      return res.status(400).json({ message: 'Please enter all values', success: false });
    }

    const data = await UserModel.create({ FullName, Phone, Email, DisCribe });

    res.status(201).json({ message: 'Enquiry submitted successfully', success: true, data });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Phone or Email already exists', success: false });
    }
    res.status(500).json({ message: 'Server error', success: false, error: error.message });
  }
});

// POST /api/admin/login -> Admin login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    // In production use JWT or session
    return res.status(200).json({ success: true, message: 'Login successful' });
  } else {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// GET /api/admin/enquiries -> Get all enquiries
app.get('/api/admin/enquiries', async (req, res) => {
  try {
    const enquiries = await UserModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: enquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});