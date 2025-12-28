from fastapi import FastAPI, APIRouter, Query, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import httpx

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Radio Browser API base URLs (multiple servers for fallback)
RADIO_BROWSER_SERVERS = [
    "https://nl1.api.radio-browser.info/json",
    "https://at1.api.radio-browser.info/json",
    "https://de1.api.radio-browser.info/json"
]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Define Models
class Station(BaseModel):
    stationuuid: str
    name: str
    url: str
    url_resolved: str
    favicon: str = ""
    country: str = ""
    countrycode: str = ""
    state: str = ""
    language: str = ""
    tags: str = ""
    votes: int = 0
    codec: str = ""
    bitrate: int = 0

class StationList(BaseModel):
    stations: List[Station]
    count: int

class Genre(BaseModel):
    name: str
    stationcount: int

class Country(BaseModel):
    name: str
    stationcount: int
    iso_3166_1: str = ""

# Helper function to fetch from Radio Browser API
async def fetch_radio_api(endpoint: str, params: dict = None):
    async with httpx.AsyncClient() as client:
        try:
            headers = {"User-Agent": "RadioDirectoryApp/1.0"}
            response = await client.get(
                f"{RADIO_BROWSER_API}/{endpoint}",
                params=params,
                headers=headers,
                timeout=15.0
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            logging.error(f"Radio Browser API error: {e}")
            raise HTTPException(status_code=502, detail="Failed to fetch from Radio Browser API")

# Routes
@api_router.get("/")
async def root():
    return {"message": "Radio Directory API"}

@api_router.get("/stations/search")
async def search_stations(
    name: Optional[str] = Query(None, description="Search by station name"),
    tag: Optional[str] = Query(None, description="Search by tag/genre"),
    country: Optional[str] = Query(None, description="Search by country"),
    countrycode: Optional[str] = Query(None, description="Search by country code"),
    limit: int = Query(50, le=100),
    offset: int = Query(0)
):
    params = {
        "limit": limit,
        "offset": offset,
        "order": "votes",
        "reverse": "true",
        "hidebroken": "true"
    }
    if name:
        params["name"] = name
    if tag:
        params["tag"] = tag
    if country:
        params["country"] = country
    if countrycode:
        params["countrycode"] = countrycode
    
    stations = await fetch_radio_api("stations/search", params)
    return {"stations": stations, "count": len(stations)}

@api_router.get("/stations/topvote")
async def get_top_stations(limit: int = Query(50, le=100)):
    params = {"limit": limit, "hidebroken": "true"}
    stations = await fetch_radio_api("stations/topvote", params)
    return {"stations": stations, "count": len(stations)}

@api_router.get("/stations/topclick")
async def get_trending_stations(limit: int = Query(50, le=100)):
    params = {"limit": limit, "hidebroken": "true"}
    stations = await fetch_radio_api("stations/topclick", params)
    return {"stations": stations, "count": len(stations)}

@api_router.get("/stations/bytag/{tag}")
async def get_stations_by_tag(tag: str, limit: int = Query(50, le=100)):
    params = {"limit": limit, "order": "votes", "reverse": "true", "hidebroken": "true"}
    stations = await fetch_radio_api(f"stations/bytag/{tag}", params)
    return {"stations": stations, "count": len(stations)}

@api_router.get("/stations/bycountry/{country}")
async def get_stations_by_country(country: str, limit: int = Query(50, le=100)):
    params = {"limit": limit, "order": "votes", "reverse": "true", "hidebroken": "true"}
    stations = await fetch_radio_api(f"stations/bycountry/{country}", params)
    return {"stations": stations, "count": len(stations)}

@api_router.get("/stations/{stationuuid}")
async def get_station(stationuuid: str):
    stations = await fetch_radio_api(f"stations/byuuid/{stationuuid}")
    if not stations:
        raise HTTPException(status_code=404, detail="Station not found")
    return stations[0]

@api_router.get("/tags")
async def get_tags(limit: int = Query(50, le=200)):
    params = {"limit": limit, "order": "stationcount", "reverse": "true"}
    tags = await fetch_radio_api("tags", params)
    return {"tags": tags, "count": len(tags)}

@api_router.get("/countries")
async def get_countries(limit: int = Query(50, le=200)):
    params = {"limit": limit, "order": "stationcount", "reverse": "true"}
    countries = await fetch_radio_api("countries", params)
    return {"countries": countries, "count": len(countries)}

@api_router.post("/stations/{stationuuid}/click")
async def record_click(stationuuid: str):
    """Record a click/play event for analytics"""
    result = await fetch_radio_api(f"url/{stationuuid}")
    return {"ok": True, "url": result.get("url", "")}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
