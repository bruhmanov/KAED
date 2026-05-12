from aiogram import Router, types
from aiogram.filters import Command
from backend.db import get_user_by_telegram_id, list_jira_configs
from backend.jira_client import fetch_jira_issues

router = Router()

@router.message(Command("my_tasks"))
async def cmd_my_tasks(message: types.Message):
    user = await get_user_by_telegram_id(message.from_user.id)
    if not user:
        await message.answer("Сначала выполните /start")
        return

    configs = await list_jira_configs(user["id"], only_active=True)
    if not configs:
        await message.answer("У вас нет активных Jira-конфигураций. Добавьте через /add_jira")
        return

    await message.answer("🔍 Получаю ваши задачи...")

    for cfg in configs:
        try:
            issues = fetch_jira_issues(
                server=cfg["jira_server"],
                email=cfg["jira_email"],
                token=cfg["jira_api_token"],
                project_key=cfg["project_key"],
                only_my=True,
                max_results=20
            )
            if issues:
                header = f"📌 *{cfg['name']}* (проект {cfg['project_key'] or 'все проекты'})\n"
                tasks_text = "\n".join(
                    f"• [{i['key']}]({i['url']}) — {i['summary'][:80]} ({i['status']})"
                    for i in issues
                )
                await message.answer(header + tasks_text, parse_mode="Markdown", disable_web_page_preview=True)
            else:
                await message.answer(f"📭 *{cfg['name']}* — нет задач, назначенных на вас.", parse_mode="Markdown")
        except Exception as e:
            await message.answer(f"❌ *{cfg['name']}*: ошибка — {str(e)}", parse_mode="Markdown")