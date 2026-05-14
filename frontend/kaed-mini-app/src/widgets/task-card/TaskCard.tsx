import {
  Check,
  Loader2,
  Trash2,
} from 'lucide-react'

import Card from '../../shared/ui/Card'

import {
  hapticImpact,
} from '../../app/telegram/telegram'

interface Props {
  title: string

  completed: boolean

  priority:
    | 'low'
    | 'medium'
    | 'high'

  jiraId?: string

  loading?: boolean

  onToggle: () => void

  onDelete: () => void
}

export default function TaskCard({
  title,
  completed,
  priority,
  jiraId,
  loading = false,
  onToggle,
  onDelete,
}: Props) {
  const priorityColor =
    priority === 'high'
      ? 'bg-red-500'
      : priority === 'medium'
      ? 'bg-yellow-500'
      : 'bg-green-500'

  async function handleToggle() {
    if (loading) {
      return
    }

    hapticImpact('light')

    await onToggle()
  }

  async function handleDelete() {
    if (loading) {
      return
    }

    hapticImpact('medium')

    await onDelete()
  }

  return (
    <Card className="flex items-center justify-between">
      <div className="flex items-center gap-4 min-w-0">
        <button
          onClick={
            handleToggle
          }
          disabled={loading}
          className={`
            w-7
            h-7
            rounded-full
            border-2
            flex
            items-center
            justify-center
            transition
            shrink-0
            ${
              completed
                ? 'bg-primary border-primary'
                : 'border-border'
            }
          `}
        >
          {loading ? (
            <Loader2
              size={14}
              className="animate-spin"
            />
          ) : (
            completed && (
              <Check
                size={16}
              />
            )
          )}
        </button>

        <div className="min-w-0">
          <div
            className={`
              font-semibold
              truncate
              ${
                completed
                  ? 'line-through text-muted'
                  : ''
              }
            `}
          >
            {title}
          </div>

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <div
              className={`
                w-2
                h-2
                rounded-full
                ${priorityColor}
              `}
            />

            <div className="text-xs text-muted capitalize">
              {priority} priority
            </div>

            {jiraId && (
              <div className="text-xs text-primary">
                Jira
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={
          handleDelete
        }
        disabled={loading}
        className="
          w-10
          h-10
          rounded-xl
          bg-background
          border
          border-border
          flex
          items-center
          justify-center
          shrink-0
          disabled:opacity-50
        "
      >
        <Trash2 size={18} />
      </button>
    </Card>
  )
}