from aiogram import Router, types
from aiogram.filters import Command
from backend.db import create_user

router = Router()

@router.message(Command("start"))
async def cmd_start(message: types.Message):
    await create_user(
        telegram_id=message.from_user.id,
        username=message.from_user.username,
        first_name=message.from_user.first_name,
        last_name=message.from_user.last_name
    )
    await message.answer(
        "👋 Привет! Я бот для работы с Jira.\n\n"
        "Доступные команды:\n"
        "/add_jira – добавить новую Jira-конфигурацию\n"
        "/my_configs – посмотреть мои конфигурации\n"
        "/my_tasks – получить задачи Jira\n"
        "/help – справка"
    )

@router.message(Command("help"))
async def cmd_help(message: types.Message):
    await message.answer(
        "/add_jira – пошаговое создание Jira-подключения (сервер, email, токен, проект)\n"
        "/my_configs – список ваших конфигураций\n"
        "/my_tasks – выгрузить задачи для всех активных конфигураций\n"
    )