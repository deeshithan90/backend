const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");
const UserModel = require("../model/EnquiryModel");
const { default: ConnectionDB } = require("./db/ConnectDb");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/en", async (req, res) => {
  try {
    await ConnectionDB();

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

module.exports = app;
module.exports.handler = serverless(app);