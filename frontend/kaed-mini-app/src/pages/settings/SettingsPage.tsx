import {
  useEffect,
  useState,
} from 'react'

import Page from '../../shared/ui/Page'

import Card from '../../shared/ui/Card'

import {
  getTelegramUser,
  hapticImpact,
} from '../../app/telegram/telegram'

import {
  useAuthStore,
} from '../../app/store/authStore'

import { api } from '../../shared/api/client'

interface Profile {
  workspace: string

  jiraConnected: boolean

  voiceEnabled: boolean
}

export default function SettingsPage() {
  const user =
    getTelegramUser()

  const { logout } =
    useAuthStore()

  const [
    profile,
    setProfile,
  ] = useState<
    Profile | null
  >(null)

  const [
    loading,
    setLoading,
  ] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    try {
      setLoading(true)

      const data =
        await api<Profile>(
          '/profile'
        )

      setProfile(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    try {
      hapticImpact('medium')

      await api('/auth/logout', {
        method: 'POST',
      })

      logout()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Page title="Профиль">
      <div className="space-y-5">
        <Card className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-2xl font-bold">
            {user?.first_name?.[0] ||
              'K'}
          </div>

          <div>
            <div className="text-2xl font-bold">
              {user?.first_name ||
                'Пользователь KAED'}
            </div>

            <div className="text-muted">
              @
              {user?.username ||
                'telegram'}
            </div>
          </div>
        </Card>

        <Card>
          <div className="text-lg font-bold">
            Telegram ID
          </div>

          <div className="text-muted mt-2">
            {user?.id || '—'}
          </div>
        </Card>

        <Card>
          <div className="text-lg font-bold">
            Рабочее пространство
          </div>

          <div className="text-muted mt-2">
            {loading
              ? 'Загрузка...'
              : profile?.workspace ||
                'KAED Workspace'}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold">
                Jira
              </div>

              <div className="text-muted mt-2">
                {profile?.jiraConnected
                  ? 'Подключена'
                  : 'Не подключена'}
              </div>
            </div>

            <div
              className={`w-3 h-3 rounded-full ${
                profile?.jiraConnected
                  ? 'bg-green-500'
                  : 'bg-red-500'
              }`}
            />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold">
                Голосовой ввод
              </div>

              <div className="text-muted mt-2">
                {profile?.voiceEnabled
                  ? 'Sber Speech активен'
                  : 'Отключен'}
              </div>
            </div>

            <div
              className={`w-3 h-3 rounded-full ${
                profile?.voiceEnabled
                  ? 'bg-green-500'
                  : 'bg-red-500'
              }`}
            />
          </div>
        </Card>

        <button
          onClick={handleLogout}
          className="
            w-full
            h-14
            rounded-2xl
            bg-red-500
            font-semibold
          "
        >
          Выйти
        </button>
      </div>
    </Page>
  )
}