# 🌌 Galactic Archive — Space Comic RPG

An interactive, choice-driven visual comic RPG and educational web game built for hackathons. Players navigate real historical space missions through dynamic AI-generated comic panels overlaid with authentic NASA telemetry data and historic audio transmissions.

---

## 🚀 Game Overview

Set in **2026**, the player controls a 20-year-old Bangladeshi space enthusiast exploring the **Galactic Archive Museum**. By interacting with retro-futuristic museum terminals, she triggers dynamic simulations of pivotal moments in NASA history.

* **Visual Comic Storytelling:** Graphic-novel panel art rendered in a vibrant retro-futuristic style[cite: 1].
* **Real NASA Data Integration:** Live telemetry HUD overlays displaying actual NASA imagery and data[cite: 1].
* **Authentic Audio Clips:** Auto-trimmed historical communications (e.g., Mercury, Gemini, Apollo 11 descent alarms) synced to decision points[cite: 1].
* **Choice-Driven Mechanics:** Critical historical choices that determine mission success and unlock persistent achievement badges[cite: 1].

---

## 🎮 Missions & Levels

1. **Level 0: The Galactic Archive Museum (Intro)** — Explore the museum entrance and discover interactive retro-futuristic terminals[cite: 1].
2. **Mission 1: Friendship 7 (Mercury-Atlas 6)** — Navigate John Glenn’s orbital flight, manual attitude controls (Fly-By-Wire vs. Manual), and the heat shield alarm[cite: 1].
3. **Mission 2: Gemini 4** — Manage America's first spacewalk (EVA) and thruster anomalies[cite: 1].
4. **Mission 3: Apollo 8** — Execute the Lunar Orbit Insertion (LOI) burn behind the far side of the Moon[cite: 1].
5. **Mission 4: Apollo 11 Simulation** — Manage the famous **1202 Guidance Computer Alarm** during lunar descent to land safely at Tranquility Base[cite: 1].
6. **Victory & Badge Unlocks** — Collect persistent achievement badges (e.g., *Lunar Pioneer* & *Martian Explorer*) saved via `localStorage` across play sessions[cite: 1].

---

## 🛠 Tech Stack & Architecture

* **Frontend Engine:** HTML5, CSS3, Vanilla JavaScript (16:9 responsive layout, HUD telemetry overlays, choice state machine)[cite: 1].
* **Audio Engine (`fetch_nasa_data.py`, `auto_trim_nasa_audio.py`):** Python scripts leveraging `requests` and `pydub` to query the NASA API, fetch historical voice transmissions, trim static, and process game audio clips[cite: 1].
* **Asset Pipeline (`build_asset_pipeline.py`):** Structured Python pipeline maintaining prompt consistency (Character Anchor & Style Anchor) and outputting `asset_manifest.json` for seamless mapping of narrative panels to visual assets[cite: 1].

---

## 📁 Repository Structure

```text
galactic-archive/
├── index.html                  # Main 16:9 game screen & HUD container
├── styles.css                  # Retro-futuristic comic UI, keyframe animations, & HUD styles
├── script.js                   # State machine, choice handlers, & audio triggers
├── fetch_nasa_data.py          # NASA API fetcher for telemetry imagery & audio
├── auto_trim_nasa_audio.py     # Python audio trimmer (Pydub)
├── build_asset_pipeline.py     # Asset manifest generator & prompt compiler
├── asset_manifest.json         # Panel-to-narrative state mapping
└── assets/
    ├── panels/                 # Comic panel images (JPEG/PNG)
    ├── nasa_data/              # Real NASA telemetry images
    └── ui/                     # Badge graphics & interface icons

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
