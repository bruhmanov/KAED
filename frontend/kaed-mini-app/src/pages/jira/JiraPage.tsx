import { useState } from 'react'

import Page from '../../shared/ui/Page'

import Card from '../../shared/ui/Card'

import {
  useTaskStore,
} from '../../entities/task/taskStore'

import {
  hapticImpact,
} from '../../app/telegram/telegram'

export default function JiraPage() {
  const {
    syncWithJira,
  } = useTaskStore()

  const [
    syncing,
    setSyncing,
  ] = useState(false)

  const [
    lastSync,
    setLastSync,
  ] = useState<string | null>(
    null
  )

  async function handleSync() {
    try {
      setSyncing(true)

      hapticImpact('medium')

      await syncWithJira()

      setLastSync(
        new Date().toLocaleTimeString(
          'ru-RU'
        )
      )
    } catch (error) {
      console.error(error)
    } finally {
      setSyncing(false)
    }
  }

  return (
    <Page title="Jira">
      <div className="space-y-5">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl font-bold">
                Статус подключения
              </div>

              <div className="text-muted mt-2">
                Jira подключена
              </div>
            </div>

            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
        </Card>

        <Card>
          <div className="text-xl font-bold">
            Рабочее пространство
          </div>

          <div className="text-muted mt-2">
            kaed-workspace.atlassian.net
          </div>
        </Card>

        <Card>
          <div className="text-xl font-bold">
            Последняя синхронизация
          </div>

          <div className="text-muted mt-2">
            {lastSync ||
              'Еще не синхронизировано'}
          </div>
        </Card>

        <button
          onClick={handleSync}
          disabled={syncing}
          className="
            w-full
            h-14
            bg-primary
            rounded-2xl
            font-semibold
            disabled:opacity-50
          "
        >
          {syncing
            ? 'Синхронизация...'
            : 'Синхронизировать'}
        </button>
      </div>
    </Page>
  )
}