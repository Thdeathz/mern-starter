export type ROLE = 'User' | 'Admin'

export const ROLES: {
  [key in ROLE]: ROLE
} = {
  User: 'User',
  Admin: 'Admin'
}
