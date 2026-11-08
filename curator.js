// ==========================================
// ARCHIE HYBRID CURATOR ENGINE (VERCEL PROXY + FAQ FALLBACK)
// ==========================================

// Pre-authored mission context FAQ chips mapped by mission prefix
const MISSION_CHIPS = {
  m1: ["What was Mercury-Atlas 6?", "Explain MA-6 retropack issue"],
  m2: ["What is an HHMU gun?", "Why did the hatch jam on Gemini 4?"],
  m3: ["What caused Apollo 8 LOS?", "What is Lunar Orbit Insertion (LOI)?"],
  m4: ["What was the 1202 alarm?", "Why clear computer RAM during descent?"],
  m5: ["What is NRHO orbit?", "How does Lunar Gateway dock?"],
  m6: ["What is Chryse Planitia?", "How does the Sky Crane work?"],
  m7: ["What are Europa bio-signatures?", "How thick is Europa's ice shell?"]
};

// --- 1. DRAWER TOGGLE CONTROLLER ---
function toggleCuratorDrawer() {
  const drawer = document.getElementById("curator-drawer");
  if (!drawer) {
    console.error("Error: #curator-drawer element not found in DOM!");
    return;
  }

  drawer.classList.toggle("hidden");

  if (!drawer.classList.contains("hidden")) {
    updateCuratorChips();
    if (window.audioManager && typeof audioManager.play === "function") {
      audioManager.play('ui_click');
    }
  }
}

// --- 2. CONTEXTUAL FAQ CHIPS GENERATOR ---
function updateCuratorChips() {
  const chipsContainer = document.getElementById("curator-chips-container");
  if (!chipsContainer) return;

  const activeNode = (typeof currentNodeId !== "undefined" && currentNodeId) ? currentNodeId : "m1_p1";
  const missionKey = activeNode.split("_")[0];

  const chips = MISSION_CHIPS[missionKey] || [
    "What is the Apollo Guidance Computer?",
    "Explain Loss of Signal (LOS)",
    "What is HHMU?"
  ];

  chipsContainer.innerHTML = chips
    .map(chip => `<button class="chip-btn" onclick="askArchieChip('${chip.replace(/'/g, "\\'")}')">${chip}</button>`)
    .join("");
}

function askArchieChip(questionText) {
  const inputEl = document.getElementById("curator-user-input");
  if (inputEl) {
    inputEl.value = questionText;
    sendCuratorMessage();
  }
}

function handleCuratorKeydown(e) {
  if (e.key === 'Enter') {
    sendCuratorMessage();
  }
}

// --- 3. UI MESSAGE DISPATCHER WITH GUARANTEED CLEANUP ---
let isCuratorFetching = false;

async function sendCuratorMessage() {
  if (isCuratorFetching) return;

  const inputEl = document.getElementById("curator-user-input");
  const chatLog = document.getElementById("curator-chat-log");
  if (!inputEl || !chatLog) return;

  const query = inputEl.value.trim();
  if (!query) return;

  isCuratorFetching = true;

  // 1. Render User Question
  appendChatMessage(query, "user");
  inputEl.value = "";

  if (window.audioManager && typeof audioManager.play === "function") {
    audioManager.play('choice_confirm');
  }

  // 2. Render Loading Indicator
  const loadingElement = appendChatMessage("ARCHIE is searching historic NASA databases...", "bot loading");

  // 3. Fetch Answer
  let aiAnswer = "";
  try {
    const activeNode = typeof currentNodeId !== "undefined" ? currentNodeId : "intro_p1";
    aiAnswer = await fetchArchieAIResponse(query, activeNode);
  } catch (err) {
    console.warn("[ARCHIE UI] Response fetch error, switching to offline database:", err);
    aiAnswer = processArchieQueryOffline(query);
  } finally {
    isCuratorFetching = false;
    if (loadingElement && loadingElement.parentNode) {
      loadingElement.parentNode.removeChild(loadingElement);
    }
  }

  // 4. Append ARCHIE Answer
  appendChatMessage(aiAnswer, "bot");
}

function appendChatMessage(text, senderClass) {
  const chatLog = document.getElementById("curator-chat-log");
  if (!chatLog) return null;

  const msgDiv = document.createElement("div");
  msgDiv.className = `curator-msg ${senderClass}`;
  
  if (senderClass.includes("bot")) {
    msgDiv.innerHTML = `<span class="bot-tag">[ARCHIE]:</span> ${text}`;
  } else {
    msgDiv.textContent = text;
  }

  chatLog.appendChild(msgDiv);
  chatLog.scrollTop = chatLog.scrollHeight;
  return msgDiv;
}

