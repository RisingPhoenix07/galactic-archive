// ==========================================
// CORE GAME ENGINE & RENDERING LOOP
// ==========================================

let currentNodeId = "intro_p1";

// 1. INITIALIZATION ON LOAD
document.addEventListener("DOMContentLoaded", () => {
  if (typeof updateLogsCounterUI === "function") updateLogsCounterUI();
  if (typeof updateTitleMenuButtons === "function") updateTitleMenuButtons();
});

// 2. MAIN MENU & UI NAVIGATION CONTROLLERS
function startNewGame() {
  const savedNode = typeof getSavedSession === "function" ? getSavedSession() : null;
  showGameInterface();
  renderNode(savedNode || "intro_p1");
}

function goToMainMenu() {
  if (confirm("Return to the main menu? Progress in this session will be saved.")) {
    const titleScreen = document.getElementById("title-screen");
    const hudBar = document.getElementById("hud-bar");
    const panelBox = document.getElementById("panel-box");
    const choicesContainer = document.getElementById("choices-container");

    if (window.audioManager && typeof audioManager.stopAll === "function") {
      audioManager.stopAll();
      audioManager.play('theme_song', true);
    }

    if (titleScreen) titleScreen.classList.remove("hidden");
    if (hudBar) hudBar.classList.add("hidden");
    if (panelBox) panelBox.classList.add("hidden");
    if (choicesContainer) choicesContainer.classList.add("hidden");

    if (typeof updateTitleMenuButtons === "function") updateTitleMenuButtons();
  }
}

function showGameInterface() {
  const titleScreen = document.getElementById("title-screen");
  const hudBar = document.getElementById("hud-bar");
  const panelBox = document.getElementById("panel-box");
  const choicesContainer = document.getElementById("choices-container");

  if (titleScreen) titleScreen.classList.add("hidden");
  if (hudBar) hudBar.classList.remove("hidden");
  if (panelBox) panelBox.classList.remove("hidden");
  if (choicesContainer) choicesContainer.classList.remove("hidden");

  if (window.audioManager && typeof audioManager.play === "function") {
    audioManager.play('ui_click');
  }
}

function openMissionSelect() {
  showGameInterface();
  renderNode("intro_p2");
}

