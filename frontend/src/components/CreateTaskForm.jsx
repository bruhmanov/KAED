import { useState } from 'react'
import styled from '@emotion/styled'
import { Plus } from 'lucide-react'

const Form = styled.form`
  position: relative;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 21px;
  background: var(--panel);
  padding: 13px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 9px;
  margin-bottom: 12px;
`

const Label = styled.label`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
`

const Input = styled.input`
  min-width: 0;
  min-height: 48px;
  border: 1px solid var(--line);
  outline: 0;
  border-radius: 999px;
  padding: 0 15px;
  background: #050505;
  color: var(--text);
  font-size: 14px;
  font-weight: 400;

  &::placeholder {
    color: #747875;
  }

  &:focus {
    border-color: var(--yellow);
  }
`

const Select = styled.select`
  grid-column: 1 / -1;
  min-height: 46px;
  border: 1px solid var(--line);
  outline: 0;
  border-radius: 999px;
  padding: 0 14px;
  background: #050505;
  color: var(--text);
  font-size: 14px;
  font-weight: 400;

  &:focus {
    border-color: var(--yellow);
  }
`

const Button = styled.button`
  width: 48px;
  height: 48px;
  border: 0;
  border-radius: 999px;
  display: grid;
  place-items: center;
  color: #050505;
  background: var(--yellow);
  font-weight: 500;

  svg {
    width: 22px;
    height: 22px;
    stroke-width: 2.5;
  }
`

export default function CreateTaskForm({ onSubmit }) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('medium')

  function handleSubmit(event) {
    event.preventDefault()
    if (!title.trim()) return
    onSubmit({ title: title.trim(), priority })
    setTitle('')
    setPriority('medium')
  }

  return (
    <Form onSubmit={handleSubmit} aria-label="Форма создания задачи">
      <Label htmlFor="task-title">Название задачи</Label>
      <Input
        id="task-title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Новая задача"
        autoComplete="off"
      />
      <Button type="submit" aria-label="Добавить задачу">
        <Plus aria-hidden="true" />
      </Button>
      <Label htmlFor="task-priority">Приоритет</Label>
      <Select
        id="task-priority"
        value={priority}
        onChange={(event) => setPriority(event.target.value)}
      >
        <option value="low">Низкий приоритет</option>
        <option value="medium">Средний приоритет</option>
        <option value="high">Высокий приоритет</option>
      </Select>
    </Form>
  )
}
