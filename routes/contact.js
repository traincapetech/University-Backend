const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(400).send("All fields are required.");
    }


    const newContact = new Contact({ name, email, subject, message });
    await newContact.save();

    res.status(200).send("Message received. Thank you!");
  } catch (error) {
    console.error("Error saving contact message:", error);
    res.status(500).send("Failed to save message.");
  }
});

module.exports = router;
