// ==========================================
// 1. MASTER GAME STORY TREE
// ==========================================
const storyTree = {
  // LEVEL 0: THE GALACTIC ARCHIVE MUSEUM
  intro_p1: {
    bgImage: "assets/panels/intro_1.jpg",
    caption: "The year is 2036. Inside the Galactic Archive Museum, history isn't just stored... it's lived.",
    hud: null,
    choices: [
      { text: "Approach Terminal Alcove", nextNode: "intro_p2" }
    ]
  },
  intro_p2: {
    bgImage: "assets/panels/intro_2.jpg",
    caption: "ACT I TERMINAL: Select an archive log from the Historic Pioneer Era (1960s - 1970s).",
    hud: null,
    choices: [
      { text: "Mission 1: Friendship 7 (1962)", nextNode: "m1_entry" },
      { text: "Mission 2: Gemini 4 EVA (1965)", nextNode: "m2_p1_hhmu" },
      { text: "Mission 3: Apollo 8 Earthrise (1968)", nextNode: "m3_p1_mcc" },
      { text: "Mission 4: Apollo 11 Landing (1969)", nextNode: "m4_entry" },
      { text: "➡️ NEXT PAGE: Act II Deep Space Missions", nextNode: "intro_p3" }
    ]
  },

  intro_p3: {
    bgImage: "assets/panels/intro_2.jpg",
    caption: "ACT II TERMINAL: Select an archive log from the Modern Deep Space & Artemis Era.",
    hud: null,
    choices: [
      { text: "Mission 5: Artemis Gateway Orbit (2026)", nextNode: "m5_entry" },
      { text: "Mission 6: Mars Chryse Landing (2042)", nextNode: "m6_entry" },
      { text: "⬅️ PREVIOUS PAGE: Act I Historic Era", nextNode: "intro_p2" },
      { text: "🏠 Return to Main Museum Hub", nextNode: "intro_p1" }
    ]
  },

  // --- MISSION 1: FRIENDSHIP 7 ---
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

  // --- MISSION 2: GEMINI 4 ---
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

  // --- MISSION 3: APOLLO 8 ---
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

  m3_p4_earthrise: {
    bgImage: "assets/panels/m3_p4_path1_earthrise.jpg",
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

  // --- MISSION 4: APOLLO 11 ---
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
      { text: "Proceed to Mission 5 (Artemis Gateway)", nextNode: "m5_entry" }
    ]
  },

  // --- MISSION 5: ARTEMIS / GATEWAY ---
  m5_entry: {
    bgImage: "assets/panels/m5_p1_entry.jpg",
    caption: "MISSION 5 (2026): Flight Specialist Tahsina Chowdhury aboard Orion! Approaching the Lunar Gateway station. Systems nominal, preparing for final orbital lock.",
    hud: {
      image: "assets/nasa_data/orion_gateway_telemetry.jpg",
      caption: "REAL TELEMETRY: Alt: 112.4 KM | Vel: 1.62 KM/S | Orbit Insertion T-00:12:04"
    },
    choices: [
      { text: "Initiate Trajectory Alignment Check", nextNode: "m5_p2_guidance" },
      { text: "Attempt Shallow Atmospheric Skim", nextNode: "m5_p5_skipout" }
    ]
  },

  m5_p2_guidance: {
    bgImage: "assets/panels/m5_p2_guidance.jpg",
    caption: "DP2: TRAJECTORY & GUIDANCE ALERT! Gyro slip detected (+12.4° off-nominal). Flight computer requests immediate override command.",
    hud: {
      image: "assets/nasa_data/orion_guidance_telemetry.jpg",
      caption: "REAL TELEMETRY: Guidance Drift: 0.87 m/s² | Oxidizer: 42% | Gyro Lock: WARN"
    },
    choices: [
      { text: "Execute Manual RCS Guidance Correction", nextNode: "m5_p3_solar_flare" },
      { text: "Cut Power Bus B to Reset Gyros", nextNode: "m5_p7_power_fail" }
    ]
  },

  m5_p3_solar_flare: {
    bgImage: "assets/panels/m5_p3_solar_flare.jpg",
    caption: "DP3: RADIATION CRITICAL! Class X9 solar flare inbound. Shield status at 12% and overloading. Immediate action required!",
    hud: {
      image: "assets/nasa_data/tranquility_coordinates.jpg",
      caption: "REAL TELEMETRY: Solar Flare Class X9 | Radiation: 1284 mSv/hr | Shield: OVERLOAD"
    },
    choices: [
      { text: "Re-orient Capsule Heat Shield to Sun", nextNode: "m5_p4_success" },
      { text: "Attempt Direct Re-entry with Unaligned Shield", nextNode: "m5_p6_thermal_breach" },
      { text: "Slew Communications Antenna to Deep Space", nextNode: "m5_p8_comms_blackout" }
    ]
  },

  m5_p4_success: {
    bgImage: "assets/panels/m5_p4_true_ending.jpg",
    caption: "PATH 1 HISTORICAL SUCCESS: Docking locked and cabin pressurized! 'Docking complete — historical victory logged!'",
    hud: null,
    choices: [
      { text: "Log Mission 005 Badge to Archive", nextNode: "m5_p9_victory" }
    ]
  },

  m5_p5_skipout: {
    bgImage: "assets/panels/m5_p5_skipout.jpg",
    caption: "PATH 2 FAILURE: Trajectory Skipout! Atmospheric skim was too shallow. Craft bouncing out into deep space with no re-capture trajectory.",
    hud: null,
    choices: [
      { text: "Retry Mission 5", nextNode: "m5_entry" }
    ]
  },

  m5_p6_thermal_breach: {
    bgImage: "assets/panels/m5_p6_thermal_breach.jpg",
    caption: "PATH 3 FAILURE: Thermal Shield Breach! Plasma stream burned through unaligned shield tiles during re-entry.",
    hud: null,
    choices: [
      { text: "Retry Mission 5", nextNode: "m5_entry" }
    ]
  },

  m5_p7_power_fail: {
    bgImage: "assets/panels/m5_p7_power_fail.jpg",
    caption: "PATH 4 FAILURE: Power Critical! Main battery fault caused total bus shutdown. Frost forming on viewports.",
    hud: null,
    choices: [
      { text: "Retry Mission 5", nextNode: "m5_entry" }
    ]
  },

  m5_p8_comms_blackout: {
    bgImage: "assets/panels/m5_p8_comms_blackout.jpg",
    caption: "PATH 5 FAILURE: Far-Side Comms Blackout! Trajectory drifted into lunar shadow with no signal reconnect.",
    hud: null,
    choices: [
      { text: "Retry Mission 5", nextNode: "m5_entry" }
    ]
  },

  m5_p9_victory: {
    bgImage: "assets/panels/m5_p9_victory_log.jpg",
    caption: "HISTORICAL VICTORY: Mission 005 Passed! Achievement badge successfully saved to Galactic Archive terminal.",
    hud: null,
    choices: [
      { text: "Proceed to Mission 6 (Mars Descent)", nextNode: "m6_entry" }
    ]
  },

  // --- MISSION 6: MARS DESCENT & SURFACE EXPLORATION ---
  m6_entry: {
    bgImage: "assets/panels/m6_p1_entry.jpg",
    caption: "MISSION 6 (2042): Mars Atmospheric Descent! Entering thin Martian air over Valles Marineris canyons. Heat shield glowing at 1650°C.",
    hud: {
      image: "assets/nasa_data/hirise_gale_crater.jpg",
      caption: "REAL TELEMETRY: Altitude: 18.4 KM | Velocity: 4.2 KM/S | Heat Shield: 1653°C - CRITICAL"
    },
    choices: [
      { text: "Activate Terrain Avoidance Radar & Sky Crane", nextNode: "m6_p2_guidance" },
      { text: "Deploy Parachute Early without Pitch Trim", nextNode: "m6_p6_shield_failure" }
    ]
  },

  m6_p2_guidance: {
    bgImage: "assets/panels/m6_p2_guidance.jpg",
    caption: "DP2: TERRAIN RADAR ALERT! Boulder field detected at Chryse Planitia landing footprint (87% hazard rate). Sky Crane thrust vectoring requested.",
    hud: {
      image: "assets/nasa_data/west_crater_recon.jpg",
      caption: "REAL TELEMETRY: Altitude: 122m | Sky Crane Power: 30% | Radar Lock: ACTIVE"
    },
    choices: [
      { text: "Adjust Sky Crane Thrust to Clear Boulder Grid", nextNode: "m6_p3_dust_storm" },
      { text: "Lock Thrusters on Auto-Descent Path", nextNode: "m6_p5_boulder_crash" }
    ]
  },

  m6_p3_dust_storm: {
    bgImage: "assets/panels/m6_p3_dust_storm.jpg",
    caption: "DP3: ATMOSPHERIC BREACH & DUST STORM! Massive dust storm enveloping habitat zone. Sand intake filter clogged, cabin pressure leaking.",
    hud: {
      image: "assets/nasa_data/hirise_gale_crater.jpg",
      caption: "REAL TELEMETRY: O2: 12% - CRITICAL | Cabin Press: 0.62 ATM | Scrubber: OFFLINE"
    },
    choices: [
      { text: "Purge Secondary Scrubber & Deploy Ground Drill", nextNode: "m6_p4_success" },
      { text: "Reroute Main Power to Primary Intakes", nextNode: "m6_p7_habitat_freeze" },
      { text: "Override Comm Array in Dust Interference", nextNode: "m6_p8_comms_blackout" }
    ]
  },

  m6_p4_success: {
    bgImage: "assets/panels/m6_p4_true_ending.jpg",
    caption: "PATH 1 HISTORICAL SUCCESS: Touchdown at Chryse Planitia! Sample collection probe deployed on red Martian soil.",
    hud: null,
    choices: [
      { text: "Log Mission 006 Badge to Archive", nextNode: "m6_p9_victory" }
    ]
  },

  m6_p5_boulder_crash: {
    bgImage: "assets/panels/m6_p5_boulder_crash.jpg",
    caption: "PATH 2 FAILURE: Structural Crash! Lander struck a massive Martian boulder at 52° tilt angle. Hull integrity breached.",
    hud: null,
    choices: [
      { text: "Retry Mission 6", nextNode: "m6_entry" }
    ]
  },

  m6_p6_shield_failure: {
    bgImage: "assets/panels/m6_p6_shield_failure.jpg",
    caption: "PATH 3 FAILURE: Critical Thermal Failure! Unaligned heat shield disintegrated under Mach 18.7 plasma shear.",
    hud: null,
    choices: [
      { text: "Retry Mission 6", nextNode: "m6_entry" }
    ]
  },

  m6_p7_habitat_freeze: {
    bgImage: "assets/panels/m6_p7_habitat_freeze.jpg",
    caption: "PATH 4 FAILURE: Habitat Freeze! Filter clog tripped primary power grid. Temperatures plunged below freezing.",
    hud: null,
    choices: [
      { text: "Retry Mission 6", nextNode: "m6_entry" }
    ]
  },

  m6_p8_comms_blackout: {
    bgImage: "assets/panels/m6_p8_comms_blackout.jpg",
    caption: "PATH 5 FAILURE: Signal Blackout & Orbital Loss! Surface transmitter destroyed during dust storm overload.",
    hud: null,
    choices: [
      { text: "Retry Mission 6", nextNode: "m6_entry" }
    ]
  },

  m6_p9_victory: {
    bgImage: "assets/panels/m6_p9_victory_log.jpg",
    caption: "HISTORICAL VICTORY: Mission 006 Passed! Excellence Badge logged to Galactic Archive Museum terminal.",
    hud: null,
    choices: [
      { text: "Return to Museum Terminal", nextNode: "intro_p1" }
    ]
  }
};

