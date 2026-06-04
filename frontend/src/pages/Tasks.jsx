import { useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { Filter, Plus, Search } from 'lucide-react'
import CreateTaskForm from '../components/CreateTaskForm.jsx'
import TaskCard from '../components/TaskCard.jsx'
import { useAppStore } from '../store/useAppStore.js'

const Top = styled.header`
  margin: 0 0 17px var(--title-indent);

  h1 {
    margin: 0;
    font-size: var(--page-title-size);
    line-height: 1.05;
    letter-spacing: 0;
    font-weight: 600;
  }
`

const SearchBox = styled.label`
  min-height: 47px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 14px;
  margin-bottom: 12px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--panel);
  color: #7d817e;

  input {
    width: 100%;
    border: 0;
    outline: 0;
    background: transparent;
    color: var(--text);
    font-size: var(--body-size);
  }

  input::placeholder {
    color: #707572;
  }

  &:focus-within {
    border-color: var(--yellow);
  }
`

const Chips = styled.div`
  display: flex;
  gap: 7px;
  overflow-x: auto;
  padding-bottom: 4px;
  margin-bottom: 11px;
`

const Chip = styled.button`
  flex: 0 0 auto;
  min-height: 36px;
  border: 0;
  border-radius: 999px;
  padding: 0 15px;
  color: ${({ active }) => (active ? '#050505' : '#f2f2ef')};
  background: ${({ active }) => (active ? '#f4f4ef' : '#141414')};
  font-size: var(--meta-size);
  font-weight: 500;
  letter-spacing: 0;
`

const List = styled.section`
  display: grid;
  gap: 10px;
  margin-top: 13px;
`

const Empty = styled.div`
  min-height: 150px;
  display: grid;
  place-items: center;
  padding: 22px;
  border-radius: 21px;
  border: 1px dashed var(--line);
  background: var(--panel);
  color: #777b78;
  text-align: center;
`

const FloatingButton = styled.button`
  position: fixed;
  right: max(var(--content-x), calc((100vw - 390px) / 2 + var(--content-x)));
  bottom: calc(88px + var(--tg-safe-bottom));
  z-index: 9;
  width: 62px;
  height: 62px;
  border: 0;
  border-radius: 999px;
  display: grid;
  place-items: center;
  color: #050505;
  background: var(--yellow);

  svg {
    width: 34px;
    height: 34px;
    stroke-width: 2;
  }
`

const ErrorBox = styled.div`
  margin-top: 12px;
  padding: 12px;
  border-radius: 18px;
  color: #050505;
  background: #ff6259;
  font-size: var(--meta-size);
  font-weight: 500;
`

const filters = [
  { id: 'all', label: 'Все' },
  { id: 'active', label: 'В работе' },
  { id: 'done', label: 'Готово' },
  { id: 'review', label: 'Избранное' },
]

export default function Tasks() {
  const {
    tasks,
    favoriteTaskIds,
    sendingToJiraIds,
    addTask,
    toggleTask,
    toggleFavorite,
    removeTask,
    sendTaskToJira,
    apiError,
  } = useAppStore()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [isFormOpen, setIsFormOpen] = useState(false)

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesQuery = task.title.toLowerCase().includes(query.toLowerCase())
      if (!matchesQuery) return false
      if (filter === 'active') return !task.completed
      if (filter === 'review') return favoriteTaskIds.includes(String(task.id))
      if (filter === 'done') return task.completed
      return true
    })
  }, [tasks, query, filter, favoriteTaskIds])

  function handleSubmit(data) {
    addTask(data)
    setIsFormOpen(false)
  }

  return (
    <>
      <Top>
        <h1>Задачи</h1>
      </Top>

      <SearchBox>
        <Search aria-hidden="true" size={18} />
        <span className="sr-only">Поиск задач</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Поиск задач"
        />
      </SearchBox>

      <Chips aria-label="Фильтр задач">
        {filters.map((item) => (
          <Chip key={item.id} type="button" active={filter === item.id} onClick={() => setFilter(item.id)}>
            {item.label}
          </Chip>
        ))}
      </Chips>

      {isFormOpen && <CreateTaskForm onSubmit={handleSubmit} />}

      <List aria-label="Список задач">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            favorite={favoriteTaskIds.includes(String(task.id))}
            onToggle={toggleTask}
            onToggleFavorite={toggleFavorite}
            onDelete={removeTask}
            onSendToJira={sendTaskToJira}
            sendingToJira={sendingToJiraIds.includes(String(task.id))}
          />
        ))}
        {!filteredTasks.length && (
          <Empty>
            <div>
              <Filter aria-hidden="true" />
              <p>Нет задач по выбранному фильтру.</p>
            </div>
          </Empty>
        )}
      </List>

      {apiError && <ErrorBox role="alert">{apiError}</ErrorBox>}

      <FloatingButton
        type="button"
        aria-label={isFormOpen ? 'Закрыть форму задачи' : 'Открыть форму задачи'}
        onClick={() => setIsFormOpen((value) => !value)}
      >
        <Plus aria-hidden="true" />
      </FloatingButton>
    </>
  )
}
