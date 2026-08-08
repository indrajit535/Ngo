const { supabase } = require('../config/supabase');

// @desc    Get all users (Admin)
// @route   GET /api/admin/users
const getAllUsers = async (req, res) => {
    try {
        const { search, role } = req.query;
        
        let query = supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });

        if (role) query = query.eq('role', role);
        if (search) {
            query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
        }

        const { data, error } = await query;

        if (error) throw error;

        const users = data.map(user => {
            delete user.password;
            return user;
        });

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users'
        });
    }
};

// @desc    Block/Unblock user (Admin)
// @route   PUT /api/admin/users/:id/block
const blockUser = async (req, res) => {
    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error || !user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.role === 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Cannot block admin users'
            });
        }

        const { data, error: updateError } = await supabase
            .from('users')
            .update({ is_blocked: !user.is_blocked })
            .eq('id', req.params.id)
            .select()
            .single();

        if (updateError) throw updateError;

        res.status(200).json({
            success: true,
            message: `User ${data.is_blocked ? 'blocked' : 'unblocked'} successfully`,
            data
        });
    } catch (error) {
        console.error('Block user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating user'
        });
    }
};

// @desc    Get all donations (Admin)
// @route   GET /api/admin/donations
const getAllDonations = async (req, res) => {
    try {
        const { status, campaign_id } = req.query;
        
        let query = supabase
            .from('donations')
            .select('*, users!user_id(name, email), campaigns!campaign_id(title)')
            .order('created_at', { ascending: false });

        if (status) query = query.eq('status', status);
        if (campaign_id) query = query.eq('campaign_id', campaign_id);

        const { data, error } = await query;

        if (error) throw error;

        const totalAmount = data
            .filter(d => d.status === 'completed')
            .reduce((sum, d) => sum + d.amount, 0);

        res.status(200).json({
            success: true,
            count: data.length,
            summary: {
                total_amount: totalAmount,
                total_donations: data.length,
                completed: data.filter(d => d.status === 'completed').length
            },
            data
        });
    } catch (error) {
        console.error('Get donations error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching donations'
        });
    }
};

// @desc    Get dashboard stats (Admin)
// @route   GET /api/admin/stats
const getDashboardStats = async (req, res) => {
    try {
        const [users, campaigns, donations] = await Promise.all([
            supabase.from('users').select('*', { count: 'exact', head: true }),
            supabase.from('campaigns').select('*', { count: 'exact', head: true }),
            supabase.from('donations').select('*', { count: 'exact', head: true }).eq('status', 'completed')
        ]);

        const { data: amountData } = await supabase
            .from('donations')
            .select('amount')
            .eq('status', 'completed');

        const totalAmount = amountData?.reduce((sum, d) => sum + d.amount, 0) || 0;

        const { count: activeCampaigns } = await supabase
            .from('campaigns')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'active');

        res.status(200).json({
            success: true,
            data: {
                users: {
                    total: users.count || 0
                },
                campaigns: {
                    total: campaigns.count || 0,
                    active: activeCampaigns || 0
                },
                donations: {
                    total: donations.count || 0,
                    total_amount: totalAmount
                }
            }
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching stats'
        });
    }
};

module.exports = {
    getAllUsers,
    blockUser,
    getAllDonations,
    getDashboardStats
};
