import { create } from 'zustand'
import {
  createTask,
  deleteTask,
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
    priority: 'medium',
    jira_id: 'KAED-14',
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    title: 'Синхронизация с Jira',
    completed: false,
    priority: 'high',
    jira_id: 'KAED-21',
    created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    id: 'demo-3',
    title: 'Подготовить daily report',
    completed: true,
    priority: 'low',
    jira_id: null,
    created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
  },
]

export const useAppStore = create((set, get) => ({
  activeTab: 'home',
  user: null,
  tasks: [],
  loading: false,
  apiError: '',
  syncState: 'idle',
  voiceState: 'idle',
  voiceResult: null,
  lastSyncAt: null,

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
      set({ tasks, loading: false })
    } catch (error) {
      set({
        user: { id: 10001, first_name: 'Эвелина', username: 'demo' },
        tasks: fallbackTasks,
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
      set({ tasks, apiError: '' })
    } catch (error) {
      set({ apiError: error.message })
    }
  },

  addTask: async ({ title, priority }) => {
    const user = get().user
    if (!user || !title.trim()) return

    const optimisticTask = {
      id: `local-${Date.now()}`,
      title: title.trim(),
      completed: false,
      priority,
      jira_id: null,
      created_at: new Date().toISOString(),
    }

    set((state) => ({ tasks: [optimisticTask, ...state.tasks] }))

    try {
      const savedTask = await createTask({ telegramId: user.id, title, priority })
      set((state) => ({
        tasks: state.tasks.map((task) => (task.id === optimisticTask.id ? savedTask : task)),
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
