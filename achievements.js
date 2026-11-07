// ==========================================
// MISSION & ENDING LOGS ENGINE
// ==========================================

const ARCHIVE_LOGS = {
  // Mission Victories (Mapped to actual storyData.js node keys & aliases)
  m1_victory: { id: "m1_victory", title: "Friendship 7 Orbit", type: "victory", desc: "Completed Mercury-Atlas 6 flight successfully." },
  m1_p9_victory: { id: "m1_p9_victory", title: "Friendship 7 Orbit", type: "victory", desc: "Completed Mercury-Atlas 6 flight successfully." },
  
  m2_victory: { id: "m2_victory", title: "Gemini 4 Spacewalk", type: "victory", desc: "Executed the first US EVA and sealed the hatch." },
  m2_p4_success: { id: "m2_p4_success", title: "Gemini 4 Spacewalk", type: "victory", desc: "Executed the first US EVA and sealed the hatch." },
  m2_p9_victory: { id: "m2_p9_victory", title: "Gemini 4 Spacewalk", type: "victory", desc: "Executed the first US EVA and sealed the hatch." },
  
  m3_victory: { id: "m3_victory", title: "Apollo 8 Earthrise", type: "victory", desc: "Navigated lunar orbit and witnessed Earthrise." },
  m3_p4_earthrise: { id: "m3_p4_earthrise", title: "Apollo 8 Earthrise", type: "victory", desc: "Navigated lunar orbit and witnessed Earthrise." },
  m3_p9_victory: { id: "m3_p9_victory", title: "Apollo 8 Earthrise", type: "victory", desc: "Navigated lunar orbit and witnessed Earthrise." },

  m4_victory: { id: "m4_victory", title: "Apollo 11 Landing", type: "victory", desc: "Landed at Tranquility Base with 20s fuel remaining." },
  m4_success: { id: "m4_success", title: "Apollo 11 Landing", type: "victory", desc: "Landed at Tranquility Base with 20s fuel remaining." },
  victory: { id: "victory", title: "Apollo 11 Landing", type: "victory", desc: "Landed at Tranquility Base with 20s fuel remaining." },

  m5_victory: { id: "m5_victory", title: "Artemis Gateway", type: "victory", desc: "Docked safely with Lunar Gateway station." },
  m5_p4_success: { id: "m5_p4_success", title: "Artemis Gateway", type: "victory", desc: "Docked safely with Lunar Gateway station." },
  m5_p9_victory: { id: "m5_p9_victory", title: "Artemis Gateway", type: "victory", desc: "Docked safely with Lunar Gateway station." },

  m6_victory: { id: "m6_victory", title: "Mars Chryse Touchdown", type: "victory", desc: "Landed probe on Chryse Planitia soil." },
  m6_p4_success: { id: "m6_p4_success", title: "Mars Chryse Touchdown", type: "victory", desc: "Landed probe on Chryse Planitia soil." },
  m6_p9_victory: { id: "m6_p9_victory", title: "Mars Chryse Touchdown", type: "victory", desc: "Landed probe on Chryse Planitia soil." },

  m7_victory: { id: "m7_victory", title: "Europa Ocean Discovery", type: "victory", desc: "Logged alien bio-signatures beneath the ice shell." },
  m7_p4_success: { id: "m7_p4_success", title: "Europa Ocean Discovery", type: "victory", desc: "Logged alien bio-signatures beneath the ice shell." },
  m7_p9_victory: { id: "m7_p9_victory", title: "Europa Ocean Discovery", type: "victory", desc: "Logged alien bio-signatures beneath the ice shell." },

  // Failure & Alternate Endings (Exact storyTree Keys)
  m1_p2_drift: { id: "m1_p2_drift", title: "Seal 3B Breach", type: "ending", desc: "Uncontrolled tumbling caused cabin pressure loss." },
  m1_p4_jettison: { id: "m1_p4_jettison", title: "Premature Retropack Release", type: "ending", desc: "Loose heat shield exposed without retropack straps." },
  m2_p5_tether_wrap: { id: "m2_p5_tether_wrap", title: "Tether Entanglement", type: "ending", desc: "HHMU depletion led to tether wrapping." },
  m2_p6_jammed_retro: { id: "m2_p6_jammed_retro", title: "Jammed Latch Retrofire", type: "ending", desc: "Emergency de-orbit with unlatched hatch seal." },
  m2_p7_fogged: { id: "m2_p7_fogged", title: "Metabolic Overheat", type: "ending", desc: "Suit temp reached 48.7°C, blinding visor condensation." },
  m2_p8_pressure_leak: { id: "m2_p8_pressure_leak", title: "Bent Latch Dogs", type: "ending", desc: "Stripped locking gears caused pressure loss." },
  m3_p5_impact: { id: "m3_p5_impact", title: "Farside Impact", type: "ending", desc: "Comms blackout caused trajectory decay into lunar farside." },
  m3_p6_flyby: { id: "m3_p6_flyby", title: "Hyperbolic Flyby", type: "ending", desc: "Premature SPS burn abort missed lunar capture." },
  m3_p7_skipout: { id: "m3_p7_skipout", title: "Atmospheric Skip-Out", type: "ending", desc: "Over-thrusting ricocheted capsule into solar orbit." },
  m4_abort: { id: "m4_abort", title: "Powered Descent Abort", type: "ending", desc: "1202 alarm forced abort stage firing at 5,000 FT." },
  m4_crash: { id: "m4_crash", title: "West Crater Impact", type: "ending", desc: "P64 auto-pilot struck boulder field at 22° tilt." },
  m4_engine_fault: { id: "m4_engine_fault", title: "Engine Nozzle Rupture", type: "ending", desc: "Full thrust near surface caused nozzle blowback." },
  m4_glitch: { id: "m4_glitch", title: "AGC RAM Wipe", type: "ending", desc: "Clearing computer RAM purged state vector guidance." },
  m5_p5_skipout: { id: "m5_p5_skipout", title: "Orion Skip-Out", type: "ending", desc: "Shallow entry angle ricocheted Orion into solar orbit." },
  m6_p5_boulder_crash: { id: "m6_p5_boulder_crash", title: "Chryse Boulder Crash", type: "ending", desc: "Sky Crane thruster shear over boulder field." },
  m7_p5_ice_crush: { id: "m7_p5_ice_crush", title: "Tectonic Ice Crush", type: "ending", desc: "Ice sheet shift imploded probe hull at 4,000 BAR." }
};

