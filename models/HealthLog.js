const mongoose = require('mongoose');

const HealthLogSchema = new mongoose.Schema({
    // In a real app, this would link to a User ID. 
    // For the hackathon MVP, storing a name or session ID.
    userId: {
        type: String, 
        required: false 
    },
    week: {
        type: Number,
        required: true
    },
    symptoms: {
        type: String,
        required: true
    },
    // We will store the entire AI analysis as a nested object
    aiAnalysis: {
        babyUpdate: String,
        momUpdate: String,
        tips: [String],
        riskLevel: String, // "Low", "Medium", "High"
        advice: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('HealthLog', HealthLogSchema);