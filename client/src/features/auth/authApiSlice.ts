import apiSlice from '~/app/api/apiSlice'
import { logout, setCredentitals } from './authSlice'

export type CredentialsType = {
  username: string
  password: string
}

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation({
      query: (credentials: CredentialsType) => ({
        url: '/auth',
        method: 'POST',
        body: { ...credentials }
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          const { accessToken } = data as { accessToken: string }

          dispatch(setCredentitals({ accessToken }))
        } catch (error) {
          console.error(error)
        }
      }
    }),
    signup: builder.mutation({
      query: (userData: CredentialsType) => ({
        url: '/users',
        method: 'POST',
        body: { ...userData }
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          const { accessToken } = data as { accessToken: string }

          dispatch(setCredentitals({ accessToken }))
        } catch (error) {
          console.error(error)
        }
      }
    }),
    sendLogout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST'
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled

          dispatch(logout(undefined))
          setTimeout(() => {
            dispatch(apiSlice.util.resetApiState())
          }, 1000)
        } catch (error) {
          console.error(error)
        }
      }
    }),
    refresh: builder.mutation({
      query: () => ({
        url: '/auth/refresh',
        method: 'GET'
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          const { accessToken } = data as { accessToken: string }

          dispatch(setCredentitals({ accessToken }))
        } catch (error) {
          console.error(error)
        }
      }
    })
  })
})

export const { useLoginMutation, useSendLogoutMutation, useSignupMutation, useRefreshMutation } =
  authApiSlice
