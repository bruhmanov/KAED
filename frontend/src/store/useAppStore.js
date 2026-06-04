import { create } from 'zustand'
import {
  createTask,
  deleteTask,
  getFallbackUser,
  getTasks,
  initTelegramShell,
  loginTelegram,
  syncJira,
  toggleTask,
  uploadVoiceTask,
} from '../api/api.js'

const fallbackTasks = [
  {
    id: 'demo-1',
    title: 'Проверить загрузку голосового файла',
    completed: false,
    jira_id: 'KAED-14',
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    title: 'Синхронизация с Jira',
    completed: false,
    jira_id: 'KAED-21',
    created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    id: 'demo-3',
    title: 'Подготовить daily report',
    completed: true,
    jira_id: null,
    created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
  },
]

const FAVORITES_KEY = 'kaed.favoriteTaskIds'
const DEMO_TASK_STATE_KEY = 'kaed.demoTaskState'

function readFavoriteTaskIds() {
  try {
    return JSON.parse(window.localStorage.getItem(FAVORITES_KEY) || '[]')
  } catch {
    return []
  }
}

function writeFavoriteTaskIds(ids) {
  try {
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids))
  } catch {
    // localStorage can be unavailable inside restricted webviews.
  }
}

function readDemoTaskState() {
  try {
    return JSON.parse(window.localStorage.getItem(DEMO_TASK_STATE_KEY) || '{}')
  } catch {
    return {}
  }
}

function writeDemoTaskState(state) {
  try {
    window.localStorage.setItem(DEMO_TASK_STATE_KEY, JSON.stringify(state))
  } catch {
    // localStorage can be unavailable inside restricted webviews.
  }
}

function applyDemoTaskState(tasks, demoTaskState) {
  return tasks.map((task) => {
    const demoState = demoTaskState[String(task.id)] || {}
    return {
      ...task,
      ...(demoState.jira_id ? { jira_id: demoState.jira_id } : {}),
    }
  })
}

function createDemoJiraKey(taskId) {
  const suffix = String(taskId).replace(/\D/g, '').slice(-3) || String(Date.now()).slice(-3)
  return `KAN-DEMO-${suffix}`
}

export const useAppStore = create((set, get) => ({
  activeTab: 'home',
  user: null,
  tasks: [],
  favoriteTaskIds: readFavoriteTaskIds(),
  loading: false,
  apiError: '',
  syncState: 'idle',
  voiceState: 'idle',
  voiceResult: null,
  lastSyncAt: null,
  sendingToJiraIds: [],
  demoTaskState: readDemoTaskState(),

  setActiveTab: (tab) => {
    set({ activeTab: tab })
    window.location.hash = tab
  },

  bootstrap: async () => {
    initTelegramShell()
    const initialTab = window.location.hash.replace('#', '') || 'home'
    set({ activeTab: ['home', 'tasks', 'voice', 'jira'].includes(initialTab) ? initialTab : 'home' })

    try {
      set({ loading: true, apiError: '' })
      const user = await loginTelegram()
      set({ user })
      const tasks = await getTasks(user.id)
      set({ tasks: applyDemoTaskState(tasks, get().demoTaskState), loading: false })
    } catch (error) {
      set({
        user: getFallbackUser(),
        tasks: applyDemoTaskState(fallbackTasks, get().demoTaskState),
        loading: false,
        apiError: error.message || 'Backend временно недоступен. Показан demo-режим.',
      })
    }
  },

  reloadTasks: async () => {
    const user = get().user
    if (!user) return

    try {
      const tasks = await getTasks(user.id)
      set({ tasks: applyDemoTaskState(tasks, get().demoTaskState), apiError: '' })
    } catch (error) {
      set({ apiError: error.message })
    }
  },

  addTask: async ({ title }) => {
    const user = get().user
    if (!user || !title.trim()) return

    const optimisticTask = {
      id: `local-${Date.now()}`,
      title: title.trim(),
      completed: false,
      jira_id: null,
      created_at: new Date().toISOString(),
    }

    set((state) => ({ tasks: [optimisticTask, ...state.tasks] }))

    try {
      const savedTask = await createTask({ telegramId: user.id, title })
      set((state) => ({
        tasks: state.tasks.map((task) => (
          task.id === optimisticTask.id
            ? applyDemoTaskState([savedTask], state.demoTaskState)[0]
            : task
        )),
        apiError: '',
      }))
    } catch (error) {
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== optimisticTask.id),
        apiError: error.message,
      }))
    }
  },

  toggleTask: async (taskId) => {
    const user = get().user
    if (!user) return

    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    }))

    try {
      const updated = await toggleTask({ telegramId: user.id, taskId })
      set((state) => ({
        tasks: state.tasks.map((task) => (task.id === taskId ? updated : task)),
        apiError: '',
      }))
    } catch (error) {
      set({ apiError: error.message })
    }
  },

  removeTask: async (taskId) => {
    const user = get().user
    if (!user) return

    const previousTasks = get().tasks
    set((state) => ({ tasks: state.tasks.filter((task) => task.id !== taskId) }))

    try {
      await deleteTask({ telegramId: user.id, taskId })
      set({ apiError: '' })
    } catch (error) {
      set({ tasks: previousTasks, apiError: error.message })
    }
  },

  sendTaskToJira: async (taskId) => {
    const normalizedId = String(taskId)
    if (get().sendingToJiraIds.includes(normalizedId)) return

    set((state) => ({
      sendingToJiraIds: [...state.sendingToJiraIds, normalizedId],
      apiError: '',
    }))

    await new Promise((resolve) => setTimeout(resolve, 650))

    const jira_id = createDemoJiraKey(taskId)
    const nextDemoTaskState = {
      ...get().demoTaskState,
      [normalizedId]: {
        ...(get().demoTaskState[normalizedId] || {}),
        jira_id,
      },
    }
    writeDemoTaskState(nextDemoTaskState)

    set((state) => ({
      demoTaskState: nextDemoTaskState,
      tasks: state.tasks.map((task) => (task.id === taskId ? { ...task, jira_id } : task)),
      sendingToJiraIds: state.sendingToJiraIds.filter((id) => id !== normalizedId),
      apiError: '',
    }))
  },

  toggleFavorite: (taskId) => {
    const normalizedId = String(taskId)
    const current = get().favoriteTaskIds
    const next = current.includes(normalizedId)
      ? current.filter((id) => id !== normalizedId)
      : [...current, normalizedId]

    writeFavoriteTaskIds(next)
    set({ favoriteTaskIds: next })
  },

  syncWithJira: async () => {
    const user = get().user
    if (!user) return

    try {
      set({ syncState: 'loading', apiError: '' })
      const tasks = await syncJira(user.id)
      set({ tasks, syncState: 'success', lastSyncAt: new Date().toISOString() })
    } catch (error) {
      set({ syncState: 'error', apiError: error.message })
    }
  },

  sendVoice: async (audioBlob) => {
    const user = get().user
    if (!user || !audioBlob) return

    try {
      set({ voiceState: 'uploading', voiceResult: null, apiError: '' })
      const result = await uploadVoiceTask({ telegramId: user.id, audioBlob })
      set((state) => ({
        voiceState: 'done',
        voiceResult: result,
        tasks: result.task ? [result.task, ...state.tasks] : state.tasks,
      }))
    } catch (error) {
      set({ voiceState: 'error', apiError: error.message })
    }
  },
}))
