import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { LoadingOutlined, LockOutlined } from '@ant-design/icons'

import { useAppSelector } from '~/hooks/useRedux'
import { selectResetEmail, selectVerified } from './store/authSlice'
import { DefaultLayout } from '~/components'
import { Button, Form, Input, message } from 'antd'
import { useResetPasswordMutation } from './store/authApiSlice'

const ResetPassword = () => {
  const navigate = useNavigate()
  const verified = useAppSelector(selectVerified)
  const resetEmail = useAppSelector(selectResetEmail)
  const [form] = Form.useForm<ResetPasswordRequest>()
  const [resetPassword, { isLoading }] = useResetPasswordMutation()

  const [passwordVisible, setPasswordVisible] = useState<boolean>(false)

  const onFinish = async (values: ResetPasswordRequest) => {
    if (!resetEmail) return

    if (values.password !== values.confirmPassword) {
      form.setFields([
        {
          name: 'confirmPassword',
          errors: ['Password does not match.']
        }
      ])
      return
    }

    try {
      await resetPassword({
        email: resetEmail,
        password: values.password,
        confirmPassword: values.confirmPassword
      }).unwrap()

      form.resetFields()
      message.success('Reset password successfully!')
      navigate('/login')
    } catch (error) {
      console.error(error)
      message.error('Something went wrong. Please try again later ><!')
    }
  }

  return (
    <>
      {verified && resetEmail ? (
        <DefaultLayout>
          <p className="text-3xl font-semibold">Reset password</p>

          <Form size="large" form={form} onFinish={onFinish} className="min-w-[24rem]">
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Password is required.' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="New password"
                autoComplete="current-password"
                visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              rules={[{ required: true, message: 'Confirm password is required.' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Confirm password"
                autoComplete="current-password"
                visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                className="flex-center"
                type="primary"
                ghost
                htmlType="submit"
                block
                disabled={isLoading}
              >
                {isLoading ? <LoadingOutlined className="flex-center text-lg" /> : 'Reset password'}
              </Button>
            </Form.Item>
          </Form>
        </DefaultLayout>
      ) : (
        <Navigate to="/forgot-password" />
      )}
    </>
  )
}

export default ResetPassword
