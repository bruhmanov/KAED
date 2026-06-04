import styled from '@emotion/styled'

const GlassCard = styled.article`
  position: relative;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: ${({ radius = 18 }) => radius}px;
  background: var(--panel);
  box-shadow: none;
  backdrop-filter: none;
`

export default GlassCard
