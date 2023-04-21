import React, { useEffect, useRef, useState } from 'react'
import usePersist from '~/hooks/usePersist'
import { useAppSelector } from '~/hooks/useRedux'
import { selectCurrentToken } from './authSlice'
import { useRefreshMutation } from './authApiSlice'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { DefaultLayout } from '~/components'

const PersistLogin = () => {
  const location = useLocation()
  const { persist } = usePersist()
  const token = useAppSelector(selectCurrentToken)
  const effectRan = useRef(false)

  const [trueSuccess, setTrueSuccess] = useState<boolean>(false)

  const [refresh, { isUninitialized, isLoading, isSuccess }] = useRefreshMutation()

  useEffect(() => {
    if (effectRan.current === true || import.meta.env.VITE_NODE_ENV !== 'development') {
      const verifyRefreshToken = async () => {
        try {
          await refresh(undefined)
          setTrueSuccess(true)
        } catch (error) {
          console.error(error)
        }
      }

      if (!token && persist) verifyRefreshToken()
    }

    return () => {
      effectRan.current = true
    }
  }, [persist, refresh, token])
  return (
    <>
      {!persist || (isSuccess && trueSuccess) || (token && isUninitialized) ? (
        <Outlet />
      ) : isLoading ? (
        <DefaultLayout>Loading...</DefaultLayout>
      ) : (
        trueSuccess && <Navigate to="/login" state={{ from: location }} replace />
      )}
    </>
  )
}

export default PersistLogin
