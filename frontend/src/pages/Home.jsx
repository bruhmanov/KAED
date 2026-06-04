import styled from '@emotion/styled'
import { ArrowRight, Check, CircleAlert, Mic, Sprout } from 'lucide-react'
import GlassCard from '../components/GlassCard.jsx'
import { useAppStore } from '../store/useAppStore.js'
import kaedLogo from '../assets/images/kaed-logo.png'

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  margin-bottom: 25px;
`

const Brand = styled.div`
  display: inline-flex;
  align-items: center;
  width: 118px;
  height: 40px;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: left center;
  }
`

const Avatar = styled.div`
  position: relative;
  width: 39px;
  height: 39px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  color: #050505;
  font-size: 15px;
  font-weight: 600;
  background: var(--green);

  &::after {
    content: '';
    position: absolute;
    right: 0;
    bottom: 0;
    width: 9px;
    height: 9px;
    border-radius: 999px;
    background: var(--yellow);
    border: 2px solid #050505;
  }
`

const Hero = styled.section`
  margin-bottom: 14px;
`

const Title = styled.h1`
  margin: 0 0 7px;
  color: var(--text);
  font-size: 28px;
  line-height: 1.05;
  letter-spacing: 0;
  font-weight: 600;
`


const CampaignCard = styled(GlassCard)`
  padding: 15px;
  margin-bottom: 10px;
  color: #050505;
  background: var(--yellow);
  border: 0;
`

const CampaignTop = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
`

const MicBubble = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  color: #fff;
  background: #050505;
`

const VoiceText = styled.div`
  strong {
    display: block;
    margin-bottom: 3px;
    color: #050505;
    font-size: 15px;
    line-height: 1.22;
    font-weight: 500;
    letter-spacing: 0;
  }

  span {
    color: rgba(5,5,5,.64);
    font-size: 12px;
    font-weight: 650;
  }
`

const StarMark = styled.span`
  position: relative;
  width: 32px;
  height: 32px;
  display: block;
  flex: 0 0 32px;
  color: #050505;
  transform: rotate(-8deg);

  &::before {
    content: '';
    position: absolute;
    inset: 3px;
    background: currentColor;
    clip-path: polygon(
      50% 0%,
      58% 35%,
      85% 15%,
      65% 42%,
      100% 50%,
      65% 58%,
      85% 85%,
      58% 65%,
      50% 100%,
      42% 65%,
      15% 85%,
      35% 58%,
      0% 50%,
      35% 42%,
      15% 15%,
      42% 35%
    );
  }
`


const PrimaryButton = styled.button`
  width: 100%;
  min-height: 46px;
  margin-top: 12px;
  border: 0;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #050505;
  background: #f4f4ef;
  font-weight: 500;
  letter-spacing: 0;

  svg {
    width: 17px;
    height: 17px;
    flex: 0 0 17px;
  }

  &:focus-visible {
    outline: 2px solid #050505;
    outline-offset: 2px;
  }
`

const StatsGrid = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 17px;
`

const Stat = styled.article`
  min-height: 116px;
  padding: 14px;
  border-radius: 21px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: ${({ bg }) => bg};
  color: ${({ dark }) => (dark ? '#050505' : '#f4f4ef')};

  span {
    display: flex;
    align-items: center;
    gap: 6px;
    color: inherit;
    opacity: .78;
    font-size: 12px;
    font-weight: 500;
  }

  svg {
    width: 15px;
    height: 15px;
    flex: 0 0 15px;
    stroke-width: 2.2;
  }

  strong {
    display: block;
    font-size: 34px;
    line-height: .9;
    letter-spacing: 0;
    font-weight: 600;
  }
`

const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;

  h2 {
    margin: 0;
    font-size: 17px;
    font-weight: 500;
    letter-spacing: 0;
  }

  button {
    min-height: 31px;
    padding: 0 13px;
    border: 0;
    border-radius: 999px;
    background: #f4f4ef;
    color: #050505;
    font-size: 12px;
    font-weight: 500;
  }
