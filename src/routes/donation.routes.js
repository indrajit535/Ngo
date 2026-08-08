const express = require('express');
const router = express.Router();
const {
    createDonation,
    getMyDonations,
    getCampaignDonations
} = require('../controllers/donation.controller');
const { protect } = require('../middleware/auth');
const { validate, validations } = require('../middleware/validation');

router.post('/', protect, validate(validations.donation), createDonation);
router.get('/my-donations', protect, getMyDonations);
router.get('/campaign/:campaign_id', protect, getCampaignDonations);

module.exports = router;
