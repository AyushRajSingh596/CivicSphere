import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API client safely
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("WARNING: GEMINI_API_KEY environment variable is not set. AI features will fallback to mock responses.");
}

// 1. AI Chatbot endpoint for Dashboard
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!ai) {
      // Fallback response when API key is missing
      return res.json({
        text: "I am running in local offline demo mode (no Gemini API key detected). I can help answer queries about pothole repairs, streetlights, or waste management in Bengaluru or Indore. Please add a valid API key in Settings > Secrets to unlock full AI capabilities."
      });
    }

    // Use chats.create to support conversational state or do a single generateContent call with history context
    // We'll pass the system instruction for a highly helpful Indian Municipal AI Assistant
    const systemInstruction = `You are "CivicSphere AI", an extremely helpful, empathetic, and knowledgeable digital civic assistant for Indian citizens and municipal workers. 
    You help users with civic complaint reports, explain municipality guidelines (like BBMP in Bengaluru, IMC in Indore, PMC in Pune), tell them how long issues usually take to resolve, and explain citizen duties. 
    You speak in a warm, polite, professional, and slightly informal Indian English tone (using common terms like "Ward", "Corporator", "Nala", "BBMP", etc., where appropriate).
    Keep your responses relatively concise (under 150 words), helpful, and direct. Use bullet points for steps.`;

    // Map history to Google GenAI chat format
    const formattedHistory = (history || []).map((h: any) => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.text }]
    }));

    // Start a chat with history
    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction,
        temperature: 0.7,
      },
      history: formattedHistory
    });

    const response = await chat.sendMessage({ message });
    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI response" });
  }
});

// 2. AI priority recommendation & categorization for Report Form
app.post("/api/analyze-issue", async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!description) {
      return res.status(400).json({ error: "Description is required" });
    }

    if (!ai) {
      // Return a simulated high-quality mock response if Gemini is not available
      const detectedCategory = title?.toLowerCase().includes("light") || description.toLowerCase().includes("light") ? "Electricity" : 
                               title?.toLowerCase().includes("water") || description.toLowerCase().includes("water") ? "Water Supply" :
                               title?.toLowerCase().includes("road") || description.toLowerCase().includes("pothole") ? "Roads & Infrastructure" : "Sanitation";
      
      const priority = description.toLowerCase().includes("hazard") || description.toLowerCase().includes("dangerous") || description.toLowerCase().includes("accident") ? "High" : "Medium";
      return res.json({
        category: detectedCategory,
        priority: priority,
        confidence: 0.85,
        aiExplanation: `[Demo Mode] Based on keywords, this is categorized under "${detectedCategory}" with ${priority} priority. Connect Gemini to enable live deep semantic analysis.`
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Analyze the following citizen civic complaint and suggest:
1. Best Category (Must be one of: "Sanitation", "Roads & Infrastructure", "Water Supply", "Electricity", "Other")
2. Suggested Urgency Priority (Must be one of: "Low", "Medium", "High")
3. Safety Hazard Risk (boolean: true if it poses an immediate hazard like open live wires, deep open drain, major road blockage, false otherwise)
4. A brief (1-2 sentence) explanation of the AI's reasoning.

Title: ${title || "Untitled Civic Complaint"}
Description: ${description}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING, description: "Category of the complaint" },
            priority: { type: Type.STRING, description: "Low, Medium, or High priority level" },
            isHazard: { type: Type.BOOLEAN, description: "Whether it poses immediate danger" },
            explanation: { type: Type.STRING, description: "Brief reason for this classification" }
          },
          required: ["category", "priority", "isHazard", "explanation"]
        }
      }
    });

    const result = JSON.parse(response.text?.trim() || "{}");
    res.json({
      category: result.category || "Other",
      priority: result.priority || "Medium",
      isHazard: result.isHazard || false,
      aiExplanation: result.explanation || "Analyzed by CivicSphere Smart Classifier."
    });
  } catch (error: any) {
    console.error("Error in /api/analyze-issue:", error);
    res.status(500).json({ error: error.message || "Failed to analyze issue" });
  }
});

// Configure Vite middleware or static serving
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CivicSphere backend listening on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
