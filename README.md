# 🌌 Galactic Archive — Space Comic RPG

An interactive retro-comic RPG and educational web game simulating historic and speculative spaceflight missions using real NASA telemetry data, authentic audio transmissions, dynamic CRT terminal effects, custom 2D arcade mini-games, and an interactive archive log system.

[![Live App](https://img.shields.io/badge/Play%20Now-Vercel%20App-00f0ff?style=for-the-badge&logo=vercel)](https://galactic-archive-two.vercel.app/)
[![Repository](https://img.shields.io/badge/GitHub-RisingPhoenix07%2Fgalactic--archive-64ffda?style=for-the-badge&logo=github)](https://github.com/RisingPhoenix07/galactic-archive.git)

---

## 🚀 Game Overview

Set in **2036**, players control a young space enthusiast inside the **Galactic Archive Museum**. By interacting with retro-futuristic museum terminals, they navigate dynamic decision paths across 7 pivotal spaceflight missions.

- **Visual Comic Storytelling:** Retro comic panel art with dynamic aspect-ratio letterboxing and CRT visual alert triggers (screen shakes, red alarm flashes, and victory glows).
- **Interactive Mini-Game Modules:** Seamlessly transitions from narrative comic panels to custom 2D arcade simulations powered by Phaser 3 (e.g., Apollo 11 P66 Lunar Lander Terminal Guidance Simulator).
- **ARCHIE AI Space Curator:** An interactive retro-computer AI guide powered by Groq's high-speed LPU infrastructure (`openai/gpt-oss-20b`), providing real-time Socratic hints and NASA historical guidance without spoiling game choices.
- **Hybrid AI & Offline Fallback Engine:** A multi-tiered query system that routes through a secure Vercel backend proxy (`api/archie-curator.js`) and gracefully falls back to a client-side rule-based FAQ engine (`curator.js`) during network interruptions.
- **Real NASA Telemetry Data:** Interactive telemetry HUD overlays displaying actual NASA photos, flight telemetry figures, and critical alert warnings.
- **Interactive Archive Logs Drawer (`📁 LOGS`):** Dynamic top-right progress pill bar (0–100%) tracking completed mission victories and discovered failure/alternate endings with animated CRT notification popups.
- **Interactive Glossary & Educational Debriefs:** Hover tooltips for NASA acronyms (*HHMU*, *EVA*, *LOS*, *AOS*, *SPS*, *LOI*, *AGC*, *RCS*) and dedicated debrief boxes explaining historical causes of failure.
- **Centralized Audio Engine (`audio.js`):** Custom `AudioManager` class handling volume-balanced channels, dynamic SFX triggers, and browser autoplay compliance.

---

## 🕹️ Arcade Engine & Mini-Games

The game features modular, engine-driven 2D arcade sequences integrated directly into the narrative decision tree. When reaching specific mission nodes, the UI seamlessly transitions from static comic panels to interactive physics simulation canvases.

### Active Mini-Game Engines:
- **P66 Lunar Lander Simulator (Phaser 3 Engine):**
  - **Mission Node:** Mission 4 (Apollo 11 Landing at Tranquility Base).
  - **Mechanics:** Real-time Arcade physics simulating lunar gravity, main engine descent thrust, RCS lateral maneuvering, fuel consumption, tilt angle management, waypoint corridor checkpoints, and velocity tolerances for touchdown.

### 🔮 Future Mini-Game Roadmap:
- **Gemini 4 EVA Zero-G Thruster Challenge:** HHMU oxygen jet propellant balancing and tether management in microgravity.
- **Apollo 8 Farside LOI Engine Timing Burn:** Precision hold-to-burn trajectory meter during lunar orbit insertion blackout.
- **Mars Chryse Sky Crane Descent:** Altitude control and terrain hazard avoidance over boulder fields.

---

## 🎮 Missions & Levels

1. **Level 0: The Galactic Archive Museum (Intro)** — Explore museum terminal alcoves and launch mission logs.
2. **Mission 1: Friendship 7 (Mercury-Atlas 6, 1962)** — Manage John Glenn’s fly-by-wire drift and retropack heat shield warnings.
3. **Mission 2: Gemini 4 EVA (1965)** — Execute America's first spacewalk, HHMU thruster bursts, metabolic strain, and titanium hatch binding.
4. **Mission 3: Apollo 8 Earthrise (1968)** — Perform lunar farside LOI engine burn and navigate Loss of Signal (LOS) blackout.
5. **Mission 4: Apollo 11 Landing (1969)** — Override 1202 guidance computer alarms and execute manual P66 descent in the 2D Phaser Arcade simulator.
6. **Mission 5: Artemis Gateway Orbit (2026)** — Dock the Orion capsule with Lunar Gateway and survive Class X9 solar radiation storms.
7. **Mission 6: Mars Chryse Landing (2042)** — Guide the Sky Crane through Martian dust storms and boulder fields.
8. **Mission 7: Europa Subsurface Probe (2055)** — Drive thermal melt cutters through a 15km ice shell to discover subsurface ocean bio-signatures.

---

## 🛠 Tech Stack & Architecture

- **Frontend Engine:** HTML5, Custom CSS3 CRT Effects, Vanilla JavaScript (ES6+).
- **2D Mini-Game Engine:** Phaser 3 Framework (Arcade Physics System).
- **Backend API Proxy:** Vercel Serverless Node.js Handler (`api/archie-curator.js`).
- **AI Engine:** Groq API (`openai/gpt-oss-20b`) for sub-second, low-latency Socratic responses.
- **Modular Codebase:**
  - `curator.js`: ARCHIE UI drawer controller, Groq fetch proxy integration, and local rule-based FAQ engine.
  - `storyData.js`: Narrative tree dictionary for all 7 missions & epilogue.
  - `failureLogs.js`: Failure tracking subsystem and educational debrief hints.
  - `achievements.js`: Mission & Ending Archive Logs engine, progress pill bar calculator, and toast notifications.
  - `audio.js`: Centralized `AudioManager` class, default-muted audio toggles, and sound routing.
  - `game.js`: Central engine controller managing state rendering, Fisher-Yates choice shuffling, hotkey listeners (1-4, Enter, Esc), and modal handlers.
- **State Management:** `localStorage` session persistence for saved checkpoints and unlocked archive logs.
- **Asset Pipeline:** Python helper scripts (`fetch_nasa_data.py`, `build_asset_pipeline.py`) leveraging `requests` and `pydub` to query NASA APIs and compile asset manifests.

---

## 📁 Repository Structure

```text
galactic-archive/
├── api/
│   └── archie-curator.js       # Vercel serverless proxy endpoint for Groq API
├── minigames/
|     └── LunarLanderGame.js    # Modular 2D Arcade Engine scripts (e.g., Phaser 3 Lunar Lander)
├── assets/
│   ├── panels/                 # Comic panel artwork
│   ├── nasa_data/              # NASA telemetry images & overlay graphics
│   └── sfx/                    # Dynamic SFX & music tracks
├── index.html                  # 16:9 game container, fixed HUD bar, & canvas container
├── styles.css                  # CRT terminal styles, progress bar, keyframes, & tooltips
├── curator.js                  # ARCHIE drawer UI & hybrid offline/online fetch engine
├── storyData.js                # Narrative decision tree data for all missions
├── failureLogs.js              # Discovered failure log definitions & counter logic
├── achievements.js             # Archive logs engine, pill progress calculator, & toasts
├── audio.js                    # Centralized AudioManager engine & audio state routing
├── game.js                     # Core renderer loop, hotkeys, glossary parser, & modals
├── fetch_nasa_data.py          # NASA API fetcher for telemetry images & audio clips
├── build_asset_pipeline.py     # Asset manifest generator & prompt compiler
└── asset_manifest.json         # Panel-to-narrative state mapping



### Deployed on Vercel
[![Play on Vercel](https://img.shields.io/badge/Play%20Now-Vercel%20App-00f0ff?style=for-the-badge&logo=vercel)](https://galactic-archive-two.vercel.app/)
(Local Setup)

### 1. Clone the Repository
```bash
git clone [https://github.com/RisingPhoenix07/galactic-archive.git](https://github.com/RisingPhoenix07/galactic-archive.git)
cd galactic-archive

#### Option A: Use a virtual environment (Recommended)

# Install python3-venv and python3-full if not already installed
sudo apt update && sudo apt install python3-venv python3-full -y

# Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate

# Install required Python packages
pip install requests pydub
```[cite: 1]

#### Option B: Install via System Package Manager (`apt`)
```bash
sudo apt update && sudo apt install python3-requests python3-pydub -y
```

---

### 3. Run the Asset Pipeline
Fetch real NASA telemetry images, trim audio clips, and compile the game asset manifest:
```bash
python3 fetch_nasa_data.py
python3 build_asset_pipeline.py
```

---

### 4. Launch the Game
Open `index.html` directly in any modern browser, or launch it using VS Code's **Live Server** extension


## 💖 Acknowledgments


Big thanks to these amazing individuals! They all helped with the storyline, images, sfx, overall testing and so on...
team_AstroCare_
[![progKitty](https://shields.io)](https://github.com/progKitty)
[![zasheearameesa-dot](https://shields.io)](https://github.com/zasheearameesa-dot)
[![f0rsakeNiSd3ad](https://shields.io)](https://github.com/f0rsakeNiSd3ad)
[![MeherNaifa](https://shields.io)](https://github.com/MeherNaifa)
[![Ananya Saha Orni](https://shields.io)](https://github.com/Hihumanbeings)


## 📊 NASA Telemetry & Asset Data Sources

| Mission | Era / Year | Real vs. Simulated | NASA Image ID / Telemetry Reference |
| :--- | :--- | :--- | :--- |
| **Mission 1: Friendship 7** | 1962 (Historic) | Real NASA Data | `428-GX-02-12` (Friendship 7 Capsule & Retropack Data) |
| **Mission 2: Gemini 4 EVA** | 1965 (Historic) | Real NASA Data | `S65-30433` (Ed White EVA & HHMU Telemetry) |
| **Mission 3: Apollo 8 Earthrise** | 1968 (Historic) | Real NASA Data | `AS08-14-2383` (Apollo 8 Earthrise & LOI Burn GET 069:08) |
| **Mission 4: Apollo 11 Landing** | 1969 (Historic) | Real NASA Data | `AS11-40-5874` (Tranquility Base & AGC 1202 Executive Overflow) |
| **Mission 5: Artemis Gateway** | 2026 (Speculative) | Simulated NASA Projection | Artemis NRHO Trajectory Models & Solar Particle Events (SPE) |
| **Mission 6: Mars Chryse** | 2042 (Speculative) | Simulated NASA Projection | HiRISE Terrain Reconnaissance (`PIA23726` Gale/Chryse Planitia) |
| **Mission 7: Europa Probe** | 2055 (Speculative) | Simulated NASA Projection | Galileo Thermal Sensing & Europa Clipper Subsurface Profiling |
