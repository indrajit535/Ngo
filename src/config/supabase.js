const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

if (!process.env.SUPABASE_URL) {
    console.error('❌ SUPABASE_URL is missing in .env');
    process.exit(1);
}

if (!process.env.SUPABASE_ANON_KEY) {
    console.error('❌ SUPABASE_ANON_KEY is missing in .env');
    process.exit(1);
}

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
);

console.log('✅ Supabase Client Initialized');

module.exports = { supabase, supabaseAdmin };
