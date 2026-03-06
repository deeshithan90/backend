const express = require("express");
const cors = require("cors");
const UserModel = require("./model/EnquriyModel");
const MongoDBConnect = require("./db/ConnectDb");
const path = require('path')
const dotenv = require('dotenv')
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const verifyAdmin = require("./middleware/verifyadmin");

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser())

dotenv.config({path : path.join(__dirname,'.env')})

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

    const data = await UserModel.create({
      FullName,
      Phone,
      Email,
      DisCribe,
    });

    res.status(201).json({ success: true, data });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server crashed" });
  }
});


app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign(
      { username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: false, 
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid credentials",
  });
});

app.get("/api/admin/enquiries", verifyAdmin, async (req, res) => {
  try {
    const enquiries = await UserModel.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: enquiries,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch enquiries",
    });
  }
});


app.post("/api/accept-cookies", (req, res) => {
  res.cookie("cookieConsent", "true", {
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    httpOnly: false,
    sameSite: "Lax"
  });

  res.json({
    success: true,
    message: "Cookie consent saved"
  });
});

app.listen(process.env.PORT, () => {
  console.log(`server is run on ${process.env.PORT} in ${process.env.PORT}`)
  MongoDBConnect()
})