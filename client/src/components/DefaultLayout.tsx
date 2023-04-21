import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type PropsType = {
  children: React.ReactNode
}

const variants = {
  hidden: { opacity: 0, x: 20 },
  enter: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, type: 'easeOut', when: 'beforeChildren' }
  },
  exit: { opacity: 0, x: -20 }
}

const DefaultLayout = ({ children }: PropsType) => {
  return (
    <AnimatePresence
      initial={true}
      onExitComplete={() => {
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0 })
        }
      }}
    >
      <div className="flex-center h-screen w-screen overflow-hidden">
        <motion.div
          className="rounded-md border border-neutral-5 p-4 shadow-sm"
          variants={variants}
          initial="hidden"
          animate="enter"
          exit="exit"
        >
          {children}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default DefaultLayout
