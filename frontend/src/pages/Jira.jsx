import styled from '@emotion/styled'
import { Check, Diamond, RefreshCcw } from 'lucide-react'
import GlassCard from '../components/GlassCard.jsx'
import StatusPill from '../components/StatusPill.jsx'
import { useAppStore } from '../store/useAppStore.js'

const Top = styled.header`
  margin: 0 0 16px var(--title-indent);

  h1 {
    margin: 0;
    font-size: var(--page-title-size);
    line-height: 1.05;
    letter-spacing: 0;
    font-weight: 600;
  }
`

const Connection = styled(GlassCard)`
  padding: 16px;
  margin-bottom: 19px;
`

const ConnectionTop = styled.div`
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr);
  gap: 12px;
  align-items: center;
  margin-bottom: 14px;

  h2 {
    margin: 0 0 5px;
    display: block;
    align-items: center;
    font-size: 15px;
    line-height: 1.22;
    font-weight: 500;
    letter-spacing: 0;
  }

  p {
    margin: 0;
    color: rgba(235,242,255,.52);
    font-size: var(--meta-size);
    line-height: 1.35;
  }
`

const JiraLogo = styled.div`
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  overflow: visible;
  color: var(--blue);

  svg {
    width: 34px;
    height: 34px;
    fill: none;
    stroke-width: 2.4;
    vector-effect: non-scaling-stroke;
  }
`

const SyncButton = styled.button`
  width: 100%;
  min-height: 50px;
  border: 0;
  border-radius: 999px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  color: #050505;
  background: var(--yellow);
  font-weight: 500;
  letter-spacing: 0;

  svg {
    width: 18px;
    height: 18px;
    flex: 0 0 18px;
    stroke-width: 2.4;
  }
`

const Section = styled.section`
  margin-top: 17px;

  h2 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin: 0 0 10px;
    font-size: var(--section-title-size);
    font-weight: 500;
    letter-spacing: 0;
  }
`

const ItemList = styled(GlassCard)`
  padding: 10px 12px;
`

const EmptyState = styled.div`
  padding: 18px 6px;
  color: var(--muted);
  font-size: var(--meta-size);
  line-height: 1.35;
`

const JiraItem = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 10px;
  min-height: 68px;
  border-bottom: 1px solid var(--line);

  &:last-child {
    border-bottom: 0;
  }

  strong {
    display: block;
    color: var(--text);
    font-size: var(--body-size);
    font-weight: 400;
    margin-bottom: 5px;
    line-height: 1.2;
  }

  small {
    color: var(--muted);
    font-size: var(--meta-size);
  }
`

const CheckBox = styled.button`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid var(--line);
  background: ${({ checked }) => (checked ? 'var(--green)' : '#050505')};
  display: grid;
  place-items: center;
  color: #050505;
  padding: 0;

  svg {
    width: 13px;
    height: 13px;
    stroke-width: 3;
  }
`

const ErrorBox = styled.div`
  margin-top: 12px;
  padding: 12px;
  border-radius: 18px;
  color: #050505;
  background: #ff6259;
  border: 0;
  font-size: var(--meta-size);
  font-weight: 400;
`

export default function Jira() {
  const {
    tasks,
    syncState,
    syncWithJira,
    lastSyncAt,
    apiError,
    toggleTask,
  } = useAppStore()

  const isLoading = syncState === 'loading'
  const jiraTasks = tasks.filter((task) => task.jira_id)
  const readyTasks = jiraTasks.slice(0, 5)
  const isSynced = Boolean(lastSyncAt || jiraTasks.length)

  const syncLabel = lastSyncAt
    ? new Date(lastSyncAt).toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Не синхронизировано'

  return (
    <>
      <Top>
        <h1>Jira</h1>
      </Top>

      <Connection as="section" aria-labelledby="jira-connection-title">
        <ConnectionTop>
          <JiraLogo aria-hidden="true">
            <Diamond />
          </JiraLogo>

          <div>
            <h2 id="jira-connection-title">
              {isSynced ? 'Jira синхронизирована' : 'Jira не синхронизирована'}
            </h2>

            <p>
              Последняя синхронизация:
              <br />
              {syncLabel}
            </p>
          </div>
        </ConnectionTop>

        <SyncButton type="button" onClick={syncWithJira} disabled={isLoading}>
          {isLoading ? 'Синхронизация...' : 'Синхронизировать'}
          <RefreshCcw size={18} />
        </SyncButton>
      </Connection>

      <Section aria-labelledby="ready-title">
        <h2 id="ready-title">
          Синхронизированные задачи
          <StatusPill tone="muted" dot={false}>
            {jiraTasks.length}
          </StatusPill>
        </h2>

        <ItemList>
          {readyTasks.length ? readyTasks.map((task) => (
            <JiraItem key={task.id}>
              <CheckBox
                type="button"
                checked={task.completed}
                onClick={() => toggleTask(task.id)}
                aria-label="Отметить задачу"
              >
                {task.completed && <Check aria-hidden="true" />}
              </CheckBox>

              <div>
                <strong>{task.title}</strong>
                {task.jira_id && <small>{task.jira_id}</small>}
              </div>

            </JiraItem>
          )) : (
            <EmptyState>
              Пока нет задач, отправленных или синхронизированных с Jira.
            </EmptyState>
          )}
        </ItemList>
      </Section>

      {apiError && <ErrorBox role="alert">{apiError}</ErrorBox>}
    </>
  )
}
