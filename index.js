require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { supabase } = require('./src/config/supabase');

// Routes
const authRoutes = require('./src/routes/auth.routes');
const campaignRoutes = require('./src/routes/campaign.routes');
const donationRoutes = require('./src/routes/donation.routes');
const adminRoutes = require('./src/routes/admin.routes');

const app = express();

// ======================
// SECURITY MIDDLEWARE
// ======================

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    }
}));

app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://your-frontend.com'] 
        : '*',
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: 'Too many requests, please try again later'
    }
});
app.use('/api', limiter);

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: 'Too many login attempts, please try again later'
    }
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Logging
app.use((req, res, next) => {
    console.log(`📡 ${req.method} ${req.url} - IP: ${req.ip || 'unknown'}`);
    next();
});

// ======================
// ROUTES
// ======================

app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/admin', adminRoutes);

// ======================
// HEALTH CHECK
// ======================

app.get('/health', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('count')
            .limit(1);
        
        res.status(200).json({
            success: true,
            status: 'OK',
            database: error ? 'Error' : 'Connected',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV,
            uptime: process.uptime()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            status: 'ERROR',
            database: 'Disconnected',
            timestamp: new Date().toISOString()
        });
    }
});

// ======================
// HOME
// ======================

app.get('/', (req, res) => {
    res.status(200).json({
        name: 'NGO Backend API',
        version: '1.0.0',
        status: 'Running',
        endpoints: {
            auth: '/api/auth',
            campaigns: '/api/campaigns',
            donations: '/api/donations',
            admin: '/api/admin'
        },
        docs: 'https://github.com/yourusername/ngo-backend'
    });
});

// ======================
// 404 HANDLER
// ======================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.url
    });
});

// ======================
// ERROR HANDLER
// ======================

app.use((err, req, res, next) => {
    console.error('❌ Error:', err.message);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// ======================
// START SERVER
// ======================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('🚀 NGO Backend Server Started');
    console.log(`📡 Port: ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    console.log(`🔗 http://localhost:${PORT}`);
    console.log(`✅ Health: http://localhost:${PORT}/health`);
});

module.exports = app;
