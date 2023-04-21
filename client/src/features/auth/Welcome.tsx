import React from 'react'
import { Box, ButtonBase, Typography } from '@mui/material'
import { Layout } from '~/components'
import { useAppSelector } from '~/hooks/useRedux'
import { selectCurrentToken } from './authSlice'
import useAuth from '~/hooks/useAuth'
import { LogoutOutlined } from '@mui/icons-material'
import { useSendLogoutMutation } from './authApiSlice'
import { useNavigate } from 'react-router-dom'
import { useGetUsersQuery } from '../users/usersApiSlice'

const Welcome = () => {
  const navigate = useNavigate()
  const { username, roles, isAdmin } = useAuth()
  const token = useAppSelector(selectCurrentToken)

  const [sendLogout] = useSendLogoutMutation()

  const { data: users } = useGetUsersQuery('usersList', {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  })

  const onLogout = async () => {
    try {
      await sendLogout(undefined)
      navigate('/')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Layout>
      <Box className="min-h-[50vh] w-[90vw] break-words rounded bg-gray-500 px-6 py-4 sm:w-[50vw] lg:w-[30vw] 2xl:w-[450px]">
        <Box className="flex items-start justify-between">
          <Typography>
            Logged in as: {username}
            <br />
            Roles: {roles?.join(', ')}
          </Typography>

          <ButtonBase className="hover:text-blue-500" onClick={onLogout}>
            <LogoutOutlined />
          </ButtonBase>
        </Box>

        <Typography>
          Current token: <br /> {token}
        </Typography>
        {isAdmin && (
          <>
            <Typography>Avalable user list: </Typography>
            {users?.ids.map(userId => (
              <Typography
                key={userId}
              >{`${userId} - ${users.entities[userId]?.username}`}</Typography>
            ))}
          </>
        )}
      </Box>
    </Layout>
  )
}

export default Welcome
