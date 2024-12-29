const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Nodemailer configuration using environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,   // Your email address from .env file
    pass: process.env.EMAIL_PASS,   // Your App Password from .env file
  },
});

// Route to handle form submission
app.post('/api/appointments', (req, res) => {
  const { name, email, phone, service, message } = req.body;

  // Define email details
  const mailOptions = {
    from: process.env.EMAIL_USER,  // Sender email (from .env)
    to: 'info@teshengineeringconsultingltd.com',  // Recipient email
    subject: 'New Appointment Request',
    text: `You have a new appointment request from ${name}.\n\n
           Email: ${email}\n
           Phone: ${phone}\n
           Service: ${service}\n
           Message: ${message}`,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send('Error sending email');
    }
    console.log('Email sent: ' + info.response);
    res.status(200).send('Appointment booked successfully');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
