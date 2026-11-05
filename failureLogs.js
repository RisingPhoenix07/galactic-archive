// ==========================================
// FAILURE LOGS & EDUCATIONAL HINT SYSTEM
// ==========================================

// Load discovered failures from localStorage
let discoveredFailures = JSON.parse(localStorage.getItem('galactic_archive_failures')) || [];

// Database of failure titles, debrief explanations, and hints
const failureDatabase = {
  // MISSION 1: FRIENDSHIP 7
  "m1_p2_drift": {
    title: "Seal 3B Breach",
    debrief: "WHAT REALLY HAPPENED: Ignoring manual fly-by-wire checks during thruster yaw drift allowed uncorrected attitude excursions, resulting in severe dynamic instability during orbital pass 2.",
    hint: "Mission Control Hint: Check telemetry warnings before attempting full orbital drift monitoring."
  },
  "m1_p4_jettison": {
    title: "Premature Retropack Release",
    debrief: "WHAT REALLY HAPPENED: Jettisoning the retropack when Sensor 51 read unlatched freed the ablative heat shield. Without the retaining straps holding it against the hull, aerodynamic drag destroyed the thermal barrier.",
    hint: "Mission Control Hint: Retropack straps are crucial to keep an unlatched heat shield in place during entry heat!"
  },
  "m1_p7_tumble": {
    title: "Gyroscopic Tumble",
    debrief: "WHAT REALLY HAPPENED: Over-correcting manual RCS attitude jets without damping rate gyros caused severe pitch/yaw cross-coupling.",
    hint: "Mission Control Hint: Stabilize pitch and yaw before initiating fly-by-wire maneuvers."
  },

  // MISSION 2: GEMINI 4
  "m2_p5_tether_wrap": {
    title: "Tether Entanglement & Spin",
    debrief: "WHAT REALLY HAPPENED: Over-using gas bursts on the Hand-Held Maneuvering Unit caused severe tether wrapping and rapid metabolic exhaustion.",
    hint: "Mission Control Hint: Conserve maneuvering propellant to prevent high metabolic rate spikes."
  },
  "m2_p6_jammed_retro": {
    title: "Jammed Latch Retrofire",
    debrief: "WHAT REALLY HAPPENED: Initiating retrofire while the hatch mechanism was binding would cause explosive depressurization.",
    hint: "Mission Control Hint: Resolve hatch dog binding before authorizing retrofire ignition."
  },

  // MISSION 3: APOLLO 8
  "m3_p5_impact": {
    title: "Farside Lunar Impact",
    debrief: "WHAT REALLY HAPPENED: Manually firing RCS thrusters during radio blackout without inertial guidance lock resulted in trajectory decay into lunar highlands.",
    hint: "Mission Control Hint: Maintain inertial lock and await Acquisition of Signal (AOS)."
  },

  // MISSION 4: APOLLO 11
  "m4_abort": {
    title: "Premature Abort Stage",
    debrief: "WHAT REALLY HAPPENED: 1202/1201 alarms indicated computer executive overflow from radar data overload, not an engine or guidance failure.",
    hint: "Mission Control Hint: Executive overflows drop low-priority tasks while maintaining landing trajectory."
  },
  "m4_crash": {
    title: "West Crater Impact",
    debrief: "WHAT REALLY HAPPENED: P64 auto-pilot targeted a boulder field inside West Crater. Neil Armstrong took manual P66 control to clear the crater.",
    hint: "Mission Control Hint: Take manual P66 control to overfly boulder fields."
  },

  // MISSION 5: ARTEMIS GATEWAY
  "m5_p5_skipout": {
    title: "Atmospheric Skip-Out",
    debrief: "WHAT REALLY HAPPENED: Entering at an angle too shallow by even 0.5 degrees causes the Orion capsule to ricochet off dense atmospheric layers into heliocentric orbit.",
    hint: "Mission Control Hint: Maintain precise flight path entry angles during skip re-entry."
  },

  // MISSION 6: MARS LANDING
  "m6_p5_boulder_crash": {
    title: "Martian Boulder Collision",
    debrief: "WHAT REALLY HAPPENED: Locking thrusters on auto-descent over unmapped boulder grids causes leg shear or tip-over upon touchdown.",
    hint: "Mission Control Hint: Adjust Sky Crane thrust vectors to steer clear of boulder grids."
  },

  // MISSION 7: EUROPA PROBE
  "m7_p5_ice_crush": {
    title: "Subsurface Hull Implosion",
    debrief: "WHAT REALLY HAPPENED: Europa's 15km thick outer ice crust undergoes active tidal flexing from Jupiter's gravitational pull. Forcing descent through narrow rift fractures exposes probes to localized tectonic ice crushes exceeding 4,000 atmospheres.",
    hint: "Mission Control Hint: Avoid narrow fractures under extreme tectonic pressure."
  },
  "m7_p6_cutter_overheat": {
    title: "Thermal Cutter Failure",
    debrief: "WHAT REALLY HAPPENED: Running cryo-melt lasers at 100% capacity without regulating liquid meltwater recirculation boils away ambient coolant, causing thermal stress fracturing of the probe's tungsten cutter nose.",
    hint: "Mission Control Hint: Regulate laser heat levels to avoid vaporizing recirculated coolant."
  },
  "m7_p7_abyss_drift": {
    title: "Abyssal Sonar Drift",
    debrief: "WHAT REALLY HAPPENED: Cutting acoustic tracking beacons in Europa's abyssal ocean disables active Doppler velocity logs. Subsurface convective currents sweep untethered craft away from surface relays permanently.",
    hint: "Mission Control Hint: Maintain tether beacons active while navigating deep liquid ocean layers."
  },
  "m7_p8_radiation_loss": {
    title: "Radiation Signal Wipe",
    debrief: "WHAT REALLY HAPPENED: Over-amplifying transmitter power inside Jupiter's magnetosphere attracts high-energy trapped electron spikes, short-circuiting unshielded RF amplifier transistors on the surface buoy.",
    hint: "Mission Control Hint: Balance RF transmission power against Jovian radiation field spikes."
  }
};

