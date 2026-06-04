import styled from '@emotion/styled'
import { CalendarDays, Check, Send, Star, Trash2 } from 'lucide-react'
import StatusPill from './StatusPill.jsx'

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
  max-width: 218px;
  margin: 0;
  color: var(--text);
  font-size: var(--card-title-size);
  line-height: 1.22;
  font-weight: 600;
  letter-spacing: 0;
`

const ActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
`

const IconButton = styled.button`
  width: 32px;
  height: 32px;
  border: 1px solid ${({ active, tone }) => (active ? `var(--${tone})` : 'var(--line)')};
  border-radius: 999px;
  display: grid;
  place-items: center;
  color: ${({ active }) => (active ? '#050505' : '#f2f2ef')};
  background: ${({ active, tone }) => (active ? `var(--${tone})` : '#050505')};
  transition: background .16s ease, border-color .16s ease, color .16s ease, transform .16s ease;

  svg {
    width: 16px;
    height: 16px;
    fill: ${({ active, filled }) => (active && filled ? 'currentColor' : 'none')};
  }

  &:focus-visible {
    outline: 2px solid var(--yellow);
  }

  &:active {
    transform: scale(.94);
  }
`

const DeleteButton = styled(IconButton)`
  color: #ff6259;

  &:hover {
    border-color: #ff6259;
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
  font-size: var(--meta-size);
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

const JiraButton = styled.button`
  min-height: 30px;
  border: 1px solid ${({ disabled }) => (disabled ? 'var(--line)' : 'var(--yellow)')};
  border-radius: 999px;
  padding: 0 10px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: ${({ disabled }) => (disabled ? '#7f8380' : '#050505')};
  background: ${({ disabled }) => (disabled ? '#101010' : 'var(--yellow)')};
  font-size: var(--meta-size);
  font-weight: 500;
  letter-spacing: 0;

  svg {
    width: 14px;
    height: 14px;
  }

  &:focus-visible {
    outline: 2px solid var(--yellow);
    outline-offset: 2px;
  }
`

function formatTaskTime(dateString) {
  try {
    if (!dateString) {
      return 'Сегодня'
    }
    const normalized = /(?:z|[+-]\d{2}:?\d{2})$/i.test(dateString)
      ? dateString
      : `${dateString}Z`
    const date = new Date(normalized)
    if (Number.isNaN(date.getTime())) {
      return 'Сегодня'
    }
    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()
    return `${isToday ? 'Сегодня' : 'Вчера'}, ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`
  } catch {
    return 'Сегодня'
  }
}

export default function TaskCard({
  task,
  onToggle,
  onToggleFavorite,
  onDelete,
  onSendToJira,
  favorite,
  sendingToJira,
}) {
  return (
    <Card>
      <TopRow>
        <Title>{task.title}</Title>
        <ActionRow>
          <IconButton
            type="button"
            active={favorite}
            filled
            tone="yellow"
            aria-label="Добавить в избранное"
            onClick={() => onToggleFavorite(task.id)}
          >
            <Star aria-hidden="true" />
          </IconButton>
          <IconButton
            type="button"
            active={task.completed}
            tone="green"
            aria-label="Отметить задачу готовой"
            onClick={() => onToggle(task.id)}
          >
            <Check aria-hidden="true" />
          </IconButton>
          <DeleteButton
            type="button"
            active={false}
            tone="pink"
            aria-label="Удалить задачу"
            onClick={() => onDelete(task.id)}
          >
            <Trash2 aria-hidden="true" />
          </DeleteButton>
        </ActionRow>
      </TopRow>

      <Tags>
        <StatusPill tone={task.completed ? 'lime' : 'blue'} dot={false}>
          {task.completed ? 'Готово' : 'В работе'}
        </StatusPill>
      </Tags>

      <Meta>
        <span><CalendarDays aria-hidden="true" /> {formatTaskTime(task.created_at)}</span>
        {task.jira_id ? (
          <span>Jira: {task.jira_id}</span>
        ) : (
          <JiraButton
            type="button"
            disabled={sendingToJira}
            onClick={() => onSendToJira(task.id)}
          >
            {sendingToJira ? 'Отправка...' : 'В Jira'}
            <Send aria-hidden="true" />
          </JiraButton>
        )}
      </Meta>
    </Card>
  )
}
