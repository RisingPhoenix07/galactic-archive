// --- MASTER GAME STORY TREE ---
const storyTree = {
  // LEVEL 0: THE GALACTIC ARCHIVE MUSEUM
  intro_p1: {
    bgImage: "assets/panels/intro_1.jpg",
    caption: "The year is 2026. Inside the Galactic Archive Museum, history isn't just stored... it's lived.",
    hud: null,
    choices: [
      { text: "Approach Terminal Alcove", nextNode: "intro_p2" }
    ]
  },
  intro_p2: {
    bgImage: "assets/panels/intro_2.jpg",
    caption: "You discover a glowing retro-futuristic terminal in a dark alcove. Prompts flicker across the screen.",
    hud: null,
    choices: [
      { text: "Initiate Mission 1 (Friendship 7)", nextNode: "m1_entry" },
      { text: "Initiate Mission 2 (Gemini 4)", nextNode: "m2_p1_hhmu" },
      { text: "Initiate Mission 3 (Apollo 8)", nextNode: "m3_p1_mcc" },
      { text: "Initiate Mission 4 (Apollo 11)", nextNode: "m4_entry" }
    ]
  },
  // --- MISSION 1: FRIENDSHIP 7 (EXACT IMAGE FILENAMES) ---
  m1_entry: {
    bgImage: "assets/panels/m1p1.jpg",
    caption: "MISSION 1 (1962): John Glenn aboard Friendship 7! Systems initialized for Low Earth Orbit manual and fly-by-wire testing.",
    hud: {
      image: "assets/nasa_data/mercury_launch_telemetry.jpg",
      caption: "REAL TELEMETRY: Atlas D Booster | Orbit: 160 KM | Velocity: 17,500 MPH"
    },
    choices: [
      { text: "Monitor Orbital Drift & Systems", nextNode: "m1_p2_drift" },
      { text: "Check Telemetry Warnings", nextNode: "m1_p3_warning" }
    ]
  },

  m1_p2_drift: {
    bgImage: "assets/panels/M1_P2 _ Drift.jpg",
    caption: "PATH 4 FAILURE: Uncontrolled Orbital Drift! Cabin pressure loss detected, Seal 3B breach.",
    hud: null,
    choices: [
      { text: "Retry Mission 1", nextNode: "m1_entry" }
    ]
  },

  m1_p3_warning: {
    bgImage: "assets/panels/M1_P3_ warning.jpg",
    caption: "DP2: SENSOR SEGMENT 51 WARNING! Telemetry indicates Landing Bag Unlatched. Jettisoning retropack could lose the heat shield!",
    hud: {
      image: "assets/nasa_data/mercury_landingbag_telemetry.jpg",
      caption: "REAL TELEMETRY: Sensor Seg 51: UNLATCHED | Retropack: LOCKED | Re-entry Approaching"
    },
    choices: [
      { text: "Keep Retropack Strapped On for Re-entry", nextNode: "m1_p5_fireball" },
      { text: "Jettison Retropack Prematurely", nextNode: "m1_p4_jettison" }
    ]
  },

  m1_p4_jettison: {
    bgImage: "assets/panels/M1_P4 _  Jettison.jpg",
    caption: "PATH 2 FAILURE: Retropack jettisoned! Loose heat shield exposed without retropack straps holding it in place.",
    hud: null,
    choices: [
      { text: "Retry Mission 1", nextNode: "m1_entry" }
    ]
  },

  m1_p5_fireball: {
    bgImage: "assets/panels/M1-P5 —Fireball .jpg",
    caption: "PATH 1 HISTORICAL SUCCESS: Fireball re-entry with retropack straps consuming in flames! Heat shield held secure.",
    hud: null,
    choices: [
      { text: "Deploy Main Parachute for Splashdown", nextNode: "m1_p6_ending" }
    ]
  },

  m1_p6_ending: {
    bgImage: "assets/panels/M1-P6 — true ending.jpg",
    caption: "SPLASHDOWN VICTORY: Friendship 7 safely in Atlantic waters! Recovery helicopter on station.",
    hud: null,
    choices: [
      { text: "Log Achievement at Terminal", nextNode: "m1_p9_victory" }
    ]
  },

  m1_p7_tumble: {
    bgImage: "assets/panels/M1-P7 — Tumble .jpg",
    caption: "FAILURE: Gyroscopic tumble! Friendship 7 capsule spinning wildly in Low Earth Orbit.",
    hud: null,
    choices: [
      { text: "Retry Mission 1", nextNode: "m1_entry" }
    ]
  },

  m1_p8_autofail: {
    bgImage: "assets/panels/M1-P8 — Auto failure.jpg",
    caption: "PATH 5 CRITICAL FAILURE: Auto Control Lost / Gyro Failure! Retropack controls locked in spin.",
    hud: null,
    choices: [
      { text: "Retry Mission 1", nextNode: "m1_entry" }
    ]
  },

  m1_p9_victory: {
    bgImage: "assets/panels/M1-P9 — Victory log.jpg",
    caption: "VICTORY: Friendship 7 Traineeship Badge Unlocked! First US Manned Orbital Flight logged into Galactic Archive.",
    hud: null,
    choices: [
      { text: "Proceed to Mission 2 (Gemini 4)", nextNode: "m2_p1_hhmu" }
    ]
  },
  // --- MISSION 2: GEMINI 4 (FIRST US SPACEWALK) ---
  m2_p1_hhmu: {
    bgImage: "assets/panels/m2_p1_hhmu.jpg",
    caption: "MISSION 2 (1965): Ed White activates Hand-Held Maneuvering Unit (HHMU)! Controlled gas bursts adjust position ~160 miles above the Pacific.",
    hud: {
      image: "assets/nasa_data/gemini4_eva_telemetry.jpg",
      caption: "REAL TELEMETRY: Altitude: 160 MI | Hand-Held Thruster Pressure: 4,000 PSI | Oxygen: Nominal"
    },
    choices: [
      { text: "Control EVA Thrusters & Pull Tether", nextNode: "m2_p2_tether" },
      { text: "Exceed Gas Bursts & Entangle Tether", nextNode: "m2_p5_tether_wrap" }
    ]
  },

  m2_p2_tether: {
    bgImage: "assets/panels/m2_p2_tether_pull.jpg",
    caption: "DP1-C: Hand-Over-Hand Tether Pulling! Suit metabolics entering the red zone. Heart rate 168 BPM — must reach the pod!",
    hud: {
      image: "assets/nasa_data/gemini4_metabolics.jpg",
      caption: "REAL TELEMETRY: HR: 168 BPM | O2: 72% | Metabolic Load: HIGH | Suit Fatigue Warning"
    },
    choices: [
      { text: "Climb Into Cockpit & Seal Hatch", nextNode: "m2_p3_hatch" },
      { text: "Over-Exert Physical Strain (Fog Visor)", nextNode: "m2_p7_fogged" }
    ]
  },

  m2_p3_hatch: {
    bgImage: "assets/panels/m2_p3_hatch_bind.jpg",
    caption: "DP3: Hatch Mechanism Binds! Sun heat warped the titanium rim. If you don't ratchet it free now, the hatch seals permanently jammed open!",
    hud: {
      image: "assets/nasa_data/gemini4_hatch_telemetry.jpg",
      caption: "REAL TELEMETRY: Thermal Expansion Delta: +1.2mm | Hatch Seal: UNLOCKED | Cabin Pressure: LOW"
    },
    choices: [
      { text: "Force Ratchet Lock Mechanism", nextNode: "m2_p4_success" },
      { text: "Force Lock & Bend Hatch Dogs", nextNode: "m2_p8_pressure_leak" },
      { text: "Initiate Emergency Retrofire Unsealed", nextNode: "m2_p6_jammed_retro" }
    ]
  },

  // MISSION 2 OUTCOMES & PATHS
  m2_p4_success: {
    bgImage: "assets/panels/m2_p4_true_ending.jpg",
    caption: "PATH 1 HISTORICAL SUCCESS: Cabin sealed and re-pressurized! 'Re-pressurized — all systems nominal — we did it!'",
    hud: null,
    choices: [
      { text: "Log Gemini 4 Pioneer Badge", nextNode: "m2_p9_victory" }
    ]
  },

  m2_p5_tether_wrap: {
    bgImage: "assets/panels/m2_p5_tether_wrap.jpg",
    caption: "PATH 2 FAILURE: Tether Entanglement & Spin Failure! Critical oxygen exhaustion. Capsule spinning at 12 RPM.",
    hud: null,
    choices: [
      { text: "Retry Mission 2", nextNode: "m2_p1_hhmu" }
    ]
  },

  m2_p6_jammed_retro: {
    bgImage: "assets/panels/m2_p6_jammed_retro.jpg",
    caption: "PATH 3 FAILURE: Jammed Latch & Retrofire! Emergency de-orbit initiated while hatch seal remained unlatched.",
    hud: null,
    choices: [
      { text: "Retry Mission 2", nextNode: "m2_p1_hhmu" }
    ]
  },

  m2_p7_fogged: {
    bgImage: "assets/panels/m2_p7_fogged_visor.jpg",
    caption: "PATH 4 FAILURE: Metabolic Overheat & Visor Fogging! Suit temp reached 48.7°C. Cooling system offline.",
    hud: null,
    choices: [
      { text: "Retry Mission 2", nextNode: "m2_p1_hhmu" }
    ]
  },

  m2_p8_pressure_leak: {
    bgImage: "assets/panels/m2_p8_pressure_leak.jpg",
    caption: "PATH 5 CRITICAL FAILURE: Bent Hatch Dogs & Cabin Pressure Leak! Pressure falling past 3.2 PSI.",
    hud: null,
    choices: [
      { text: "Retry Mission 2", nextNode: "m2_p1_hhmu" }
    ]
  },

  m2_p9_victory: {
    bgImage: "assets/panels/m2_p9_victory_log.jpg",
    caption: "VICTORY: Gemini 4 Flight Log & Pioneer Badge Logged! Data synced to Galactic Archive Terminal.",
    hud: null,
    choices: [
      { text: "Proceed to Mission 3 (Apollo 8)", nextNode: "m3_p1_mcc" }
    ]
  },
  // --- MISSION 3: APOLLO 8 (LUNAR ORBIT & EARTHRISE) ---
  m3_p1_mcc: {
    bgImage: "assets/panels/m3_p1_mcc_burn.jpg",
    caption: "MISSION 3: Trans-Lunar Coast DP1! Service Propulsion System burn required for mid-course trajectory correction.",
    hud: {
      image: "assets/nasa_data/apollo8_telemetry.jpg",
      caption: "REAL NASA DATA: S-IVB Trans-Lunar Injection Telemetry | TLI Velocity 24,200 mph"
    },
    choices: [
      { text: "Execute Mid-Course Burn", nextNode: "m3_p2_loi" },
      { text: "Over-Thrust & Deviate Trajectory", nextNode: "m3_p7_skipout" }
    ]
  },

  m3_p2_loi: {
    bgImage: "assets/panels/m3_p2_loi_burn.jpg",
    caption: "DP2: Lunar Farside SPS LOI Engine Burn! Retro-burn initiated behind the Moon to capture into lunar orbit.",
    hud: {
      image: "assets/nasa_data/apollo8_loi.jpg",
      caption: "REAL TELEMETRY: GET 132:45 | Velocity: 5300 FT/SEC | LOI Burn: 350 SEC"
    },
    choices: [
      { text: "Maintain SPS Burn & Enter Orbit", nextNode: "m3_p3_comms" },
      { text: "Abort LOI Burn Mid-Engine Firing", nextNode: "m3_p6_flyby" }
    ]
  },

  m3_p3_comms: {
    bgImage: "assets/panels/m3_p3_comms_loss.jpg",
    caption: "DP3: Lunar Farside Loss of Signal (LOS)! Complete telemetry blackout behind the Moon.",
    hud: {
      image: "assets/nasa_data/apollo8_los.jpg",
      caption: "REAL NASA DATA: Farside Mapping Frame AS08-12-2209 | LOS +00:12:43"
    },
    choices: [
      { text: "Hold Attitude & Await AOS", nextNode: "m3_p4_earthrise" },
      { text: "Manual Thruster Override", nextNode: "m3_p5_impact" },
      { text: "Mishandle Orbital Stabilization", nextNode: "m3_p8_mascon" }
    ]
  },

  // MISSION 3 OUTCOMES & PATHS
  m3_p4_earthrise: {
    bgImage: "assets/panels/m3_p4_path1_earthrise\".jpg",
    caption: "PATH 1 SUCCESS: Earthrise & Genesis Reading! 'We read Genesis as Earth rose above the Moon.'",
    hud: {
      image: "assets/nasa_data/apollo8_earthrise.jpg",
      caption: "REAL NASA HISTORICAL PHOTO: Hasselblad 70mm Frame AS08-14-2383 (Earthrise)"
    },
    choices: [
      { text: "Log Achievement Badge at Terminal", nextNode: "m3_p9_victory" }
    ]
  },

  m3_p5_impact: {
    bgImage: "assets/panels/m3_p5_path2_impact.jpg",
    caption: "PATH 2 FAILURE: Fatal Trajectory Error! Impact imminent on Lunar Farside. Gyro failed, no rescue possible.",
    hud: null,
    choices: [
      { text: "Restart Mission 3", nextNode: "m3_p1_mcc" }
    ]
  },

  m3_p6_flyby: {
    bgImage: "assets/panels/m3_p6_path3_flyby.jpg",
    caption: "PATH 3 FAILURE: Hyperbolic Flyby / Missed Capture! Orbit capture failed. Capsule committed to free-return loop.",
    hud: null,
    choices: [
      { text: "Restart Mission 3", nextNode: "m3_p1_mcc" }
    ]
  },

  m3_p7_skipout: {
    bgImage: "assets/panels/m3_p7_path4_skipout.jpg",
    caption: "PATH 4 FAILURE: Atmospheric Skip-Out! Heatshield glowing at 1200°C. Trajectory skipped off atmosphere into orbital drift.",
    hud: null,
    choices: [
      { text: "Restart Mission 3", nextNode: "m3_p1_mcc" }
    ]
  },

  m3_p8_mascon: {
    bgImage: "assets/panels/m3_p8_path5_mascon_reentry.jpg",
    caption: "PATH 5 CRITICAL FAILURE: Mascon Drift & Steep Re-entry! Thermal limit exceeded at 3,300°C. Structural failure imminent.",
    hud: null,
    choices: [
      { text: "Restart Mission 3", nextNode: "m3_p1_mcc" }
    ]
  },

  m3_p9_victory: {
    bgImage: "assets/panels/m3_p9_victory_log.jpg",
    caption: "VICTORY: Apollo 8 Achievement Badge Logged! Apollo 8 Flight Telemetry synced to Museum Terminal.",
    hud: null,
    choices: [
      { text: "Proceed to Mission 4 (Apollo 11)", nextNode: "m4_entry" }
    ]
  },
  // MISSION 4: APOLLO LUNAR DESCENT & ALARM
  m4_entry: {
    bgImage: "assets/panels/m4_p4_alarm.jpg",
    caption: "DP1: 1202 ALARM FLASHING! Guidance computer executive overflow detected during powered descent!",
    hud: {
      image: "assets/nasa_data/apollo_dsky_telemetry.jpg",
      caption: "REAL TELEMETRY: Executive Overflow | BAILOUT 1201/1202 | CPU Load: 115%"
    },
    choices: [
      { text: "Trust Steve Bales & Override", nextNode: "m4_pitchover" },
      { text: "Abort Landing Immediately", nextNode: "m4_abort" },
      { text: "Clear Computer RAM Cache", nextNode: "m4_glitch" }
    ]
  },

  m4_pitchover: {
    bgImage: "assets/panels/m4_p2_boulders.jpg",
    caption: "DP2: Pitchover Mode! Altitude 1,180 FT. Boulders detected inside West Crater landing footprint!",
    hud: {
      image: "assets/nasa_data/west_crater_recon.jpg",
      caption: "REAL TELEMETRY: Pitchover Mode | Altitude: 1,180 FT | Fuel: 12%"
    },
    choices: [
      { text: "Take Semi-Automatic P66 Control", nextNode: "m4_touchdown" },
      { text: "Maintain Auto-Pilot Trajectory", nextNode: "m4_crash" },
      { text: "Increase Engine Thrust to 100%", nextNode: "m4_engine_fault" }
    ]
  },

  m4_touchdown: {
    bgImage: "assets/panels/m4_p3_contact.jpg",
    caption: "DP3: Blue Contact Light Active! 20 seconds of fuel remaining over Tranquility Base.",
    hud: {
      image: "assets/nasa_data/tranquility_coordinates.jpg",
      caption: "REAL TELEMETRY: Blue Contact Light Active | Fuel: 3% (20s Remaining)"
    },
    choices: [
      { text: "Cut Engine & Touch Down", nextNode: "m4_success" },
      { text: "Hover & Search for Flat Soil", nextNode: "m4_crash" }
    ]
  },

  // MISSION 4 OUTCOMES
  m4_success: {
    bgImage: "assets/panels/m4_p4_path1_tranquility.jpg",
    caption: "PATH 1 SUCCESS: 'Houston, Tranquility Base here. The Eagle has landed!' Mission Accomplished!",
    hud: null,
    choices: [
      { text: "Claim Mission Badge", nextNode: "victory" }
    ]
  },

  m4_abort: {
    bgImage: "assets/panels/m4_p5_path2_abort.jpg",
    caption: "PATH 2 FAILURE: Abort stage fired at 5,000 FT. Crew survived, but landing was abandoned.",
    hud: null,
    choices: [
      { text: "Restart Mission 4", nextNode: "m4_entry" }
    ]
  },

  m4_crash: {
    bgImage: "assets/panels/m4_p6_path3_tipover.jpg",
    caption: "PATH 3 CRITICAL FAILURE: Lander struck West Crater boulders at 22° tilt angle. Hull breached.",
    hud: null,
    choices: [
      { text: "Restart Mission 4", nextNode: "m4_entry" }
    ]
  },

  m4_engine_fault: {
    bgImage: "assets/panels/m4_p7_path4_explosion.jpg",
    caption: "PATH 4 CRITICAL FAULT: Engine thermal overload! Nozzle vapor seal ruptured in vacuum.",
    hud: null,
    choices: [
      { text: "Restart Mission 4", nextNode: "m4_entry" }
    ]
  },

  m4_glitch: {
    bgImage: "assets/panels/m4_p8_path5_tumble.jpg",
    caption: "PATH 5 SYSTEM FAILURE: RAM wipe erased orbital guidance tables. Lander tumbling out of control.",
    hud: null,
    choices: [
      { text: "Restart Mission 4", nextNode: "m4_entry" }
    ]
  },

  victory: {
    bgImage: "assets/panels/m4_p4_path1_tranquility.jpg",
    caption: "VICTORY: Lunar Pioneer Badge Granted! Archived data synced to Museum profile.",
    hud: null,
    choices: [
      { text: "Return to Museum Intro", nextNode: "intro_p1" }
    ]
  }
};
function goToMainMenu() {
  // Confirm if the user actually wants to leave mid-mission
  if (confirm("Are you sure you want to quit the current mission and return to the Main Menu?")) {
    renderNode("intro_p1"); // Or whatever your opening/main menu node ID is
  }
}
// ==========================================
// 2. SESSION SAVING & RESTORATION
// ==========================================

