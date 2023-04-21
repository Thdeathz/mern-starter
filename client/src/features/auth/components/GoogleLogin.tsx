import React from 'react'
import { signInWithPopup } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { FormInstance, message } from 'antd'

import GoogleLogo from '~/assets/google_logo.svg'
import { auth, googleProvider } from '~/config/firebase'
import { useLoginMutation } from '../store/authApiSlice'

type PropsType = {
  form: FormInstance<UserCredentials>
}

const GoogleLogin = ({ form }: PropsType) => {
  const navigate = useNavigate()
  const [login] = useLoginMutation()

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      if (!result) return

      const googleIdToken = await result.user.getIdToken(true)
      if (!googleIdToken) return
      await login({ googleIdToken })
      form.resetFields()
      message.success('Login successfully!')
      navigate('/')
    } catch (error) {
      console.error('==> Error', error)
      message.error('Login failed! Please try again later.')
    }
  }

  return (
    <button
      type="button"
      className="flex-center group max-h-[2.5rem] min-h-[2.5rem] w-full rounded-md border transition-colors hover:border-primary-5"
      onClick={handleGoogleLogin}
    >
      <img src={GoogleLogo} className="w-[2rem]" />
      <span className="text-base font-medium transition-colors group-hover:text-primary-5">
        Google
      </span>
    </button>
  )
}

export default GoogleLogin
