import React, { useEffect, useRef, useState } from 'react'
import usePersist from '~/hooks/usePersist'
import { useAppSelector } from '~/hooks/useRedux'
import { selectCurrentToken } from './authSlice'
import { useRefreshMutation } from './authApiSlice'
import { Link, Outlet } from 'react-router-dom'
import { Layout } from '~/components'

const PersistLogin = () => {
  const { persist } = usePersist()
  const token = useAppSelector(selectCurrentToken)
  const effectRan = useRef(false)

  const [trueSuccess, setTrueSuccess] = useState<boolean>(false)

  const [refresh, { isUninitialized, isLoading, isSuccess, error }] = useRefreshMutation()

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
        <Layout>Loading...</Layout>
      ) : (
        <Layout>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {`${(error as any)?.data?.message} - `}{' '}
          <Link to="/login" className="text-2xl">
            Please <span className="underline hover:text-blue-500">login</span> again
          </Link>
        </Layout>
      )}
    </>
  )
}

export default PersistLogin
