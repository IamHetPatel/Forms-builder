require('dotenv').config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
require("./db/conn");
const bcrypt = require("bcrypt");
// const cookie = require("js-cookie")
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');

app.use(cookieParser())
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

const Register = require("./models/register");

// Register route
app.post("/api/register", async (req, res) => {
  try {
      const { name, email, username, password } = req.body;
      const userExists = await Register.findOne({ email });
      if (userExists) {
          return res.status(400).json({ error: "User already exists" });
      }
      const newUser = new Register({ name, email, username, password });
      const token = await newUser.generateAuthToken();
      res.cookie("jwt", token, {
          expires: new Date(Date.now() + 86400000), // 24 hours
          httpOnly: true
      });
      await newUser.save();
      res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

// Login route
app.post("/api/login", async (req, res) => {
  try {
      const { email, password } = req.body;
      const user = await Register.findOne({ email });
      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(401).json({ error: "Invalid credentials" });
      }
      const token = await user.generateAuthToken();
      res.cookie("jwt", token, {
          expires: new Date(Date.now() + 86400000), // 24 hours
          httpOnly: true
      });
      res.status(200).json({ message: "Logged in successfully", token });
  } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

// Logout route
app.post("/api/logout", async (req, res) => {
  try {
      res.clearCookie("jwt");
      res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
      console.error("Error logging out:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`server is running at port ${PORT}`);
});
