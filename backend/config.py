import os
from dotenv import load_dotenv

load_dotenv()

PG_HOST = os.getenv("PGHOST")
PG_DATABASE = os.getenv("PGDATABASE")
PG_USER = os.getenv("PGUSER")
PG_PASSWORD = os.getenv("PGPASSWORD")
PG_SSLMODE = os.getenv("PGSSLMODE", "require")

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")