const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    blockUser,
    getAllDonations,
    getDashboardStats
} = require('../controllers/admin.controller');
const { protect, admin } = require('../middleware/auth');

router.get('/users', protect, admin, getAllUsers);
router.put('/users/:id/block', protect, admin, blockUser);
router.get('/donations', protect, admin, getAllDonations);
router.get('/stats', protect, admin, getDashboardStats);

module.exports = router;
