from jira import JIRA


def fetch_jira_issues(server: str, email: str, token: str, project_key: str = None, only_my: bool = True,
                      max_results: int = 50):
    jira = JIRA(options={'server': server}, basic_auth=(email, token))
    conditions = []
    if project_key:
        conditions.append(f'project = "{project_key}"')
    if only_my:
        conditions.append('assignee = currentUser()')

    jql = " AND ".join(conditions) if conditions else ""
    if not jql:
        jql = "ORDER BY created ASC"
    else:
        jql += " ORDER BY created ASC"

    try:
        issues = jira.search_issues(jql, maxResults=max_results)
        result = []
        for issue in issues:
            result.append({
                "key": issue.key,
                "summary": issue.fields.summary,
                "status": issue.fields.status.name,
                "assignee": issue.fields.assignee.displayName if issue.fields.assignee else None,
                "created": issue.fields.created,
                "url": f"{server}/browse/{issue.key}"
            })
        return result
    except Exception as e:
        raise Exception(f"Ошибка Jira API: {str(e)}")