function saveCurrentSession(nodeKey) {
  localStorage.setItem("galactic_archive_saved_node", nodeKey);
}

function getSavedSession() {
  return localStorage.getItem("galactic_archive_saved_node");
}

// Check saved state to enable/disable "RESET SESSION" button on title page
function updateTitleMenuButtons() {
  const resetBtn = document.getElementById("reset-btn") || document.getElementById("restore-btn");
  const savedNode = getSavedSession();
  
  if (resetBtn) {
    if (savedNode) {
      resetBtn.disabled = false;
      resetBtn.textContent = "RESET SESSION";
    } else {
      resetBtn.disabled = true;
      resetBtn.textContent = "NO SAVED SESSION";
    }
  }
}
function startNewGame() {
  const saved = getSavedSession();
  if (saved && !confirm("Starting a new game will overwrite your previous session progress. Continue?")) {
    return;
  }
  showGameInterface();
  renderNode("intro_p1");
}

// Option 2: Reset Session (Purges achievements, clears session, and starts from the very beginning)
function resetSession() {
  if (!confirm("This will clear all unlocked achievements and restart your progress from the beginning. Continue?")) {
    return;
  }

  // 1. Remove all unlocked achievements & save data from LocalStorage
  localStorage.removeItem("galactic_archive_achievements");
  localStorage.removeItem("galactic_archive_saved_node");

  // 2. Re-render empty/locked badge panel
  if (typeof renderAchievementBadges === "function") {
    renderAchievementBadges();
  }

  // 3. Update title screen buttons state
  updateTitleMenuButtons();

  // 4. Switch view and start from the very beginning
  showGameInterface();
  renderNode("intro_p1");
}

