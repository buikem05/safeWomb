const path = require('path');
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { WebSocketServer } = require('ws');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config(); // Loads your .env file

// --- IMPORT CONTROLLERS & ROUTES ---
const analysisRoutes = require('./routes/analysis.routes');

const app = express();
// We wrap Express inside a standard Node HTTP server
const server = http.createServer(app); 
// We attach the WebSocket server to that exact same HTTP server
const wss = new WebSocketServer({ server }); 

const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE ---
app.use(cors());
// Increase the limit to 50 megabytes
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// --- REST ROUTES (SafeWomb API) ---
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'SafeWomb is now live' });
});


app.use('/api', analysisRoutes);

app.use(express.static(path.join(__dirname, 'dist')));

// The Catch-All Route
// If a request doesn't match an API route (above), send back the React app.
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// --- WEBSOCKET SERVER (Voice Assistant) ---
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

wss.on('connection', (ws) => {
    console.log('🟢 React Frontend Connected for Voice!');

    ws.on('message', async (message) => {
        try {
            console.log('🎤 Received audio chunk from frontend...');
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [
                    {
                        role: 'user',
                        parts: [
                            { text: "Reply to this audio with a spoken response." },
                            {
                                inlineData: {
                                    mimeType: 'audio/mp3',
                                    data: message.toString('base64') 
                                }
                            }
                        ]
                    }
                ],
                config: { responseModalities: ["AUDIO"] }
            });

            const audioBase64 = response.inlineData?.data;
            if (audioBase64) {
                 console.log('🔊 Sending AI audio response back to React...');
                 ws.send(Buffer.from(audioBase64, 'base64'));
            }
        } catch (error) {
            console.error('❌ Error communicating with Gemini:', error.message);
            ws.send(JSON.stringify({ error: "Failed to process audio" }));
        }
    });

    ws.on('close', () => console.log('🔴 Voice Disconnected.'));
});

// --- DATABASE CONNECTION & SERVER START ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB Database safely connected!');
        
        // 3. IMPORTANT: Start the "server", not the "app", so both Express and WebSockets run
        server.listen(PORT, () => {
            console.log(`🚀 Server is locked and loaded on http://localhost:${PORT}`);
            console.log(`🔌 WebSocket server listening on ws://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    });