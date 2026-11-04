// ==========================================
// 1. MASTER GAME STORY TREE
// ==========================================
const storyTree = {
  // LEVEL 0: THE GALACTIC ARCHIVE MUSEUM
  // LEVEL 0: GALACTIC ARCHIVE TERMINAL HUB
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

  // --- MISSION 1: FRIENDSHIP 7 ---
  m1_entry: {
    bgImage: "assets/panels/m1_launch_pad.jpg",
    caption: "MISSION 1 (1962): John Glenn aboard Friendship 7! Systems initialized for Low Earth Orbit manual and fly-by-wire testing.",
    hud: {
      image: "assets/nasa_data/mercury_launch_telemetry.jpg",
      caption: "REAL TELEMETRY: Atlas D Booster | Orbit: 160 KM | Velocity: 17,500 MPH"
    },
    choices: [
      { text: "1. Monitor Orbital Drift & Systems", nextNode: "m1_p2_drift" },
      { text: "2. Check Telemetry Warnings", nextNode: "m1_p3_warning" }
    ]
  },
  m1_p2_drift: {
    bgImage: "assets/panels/m1_p2_drift.jpg",
    caption: "PATH 4 FAILURE: Uncontrolled Orbital Drift! Cabin pressure loss detected, Seal 3B breach.",
    debrief: "WHAT REALLY HAPPENED: In 1962, Glenn suffered a clogged yaw thruster. Had manual attitude control not been engaged promptly, uncontrolled tumbling would have caused rapid cabin pressure loss and re-entry angle deviation.",
    hud: null,
    choices: [{ text: "Retry Mission 1 (Enter)", nextNode: "m1_entry" }]
  },
  m1_p3_warning: {
    bgImage: "assets/panels/m1_p3_warning.jpg",
    caption: "DP2: SENSOR SEGMENT 51 WARNING! Telemetry indicates Landing Bag Unlatched. Jettisoning retropack could lose the heat shield!",
    hud: {
      image: "assets/nasa_data/mercury_landingbag_telemetry.jpg",
      caption: "REAL TELEMETRY: Sensor Seg 51: UNLATCHED | Retropack: LOCKED | Re-entry Approaching"
    },
    choices: [
      { text: "1. Jettison Retropack Prematurely", nextNode: "m1_p4_jettison" },
      { text: "2. Keep Retropack Strapped On for Re-entry", nextNode: "m1_p5_fireball" }
    ]
  },
  m1_p4_jettison: {
    bgImage: "assets/panels/m1_p4_jettison.jpg",
    caption: "PATH 2 FAILURE: Retropack jettisoned! Loose heat shield exposed without retropack straps holding it in place.",
    debrief: "WHAT REALLY HAPPENED: NASA controllers feared Segment 51 was unlatched. Retropack straps were kept on during re-entry to hold the heat shield secure against 3,000°F plasma friction.",
    hud: null,
    choices: [{ text: "Retry Mission 1 (Enter)", nextNode: "m1_entry" }]
  },
  m1_p5_fireball: {
    bgImage: "assets/panels/m1_p5_fireball.jpg",
    caption: "PATH 1 HISTORICAL SUCCESS: Fireball re-entry with retropack straps consuming in flames! Heat shield held secure.",
    hud: null,
    choices: [{ text: "Deploy Main Parachute for Splashdown (Enter)", nextNode: "m1_p6_ending" }]
  },
  m1_p6_ending: {
    bgImage: "assets/panels/m1_p6_ending.jpg",
    caption: "SPLASHDOWN VICTORY: Friendship 7 safely in Atlantic waters! Recovery helicopter on station.",
    hud: null,
    choices: [{ text: "Log Achievement at Terminal (Enter)", nextNode: "m1_p9_victory" }]
  },
  m1_p7_tumble: {
    bgImage: "assets/panels/m1_p7_tumble.jpg",
    caption: "FAILURE: Gyroscopic tumble! Friendship 7 capsule spinning wildly in Low Earth Orbit.",
    debrief: "WHAT REALLY HAPPENED: Over-correcting fly-by-wire controls without monitoring rate gyros caused fuel depletion and high-rate tumbling, making controlled retroburn impossible.",
    hud: null,
    choices: [{ text: "Retry Mission 1 (Enter)", nextNode: "m1_entry" }]
  },
  m1_p8_autofail: {
    bgImage: "assets/panels/m1_p8_autofail.jpg",
    caption: "PATH 5 CRITICAL FAILURE: Auto Control Lost / Gyro Failure! Retropack controls locked in spin.",
    debrief: "WHAT REALLY HAPPENED: Mercury ASCS auto-pilot gyros had high drift rates. Relying strictly on automated systems without manual Fly-By-Wire intervention led to orbital alignment loss prior to retrofire.",
    hud: null,
    choices: [{ text: "Retry Mission 1 (Enter)", nextNode: "m1_entry" }]
  },
  m1_p9_victory: {
    bgImage: "assets/panels/m1_p9_victory.jpg",
    caption: "VICTORY: Friendship 7 Traineeship Badge Unlocked! First US Manned Orbital Flight logged into Galactic Archive.",
    hud: null,
    choices: [{ text: "Proceed to Mission 2 (Gemini 4)", nextNode: "m2_p1_hhmu" }]
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
      { text: "1. Exceed Gas Bursts & Entangle Tether", nextNode: "m2_p5_tether_wrap" },
      { text: "2. Control EVA Thrusters & Pull Tether", nextNode: "m2_p2_tether" }
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
      { text: "1. Climb Into Cockpit & Seal Hatch", nextNode: "m2_p3_hatch" },
      { text: "2. Over-Exert Physical Strain (Fog Visor)", nextNode: "m2_p7_fogged" }
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
      { text: "1. Force Lock & Bend Hatch Dogs", nextNode: "m2_p8_pressure_leak" },
      { text: "2. Force Ratchet Lock Mechanism", nextNode: "m2_p4_success" },
      { text: "3. Initiate Emergency Retrofire Unsealed", nextNode: "m2_p6_jammed_retro" }
    ]
  },
  m2_p4_success: {
    bgImage: "assets/panels/m2_p4_true_ending.jpg",
    caption: "PATH 1 HISTORICAL SUCCESS: Cabin sealed and re-pressurized! 'Re-pressurized — all systems nominal — we did it!'",
    hud: null,
    choices: [{ text: "Log Gemini 4 Pioneer Badge (Enter)", nextNode: "m2_p9_victory" }]
  },
  m2_p5_tether_wrap: {
    bgImage: "assets/panels/m2_p5_tether_wrap.jpg",
    caption: "PATH 2 FAILURE: Tether Entanglement & Spin Failure! Critical oxygen exhaustion. Capsule spinning at 12 RPM.",
    debrief: "WHAT REALLY HAPPENED: During America's first EVA in 1965, Ed White found the Hand-Held Maneuvering Unit (HHMU) ran out of propellant in just 20 seconds. Over-using gas bursts caused severe tether wrapping and rapid metabolic exertion.",
    hud: null,
    choices: [{ text: "Retry Mission 2 (Enter)", nextNode: "m2_p1_hhmu" }]
  },
  m2_p6_jammed_retro: {
    bgImage: "assets/panels/m2_p6_jammed_retro.jpg",
    caption: "PATH 3 FAILURE: Jammed Latch & Retrofire! Emergency de-orbit initiated while hatch seal remained unlatched.",
    debrief: "WHAT REALLY HAPPENED: Initiating retrofire while the hatch mechanism was binding would cause explosive depressurization. Ed White had to manually ratchet the hatch dogs using sheer physical force while Jim McDivitt held his legs.",
    hud: null,
    choices: [{ text: "Retry Mission 2 (Enter)", nextNode: "m2_p1_hhmu" }]
  },
  m2_p7_fogged: {
    bgImage: "assets/panels/m2_p7_fogged_visor.jpg",
    caption: "PATH 4 FAILURE: Metabolic Overheat & Visor Fogging! Suit temp reached 48.7°C. Cooling system offline.",
    debrief: "WHAT REALLY HAPPENED: Floating in microgravity required far more physical effort than anticipated. Ed White's heart rate spiked to 178 BPM, overloading the suit's environmental cooling system and blinding him with internal visor condensation.",
    hud: null,
    choices: [{ text: "Retry Mission 2 (Enter)", nextNode: "m2_p1_hhmu" }]
  },
  m2_p8_pressure_leak: {
    bgImage: "assets/panels/m2_p8_pressure_leak.jpg",
    caption: "PATH 5 CRITICAL FAILURE: Bent Hatch Dogs & Cabin Pressure Leak! Pressure falling past 3.2 PSI.",
    debrief: "WHAT REALLY HAPPENED: Solar radiation caused thermal differential expansion (+1.2mm) in the titanium hatch rim. Forcing the locking dogs without proper mechanical leverage would strip the gears, leaving the cabin unable to hold atmosphere.",
    hud: null,
    choices: [{ text: "Retry Mission 2 (Enter)", nextNode: "m2_p1_hhmu" }]
  },
  m2_p9_victory: {
    bgImage: "assets/panels/m2_p9_victory_log.jpg",
    caption: "VICTORY: Gemini 4 Flight Log & Pioneer Badge Logged! Data synced to Galactic Archive Terminal.",
    hud: null,
    choices: [{ text: "Proceed to Mission 3 (Apollo 8)", nextNode: "m3_p1_mcc" }]
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
      { text: "1. Over-Thrust & Deviate Trajectory", nextNode: "m3_p7_skipout" },
      { text: "2. Execute Mid-Course Burn", nextNode: "m3_p2_loi" }
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
      { text: "1. Maintain SPS Burn & Enter Orbit", nextNode: "m3_p3_comms" },
      { text: "2. Abort LOI Burn Mid-Engine Firing", nextNode: "m3_p6_flyby" }
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
      { text: "1. Manual Thruster Override", nextNode: "m3_p5_impact" },
      { text: "2. Mishandle Orbital Stabilization", nextNode: "m3_p8_mascon" },
      { text: "3. Hold Attitude & Await AOS", nextNode: "m3_p4_earthrise" }
    ]
  },
  m3_p4_earthrise: {
    bgImage: "assets/panels/m3_p4_path1_earthrise.jpg",
    caption: "PATH 1 SUCCESS: Earthrise & Genesis Reading! 'We read Genesis as Earth rose above the Moon.'",
    hud: {
      image: "assets/nasa_data/apollo8_earthrise.jpg",
      caption: "REAL NASA HISTORICAL PHOTO: Hasselblad 70mm Frame AS08-14-2383 (Earthrise)"
    },
    choices: [{ text: "Log Achievement Badge at Terminal (Enter)", nextNode: "m3_p9_victory" }]
  },
  m3_p5_impact: {
    bgImage: "assets/panels/m3_p5_path2_impact.jpg",
    caption: "PATH 2 FAILURE: Fatal Trajectory Error! Impact imminent on Lunar Farside. Gyro failed, no rescue possible.",
    debrief: "WHAT REALLY HAPPENED: Behind the Moon, telemetry with Earth (LOS) was completely severed. Manually firing RCS thrusters during blackout without inertial guidance lock resulted in trajectory decay directly into farside lunar highlands.",
    hud: null,
    choices: [{ text: "Restart Mission 3 (Enter)", nextNode: "m3_p1_mcc" }]
  },
  m3_p6_flyby: {
    bgImage: "assets/panels/m3_p6_path3_flyby.jpg",
    caption: "PATH 3 FAILURE: Hyperbolic Flyby / Missed Capture! Orbit capture failed. Capsule committed to free-return loop.",
    debrief: "WHAT REALLY HAPPENED: Aborting the SPS LOI engine burn prematurely prevented Apollo 8 from entering lunar orbit, forcing the spacecraft into a hyperbolic trajectory back toward Earth on a high-risk free-return coast.",
    hud: null,
    choices: [{ text: "Restart Mission 3 (Enter)", nextNode: "m3_p1_mcc" }]
  },
  m3_p7_skipout: {
    bgImage: "assets/panels/m3_p7_path4_skipout.jpg",
    caption: "PATH 4 FAILURE: Atmospheric Skip-Out! Heatshield glowing at 1200°C. Trajectory skipped off atmosphere into orbital drift.",
    debrief: "WHAT REALLY HAPPENED: Over-thrusting during Trans-Lunar Coast mid-course correction shifted the entry flight path angle ($\gamma$) shallower than $-5.2^\circ$, causing the capsule to skip off Earth's upper atmosphere into solar orbit.",
    hud: null,
    choices: [{ text: "Restart Mission 3 (Enter)", nextNode: "m3_p1_mcc" }]
  },
  m3_p8_mascon: {
    bgImage: "assets/panels/m3_p8_path5_mascon_reentry.jpg",
    caption: "PATH 5 CRITICAL FAILURE: Mascon Drift & Steep Re-entry! Thermal limit exceeded at 3,300°C. Structural failure imminent.",
    debrief: "WHAT REALLY HAPPENED: Lunar mascons (mass concentrations) distort unmonitored lunar orbits. Unchecked gravitational perturbations altered the return corridor to a steep entry angle (> -7.4°), exceeding heatshield thermal limits.",
    hud: null,
    choices: [{ text: "Restart Mission 3 (Enter)", nextNode: "m3_p1_mcc" }]
  },
  m3_p9_victory: {
    bgImage: "assets/panels/m3_p9_victory_log.jpg",
    caption: "VICTORY: Apollo 8 Achievement Badge Logged! Apollo 8 Flight Telemetry synced to Museum Terminal.",
    hud: null,
    choices: [{ text: "Proceed to Mission 4 (Apollo 11)", nextNode: "m4_entry" }]
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
      { text: "1. Abort Landing Immediately", nextNode: "m4_abort" },
      { text: "2. Trust Steve Bales & Override", nextNode: "m4_pitchover" },
      { text: "3. Clear Computer RAM Cache", nextNode: "m4_glitch" }
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
      { text: "1. Maintain Auto-Pilot Trajectory", nextNode: "m4_crash" },
      { text: "2. Increase Engine Thrust to 100%", nextNode: "m4_engine_fault" },
      { text: "3. Take Semi-Automatic P66 Control", nextNode: "m4_touchdown" }
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
      { text: "1. Cut Engine & Touch Down", nextNode: "m4_success" },
      { text: "2. Hover & Search for Flat Soil", nextNode: "m4_crash" }
    ]
  },
  m4_success: {
    bgImage: "assets/panels/m4_p4_path1_tranquility.jpg",
    caption: "PATH 1 SUCCESS: 'Houston, Tranquility Base here. The Eagle has landed!' Mission Accomplished!",
    hud: null,
    choices: [{ text: "Claim Mission Badge (Enter)", nextNode: "victory" }]
  },
  m4_abort: {
    bgImage: "assets/panels/m4_p5_path2_abort.jpg",
    caption: "PATH 2 FAILURE: Abort stage fired at 5,000 FT. Crew survived, but landing was abandoned.",
    debrief: "WHAT REALLY HAPPENED: The 1202/1201 alarm was caused by the rendezvous radar leaking data into the Apollo Guidance Computer (AGC). Guidance Officer Steve Bales famously realized the CPU was recovering via executive overflow, saving the historic landing.",
    hud: null,
    choices: [{ text: "Restart Mission 4 (Enter)", nextNode: "m4_entry" }]
  },
  m4_crash: {
    bgImage: "assets/panels/m4_p6_path3_tipover.jpg",
    caption: "PATH 3 CRITICAL FAILURE: Lander struck West Crater boulders at 22° tilt angle. Hull breached.",
    debrief: "WHAT REALLY HAPPENED: P64 auto-pilot was targeting a boulder field surrounding West Crater. Neil Armstrong had to take semi-automatic P66 manual control to overfly the crater and find a smooth touchdown spot.",
    hud: null,
    choices: [{ text: "Restart Mission 4 (Enter)", nextNode: "m4_entry" }]
  },
  m4_engine_fault: {
    bgImage: "assets/panels/m4_p7_path4_explosion.jpg",
    caption: "PATH 4 CRITICAL FAULT: Engine thermal overload! Nozzle vapor seal ruptured in vacuum.",
    debrief: "WHAT REALLY HAPPENED: Throttle adjustments in low-density vacuum required precise P66 rate throttling. Pinning the descent engine at full 100% thrust close to the surface would cause thermal blowback against the landing legs.",
    hud: null,
    choices: [{ text: "Restart Mission 4 (Enter)", nextNode: "m4_entry" }]
  },
  m4_glitch: {
    bgImage: "assets/panels/m4_p8_path5_tumble.jpg",
    caption: "PATH 5 SYSTEM FAILURE: RAM wipe erased orbital guidance tables. Lander tumbling out of control.",
    debrief: "WHAT REALLY HAPPENED: Attempting to clear the AGC RAM during powered descent purged state vector guidance coordinates, depriving the RCS thrusters of baseline stabilization references.",
    hud: null,
    choices: [{ text: "Restart Mission 4 (Enter)", nextNode: "m4_entry" }]
  },
  victory: {
    bgImage: "assets/panels/m4_p4_path1_tranquility.jpg",
    caption: "VICTORY: Lunar Pioneer Badge Granted! Archived data synced to Museum profile.",
    hud: null,
    choices: [{ text: "Proceed to Mission 5 (Artemis Gateway)", nextNode: "m5_entry" }]
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
      { text: "1. Attempt Shallow Atmospheric Skim", nextNode: "m5_p5_skipout" },
      { text: "2. Initiate Trajectory Alignment Check", nextNode: "m5_p2_guidance" }
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
      { text: "1. Execute Manual RCS Guidance Correction", nextNode: "m5_p3_solar_flare" },
      { text: "2. Cut Power Bus B to Reset Gyros", nextNode: "m5_p7_power_fail" }
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
      { text: "1. Attempt Direct Re-entry with Unaligned Shield", nextNode: "m5_p6_thermal_breach" },
      { text: "2. Re-orient Capsule Heat Shield to Sun", nextNode: "m5_p4_success" },
      { text: "3. Slew Communications Antenna to Deep Space", nextNode: "m5_p8_comms_blackout" }
    ]
  },
  m5_p4_success: {
    bgImage: "assets/panels/m5_p4_true_ending.jpg",
    caption: "PATH 1 HISTORICAL SUCCESS: Docking locked and cabin pressurized! 'Docking complete — historical victory logged!'",
    hud: null,
    choices: [{ text: "Log Mission 005 Badge to Archive (Enter)", nextNode: "m5_p9_victory" }]
  },
  m5_p5_skipout: {
    bgImage: "assets/panels/m5_p5_skipout.jpg",
    caption: "PATH 2 FAILURE: Trajectory Skipout! Atmospheric skim was too shallow. Craft bouncing out into deep space with no re-capture trajectory.",
    debrief: "WHAT REALLY HAPPENED: Artemis Orion skip re-entry uses atmospheric lift to trim velocity. Entering at an angle shallow by even 0.5 degrees causes the capsule to ricochet off dense mesospheric air layers into heliocentric orbit.",
    hud: null,
    choices: [{ text: "Retry Mission 5 (Enter)", nextNode: "m5_entry" }]
  },
  m5_p6_thermal_breach: {
    bgImage: "assets/panels/m5_p6_thermal_breach.jpg",
    caption: "PATH 3 FAILURE: Thermal Shield Breach! Plasma stream burned through unaligned shield tiles during re-entry.",
    debrief: "WHAT REALLY HAPPENED: Re-entering from deep space trajectories involves speeds exceeding 24,500 mph. Any misalignment between the thermal shield vector and the plasma shockwave stream causes local tile erosion and structural burn-through.",
    hud: null,
    choices: [{ text: "Retry Mission 5 (Enter)", nextNode: "m5_entry" }]
  },
  m5_p7_power_fail: {
    bgImage: "assets/panels/m5_p7_power_fail.jpg",
    caption: "PATH 4 FAILURE: Power Critical! Main battery fault caused total bus shutdown. Frost forming on viewports.",
    debrief: "WHAT REALLY HAPPENED: Cutting Power Bus B to clear gyro slip tripped emergency breaker switches on primary fuel cell channels, freezing environmental life support systems in deep space.",
    hud: null,
    choices: [{ text: "Retry Mission 5 (Enter)", nextNode: "m5_entry" }]
  },
  m5_p8_comms_blackout: {
    bgImage: "assets/panels/m5_p8_comms_blackout.jpg",
    caption: "PATH 5 FAILURE: Far-Side Comms Blackout! Trajectory drifted into lunar shadow with no signal reconnect.",
    debrief: "WHAT REALLY HAPPENED: Slewing primary high-gain antennas away from Earth relay satellites during solar radiation storms broke automated trajectory telemetry, causing unmonitored orbital decay behind the Moon.",
    hud: null,
    choices: [{ text: "Retry Mission 5 (Enter)", nextNode: "m5_entry" }]
  },
  m5_p9_victory: {
    bgImage: "assets/panels/m5_p9_victory_log.jpg",
    caption: "HISTORICAL VICTORY: Mission 005 Passed! Achievement badge successfully saved to Galactic Archive terminal.",
    hud: null,
    choices: [{ text: "Proceed to Mission 6 (Mars Descent)", nextNode: "m6_entry" }]
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
      { text: "1. Deploy Parachute Early without Pitch Trim", nextNode: "m6_p6_shield_failure" },
      { text: "2. Activate Terrain Avoidance Radar & Sky Crane", nextNode: "m6_p2_guidance" }
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
      { text: "1. Adjust Sky Crane Thrust to Clear Boulder Grid", nextNode: "m6_p3_dust_storm" },
      { text: "2. Lock Thrusters on Auto-Descent Path", nextNode: "m6_p5_boulder_crash" }
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
      { text: "1. Reroute Main Power to Primary Intakes", nextNode: "m6_p7_habitat_freeze" },
      { text: "2. Override Comm Array in Dust Interference", nextNode: "m6_p8_comms_blackout" },
      { text: "3. Purge Secondary Scrubber & Deploy Ground Drill", nextNode: "m6_p4_success" }
    ]
  },
  m6_p4_success: {
    bgImage: "assets/panels/m6_p4_true_ending.jpg",
    caption: "PATH 1 HISTORICAL SUCCESS: Touchdown at Chryse Planitia! Sample collection probe deployed on red Martian soil.",
    hud: null,
    choices: [{ text: "Log Mission 006 Badge to Archive (Enter)", nextNode: "m6_p9_victory" }]
  },
  m6_p5_boulder_crash: {
    bgImage: "assets/panels/m6_p5_boulder_crash.jpg",
    caption: "PATH 2 FAILURE: Structural Crash! Lander struck a massive Martian boulder at 52° tilt angle. Hull integrity breached.",
    debrief: "WHAT REALLY HAPPENED: The thin Martian atmosphere (1% of Earth's pressure) provides minimal braking. Locking thrusters on auto-descent over un-mapped boulder grids causes lander leg shear or tip-over upon touchdown.",
    hud: null,
    choices: [{ text: "Retry Mission 6 (Enter)", nextNode: "m6_entry" }]
  },
  m6_p6_shield_failure: {
    bgImage: "assets/panels/m6_p6_shield_failure.jpg",
    caption: "PATH 3 FAILURE: Critical Thermal Failure! Unaligned heat shield disintegrated under Mach 18.7 plasma shear.",
    debrief: "WHAT REALLY HAPPENED: Deploying supersonic parachutes before pitch trim stabilization generates extreme aerodynamic torque, stripping the heat shield tiles under Mach 18 reentry shear forces.",
    hud: null,
    choices: [{ text: "Retry Mission 6 (Enter)", nextNode: "m6_entry" }]
  },
  m6_p7_habitat_freeze: {
    bgImage: "assets/panels/m6_p7_habitat_freeze.jpg",
    caption: "PATH 4 FAILURE: Habitat Freeze! Filter clog tripped primary power grid. Temperatures plunged below freezing.",
    debrief: "WHAT REALLY HAPPENED: Fine Martian dust contains electrostatic iron particles. Rerouting maximum power into clogged intakes creates an electrical dead-short, tripping main habitat thermal scrubbers in -80°C night air.",
    hud: null,
    choices: [{ text: "Retry Mission 6 (Enter)", nextNode: "m6_entry" }]
  },
  m6_p8_comms_blackout: {
    bgImage: "assets/panels/m6_p8_comms_blackout.jpg",
    caption: "PATH 5 FAILURE: Signal Blackout & Orbital Loss! Surface transmitter destroyed during dust storm overload.",
    debrief: "WHAT REALLY HAPPENED: Overdriving high-frequency radio arrays during regional Martian dust storms causes ionospheric plasma arc discharges, frying surface transmitter relays permanently.",
    hud: null,
    choices: [{ text: "Retry Mission 6 (Enter)", nextNode: "m6_entry" }]
  },
  m6_p9_victory: {
    bgImage: "assets/panels/m6_p9_victory_log.jpg",
    caption: "HISTORICAL VICTORY: Mission 006 Passed! Excellence Badge logged to Galactic Archive Museum terminal.",
    hud: null,
    choices: [{ text: "Return to Museum Terminal", nextNode: "intro_p1" }]
  },

  // --- MISSION 7: EUROPA SUBSURFACE PROBE & OCEAN DISCOVERY ---
  m7_entry: {
    bgImage: "assets/panels/m7_p1_entry.jpg",
    caption: "MISSION 7 (2055): Sub-surface descent into Europa's 15km thick ice shell! External temp: -160°C. Thermal cutters burning at 3200°C.",
    hud: {
      image: "assets/nasa_data/hirise_gale_crater.jpg",
      caption: "REAL TELEMETRY: Depth: 8.5 KM | Ice Shell Thickness: 15 KM | Cutters: 3200°C NOMINAL"
    },
    choices: [
      { text: "1. Increase Cutter Heat Output to 100%", nextNode: "m7_p6_cutter_overheat" },
      { text: "2. Deploy Subsurface Ocean Sonar Array", nextNode: "m7_p2_guidance" }
    ]
  },
  m7_p2_guidance: {
    bgImage: "assets/panels/m7_p2_guidance.jpg",
    caption: "DP2: ICE SHELL PRESSURE CRITICAL! Compression alert at 1208m depth. Active hydrothermal vent detected ahead at 310°C.",
    hud: {
      image: "assets/nasa_data/west_crater_recon.jpg",
      caption: "REAL TELEMETRY: Pressure: 118.4 ATM | Hull Integrity: 63% | Sonar Lock: ACTIVE"
    },
    choices: [
      { text: "1. Target Hydrothermal Plume Signature", nextNode: "m7_p3_hazard" },
      { text: "2. Force Descent Through Narrow Ice Rift", nextNode: "m7_p5_ice_crush" }
    ]
  },
  m7_p3_hazard: {
    bgImage: "assets/panels/m7_p3_hazard.jpg",
    caption: "DP3: BIO-SIGNATURE DETECTED! Bio-organic particles detected around active vent chimney beneath 15km of ocean ice.",
    hud: {
      image: "assets/nasa_data/tranquility_coordinates.jpg",
      caption: "REAL TELEMETRY: Bio-Organic Scan: CONFIRMED | Depth: 3.2 KM | Salinity: 35ppt"
    },
    choices: [
      { text: "1. Cut Navigation Beacons to Save Power", nextNode: "m7_p7_abyss_drift" },
      { text: "2. Lock Tether Relay & Transmit Bio-Data", nextNode: "m7_p4_success" },
      { text: "3. Increase Antenna Power in Radiation Zone", nextNode: "m7_p8_radiation_loss" }
    ]
  },
  m7_p4_success: {
    bgImage: "assets/panels/m7_p4_true_ending.jpg",
    caption: "PATH 1 HISTORICAL SUCCESS: First confirmed biological activity in Europa's ocean! Ice-tether relay transmitting clear bio-data stream.",
    hud: null,
    choices: [{ text: "Log Mission 007 Badge to Archive (Enter)", nextNode: "m7_p9_victory" }]
  },
  m7_p5_ice_crush: {
    bgImage: "assets/panels/m7_p5_ice_crush.jpg",
    caption: "PATH 2 FAILURE: Hull Implosion! Subsurface ice sheet shift crushed probe structure at 4000 BAR pressure.",
    debrief: "WHAT REALLY HAPPENED: Europa's 15km thick outer ice crust undergoes active tidal flexing from Jupiter's gravitational pull. Forcing descent through narrow rift fractures exposes probes to localized tectonic ice crushes exceeding 4,000 atmospheres.",
    hud: null,
    choices: [{ text: "Retry Mission 7 (Enter)", nextNode: "m7_entry" }]
  },
  m7_p6_cutter_overheat: {
    bgImage: "assets/panels/m7_p6_cutter_overheat.jpg",
    caption: "PATH 3 FAILURE: Thermal Cutter Overheat! Mk-IV melt probe jammed in ice layer 12 with 0% coolant flow.",
    debrief: "WHAT REALLY HAPPENED: Running cryo-melt lasers at 100% capacity without regulating liquid meltwater recirculation boils away ambient coolant, causing thermal stress fracturing of the probe's tungsten cutter nose.",
    hud: null,
    choices: [{ text: "Retry Mission 7 (Enter)", nextNode: "m7_entry" }]
  },
  m7_p7_abyss_drift: {
    bgImage: "assets/panels/m7_p7_abyss_drift.jpg",
    caption: "PATH 4 FAILURE: Sonar Blind & Abyss Drift! Navigation failed at 1832m depth. Drifting into pitch-black ocean abyss.",
    debrief: "WHAT REALLY HAPPENED: Disabling active sonar and optical beacons to save power in sub-ice oceans leaves probes vulnerable to thermal convection currents, drifting off-course into abyssal trenches with zero signal recovery.",
    hud: null,
    choices: [{ text: "Retry Mission 7 (Enter)", nextNode: "m7_entry" }]
  },
  m7_p8_radiation_loss: {
    bgImage: "assets/panels/m7_p8_radiation_loss.jpg",
    caption: "PATH 5 FAILURE: Radiation Signal Loss! Jovian radiation burst destroyed surface relay array. All contact lost.",
    debrief: "WHAT REALLY HAPPENED: Jupiter's magnetosphere traps intense radiation belts. Increasing RF transmission power during high-energy magnetospheric bursts attracts static discharge across the surface ice transceiver array.",
    hud: null,
    choices: [{ text: "Retry Mission 7 (Enter)", nextNode: "m7_entry" }]
  },
  m7_p9_victory: {
    bgImage: "assets/panels/m7_p9_victory_log.jpg",
    caption: "HISTORICAL VICTORY: Mission 007 Passed! Europa Explorer Badge logged to Galactic Archive Museum terminal.",
    hud: null,
    choices: [{ text: "Log Off Terminal & Exit Museum", nextNode: "museum_exit" }]
  },

  // EPILOGUE / GOODBYE PAGE
  museum_exit: {
    bgImage: "assets/panels/museum_exit.jpg",
    caption: "THE GALACTIC ARCHIVE: As the terminal screen dims, the museum lights begin to fade into twilight.\nHistory has been remembered... and lived.\nThank you for exploring the archives, Commander.",
    hud: null,
    choices: [{ text: "🏠 Return to Title Screen", nextNode: "intro_p1" }]
  }
};


