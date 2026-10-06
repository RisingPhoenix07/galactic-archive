import os
import requests

# Set target directory for real NASA telemetry and image data
OUTPUT_DIR = os.path.join("assets", "nasa_data")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# NASA Image & Video Library API endpoint
NASA_API_URL = "https://images-api.nasa.gov/search"

def download_nasa_asset(query: str, target_nasa_id: str, local_filename: str):
    """
    Searches NASA's public media library for historical telemetry images
    and downloads the primary asset to assets/nasa_data/.
    """
    params = {
        "q": query,
        "media_type": "image"
    }
    
    print(f"[NASA API] Searching for query: '{query}'...")
    try:
        response = requests.get(NASA_API_URL, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        items = data.get("collection", {}).get("items", [])
        selected_url = None
        
        # Check for specific NASA Asset ID or fallback to top search result
        for item in items:
            item_data = item.get("data", [{}])[0]
            nasa_id = item_data.get("nasa_id", "")
            if target_nasa_id and target_nasa_id in nasa_id:
                selected_url = item.get("links", [{}])[0].get("href")
                break
        
        if not selected_url and items:
            selected_url = items[0].get("links", [{}])[0].get("href")
            
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

    # 1. Apollo 11 DSKY Telemetry & 1202 Alarm Data (DP1)
    download_nasa_asset(
        query="Apollo 11 DSKY Computer Display", 
        target_nasa_id="S69-34875", 
        local_filename="apollo_dsky_telemetry.jpg"
    )

    # 2. West Crater Reconnaissance & Landing Footprint Map (DP2)
    download_nasa_asset(
        query="Apollo 11 Landing Site West Crater Reconnaissance", 
        target_nasa_id="AS11-40-5874", 
        local_filename="west_crater_recon.jpg"
    )

    # 3. Tranquility Base Coordinates Photo (Path 1 Success)
    download_nasa_asset(
        query="Apollo 11 Lunar Surface Tranquility Base", 
        target_nasa_id="AS11-40-5875", 
        local_filename="tranquility_coordinates.jpg"
    )

    # 4. Curiosity Rover Gale Crater Satellite Map (Level 2)
    download_nasa_asset(
        query="Gale Crater HiRISE Target Map", 
        target_nasa_id="PIA16098", 
        local_filename="hirise_gale_crater.jpg"
    )

    print("=== NASA REAL DATA FETCH COMPLETE ===")