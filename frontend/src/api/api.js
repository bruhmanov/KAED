const API_BASE_URL = window.__KAED_API_URL__ || process.env.KAED_API_URL || ''

const DEMO_USER = {
  id: 10001,
  first_name: 'Эвелина',
  username: 'kaed_demo',
  last_name: '',
}

function getTelegramWebApp() {
  return window.Telegram?.WebApp || null
}

export function initTelegramShell() {
  const tg = getTelegramWebApp()

  if (!tg) return

  tg.ready()
  tg.expand()
  tg.setHeaderColor?.('#05080d')
  tg.setBackgroundColor?.('#05080d')
}

export function getTelegramPayload() {
  const tg = getTelegramWebApp()
  const tgUser = tg?.initDataUnsafe?.user

  return {
    initData: tg?.initData || '',
    user: tgUser
      ? {
          id: tgUser.id,
          first_name: tgUser.first_name,
          username: tgUser.username,
          last_name: tgUser.last_name,
        }
      : DEMO_USER,
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.headers || {}),
    },
  })

  const raw = response.status === 204 ? '' : await response.text()
  let data = null

  if (raw) {
    try {
      data = JSON.parse(raw)
    } catch {
      data = null
    }
  }

  if (!response.ok) {
    throw new Error(data?.detail || data?.message || raw || `Ошибка ${response.status}`)
  }

  return data
}

export async function loginTelegram() {
  const payload = getTelegramPayload()
  return request('/auth/telegram', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function getTasks(telegramId) {
  return request(`/tasks?telegram_id=${encodeURIComponent(telegramId)}`)
}

export async function createTask({ telegramId, title, priority }) {
  return request('/tasks', {
    method: 'POST',
    body: JSON.stringify({ telegram_id: telegramId, title, priority }),
  })
}

export async function toggleTask({ telegramId, taskId }) {
  return request(`/tasks/${encodeURIComponent(taskId)}/toggle`, {
    method: 'PATCH',
    body: JSON.stringify({ telegram_id: telegramId }),
  })
}

export async function deleteTask({ telegramId, taskId }) {
  return request(`/tasks/${encodeURIComponent(taskId)}`, {
    method: 'DELETE',
    body: JSON.stringify({ telegram_id: telegramId }),
  })
}

export async function syncJira(telegramId) {
  return request('/jira/sync', {
    method: 'POST',
    body: JSON.stringify({ telegram_id: telegramId }),
  })
}

export async function uploadVoiceTask({ telegramId, audioBlob }) {
  const formData = new FormData()
  const extension = audioBlob.type.includes('ogg') ? 'ogg' : 'webm'
  formData.append('telegram_id', String(telegramId))
  formData.append('audio', audioBlob, `kaed-voice-report.${extension}`)

  return request('/voice/task', {
    method: 'POST',
    body: formData,
  })
}
