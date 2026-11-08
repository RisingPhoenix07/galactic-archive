// api/archie-curator.js

const ARCHIE_SYSTEM_INSTRUCTION = `
You are ARCHIE, a friendly retro-computer space curator guiding kids through the Galactic Archive space game.
RULES:
1. NEVER give direct answers or spoilers on which game choices to select.
2. Guide users with real NASA science, history, and Socratic hints so they solve it by playing.
3. Keep answers under 3 short sentences, simple for kids, and enthusiastic about space exploration.
4. Always encourage them to test their ideas in the game!
`;

export default async function handler(req, res) {
  // 1. Set CORS headers on ALL responses (success or error)
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // 2. Handle CORS preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userQuery, currentMissionContext } = req.body || {};
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY is not configured on Vercel environment." });
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;

  try {
    const payload = {
      systemInstruction: {
        parts: [{ text: ARCHIE_SYSTEM_INSTRUCTION }]
      },
      contents: [
        {
          role: "user",
          parts: [
            { text: `Current Game Node: ${currentMissionContext || "intro"}\nUser Question: ${userQuery}` }
          ]
        }
      ],
      generationConfig: {
        maxOutputTokens: 150,
        temperature: 0.7
      }
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return res.status(response.status).json({ error: "Gemini API error", details: errData });
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || null;

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("[Vercel Proxy Error]:", error);
    return res.status(500).json({ error: "Internal server error", message: error.message });
  }
}