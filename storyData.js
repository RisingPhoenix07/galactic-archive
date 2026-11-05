// ==========================================
// MASTER GAME STORY TREE (REFRACTORED CHOICES & TELEMETRY CLUES)
// ==========================================

const storyTree = {
  // ------------------------------------------
  // LEVEL 0: GALACTIC ARCHIVE TERMINAL HUB
  // ------------------------------------------
  intro_p1: {
    bgImage: "assets/panels/intro_1.jpg",
    caption: "The year is 2036. Inside the Galactic Archive Museum, where history isn't just stored... it's lived.\nSelect a historical mission log from the terminal directory below.",
    hud: null,
    choices: [
      { text: "📜 ACT I: Pioneer Era (1960s - 1970s)", nextNode: "intro_p2" },
      { text: "🚀 ACT II: Deep Space & Artemis Era (2020s+)", nextNode: "intro_p3" }
    ]
  },
  intro_p2: {
    bgImage: "assets/panels/intro_2.jpg",
    caption: "ACT I TERMINAL: Select an archive log from the Historic Pioneer Era.",
    hud: null,
    choices: [
      { text: "1. Mission 1: Friendship 7 (1962)", nextNode: "m1_entry" },
      { text: "2. Mission 2: Gemini 4 EVA (1965)", nextNode: "m2_p1_hhmu" },
      { text: "3. Mission 3: Apollo 8 Earthrise (1968)", nextNode: "m3_p1_mcc" },
      { text: "4. Mission 4: Apollo 11 Landing (1969)", nextNode: "m4_entry" },
      { text: "➡️ NEXT PAGE: Act II Deep Space Missions", nextNode: "intro_p3" }
    ]
  },
  intro_p3: {
    bgImage: "assets/panels/intro_2.jpg",
    caption: "ACT II TERMINAL: Select an archive log from the Modern Deep Space Era.",
    hud: null,
    choices: [
      { text: "1. Mission 5: Artemis Gateway Orbit (2026)", nextNode: "m5_entry" },
      { text: "2. Mission 6: Mars Chryse Landing (2042)", nextNode: "m6_entry" },
      { text: "3. Mission 7: Europa Subsurface Probe (2055)", nextNode: "m7_entry" },
      { text: "⬅️ PREVIOUS PAGE: Act I Historic Era", nextNode: "intro_p2" },
      { text: "🏠 Return to Archive Museum Hub", nextNode: "intro_p1" }
    ]
  },

  // ------------------------------------------
  // MISSION 1: FRIENDSHIP 7 (MERCURY-ATLAS 6, 1962)
  // ------------------------------------------
  m1_entry: {
    bgImage: "assets/panels/m1_launch_pad.jpg",
    caption: "MISSION 1 (1962): John Glenn aboard Friendship 7! Capsule enters orbit over the Atlantic. Yaw attitude thrusters behaving erratically.",
    hud: {
      image: "assets/nasa_data/mercury_launch_telemetry.jpg",
      caption: "TELEMETRY ALERT: Yaw Rate: +1.5°/sec drift | ASCS Autopilot: ON | Fly-By-Wire Manual Mode: STANDBY"
    },
    choices: [
      { text: "1. Switch ASCS to Full Auto-Pilot Reset", nextNode: "m1_p8_autofail" },
      { text: "2. Engage Manual Fly-By-Wire & Control Thrusters", nextNode: "m1_p3_warning" },
      { text: "3. Apply Rapid Over-Correction Bursts", nextNode: "m1_p7_tumble" },
      { text: "4. Ignore Yaw Drift & Maintain Coast Phase", nextNode: "m1_p2_drift" }
    ]
  },
  m1_p2_drift: {
    bgImage: "assets/panels/m1_p2_drift.jpg",
    caption: "PATH FAILURE: Uncontrolled Orbital Drift! Attitude decay caused angle deviation and cabin pressure drop.",
    debrief: "WHAT REALLY HAPPENED: In 1962, Glenn suffered a clogged yaw thruster nozzle. Relying on passive coasting caused attitude tumbling and thermal deviation.",
    hud: null,
    choices: [{ text: "Retry Mission 1 (Enter)", nextNode: "m1_entry" }]
  },
  m1_p7_tumble: {
    bgImage: "assets/panels/m1_p7_tumble.jpg",
    caption: "PATH FAILURE: Gyroscopic Tumble! Capsule spinning out of control in Low Earth Orbit.",
    debrief: "WHAT REALLY HAPPENED: Over-correcting fly-by-wire thrusters without dampening rate gyros depleted RCS fuel reserves and caused violent tumbling.",
    hud: null,
    choices: [{ text: "Retry Mission 1 (Enter)", nextNode: "m1_entry" }]
  },
  m1_p8_autofail: {
    bgImage: "assets/panels/m1_p8_autofail.jpg",
    caption: "PATH FAILURE: Gyro Failure! ASCS automated system locked up during spin.",
    debrief: "WHAT REALLY HAPPENED: Mercury ASCS auto-pilot gyros had high drift rates. Relying strictly on automated systems led to complete attitude alignment loss.",
    hud: null,
    choices: [{ text: "Retry Mission 1 (Enter)", nextNode: "m1_entry" }]
  },
  m1_p3_warning: {
    bgImage: "assets/panels/m1_p3_warning.jpg",
    caption: "DECISION POINT 2: SENSOR SEGMENT 51 WARNING! Telemetry indicates Landing Bag Unlatched. Retropack jettison recommended by automated checklist.",
    hud: {
      image: "assets/nasa_data/mercury_landingbag_telemetry.jpg",
      caption: "TELEMETRY WARNING: Sensor Seg 51: UNLATCHED | Heat Shield Retainer Straps: SECURE | Re-entry Angle: 1.4°"
    },
    choices: [
      { text: "1. Follow Checklist: Jettison Retropack Package", nextNode: "m1_p4_jettison" },
      { text: "2. Override Checklist: Keep Retropack Strapped On", nextNode: "m1_p5_fireball" }
    ]
  },
  m1_p4_jettison: {
    bgImage: "assets/panels/m1_p4_jettison.jpg",
    caption: "PATH FAILURE: Heat Shield Loose! Heat shield detaches without retropack straps during entry.",
    debrief: "WHAT REALLY HAPPENED: NASA controllers realized Segment 51 was a faulty switch. Keeping retropack straps ON held the loose heat shield secure against 3,000°F plasma friction.",
    hud: null,
    choices: [{ text: "Retry Mission 1 (Enter)", nextNode: "m1_entry" }]
  },
  m1_p5_fireball: {
    bgImage: "assets/panels/m1_p5_fireball.jpg",
    caption: "HISTORICAL SUCCESS: Burning Retropack Straps! Flaming retropack consumes in plasma while keeping heat shield locked tight.",
    hud: null,
    choices: [{ text: "Deploy Main Parachute for Splashdown", nextNode: "m1_p6_ending" }]
  },
  m1_p6_ending: {
    bgImage: "assets/panels/m1_p6_ending.jpg",
    caption: "SPLASHDOWN VICTORY: Friendship 7 safely afloat in Atlantic recovery waters!",
    hud: null,
    choices: [{ text: "Log Achievement & Proceed to Mission 2", nextNode: "m1_p9_victory" }]
  },
  m1_p9_victory: {
    bgImage: "assets/panels/m1_p9_victory.jpg",
    caption: "VICTORY: Friendship 7 Logged! First US orbital spaceflight successfully recorded into Galactic Archive.",
    hud: null,
    choices: [{ text: "Proceed to Mission 2 (Gemini 4)", nextNode: "m2_p1_hhmu" }]
  },

  // ------------------------------------------
  // MISSION 2: GEMINI 4 EVA (1965)
  // ------------------------------------------
  m2_p1_hhmu: {
    bgImage: "assets/panels/m2_p1_hhmu.jpg",
    caption: "MISSION 2 (1965): Ed White steps into microgravity! Hand-Held Maneuvering Unit (HHMU) gas pressure active.",
    hud: {
      image: "assets/nasa_data/gemini4_eva_telemetry.jpg",
      caption: "TELEMETRY NOTE: HHMU Gas Pressure: 4,000 PSI | Fuel Burn Rate: 200 PSI/sec | Max Propellant Time: ~20 sec"
    },
    choices: [
      { text: "1. Fire Long Continuous Gas Bursts to Navigate", nextNode: "m2_p5_tether_wrap" },
      { text: "2. Use Short Metered Bursts & Pull Hand-Over-Hand Tether", nextNode: "m2_p2_tether" }
    ]
  },
  m2_p2_tether: {
    bgImage: "assets/panels/m2_p2_tether_pull.jpg",
    caption: "DECISION POINT 2: Tether Pull! Metabolic exertion spiking inside suit as visor begins fogging.",
    hud: {
      image: "assets/nasa_data/gemini4_metabolics.jpg",
      caption: "TELEMETRY WARNING: HR: 168 BPM | Suit Cooling: 64% Capacity | O2 Exhaustion: ELEVATED"
    },
    choices: [
      { text: "1. Pace Exertion & Immediately Climb to Cockpit Hatch", nextNode: "m2_p3_hatch" },
      { text: "2. Force Rapid Physical Pulling to Drag Body Inside", nextNode: "m2_p7_fogged" }
    ]
  },
  m2_p3_hatch: {
    bgImage: "assets/panels/m2_p3_hatch_bind.jpg",
    caption: "DECISION POINT 3: Titanium Hatch Rim Jammed! Solar thermal heat expanded titanium hatch ring by +1.2mm.",
    hud: {
      image: "assets/nasa_data/gemini4_hatch_telemetry.jpg",
      caption: "TELEMETRY ALERT: Rim Delta: +1.2mm Thermal Expansion | Latch Dog Torque: HIGH | Cabin: UNSEALED"
    },
    choices: [
      { text: "1. Pry Handle with Full Body Force to Snap Mechanism", nextNode: "m2_p8_pressure_leak" },
      { text: "2. Use Mechanical Ratchet Tool to Force Latch Dogs", nextNode: "m2_p4_success" },
      { text: "3. Fire De-orbit Thrusters Immediately", nextNode: "m2_p6_jammed_retro" }
    ]
  },
  m2_p4_success: {
    bgImage: "assets/panels/m2_p4_true_ending.jpg",
    caption: "HISTORICAL SUCCESS: Hatch Sealed & Re-pressurized! Cabin atmosphere restored nominal status.",
    hud: null,
    choices: [{ text: "Log Gemini 4 Badge to Archive", nextNode: "m2_p9_victory" }]
  },
  m2_p5_tether_wrap: {
    bgImage: "assets/panels/m2_p5_tether_wrap.jpg",
    caption: "PATH FAILURE: HHMU Exhaustion & Tether Wrap! Gas depleted in 20 seconds; tether wrapped around pod.",
    debrief: "WHAT REALLY HAPPENED: In 1962, Ed White discovered the HHMU ran out of gas propellant in just 20 seconds, causing tether entanglement.",
    hud: null,
    choices: [{ text: "Retry Mission 2 (Enter)", nextNode: "m2_p1_hhmu" }]
  },
  m2_p6_jammed_retro: {
    bgImage: "assets/panels/m2_p6_jammed_retro.jpg",
    caption: "PATH FAILURE: Unsealed De-orbit Retrofire! Initiating retroburn with open hatch caused explosive cabin loss.",
    debrief: "WHAT REALLY HAPPENED: Retrofire while hatch latches were binding would cause explosive depressurization.",
    hud: null,
    choices: [{ text: "Retry Mission 2 (Enter)", nextNode: "m2_p1_hhmu" }]
  },
  m2_p7_fogged: {
    bgImage: "assets/panels/m2_p7_fogged_visor.jpg",
    caption: "PATH FAILURE: Suit Cooling Overload! Visor blinded completely by metabolic condensation.",
    debrief: "WHAT REALLY HAPPENED: Moving in microgravity required extreme effort, spiking Ed White's heart rate to 178 BPM and blinding his visor.",
    hud: null,
    choices: [{ text: "Retry Mission 2 (Enter)", nextNode: "m2_p1_hhmu" }]
  },
  m2_p8_pressure_leak: {
    bgImage: "assets/panels/m2_p8_pressure_leak.jpg",
    caption: "PATH FAILURE: Broken Hatch Dogs! Stripped locking dogs left cabin permanently unsealed.",
    debrief: "WHAT REALLY HAPPENED: Forcing titanium locking dogs without proper mechanical leverage stripped latch gears.",
    hud: null,
    choices: [{ text: "Retry Mission 2 (Enter)", nextNode: "m2_p1_hhmu" }]
  },
  m2_p9_victory: {
    bgImage: "assets/panels/m2_p9_victory_log.jpg",
    caption: "VICTORY: Gemini 4 Spacewalk Logged!",
    hud: null,
    choices: [{ text: "Proceed to Mission 3 (Apollo 8)", nextNode: "m3_p1_mcc" }]
  },

  // ------------------------------------------
  // MISSION 3: APOLLO 8 EARTHRISE (1968)
  // ------------------------------------------
  m3_p1_mcc: {
    bgImage: "assets/panels/m3_p1_mcc_burn.jpg",
    caption: "MISSION 3: Trans-Lunar Coast! Service Propulsion System (SPS) burn required for trajectory insertion.",
    hud: {
      image: "assets/nasa_data/apollo8_telemetry.jpg",
      caption: "TELEMETRY DATA: GET 069:08 | Target Velocity: 5,300 FT/SEC | SPS Burn Duration: 247 SEC"
    },
    choices: [
      { text: "1. Over-Thrust Engine Duration past 300 seconds", nextNode: "m3_p7_skipout" },
      { text: "2. Execute Precise 247-Second SPS Insertion Burn", nextNode: "m3_p2_loi" }
    ]
  },
  m3_p2_loi: {
    bgImage: "assets/panels/m3_p2_loi_burn.jpg",
    caption: "DECISION POINT 2: Lunar Farside LOI Burn! Firing main engine behind Moon without Earth comms.",
    hud: {
      image: "assets/nasa_data/apollo8_loi.jpg",
      caption: "TELEMETRY NOTE: LOI Burn Locked | Comms Blackout: 45 Minutes | Trajectory: Lunar Orbit Capture"
    },
    choices: [
      { text: "1. Maintain Programmed SPS Burn to Complete Orbit", nextNode: "m3_p3_comms" },
      { text: "2. Cut Engine Ignition Early Mid-Burn", nextNode: "m3_p6_flyby" }
    ]
  },
  m3_p3_comms: {
    bgImage: "assets/panels/m3_p3_comms_loss.jpg",
    caption: "DECISION POINT 3: Lunar Farside LOS (Loss of Signal)! Complete comms blackout behind the Moon.",
    hud: {
      image: "assets/nasa_data/apollo8_los.jpg",
      caption: "TELEMETRY ALERT: Signal Status: LOS | Inertial Guidance: LOCK ACTIVE | Mascon Perturbations: NOMINAL"
    },
    choices: [
      { text: "1. Engage Manual RCS Overrides during Blackout", nextNode: "m3_p5_impact" },
      { text: "2. Disable Inertial Guidance Platform", nextNode: "m3_p8_mascon" },
      { text: "3. Maintain Automated Attitude Lock & Await AOS", nextNode: "m3_p4_earthrise" }
    ]
  },
  m3_p4_earthrise: {
    bgImage: "assets/panels/m3_p4_path1_earthrise.jpg",
    caption: "HISTORICAL SUCCESS: Earthrise Witnessed! 'We read Genesis as Earth rose above the Moon.'",
    hud: {
      image: "assets/nasa_data/apollo8_earthrise.jpg",
      caption: "NASA PHOTO AS08-14-2383: First human view of Earth rising over Lunar Horizon."
    },
    choices: [{ text: "Log Apollo 8 Achievement Badge", nextNode: "m3_p9_victory" }]
  },
  m3_p5_impact: {
    bgImage: "assets/panels/m3_p5_path2_impact.jpg",
    caption: "PATH FAILURE: Lunar Farside Impact! Manual RCS firing without guidance lock caused orbit decay.",
    debrief: "WHAT REALLY HAPPENED: Manually firing RCS thrusters during blackout without inertial guidance lock resulted in lunar impact.",
    hud: null,
    choices: [{ text: "Restart Mission 3 (Enter)", nextNode: "m3_p1_mcc" }]
  },
  m3_p6_flyby: {
    bgImage: "assets/panels/m3_p6_path3_flyby.jpg",
    caption: "PATH FAILURE: Hyperbolic Flyby! Early burn abort prevented orbital capture.",
    debrief: "WHAT REALLY HAPPENED: Aborting LOI burn early prevented capture, sending Apollo 8 into a free-return loop.",
    hud: null,
    choices: [{ text: "Restart Mission 3 (Enter)", nextNode: "m3_p1_mcc" }]
  },
  m3_p7_skipout: {
    bgImage: "assets/panels/m3_p7_path4_skipout.jpg",
    caption: "PATH FAILURE: Atmospheric Skip-Out! Over-thrusting shifted flight corridor shallower than -5.2°.",
    debrief: "WHAT REALLY HAPPENED: Over-thrusting shifted entry flight path shallower than -5.2°, skipping capsule into solar drift.",
    hud: null,
    choices: [{ text: "Restart Mission 3 (Enter)", nextNode: "m3_p1_mcc" }]
  },
  m3_p8_mascon: {
    bgImage: "assets/panels/m3_p8_path5_mascon_reentry.jpg",
    caption: "PATH FAILURE: Gravitational Mascon Drift! Unmonitored lunar mascons distorted flight trajectory.",
    debrief: "WHAT REALLY HAPPENED: Lunar mascons distorted unmonitored lunar orbits, turning re-entry angles dangerously steep.",
    hud: null,
    choices: [{ text: "Restart Mission 3 (Enter)", nextNode: "m3_p1_mcc" }]
  },
  m3_p9_victory: {
    bgImage: "assets/panels/m3_p9_victory_log.jpg",
    caption: "VICTORY: Apollo 8 Earthrise Logged!",
    hud: null,
    choices: [{ text: "Proceed to Mission 4 (Apollo 11)", nextNode: "m4_entry" }]
  },

  // ------------------------------------------
  // MISSION 4: APOLLO 11 LANDING (1969)
  // ------------------------------------------
  m4_entry: {
    bgImage: "assets/panels/m4_p4_alarm.jpg",
    caption: "MISSION 4 (1969): Apollo 11 Lunar Descent! 1202 & 1201 Alarms flashing on DSKY computer!",
    hud: {
      image: "assets/nasa_data/apollo_dsky_telemetry.jpg",
      caption: "TELEMETRY ALERT: BAILOUT 1202 | AGC Load: 115% | CPU Task Recovery: EXECUTIVE OVERFLOW ACTIVE"
    },
    choices: [
      { text: "1. Abort Descent Stage Firing Immediately", nextNode: "m4_abort" },
      { text: "2. Trust Steve Bales Command: Continue Landing", nextNode: "m4_pitchover" },
      { text: "3. Perform Manual RAM System Reset", nextNode: "m4_glitch" }
    ]
  },
  m4_pitchover: {
    bgImage: "assets/panels/m4_p2_boulders.jpg",
    caption: "DECISION POINT 2: Pitchover Mode! Altitude 1,180 FT. P64 auto-pilot targeting boulder field inside West Crater!",
    hud: {
      image: "assets/nasa_data/west_crater_recon.jpg",
      caption: "TELEMETRY WARNING: Pitchover Mode | Altitude: 1,180 FT | Radar Surface Hazard: HIGH | Fuel: 12%"
    },
    choices: [
      { text: "1. Allow P64 Auto-Pilot to Complete Touchdown", nextNode: "m4_crash" },
      { text: "2. Increase Engine Thrust to Full 100%", nextNode: "m4_engine_fault" },
      { text: "3. Take Semi-Automatic P66 Manual Control", nextNode: "m4_touchdown" }
    ]
  },
  m4_touchdown: {
    bgImage: "assets/panels/m4_p3_contact.jpg",
    caption: "DECISION POINT 3: Blue Contact Light Active! Descent engine probe touching lunar dust. Fuel at 3%.",
    hud: {
      image: "assets/nasa_data/tranquility_coordinates.jpg",
      caption: "TELEMETRY DATA: Contact Light: ACTIVE | Descent Fuel: 3% (20s Remaining) | Surface Tilt: 2.1°"
    },
    choices: [
      { text: "1. Cut Engine Thrust & Settle Lander on Soil", nextNode: "m4_success" },
      { text: "2. Hover & Search for Flat Ground", nextNode: "m4_crash" }
    ]
  },
  m4_success: {
    bgImage: "assets/panels/m4_p4_path1_tranquility.jpg",
    caption: "HISTORICAL SUCCESS: 'Houston, Tranquility Base here. The Eagle has landed!'",
    hud: null,
    choices: [{ text: "Log Apollo 11 Badge to Archive", nextNode: "victory" }]
  },
  m4_abort: {
    bgImage: "assets/panels/m4_p5_path2_abort.jpg",
    caption: "PATH FAILURE: Abort Stage Fired! Landing abandoned at 5,000 feet.",
    debrief: "WHAT REALLY HAPPENED: Steve Bales recognized 1202 meant CPU overflow, allowing AGC to drop secondary tasks and save the landing.",
    hud: null,
    choices: [{ text: "Restart Mission 4 (Enter)", nextNode: "m4_entry" }]
  },
  m4_crash: {
    bgImage: "assets/panels/m4_p6_path3_tipover.jpg",
    caption: "PATH FAILURE: Boulder Impact! Lander struck West Crater boulders at 22° tilt angle.",
    debrief: "WHAT REALLY HAPPENED: Neil Armstrong had to take semi-automatic P66 control to fly over West Crater boulder fields.",
    hud: null,
    choices: [{ text: "Restart Mission 4 (Enter)", nextNode: "m4_entry" }]
  },
  m4_engine_fault: {
    bgImage: "assets/panels/m4_p7_path4_explosion.jpg",
    caption: "PATH FAILURE: Engine Thermal Blowback! Pinning 100% thrust close to ground damaged nozzle seal.",
    debrief: "WHAT REALLY HAPPENED: Full 100% descent thrust near surface caused thermal reflection blowback against descent legs.",
    hud: null,
    choices: [{ text: "Restart Mission 4 (Enter)", nextNode: "m4_entry" }]
  },
  m4_glitch: {
    bgImage: "assets/panels/m4_p8_path5_tumble.jpg",
    caption: "PATH FAILURE: AGC RAM Wipe! Guidance tables erased.",
    debrief: "WHAT REALLY HAPPENED: Attempting to clear AGC RAM during descent purged state vector guidance references.",
    hud: null,
    choices: [{ text: "Restart Mission 4 (Enter)", nextNode: "m4_entry" }]
  },
  victory: {
    bgImage: "assets/panels/m4_p4_path1_tranquility.jpg",
    caption: "VICTORY: Lunar Pioneer Badge Unlocked!",
    hud: null,
    choices: [{ text: "Proceed to Mission 5 (Artemis Gateway)", nextNode: "m5_entry" }]
  },

  // ------------------------------------------
  // MISSION 5: ARTEMIS GATEWAY ORBIT (2026)
  // ------------------------------------------
  m5_entry: {
    bgImage: "assets/panels/m5_p1_entry.jpg",
    caption: "MISSION 5 (2026): Flight Specialist Tahsina Chowdhury aboard Orion! Approaching Near-Rectilinear Halo Orbit (NRHO).",
    hud: {
      image: "assets/nasa_data/orion_gateway_telemetry.jpg",
      caption: "[SIMULATED TELEMETRY] Alt: 112 KM | NRHO Alignment: 0.87° Drift | Solar Flare Index: CLASS X9 WARNING"
    },
    choices: [
      { text: "1. Perform Shallow Perigee Atmospheric Skim", nextNode: "m5_p5_skipout" },
      { text: "2. Verify Orbital Guidance & Execute RCS Vector Alignment", nextNode: "m5_p2_guidance" }
    ]
  },
  m5_p2_guidance: {
    bgImage: "assets/panels/m5_p2_guidance.jpg",
    caption: "DECISION POINT 2: Gyro Lock Alert! Solar radiation causing sensor misalignment (+12.4° off-nominal).",
    hud: {
      image: "assets/nasa_data/orion_guidance_telemetry.jpg",
      caption: "[SIMULATED TELEMETRY] Gyro Slip: +12.4° | Solar Radiation: 1,284 mSv/hr | Shield Orient: UNALIGNED"
    },
    choices: [
      { text: "1. Execute Manual RCS Guidance Re-alignment", nextNode: "m5_p3_solar_flare" },
      { text: "2. Cut Power Bus B Breakers to Reset Gyros", nextNode: "m5_p7_power_fail" }
    ]
  },
  m5_p3_solar_flare: {
    bgImage: "assets/panels/m5_p3_solar_flare.jpg",
    caption: "DECISION POINT 3: Class X9 Solar Flare Inbound! Heavy particle radiation stream reaching capsule in 30 seconds.",
    hud: {
      image: "assets/nasa_data/tranquility_coordinates.jpg",
      caption: "[SIMULATED TELEMETRY] Class X9 Solar Storm | Shield Thermal Vector: UNORIENTED | Shield Health: 100%"
    },
    choices: [
      { text: "1. Orient Heavy Heat Shield Vector Directly Toward Sun", nextNode: "m5_p4_success" },
      { text: "2. Re-orient Main Communications Dish to Deep Space", nextNode: "m5_p8_comms_blackout" },
      { text: "3. Attempt Emergency Re-entry with Unaligned Shield", nextNode: "m5_p6_thermal_breach" }
    ]
  },
  m5_p4_success: {
    bgImage: "assets/panels/m5_p4_true_ending.jpg",
    caption: "HISTORICAL SUCCESS: Gateway Docking Locked & Solar Radiation Deflected!",
    hud: null,
    choices: [{ text: "Log Artemis Gateway Badge to Archive", nextNode: "m5_p9_victory" }]
  },
  m5_p5_skipout: {
    bgImage: "assets/panels/m5_p5_skipout.jpg",
    caption: "PATH FAILURE: Deep Space Trajectory Skip-Out!",
    debrief: "WHAT REALLY HAPPENED: Entering at a shallow angle caused Orion to ricochet off mesospheric air layers into heliocentric orbit.",
    hud: null,
    choices: [{ text: "Retry Mission 5 (Enter)", nextNode: "m5_entry" }]
  },
  m5_p6_thermal_breach: {
    bgImage: "assets/panels/m5_p6_thermal_breach.jpg",
    caption: "PATH FAILURE: Thermal Shield Erosion!",
    debrief: "WHAT REALLY HAPPENED: Re-entering from deep space at 24,500 mph with unaligned heat shield vectors caused structural burn-through.",
    hud: null,
    choices: [{ text: "Retry Mission 5 (Enter)", nextNode: "m5_entry" }]
  },
  m5_p7_power_fail: {
    bgImage: "assets/panels/m5_p7_power_fail.jpg",
    caption: "PATH FAILURE: Bus B Power Shutdown!",
    debrief: "WHAT REALLY HAPPENED: Cutting Power Bus B tripped fuel cell breakers, freezing environmental support systems.",
    hud: null,
    choices: [{ text: "Retry Mission 5 (Enter)", nextNode: "m5_entry" }]
  },
  m5_p8_comms_blackout: {
    bgImage: "assets/panels/m5_p8_comms_blackout.jpg",
    caption: "PATH FAILURE: Deep Space Signal Blackout!",
    debrief: "WHAT REALLY HAPPENED: Slewing primary antennas away from Earth relay satellites broke trajectory telemetry behind the Moon.",
    hud: null,
    choices: [{ text: "Retry Mission 5 (Enter)", nextNode: "m5_entry" }]
  },
  m5_p9_victory: {
    bgImage: "assets/panels/m5_p9_victory_log.jpg",
    caption: "VICTORY: Artemis Gateway Mission Passed!",
    hud: null,
    choices: [{ text: "Proceed to Mission 6 (Mars Descent)", nextNode: "m6_entry" }]
  },

  // ------------------------------------------
  // MISSION 6: MARS DESCENT (2042)
  // ------------------------------------------
  m6_entry: {
    bgImage: "assets/panels/m6_p1_entry.jpg",
    caption: "MISSION 6 (2042): Mars Entry, Descent & Landing (EDL)! Entering thin Martian atmosphere over Valles Marineris.",
    hud: {
      image: "assets/nasa_data/hirise_gale_crater.jpg",
      caption: "[SIMULATED TELEMETRY] Altitude: 18.4 KM | Speed: Mach 18.7 | Pitch Trim: UNSTABILIZED"
    },
    choices: [
      { text: "1. Deploy Parachute Immediately without Pitch Trim", nextNode: "m6_p6_shield_failure" },
      { text: "2. Stabilize Pitch Trim & Engage Sky Crane Radar", nextNode: "m6_p2_guidance" }
    ]
  },
  m6_p2_guidance: {
    bgImage: "assets/panels/m6_p2_guidance.jpg",
    caption: "DECISION POINT 2: Chryse Planitia Terrain Alert! Landing radar locked onto 87% boulder density hazard.",
    hud: {
      image: "assets/nasa_data/west_crater_recon.jpg",
      caption: "[SIMULATED TELEMETRY] Altitude: 122m | Hazard Rate: 87% | Sky Crane Thrust Vectoring: READY"
    },
    choices: [
      { text: "1. Execute Sky Crane Thrust Vectoring to Clear Boulders", nextNode: "m6_p3_dust_storm" },
      { text: "2. Maintain Automated Descent Profile over Boulder Field", nextNode: "m6_p5_boulder_crash" }
    ]
  },
  m6_p3_dust_storm: {
    bgImage: "assets/panels/m6_p3_dust_storm.jpg",
    caption: "DECISION POINT 3: Dust Storm Intake Clog! Fine iron-dust particles clogging primary air scrubbers.",
    hud: {
      image: "assets/nasa_data/hirise_gale_crater.jpg",
      caption: "[SIMULATED TELEMETRY] Scrubber Flow: RESTRICTED | Cabin O2: 12% | Power Grid: NOMINAL"
    },
    choices: [
      { text: "1. Reroute Maximum Bus Power into Primary Intakes", nextNode: "m6_p7_habitat_freeze" },
      { text: "2. Overdrive High-Frequency Surface Transmitter Array", nextNode: "m6_p8_comms_blackout" },
      { text: "3. Purge Secondary Scrubber & Deploy Touchdown Probe", nextNode: "m6_p4_success" }
    ]
  },
  m6_p4_success: {
    bgImage: "assets/panels/m6_p4_true_ending.jpg",
    caption: "HISTORICAL SUCCESS: Mars Chryse Touchdown Accomplished!",
    hud: null,
    choices: [{ text: "Log Mars Chryse Commander Badge", nextNode: "m6_p9_victory" }]
  },
  m6_p5_boulder_crash: {
    bgImage: "assets/panels/m6_p5_boulder_crash.jpg",
    caption: "PATH FAILURE: Lander Boulder Crash!",
    debrief: "WHAT REALLY HAPPENED: Thin Martian atmosphere provides minimal braking; landing over unmapped boulders sheared lander legs.",
    hud: null,
    choices: [{ text: "Retry Mission 6 (Enter)", nextNode: "m6_entry" }]
  },
  m6_p6_shield_failure: {
    bgImage: "assets/panels/m6_p6_shield_failure.jpg",
    caption: "PATH FAILURE: Parachute Aerodynamic Shear!",
    debrief: "WHAT REALLY HAPPENED: Deploying parachutes before pitch trim stabilization stripped heat shield tiles under Mach 18 reentry shear.",
    hud: null,
    choices: [{ text: "Retry Mission 6 (Enter)", nextNode: "m6_entry" }]
  },
  m6_p7_habitat_freeze: {
    bgImage: "assets/panels/m6_p7_habitat_freeze.jpg",
    caption: "PATH FAILURE: Electrical Dead-Short Freeze!",
    debrief: "WHAT REALLY HAPPENED: Iron dust caused an electrical short when intake power was maxed, freezing environmental controls.",
    hud: null,
    choices: [{ text: "Retry Mission 6 (Enter)", nextNode: "m6_entry" }]
  },
  m6_p8_comms_blackout: {
    bgImage: "assets/panels/m6_p8_comms_blackout.jpg",
    caption: "PATH FAILURE: Transmitter Plasma Arc Short!",
    debrief: "WHAT REALLY HAPPENED: Overdriving high-frequency radios during dust storms caused ionospheric plasma arcs, frying comms.",
    hud: null,
    choices: [{ text: "Retry Mission 6 (Enter)", nextNode: "m6_entry" }]
  },
  m6_p9_victory: {
    bgImage: "assets/panels/m6_p9_victory_log.jpg",
    caption: "VICTORY: Mars Chryse Descent Logged!",
    hud: null,
    choices: [{ text: "Proceed to Mission 7 (Europa Subsurface)", nextNode: "m7_entry" }]
  },

  // ------------------------------------------
  // MISSION 7: EUROPA SUBSURFACE PROBE (2055)
  // ------------------------------------------
  m7_entry: {
    bgImage: "assets/panels/m7_p1_entry.jpg",
    caption: "MISSION 7 (2055): Subsurface Probe into Europa's 15km Ice Shell! Cryo-cutters melting through water ice.",
    hud: {
      image: "assets/nasa_data/hirise_gale_crater.jpg",
      caption: "[SIMULATED TELEMETRY] Depth: 8.5 KM | Laser Temp: 3,200°C | Coolant Flow: NOMINAL"
    },
    choices: [
      { text: "1. Overdrive Cryo-Cutters to 100% Power Output", nextNode: "m7_p6_cutter_overheat" },
      { text: "2. Deploy Sonar Array & Regulate Meltwater Recirculation", nextNode: "m7_p2_guidance" }
    ]
  },
  m7_p2_guidance: {
    bgImage: "assets/panels/m7_p2_guidance.jpg",
    caption: "DECISION POINT 2: Ice Shell Rift Hazard! Active 310°C hydrothermal plume detected ahead.",
    hud: {
      image: "assets/nasa_data/west_crater_recon.jpg",
      caption: "[SIMULATED TELEMETRY] Depth: 1,208m | Pressure: 118 ATM | Hydrothermal Vent Signature: DETECTED"
    },
    choices: [
      { text: "1. Navigate Toward Hydrothermal Plume Signature", nextNode: "m7_p3_hazard" },
      { text: "2. Force Descent Through Narrow Tectonic Ice Rift", nextNode: "m7_p5_ice_crush" }
    ]
  },
  m7_p3_hazard: {
    bgImage: "assets/panels/m7_p3_hazard.jpg",
    caption: "DECISION POINT 3: Bio-Organic Signal! Organic compound signatures detected near vent chimney.",
    hud: {
      image: "assets/nasa_data/tranquility_coordinates.jpg",
      caption: "[SIMULATED TELEMETRY] Depth: 3.2 KM | Bio-Organic Scan: POSITIVE | Surface Optical Tether: ACTIVE"
    },
    choices: [
      { text: "1. Disable Active Sonar to Preserve Battery", nextNode: "m7_p7_abyss_drift" },
      { text: "2. Lock Optical Tether & Transmit Bio-Signatures", nextNode: "m7_p4_success" },
      { text: "3. Boost Antenna Power in Jovian Radiation Belt", nextNode: "m7_p8_radiation_loss" }
    ]
  },
  m7_p4_success: {
    bgImage: "assets/panels/m7_p4_true_ending.jpg",
    caption: "HISTORICAL SUCCESS: Alien Bio-Signatures Logged from Europa Ocean!",
    hud: null,
    choices: [{ text: "Log Mission 007 Europa Explorer Badge", nextNode: "m7_p9_victory" }]
  },
  m7_p5_ice_crush: {
    bgImage: "assets/panels/m7_p5_ice_crush.jpg",
    caption: "PATH FAILURE: Tectonic Ice Implosion!",
    debrief: "WHAT REALLY HAPPENED: Europa's ice crust undergoes tidal flexing; forcing probes into rifts subjects them to 4,000 BAR crush pressure.",
    hud: null,
    choices: [{ text: "Retry Mission 7 (Enter)", nextNode: "m7_entry" }]
  },
  m7_p6_cutter_overheat: {
    bgImage: "assets/panels/m7_p6_cutter_overheat.jpg",
    caption: "PATH FAILURE: Laser Melt Nose Overheat!",
    debrief: "WHAT REALLY HAPPENED: Overdriving lasers without regulating coolant boils ambient meltwater, cracking the laser nose.",
    hud: null,
    choices: [{ text: "Retry Mission 7 (Enter)", nextNode: "m7_entry" }]
  },
  m7_p7_abyss_drift: {
    bgImage: "assets/panels/m7_p7_abyss_drift.jpg",
    caption: "PATH FAILURE: Abyssal Current Drift!",
    debrief: "WHAT REALLY HAPPENED: Disabling active sonar leaves probes vulnerable to sub-ice thermal currents, causing abyss drift.",
    hud: null,
    choices: [{ text: "Retry Mission 7 (Enter)", nextNode: "m7_entry" }]
  },
  m7_p8_radiation_loss: {
    bgImage: "assets/panels/m7_p8_radiation_loss.jpg",
    caption: "PATH FAILURE: Jovian Radiation Discharges!",
    debrief: "WHAT REALLY HAPPENED: Increasing RF power during Jovian magnetospheric bursts causes static arc discharges across ice arrays.",
    hud: null,
    choices: [{ text: "Retry Mission 7 (Enter)", nextNode: "m7_entry" }]
  },
  m7_p9_victory: {
    bgImage: "assets/panels/m7_p9_victory_log.jpg",
    caption: "HISTORICAL VICTORY: Europa Explorer Logged!",
    hud: null,
    choices: [{ text: "Log Off Terminal & Exit Museum", nextNode: "museum_exit" }]
  },

  // ------------------------------------------
  // EPILOGUE / EXIT
  // ------------------------------------------
  museum_exit: {
    bgImage: "assets/panels/museum_exit.jpg",
    caption: "THE GALACTIC ARCHIVE: As the terminal screen dims, museum lights fade into twilight.\nHistory has been remembered... and lived.\nThank you for exploring the archives, Commander.",
    hud: null,
    choices: [{ text: "🏠 Return to Title Screen", nextNode: "intro_p1" }]
  }
};