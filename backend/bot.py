import asyncio
import logging
from aiogram import Bot, Dispatcher
from aiogram.fsm.storage.memory import MemoryStorage
from backend.config import TELEGRAM_BOT_TOKEN
from backend.db import init_db
from backend.handlers import common, jira_config, tasks

logging.basicConfig(level=logging.INFO)

bot = Bot(token=TELEGRAM_BOT_TOKEN)
dp = Dispatcher(storage=MemoryStorage())

dp.include_router(common.router)
dp.include_router(jira_config.router)
dp.include_router(tasks.router)

async def main():
    await init_db()
    print("🤖 Бот запущен. Нажмите Ctrl+C для остановки.")
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())