// ==========================================
// 2. ACHIEVEMENTS SYSTEM
// ==========================================
const ACHIEVEMENTS = {
  m1_pioneer: { id: "m1_pioneer", title: "Friendship 7 Pioneer", desc: "Successfully completed Mercury-Atlas 6 flight." },
  m2_pioneer: { id: "m2_pioneer", title: "Gemini 4 Spacewalker", desc: "Executed the first US EVA and sealed the hatch." },
  m3_pioneer: { id: "m3_pioneer", title: "Apollo 8 Earthrise", desc: "Navigated lunar orbit and witnessed Earthrise." },
  m4_pioneer: { id: "m4_pioneer", title: "Tranquility Base Commander", desc: "Landed Apollo 11 at West Crater successfully." },
  m5_pioneer: { id: "m5_pioneer", title: "Artemis Gateway Commander", desc: "Successfully navigated Lunar Gateway orbit and flare radiation." },
  m6_pioneer: { id: "m6_pioneer", title: "Mars Chryse Commander", desc: "Successfully executed Mars descent and Chryse Planitia landing." },
  m7_pioneer: { id: "m7_pioneer", title: "Europa Ocean Explorer", desc: "Successfully navigated Europa's subsurface ocean and logged alien bio-signatures." }
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
  toast.innerHTML = `<div class="toast-title">🏆 ACHIEVEMENT UNLOCKED!</div><div class="toast-name">${badge.title}</div><div class="toast-desc">${badge.desc}</div>`;
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
    badgeEl.innerHTML = `<span class="badge-icon">${isUnlocked ? '🏅' : '🔒'}</span><span class="badge-title">${badge.title}</span>`;
    panel.appendChild(badgeEl);
  });
}

