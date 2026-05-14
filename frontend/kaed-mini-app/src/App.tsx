import {
  useEffect,
} from 'react'

import {
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom'

import {
  AnimatePresence,
} from 'framer-motion'

import DashboardPage from './pages/dashboard/DashboardPage'

import TasksPage from './pages/tasks/TasksPage'

import VoicePage from './pages/voice/VoicePage'

import NotificationsPage from './pages/notifications/NotificationsPage'

import SettingsPage from './pages/settings/SettingsPage'

import JiraPage from './pages/jira/JiraPage'

import BottomNav from './widgets/bottom-nav/BottomNav'

import ProtectedRoute from './app/providers/ProtectedRoute'

import {
  initTelegram,
} from './app/telegram/telegram'

import {
  useAuthStore,
} from './app/store/authStore'

export default function App() {
  const location =
    useLocation()

  const {
    initAuth,
    loading,
    user,
  } = useAuthStore()

  useEffect(() => {
    initTelegram()

    initAuth()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-white flex items-center justify-center">
        <div className="text-xl font-semibold">
          Загрузка...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-white pb-24">
      <AnimatePresence mode="wait">
        <Routes
          location={location}
          key={location.pathname}
        >
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <TasksPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/jira"
            element={
              <ProtectedRoute>
                <JiraPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/voice"
            element={
              <ProtectedRoute>
                <VoicePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/login"
            element={
              user ? (
                <Navigate
                  to="/"
                  replace
                />
              ) : (
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="text-3xl font-bold">
                      KAED
                    </div>

                    <div className="text-muted">
                      Telegram авторизация...
                    </div>
                  </div>
                </div>
              )
            }
          />

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />
        </Routes>
      </AnimatePresence>

      {user && <BottomNav />}
    </div>
  )
}