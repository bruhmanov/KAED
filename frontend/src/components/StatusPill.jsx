import styled from '@emotion/styled'

const colorMap = {
  blue: ['var(--blue)', '#ffffff'],
  lime: ['var(--green)', '#050505'],
  pink: ['var(--pink)', '#050505'],
  yellow: ['var(--yellow)', '#050505'],
  red: ['#ff6259', '#050505'],
  muted: ['#f4f4ef', '#050505'],
  dark: ['#171717', '#f2f2ef'],
}

const Pill = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 30px;
  padding: 7px 11px;
  border-radius: 999px;
  background: ${({ tone = 'dark' }) => colorMap[tone]?.[0] || colorMap.dark[0]};
  color: ${({ tone = 'dark' }) => colorMap[tone]?.[1] || colorMap.dark[1]};
  border: ${({ tone = 'dark' }) => (tone === 'dark' ? '1px solid var(--line)' : '0')};
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0;
  white-space: nowrap;

  &::before {
    content: '';
    display: ${({ dot = true }) => (dot ? 'block' : 'none')};
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: currentColor;
  }
`

export default function StatusPill({ children, tone = 'dark', dot = true }) {
  return (
    <Pill tone={tone} dot={dot}>
      {children}
    </Pill>
  )
}
