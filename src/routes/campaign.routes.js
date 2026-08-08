const express = require('express');
const router = express.Router();
const {
    getAllCampaigns,
    getCampaign,
    createCampaign,
    updateCampaign,
    deleteCampaign
} = require('../controllers/campaign.controller');
const { protect, admin } = require('../middleware/auth');
const { validate, validations } = require('../middleware/validation');

router.get('/', getAllCampaigns);
router.get('/:id', getCampaign);
router.post('/', protect, admin, validate(validations.campaign), createCampaign);
router.put('/:id', protect, admin, updateCampaign);
router.delete('/:id', protect, admin, deleteCampaign);

module.exports = router;
