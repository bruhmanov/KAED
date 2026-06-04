import styled from '@emotion/styled'
import { CalendarDays, CheckCircle2, MessageCircle, MoreVertical, Star } from 'lucide-react'
import StatusPill from './StatusPill.jsx'

const priorityTone = {
  high: 'pink',
  medium: 'yellow',
  low: 'blue',
}

const priorityLabel = {
  high: 'Высокий',
  medium: 'Средний',
  low: 'Низкий',
}

const Card = styled.article`
  position: relative;
  overflow: hidden;
  padding: 15px;
  border-radius: 21px;
  border: 1px solid var(--line);
  background: var(--panel);
`

const TopRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  align-items: start;
`

const Title = styled.h3`
  max-width: 232px;
  margin: 0;
  color: var(--text);
  font-size: 16px;
  line-height: 1.22;
  font-weight: 600;
  letter-spacing: 0;
`

const ActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`

const IconButton = styled.button`
  width: 29px;
  height: 29px;
  border: 1px solid ${({ checked }) => (checked ? 'var(--green)' : 'var(--line)')};
  border-radius: 999px;
  display: grid;
  place-items: center;
  color: ${({ checked }) => (checked ? '#050505' : '#f2f2ef')};
  background: ${({ checked }) => (checked ? 'var(--green)' : '#050505')};

  svg {
    width: 16px;
    height: 16px;
  }

  &:focus-visible {
    outline: 2px solid var(--yellow);
  }
`

const Tags = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 15px;
`

const Meta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 14px;
  color: #7f8380;
  font-size: 13px;
  font-weight: 400;

  span {
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`

function formatTaskTime(dateString) {
  try {
    const date = new Date(dateString)
    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()
    return `${isToday ? 'Сегодня' : 'Вчера'}, ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`
  } catch {
    return 'Сегодня'
  }
}

export default function TaskCard({ task, onToggle }) {
  return (
    <Card>
      <TopRow>
        <Title>{task.title}</Title>
        <ActionRow>
          <IconButton type="button" checked={task.completed} aria-label="Отметить задачу" onClick={() => onToggle(task.id)}>
            {task.completed ? <CheckCircle2 aria-hidden="true" /> : <Star aria-hidden="true" />}
          </IconButton>
          <MoreVertical aria-hidden="true" size={17} color="#777b78" />
        </ActionRow>
      </TopRow>

      <Tags>
        <StatusPill tone={task.completed ? 'lime' : 'blue'} dot={false}>
          {task.completed ? 'Готово' : 'В работе'}
        </StatusPill>
        <StatusPill tone={priorityTone[task.priority] || 'dark'} dot={false}>
          {priorityLabel[task.priority] || 'Средний'}
        </StatusPill>
      </Tags>

      <Meta>
        <span><CalendarDays aria-hidden="true" /> {formatTaskTime(task.created_at)}</span>
        <span><MessageCircle aria-hidden="true" /> {task.jira_id ? 2 : 0}</span>
      </Meta>
    </Card>
  )
}