`

const TaskList = styled(GlassCard)`
  padding: 8px 11px;
`

const TaskRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 10px;
  align-items: center;
  min-height: 53px;
  border-bottom: 1px solid var(--line);

  &:last-child {
    border-bottom: 0;
  }

  p {
    margin: 0;
    color: var(--text);
    font-size: 14px;
    line-height: 1.22;
    font-weight: 400;
  }

  small {
    display: block;
    margin-top: 3px;
    color: #777b78;
    font-size: 11px;
  }
`

const MiniStatus = styled.span`
  min-width: 57px;
  padding: 7px 9px;
  border-radius: 999px;
  text-align: center;
  background: ${({ tone }) => tone.bg};
  color: ${({ tone }) => tone.fg};
  font-size: 11px;
  font-weight: 500;
`

const Dot = styled.span`
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: ${({ tone }) => tone};
`

function taskTone(task) {
  if (task.completed) return 'var(--green)'
  if (task.priority === 'high') return 'var(--pink)'
  if (task.priority === 'medium') return 'var(--yellow)'
  return 'var(--blue)'
}

function taskStatus(task) {
  if (task.completed) return { label: 'Готово', bg: 'var(--green)', fg: '#050505' }
  if (task.priority === 'high') return { label: 'Проверка', bg: 'var(--yellow)', fg: '#050505' }
  return { label: 'В работе', bg: 'var(--blue)', fg: '#ffffff' }
}

function taskTime(task) {
  try {
    return new Date(task.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  } catch {
    return '11:30'
  }
}

export default function Home() {
  const { user, tasks, setActiveTab } = useAppStore()
  const active = tasks.filter((task) => !task.completed).length
  const completed = tasks.filter((task) => task.completed).length
  const blockers = tasks.filter((task) => task.priority === 'high' && !task.completed).length
  const recent = tasks.slice(0, 3)

  return (
    <>
      <Header>
        <Brand aria-label="KAED">
          <img src={kaedLogo} alt="" />
        </Brand>
        <Avatar aria-label="Профиль пользователя">{(user?.first_name || 'Э')[0]}</Avatar>
      </Header>

      <Hero>
        <Title>Привет, {user?.first_name || 'Эвелина'}</Title>
      </Hero>

      <CampaignCard as="section" aria-labelledby="record-title">
        <CampaignTop>
          <MicBubble aria-hidden="true"><Mic size={25} /></MicBubble>
          <VoiceText>
            <strong id="record-title">Записать голосовой статус</strong>
          </VoiceText>
          <StarMark aria-hidden="true" />
        </CampaignTop>
        <PrimaryButton type="button" onClick={() => setActiveTab('voice')}>
          Начать запись <ArrowRight aria-hidden="true" />
          </PrimaryButton>
      </CampaignCard>

      <StatsGrid aria-label="Статистика задач">
        <Stat bg="var(--pink)" dark><span><Sprout size={14} />Активные</span><strong>{active}</strong></Stat>
        <Stat bg="var(--blue)"><span><Check size={15} />Готово</span><strong>{completed}</strong></Stat>
        <Stat bg="var(--green)" dark><span><CircleAlert size={15} />Избранное</span><strong>{blockers}</strong></Stat>
        <Stat bg="var(--panel-2)"><span>Jira синхронизация</span><strong>ON</strong></Stat>
      </StatsGrid>

      <SectionTitle>
        <h2>Последние задачи</h2>
        <button type="button" onClick={() => setActiveTab('tasks')}>Все</button>
      </SectionTitle>

      <TaskList as="section" aria-label="Последние задачи">
        {recent.map((task) => {
          const status = taskStatus(task)
          return (
            <TaskRow key={task.id}>
              <Dot tone={taskTone(task)} />
              <div>
                <p>{task.title}</p>
                <small>{taskTime(task)}</small>
              </div>
              <MiniStatus tone={status}>{status.label}</MiniStatus>
            </TaskRow>
          )
        })}
      </TaskList>
    </>
  )
}
