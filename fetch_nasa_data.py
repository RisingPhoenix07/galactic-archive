import os
import requests

# Set target directory for real NASA telemetry and image data
OUTPUT_DIR = os.path.join("assets", "nasa_data")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# NASA Image & Video Library API endpoint
NASA_API_URL = "https://images-api.nasa.gov/search"

def download_nasa_asset(query: str, target_nasa_id: str, local_filename: str):
    """
    Searches NASA's public media library using concise keywords / NASA IDs
    and downloads the primary asset to assets/nasa_data/.
    """
    params = {
        "q": query,
        "media_type": "image"
    }
    
    print(f"[NASA API] Searching for: '{query}' (Target ID: {target_nasa_id})...")
    try:
        response = requests.get(NASA_API_URL, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        items = data.get("collection", {}).get("items", [])
        selected_url = None
        
        # Check for specific NASA Asset ID match
        for item in items:
            item_data = item.get("data", [{}])[0]
            nasa_id = item_data.get("nasa_id", "")
            if target_nasa_id and target_nasa_id.lower() in nasa_id.lower():
                links = item.get("links", [])
                if links:
                    selected_url = links[0].get("href")
                break
        
        # Fallback to first search result if exact ID isn't matched
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
            print(f"[WARNING] No asset found for query: '{query}'\n")

    except Exception as e:
        print(f"[ERROR] Failed to fetch data for {query}: {e}\n")

if __name__ == "__main__":
    print("=== STARTING NASA REAL DATA ASSET FETCH ===\n")

    # --- MISSION 3 (APOLLO 8) ASSETS ---
    # 1. Apollo 8 Mission Control Telemetry Log
    download_nasa_asset(
        query="Apollo 8 Mission Control", 
        target_nasa_id="S68-56003", 
        local_filename="apollo8_telemetry.jpg"
    )

    # 2. Apollo 8 Farside Target Area Mapping
    download_nasa_asset(
        query="AS08-12-2209", 
        target_nasa_id="AS08-12-2209", 
        local_filename="apollo8_los.jpg"
    )

    # 3. Apollo 8 Earthrise Historical Photo
    download_nasa_asset(
        query="AS08-14-2383", 
        target_nasa_id="AS08-14-2383", 
        local_filename="apollo8_earthrise.jpg"
    )

    # --- MISSION 4 (APOLLO 11) ASSETS ---
    # 4. Apollo 11 DSKY Telemetry
    download_nasa_asset(
        query="S69-34875", 
        target_nasa_id="S69-34875", 
        local_filename="apollo_dsky_telemetry.jpg"
    )

    # 5. West Crater Reconnaissance & Landing Footprint Map
    download_nasa_asset(
        query="AS11-40-5874", 
        target_nasa_id="AS11-40-5874", 
        local_filename="west_crater_recon.jpg"
    )

    # 6. Tranquility Base Coordinates Photo
    download_nasa_asset(
        query="AS11-40-5875", 
        target_nasa_id="AS11-40-5875", 
        local_filename="tranquility_coordinates.jpg"
    )

    # --- LEVEL 2 (GALE CRATER) ASSETS ---
    # 7. Curiosity Rover Gale Crater Satellite Map
    download_nasa_asset(
        query="PIA16098", 
        target_nasa_id="PIA16098", 
        local_filename="hirise_gale_crater.jpg"
    )
    # --- MISSION 2 (GEMINI 4) ASSETS ---
    # 1. Gemini 4 Spacewalk Ed White Telemetry Image
    download_nasa_asset(
        query="S65-30433", 
        target_nasa_id="S65-30433", 
        local_filename="gemini4_eva_telemetry.jpg"
    )

    # 2. Gemini 4 Metabolics
    download_nasa_asset(
        query="S65-30429", 
        target_nasa_id="S65-30429", 
        local_filename="gemini4_metabolics.jpg"
    )

    # 3. Gemini 4 Hatch Telemetry
    download_nasa_asset(
        query="S65-30431", 
        target_nasa_id="S65-30431", 
        local_filename="gemini4_hatch_telemetry.jpg"
    )

    print("=== NASA REAL DATA FETCH COMPLETE ===")