import React, { useState } from 'react'
import { Layout } from '~/components'
import {
  Box,
  IconButton,
  InputAdornment,
  Typography,
  ButtonBase,
  CircularProgress,
  TextField,
  Checkbox,
  FormControlLabel
} from '@mui/material'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { Link, useNavigate } from 'react-router-dom'
import { useLoginMutation } from './authApiSlice'
import { setCredentitals } from './authSlice'
import { useAppDispatch } from '~/hooks/useRedux'
import usePersist from '~/hooks/usePersist'

type FormData = {
  username: string
  password: string
}

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [login, { isLoading }] = useLoginMutation()
  const { persist, setPersist } = usePersist()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors }
  } = useForm<FormData>()
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const onLogin: SubmitHandler<FormData> = async (data: FormData) => {
    try {
      const { username, password } = data
      const { accessToken } = (await login({ username, password }).unwrap()) as {
        accessToken: string
      }
      dispatch(setCredentitals({ accessToken }))
      reset()
      navigate('/home')
    } catch (error) {
      const apiError = error as { status: number }
      if (apiError.status === 401) {
        setError('root.serverError', {
          type: 'unauthorized'
        })
        setError('username', {
          type: 'unauthorized',
          message: ' '
        })
        setError('password', {
          type: 'unauthorized',
          message: ' '
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
          Login
        </Typography>

        <Box className="mb-2 flex h-[5vh] items-center justify-start text-red-500">
          {errors.root?.serverError.type === 'unauthorized' && (
            <Typography>Invalid username or password</Typography>
          )}
          {errors.root?.serverError.type === 'noResponse' && (
            <Typography>No server response</Typography>
          )}
        </Box>

        <form noValidate onSubmit={handleSubmit(onLogin)}>
          <TextField
            label="Username"
            variant="standard"
            required
            autoFocus
            fullWidth
            error={!!errors.username}
            helperText={errors.username?.message ?? ' '}
            {...register('username', { required: 'Username is required' })}
          />

          <TextField
            label="Password"
            variant="standard"
            required
            fullWidth
            autoComplete="true"
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
            {...register('password', { required: 'Password is required' })}
          />

          <Box className="flex items-center justify-between">
            <FormControlLabel
              label="Trust this device"
              control={<Checkbox checked={persist} onChange={() => setPersist(!persist)} />}
            />

            <ButtonBase
              type="submit"
              className="mt-2 rounded-md bg-white px-2 py-1 font-bold text-black"
            >
              {!isLoading ? (
                'Login'
              ) : (
                <CircularProgress className="text-width text-black" size={24} />
              )}
            </ButtonBase>
          </Box>

          <Link to="/signup" className="underline hover:text-blue-600">
            Sign up ?
          </Link>
        </form>
      </Box>
    </Layout>
  )
}

export default Login
