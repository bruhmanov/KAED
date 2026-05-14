import { api } from './client'

import {
  getTelegramUser,
} from '../../app/telegram/telegram'

export interface TaskDto {
  id: string

  title: string

  completed: boolean

  priority:
    | 'low'
    | 'medium'
    | 'high'

  createdAt?: number

  jiraId?: string
}

function getTelegramId() {
  const user =
    getTelegramUser()

  if (!user?.id) {
    throw new Error(
      'Telegram user not found'
    )
  }

  return user.id
}

export async function getTasks() {
  const telegramId =
    getTelegramId()

  return api<TaskDto[]>(
    `/tasks?telegram_id=${telegramId}`
  )
}

export async function createTask(
  title: string
) {
  const telegramId =
    getTelegramId()

  return api<TaskDto>(
    '/tasks',
    {
      method: 'POST',

      body: JSON.stringify({
        telegram_id:
          telegramId,

        title,
      }),
    }
  )
}

export async function toggleTask(
  id: string
) {
  const telegramId =
    getTelegramId()

  return api<TaskDto>(
    `/tasks/${id}/toggle`,
    {
      method: 'PATCH',

      body: JSON.stringify({
        telegram_id:
          telegramId,
      }),
    }
  )
}

export async function deleteTask(
  id: string
) {
  const telegramId =
    getTelegramId()

  return api<void>(
    `/tasks/${id}`,
    {
      method: 'DELETE',

      body: JSON.stringify({
        telegram_id:
          telegramId,
      }),
    }
  )
}

export async function syncJira() {
  const telegramId =
    getTelegramId()

  return api<TaskDto[]>(
    '/jira/sync',
    {
      method: 'POST',

      body: JSON.stringify({
        telegram_id:
          telegramId,
      }),
    }
  )
}

export async function createVoiceTask(
  audio: Blob
) {
  const telegramId =
    getTelegramId()

  const formData =
    new FormData()

  formData.append(
    'audio',
    audio
  )

  formData.append(
    'telegram_id',
    String(telegramId)
  )

  const response = await fetch(
    `${process.env.API_URL}/voice/task`,
    {
      method: 'POST',

      body: formData,
    }
  )

  if (!response.ok) {
    throw new Error(
      'Voice recognition failed'
    )
  }

  return response.json()
}