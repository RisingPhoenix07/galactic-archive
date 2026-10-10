# 🌌 Galactic Archive — Space Comic RPG

An interactive, choice-driven visual comic RPG and educational web game built for hackathons. Players navigate real historical and speculative space missions through dynamic comic panels overlaid with authentic NASA telemetry data, historic audio transmissions, and theme-driven SFX.

---

## 🚀 Game Overview

Set in **2026**, the player controls a 20-year-old Bangladeshi space enthusiast exploring the **Galactic Archive Museum**. By interacting with retro-futuristic museum terminals, she triggers dynamic simulations of pivotal moments across space exploration history.

- **Visual Comic Storytelling:** Graphic-novel panel art rendered in a vibrant retro-futuristic style with dynamic letterboxing and aspect-ratio scaling.
- **Real NASA Telemetry Data:** Live telemetry HUD overlays displaying actual NASA imagery, mission parameters, and warning alerts.
- **Centralized Audio Engine (`audio.js`):** CENTRALIZED `AudioManager` class handling volume-balanced channels, mute persistence (`localStorage`), and fallback listeners to handle strict browser autoplay policies.
- **Interactive Easter Eggs:**
  * **Astro Care Main Menu Trigger:** Glowing title screen signature that acts as an interactive gesture trigger to seamlessly unlock theme music playback.
  * **Rez Overlay:** Hidden glowing signature zone embedded in the museum epilogue screen (`museum_exit`).
- **Choice-Driven Mechanics & Persistent Badges:** Decision paths determine mission outcomes and grant achievement badges saved across play sessions.

---

## 🎮 Missions & Levels

1. **Level 0: The Galactic Archive Museum (Intro)** — Explore the museum entrance and terminal alcoves.
2. **Mission 1: Friendship 7 (Mercury-Atlas 6, 1962)** — Navigate John Glenn’s orbital flight, fly-by-wire drift, and retropack heat shield warnings.
3. **Mission 2: Gemini 4 EVA (1965)** — Manage America's first spacewalk, HHMU thruster bursts, metabolic overload, and titanium hatch binding.
4. **Mission 3: Apollo 8 Earthrise (1968)** — Execute the LOI burn behind the Moon and handle Loss of Signal (LOS).
5. **Mission 4: Apollo 11 Landing (1969)** — Manage the **1202 Guidance Computer Alarm** and manual P66 descent to land at Tranquility Base.
6. **Mission 5: Artemis Gateway Orbit (2026)** — Dock the Orion capsule with the Lunar Gateway and survive Class X9 solar radiation.
7. **Mission 6: Mars Chryse Landing (2042)** — Guide the Sky Crane through Martian dust storms and terrain boulder fields.
8. **Mission 7: Europa Subsurface Probe (2055)** — Drive thermal melt cutters through a 15km ice shell to log subsurface bio-signatures.

---

## 🛠 Tech Stack & Architecture

- **Frontend Engine:** HTML5, CSS3, Vanilla JavaScript (16:9 responsive layout, HUD telemetry overlays, DOM choice state machine).
- **Audio Engine (`audio.js` & Python Utilities):**
  * JavaScript `AudioManager` engine handling dynamic channel mixing, mute toggling, and sound switching (`whoosh`, `choice_confirm`, `alarm_1202`, `Last_Known_Orbit.mp3`).
  * Python scripts (`fetch_nasa_data.py`, `auto_trim_nasa_audio.py`) leveraging `requests` and `pydub` to query the NASA API, fetch voice transmissions, trim static, and process clips.
- **Asset Pipeline (`build_asset_pipeline.py`):** Structured Python pipeline maintaining prompt consistency and outputting `asset_manifest.json` for mapping narrative states to visual assets.

---

## 📁 Repository Structure

```text
galactic-archive/
├── index.html                  # Main 16:9 game screen, HUD bar & panel containers
├── styles.css                  # Retro-futuristic UI styles, keyframes & glowing overlays
├── audio.js                    # Centralized AudioManager engine & audio state routing
├── script.js                   # State machine, choice handlers & DOM renderer
├── fetch_nasa_data.py          # NASA API fetcher for telemetry imagery & audio
├── auto_trim_nasa_audio.py     # Python audio trimmer (Pydub)
├── build_asset_pipeline.py     # Asset manifest generator & prompt compiler
├── asset_manifest.json         # Panel-to-narrative state mapping
└── assets/
    ├── panels/                 # Comic panel background artwork
    ├── nasa_data/              # Real NASA telemetry overlay graphics
    └── sfx/                    # Game sound effects & theme tracks (Last_Known_Orbit.mp3)

## ⚡ Quick Start (Local Setup)

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
