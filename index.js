const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // Loads your .env file

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); 
app.use(express.json()); 

// --- DATABASE CONNECTION ---
// We connect to the DB first, then start the server
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB Database safely connected!');
        
        // Start the server ONLY if the database connects successfully
        app.listen(PORT, () => {
            console.log(`🚀 Server is locked and loaded on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1); // Stop the app if the DB fails
    });

// --- ROUTES ---
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'Backend engine is running!' });
});