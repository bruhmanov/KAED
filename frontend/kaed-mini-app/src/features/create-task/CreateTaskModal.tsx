import { useState } from 'react'

import {
  useTaskStore,
} from '../../entities/task/taskStore'

import {
  hapticImpact,
} from '../../app/telegram/telegram'

interface Props {
  open: boolean

  onClose: () => void
}

export default function CreateTaskModal({
  open,
  onClose,
}: Props) {
  const [title, setTitle] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  const { addTask } =
    useTaskStore()

  if (!open) {
    return null
  }

  async function handleCreate() {
    if (!title.trim()) {
      return
    }

    try {
      setLoading(true)

      hapticImpact('light')

      await addTask(title)

      setTitle('')

      onClose()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end">
      <div className="bg-card border-t border-border rounded-t-3xl p-5 w-full space-y-5">
        <div className="text-2xl font-bold">
          Создать задачу
        </div>

        <input
          value={title}
          onChange={(e) =>
            setTitle(
              e.target.value
            )
          }
          placeholder="Название задачи"
          disabled={loading}
          className="
            w-full
            h-14
            rounded-2xl
            bg-background
            border
            border-border
            px-4
            outline-none
            disabled:opacity-50
          "
        />

        <button
          onClick={handleCreate}
          disabled={loading}
          className="
            w-full
            h-14
            rounded-2xl
            bg-primary
            font-semibold
            disabled:opacity-50
          "
        >
          {loading
            ? 'Создание...'
            : 'Создать'}
        </button>

        <button
          onClick={onClose}
          disabled={loading}
          className="
            w-full
            h-14
            rounded-2xl
            bg-background
            border
            border-border
            disabled:opacity-50
          "
        >
          Отмена
        </button>
      </div>
    </div>
  )
}