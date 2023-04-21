import { createEntityAdapter, createSelector } from '@reduxjs/toolkit'
import apiSlice from '~/app/api/apiSlice'
import { RootState } from '~/app/store'
import { ROLE } from '~/config/roles'

export interface User {
  id: string
  username: string
  roles: ROLE[]
  active: boolean
}

const usersAdapter = createEntityAdapter<User>({})

const initialState = usersAdapter.getInitialState()

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getUsers: builder.query({
      query: () => ({
        url: '/users',
        validateStatus: (response: Response, result: any) =>
          response.status === 200 && !result.isError
      }),
      transformResponse: (response: (User & { _id: string })[]) => {
        const loaderUsers: User[] = response.map(user => {
          user.id = user._id
          return user as User
        })

        return usersAdapter.setAll(initialState, loaderUsers)
      },
      providesTags: result => {
        if (result?.ids) {
          return [
            { type: 'User', id: 'LIST' },
            ...result.ids.map(id => ({ type: 'User' as const, id }))
          ]
        } else return [{ type: 'User', id: 'LIST' }]
      }
    })
  })
})

export const { useGetUsersQuery } = usersApiSlice

export const selectUsersResult = usersApiSlice.endpoints.getUsers.select(undefined)

const selectUserData = createSelector(
  selectUsersResult,
  usersResult => usersResult.data as NonNullable<typeof usersResult.data>
)

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds
} = usersAdapter.getSelectors((state: RootState) => selectUserData(state) ?? initialState)
