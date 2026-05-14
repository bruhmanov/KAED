import { create } from 'zustand'

import {
  getTasks,
  createTask,
  toggleTask as toggleTaskRequest,
  deleteTask as deleteTaskRequest,
  syncJira,
} from '../../shared/api/tasks'

export interface Task {
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

interface TaskStore {
  tasks: Task[]

  loading: boolean

  error: string | null

  fetchTasks: () => Promise<void>

  addTask: (
    title: string
  ) => Promise<void>

  toggleTask: (
    id: string
  ) => Promise<void>

  deleteTask: (
    id: string
  ) => Promise<void>

  syncWithJira: () => Promise<void>
}

export const useTaskStore =
  create<TaskStore>((set) => ({
    tasks: [],

    loading: false,

    error: null,

    fetchTasks: async () => {
      try {
        set({
          loading: true,
          error: null,
        })

        const tasks =
          await getTasks()

        set({
          tasks,
          loading: false,
        })
      } catch (error) {
        console.error(error)

        set({
          loading: false,
          error:
            'Failed to load tasks',
        })
      }
    },

    addTask: async (title) => {
      try {
        await createTask(title)

        const tasks =
          await getTasks()

        set({
          tasks,
        })
      } catch (error) {
        console.error(error)
      }
    },

    toggleTask: async (id) => {
      try {
        await toggleTaskRequest(id)

        const tasks =
          await getTasks()

        set({
          tasks,
        })
      } catch (error) {
        console.error(error)
      }
    },

    deleteTask: async (id) => {
      try {
        await deleteTaskRequest(id)

        const tasks =
          await getTasks()

        set({
          tasks,
        })
      } catch (error) {
        console.error(error)
      }
    },

    syncWithJira: async () => {
      try {
        set({
          loading: true,
        })

        const tasks =
          await syncJira()

        set({
          tasks,
          loading: false,
        })
      } catch (error) {
        console.error(error)

        set({
          loading: false,
          error:
            'Jira sync failed',
        })
      }
    },
  }))