import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Button, Form, Input, message } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

import { DefaultLayout } from '~/components'
import { useAppSelector } from '~/hooks/useRedux'
import { selectResetEmail } from './store/authSlice'
import CountDownTimer from './components/CountDownTimer'
import { useVerifyOTPTokenMutation } from './store/authApiSlice'

type OTPInputProps = {
  name: string
}

const OTPInput = ({ name }: OTPInputProps) => {
  return (
    <Form.Item name={name}>
      <Input className="h-16 w-16 text-center text-2xl" maxLength={1} autoComplete="off" />
    </Form.Item>
  )
}

const VerifyOTP = () => {
  const navigate = useNavigate()
  const resetEmail = useAppSelector(selectResetEmail)
  const [form] = Form.useForm<OTP>()

  const [verifyOTP, { isLoading }] = useVerifyOTPTokenMutation()

  const onFinish = async (values: OTP) => {
    const { first, second, third, fourth } = values
    const otpToken = `${first}${second}${third}${fourth}`

    try {
      await verifyOTP({ otpToken, email: resetEmail }).unwrap()
      form.resetFields()
      message.success('Verify OTP successfully.')
      navigate('/reset-password')
    } catch (error) {
      const apiError = error as ApiError
      if (apiError.status === 401) {
        form.setFields([
          {
            name: 'first',
            errors: [' ']
          },
          {
            name: 'second',
            errors: [' ']
          },
          {
            name: 'third',
            errors: [' ']
          },
          {
            name: 'fourth',
            errors: [' ']
          }
        ])
        switch (apiError.data.message) {
          case 'Unauthorized/InvalidToken':
            message.error('Token invalid.')
            break
          case 'Unauthorized/TokenExpired':
            message.error('Token expired.')
            break
          default:
            break
        }
      } else {
        message.error('No server response. Please try again later ><!')
        navigate('/forgot-password')
      }
    }
  }

  return (
    <>
      {console.log('==> re-render')}
      {resetEmail ? (
        <DefaultLayout>
          <p className="text-3xl font-semibold">Email verification</p>

          <Form size="large" form={form} onFinish={onFinish} className="min-w-[20rem]">
            <div className="flex w-full flex-row items-center justify-between gap-2">
              <OTPInput name="first" />

              <OTPInput name="second" />

              <OTPInput name="third" />

              <OTPInput name="fourth" />
            </div>

            <Form.Item>
              <Button
                disabled={isLoading}
                className="flex-center"
                type="primary"
                ghost
                htmlType="submit"
                block
              >
                {isLoading ? <LoadingOutlined className="flex-center text-lg" /> : 'Verify Account'}
              </Button>
            </Form.Item>

            <CountDownTimer resetEmail={resetEmail} />
          </Form>
        </DefaultLayout>
      ) : (
        <Navigate to="/forgot-password" />
      )}
    </>
  )
}

export default VerifyOTP