// ==========================================
// 2. ACHIEVEMENTS SYSTEM
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
  },
  m5_pioneer: { 
    id: "m5_pioneer", 
    title: "Artemis Gateway Commander", 
    desc: "Successfully navigated Lunar Gateway orbit and flare radiation." 
  },
  m6_pioneer: { 
    id: "m6_pioneer", 
    title: "Mars Chryse Commander", 
    desc: "Successfully executed Mars descent and Chryse Planitia landing." 
  }
};

function getUnlockedAchievements() {
  const data = localStorage.getItem("galactic_archive_achievements");
  return data ? JSON.parse(data) : [];
}

function unlockAchievement(achievementId) {
  let unlocked = getUnlockedAchievements();
  if (!unlocked.includes(achievementId)) {
    unlocked.push(achievementId);
    localStorage.setItem("galactic_archive_achievements", JSON.stringify(unlocked));
    showAchievementPopup(ACHIEVEMENTS[achievementId]);
    renderAchievementBadges();
  }
}

function showAchievementPopup(badge) {
  if (!badge) return;
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
  panel.innerHTML = "";

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

// ==========================================
// 3. SESSION SAVING & UI CONTROL
// ==========================================
function saveCurrentSession(nodeKey) {
  localStorage.setItem("galactic_archive_saved_node", nodeKey);
}

function getSavedSession() {
  return localStorage.getItem("galactic_archive_saved_node");
}

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

function startGame() {
  showGameInterface();
  const savedNode = getSavedSession();
  renderNode(savedNode || "intro_p1"); 
}

function resetSession() {
  if (!confirm("This will clear all unlocked achievements and restart your progress from the beginning. Continue?")) {
    return;
  }

  localStorage.removeItem("galactic_archive_achievements");
  localStorage.removeItem("galactic_archive_saved_node");

  renderAchievementBadges();
  updateTitleMenuButtons();
  showGameInterface();
  renderNode("intro_p1");
}

function goToMainMenu() {
  if (confirm("Return to the title screen? Progress in this session will be saved.")) {
    const titleScreen = document.getElementById("title-screen");
    const hudBar = document.getElementById("hud-bar");
    const panelBox = document.getElementById("panel-box") || document.getElementById("comic-panel");
    const choicesContainer = document.getElementById("choices-container");

    if (titleScreen) titleScreen.classList.remove("hidden");
    if (hudBar) hudBar.classList.add("hidden");
    if (panelBox) panelBox.classList.add("hidden");
    if (choicesContainer) choicesContainer.classList.add("hidden");
  }
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
// 4. CORE ENGINE RENDERER
// ==========================================
function renderNode(nodeKey) {
  const node = storyTree[nodeKey];
  
  if (!node) {
    console.error(`Error: Node key '${nodeKey}' does not exist in storyTree!`);
    return;
  }

  // Auto-save current progress
  saveCurrentSession(nodeKey);

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

  // 5. Automatic Badge Unlock Checker
  if (nodeKey === "m1_p9_victory" || nodeKey === "m1_victory") {
    unlockAchievement("m1_pioneer");
  } else if (nodeKey === "m2_p9_victory" || nodeKey === "m2_p4_success" || nodeKey === "m2_victory") {
    unlockAchievement("m2_pioneer");
  } else if (nodeKey === "m3_p9_victory" || nodeKey === "m3_victory") {
    unlockAchievement("m3_pioneer");
  } else if (nodeKey === "m4_p9_victory" || nodeKey === "m4_victory" || nodeKey === "m4_success" || nodeKey === "victory") {
    unlockAchievement("m4_pioneer");
  } else if (nodeKey === "m5_p9_victory" || nodeKey === "m5_p4_success") {
    unlockAchievement("m5_pioneer");
  } else if (nodeKey === "m6_p9_victory" || nodeKey === "m6_p4_success") {
    unlockAchievement("m6_pioneer");
  }

  // 6. Refresh persistent badges in UI
  renderAchievementBadges();
}

// Initializing application state on load
document.addEventListener("DOMContentLoaded", () => {
  renderAchievementBadges();
  updateTitleMenuButtons();
});