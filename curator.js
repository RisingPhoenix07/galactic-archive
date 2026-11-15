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

// --- 1. DRAWER / MODAL TOGGLE CONTROLLER ---
function toggleCuratorDrawer() {
  const drawer = document.getElementById("curator-drawer");
  if (!drawer) {
    console.error("Error: #curator-drawer element not found in DOM!");
    return;
  }

  const isOpening = drawer.classList.contains("hidden");
  drawer.classList.toggle("hidden");

  if (window.audioManager && typeof audioManager.play === "function") {
    audioManager.play('ui_click');
  }

  if (isOpening) {
    updateCuratorChips();
    const inputEl = document.getElementById("curator-user-input");
    if (inputEl) setTimeout(() => inputEl.focus(), 60);
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const drawer = document.getElementById("curator-drawer");
    if (drawer && !drawer.classList.contains("hidden")) {
      drawer.classList.add("hidden");
    }
  }
});

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
    e.preventDefault();
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
    const activeNode = (typeof currentNodeId !== "undefined" && currentNodeId) ? currentNodeId : "intro_p1";
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
    // 15-second limit accommodates Vercel cold starts + LLM inference
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    // Include on-screen caption text so the AI knows the exact mission scene
    let missionCaption = "";
    if (typeof storyTree !== "undefined" && storyTree[currentMissionContext]?.caption) {
      missionCaption = storyTree[currentMissionContext].caption.replace(/<[^>]*>?/gm, "").trim();
    }

    const response = await fetch(VERCEL_PROXY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userQuery, currentMissionContext, missionCaption }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      console.warn(`[ARCHIE Proxy] Server HTTP ${response.status}:`, errBody);
      return processArchieQueryOffline(userQuery);
    }

    const data = await response.json();
    if (data && typeof data.reply === "string" && data.reply.trim().length > 0) {
      console.info(`[ARCHIE Telemetry] Provider: ${data.source || "unknown"} | Model: ${data.model || "unspecified"}`);
      return data.reply.trim();
    }

    console.warn("[ARCHIE Proxy] Empty reply payload received:", data);
  } catch (error) {
    console.warn("[ARCHIE Proxy] Request failed or aborted. Falling back to offline engine:", error);
  }

  // Primary offline FAQ engine fallback
  console.info("[ARCHIE Telemetry] Provider: offline-cache | Model: rule-based-faq");
  return processArchieQueryOffline(userQuery);
}

// --- 5. PRIMARY FAQ & RULE-BASED FALLBACK ENGINE ---
function processArchieQueryOffline(query) {
  const lowerQuery = query.toLowerCase();

  // A. Failure & Crash Intent Handler
  if (
    lowerQuery.includes("fail") ||
    lowerQuery.includes("crash") ||
    lowerQuery.includes("wrong") ||
    lowerQuery.includes("die") ||
    lowerQuery.includes("abort")
  ) {
    const debriefBox = document.getElementById("debrief-box");
    if (debriefBox && !debriefBox.classList.contains("hidden")) {
      return "Check the <strong>📖 WHAT REALLY HAPPENED</strong> panel on your main display! It breaks down the exact historical decision or telemetry fault that caused the mission abort.";
    }
    return "Mission aborts typically happen when descent velocity limits are exceeded, suit pressure isn't managed properly, or propellant runs dry. Keep a close eye on your HUD telemetry!";
  }

  // B. Glossary Matching (DSKY, HHMU, LOI, EVA, NRHO, etc.)
  if (typeof GLOSSARY !== "undefined" && GLOSSARY !== null && typeof GLOSSARY === "object") {
    for (const [term, def] of Object.entries(GLOSSARY)) {
      if (lowerQuery.includes(term.toLowerCase())) {
        return `<strong>${term}</strong>: ${def}`;
      }
    }
  }

  // C. Comprehensive Historical Knowledge Base (Missions 1–7)
  const knowledgeBase = [
    {
      keys: ["retropack", "mercury", "glenn", "ma-6", "friendship"],
      reply: "On Mercury-Atlas 6 (1962), Segment 51 telemetry falsely indicated John Glenn's heat shield had unlatched. Flight Director Chris Kraft kept the strapped-on retropack attached during reentry to hold the heat shield in place!"
    },
    {
      keys: ["hhmu", "spacewalk", "gemini", "hatch", "ed white"],
      reply: "During Gemini 4 (1965), Ed White used the Hand-Held Maneuvering Unit (HHMU)—a pressurized oxygen thruster gun—for America's first EVA, though thermal expansion warped the capsule hatch latch afterward."
    },
    {
      keys: ["apollo 8", "los", "loss of signal", "loi", "far side", "farside"],
      reply: "Apollo 8 had to fire its SPS engine behind the Moon during Loss of Signal (LOS)—meaning Mission Control had zero radio contact until the Lunar Orbit Insertion (LOI) burn succeeded or failed!"
    },
    {
      keys: ["1202", "alarm", "ram", "agc", "dsky", "apollo 11"],
      reply: "The 1202 Executive Overflow alarm indicated CPU overload on the Apollo Guidance Computer. Clearing non-essential radar tasks let Armstrong and Aldrin land Eagle safely!"
    },
    {
      keys: ["gateway", "artemis", "nrho", "halo", "dock"],
      reply: "The Artemis Lunar Gateway operates in Near-Rectilinear Halo Orbit (NRHO), balancing Earth and Lunar gravity for continuous communications and fuel-efficient lunar surface access."
    },
    {
      keys: ["mars", "chryse", "sky crane", "curiosity", "perseverance", "wind", "dust"],
      reply: "In Mars Entry, Descent, and Landing (EDL), the Sky Crane hovers on retro-rockets and lowers the rover on nylon tethers so thruster blast doesn't kick up blinding Martian dust clouds."
    },
    {
      keys: ["europa", "cryobot", "ice", "bio-signature", "ocean", "hydrothermal", "15"],
      reply: "Europa's ice shell is roughly 15–25 km thick above a global saltwater ocean. A nuclear-heated cryobot melts downward through cryo-pressure pockets to sample hydrothermal vents for chemical bio-signatures!"
    },
    {
      keys: ["lander", "speed", "land", "velocity"],
      reply: "For a safe touchdown, keep vertical descent speed and lateral drift within the green HUD limits while conserving propellant—small, pulsed thruster burns give the best control!"
    }
  ];

  for (const item of knowledgeBase) {
    if (item.keys.some(keyword => lowerQuery.includes(keyword))) {
      return item.reply;
    }
  }

  // D. Conversational Default Fallback
  return "Archive telemetry link is running on local cache—ask me about any mission's physics, spacecraft hardware (like DSKY, HHMU, Sky Crane, or Cryobot), or historical flight decisions!";
}