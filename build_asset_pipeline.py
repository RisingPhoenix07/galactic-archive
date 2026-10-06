import os
import json
import requests

# 1. Define Folder Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PANELS_DIR = os.path.join(BASE_DIR, "assets", "panels")
MANIFEST_FILE = os.path.join(BASE_DIR, "assets", "asset_manifest.json")

os.makedirs(PANELS_DIR, exist_ok=True)

# 2. Define Master Anchors
CHARACTER_ANCHOR = "a 20-year-old female Bangladeshi space enthusiast with short dark hair, wearing a dark pilot jacket with embroidered NASA mission patches"
STYLE_ANCHOR = "comic book panel, vibrant retro-futuristic graphic novel style, clean bold line art, high contrast, dramatic shadows, crisp inks, cinematic lighting, highly detailed"

# 3. Define Panel Definitions Data Structure
PANEL_DEFINITIONS = [
    {
        "panel_id": "intro_p1",
        "level": "Level 0: The Galactic Archive Museum (Intro)",
        "scene": "walking through a grand futuristic museum hall filled with historic rocket exhibits and glowing blue hologram displays",
        "filename": "image_20260929_214951.jpg"
    },
    {
        "panel_id": "intro_p2",
        "level": "Level 0: The Galactic Archive Museum (Intro)",
        "scene": "leaning over a vintage retro-futuristic computer terminal, screen glowing in a dark museum alcove, wide eyes, curious expression",
        "filename": "image_20260929_215011.jpg"
    },
    {
        "panel_id": "apollo_p3",
        "level": "Level 1: Apollo 11 Simulation",
        "scene": "Interior view of the 1202 alarm flashing red inside the Apollo 11 Lunar Module cockpit, close-up on retro mechanical switches and gauge meters",
        "filename": "image_20260929_223132.jpg"
    },
    {
        "panel_id": "apollo_p4",
        "level": "Level 1: Apollo 11 Simulation",
        "scene": "Close-up on two 1960s NASA astronauts in bulky white space helmets inside a cramped spacecraft cabin, looking intensely at red warning lights",
        "filename": "image_20260929_215011.jpg"
    },
    {
        "panel_id": "mars_p5",
        "level": "Level 2: Curiosity Rover Simulation",
        "scene": "The Curiosity Rover descent stage with heat shield entering Mars atmosphere, burning orange friction trail against a dark dusty Martian sky, low angle shot",
        "filename": "image_20260929_223146.jpg"
    },
    {
        "panel_id": "mars_p6",
        "level": "Level 2: Curiosity Rover Simulation",
        "scene": "The six-wheeled NASA Curiosity Rover standing on orange dusty soil in Gale Crater with steep Martian mountains in the background, dramatic lighting",
        "filename": "image_20260929_223133.jpg"
    },
    {
        "panel_id": "ending_p7",
        "level": "Level 3: Victory & Badge Unlock",
        "scene": "smiling proudly, holding up a glowing holographic mission badge displaying a rocket footprint emblem, triumphant pose",
        "filename": "image_20260929_215011-level-1-apollo-11-simulation-the-1202-alarm-panel.jpg"
    }
]

def generate_compiled_prompts():
    """
    Combines Character Anchor, Scene Prompt, and Style Anchor 
    into production-ready prompts and generates a JSON manifest.
    """
    manifest_data = []

    print("--- GENERATING MASTER PROMPTS & MANIFEST ---")
    for panel in PANEL_DEFINITIONS:
        # Construct complete prompt string
        if "Astronaut" in panel["scene"] or "Rover" in panel["scene"] or "1202 alarm" in panel["scene"]:
            # Scenes without main character anchor
            full_prompt = f"{panel['scene']}, {STYLE_ANCHOR}"
        else:
            # Scenes with main character anchor
            full_prompt = f"{CHARACTER_ANCHOR} {panel['scene']}, {STYLE_ANCHOR}"

        entry = {
            "panel_id": panel["panel_id"],
            "level": panel["level"],
            "filename": panel["filename"],
            "relative_path": f"assets/panels/{panel['filename']}",
            "compiled_prompt": full_prompt
        }
        manifest_data.append(entry)
        print(f"\n[ID: {entry['panel_id']}] Path: {entry['relative_path']}")
        print(f"Prompt: {entry['compiled_prompt']}")

    # Write output to JSON manifest file
    with open(MANIFEST_FILE, "w", encoding="utf-8") as f:
        json.dump(manifest_data, f, indent=4)

    print(f"\nSuccessfully generated asset manifest at: {MANIFEST_FILE}")

def download_remote_asset(url: str, output_filename: str):
    """
    Downloads an image file from a URL directly into assets/panels/
    """
    target_path = os.path.join(PANELS_DIR, output_filename)
    try:
        print(f"Downloading {output_filename}...")
        response = requests.get(url, stream=True)
        response.raise_for_status()
        
        with open(target_path, "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        print(f"Saved successfully to: {target_path}")
    except Exception as e:
        print(f"Failed to download image: {e}")

if __name__ == "__main__":
    generate_compiled_prompts()