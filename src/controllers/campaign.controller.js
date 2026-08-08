const { supabase } = require('../config/supabase');

// @desc    Get all campaigns
// @route   GET /api/campaigns
const getAllCampaigns = async (req, res) => {
    try {
        const { status, category, search } = req.query;
        
        let query = supabase
            .from('campaigns')
            .select('*, users!created_by(name, email)')
            .order('created_at', { ascending: false });

        if (status) query = query.eq('status', status);
        if (category) query = query.eq('category', category);
        if (search) query = query.textSearch('title', search);

        const { data, error } = await query;

        if (error) throw error;

        res.status(200).json({
            success: true,
            count: data?.length || 0,
            data: data || []
        });
    } catch (error) {
        console.error('Get campaigns error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching campaigns'
        });
    }
};

// @desc    Get single campaign
// @route   GET /api/campaigns/:id
const getCampaign = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('campaigns')
            .select('*, users!created_by(name, email)')
            .eq('id', req.params.id)
            .single();

        if (error) {
            return res.status(404).json({
                success: false,
                message: 'Campaign not found'
            });
        }

        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        console.error('Get campaign error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching campaign'
        });
    }
};

// @desc    Create campaign (Admin only)
// @route   POST /api/campaigns
const createCampaign = async (req, res) => {
    try {
        const { title, description, target_amount, category, end_date, image } = req.body;

        const { data, error } = await supabase
            .from('campaigns')
            .insert({
                title,
                description,
                target_amount,
                category: category || 'other',
                end_date: end_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                image: image || '',
                created_by: req.user.id,
                status: 'active',
                collected_amount: 0,
                donors_count: 0
            })
            .select()
            .single();

        if (error) {
            console.error('Create campaign error:', error);
            return res.status(500).json({
                success: false,
                message: 'Error creating campaign'
            });
        }

        res.status(201).json({
            success: true,
            data
        });
    } catch (error) {
        console.error('Create campaign error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Update campaign (Admin only)
// @route   PUT /api/campaigns/:id
const updateCampaign = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('campaigns')
            .update(req.body)
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) {
            return res.status(404).json({
                success: false,
                message: 'Campaign not found'
            });
        }

        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        console.error('Update campaign error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Delete campaign (Admin only)
// @route   DELETE /api/campaigns/:id
const deleteCampaign = async (req, res) => {
    try {
        const { error } = await supabase
            .from('campaigns')
            .delete()
            .eq('id', req.params.id);

        if (error) {
            return res.status(404).json({
                success: false,
                message: 'Campaign not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Campaign deleted successfully'
        });
    } catch (error) {
        console.error('Delete campaign error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

module.exports = {
    getAllCampaigns,
    getCampaign,
    createCampaign,
    updateCampaign,
    deleteCampaign
};
