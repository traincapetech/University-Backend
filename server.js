const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const Contact = require("./models/Contact");
const User = require("./models/User");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/contact_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

app.post("/api/contact", async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(200).send("Message received. Thank you!");
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).send("Failed to save message.");
  }
});

app.post("/api/user", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).send("All fields are required.");
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Email already registered.");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).send("User registered successfully.");
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).send("Failed to register user.");
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Email and password are required.");
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("Invalid email or password.");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid email or password.");
    }
    res.status(200).send("Login successful.");
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Failed to login.");
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
