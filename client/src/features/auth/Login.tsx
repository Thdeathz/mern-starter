import React, { useState } from 'react'
import { DefaultLayout } from '~/components'
import { Link, useNavigate } from 'react-router-dom'
import { useLoginMutation } from './authApiSlice'
import usePersist from '~/hooks/usePersist'
import { Button, Checkbox, Form, Input, message } from 'antd'
import { LoadingOutlined, LockOutlined, UserOutlined } from '@ant-design/icons'

type FormData = {
  username: string
  password: string
}

const Login = () => {
  const navigate = useNavigate()

  const [form] = Form.useForm()
  const [login, { isLoading }] = useLoginMutation()
  const { persist, setPersist } = usePersist()

  const [passwordVisible, setPasswordVisible] = useState<boolean>(false)

  const onFinish = async (data: FormData) => {
    try {
      const { username, password } = data
      await login({ username, password }).unwrap()
      form.resetFields()
      message.success('Login successfully!')
      navigate('/')
    } catch (error) {
      const apiError = error as ApiError
      console.log('==> api error', apiError)
      if (apiError.status === 401) {
        switch (apiError.data.message) {
          case 'Unauthorized/InvalidUsername':
            form.setFields([
              {
                name: 'username',
                errors: ['Invalid username.']
              }
            ])
            break
          case 'Unauthorized/InvalidPassword':
            form.setFields([
              {
                name: 'password',
                errors: ['Invalid password.']
              }
            ])
            break
          default:
            form.setFields([
              {
                name: 'username',
                errors: [' ']
              },
              {
                name: 'password',
                errors: [' ']
              }
            ])
            break
        }
      } else {
        message.error('No server response. Please try again later ><!')
      }
    }
  }

  return (
    <DefaultLayout>
      <p className="mb-2 text-4xl font-bold">Login</p>

      <Form
        form={form}
        name="login"
        size="large"
        onFinish={onFinish}
        autoComplete="off"
        className="min-w-[24rem]"
      >
        <Form.Item name="username" rules={[{ required: true, message: 'Username is required.' }]}>
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
        </Form.Item>

        <Form.Item name="password" rules={[{ required: true, message: 'Password is required.' }]}>
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="Password"
            visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
          />
        </Form.Item>

        <Checkbox
          defaultChecked={persist}
          onChange={() => setPersist(prev => !prev)}
          className="mb-4"
        >
          Remember me
        </Checkbox>

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
              'Login'
            )}
          </Button>
        </Form.Item>

        <div className="mt-2 text-base">
          Haven't account yet?{' '}
          <Link
            to="/signup"
            className="cursor-pointer font-medium text-primary-5 transition-all hover:border-b"
          >
            Register
          </Link>
        </div>
      </Form>
    </DefaultLayout>
  )
}

export default Login
