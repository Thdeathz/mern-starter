import { RequestHandler } from 'express'
import asyncHandler from 'express-async-handler'
import bcrypt from 'bcrypt'

import { UserData } from '~/@types'
import User from '~/models/User.model'
import { sendResWithTokens } from '~/utils/jwtToken'

/**
 * @desc Get all users
 * @route GET /users
 * @access Private
 */
export const getAllUsers: RequestHandler = asyncHandler(async (req, res) => {
  const users = await User.find().select(['-password', '-refreshToken', '-active']).lean()

  if (!users?.length) {
    res.status(400).json({ message: 'No users found' })
    return
  }

  res.json(users)
})

/**
 * @desc Create new user
 * @route POST /users
 * @access Public
 */
export const createNewUser: RequestHandler = asyncHandler(async (req, res) => {
  const { email, password, roles } = <UserData>req.body

  // Confirm data
  if (!email || !password) {
    res.status(400).json({ message: 'Please provide all required fields' })
    return
  }

  // Check if user already existed
  const userExisted = await User.findOne({ email })
    .collation({ locale: 'en', strength: 2 })
    .lean()
    .exec()
  if (userExisted) {
    res.status(409).json({ message: 'User already existed' })
    return
  }

  // Hash password
  const hashedPassword: string = await bcrypt.hash(<string>password, 10)
  const userObject =
    !Array.isArray(roles) || !roles.length
      ? { email, password: hashedPassword, roles: ['User'] }
      : { email, password: hashedPassword, roles }

  // Create new user
  const user = await User.create(userObject)
  if (user) {
    await sendResWithTokens(user, req.cookies, res)
  } else res.status(400).json({ message: 'Invaild user data received' })
})
