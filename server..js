const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const UserModel = require('../model/EnquiryModel');
const MongoDBConnect = require('./db/ConnectionDB');

const app = express();
app.use(cors());
app.use(express.json());

// POST /api/en -> Create enquiry
app.post('/api/en', async (req, res) => {
  try {
    await MongoDBConnect(); // ensure connection
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

// Other routes...
app.post('/api/admin/login', async (req, res) => {
  try {
    await MongoDBConnect();
    const { username, password } = req.body;
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
      return res.status(200).json({ success: true, message: 'Login successful' });
    }
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

app.get('/api/admin/enquiries', async (req, res) => {
  try {
    await MongoDBConnect();
    const enquiries = await UserModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: enquiries });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Export serverless handler
module.exports = app;
module.exports.handler = serverless(app);