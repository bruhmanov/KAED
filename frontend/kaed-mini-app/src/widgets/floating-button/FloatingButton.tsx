import { Plus } from 'lucide-react'

import {
  motion,
} from 'framer-motion'

import {
  hapticImpact,
} from '../../app/telegram/telegram'

interface Props {
  onClick: () => void

  disabled?: boolean
}

export default function FloatingButton({
  onClick,

  disabled = false,
}: Props) {
  return (
    <motion.button
      whileTap={
        !disabled
          ? {
              scale: 0.9,
            }
          : undefined
      }
      whileHover={
        !disabled
          ? {
              scale: 1.05,
            }
          : undefined
      }
      onClick={() => {
        if (disabled) {
          return
        }

        hapticImpact(
          'medium'
        )

        onClick()
      }}
      disabled={disabled}
      className="
        fixed
        bottom-28
        right-5
        w-16
        h-16
        rounded-full
        bg-primary
        shadow-2xl
        flex
        items-center
        justify-center
        z-40
        transition
        disabled:opacity-50
        disabled:pointer-events-none
      "
    >
      <Plus size={28} />
    </motion.button>
  )
}