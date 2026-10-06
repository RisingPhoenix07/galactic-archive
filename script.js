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
      { text: "Initiate Mission 3 (Apollo 8)", nextNode: "m3_p1_mcc" },
      { text: "Initiate Mission 4 (Apollo 11)", nextNode: "m4_entry" }
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
// --- CORE ENGINE RENDERER ---
function renderNode(nodeKey) {
  const node = storyTree[nodeKey];
  
  if (!node) {
    console.error(`Error: Node key '${nodeKey}' does not exist in storyTree!`);
    return;
  }

  // 1. Render Comic Panel Background Image
  const panelBox = document.getElementById("panel-box") || document.getElementById("comic-panel");
  if (panelBox) {
    panelBox.style.backgroundImage = `url('${node.bgImage}')`;
  }

  // 2. Render Caption
  const captionBox = document.getElementById("caption-box") || document.getElementById("caption-text");
  if (captionBox) {
    captionBox.textContent = node.caption;
  }

  // 3. Render HUD Overlay
  const hudOverlay = document.getElementById("hud-overlay") || document.getElementById("nasa-hud");
  const hudImg = document.getElementById("hud-img") || document.getElementById("hud-image");
  const hudCaption = document.getElementById("hud-caption");

  if (hudOverlay) {
    if (node.hud) {
      hudOverlay.classList.remove("hidden");
      if (hudImg) hudImg.src = node.hud.image;
      if (hudCaption) hudCaption.textContent = node.hud.caption;
    } else {
      hudOverlay.classList.add("hidden");
    }
  }

  // 4. Render Action Buttons
  const choicesContainer = document.getElementById("choices-container");
  if (choicesContainer) {
    choicesContainer.innerHTML = "";
    node.choices.forEach(choice => {
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.textContent = choice.text;
      btn.onclick = () => renderNode(choice.nextNode);
      choicesContainer.appendChild(btn);
    });
  }
}

// Boot Engine on Load
document.addEventListener("DOMContentLoaded", () => {
  renderNode("intro_p1");
});