// 3. CORE NODE RENDERER
function renderNode(nodeKey) {
  const node = storyTree[nodeKey];
  if (!node) {
    console.error(`Error: Node key '${nodeKey}' does not exist in storyTree!`);
    return;
  }

  currentNodeId = nodeKey;
  if (typeof saveCurrentSession === "function") saveCurrentSession(nodeKey);

  const panelBox = document.getElementById("panel-box");

  // --- A. VISUAL WARNING, SHAKE & GLOW EFFECTS ---
  const isFailureOrDanger = node.shake || 
    nodeKey.includes("fail") || nodeKey.includes("crash") || nodeKey.includes("alarm") || 
    nodeKey.includes("warning") || nodeKey.includes("drift") || nodeKey.includes("storm") || 
    nodeKey.includes("breach") || nodeKey.includes("freeze") || nodeKey.includes("blackout") || 
    nodeKey.includes("tumble") || nodeKey.includes("skipout") || nodeKey.includes("impact") || 
    nodeKey.includes("crush") || nodeKey.includes("overheat") || 
    (node.caption && (node.caption.includes("FAILURE") || node.caption.includes("CRITICAL")));

  const isSuccessNode = nodeKey.includes("success") || nodeKey.includes("victory") || 
    nodeKey.includes("ending") || nodeKey === "victory" || 
    (node.caption && (node.caption.includes("SUCCESS") || node.caption.includes("VICTORY")));

  if (panelBox) {
    panelBox.classList.remove("shake", "alarm-flash", "success-glow");
    if (isFailureOrDanger) {
      void panelBox.offsetWidth; // Force DOM reflow
      panelBox.classList.add("shake", "alarm-flash");
    } else if (isSuccessNode) {
      void panelBox.offsetWidth;
      panelBox.classList.add("success-glow");
    }

    if (node.bgImage) {
      panelBox.style.backgroundImage = `url('${node.bgImage}')`;
      panelBox.style.backgroundSize = "cover";
      panelBox.style.backgroundPosition = "center";
    }
  }

  // --- B. AUDIO INTEGRATION ENGINE ---
  if (window.audioManager && typeof audioManager.play === "function") {
    audioManager.stopAll();
    if (nodeKey === "intro_p1" || isSuccessNode || nodeKey === "museum_exit" || nodeKey.includes("ending")) {
      audioManager.play('theme_song', true);
    } else {
      audioManager.play('choice_confirm');
      if (node.sfx) {
        audioManager.play(node.sfx, node.sfxLoop || false);
      } else if (nodeKey.includes("alarm") || nodeKey.includes("warning")) {
        audioManager.play('alarm_1202', false);
      } else if (nodeKey.includes("launch") || nodeKey === "m3_p1_mcc") {
        audioManager.play('rocket_launch');
      } else if (isFailureOrDanger) {
        audioManager.play('failure');
      }
    }
  }

  // --- C. CAPTION & DEBRIEF / GLOSSARY RENDER ---
  const captionBox = document.getElementById("caption-box");
  if (captionBox) {
    const textContent = node.caption || "";
    captionBox.innerHTML = typeof parseGlossaryTerms === "function" 
      ? parseGlossaryTerms(textContent) 
      : textContent;

    if (nodeKey === "museum_exit") {
      captionBox.classList.add("caption-epilogue");
    } else {
      captionBox.classList.remove("caption-epilogue");
    }
  }

  // Failure Log System Handler
  const debriefBox = document.getElementById("debrief-box");
  if (debriefBox) {
    if (node.debrief) {
      debriefBox.innerHTML = `<div class="debrief-title">📖 WHAT REALLY HAPPENED</div>${typeof parseGlossaryTerms === "function" ? parseGlossaryTerms(node.debrief) : node.debrief}`;
      debriefBox.classList.remove("hidden");
    } else {
      debriefBox.classList.add("hidden");
    }
  }

  // Secret Hover Overlay Toggles
  const rezZone = document.getElementById("secret-rez-zone");
  if (rezZone) {
    if (nodeKey === "museum_exit") rezZone.classList.remove("hidden");
    else rezZone.classList.add("hidden");
  }

  const astroZone = document.getElementById("secret-astro-zone");
  if (astroZone) {
    if (nodeKey === "intro_p1") astroZone.classList.remove("hidden");
    else astroZone.classList.add("hidden");
  }

  // --- D. NASA HUD TELEMETRY OVERLAY ---
  const hudOverlay = document.getElementById("hud-overlay");
  const hudImg = document.getElementById("hud-img");
  const hudCaption = document.getElementById("hud-caption");

  if (hudOverlay) {
    if (node.hud) {
      hudOverlay.classList.remove("hidden");
      if (isFailureOrDanger) hudOverlay.classList.add("alert");
      else hudOverlay.classList.remove("alert");

      if (hudImg) {
        if (node.hud.image) {
          hudImg.style.display = "block";
          hudImg.src = node.hud.image;
          hudImg.onerror = () => {
            hudImg.style.display = "none";
            console.warn(`[Telemetry Asset Warning] Failed to load image: ${node.hud.image}`);
          };
        } else {
          hudImg.style.display = "none";
        }
      }
      if (hudCaption) hudCaption.innerText = node.hud.caption || "";
    } else {
      hudOverlay.classList.add("hidden");
      hudOverlay.classList.remove("alert");
    }
  }

  // --- E. DECISION CHOICES & SHUFFLING ---
  const choicesContainer = document.getElementById("choices-container");
  if (choicesContainer) {
    choicesContainer.innerHTML = "";
    if (node.choices && node.choices.length > 0) {
      const isMenuNode = nodeKey.startsWith("intro_") || nodeKey.includes("victory") || nodeKey === "museum_exit";
      const displayChoices = (isMenuNode || typeof shuffleArray !== "function") 
        ? node.choices 
        : shuffleArray(node.choices);

      displayChoices.forEach((choice, index) => {
        const btn = document.createElement("button");
        btn.className = "choice-btn";
        const cleanText = choice.text.replace(/^[0-9]\.\s*/, "");
        btn.textContent = isMenuNode ? choice.text : `${index + 1}. ${cleanText}`;
        
        btn.addEventListener("mouseenter", () => {
          if (window.audioManager && typeof audioManager.play === "function") {
            audioManager.play('ui_hover');
          }
        });

        btn.onclick = () => renderNode(choice.nextNode);
        choicesContainer.appendChild(btn);
      });
    }
  }

  // --- F. AUTOMATIC ARCHIVE & ENDING LOG TRIGGER ---
  if (typeof recordArchiveLog === "function") {
    // 1. Direct match for any registered node in ARCHIVE_LOGS
    if (typeof ARCHIVE_LOGS !== "undefined" && ARCHIVE_LOGS[nodeKey]) {
      recordArchiveLog(nodeKey);
    }

    // 2. Mission Victory aliases fallback
    if (nodeKey === "m1_p9_victory" || nodeKey === "m1_p6_ending") {
      recordArchiveLog("m1_victory");
    } else if (nodeKey === "m2_p9_victory" || nodeKey === "m2_p4_success") {
      recordArchiveLog("m2_victory");
    } else if (nodeKey === "m3_p9_victory" || nodeKey === "m3_p4_earthrise") {
      recordArchiveLog("m3_victory");
    } else if (nodeKey === "m4_p9_victory" || nodeKey === "m4_success" || nodeKey === "victory") {
      recordArchiveLog("m4_victory");
    } else if (nodeKey === "m5_p9_victory" || nodeKey === "m5_p4_success") {
      recordArchiveLog("m5_victory");
    } else if (nodeKey === "m6_p9_victory" || nodeKey === "m6_p4_success") {
      recordArchiveLog("m6_victory");
    } else if (nodeKey === "m7_p9_victory" || nodeKey === "m7_p4_success") {
      recordArchiveLog("m7_victory");
    }
  }

  // Sync HUD counter
  if (typeof updateLogsCounterUI === "function") {
    updateLogsCounterUI();
  }
}

