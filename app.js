require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Environment variables
const PORT = process.env.PORT || 3000;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Appointment Booking API");
});

// API route
app.post("/api/appointment", (req, res) => {
  const { name, email, mobile, service, message } = req.body;

  if (!name || !email || !mobile || !service || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Log the incoming request for debugging
  console.log("Appointment Request:", req.body);

  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: "Appointment Confirmation",
    text: `Hello ${name},\n\nThank you for booking an appointment for "${service}". We will contact you shortly.\n\nYour Message: ${message}\n\nContact Number: ${mobile}\n\nRegards,\nTesh Engineering Consulting`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Error sending email:", err);
      return res.status(500).json({ error: "Failed to send email." });
    }
    console.log("Email sent:", info.response);
    res.status(200).json({ message: "Appointment booked successfully!" });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
