// ==========================================
// CORE GAME ENGINE & RENDERING LOOP
// ==========================================

let currentNodeId = "intro_p1";
let decisionHistory = [];
//const sessionMiniGameFailures = {};

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
    stopReadAloud();

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
  stopReadAloud();

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
      void panelBox.offsetWidth;
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
    captionBox.innerHTML = typeof parseGlossaryTerms === "function" ? parseGlossaryTerms(textContent) : textContent;

    if (nodeKey === "museum_exit") {
      captionBox.classList.add("caption-epilogue");
    } else {
      captionBox.classList.remove("caption-epilogue");
    }
  }

  const debriefBox = document.getElementById("debrief-box");
  if (debriefBox) {
    if (node.debrief) {
      const parsedDebrief = typeof parseGlossaryTerms === "function" ? parseGlossaryTerms(node.debrief) : node.debrief;
      debriefBox.innerHTML = `<div class="debrief-title">📖 WHAT REALLY HAPPENED</div>${parsedDebrief}`;
      debriefBox.classList.remove("hidden");
    } else {
      debriefBox.classList.add("hidden");
    }
  }

  if (typeof handleFailureNode === "function") {
    handleFailureNode(nodeKey);
  }

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

  // --- E. DECISION CHOICES, REWIND & SHUFFLING ---
  const choicesContainer = document.getElementById("choices-container");
  if (choicesContainer) {
    choicesContainer.innerHTML = "";

    // Reset rewind stack on Intro or Mission Select
    if (nodeKey === "intro_p1" || nodeKey === "intro_p2") {
      decisionHistory = [];
    }

    const isMenuNode = nodeKey.startsWith("intro_") || nodeKey.includes("victory") || nodeKey === "museum_exit";

    // Automatically inject Rewind button on any story failure node
    if (isFailureOrDanger && decisionHistory.length > 0) {
      const rewindBtn = document.createElement("button");
      rewindBtn.className = "choice-btn";
      rewindBtn.style.borderColor = "#00ff88";
      rewindBtn.style.color = "#00ff88";
      rewindBtn.textContent = "↶ Rewind to Last Decision";

      rewindBtn.addEventListener("mouseenter", () => {
        if (window.audioManager && typeof audioManager.play === "function") {
          audioManager.play('ui_hover');
        }
      });

      rewindBtn.onclick = () => {
        const prevNode = decisionHistory.pop();
        if (prevNode) renderNode(prevNode);
      };

      choicesContainer.appendChild(rewindBtn);
    }

    if (node.choices && node.choices.length > 0) {
      const displayChoices = (isMenuNode || typeof shuffleArray !== "function") ? node.choices : shuffleArray(node.choices);

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

        btn.onclick = () => {
          // Record checkpoint before leaving non-failure, non-menu decision nodes
          if (!isFailureOrDanger && !isMenuNode && nodeKey !== "intro_p2") {
            if (decisionHistory[decisionHistory.length - 1] !== nodeKey) {
              decisionHistory.push(nodeKey);
            }
          }

          if (choice.action === "LAUNCH_MERCURY_REENTRY") {
            if (typeof startMercuryReentryMiniGame === "function") {
              launchMiniGame(startMercuryReentryMiniGame, "m1_p5_fireball", "m1_p4_jettison");
            } else {
              renderNode("m1_p5_fireball");
            }

          } else if (choice.action === "LAUNCH_GEMINI_EVA") {
            if (typeof startGeminiEvaMiniGame === "function") {
              launchMiniGame(startGeminiEvaMiniGame, "m2_p3_hatch", "m2_p5_tether_wrap");
            } else {
              renderNode("m2_p2_tether");
            }

          } else if (choice.action === "LAUNCH_APOLLO8_LOI") {
            if (typeof startApollo8LoiMiniGame === "function") {
              launchMiniGame(startApollo8LoiMiniGame, "m3_p3_comms", "m3_p6_flyby");
            } else {
              renderNode("m3_p3_comms");
            }

          } else if (choice.action === "LAUNCH_LANDER_MINIGAME") {
            if (typeof launchLanderMiniGame === "function") {
              launchLanderMiniGame(
                () => renderNode("m4_success"),
                () => renderNode("m4_crash")
              );
            } else {
              renderNode("m4_touchdown");
            }

          } else if (choice.action === "LAUNCH_ARTEMIS_SPE") {
            if (typeof startArtemisSpeMiniGame === "function") {
              launchMiniGame(startArtemisSpeMiniGame, "m5_p4_success", "m5_p6_thermal_breach");
            } else {
              renderNode("m5_p4_success");
            }

          } else if (choice.action === "LAUNCH_MARS_SKYCRANE") {
            if (typeof startMarsSkyCraneMiniGame === "function") {
              launchMiniGame(startMarsSkyCraneMiniGame, "m6_p3_dust_storm", "m6_p5_boulder_crash");
            } else {
              renderNode("m6_p3_dust_storm");
            }

          } else if (choice.action === "LAUNCH_EUROPA_CRYOBOT") {
            if (typeof startEuropaCryobotMiniGame === "function") {
              launchMiniGame(startEuropaCryobotMiniGame, "m7_p3_hazard", "m7_p5_ice_crush");
            } else {
              renderNode("m7_p3_hazard");
            }

          } else if (choice.action === "RETRY_MINIGAME") {
            if (window.lastMiniGameContext) {
              const { gameLauncherFn, winNode, lossNode, config } = window.lastMiniGameContext;
              launchMiniGame(gameLauncherFn, winNode, lossNode, config);
            }

          } else if (choice.nextNode || choice.next) {
            const rawTarget = choice.nextNode || choice.next;
            const targetKey = rawTarget === "mission_select" ? "intro_p2" : rawTarget;
            renderNode(targetKey);

          } else {
            console.error("Choice is missing both 'action' and 'nextNode':", choice);
          }
        };

        choicesContainer.appendChild(btn);
      });
    }
  }

  // --- F. AUTOMATIC ARCHIVE & ENDING LOG TRIGGER ---
  if (typeof recordArchiveLog === "function") {
    if (typeof ARCHIVE_LOGS !== "undefined" && ARCHIVE_LOGS[nodeKey]) {
      recordArchiveLog(nodeKey);
    }
    if (nodeKey === "m1_p9_victory" || nodeKey === "m1_p6_ending") {
      recordArchiveLog("m1_victory");
      if (typeof unlockAchievement === "function") unlockAchievement("m1_pioneer");
    } else if (nodeKey === "m2_p9_victory" || nodeKey === "m2_p4_success") {
      recordArchiveLog("m2_victory");
      if (typeof unlockAchievement === "function") unlockAchievement("m2_pioneer");
    } else if (nodeKey === "m3_p9_victory" || nodeKey === "m3_p4_earthrise") {
      recordArchiveLog("m3_victory");
      if (typeof unlockAchievement === "function") unlockAchievement("m3_pioneer");
    } else if (nodeKey === "m4_p9_victory" || nodeKey === "m4_success" || nodeKey === "victory") {
      recordArchiveLog("m4_victory");
      if (typeof unlockAchievement === "function") unlockAchievement("m4_pioneer");
    } else if (nodeKey === "m5_p9_victory" || nodeKey === "m5_p4_success") {
      recordArchiveLog("m5_victory");
      if (typeof unlockAchievement === "function") unlockAchievement("m5_pioneer");
    } else if (nodeKey === "m6_p9_victory" || nodeKey === "m6_p4_success") {
      recordArchiveLog("m6_victory");
      if (typeof unlockAchievement === "function") unlockAchievement("m6_pioneer");
    } else if (nodeKey === "m7_p9_victory" || nodeKey === "m7_p4_success") {
      recordArchiveLog("m7_victory");
      if (typeof unlockAchievement === "function") unlockAchievement("m7_pioneer");
    }
  }

  if (typeof updateLogsCounterUI === "function") updateLogsCounterUI();
  if (typeof renderAchievementBadges === "function") renderAchievementBadges();

  preloadNextNodeAssets(nodeKey);
}

