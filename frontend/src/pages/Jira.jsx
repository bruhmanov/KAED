import styled from '@emotion/styled'
import { Check, Diamond, RefreshCcw } from 'lucide-react'
import GlassCard from '../components/GlassCard.jsx'
import StatusPill from '../components/StatusPill.jsx'
import { useAppStore } from '../store/useAppStore.js'

const Top = styled.header`
  margin: 0 0 16px 12px;

  h1 {
    margin: 0;
    font-size: 28px;
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
    font-size: 13px;
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
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 0;
  }
`

const ItemList = styled(GlassCard)`
  padding: 10px 12px;
`

const JiraItem = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
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
    font-size: 14px;
    font-weight: 400;
    margin-bottom: 5px;
    line-height: 1.2;
  }

  small {
    color: var(--muted);
    font-size: 12px;
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

const Arrow = styled.span`
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  color: #f4f4ef;
  font-size: 21px;
  line-height: 1;
`

const Activity = styled(GlassCard)`
  padding: 10px 12px;
`

const ActivityRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--line);

  &:last-of-type {
    border-bottom: 0;
  }

  p {
    margin: 0 0 3px;
    color: rgba(246,248,250,.88);
    font-size: 13px;
    line-height: 1.25;
  }

  small {
    color: var(--muted);
    font-size: 12px;
  }
`

const DotIcon = styled.span`
  width: 18px;
  height: 18px;
  margin-top: 1px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: ${({ tone }) => tone};
  color: #050505;

  &::after {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
  }
`

const ErrorBox = styled.div`
  margin-top: 12px;
  padding: 12px;
  border-radius: 18px;
  color: #050505;
  background: #ff6259;
  border: 0;
  font-size: 13px;
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

  const readyTasks = tasks.slice(0, 3)
  const isLoading = syncState === 'loading'

  const syncLabel = lastSyncAt
    ? new Date(lastSyncAt).toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '2 минуты назад'

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
              Jira подключена
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
          Готово к отправке
          <StatusPill tone="muted" dot={false}>
            {readyTasks.length}
          </StatusPill>
        </h2>

        <ItemList>
          {readyTasks.map((task) => (
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
                <small>{task.jira_id || 'LOCAL'}</small>
              </div>

              <Arrow aria-hidden="true">→</Arrow>
            </JiraItem>
          ))}
        </ItemList>
      </Section>

      <Section aria-labelledby="activity-title">
        <h2 id="activity-title">Активность</h2>

        <Activity>
          <ActivityRow>
            <DotIcon tone="var(--green)" />
            <div>
              <p>KAED-14 обновлена</p>
              <small>2 минуты назад</small>
            </div>
          </ActivityRow>

          <ActivityRow>
            <DotIcon tone="var(--blue)" />
            <div>
              <p>KAED-21 создана</p>
              <small>15 минут назад</small>
            </div>
          </ActivityRow>

          <ActivityRow>
            <DotIcon tone="var(--blue)" />
            <div>
              <p>Отчёт отправлен</p>
              <small>20 минут назад</small>
            </div>
          </ActivityRow>
        </Activity>
      </Section>

      {apiError && <ErrorBox role="alert">{apiError}</ErrorBox>}
    </>
  )
}
