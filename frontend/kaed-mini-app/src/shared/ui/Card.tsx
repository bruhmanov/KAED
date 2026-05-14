import type {
  ReactNode,
} from 'react'

import {
  motion,
} from 'framer-motion'

interface Props {
  children: ReactNode

  className?: string

  onClick?: () => void
}

export default function Card({
  children,
  className = '',

  onClick,
}: Props) {
  return (
    <motion.div
      whileTap={{
        scale: 0.98,
      }}
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.2,
      }}
      onClick={onClick}
      className={`
        bg-card/95
        backdrop-blur-xl
        border border-border
        rounded-3xl
        p-5
        shadow-2xl
        transition
        ${
          onClick
            ? 'cursor-pointer active:scale-[0.98]'
            : ''
        }
        ${className}
      `}
    >
      {children}
    </motion.div>
  )
}