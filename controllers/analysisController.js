const { GoogleGenAI } = require('@google/genai');
const HealthLog = require('../models/HealthLog');
const smsService = require('../services/smsService');
require('dotenv').config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

exports.analyzePregnancy = async (req, res) => {

    try {
        const { week, symptoms, userId } = req.body;

        if (!week || !symptoms) {
            return res.status(400).json({ error: "Please provide both 'week' and 'symptoms'." });
        }

        const prompt = `
            Act as a compassionate, expert obstetrician for 'safeWomb AI'.
            Patient Data:
            - Pregnancy Week: ${week}
            - Current Symptoms: "${symptoms}"

            Task: Analyze this and return a strictly valid JSON object. 
            Do not include markdown, code blocks, or extra text. Return ONLY the raw JSON.
            
            The JSON must have exactly these keys:
            {
                "babyUpdate": "One sentence about how the baby is developing this week.",
                "momUpdate": "One sentence about what the mother's body is experiencing.",
                "tips": ["Tip 1", "Tip 2", "Tip 3 (must be related to her symptoms)"],
                "riskLevel": "Low", "Medium", or "High",
                "advice": "Clear, actionable medical advice based on the symptoms."
            }
        `;

        console.log("Sending symptoms to Gemini...");
        
        // The new SDK uses "ai.models.generateContent"
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        // CLEAN THE RESPONSE
        // In the new SDK, we must access the candidates array directly.
        const aiText = response.candidates[0].content.parts[0].text;
        let cleanedText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
        const analysisData = JSON.parse(cleanedText);

        // Trigger SMS only if risk is high and a phone number is provided
        if (analysisData.riskLevel === "High") {
            const alertMessage = `SafeWomb Alert: High Risk detected for week ${week}. Advice: ${analysisData.advice}`;
            // Assuming the user's phone is sent in the request body
            await smsService.sendSMS(req.body.phoneNumber, alertMessage); 
        }

        const newLog = new HealthLog({
            userId: userId || "AnonymousUser",
            week: week,
            symptoms: symptoms,
            aiAnalysis: analysisData
        });
        await newLog.save();
        console.log("Saved to MongoDB!");

        res.status(200).json({
            success: true,
            data: analysisData,
            historyId: newLog._id
        });

    } catch (error) {
        console.error("Controller Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to generate analysis", 
            error: error.message 
        });
    }
};