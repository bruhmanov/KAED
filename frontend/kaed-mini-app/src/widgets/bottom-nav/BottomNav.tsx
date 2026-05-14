import {
  Home,
  CheckSquare,
  Mic,
  FolderKanban,
  Bell,
  Settings,
} from 'lucide-react'

import {
  NavLink,
} from 'react-router-dom'

import {
  motion,
} from 'framer-motion'

import {
  hapticImpact,
} from '../../app/telegram/telegram'

const items = [
  {
    to: '/',
    icon: Home,
    label: 'Главная',
  },

  {
    to: '/tasks',
    icon: CheckSquare,
    label: 'Задачи',
  },

  {
    to: '/voice',
    icon: Mic,
    label: 'Голос',
  },

  {
    to: '/jira',
    icon: FolderKanban,
    label: 'Jira',
  },

  {
    to: '/notifications',
    icon: Bell,
    label: 'Увед.',
  },

  {
    to: '/settings',
    icon: Settings,
    label: 'Профиль',
  },
]

export default function BottomNav() {
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[94%] max-w-lg z-50">
      <div className="h-20 bg-card/90 backdrop-blur-2xl border border-border rounded-3xl flex items-center justify-around shadow-2xl px-2 overflow-x-auto">
        {items.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() =>
                hapticImpact(
                  'light'
                )
              }
            >
              {({
                isActive,
              }) => (
                <motion.div
                  whileTap={{
                    scale: 0.9,
                  }}
                  className="flex flex-col items-center gap-1 min-w-[56px]"
                >
                  <div
                    className={`
                      w-11
                      h-11
                      rounded-2xl
                      flex
                      items-center
                      justify-center
                      transition-all
                      ${
                        isActive
                          ? 'bg-primary text-white shadow-lg'
                          : 'text-muted'
                      }
                    `}
                  >
                    <Icon size={20} />
                  </div>

                  <div
                    className={`
                      text-[11px]
                      transition
                      whitespace-nowrap
                      ${
                        isActive
                          ? 'text-white'
                          : 'text-muted'
                      }
                    `}
                  >
                    {item.label}
                  </div>
                </motion.div>
              )}
            </NavLink>
          )
        })}
      </div>
    </div>
  )
}