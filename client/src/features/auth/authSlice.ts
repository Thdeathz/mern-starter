import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '~/app/store'

type StateType = {
  token: string | null
}

const initialState: StateType = { token: null }

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
    }
  }
})

export const { setCredentitals, logout } = authSlice.actions

export default authSlice.reducer

export const selectCurrentToken = (state: RootState) => state.auth.token
