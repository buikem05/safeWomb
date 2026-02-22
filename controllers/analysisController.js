const { GoogleGenAI } = require('@google/genai');
const HealthLog = require('../models/HealthLog');
const smsService = require('../services/smsService');
require('dotenv').config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

exports.analyzePregnancy = async (req, res) => {
    try {
        // 1. We now look for 'type' and 'payload' as well
        const { week, symptoms, userId, phoneNumber, type, payload } = req.body;

        // 2. We ONLY require 'week' to be mandatory for both text and voice
        if (!week) {
            return res.status(400).json({ error: "Please provide the pregnancy 'week'." });
        }

        console.log(`Receiving ${type === 'voice' ? 'AUDIO' : 'TEXT'} for Week ${week}...`);

        let aiContents;

        // 3. THE VOICE PROMPT
        if (type === 'voice') {
            if (!payload) return res.status(400).json({ error: "Audio payload missing." });
            
            aiContents = [
                {
                    role: 'user',
                    parts: [
                        { text: `Act as a compassionate expert obstetrician for 'safeWomb AI'. The patient is in week ${week} of pregnancy. Listen to her audio symptoms and return ONLY a strictly valid JSON object. The JSON must have exactly these keys: {"babyUpdate": "...", "momUpdate": "...", "tips": ["...", "..."], "riskLevel": "Low/Medium/High", "advice": "..."}` },
                        {
                            inlineData: {
                                mimeType: 'audio/webm', // React Native Web records in webm
                                data: payload
                            }
                        }
                    ]
                }
            ];
        } 
        // 4. THE TEXT PROMPT
        else {
            if (!symptoms) return res.status(400).json({ error: "Symptoms text missing." });
            
            aiContents = [
                {
                    role: 'user',
                    parts: [
                        { text: `Act as a compassionate expert obstetrician for 'safeWomb AI'. Patient Data: Pregnancy Week: ${week}. Current Symptoms: "${symptoms}". Return ONLY a strictly valid JSON object with these exact keys: {"babyUpdate": "...", "momUpdate": "...", "tips": ["...", "..."], "riskLevel": "Low/Medium/High", "advice": "..."}` }
                    ]
                }
            ];
        }

        // 5. Send to Gemini
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', // 1.5-flash perfectly handles audio inputs!
            contents: aiContents,
        });

        // 6. Clean and Parse the JSON
        const aiText = response.candidates[0].content.parts[0].text;
        let cleanedText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
        const analysisData = JSON.parse(cleanedText);

        // 7. Twilio SMS Trigger
        if (analysisData.riskLevel === "High" && phoneNumber) {
            const alertMessage = `SafeWomb Alert: High Risk detected for week ${week}. Advice: ${analysisData.advice}`;
            smsService.sendSMS(phoneNumber, alertMessage).catch(err => console.log("SMS failed:", err.message)); 
        }

        // 8. Save to MongoDB
        const newLog = new HealthLog({
            userId: userId || "AnonymousUser",
            week: week,
            symptoms: type === 'voice' ? "Voice Note Submitted" : symptoms,
            aiAnalysis: analysisData
        });
        await newLog.save();
        console.log("✅ Analysis complete and saved!");

        res.status(200).json({
            success: true,
            data: analysisData,
            historyId: newLog._id
        });

    } catch (error) {
        console.error("Controller Error:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};
exports.getLogs = async (req, res) => {
    try {
        // Find all logs and sort them by newest first
        const logs = await HealthLog.find().sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            data: logs
        });
    } catch (error) {
        console.error("Error fetching logs:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
// 📍 NEW: Generate a quick daily tip
exports.getDailyTip = async (req, res) => {
    try {
        const { week } = req.query; // We get the week from the URL (e.g., /api/daily-tip?week=14)

        if (!week) {
            return res.status(400).json({ error: "Week is required to generate a tip." });
        }

        const prompt = `Act as a warm, supportive obstetrician. Give exactly ONE short, encouraging, and highly specific daily tip (maximum 2 sentences) for a mother who is in week ${week} of her pregnancy. Do not use formatting like bolding or asterisks.`;

        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: prompt,
        });

        // Extract the text
        const dailyTip = response.candidates[0].content.parts[0].text.trim();

        res.status(200).json({
            success: true,
            tip: dailyTip
        });

    } catch (error) {
        console.error("Daily Tip Error:", error);
        res.status(500).json({ success: false, message: "Failed to generate tip" });
    }
};