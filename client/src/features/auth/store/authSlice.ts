import { createSlice } from '@reduxjs/toolkit'

import { RootState } from '~/app/store'

type StateType = {
  token: string | null
  resetEmail: string | null
  verified: boolean
}

const initialState: StateType = { token: null, resetEmail: null, verified: false }

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentitals: (state, action) => {
      const { accessToken } = action.payload as { accessToken: string }
      state.token = accessToken
    },
    logout: state => {
      state.token = null
    },
    setResetEmail: (state, action) => {
      const { email } = action.payload as { email: string }
      state.resetEmail = email
    },
    setVerified: (state, action) => {
      const { verified } = action.payload as { verified: boolean }
      state.verified = verified
    },
    resetEmailSuccess: state => {
      state.resetEmail = null
      state.verified = false
    }
  }
})

export const { setCredentitals, logout, setResetEmail, setVerified, resetEmailSuccess } =
  authSlice.actions

export default authSlice.reducer

export const selectCurrentToken = (state: RootState) => state.auth.token
export const selectResetEmail = (state: RootState) => state.auth.resetEmail
export const selectVerified = (state: RootState) => state.auth.verified
