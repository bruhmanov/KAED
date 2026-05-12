import asyncpg
from backend.config import PG_HOST, PG_DATABASE, PG_USER, PG_PASSWORD, PG_SSLMODE

_pool = None

async def init_db():
    global _pool
    _pool = await asyncpg.create_pool(
        host=PG_HOST,
        database=PG_DATABASE,
        user=PG_USER,
        password=PG_PASSWORD,
        ssl=PG_SSLMODE,
        command_timeout=60
    )
    async with _pool.acquire() as conn:
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                telegram_id BIGINT UNIQUE NOT NULL,
                username TEXT,
                first_name TEXT,
                last_name TEXT,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        """)
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS jira_configs (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                name TEXT NOT NULL,
                jira_server TEXT NOT NULL,
                jira_email TEXT NOT NULL,
                jira_api_token TEXT NOT NULL,
                project_key TEXT,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT NOW()
            );
        """)
    return _pool

async def close_db_pool():
    global _pool
    if _pool:
        await _pool.close()
        _pool = None

async def get_user_by_telegram_id(telegram_id: int):
    async with _pool.acquire() as conn:
        return await conn.fetchrow("SELECT * FROM users WHERE telegram_id = $1", telegram_id)

async def create_user(telegram_id: int, username: str = None, first_name: str = None, last_name: str = None):
    async with _pool.acquire() as conn:
        return await conn.fetchrow("""
            INSERT INTO users (telegram_id, username, first_name, last_name)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (telegram_id) DO UPDATE
            SET username = EXCLUDED.username,
                first_name = EXCLUDED.first_name,
                last_name = EXCLUDED.last_name,
                updated_at = NOW()
            RETURNING *
        """, telegram_id, username, first_name, last_name)

async def add_jira_config(user_id: int, name: str, jira_server: str, jira_email: str, jira_api_token: str, project_key: str = None):
    async with _pool.acquire() as conn:
        return await conn.fetchrow("""
            INSERT INTO jira_configs (user_id, name, jira_server, jira_email, jira_api_token, project_key)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        """, user_id, name, jira_server, jira_email, jira_api_token, project_key)

async def list_jira_configs(user_id: int, only_active: bool = True):
    async with _pool.acquire() as conn:
        query = "SELECT * FROM jira_configs WHERE user_id = $1"
        if only_active:
            query += " AND is_active = TRUE"
        query += " ORDER BY created_at DESC"
        return await conn.fetch(query, user_id)

async def get_jira_config(config_id: int, user_id: int):
    async with _pool.acquire() as conn:
        return await conn.fetchrow("SELECT * FROM jira_configs WHERE id = $1 AND user_id = $2", config_id, user_id)