function showGameInterface() {
  const titleScreen = document.getElementById("title-screen");
  const hudBar = document.getElementById("hud-bar");
  const panelBox = document.getElementById("panel-box") || document.getElementById("comic-panel");
  const choicesContainer = document.getElementById("choices-container");

  if (titleScreen) titleScreen.classList.add("hidden");
  if (hudBar) hudBar.classList.remove("hidden");
  if (panelBox) panelBox.classList.remove("hidden");
  if (choicesContainer) choicesContainer.classList.remove("hidden");
}
// ==========================================
// 1. ACHIEVEMENTS DATA DEFINITION
// ==========================================
const ACHIEVEMENTS = {
  m1_pioneer: { 
    id: "m1_pioneer", 
    title: "Friendship 7 Pioneer", 
    desc: "Successfully completed Mercury-Atlas 6 flight." 
  },
  m2_pioneer: { 
    id: "m2_pioneer", 
    title: "Gemini 4 Spacewalker", 
    desc: "Executed the first US EVA and sealed the hatch." 
  },
  m3_pioneer: { 
    id: "m3_pioneer", 
    title: "Apollo 8 Earthrise", 
    desc: "Navigated lunar orbit and witnessed Earthrise." 
  },
  m4_pioneer: { 
    id: "m4_pioneer", 
    title: "Tranquility Base Commander", 
    desc: "Landed Apollo 11 at West Crater successfully." 
  }
};
// Retrieve unlocked achievements from LocalStorage
function getUnlockedAchievements() {
  const data = localStorage.getItem("galactic_archive_achievements");
  return data ? JSON.parse(data) : [];
}

