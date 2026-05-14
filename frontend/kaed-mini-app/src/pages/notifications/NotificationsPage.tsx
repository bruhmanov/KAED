import {
  useEffect,
  useState,
} from 'react'

import Page from '../../shared/ui/Page'

import Card from '../../shared/ui/Card'

import { api } from '../../shared/api/client'

interface Notification {
  id: string

  title: string

  message: string

  createdAt: string
}

export default function NotificationsPage() {
  const [
    notifications,
    setNotifications,
  ] = useState<
    Notification[]
  >([])

  const [
    loading,
    setLoading,
  ] = useState(false)

  const [
    error,
    setError,
  ] = useState<
    string | null
  >(null)

  useEffect(() => {
    fetchNotifications()
  }, [])

  async function fetchNotifications() {
    try {
      setLoading(true)

      setError(null)

      const data =
        await api<
          Notification[]
        >('/notifications')

      setNotifications(data)
    } catch (error) {
      console.error(error)

      setError(
        'Не удалось загрузить уведомления'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Page title="Notifications">
      <div className="space-y-4">
        {loading && (
          <Card>
            Загрузка уведомлений...
          </Card>
        )}

        {error && (
          <Card>
            {error}
          </Card>
        )}

        {!loading &&
          notifications.length ===
            0 && (
            <Card>
              Нет уведомлений
            </Card>
          )}

        {notifications.map(
          (
            notification
          ) => (
            <Card
              key={
                notification.id
              }
            >
              <div className="text-lg font-bold">
                {
                  notification.title
                }
              </div>

              <div className="text-muted mt-2">
                {
                  notification.message
                }
              </div>

              <div className="text-muted text-sm mt-4">
                {new Date(
                  notification.createdAt
                ).toLocaleString(
                  'ru-RU'
                )}
              </div>
            </Card>
          )
        )}
      </div>
    </Page>
  )
}