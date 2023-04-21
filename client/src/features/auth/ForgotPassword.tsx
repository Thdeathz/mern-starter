import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Form, Input, message } from 'antd'
import { ArrowLeftOutlined, LoadingOutlined } from '@ant-design/icons'

import { DefaultLayout } from '~/components'
import { EMAIL_REGEX } from '~/config/regex'
import { useForgotPasswordMutation } from './store/authApiSlice'

type ForgotPasswordForm = {
  email: string
}

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm<ForgotPasswordForm>()

  const [forgotPassword, { isLoading, isSuccess }] = useForgotPasswordMutation()

  const onFinish = async (values: ForgotPasswordForm) => {
    try {
      const response = await forgotPassword(values.email).unwrap()
      if (!response) return

      message.success('Forgot password link has been sent to your email.')
      navigate('/verify-email')
    } catch (error) {
      const apiError = error as ApiError
      if (apiError.status === 401) {
        form.setFields([
          {
            name: 'email',
            errors: ['Email is not registered.']
          }
        ])
      } else {
        message.error('No server response. Please try again later ><!')
      }
    }
  }

  return (
    <DefaultLayout>
      <div className="min-w-[24rem] max-w-[24rem]">
        <p className="text-3xl font-bold">Forgot password</p>

        <Form
          form={form}
          name="forgot-password"
          size="large"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Email is required.' },
              { pattern: EMAIL_REGEX, message: 'Email is not valid.' }
            ]}
          >
            <Input placeholder="Enter your email" disabled={isSuccess} />
          </Form.Item>

          <Form.Item>
            <Button
              className="flex-center"
              type="primary"
              ghost
              htmlType="submit"
              block
              disabled={isLoading || isSuccess}
            >
              {isLoading ? <LoadingOutlined className="flex-center text-lg" /> : 'Send OTP'}
            </Button>
          </Form.Item>

          <button
            className="flex-center gap-2 text-base font-medium transition-colors hover:text-primary-5"
            onClick={() => navigate('/login')}
          >
            <ArrowLeftOutlined /> Back to login
          </button>
        </Form>
      </div>
    </DefaultLayout>
  )
}

export default ForgotPassword
