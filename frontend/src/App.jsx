import { useEffect } from 'react'
import styled from '@emotion/styled'
import Home from './pages/Home.jsx'
import Tasks from './pages/Tasks.jsx'
import Voice from './pages/Voice.jsx'
import Jira from './pages/Jira.jsx'
import BottomNav from './components/BottomNav.jsx'
import { useAppStore } from './store/useAppStore.js'

const pageMap = {
  home: Home,
  tasks: Tasks,
  voice: Voice,
  jira: Jira,
}

const Root = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  background: var(--bg);
`

const Phone = styled.div`
  position: relative;
  width: var(--app-width);
  min-height: 100vh;
  overflow: hidden;
  color: var(--text);
  background: var(--bg);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: .24;
    background-image:
      radial-gradient(circle, rgba(255,255,255,.20) 0 1px, transparent 1px),
      radial-gradient(circle, rgba(255,255,255,.10) 0 1px, transparent 1px);
    background-size: 28px 28px, 58px 58px;
    background-position: 8px 10px, 22px 27px;
    mask-image: linear-gradient(
      to bottom,
      #000 0%,
      rgba(0,0,0,.75) 38%,
      transparent 100%
    );
  }
`

const BackgroundLines = styled.svg`
  position: absolute;
  z-index: 0;
  left: 0;
  top: 0;
  width: 390px;
  height: 820px;
  pointer-events: none;
  overflow: visible;

  path {
    fill: none;
    stroke: rgba(255, 255, 255, .13);
    stroke-width: 1.15;
    vector-effect: non-scaling-stroke;
  }
`

const Star = styled.div`
  position: absolute;
  z-index: 0;
  left: ${({ x }) => x};
  top: ${({ y }) => y};
  width: ${({ size = 18 }) => size}px;
  height: ${({ size = 18 }) => size}px;
  color: ${({ color = 'var(--yellow)' }) => color};
  pointer-events: none;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: currentColor;
    clip-path: polygon(
      50% 0%,
      61% 39%,
      100% 50%,
      61% 61%,
      50% 100%,
      39% 61%,
      0% 50%,
      39% 39%
    );
  }
`

const Content = styled.main`
  position: relative;
  z-index: 1;
  width: 100%;
  min-height: 100vh;
  padding: 10px var(--content-x) calc(86px + var(--tg-safe-bottom));
  overflow-x: hidden;
`

export default function App() {
  const { activeTab, setActiveTab, bootstrap } = useAppStore()
  const Page = pageMap[activeTab] || Home

  useEffect(() => {
    bootstrap()

    const syncRoute = () => {
      const nextTab = window.location.hash.replace('#', '') || 'home'
      if (pageMap[nextTab]) setActiveTab(nextTab)
    }

    syncRoute()
    window.addEventListener('hashchange', syncRoute)

    return () => window.removeEventListener('hashchange', syncRoute)
  }, [bootstrap, setActiveTab])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [activeTab])

  return (
    <Root>
      <Phone>
        <BackgroundLines
          viewBox="0 0 390 820"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M-35 92 C 42 92, 96 94, 148 84 C 210 72, 253 45, 292 -8" />

          <path d="M-132 152 C -36 152, 54 180, 61 254 C 69 337, -36 384, -132 386" />

          <path d="M428 246 C 356 282, 323 332, 323 408 C 323 490, 361 544, 430 566" />
        </BackgroundLines>

        <Star x="86%" y="25px" size={18} color="var(--yellow)" />
        <Star x="80%" y="198px" size={9} color="var(--blue)" />
        <Star x="8%" y="188px" size={14} color="var(--pink)" />

        <Content>
          <Page />
        </Content>

        <BottomNav />
      </Phone>
    </Root>
  )
}
