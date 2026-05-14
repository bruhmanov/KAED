import { api } from './client'

import {
  getTelegramInitData,
} from '../../app/telegram/telegram'

interface AuthResponse {
  id: number

  first_name: string

  username?: string

  accessToken?: string
}

export async function loginTelegram(): Promise<AuthResponse> {
  const initData =
    getTelegramInitData()

  return api<AuthResponse>(
    '/auth/telegram',
    {
      method: 'POST',

      body: JSON.stringify({
        initData,
      }),
    }
  )
}

export async function logout() {
  return api('/auth/logout', {
    method: 'POST',
  })
}