import React from 'react'
import { DefaultLayout } from '~/components'
import { useAppSelector } from '~/hooks/useRedux'
import { selectCurrentToken } from './authSlice'
import useAuth from '~/hooks/useAuth'
import { useSendLogoutMutation } from './authApiSlice'
import { useNavigate } from 'react-router-dom'
import { useGetUsersQuery } from '../users/usersApiSlice'
import { Tooltip, message } from 'antd'
import { LogoutOutlined } from '@ant-design/icons'

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
      message.success('Logout successfully!')
      navigate('/')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <DefaultLayout>
      <div className="bg-gray-500 min-w-[24rem] max-w-[24rem] break-words rounded">
        <div className="flex items-start justify-between">
          <p>
            Logged in as: {username}
            <br />
            Roles: {roles?.join(', ')}
          </p>

          <Tooltip title="logout" arrow={false}>
            <LogoutOutlined
              className="text-xl transition-colors hover:text-primary-5"
              onClick={onLogout}
            />
          </Tooltip>
        </div>

        <p>
          Current token: <br /> {token}
        </p>
        {isAdmin && (
          <>
            <p>Avalable user list: </p>
            {users?.ids.map(userId => (
              <p key={userId}>{`${userId} - ${users.entities[userId]?.username}`}</p>
            ))}
          </>
        )}
      </div>
    </DefaultLayout>
  )
}

export default Welcome
