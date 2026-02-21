const express = require('express');
const router = express.Router();

// 1. Import your controller
const analysisController = require('../controllers/analysisController');

// 2. Define the route
// When a POST request hits '/analyze', it hands the work over to your controller function
router.post('/analyze', analysisController.analyzePregnancy);


// 3. Export the router so index.js can use it
module.exports = router;