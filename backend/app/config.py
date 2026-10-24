import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR.parent / "data"
DEFAULT_DATASET = DATA_DIR / "shopping_trends.csv"

CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

APP_TITLE = "Retail Customer Behavior & Shopping Trends Analytics API"
APP_VERSION = "1.0.0"
APP_DESCRIPTION = (
    "Production-grade FastAPI analytics backend for retail customer behavior, "
    "shopping trends, data cleaning, interactive visualizations, and reporting."
)
