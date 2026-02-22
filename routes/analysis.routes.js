const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');

// Existing POST route
router.post('/analyze', analysisController.analyzePregnancy);

// 📍 NEW: GET route to fetch the logs
router.get('/logs', analysisController.getLogs);

// 📍 NEW: GET route for the daily AI tip
router.get('/daily-tip', analysisController.getDailyTip);

module.exports = router;

module.exports = router;