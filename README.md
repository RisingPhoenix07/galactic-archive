# 🌌 Galactic Archive — Space Comic RPG

An interactive retro-comic RPG and educational web game simulating historic and speculative spaceflight missions using real NASA telemetry data, authentic audio transmissions, dynamic CRT terminal effects, and an interactive archive log system.

[![Live Demo](https://img.shields.io/badge/Play%20Now-GitHub%20Pages-00f0ff?style=for-the-badge&logo=github)](https://risingphoenix07.github.io/galactic-archive/)
[![Repository](https://img.shields.io/badge/GitHub-RisingPhoenix07%2Fgalactic--archive-64ffda?style=for-the-badge&logo=github)](https://github.com/RisingPhoenix07/galactic-archive.git)

---

## 🚀 Game Overview

Set in **2036**, players control a young space enthusiast inside the **Galactic Archive Museum**. By interacting with retro-futuristic museum terminals, they navigate dynamic decision paths across 7 pivotal spaceflight missions.

- **Visual Comic Storytelling:** Retro comic panel art with dynamic aspect-ratio letterboxing and CRT visual alert triggers (screen shakes, red alarm flashes, and victory glows).
- **Real NASA Telemetry Data:** Interactive telemetry HUD overlays displaying actual NASA photos, flight telemetry figures, and critical alert warnings.
- **Interactive Archive Logs Drawer (`📁 LOGS`):** Dynamic top-right progress pill bar (0–100%) tracking completed mission victories and discovered failure/alternate endings with animated CRT notification popups.
- **Interactive Glossary & Educational Debriefs:** Hover tooltips for NASA acronyms (*HHMU*, *EVA*, *LOS*, *AOS*, *SPS*, *LOI*, *AGC*, *RCS*) and dedicated debrief boxes explaining historical causes of failure.
- **Centralized Audio Engine (`audio.js`):** Custom `AudioManager` class handling volume-balanced channels, dynamic SFX triggers, and browser autoplay compliance.
- **Interactive Easter Eggs & Branding:**
  - **Astro Care Title Tagline:** Animated pulsing title credit acting as an interactive gesture trigger for background theme playback.
 

---

## 🎮 Missions & Levels

1. **Level 0: The Galactic Archive Museum (Intro)** — Explore museum terminal alcoves and launch mission logs.
2. **Mission 1: Friendship 7 (Mercury-Atlas 6, 1962)** — Manage John Glenn’s fly-by-wire drift and retropack heat shield warnings.
3. **Mission 2: Gemini 4 EVA (1965)** — Execute America's first spacewalk, HHMU thruster bursts, metabolic strain, and titanium hatch binding.
4. **Mission 3: Apollo 8 Earthrise (1968)** — Perform lunar farside LOI engine burn and navigate Loss of Signal (LOS) blackout.
5. **Mission 4: Apollo 11 Landing (1969)** — Override 1202 guidance computer alarms and execute manual P66 descent to Tranquility Base.
6. **Mission 5: Artemis Gateway Orbit (2026)** — Dock the Orion capsule with Lunar Gateway and survive Class X9 solar radiation storms.
7. **Mission 6: Mars Chryse Landing (2042)** — Guide the Sky Crane through Martian dust storms and boulder fields.
8. **Mission 7: Europa Subsurface Probe (2055)** — Drive thermal melt cutters through a 15km ice shell to discover subsurface ocean bio-signatures.

---

## 🛠 Tech Stack & Architecture

- **Frontend Engine:** HTML5, Custom CSS3 CRT Effects, Vanilla JavaScript (ES6+).
- **Modular Codebase:**
  - `storyData.js`: Narrative tree dictionary for all 7 missions & epilogue.
  - `failureLogs.js`: Failure tracking subsystem and educational debrief hints.
  - `achievements.js`: Mission & Ending Archive Logs engine, progress pill bar calculation, and toast notifications.
  - `audio.js`: Browser-compliant `AudioManager` class, default-muted audio toggles, and sound routing.
  - `game.js`: Central engine controller managing state rendering, Fisher-Yates choice shuffling, hotkey listeners (1-4, Enter, Esc), and modal handlers.
- **State Management:** `localStorage` session persistence for saved checkpoints and unlocked archive logs.
- **Asset & Data Pipeline:** Python helper scripts (`fetch_nasa_data.py`, `auto_trim_nasa_audio.py`, `build_asset_pipeline.py`) leveraging `requests` and `pydub` to query NASA APIs, process audio clips, and compile asset manifests.

---

## 📁 Repository Structure

```text
galactic-archive/
├── index.html                  # 16:9 game container, fixed HUD bar, & modal drawers[cite: 1]
├── styles.css                  # CRT terminal styles, progress bar, keyframes, & tooltips[cite: 1]
├── storyData.js                # Narrative decision tree data for all missions[cite: 1]
├── failureLogs.js              # Discovered failure log definitions & counter logic[cite: 1]
├── achievements.js             # Archive logs engine, pill progress calculator, & toasts[cite: 1]
├── audio.js                    # Centralized AudioManager engine & audio state routing[cite: 1]
├── game.js                     # Core renderer loop, hotkeys, glossary parser, & modals[cite: 1]
├── fetch_nasa_data.py          # NASA API fetcher for telemetry images & audio clips[cite: 1]
├── auto_trim_nasa_audio.py     # Python audio trimming utility (Pydub)[cite: 1]
├── build_asset_pipeline.py     # Asset manifest generator & prompt compiler[cite: 1]
├── asset_manifest.json         # Panel-to-narrative state mapping[cite: 1]
└── assets/
    ├── panels/                 # Comic panel artwork[cite: 1]
    ├── nasa_data/              # NASA telemetry images & overlay graphics[cite: 1]
    └── sfx/                    # Dynamic SFX & music tracks[cite: 1]
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

[![progKitty](https://shields.io)](https://github.com/progKitty)
[![zasheearameesa-dot](https://shields.io)](https://github.com/zasheearameesa-dot)
[![f0rsakeNiSd3ad](https://shields.io)](https://github.com/f0rsakeNiSd3ad)
[![MeherNaifa](https://shields.io)](https://github.com/MeherNaifa)
[![Ananya Saha Orni](https://shields.io)](https://github.com/Hihumanbeings)

team_AstroCare_

