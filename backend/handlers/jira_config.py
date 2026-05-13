from aiogram import Router, types
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from backend.db import get_user_by_telegram_id, add_jira_config, list_jira_configs

router = Router()

class JiraConfigForm(StatesGroup):
    name = State()
    server = State()
    email = State()
    token = State()
    project = State()

@router.message(Command("add_jira"))
async def cmd_add_jira(message: types.Message, state: FSMContext):
    await state.set_state(JiraConfigForm.name)
    await message.answer("✏️ Введите название конфигурации:")

@router.message(JiraConfigForm.name)
async def process_name(message: types.Message, state: FSMContext):
    await state.update_data(name=message.text.strip())
    await state.set_state(JiraConfigForm.server)
    await message.answer("🌐 Введите Jira Server URL (например https://your-domain.atlassian.net):")

@router.message(JiraConfigForm.server)
async def process_server(message: types.Message, state: FSMContext):
    await state.update_data(server=message.text.strip())
    await state.set_state(JiraConfigForm.email)
    await message.answer("📧 Введите email для Jira API:")

@router.message(JiraConfigForm.email)
async def process_email(message: types.Message, state: FSMContext):
    await state.update_data(email=message.text.strip())
    await state.set_state(JiraConfigForm.token)
    await message.answer("🔑 Введите API-токен Jira:")

@router.message(JiraConfigForm.token)
async def process_token(message: types.Message, state: FSMContext):
    await state.update_data(token=message.text.strip())
    await state.set_state(JiraConfigForm.project)
    await message.answer("📁 Введите ключ проекта:")

@router.message(JiraConfigForm.project)
async def process_project(message: types.Message, state: FSMContext):
    project = message.text.strip()
    if project == "-":
        project = None
    await state.update_data(project_key=project)
    data = await state.get_data()

    user = await get_user_by_telegram_id(message.from_user.id)
    if not user:
        await message.answer("Ошибка: сначала выполните /start")
        await state.clear()
        return

    await add_jira_config(
        user_id=user["id"],
        name=data["name"],
        jira_server=data["server"],
        jira_email=data["email"],
        jira_api_token=data["token"],
        project_key=data["project_key"]
    )
    await message.answer(
        f"✅ Конфигурация «{data['name']}» сохранена!\n"
        f"Сервер: {data['server']}\n"
        f"Проект: {data['project_key'] or 'все задачи'}"
    )
    await state.clear()

@router.message(Command("my_configs"))
async def cmd_my_configs(message: types.Message):
    user = await get_user_by_telegram_id(message.from_user.id)
    if not user:
        await message.answer("Сначала выполните /start")
        return
    configs = await list_jira_configs(user["id"])
    if not configs:
        await message.answer("Нет конфигураций. Добавьте через /add_jira")
        return
    text = "📋 Ваши Jira-подключения:\n\n"
    for cfg in configs:
        text += f"🔹 *{cfg['name']}*\n   Сервер: {cfg['jira_server']}\n   Проект: {cfg['project_key'] or 'все'}\n   Активно: {'✅' if cfg['is_active'] else '❌'}\n\n"
    await message.answer(text, parse_mode="Markdown")