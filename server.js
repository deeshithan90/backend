const express = require("express");
const cors = require("cors");
const UserModel = require("./model/EnquriyModel");
const MongoDBConnect = require("./db/ConnectDb");
const path = require('path')
const dotenv = require('dotenv')

const app = express();

app.use(cors());
app.use(express.json());

dotenv.config({path : path.join(__dirname,'.env')})

app.post("/api/en", async (req, res) => {
  try {
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

app.get("/api/admin/enquiries", async (req, res) => {
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

app.listen(process.env.PORT, () => {
  console.log(`server is run on ${process.env.PORT} in ${process.env.PORT}`)
  MongoDBConnect()
})