// ==========================================
// ACRONYM & TELEMETRY GLOSSARY DICTIONARY
// ==========================================

const GLOSSARY = {
  "HHMU": "Hand-Held Maneuvering Unit (Gas thruster gun used during Gemini EVA)",
  "EVA": "Extravehicular Activity (Spacewalk outside spacecraft)",
  "LOS": "Loss of Signal (Comms blackout behind celestial bodies)",
  "AOS": "Acquisition of Signal (Telemetry link re-established with Earth)",
  "SPS": "Service Propulsion System (Apollo main rocket engine)",
  "LOI": "Lunar Orbit Insertion (Engine retro-burn to capture into lunar orbit)",
  "AGC": "Apollo Guidance Computer (Primary flight computer)",
  "RCS": "Reaction Control System (Attitude control thruster jets)",
  "DSKY": "Display & Keyboard interface for the Apollo Guidance Computer",
  "NRHO": "Near-Rectilinear Halo Orbit (Stable elliptical orbit around the Moon)"
};

function parseGlossaryTerms(text) {
  if (!text) return "";
  let parsedText = text;
  Object.keys(GLOSSARY).forEach(term => {
    // Escape special characters to prevent regex crashes
    const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b(${escapedTerm})\\b`, 'gi');
    parsedText = parsedText.replace(regex, `<span class="glossary-term" data-tooltip="${GLOSSARY[term]}">$1</span>`);
  });
  return parsedText;
}
function getDiscoveredLogs() {
  try {
    const data = localStorage.getItem("galactic_archive_logs");
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to parse discovered logs from localStorage:", e);
    return [];
  }
}

function recordArchiveLog(logId) {
  if (!ARCHIVE_LOGS[logId]) return;

  const current = getDiscoveredLogs();
  if (!current.includes(logId)) {
    current.push(logId);
    localStorage.setItem("galactic_archive_logs", JSON.stringify(current));
    
    showLogToastPopup(ARCHIVE_LOGS[logId]);
    updateLogsCounterUI();
  }
}

function showLogToastPopup(logItem) {
  const toast = document.createElement("div");
  toast.className = "log-toast-popup";
  
  const icon = logItem.type === "victory" ? "🏆" : "⚠️";
  
  toast.innerHTML = `
    <div class="log-toast-header">${icon} NEW LOG ADDED TO ARCHIVE!</div>
    <div class="log-toast-body">${logItem.title}</div>
    <div class="log-toast-hint">Check your 📁 LOGS tab on the top-right corner to review details.</div>
  `;
  document.body.appendChild(toast);
  
  if (window.audioManager && typeof audioManager.play === "function") {
    audioManager.play('ui_click');
  }

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.5s ease";
    setTimeout(() => toast.remove(), 500);
  }, 4000);
}

// Calculates unique unlocked titles vs total unique titles and updates progress bar UI
function updateLogsCounterUI() {
  const fillEl = document.getElementById("log-progress-fill");
  const percentEl = document.getElementById("log-progress-percent");

  if (!fillEl && !percentEl) return;

  const unlocked = getDiscoveredLogs();

  // Total unique mission & failure titles registered in ARCHIVE_LOGS
  const allUniqueTitles = Array.from(new Set(Object.values(ARCHIVE_LOGS).map(item => item.title)));
  const totalCount = allUniqueTitles.length;

  // Total unique titles unlocked by player
  const unlockedUniqueTitles = new Set(unlocked.map(id => ARCHIVE_LOGS[id]?.title).filter(Boolean));
  const unlockedCount = unlockedUniqueTitles.size;

  // Calculate Percentage (0% to 100%)
  const percentage = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  // Update UI fill bar & text label
  if (fillEl) {
    fillEl.style.width = `${percentage}%`;
  }
  if (percentEl) {
    percentEl.textContent = `${percentage}%`;
  }
}

function openLogsModal() {
  const modal = document.getElementById("logs-modal");
  if (!modal) return;
  renderLogsModalContent();
  modal.classList.remove("hidden");
  if (window.audioManager && typeof audioManager.play === "function") {
    audioManager.play('ui_click');
  }
}

function closeLogsModal() {
  const modal = document.getElementById("logs-modal");
  if (modal) {
    modal.classList.add("hidden");
    if (window.audioManager && typeof audioManager.play === "function") {
      audioManager.play('ui_click');
    }
  }
}

function renderLogsModalContent() {
  const victoriesContainer = document.getElementById("victories-log-list");
  const endingsContainer = document.getElementById("endings-log-list");
  if (!victoriesContainer || !endingsContainer) return;

  const discovered = getDiscoveredLogs();

  let victoriesHTML = "";
  let endingsHTML = "";
  const renderedTitles = new Set();

  Object.values(ARCHIVE_LOGS).forEach(item => {
    if (renderedTitles.has(item.title)) return; // Prevent duplicate display of alias keys
    renderedTitles.add(item.title);

    const isUnlocked = discovered.some(id => ARCHIVE_LOGS[id] && ARCHIVE_LOGS[id].title === item.title);
    const html = `
      <div class="log-entry-item ${isUnlocked ? 'unlocked' : 'locked'}">
        <strong>${isUnlocked ? (item.type === 'victory' ? '🏆' : '⚠️') : '🔒'} ${item.title}</strong>
        <div>${isUnlocked ? item.desc : '??? [Unexplored History Path]'}</div>
      </div>
    `;

    if (item.type === "victory") {
      victoriesHTML += html;
    } else {
      endingsHTML += html;
    }
  });

  victoriesContainer.innerHTML = victoriesHTML;
  endingsContainer.innerHTML = endingsHTML;
}

function resetSession() {
  if (confirm("Reset all session progress, saved checkpoints, and discovered logs?")) {
    localStorage.removeItem("galactic_archive_logs");
    localStorage.removeItem("galactic_archive_saved_node");
    updateLogsCounterUI();

    if (typeof updateTitleMenuButtons === "function") {
      updateTitleMenuButtons();
    }
    if (typeof goToMainMenu === "function") {
      goToMainMenu();
    }
  }
}

document.addEventListener("DOMContentLoaded", updateLogsCounterUI);