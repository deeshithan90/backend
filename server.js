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

app.listen(process.env.PORT, () => {
  console.log(`server is run on ${process.env.PORT} in ${process.env.PORT}`)
  MongoDBConnect()
})