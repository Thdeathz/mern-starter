import React, { useEffect, useState } from 'react'
import { message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { LoadingOutlined } from '@ant-design/icons'

import { useForgotPasswordMutation } from '../store/authApiSlice'

type PropsType = {
  resetEmail: string
}

const CountDownTimer = ({ resetEmail }: PropsType) => {
  const navigate = useNavigate()
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation()

  const [timer, setTimer] = useState<number>(90)
  const [disable, setDisable] = useState<boolean>(true)

  const onReSendOTP = async () => {
    if (disable || isLoading) return

    try {
      const response = await forgotPassword(resetEmail)
      if (!response) return
      setTimer(90)
      setDisable(true)
    } catch (error) {
      message.error('No server response. Please try again later ><!')
      navigate('/login')
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(lastTimerCount => {
        lastTimerCount <= 1 && clearInterval(interval)
        if (lastTimerCount <= 1) setDisable(false)
        if (lastTimerCount <= 0) return lastTimerCount
        return lastTimerCount - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [disable])

  return (
    <div className="mt-2 text-base">
      Didn't recieve code?{' '}
      <button
        type="button"
        onClick={onReSendOTP}
        disabled={disable || isLoading}
        className={`
        h-5 cursor-pointer font-medium transition-all
        ${disable || isLoading ? 'text-disable' : ' text-primary-5 hover:border-b'}
      `}
      >
        {disable ? (
          `Resend in ${timer}s`
        ) : isLoading ? (
          <LoadingOutlined className="ml-4" />
        ) : (
          'Resend OTP'
        )}
      </button>
    </div>
  )
}

export default CountDownTimer
