const express = require('express');
const { submitEnquiry, getLeads } = require('../controllers/enquiryController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/user/register', submitEnquiry);
router.get('/leads', protect, getLeads);

module.exports = router;