// 4. KEYBOARD NAVIGATION & DIALOG HOTKEYS (1, 2, 3, 4, Enter, ESC)
document.addEventListener("keydown", (e) => {
  if (e.key === 'Escape') {
    closeJudgeInfoModal();
    return;
  }

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

// ==========================================
// ACCESSIBILITY: ENHANCED READ-ALOUD SPEECH ENGINE
// ==========================================
let activeUtterance = null;

function toggleReadAloud() {
  if (!('speechSynthesis' in window)) {
    alert("Speech synthesis is not supported by your browser.");
    return;
  }

  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    updateReadAloudBtnUI(false);
    return;
  }

  const captionBox = document.getElementById("caption-box");
  if (!captionBox) return;

  const cleanText = captionBox.innerText.replace(/[\r\n]+/g, "");
  activeUtterance = new SpeechSynthesisUtterance(cleanText);

  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(v => v.lang.startsWith('en') && (
    v.name.includes('Google') || v.name.includes('Natural') || 
    v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('Zira')
  )) || voices.find(v => v.lang.startsWith('en'));

  if (preferredVoice) {
    activeUtterance.voice = preferredVoice;
  }

  activeUtterance.rate = 0.78;
  activeUtterance.pitch = 0.80;
  activeUtterance.onend = () => updateReadAloudBtnUI(false);
  activeUtterance.onerror = () => updateReadAloudBtnUI(false);

  window.speechSynthesis.speak(activeUtterance);
  updateReadAloudBtnUI(true);
}

if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}

