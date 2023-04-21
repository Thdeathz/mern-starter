import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Tooltip, message } from 'antd'
import { LogoutOutlined } from '@ant-design/icons'

import useAuth from '~/hooks/useAuth'
import { useAppSelector } from '~/hooks/useRedux'
import { DefaultLayout } from '~/components'
import { selectCurrentToken } from '../auth/store/authSlice'
import { useSendLogoutMutation } from '../auth/store/authApiSlice'
import { useGetUsersQuery } from './store/usersApiSlice'

const Welcome = () => {
  const navigate = useNavigate()
  const { email, roles, isAdmin } = useAuth()
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
      <div className="min-w-[24rem] max-w-[24rem] break-words rounded">
        <div className="flex items-start justify-between">
          <p>
            Logged in as: {email}
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
              <p key={userId}>{`${userId} - ${users.entities[userId]?.email}`}</p>
            ))}
          </>
        )}
      </div>
    </DefaultLayout>
  )
}

export default Welcome
