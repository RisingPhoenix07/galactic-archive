import os
import requests

OUTPUT_DIR = os.path.join("assets", "nasa_data")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Direct manifest using working search queries & static NASA/Wikimedia mirrors
ASSET_MANIFEST = [
    {
        "filename": "mercury_launch_telemetry.jpg",
        "url": "https://images-assets.nasa.gov/image/4422268/4422268~orig.jpg"
    },
    {
        "filename": "mercury_landingbag_telemetry.jpg",
        "url": "https://images-assets.nasa.gov/image/6201948/6201948~orig.jpg"
    },
    {
        "filename": "gemini4_eva_telemetry.jpg",
        "url": "https://images-assets.nasa.gov/image/S65-30433/S65-30433~orig.jpg"
    },
    {
        "filename": "gemini4_metabolics.jpg",
        "url": "https://images-assets.nasa.gov/image/S65-30429/S65-30429~orig.jpg"
    },
    {
        "filename": "gemini4_hatch_telemetry.jpg",
        "url": "https://images-assets.nasa.gov/image/S65-30431/S65-30431~orig.jpg"
    },
    {
        "filename": "apollo8_telemetry.jpg",
        "url": "https://images-assets.nasa.gov/image/S68-56020/S68-56020~orig.jpg"
    },
    {
        "filename": "apollo8_loi.jpg",
        "url": "https://images-assets.nasa.gov/image/as08-16-2593/as08-16-2593~orig.jpg"
    },
    {
        "filename": "apollo8_los.jpg",
        "url": "https://images-assets.nasa.gov/image/as08-12-2209/as08-12-2209~orig.jpg"
    },
    {
        "filename": "apollo8_earthrise.jpg",
        "url": "https://images-assets.nasa.gov/image/as08-14-2383/as08-14-2383~orig.jpg"
    },
    {
        "filename": "apollo_dsky_telemetry.jpg",
        "url": "https://images-assets.nasa.gov/image/S69-34875/S69-34875~orig.jpg"
    },
    {
        "filename": "west_crater_recon.jpg",
        "url": "https://images-assets.nasa.gov/image/AS11-40-5874/AS11-40-5874~orig.jpg"
    },
    {
        "filename": "tranquility_coordinates.jpg",
        "url": "https://images-assets.nasa.gov/image/AS11-40-5875/AS11-40-5875~orig.jpg"
    },
    {
        "filename": "orion_gateway_telemetry.jpg",
        "url": "https://images-assets.nasa.gov/image/art001m1080183/art001m1080183~orig.jpg"
    },
    {
        "filename": "orion_guidance_telemetry.jpg",
        "url": "https://images-assets.nasa.gov/image/art001m1080184/art001m1080184~orig.jpg"
    },
    {
        "filename": "hirise_gale_crater.jpg",
        "url": "https://images-assets.nasa.gov/image/PIA16098/PIA16098~orig.jpg"
    }
]

headers = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64)'}

def download_all():
    print("=== STARTING DIRECT NASA ASSET DOWNLOAD ===\n")
    for item in ASSET_MANIFEST:
        filename = item["filename"]
        url = item["url"]
        filepath = os.path.join(OUTPUT_DIR, filename)
        
        print(f"[FETCHING] {filename}...")
        try:
            res = requests.get(url, headers=headers, timeout=15)
            if res.status_code == 200:
                with open(filepath, "wb") as f:
                    f.write(res.content)
                print(f"  └─ SUCCESS: Saved {filename} ({len(res.content)} bytes)")
            else:
                print(f"  └─ HTTP ERROR {res.status_code}")
        except Exception as e:
            print(f"  └─ ERROR: {e}")

if __name__ == "__main__":
    download_all()
    print("\n=== NASA TELEMETRY SYNC COMPLETE ===")