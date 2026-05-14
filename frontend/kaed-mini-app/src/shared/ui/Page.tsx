import type {
  ReactNode,
} from 'react'

import {
  motion,
} from 'framer-motion'

interface Props {
  title: string

  children: ReactNode

  rightSlot?: ReactNode
}

export default function Page({
  title,
  children,
  rightSlot,
}: Props) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: 20,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      exit={{
        opacity: 0,
        x: -20,
      }}
      transition={{
        duration: 0.2,
      }}
      className="
        min-h-screen
        safe-top
        safe-bottom
        bg-background
      "
    >
      <div className="sticky top-0 z-40 backdrop-blur-2xl bg-background/80 border-b border-border">
        <div className="h-24 flex items-end justify-between px-5 pb-5">
          <div className="text-4xl font-bold tracking-tight">
            {title}
          </div>

          {rightSlot && (
            <div className="pb-1">
              {rightSlot}
            </div>
          )}
        </div>
      </div>

      <div className="p-5 pb-32">
        {children}
      </div>
    </motion.div>
  )
}