// ==========================================
// GLOSSARY & ACRONYM DICTIONARY
// ==========================================
const GLOSSARY = {
  "HHMU": "Hand-Held Maneuvering Unit (Gas thruster gun used during Gemini EVA)",
  "EVA": "Extravehicular Activity (Spacewalk outside spacecraft)",
  "LOS": "Loss of Signal (Comms blackout behind celestial bodies)",
  "AOS": "Acquisition of Signal (Telemetry link re-established with Earth)",
  "SPS": "Service Propulsion System (Apollo main rocket engine)",
  "LOI": "Lunar Orbit Insertion (Engine retro-burn to capture into lunar orbit)",
  "AGC": "Apollo Guidance Computer (Primary flight computer)",
  "RCS": "Reaction Control System (Attitude control thruster jets)"
};

function parseGlossaryTerms(text) {
  if (!text) return "";
  let parsedText = text;
  Object.keys(GLOSSARY).forEach(term => {
    const regex = new RegExp(`\\b(${term})\\b`, 'g');
    parsedText = parsedText.replace(regex, `<span class="glossary-term" data-tooltip="${GLOSSARY[term]}">$1</span>`);
  });
  return parsedText;
}

// ==========================================
// UTILITY: CHOICE SHUFFLER
// ==========================================
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
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
  const startBtn = document.getElementById("start-new-btn");
  const savedNode = getSavedSession();
  if (startBtn) {
    startBtn.textContent = savedNode ? "CONTINUE JOURNEY" : "START YOUR JOURNEY!";
  }
}

