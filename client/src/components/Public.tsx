import React from 'react'
import { Box, ButtonBase, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import Layout from './Layout'

const Public = () => {
  const navigate = useNavigate()

  return (
    <Layout>
      <Typography className="text-6xl font-bold">Mern app</Typography>
      <Box className="flex items-center justify-center gap-4">
        <ButtonBase
          className="rounded bg-white px-2 py-1 text-xl font-bold text-black"
          onClick={() => navigate('/login')}
        >
          Login
        </ButtonBase>
        <ButtonBase
          className="rounded bg-white px-2 py-1 text-xl font-bold text-black"
          onClick={() => navigate('/signup')}
        >
          Sign up
        </ButtonBase>
      </Box>
    </Layout>
  )
}

export default Public