/**
 * Log discovered failure node and update UI
 */
function handleFailureNode(nodeId) {
  const failureData = failureDatabase[nodeId];
  const debriefBox = document.getElementById("debrief-box");

  if (!failureData || !debriefBox) return;

  const totalFailures = Object.keys(failureDatabase).length;

  // Store in localStorage if new
  if (!discoveredFailures.includes(nodeId)) {
    discoveredFailures.push(nodeId);
    localStorage.setItem('galactic_archive_failures', JSON.stringify(discoveredFailures));
  }

  updateFailureCounterUI();

  // Render educational failure debrief & hint
  debriefBox.classList.remove("hidden");
  debriefBox.innerHTML = `
    <div class="failure-log-header">
      <span class="warning-badge">⚠️ ARCHIVE FAILURE LOG UNLOCKED [${discoveredFailures.length}/${totalFailures}]</span>
      <h4>${failureData.title}</h4>
    </div>
    <p class="debrief-text">${failureData.debrief}</p>
    <p class="hint-text">💡 <strong>${failureData.hint}</strong></p>
  `;
}

/**
 * Update HUD Failure Counter Badge
 */
function updateFailureCounterUI() {
  const achievementPanel = document.getElementById("achievement-panel");
  if (!achievementPanel) return;

  const totalFailures = Object.keys(failureDatabase).length;

  let failureBadge = document.getElementById("failure-log-badge");
  if (!failureBadge) {
    failureBadge = document.createElement("div");
    failureBadge.id = "failure-log-badge";
    failureBadge.className = "hud-badge failure-badge";
    achievementPanel.appendChild(failureBadge);
  }

  failureBadge.innerHTML = `📁 Logs: ${discoveredFailures.length}/${totalFailures}`;
  failureBadge.title = `${discoveredFailures.length} of ${totalFailures} failure anomaly branches logged`;
}