import styled from '@emotion/styled'
import { ClipboardList, Diamond, Home, Mic } from 'lucide-react'
import { useAppStore } from '../store/useAppStore.js'

const tabs = [
  { id: 'home', label: 'Главная', icon: Home },
  { id: 'tasks', label: 'Задачи', icon: ClipboardList },
  { id: 'voice', label: 'Голос', icon: Mic },
  { id: 'jira', label: 'Jira', icon: Diamond },
]

const Nav = styled.nav`
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  z-index: 10;
  width: var(--app-width);
  min-height: calc(72px + var(--tg-safe-bottom));
  padding: 8px 12px calc(8px + var(--tg-safe-bottom));
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;
  border-top: 1px solid var(--line);
  background: #050505;
`

const TabButton = styled.button`
  display: grid;
  justify-items: center;
  align-content: center;
  gap: 4px;
  min-height: 52px;
  padding: 6px 4px 5px;
  border: 0;
  border-radius: 999px;
  background: ${({ active }) => (active ? '#f4f4ef' : 'transparent')};
  color: ${({ active }) => (active ? '#050505' : '#7c807e')};
  font-size: 10px;
  font-weight: ${({ active }) => (active ? 500 : 400)};

  svg {
    width: 19px;
    height: 19px;
    display: block;
    stroke-width: 2.1;
  }

  span {
    line-height: 1;
  }

  &:focus-visible {
    outline: 2px solid var(--yellow);
    outline-offset: 2px;
  }

  &:active {
    transform: scale(.96);
  }
`

export default function BottomNav() {
  const { activeTab, setActiveTab } = useAppStore()

  return (
    <Nav aria-label="Основная навигация">
      {tabs.map(({ id, label, icon: Icon }) => (
        <TabButton
          key={id}
          type="button"
          active={activeTab === id}
          aria-current={activeTab === id ? 'page' : undefined}
          onClick={() => setActiveTab(id)}
        >
          <Icon aria-hidden="true" />
          <span>{label}</span>
        </TabButton>
      ))}
    </Nav>
  )
}
