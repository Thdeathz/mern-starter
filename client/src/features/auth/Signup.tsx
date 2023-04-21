import React, { useState } from 'react'
import { DefaultLayout } from '~/components'
import { Link, useNavigate } from 'react-router-dom'
import { useSignupMutation } from './authApiSlice'
import { Button, Form, Input, message } from 'antd'
import { LoadingOutlined, LockOutlined, UserOutlined } from '@ant-design/icons'

type FormData = {
  username: string
  password: string
}

const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

const Signup = () => {
  const navigate = useNavigate()

  const [form] = Form.useForm()
  const [signup, { isLoading }] = useSignupMutation()

  const [passwordVisible, setPasswordVisible] = useState<boolean>(false)

  const onFinish = async (data: FormData) => {
    try {
      const { username, password } = data
      await signup({ username, password }).unwrap()
      form.resetFields()
      message.success('Create accout successfully!')
      navigate('/')
    } catch (error) {
      const apiError = error as { status: number }
      if (apiError.status === 409) {
        form.setFields([{ name: 'username', errors: ['User already exists'] }])
      } else {
        message.error('No server response. Please try again later ><!')
      }
    }
  }

  return (
    <DefaultLayout>
      <p className="mb-2 text-4xl font-bold">Sign up</p>

      <Form
        form={form}
        name="register"
        size="large"
        autoComplete="off"
        onFinish={onFinish}
        className="min-w-[24rem]"
      >
        <Form.Item
          name="username"
          rules={[
            { required: true, message: 'Username is required.' },
            { pattern: USER_REGEX, message: 'Username is not valid.' }
          ]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Password is required.' },
            { pattern: PWD_REGEX, message: 'Password must be between 4-12 characters.' }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="Password"
            visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
          />
        </Form.Item>

        <Form.Item>
          <Button
            className="flex items-center justify-center"
            type="primary"
            ghost
            htmlType="submit"
            block
          >
            {isLoading ? (
              <LoadingOutlined className="flex items-center justify-center text-lg" />
            ) : (
              'Create account'
            )}
          </Button>
        </Form.Item>

        <div className="mt-2 text-base">
          Already has account?{' '}
          <Link
            to="/login"
            className="cursor-pointer font-medium text-primary-5 transition-all hover:border-b"
          >
            Login
          </Link>
        </div>
      </Form>
    </DefaultLayout>
  )
}

export default Signup
