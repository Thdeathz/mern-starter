import apiSlice from '~/app/api/apiSlice'
import { logout, resetEmailSuccess, setCredentitals, setResetEmail, setVerified } from './authSlice'

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation({
      query: (
        credentials:
          | UserCredentials
          | {
              googleIdToken: string
            }
      ) => ({
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
      query: (userData: UserCredentials) => ({
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
    }),

    forgotPassword: builder.mutation({
      query: (email: string) => ({
        url: '/reset-password/request',
        method: 'POST',
        body: { email }
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          const response = data as ApiResponse<{ email: string }>

          dispatch(setResetEmail({ email: response.data.email }))
        } catch (error) {
          console.error(error)
        }
      }
    }),

    verifyOTPToken: builder.mutation({
      query: data => ({
        url: '/reset-password/verify',
        method: 'POST',
        body: { ...data }
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled

          dispatch(setVerified({ verified: true }))
        } catch (error) {
          console.error(error)
        }
      }
    }),

    resetPassword: builder.mutation({
      query: (data: ResetPasswordRequest) => ({
        url: '/reset-password',
        method: 'POST',
        body: { ...data }
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled

          dispatch(resetEmailSuccess())
        } catch (error) {
          console.error(error)
        }
      }
    })
  })
})

export const {
  useLoginMutation,
  useSendLogoutMutation,
  useSignupMutation,
  useRefreshMutation,
  useForgotPasswordMutation,
  useVerifyOTPTokenMutation,
  useResetPasswordMutation
} = authApiSlice