// --- 4. VERCEL PROXY FETCH HANDLER ---
const VERCEL_PROXY_URL = "https://galactic-archive-two.vercel.app/api/archie-curator";

async function fetchArchieAIResponse(userQuery, currentMissionContext) {
  try {
    const controller = new AbortController();
    // Set 8-second abort limit to stay within Vercel execution limits
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(VERCEL_PROXY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userQuery, currentMissionContext }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[ARCHIE Proxy] Server HTTP ${response.status}`);
      return processArchieQueryOffline(userQuery);
    }

    const data = await response.json();
    if (data && data.reply) {
      return data.reply;
    }
  } catch (error) {
    console.warn("[ARCHIE Proxy] Request failed or aborted. Falling back to offline engine:", error);
  }

  // Primary offline FAQ engine fallback
  return processArchieQueryOffline(userQuery);
}

// --- 5. PRIMARY FAQ & RULE-BASED FALLBACK ENGINE ---
function processArchieQueryOffline(query) {
  const lowerQuery = query.toLowerCase();

  // A. Failure & Crash Intent Handler
  if (lowerQuery.includes("fail") || lowerQuery.includes("crash") || lowerQuery.includes("wrong") || lowerQuery.includes("die") || lowerQuery.includes("abort")) {
    const debriefBox = document.getElementById("debrief-box");
    if (debriefBox && !debriefBox.classList.contains("hidden")) {
      return "Check the <strong>📖 WHAT REALLY HAPPENED</strong> panel on your main display! It breaks down the exact historical decision or telemetry fault that caused the mission abort.";
    }
    return "Mission aborts typically happen when velocity limits are exceeded, suit pressure isn't managed correctly, or propellant runs dry. Keep an eye on your HUD telemetry indicators!";
  }

  // B. Glossary Matching (DSKY, HHMU, LOI, EVA, NRHO, etc.)
  if (typeof GLOSSARY !== "undefined" && GLOSSARY !== null && typeof GLOSSARY === "object") {
    for (const [term, def] of Object.entries(GLOSSARY)) {
      if (lowerQuery.includes(term.toLowerCase())) {
        return `<strong>${term}</strong>: ${def}`;
      }
    }
  }

  // C. Specific Historic Event Matches
  if (lowerQuery.includes("1202") || lowerQuery.includes("alarm") || lowerQuery.includes("ram")) {
    return "The 1202 DSKY alarm indicated CPU overload on Apollo 11. Clearing non-essential computer tasks allowed Armstrong and Aldrin to land safely!";
  }
  if (lowerQuery.includes("hhmu") || lowerQuery.includes("spacewalk") || lowerQuery.includes("gemini")) {
    return "The Hand-Held Maneuvering Unit (HHMU) was an oxygen jet gun Ed White used on Gemini 4 to propel himself around in microgravity during America's first EVA!";
  }
  if (lowerQuery.includes("gateway") || lowerQuery.includes("artemis") || lowerQuery.includes("nrho")) {
    return "The Artemis Gateway operates in Near-Rectilinear Halo Orbit (NRHO), balancing Earth and Lunar gravity for efficient deep space communications.";
  }
  if (lowerQuery.includes("retropack") || lowerQuery.includes("mercury") || lowerQuery.includes("glenn")) {
    return "John Glenn's Friendship 7 flight faced potential disaster when telemetry falsely indicated the heat shield retropack had unlatched. He re-entered with the retropack strapped on.";
  }
  if (lowerQuery.includes("lander") || lowerQuery.includes("speed")) {
    return "To land safely in the simulator, keep vertical speed below 35 m/s, lateral speed under 25 m/s, and tilt angle within ±20°. Watch your propellant fuel gauge!";
  }

  // D. Conversational Context Fallback
  if (typeof storyTree !== "undefined" && typeof currentNodeId !== "undefined") {
    const currentNode = storyTree[currentNodeId];
    if (currentNode && currentNode.caption) {
      const cleanCaption = currentNode.caption.replace(/<[^>]*>?/gm, '');
      return `We are currently monitoring this mission phase: <em>"${cleanCaption.substring(0, 100)}..."</em> Ask me about relevant NASA acronyms (like DSKY or HHMU) or flight controls to help you navigate!`;
    }
  }

  // E. Conversational Default Fallback
  return "I'm monitoring your mission telemetry, Commander! Feel free to ask about NASA acronyms (like DSKY or HHMU), flight maneuvers, or historical event details.";
}