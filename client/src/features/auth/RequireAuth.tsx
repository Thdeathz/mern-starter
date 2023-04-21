import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ROLE } from '~/config/roles'
import useAuth from '~/hooks/useAuth'

type PropsType = {
  allowedRoles: ROLE[]
}

const RequireAuth = ({ allowedRoles }: PropsType) => {
  const location = useLocation()
  const { roles } = useAuth()

  return (
    <>
      {roles.some(role => allowedRoles.includes(role)) ? (
        <Outlet />
      ) : (
        <Navigate to="/login" state={{ from: location }} replace />
      )}
    </>
  )
}

export default RequireAuth
