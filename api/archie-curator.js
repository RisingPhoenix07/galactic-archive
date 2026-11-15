// api/archie-curator.js

const ARCHIE_SYSTEM_INSTRUCTION = `
You are ARCHIE (Archive Reconnaissance & Historic Intelligence Entity), a friendly retro-computer NASA museum curator guiding players through the Galactic Archive interactive space game.
RULES:
1. NEVER give direct spoilers on which game choice button to click.
2. Guide players with real NASA science, aerospace history, and Socratic hints so they figure out the right decision themselves.
3. Keep answers to 2-3 punchy, engaging sentences tailored to the player's current mission node.
`;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { userQuery, currentMissionContext, missionCaption } = req.body || {};
  if (!userQuery) return res.status(400).json({ error: "Missing userQuery" });

  const userPrompt =
    `Active Mission Node: ${currentMissionContext || "intro"}\n` +
    (missionCaption ? `On-Screen Telemetry/Scene: ${missionCaption}\n` : "") +
    `Player Question: ${userQuery}`;

  // 1. Primary: Groq (Sub-second inference, returns exact model used)
  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey) {
    try {
      const targetModel = "llama-3.3-70b-versatile";
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${groqKey}`
        },
        body: JSON.stringify({
          model: targetModel,
          messages: [
            { role: "system", content: ARCHIE_SYSTEM_INSTRUCTION },
            { role: "user", content: userPrompt }
          ],
          max_tokens: 180,
          temperature: 0.65
        })
      });

      if (groqRes.ok) {
        const groqData = await groqRes.json();
        const reply = groqData.choices?.[0]?.message?.content?.trim();
        if (reply) {
          return res.status(200).json({
            reply,
            source: "groq",
            model: groqData.model || targetModel
          });
        }
      } else {
        const errText = await groqRes.text();
        console.error("[ARCHIE Groq Error]:", groqRes.status, errText);
      }
    } catch (err) {
      console.error("[ARCHIE Groq Network Error]:", err);
    }
  }

  // 2. Secondary Server Fallback: Gemini API (if GEMINI_API_KEY is set in Vercel)
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const targetGeminiModel = "gemini-2.0-flash";
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${targetGeminiModel}:generateContent?key=${geminiKey}`;
      const gemRes = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: ARCHIE_SYSTEM_INSTRUCTION }] },
          contents: [{ role: "user", parts: [{ text: userPrompt }] }],
          generationConfig: { maxOutputTokens: 180, temperature: 0.65 }
        })
      });

      if (gemRes.ok) {
        const gemData = await gemRes.json();
        const reply = gemData.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (reply) {
          return res.status(200).json({
            reply,
            source: "gemini",
            model: gemData.modelVersion || targetGeminiModel
          });
        }
      } else {
        const errText = await gemRes.text();
        console.error("[ARCHIE Gemini Error]:", gemRes.status, errText);
      }
    } catch (err) {
      console.error("[ARCHIE Gemini Network Error]:", err);
    }
  }

  return res.status(502).json({
    error: "No upstream AI provider succeeded. Check GROQ_API_KEY or GEMINI_API_KEY in Vercel Environment Variables."
  });
}