import os
from pathlib import Path

from dotenv import load_dotenv

ROOT_DIR = Path(__file__).resolve().parent.parent
load_dotenv(ROOT_DIR / ".env")

PG_HOST = os.getenv("PGHOST")
PG_DATABASE = os.getenv("PGDATABASE")
PG_USER = os.getenv("PGUSER")
PG_PASSWORD = os.getenv("PGPASSWORD")
PG_SSLMODE = os.getenv("PGSSLMODE", "require")

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY")
SBER_AUTHORIZATION = os.getenv("SBER_AUTHORIZATION")
WEB_APP_URL = os.getenv("WEB_APP_URL")