// 4. KEYBOARD NAVIGATION HOTKEYS
document.addEventListener("keydown", (e) => {
  const choicesContainer = document.getElementById("choices-container");
  const titleScreen = document.getElementById("title-screen");
  if (titleScreen && !titleScreen.classList.contains("hidden")) return;

  const modal = document.getElementById("judge-info-modal");
  if (modal && !modal.classList.contains("hidden")) return;

  if (choicesContainer && !choicesContainer.classList.contains("hidden")) {
    const buttons = choicesContainer.querySelectorAll(".choice-btn");
    if (["1", "2", "3", "4"].includes(e.key)) {
      const index = parseInt(e.key) - 1;
      if (buttons[index]) buttons[index].click();
    } else if (e.key === "Enter" && buttons.length === 1) {
      buttons[0].click();
    }
  }
});

// 5. JUDGE INFO MODAL CONTROLLERS
function openJudgeInfoModal() {
  const modal = document.getElementById("judge-info-modal");
  if (modal) {
    modal.classList.remove("hidden");
    if (window.audioManager && typeof audioManager.play === "function") audioManager.play('ui_click');
  }
}

function closeJudgeInfoModal() {
  const modal = document.getElementById("judge-info-modal");
  if (modal) {
    modal.classList.add("hidden");
    if (window.audioManager && typeof audioManager.play === "function") audioManager.play('ui_click');
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeJudgeInfoModal();
});