import React, { useState } from 'react'
import {
  Box,
  ButtonBase,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography
} from '@mui/material'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Layout } from '~/components'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { Link, useNavigate } from 'react-router-dom'
import { useSignupMutation } from './authApiSlice'

type FormData = {
  username: string
  password: string
  confirmPwd: string
}

const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

const Signup = () => {
  const navigate = useNavigate()
  const [signup, { isLoading }] = useSignupMutation()

  const [showPassword, setShowPassword] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors }
  } = useForm<FormData>()

  const onSubmit: SubmitHandler<FormData> = async data => {
    try {
      const { username, password } = data
      await signup({ username, password }).unwrap()

      reset()
      navigate('/home')
    } catch (error) {
      const apiError = error as { status: number }
      if (apiError.status === 409) {
        setError('username', {
          type: 'duplicate',
          message: 'User already exists'
        })
      } else {
        setError('root.serverError', {
          type: 'noResponse'
        })
      }
    }
  }

  return (
    <Layout>
      <Box className="w-[90vw] rounded bg-gray-500 px-6 py-4 sm:w-[50vw] lg:w-[30vw] 2xl:w-[450px]">
        <Typography variant="h4" className="text-4xl font-bold">
          Sign up
        </Typography>

        <Box className="mb-2 flex h-[5vh] items-center justify-start text-red-500">
          {errors.root?.serverError.type === 'noResponse' && (
            <Typography>No server response</Typography>
          )}
        </Box>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Username"
            variant="standard"
            autoComplete="false"
            required
            fullWidth
            autoFocus
            error={!!errors.username}
            helperText={errors.username?.message ?? ' '}
            {...register('username', {
              required: 'Username is required',
              pattern: {
                value: USER_REGEX,
                message: 'Username must be 3-20 characters'
              }
            })}
          />

          <TextField
            label="Password"
            variant="standard"
            required
            autoComplete="true"
            fullWidth
            margin="dense"
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(prev => !prev)}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={!!errors.password}
            helperText={errors.password?.message ?? ' '}
            {...register('password', {
              required: 'Password is required',
              pattern: {
                value: PWD_REGEX,
                message: 'Password must be 4-12 characters'
              }
            })}
          />

          <Box className="mt-2 flex flex-col items-start justify-start gap-4">
            <ButtonBase
              type="submit"
              className="rounded-md bg-white px-2 py-1 font-bold text-black"
            >
              {!isLoading ? (
                'Create account'
              ) : (
                <CircularProgress className="text-width text-black" size={24} />
              )}
            </ButtonBase>

            <Link to="/login" className="underline hover:text-blue-600">
              Login ?
            </Link>
          </Box>
        </form>
      </Box>
    </Layout>
  )
}

export default Signup
