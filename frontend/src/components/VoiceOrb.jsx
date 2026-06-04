import styled from '@emotion/styled'
import { Mic, Square } from 'lucide-react'

const OrbWrap = styled.div`
  position: relative;
  display: grid;
  place-items: center;
  height: 190px;
  margin: 0;
`

const Ring = styled.div`
  position: absolute;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: 50%;
  border: 1px solid ${({ active }) => (active ? 'var(--green)' : 'var(--line)')};
  opacity: ${({ opacity }) => opacity};
  animation: ${({ active }) => (active ? 'pulse 1.45s ease-in-out infinite' : 'none')};
  animation-delay: ${({ delay }) => delay}s;

  @keyframes pulse {
    0%, 100% { transform: scale(.96); opacity: .28; }
    50% { transform: scale(1.07); opacity: .72; }
  }
`

const OrbButton = styled.button`
  position: relative;
  z-index: 2;
  width: 116px;
  height: 116px;
  border: 0;
  border-radius: 999px;
  display: grid;
  place-items: center;
  color: #050505;
  background: ${({ active }) => (active ? 'var(--green)' : 'var(--blue)')};
  transition: transform .16s ease, background .16s ease;

  svg {
    width: 52px;
    height: 52px;
    stroke-width: 1.85;
    color: ${({ active }) => (active ? '#050505' : '#ffffff')};
  }

  &:active {
    transform: scale(.96);
  }

  &:focus-visible {
    outline: 2px solid var(--yellow);
    outline-offset: 4px;
  }
`

export default function VoiceOrb({ active, onClick }) {
  return (
    <OrbWrap aria-label="Голосовая запись">
      <Ring size={138} opacity={0.56} active={active} delay={0} />
      <Ring size={166} opacity={0.36} active={active} delay={0.2} />
      <Ring size={192} opacity={0.22} active={active} delay={0.4} />
      <OrbButton type="button" active={active} onClick={onClick} aria-label={active ? 'Остановить запись' : 'Начать запись'}>
        {active ? <Square aria-hidden="true" /> : <Mic aria-hidden="true" />}
      </OrbButton>
    </OrbWrap>
  )
}
