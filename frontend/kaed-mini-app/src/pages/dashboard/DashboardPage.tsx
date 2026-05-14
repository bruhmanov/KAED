import {
  useEffect,
} from 'react'

import Page from '../../shared/ui/Page'

import TaskCard from '../../widgets/task-card/TaskCard'

import Card from '../../shared/ui/Card'

import {
  useTaskStore,
} from '../../entities/task/taskStore'

import {
  getTelegramUser,
  hapticImpact,
} from '../../app/telegram/telegram'

export default function DashboardPage() {
  const {
    tasks,
    fetchTasks,
    toggleTask,
    deleteTask,
    loading,
    error,
  } = useTaskStore()

  useEffect(() => {
    fetchTasks()
  }, [])

  const completed = tasks.filter(
    (t) => t.completed
  )

  const active = tasks.filter(
    (t) => !t.completed
  )

  const user =
    getTelegramUser()

  async function handleToggle(
    id: string
  ) {
    try {
      hapticImpact('light')

      await toggleTask(id)
    } catch (error) {
      console.error(error)
    }
  }

  async function handleDelete(
    id: string
  ) {
    try {
      hapticImpact('medium')

      await deleteTask(id)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Page title="Главная">
      <div className="space-y-6">
        <Card className="relative overflow-hidden">
          <div className="absolute w-40 h-40 rounded-full bg-primary/20 blur-3xl -top-10 -right-10" />

          <div className="relative z-10">
            <div className="text-muted text-sm">
              С возвращением
            </div>

            <div className="text-3xl font-bold mt-2">
              {user?.first_name ||
                'Пользователь KAED'}
            </div>

            <div className="text-muted mt-3">
              Все синхронизировано
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <div className="text-muted text-sm">
              Активные
            </div>

            <div className="text-4xl font-bold mt-3">
              {active.length}
            </div>
          </Card>

          <Card>
            <div className="text-muted text-sm">
              Завершенные
            </div>

            <div className="text-4xl font-bold mt-3">
              {completed.length}
            </div>
          </Card>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">
            Последние задачи
          </div>

          <div className="text-primary text-sm">
            Все задачи
          </div>
        </div>

        {loading && (
          <Card>
            Загрузка задач...
          </Card>
        )}

        {error && (
          <Card>
            {error}
          </Card>
        )}

        {!loading &&
          tasks.length === 0 && (
            <Card>
              Нет задач
            </Card>
          )}

        <div className="space-y-4">
          {tasks
            .slice(0, 5)
            .map((task) => (
              <TaskCard
                key={task.id}
                title={task.title}
                completed={
                  task.completed
                }
                priority={
                  task.priority
                }
                onToggle={() =>
                  handleToggle(
                    task.id
                  )
                }
                onDelete={() =>
                  handleDelete(
                    task.id
                  )
                }
              />
            ))}
        </div>
      </div>
    </Page>
  )
}