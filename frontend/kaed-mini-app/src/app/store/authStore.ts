import { create } from 'zustand'

import {
  getTelegramUser,
} from '../telegram/telegram'

import {
  loginTelegram,
} from '../../shared/api/auth'

interface User {
  id: number

  first_name: string

  username?: string
}

interface AuthStore {
  user: User | null

  loading: boolean

  setUser: (
    user: User | null
  ) => void

  logout: () => void

  initAuth: () => Promise<void>
}

export const useAuthStore =
  create<AuthStore>((set) => ({
    user: null,

    loading: false,

    setUser: (user) =>
      set({
        user,
      }),

    logout: () =>
      set({
        user: null,
      }),

    initAuth: async () => {
      try {
        set({
          loading: true,
        })

        const telegramUser =
          getTelegramUser()

        if (!telegramUser) {
          set({
            user: null,
            loading: false,
          })

          return
        }

        const user =
          await loginTelegram()

        set({
          user,
          loading: false,
        })
      } catch (error) {
        console.error(error)

        set({
          user: null,
          loading: false,
        })
      }
    },
  }))