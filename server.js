const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const app = express();
app.use(express.json());

// Supabase - YAHAN FIX KIYA
const supabase = createClient(
    'https://ihrvcqyqgwftflrdijjf.supabase.co',
    'sb_secret_RKMrmaaEjBTZQrpsl0CsPw_ukisAD2q'
);

// GET Data
app.get('/api/ngodata', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('ngo_data')
            .select('value')
            .eq('key', 'org_data')
            .single();
        
        if (error) throw error;
        res.json(data?.value || {});
    } catch (error) {
        res.json({ error: error.message });
    }
});

// UPDATE Data
app.post('/api/update', async (req, res) => {
    try {
        const data = req.body;
        const { error } = await supabase
            .from('ngo_data')
            .upsert({ 
                key: 'org_data', 
                value: data, 
                updated_at: new Date() 
            });
        
        if (error) throw error;
        res.json({ success: true });
    } catch (error) {
        res.json({ error: error.message });
    }
});

// DONATION
app.post('/api/donate', async (req, res) => {
    try {
        const { error } = await supabase
            .from('donations')
            .insert(req.body);
        
        if (error) throw error;
        res.json({ success: true });
    } catch (error) {
        res.json({ error: error.message });
    }
});

// VOLUNTEER
app.post('/api/volunteer', async (req, res) => {
    try {
        const { error } = await supabase
            .from('volunteers')
            .insert(req.body);
        
        if (error) throw error;
        res.json({ success: true });
    } catch (error) {
        res.json({ error: error.message });
    }
});

// Health Check
app.get('/', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'NGO Server Running!',
        endpoints: [
            'GET /api/ngodata',
            'POST /api/update',
            'POST /api/donate',
            'POST /api/volunteer'
        ]
    });
});

app.listen(3000, () => console.log('Server running on port 3000'));