function updateReadAloudBtnUI(isPlaying) {
  const btn = document.getElementById("read-aloud-btn");
  if (btn) {
    btn.innerHTML = isPlaying ? "⏹️ STOP READ" : "🔊 READ CAPTION";
    btn.classList.toggle("reading-active", isPlaying);
  }
}

function stopReadAloud() {
  if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    updateReadAloudBtnUI(false);
  }
}

// ==========================================
// MINI-GAME LAUNCHER & CHECKPOINT RETRY ENGINE
// ==========================================
function launchMiniGame(gameLauncherFn, winNode, lossNode, config = {}) {
  if (typeof gameLauncherFn !== 'function' && window.lastMiniGameContext) {
    ({ gameLauncherFn, winNode, lossNode, config } = window.lastMiniGameContext);
  }

  const panelBox = document.getElementById('panel-box');
  const captionBox = document.getElementById('caption-box');
  const hudOverlay = document.getElementById('hud-overlay');
  const choicesContainer = document.getElementById('choices-container');
  const canvasView = document.getElementById('canvas-view');
  const phaserContainer = document.getElementById('phaser-game-container') || canvasView;

  window.lastMiniGameContext = { gameLauncherFn, winNode, lossNode, config };

  if (phaserContainer) phaserContainer.innerHTML = '';
  if (panelBox) panelBox.classList.add('hidden');
  if (captionBox) captionBox.classList.add('hidden');
  if (hudOverlay) hudOverlay.classList.add('hidden');
  if (choicesContainer) choicesContainer.classList.add('hidden');
  if (canvasView) canvasView.classList.remove('hidden');

  const restoreStoryUI = () => {
    if (phaserContainer) phaserContainer.innerHTML = '';
    if (canvasView) canvasView.classList.add('hidden');
    if (panelBox) panelBox.classList.remove('hidden');
    if (captionBox) captionBox.classList.remove('hidden');
    if (choicesContainer) choicesContainer.classList.remove('hidden');
  };

  gameLauncherFn(
    phaserContainer,
    config,
    () => {
      restoreStoryUI();
      renderNode(winNode);
    },
    (reason) => {
      if (!phaserContainer) {
        restoreStoryUI();
        renderNode(lossNode);
        return;
      }

      phaserContainer.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; min-height:420px; background:#070d19; border:2px solid #ff3b3b; border-radius:8px; padding:24px; text-align:center; font-family:monospace; color:#e2e8f0; box-sizing:border-box;">
          <div style="color:#ff3b3b; font-size:20px; font-weight:bold; margin-bottom:10px;">⚠️ SIMULATION ANOMALY DETECTED</div>
          <p style="max-width:460px; color:#94a3b8; margin-bottom:24px; line-height:1.5;">
            ${reason ? reason : 'Telemetry indicates mission parameters were exceeded. Re-initialize the simulation immediately or proceed to the failure log.'}
          </p>
          <div style="display:flex; gap:14px; flex-wrap:wrap; justify-content:center;">
            <button id="mg-retry-btn" style="background:#00ff88; color:#050811; border:none; padding:12px 20px; font-family:monospace; font-weight:bold; font-size:14px; cursor:pointer; border-radius:4px;">
              ↻ RETRY SIMULATION
            </button>
            <button id="mg-abort-btn" style="background:transparent; color:#ff8888; border:1px solid #ff3b3b; padding:12px 20px; font-family:monospace; font-size:14px; cursor:pointer; border-radius:4px;">
              VIEW FAILURE LOG →
            </button>
          </div>
        </div>
      `;

      document.getElementById('mg-retry-btn').onclick = () => {
        launchMiniGame(gameLauncherFn, winNode, lossNode, config);
      };

      document.getElementById('mg-abort-btn').onclick = () => {
        restoreStoryUI();
        renderNode(lossNode);
      };
    }
  );
}

// ==========================================
// ASSET PIPELINE: BACKGROUND IMAGE PRELOADER & UTILS
// ==========================================
const preloadedImages = new Map();

function preloadSingleImage(url) {
  if (!url || preloadedImages.has(url)) return;
  const img = new Image();
  img.src = url;
  preloadedImages.set(url, img);
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function preloadNextNodeAssets(currentNodeKey) {
  if (typeof storyTree === "undefined") return;
  const currentNode = storyTree[currentNodeKey];
  if (!currentNode || !currentNode.choices) return;

  currentNode.choices.forEach(choice => {
    const nextKey = choice.nextNode || choice.next;
    if (!nextKey) return;
    const resolvedKey = nextKey === "mission_select" ? "intro_p2" : nextKey;
    const nextNode = storyTree[resolvedKey];
    if (nextNode) {
      if (nextNode.bgImage) preloadSingleImage(nextNode.bgImage);
      if (nextNode.hud && nextNode.hud.image) preloadSingleImage(nextNode.hud.image);
    }
  });
}

// ==========================================
// SHARED MINI-GAME BRIEFING OVERLAY HELPER
// ==========================================
function createBriefingOverlay(scene, width, height, titleText, bodyText, onStart) {
  const overlay = scene.add.container(width / 2, height / 2).setDepth(100);
  const box = scene.add.rectangle(0, 0, Math.min(580, width - 36), 255, 0x070d19, 0.95).setStrokeStyle(2, 0x00f0ff);
  const title = scene.add.text(0, -92, titleText, {
    fontFamily: 'monospace',
    fontSize: '15px',
    fontStyle: 'bold',
    fill: '#00f0ff'
  }).setOrigin(0.5);
  const body = scene.add.text(0, -10, bodyText, {
    fontFamily: 'monospace',
    fontSize: '13px',
    fill: '#e2e8f0',
    align: 'center',
    lineSpacing: 5
  }).setOrigin(0.5);
  const btn = scene.add.text(0, 90, '▶ PRESS [SPACE] OR CLICK TO START MISSION', {
    fontFamily: 'monospace',
    fontSize: '13px',
    fontStyle: 'bold',
    fill: '#050811',
    backgroundColor: '#00ff88',
    padding: { x: 14, y: 8 }
  }).setOrigin(0.5).setInteractive({ useHandCursor: true });

  btn.on('pointerdown', onStart);
  overlay.add([box, title, body, btn]);
  return overlay;
}
