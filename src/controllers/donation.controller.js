const { supabase } = require('../config/supabase');
const { v4: uuidv4 } = require('uuid');

// @desc    Create donation
// @route   POST /api/donations
const createDonation = async (req, res) => {
    try {
        const { campaign_id, amount, message, is_anonymous, payment_method } = req.body;
        const user_id = req.user.id;

        // Check campaign
        const { data: campaign, error: campaignError } = await supabase
            .from('campaigns')
            .select('*')
            .eq('id', campaign_id)
            .single();

        if (campaignError || !campaign) {
            return res.status(404).json({
                success: false,
                message: 'Campaign not found'
            });
        }

        if (campaign.status !== 'active') {
            return res.status(400).json({
                success: false,
                message: 'Campaign is not active'
            });
        }

        // Generate transaction ID
        const transaction_id = `TXN-${Date.now()}-${uuidv4().slice(0, 8)}`;

        // Simulate payment (95% success)
        const paymentSuccess = Math.random() > 0.05;

        if (!paymentSuccess) {
            return res.status(400).json({
                success: false,
                message: 'Payment failed. Please try again.'
            });
        }

        // Create donation
        const { data: donation, error: donationError } = await supabase
            .from('donations')
            .insert({
                user_id,
                campaign_id,
                amount,
                message: message || '',
                is_anonymous: is_anonymous || false,
                transaction_id,
                payment_method: payment_method || 'card',
                status: 'completed',
                ip_address: req.ip,
                completed_at: new Date().toISOString()
            })
            .select()
            .single();

        if (donationError) {
            console.error('Donation error:', donationError);
            return res.status(500).json({
                success: false,
                message: 'Error processing donation'
            });
        }

        // Update campaign
        await supabase
            .from('campaigns')
            .update({
                collected_amount: campaign.collected_amount + amount,
                donors_count: campaign.donors_count + 1
            })
            .eq('id', campaign_id);

        res.status(201).json({
            success: true,
            message: 'Donation successful! Thank you for your support.',
            data: donation
        });
    } catch (error) {
        console.error('Donation error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get user's donations
// @route   GET /api/donations/my-donations
const getMyDonations = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('donations')
            .select('*, campaigns(title, description, image)')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.status(200).json({
            success: true,
            count: data?.length || 0,
            data: data || []
        });
    } catch (error) {
        console.error('Get donations error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching donations'
        });
    }
};

// @desc    Get campaign donations
// @route   GET /api/donations/campaign/:campaign_id
const getCampaignDonations = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('donations')
            .select('*, users!user_id(name, email, profile_image)')
            .eq('campaign_id', req.params.campaign_id)
            .eq('status', 'completed')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.status(200).json({
            success: true,
            count: data?.length || 0,
            data: data || []
        });
    } catch (error) {
        console.error('Get campaign donations error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching donations'
        });
    }
};

module.exports = {
    createDonation,
    getMyDonations,
    getCampaignDonations
};