function startNewGame() {
  const saved = getSavedSession();
  if (saved) {
    showGameInterface();
    renderNode(saved);
  } else {
    showGameInterface();
    renderNode("intro_p1");
  }
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
    const gameContainer = document.getElementById("game-container");
    const astroZone = document.getElementById("secret-astro-zone");

    if (window.audioManager) {
      window.audioManager.stopAll();
      window.audioManager.play('theme_song', true);
    }

    if (titleScreen) titleScreen.classList.remove("hidden");
    if (hudBar) hudBar.classList.add("hidden");
    if (gameContainer) gameContainer.classList.add("hidden");
    if (astroZone) astroZone.classList.remove("hidden");

    if (typeof updateTitleMenuButtons === "function") {
      updateTitleMenuButtons();
    }
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

  if (window.audioManager) {
    window.audioManager.play('ui_click');
  }
}

function openMissionSelect() {
  showGameInterface();
  renderNode("intro_p1");
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

  saveCurrentSession(nodeKey);
  const panelBox = document.getElementById("panel-box") || document.getElementById("comic-panel");

  // --- 1. VISUAL WARNING, SHAKE & GLOW DETECTOR ---
  const isFailureOrDanger = node.shake || nodeKey.includes("fail") || nodeKey.includes("crash") || nodeKey.includes("alarm") || nodeKey.includes("warning") || nodeKey.includes("drift") || nodeKey.includes("storm") || nodeKey.includes("breach") || nodeKey.includes("freeze") || nodeKey.includes("blackout") || nodeKey.includes("tumble") || nodeKey.includes("skipout") || nodeKey.includes("impact") || nodeKey.includes("crush") || nodeKey.includes("overheat") || (node.caption && (node.caption.includes("FAILURE") || node.caption.includes("CRITICAL")));
  const isSuccessNode = nodeKey.includes("success") || nodeKey.includes("victory") || nodeKey.includes("ending") || nodeKey === "victory" || (node.caption && (node.caption.includes("SUCCESS") || node.caption.includes("VICTORY")));

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
    }
  }

  // --- 2. AUDIO INTEGRATION MANAGER ---
  if (window.audioManager && typeof audioManager.play === "function") {
    audioManager.stopAll();
    if (nodeKey === "intro_p1" || isSuccessNode || nodeKey === "museum_exit" || nodeKey.includes("ending") || nodeKey.includes("victory")) {
      audioManager.play('theme_song', true);
    } else {
      audioManager.play('choice_confirm');
      if (node.sfx) {
        audioManager.play(node.sfx, node.sfxLoop || false);
      } else if (nodeKey === "m4_entry" || nodeKey === "m1_p3_warning" || nodeKey.endsWith("_alarm") || nodeKey.endsWith("_warning")) {
        audioManager.play('alarm_1202', false);
      } else if (nodeKey.includes("launch") || nodeKey === "m3_p1_mcc") {
        audioManager.play('rocket_launch');
      } else if (nodeKey.includes("hhmu") || nodeKey.includes("loi_burn")) {
        audioManager.play('rcs_thruster');
      } else if (nodeKey.includes("crash") || nodeKey.includes("impact") || nodeKey.includes("crush")) {
        audioManager.play('failure');
      }
    }
  }

  // --- 3. CAPTION & DEBRIEF RENDER ---
  const captionBox = document.getElementById("caption-box") || document.getElementById("caption-text");
  if (captionBox) {
    captionBox.innerHTML = parseGlossaryTerms(node.caption || "");
    if (nodeKey === "museum_exit") {
      captionBox.classList.add("caption-epilogue");
    } else {
      captionBox.classList.remove("caption-epilogue");
    }
  }

  // Render Educational Failure Debrief with Glossary Parser
  const debriefBox = document.getElementById("debrief-box");
  if (debriefBox) {
    if (node.debrief) {
      debriefBox.innerHTML = `<div class="debrief-title">📖 WHAT REALLY HAPPENED</div>${parseGlossaryTerms(node.debrief)}`;
      debriefBox.classList.remove("hidden");
    } else {
      debriefBox.classList.add("hidden");
    }
  }
  const rezZone = document.getElementById("secret-rez-zone");
  if (rezZone) {
    if (nodeKey === "museum_exit") {
      rezZone.classList.remove("hidden");
    } else {
      rezZone.classList.add("hidden");
    }
  }

  const astroZone = document.getElementById("secret-astro-zone");
  if (astroZone) {
    if (nodeKey === "intro_p1") {
      astroZone.classList.remove("hidden");
    } else {
      astroZone.classList.add("hidden");
    }
  }

  // --- 4. HUD OVERLAY ---
  const hudOverlay = document.getElementById("hud-overlay") || document.getElementById("nasa-hud");
  const hudImg = document.getElementById("hud-img") || document.getElementById("hud-image");
  const hudCaption = document.getElementById("hud-caption");

  if (hudOverlay) {
    if (node.hud) {
      hudOverlay.classList.remove("hidden");
      if (nodeKey.includes("fail") || nodeKey.includes("crash") || nodeKey.includes("alarm") || nodeKey.includes("breach") || nodeKey.includes("overheat")) {
        hudOverlay.classList.add("alert");
      } else {
        hudOverlay.classList.remove("alert");
      }
      if (hudImg) {
        hudImg.style.display = "block";
        hudImg.src = node.hud.image || node.hud.img || "";
        hudImg.onerror = () => { hudImg.style.display = "none"; };
      }
      if (hudCaption) hudCaption.textContent = node.hud.caption || "";
    } else {
      hudOverlay.classList.add("hidden");
      hudOverlay.classList.remove("alert");
    }
  }

  // --- 5. ACTION BUTTONS (WITH SHUFFLING) ---
  const choicesContainer = document.getElementById("choices-container");
  if (choicesContainer) {
    choicesContainer.innerHTML = "";
    if (node.choices && node.choices.length > 0) {
      const isMenuNode = nodeKey.startsWith("intro_") || nodeKey.includes("victory") || nodeKey === "museum_exit";
      const displayChoices = isMenuNode ? node.choices : shuffleArray(node.choices);

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

  // --- 6. BADGE UNLOCK CHECKER ---
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
  } else if (nodeKey === "m7_p9_victory" || nodeKey === "m7_p4_success") {
    unlockAchievement("m7_pioneer");
  }

  if (typeof renderAchievementBadges === "function") {
    renderAchievementBadges();
  }
}

