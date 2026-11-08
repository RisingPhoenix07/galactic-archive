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
  // CORS Headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userQuery, currentMissionContext } = req.body || {};
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "GROQ_API_KEY is not configured on Vercel environment." });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages: [
          { role: "system", content: ARCHIE_SYSTEM_INSTRUCTION },
          { role: "user", content: `Current Game Node: ${currentMissionContext || "intro"}\nUser Question: ${userQuery}` }
        ],
        max_tokens: 120,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return res.status(response.status).json({ error: "Groq API error", details: errData });
    }

    const data = await response.json();
    // OpenAI/Groq response format extraction
    const reply = data.choices?.[0]?.message?.content || null;

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("[Vercel Proxy Error]:", error);
    return res.status(500).json({ error: "Internal server error", message: error.message });
  }
}