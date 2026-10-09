import os
import requests

# Target directory for real NASA telemetry and historical image assets
OUTPUT_DIR = os.path.join("assets", "nasa_data")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# NASA Image & Video Library API endpoint
NASA_API_URL = "https://images-api.nasa.gov/search"

def download_nasa_asset(query: str, target_nasa_id: str, local_filename: str):
    """
    Searches NASA's public media library using exact NASA Asset IDs
    and downloads the primary image asset into assets/nasa_data/.
    """
    params = {
        "q": query,
        "media_type": "image"
    }
    
    print(f"[NASA API] Querying: '{query}' (Target ID: {target_nasa_id})...")
    try:
        response = requests.get(NASA_API_URL, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        items = data.get("collection", {}).get("items", [])
        selected_url = None
        
        # Exact or partial match for target NASA Asset ID
        for item in items:
            item_data = item.get("data", [{}])[0]
            nasa_id = item_data.get("nasa_id", "")
            if target_nasa_id and target_nasa_id.lower() in nasa_id.lower():
                links = item.get("links", [])
                if links:
                    selected_url = links[0].get("href")
                break
        
        # Fallback to top search result if exact ID isn't directly tagged
        if not selected_url and items:
            links = items[0].get("links", [])
            if links:
                selected_url = links[0].get("href")
            
        if selected_url:
            print(f"[DOWNLOADING] Saving asset to: {local_filename}")
            img_bytes = requests.get(selected_url, timeout=15).content
            file_path = os.path.join(OUTPUT_DIR, local_filename)
            with open(file_path, "wb") as f:
                f.write(img_bytes)
            print(f"[SUCCESS] Saved to {file_path}\n")
        else:
            print(f"[WARNING] No asset found for: '{query}'\n")

    except Exception as e:
        print(f"[ERROR] Failed to fetch data for {query}: {e}\n")

if __name__ == "__main__":
    print("=== STARTING NASA REAL DATA ASSET FETCH ===\n")
    
    # --- MISSION 5 (ARTEMIS / ORION GATEWAY) ---
    download_nasa_asset(
        query="Orion Spacecraft Moon Artemis 1", 
        target_nasa_id="artemis1_orion_lunar", 
        local_filename="orion_gateway_telemetry.jpg"
    )
    download_nasa_asset(
        query="Artemis Orion Spacecraft Deep Space", 
        target_nasa_id="orion_orbit_telemetry", 
        local_filename="orion_guidance_telemetry.jpg"
    )

    # --- MISSION 1 (FRIENDSHIP 7 / MERCURY-ATLAS 6) ---
    download_nasa_asset(
        query="Mercury 6 John Glenn", 
        target_nasa_id="6221571", 
        local_filename="mercury_launch_telemetry.jpg"
    )
    download_nasa_asset(
        query="Friendship 7 Orbit", 
        target_nasa_id="6221568", 
        local_filename="mercury_orbit_telemetry.jpg"
    )

    # --- MISSION 2 (GEMINI 4 EVA) ---
    download_nasa_asset(
        query="S65-30433", 
        target_nasa_id="S65-30433", 
        local_filename="gemini4_eva_telemetry.jpg"
    )
    download_nasa_asset(
        query="S65-30429", 
        target_nasa_id="S65-30429", 
        local_filename="gemini4_metabolics.jpg"
    )

    # --- MISSION 3 (APOLLO 8) ---
    download_nasa_asset(
        query="Apollo 8 Mission Control", 
        target_nasa_id="S68-56003", 
        local_filename="apollo8_telemetry.jpg"
    )
    download_nasa_asset(
        query="AS08-14-2383", 
        target_nasa_id="AS08-14-2383", 
        local_filename="apollo8_earthrise.jpg"
    )

    # --- MISSION 4 (APOLLO 11) ---
    download_nasa_asset(
        query="S69-34875", 
        target_nasa_id="S69-34875", 
        local_filename="apollo_dsky_telemetry.jpg"
    )
    download_nasa_asset(
        query="AS11-40-5875", 
        target_nasa_id="AS11-40-5875", 
        local_filename="tranquility_coordinates.jpg"
    )

    # --- LEVEL 2 (GALE CRATER) ---
    download_nasa_asset(
        query="PIA16098", 
        target_nasa_id="PIA16098", 
        local_filename="hirise_gale_crater.jpg"
    )

    # --- MISSION 6 (MARS DESCENT & SURFACE) ---
    download_nasa_asset(
        query="Mars Gale Crater HiRISE", 
        target_nasa_id="PIA16105", 
        local_filename="hirise_gale_crater.jpg"
    )
    download_nasa_asset(
        query="Viking 1 Lander Chryse Planitia surface", 
        target_nasa_id="PIA00563", 
        local_filename="viking_chryse_telemetry.jpg"
    )

    print("=== NASA REAL DATA FETCH COMPLETE ===")