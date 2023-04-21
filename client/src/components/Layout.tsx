import React from 'react'
import { Box } from '@mui/material'

type PropsType = {
  children: React.ReactNode
}

const Layout = ({ children }: PropsType) => {
  return (
    <Box className="flex h-screen w-screen flex-col items-center justify-center gap-4 bg-black text-white">
      {children}
    </Box>
  )
}

export default Layout
