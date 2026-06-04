import asyncio
from contextlib import asynccontextmanager
from datetime import datetime

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.config import SBER_AUTHORIZATION
from backend.db import (
    close_db_pool,
    create_task_for_telegram,
    create_user,
    delete_task_for_telegram,
    get_active_jira_configs_with_decrypted_tokens,
    get_user_by_telegram_id,
    init_db,
    list_tasks_for_telegram,
    toggle_task_for_telegram,
)
from backend.jira_client import fetch_jira_issues
from backend.sber_speech import SberSpeechRecognizer

DB_READY = False
DB_ERROR = ""
MEMORY_TASKS = []
MEMORY_USERS = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    global DB_ERROR, DB_READY
    try:
        await init_db()
        DB_READY = True
        DB_ERROR = ""
    except Exception as error:
        DB_READY = False
        DB_ERROR = str(error)
        print(f"KAED API started without PostgreSQL: {DB_ERROR}")

    yield

    if DB_READY:
        await close_db_pool()


app = FastAPI(title="KAED API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TelegramUser(BaseModel):
    id: int
    first_name: str | None = None
    username: str | None = None
    last_name: str | None = None


class TelegramAuthPayload(BaseModel):
    initData: str = ""
    user: TelegramUser


class TaskCreatePayload(BaseModel):
    telegram_id: int
    title: str
    priority: str = "medium"


class TelegramIdPayload(BaseModel):
    telegram_id: int


@app.get("/health")
async def health():
    data = {
        "status": "ok",
        "service": "kaed-api",
        "storage": "postgres" if DB_READY else "memory",
    }
    if DB_ERROR:
        data["storage_error"] = DB_ERROR
    return data


@app.get("/")
async def root():
    return await health()


@app.post("/auth/telegram")
async def auth_telegram(payload: TelegramAuthPayload):
    if not DB_READY:
        MEMORY_USERS[payload.user.id] = payload.user
        return {
            "id": payload.user.id,
            "first_name": payload.user.first_name or "Пользователь",
            "username": payload.user.username,
            "last_name": payload.user.last_name,
        }

    user = await create_user(
        telegram_id=payload.user.id,
        username=payload.user.username,
        first_name=payload.user.first_name,
        last_name=payload.user.last_name,
    )

    return {
        "id": user["telegram_id"],
        "first_name": user["first_name"] or "Пользователь",
        "username": user["username"],
        "last_name": user["last_name"],
    }


@app.get("/tasks")
async def get_tasks(telegram_id: int):
    if not DB_READY:
        return _memory_tasks_for_telegram(telegram_id)

    return await list_tasks_for_telegram(telegram_id)


@app.post("/tasks")
async def create_task(payload: TaskCreatePayload):
    title = payload.title.strip()
    if not title:
        raise HTTPException(status_code=400, detail="Название задачи не может быть пустым")

    if not DB_READY:
        return _create_memory_task(payload.telegram_id, title, payload.priority)

    return await create_task_for_telegram(
        telegram_id=payload.telegram_id,
        title=title,
        priority=payload.priority,
    )


@app.patch("/tasks/{task_id}/toggle")
async def toggle_task(task_id: int, payload: TelegramIdPayload):
    if not DB_READY:
        task = _find_memory_task(payload.telegram_id, str(task_id))
        if not task:
            raise HTTPException(status_code=404, detail="Задача не найдена")
        task["completed"] = not task["completed"]
        task["updated_at"] = datetime.utcnow().isoformat()
        return task

    task = await toggle_task_for_telegram(payload.telegram_id, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Задача не найдена")
    return task


@app.delete("/tasks/{task_id}")
async def delete_task(task_id: int, payload: TelegramIdPayload):
    if not DB_READY:
        task = _find_memory_task(payload.telegram_id, str(task_id))
        if not task:
            raise HTTPException(status_code=404, detail="Задача не найдена")
        MEMORY_TASKS.remove(task)
        return {"ok": True}

    deleted = await delete_task_for_telegram(payload.telegram_id, task_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Задача не найдена")
    return {"ok": True}


@app.post("/jira/sync")
async def sync_jira(payload: TelegramIdPayload):
    if not DB_READY:
        return _memory_tasks_for_telegram(payload.telegram_id)

    user = await get_user_by_telegram_id(payload.telegram_id)
    if not user:
        await create_user(telegram_id=payload.telegram_id)
        return []

    configs = await get_active_jira_configs_with_decrypted_tokens(user["id"])

    for config in configs:
        issues = await asyncio.to_thread(
            fetch_jira_issues,
            server=config["jira_server"],
            email=config["jira_email"],
            token=config["jira_api_token"],
            project_key=config["project_key"],
            only_my=True,
            max_results=20,
        )

        for issue in issues:
            await create_task_for_telegram(
                telegram_id=payload.telegram_id,
                title=issue["summary"],
                priority=_priority_from_jira_status(issue.get("status")),
                jira_id=issue["key"],
            )

    return await list_tasks_for_telegram(payload.telegram_id)


@app.post("/voice/task")
async def voice_task(
    telegram_id: int = Form(...),
    audio: UploadFile = File(...),
):
    audio_bytes = await audio.read()
    if not audio_bytes:
        raise HTTPException(status_code=400, detail="Аудиофайл пустой")

    recognizer = SberSpeechRecognizer(SBER_AUTHORIZATION)
    result = await asyncio.to_thread(
        recognizer.recognize,
        audio_bytes,
        audio.content_type or "audio/ogg;codecs=opus",
    )

    text = result.text.strip() if result.success else ""
    if not text:
        text = "Голосовой отчёт без распознанного текста"

    task = await create_task_for_telegram(
        telegram_id=telegram_id,
        title=text,
        priority="medium",
    ) if DB_READY else _create_memory_task(telegram_id, text, "medium")

    response = {"text": text, "task": task}
    if result.error:
        response["warning"] = result.error
    return response


def _priority_from_jira_status(status: str | None) -> str:
    normalized = (status or "").lower()
    if any(word in normalized for word in ["block", "blocked", "блок"]):
        return "high"
    if any(word in normalized for word in ["done", "closed", "готов", "закры"]):
        return "low"
    return "medium"


def _memory_tasks_for_telegram(telegram_id: int):
    return [
        task for task in MEMORY_TASKS
        if task["telegram_id"] == telegram_id
    ]


def _create_memory_task(telegram_id: int, title: str, priority: str = "medium", jira_id: str | None = None):
    now = datetime.utcnow().isoformat()
    task = {
        "id": str(len(MEMORY_TASKS) + 1),
        "telegram_id": telegram_id,
        "title": title,
        "completed": False,
        "priority": priority,
        "jira_id": jira_id,
        "created_at": now,
        "updated_at": now,
    }
    MEMORY_TASKS.insert(0, task)
    return task


def _find_memory_task(telegram_id: int, task_id: str):
    return next(
        (
            task for task in MEMORY_TASKS
            if task["telegram_id"] == telegram_id and task["id"] == task_id
        ),
        None,
    )
