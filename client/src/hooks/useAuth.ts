import { ROLE } from '~/config/roles'
import { useAppSelector } from './useRedux'
import { selectCurrentToken } from '~/features/auth/authSlice'
import jwtDecode from 'jwt-decode'

type JwtPayload = {
  UserInfo: {
    username: string
    roles: ROLE[]
  }
}

const useAuth = () => {
  const token = useAppSelector(selectCurrentToken)
  let isUser = false
  let isAdmin = false

  if (token) {
    const decoded = jwtDecode(token) as JwtPayload
    const { username, roles } = decoded.UserInfo

    isUser = roles?.includes('User')
    isAdmin = roles?.includes('Admin')

    return { username, roles, isUser, isAdmin }
  }

  return { username: '', roles: [], isUser, isAdmin }
}

export default useAuth
