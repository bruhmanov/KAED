import asyncio
from jira import JIRA, JIRAError

def _sync_validate_jira_config(server: str, email: str, token: str, 
                               project: str = None):
    try: 
        jira = JIRA(options={'server': server}, basic_auth=(email, token))

        jira.myself()

        if project:
            jira.project(project)

        return True, ''
    except JIRAError as e:
        if e.status_code == 401:
            return False, "Ошибка аутентификации: проверьте email и API-токен"
        elif e.status_code == 404:
            return False, "Ошибка: указанный сервер или проект не найден"
        else:
            return False, f"Ошибка подключения к Jira(код: {e.status_code}): {e.text}"
    except Exception as e:
        return False, f"Неожиданная ошибка: {e}"
    
async def validate_jira_config(server: str, email: str, token: str, project: str = None):
    return await asyncio.to_thread(_sync_validate_jira_config, server, email, token, project)