import {
  useEffect,
  useState,
} from 'react'

import Page from '../../shared/ui/Page'

import TaskCard from '../../widgets/task-card/TaskCard'

import Card from '../../shared/ui/Card'

import FloatingButton from '../../widgets/floating-button/FloatingButton'

import CreateTaskModal from '../../features/create-task/CreateTaskModal'

import TaskSkeleton from '../../widgets/task-card/TaskSkeleton'

import {
  useTaskStore,
} from '../../entities/task/taskStore'

import {
  hapticImpact,
} from '../../app/telegram/telegram'

type Filter =
  | 'all'
  | 'active'
  | 'completed'

export default function TasksPage() {
  const {
    tasks,
    loading,
    fetchTasks,
    toggleTask,
    deleteTask,
  } = useTaskStore()

  const [open, setOpen] =
    useState(false)

  const [search, setSearch] =
    useState('')

  const [filter, setFilter] =
    useState<Filter>('all')

  useEffect(() => {
    fetchTasks()
  }, [])

  const filteredTasks =
    tasks.filter((task) => {
      const matchesSearch =
        task.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )

      if (!matchesSearch) {
        return false
      }

      if (filter === 'active') {
        return !task.completed
      }

      if (
        filter === 'completed'
      ) {
        return task.completed
      }

      return true
    })

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
    <Page title="Задачи">
      <div className="space-y-5">
        <input
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          placeholder="Поиск задач..."
          className="
            w-full
            h-14
            rounded-2xl
            bg-card
            border
            border-border
            px-4
            outline-none
          "
        />

        <div className="flex gap-3 overflow-x-auto">
          {[
            {
              key: 'all',
              label: 'Все',
            },
            {
              key: 'active',
              label: 'Активные',
            },
            {
              key: 'completed',
              label:
                'Завершенные',
            },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => {
                hapticImpact(
                  'light'
                )

                setFilter(
                  item.key as Filter
                )
              }}
              className={`
                px-5
                h-11
                rounded-2xl
                whitespace-nowrap
                transition
                ${
                  filter ===
                  item.key
                    ? 'bg-primary text-white'
                    : 'bg-card border border-border'
                }
              `}
            >
              {item.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="space-y-4">
            <TaskSkeleton />
            <TaskSkeleton />
            <TaskSkeleton />
          </div>
        )}

        {!loading &&
          filteredTasks.length ===
            0 && (
            <Card className="py-14 text-center">
              <div className="text-2xl font-bold">
                Нет задач
              </div>

              <div className="text-muted mt-3">
                Создайте первую
                задачу
              </div>
            </Card>
          )}

        <div className="space-y-4">
          {filteredTasks.map(
            (task) => (
              <TaskCard
                key={task.id}
                title={
                  task.title
                }
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
            )
          )}
        </div>
      </div>

      <FloatingButton
        onClick={() => {
          hapticImpact(
            'medium'
          )

          setOpen(true)
        }}
      />

      <CreateTaskModal
        open={open}
        onClose={() =>
          setOpen(false)
        }
      />
    </Page>
  )
}