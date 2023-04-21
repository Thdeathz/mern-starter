import { check } from 'express-validator'

export const validateLogin = () => {
  return [
    check('email', 'Email is required').notEmpty(),
    check('email', 'Email is invalid').isEmail(),
    check('password', 'Password is required').notEmpty()
  ]
}