// Unlock a badge and persist to LocalStorage
function unlockAchievement(achievementId) {
  let unlocked = getUnlockedAchievements();
  if (!unlocked.includes(achievementId)) {
    unlocked.push(achievementId);
    localStorage.setItem("galactic_archive_achievements", JSON.stringify(unlocked));
    showAchievementPopup(ACHIEVEMENTS[achievementId]);
    renderAchievementBadges();
  }
}

// Display lightweight notification toast when unlocked
function showAchievementPopup(badge) {
  const toast = document.createElement("div");
  toast.className = "achievement-toast";
  toast.innerHTML = `
    <div class="toast-title">🏆 ACHIEVEMENT UNLOCKED!</div>
    <div class="toast-name">${badge.title}</div>
    <div class="toast-desc">${badge.desc}</div>
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

function renderAchievementBadges() {
  const panel = document.getElementById("achievement-panel");
  if (!panel) return;

  const unlocked = getUnlockedAchievements();
  panel.innerHTML = ""; // Clear existing

  Object.values(ACHIEVEMENTS).forEach(badge => {
    const isUnlocked = unlocked.includes(badge.id);
    const badgeEl = document.createElement("div");
    badgeEl.className = `badge-item ${isUnlocked ? 'unlocked' : 'locked'}`;
    badgeEl.title = `${badge.title}: ${badge.desc}`;
    badgeEl.innerHTML = `
      <span class="badge-icon">${isUnlocked ? '🏅' : '🔒'}</span>
      <span class="badge-title">${badge.title}</span>
    `;
    panel.appendChild(badgeEl);
  });
}

// Initialize badges on page load
document.addEventListener("DOMContentLoaded", renderAchievementBadges);
// --- CORE ENGINE RENDERER ---
// --- RENDER NODE FUNCTION ---
function renderNode(nodeKey) {
  const node = storyTree[nodeKey];
  
  if (!node) {
    console.error(`Error: Node key '${nodeKey}' does not exist in storyTree!`);
    return;
  }

  // 1. Render Comic Panel Background Image
  const panelBox = document.getElementById("panel-box") || document.getElementById("comic-panel");
  if (panelBox && node.bgImage) {
    panelBox.style.backgroundImage = `url('${node.bgImage}')`;
  }

  // 2. Render Caption
  const captionBox = document.getElementById("caption-box") || document.getElementById("caption-text");
  if (captionBox) {
    captionBox.textContent = node.caption || "";
  }

  // 3. Render HUD Overlay
  const hudOverlay = document.getElementById("hud-overlay") || document.getElementById("nasa-hud");
  const hudImg = document.getElementById("hud-img") || document.getElementById("hud-image");
  const hudCaption = document.getElementById("hud-caption");

  if (hudOverlay) {
    if (node.hud) {
      hudOverlay.classList.remove("hidden");
      if (hudImg) hudImg.src = node.hud.image || node.hud.img || "";
      if (hudCaption) hudCaption.textContent = node.hud.caption || "";
    } else {
      hudOverlay.classList.add("hidden");
    }
  }

  // 4. Render Action Buttons
  const choicesContainer = document.getElementById("choices-container");
  if (choicesContainer) {
    choicesContainer.innerHTML = "";
    if (node.choices && node.choices.length > 0) {
      node.choices.forEach(choice => {
        const btn = document.createElement("button");
        btn.className = "choice-btn";
        btn.textContent = choice.text;
        btn.onclick = () => renderNode(choice.nextNode);
        choicesContainer.appendChild(btn);
      });
    }
  }

  // 5. AUTOMATIC BADGE UNLOCK CHECKER ---
  if (nodeKey === "m1_p9_victory" || nodeKey === "m1_victory") {
    unlockAchievement("m1_pioneer");
  } else if (nodeKey === "m2_p9_victory" || nodeKey === "m2_p4_success" || nodeKey === "m2_victory") {
    unlockAchievement("m2_pioneer");
  } else if (nodeKey === "m3_p9_victory" || nodeKey === "m3_victory") {
    unlockAchievement("m3_pioneer");
  } else if (
    nodeKey === "m4_p9_victory" || 
    nodeKey === "m4_victory" || 
    nodeKey === "m4_success" || 
    nodeKey === "victory"
  ) {
    unlockAchievement("m4_pioneer");
  }

  // 6. Refresh persistent badges in UI
  renderAchievementBadges();
}
// Triggered when returning to main menu
function goToMainMenu() {
  if (confirm("Return to the title screen? Progress in this session will be saved.")) {
    // Show Title Screen
    document.getElementById("title-screen").classList.remove("hidden");

    // Hide Gameplay Screens
    document.getElementById("hud-bar").classList.add("hidden");
    document.getElementById("panel-box").classList.add("hidden");
    document.getElementById("choices-container").classList.add("hidden");
  }
}
// Triggered when clicking "START GAME" on the front cover page
function startGame() {
  // Hide Title Screen
  document.getElementById("title-screen").classList.add("hidden");

  // Reveal Top HUD Bar & Main Game Panels
  document.getElementById("hud-bar").classList.remove("hidden");
  document.getElementById("panel-box").classList.remove("hidden");
  document.getElementById("choices-container").classList.remove("hidden");

  // Load the initial game node (MUST match storyTree key!)
  renderNode("intro_p1"); 
}