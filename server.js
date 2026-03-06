const express = require("express");
const cors = require("cors");
const UserModel = require("./model/EnquriyModel");
const MongoDBConnect = require("./db/ConnectDb");
const path = require('path');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
const verifyAdmin = require('./middleware/verifyadmin');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Determine environment
const isProd = process.env.NODE_ENV === "production";

app.use(cors({
  origin: isProd 
    ? ["https://yourproductionfrontend.com"] 
    : ["http://localhost:5173"], // dev frontend
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// ----- ACCEPT COOKIES -----
app.post("/api/accept-cookies", (req, res) => {
  res.cookie("cookieConsent", "true", {
  maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
  httpOnly: false,    // frontend JS can read it
  secure: true,       // required for HTTPS
  sameSite: "None"    // required for cross-site cookies
});

  res.json({
    success: true,
    message: "Cookie consent saved"
  });
});

// ----- ENQUIRY FORM -----
app.post("/api/en", async (req, res) => {
  try {
    const consent = req.cookies.cookieConsent;

    if (!consent) {
      return res.status(403).json({
        success: false,
        message: "Please accept cookies before submitting data"
      });
    }

    const { FullName, Phone, Email, DisCribe } = req.body;
    if (!FullName || !Phone || !Email || !DisCribe) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    const data = await UserModel.create({ FullName, Phone, Email, DisCribe });
    res.status(201).json({ success: true, data });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server crashed" });
  }
});

// ----- ADMIN LOGIN -----
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: isProd ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(200).json({ success: true, message: "Login successful" });
  }

  return res.status(401).json({ success: false, message: "Invalid credentials" });
});

// ----- GET ENQUIRIES (ADMIN) -----
app.get("/api/admin/enquiries", verifyAdmin, async (req, res) => {
  try {
    const enquiries = await UserModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: enquiries });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to fetch enquiries" });
  }
});

// ----- START SERVER -----
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT} in ${process.env.NODE_ENV}`);
  MongoDBConnect();
});