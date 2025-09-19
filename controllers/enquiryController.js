const Lead = require('../models/Lead');
const axios = require('axios');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.submitEnquiry = async (req, res) => {
  try {
    const { name, phone, city, course, source } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required' });
    }

    const lead = new Lead({ name, phone, city, course, source });
    await lead.save();

    // WhatsApp message via Interakt.ai - CORRECTED
    const interaktUrl = 'https://api.interakt.ai/v1/public/message/';
    await axios.post(interaktUrl, {
      type: 'Template', // This field was missing and caused the error
      phoneNumber: phone,
      template: { name: 'uk_international_welcome_', language: { code: 'en' }, components: [] },
      from: '8181891914',
    }, {
      headers: {
        Authorization: `Basic ${process.env.INTERAKT_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    // Email notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'tabishjaved2030@gmail.com',
      subject: 'New Lead Submission',
      text: `New lead received:\nName: ${name}\nPhone: ${phone}\nCity: ${city || 'Not provided'}\nCourse: ${course || 'Not provided'}\nSource: ${source || 'Unknown'}`,
    };
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Enquiry submitted successfully' });
  } catch (error) {
    console.error('Error submitting enquiry:', error);
    res.status(500).json({ error: 'Failed to submit enquiry' });
  }
};

exports.getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.status(200).json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
};
