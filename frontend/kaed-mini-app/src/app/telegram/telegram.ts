declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp
    }
  }
}

interface TelegramUser {
  id: number

  first_name: string

  username?: string
}

interface TelegramThemeParams {
  bg_color?: string

  secondary_bg_color?: string

  text_color?: string

  hint_color?: string

  button_color?: string

  section_separator_color?: string
}

interface TelegramWebApp {
  ready: () => void

  expand: () => void

  close: () => void

  enableClosingConfirmation?: () => void

  themeParams: TelegramThemeParams

  initData: string

  initDataUnsafe?: {
    user?: TelegramUser
  }

  HapticFeedback?: {
    impactOccurred: (
      style:
        | 'light'
        | 'medium'
        | 'heavy'
    ) => void
  }
}

export const tg =
  window.Telegram?.WebApp

export function initTelegram() {
  if (!tg) {
    console.warn(
      'Telegram WebApp SDK not found'
    )

    return
  }

  tg.ready()

  tg.expand()

  tg.enableClosingConfirmation?.()

  applyTelegramTheme()

  document.body.style.background =
    tg.themeParams.bg_color ||
    '#0B0F19'

  document.documentElement.style.background =
    tg.themeParams.bg_color ||
    '#0B0F19'
}

export function getTelegramUser() {
  return (
    tg?.initDataUnsafe?.user ||
    null
  )
}

export function getTelegramInitData() {
  return tg?.initData || ''
}

export function hapticImpact(
  style:
    | 'light'
    | 'medium'
    | 'heavy' = 'light'
) {
  tg?.HapticFeedback?.impactOccurred(
    style
  )
}

export function applyTelegramTheme() {
  if (!tg?.themeParams) {
    return
  }

  const root =
    document.documentElement

  root.style.setProperty(
    '--background',
    tg.themeParams.bg_color ||
      '#0b0f19'
  )

  root.style.setProperty(
    '--card',
    tg.themeParams
      .secondary_bg_color ||
      '#151b28'
  )

  root.style.setProperty(
    '--text',
    tg.themeParams.text_color ||
      '#ffffff'
  )

  root.style.setProperty(
    '--muted',
    tg.themeParams.hint_color ||
      '#94a3b8'
  )

  root.style.setProperty(
    '--primary',
    tg.themeParams.button_color ||
      '#3b82f6'
  )

  root.style.setProperty(
    '--border',
    tg.themeParams
      .section_separator_color ||
      '#232c3d'
  )
}