// ==========================================
// 5. KEYBOARD NAVIGATION HOTKEYS & INITIALIZATION
// ==========================================
document.addEventListener("keydown", (e) => {
  const choicesContainer = document.getElementById("choices-container");
  const titleScreen = document.getElementById("title-screen");

  if (titleScreen && !titleScreen.classList.contains("hidden")) return;
  const modal = document.getElementById("judge-info-modal");
  if (modal && !modal.classList.contains("hidden")) return;

  if (choicesContainer && !choicesContainer.classList.contains("hidden")) {
    const buttons = choicesContainer.querySelectorAll(".choice-btn");
    if (["1", "2", "3"].includes(e.key)) {
      const index = parseInt(e.key) - 1;
      if (buttons[index]) {
        buttons[index].click();
      }
    } else if (e.key === "Enter" && buttons.length === 1) {
      buttons[0].click();
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  if (typeof renderAchievementBadges === 'function') renderAchievementBadges();
  if (typeof updateTitleMenuButtons === 'function') updateTitleMenuButtons();
});

// ==========================================
// JUDGE INFO MODAL CONTROLLERS
// ==========================================
function openJudgeInfoModal() {
  const modal = document.getElementById("judge-info-modal");
  if (modal) {
    modal.classList.remove("hidden");
    if (window.audioManager) {
      audioManager.play('ui_click');
    }
  }
}

function closeJudgeInfoModal() {
  const modal = document.getElementById("judge-info-modal");
  if (modal) {
    modal.classList.add("hidden");
    if (window.audioManager) {
      audioManager.play('ui_click');
    }
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeJudgeInfoModal();
  }
});