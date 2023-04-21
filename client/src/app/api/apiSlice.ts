import { BaseQueryFn } from '@reduxjs/toolkit/dist/query/baseQueryTypes'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../store'
import { setCredentitals } from '~/features/auth/authSlice'

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token

    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }

    return headers
  }
})

const baseQueryWithRetry: BaseQueryFn = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result.error?.status === 403) {
    const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)
    if (refreshResult?.data) {
      // store new token
      api.dispatch(setCredentitals({ ...refreshResult.data }))

      // retry original request
      result = await baseQuery(args, api, extraOptions)
    } else {
      if (refreshResult?.error?.status === 403) {
        const error = refreshResult.error.data as { message: string }
        error.message = 'Your session has expired. Please log in again ><!'
      }

      return refreshResult
    }
  }

  return result ?? { data: undefined, error: undefined }
}

const apiSlice = createApi({
  baseQuery: baseQueryWithRetry,
  tagTypes: ['User'],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  endpoints: builder => ({})
})

export default apiSlice
