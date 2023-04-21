import { UserData } from '~/@types'
import { RequestHandler } from 'express'
import User from '~/models/User.model'
import asyncHandler from 'express-async-handler'
import bcrypt from 'bcrypt'
import { signNewAccessToken, signNewRefreshToken } from './auth.controller'

/**
 * @desc Get all users
 * @route GET /users
 * @access Private
 */
export const getAllUsers: RequestHandler = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').lean()

  if (!users?.length) {
    res.status(400).json({ message: 'No users found' })
    return
  }

  res.json(users)
})

/**
 * @desc Create new user
 * @route POST /users
 * @access Private
 */
export const createNewUser: RequestHandler = asyncHandler(async (req, res) => {
  const { username, password, roles } = <UserData>req.body

  // Confirm data
  if (!username || !password) {
    res.status(400).json({ message: 'Please provide all required fields' })
    return
  }

  // Check if user already existed
  const userExisted = await User.findOne({ username })
    .collation({ locale: 'en', strength: 2 })
    .lean()
    .exec()
  if (userExisted) {
    res.status(409).json({ message: 'User already existed' })
    return
  }

  // Hash password
  const hashedPassword: string = await bcrypt.hash(<string>password, 10)
  const userObject: UserData =
    !Array.isArray(roles) || !roles.length
      ? { username, password: hashedPassword, roles: ['User'] }
      : { username, password: hashedPassword, roles }

  const jwtPayload = { username: userObject.username, roles: userObject.roles }
  // Create new user
  const user = await User.create(userObject)
  if (user) {
    const accessToken: string = signNewAccessToken(user)

    const refreshToken: string = signNewRefreshToken(user)

    await user.updateOne({ refreshToken })

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24 * 7 // match to refresh token expiration
    })
    res.status(201).json({ accessToken })
  } else res.status(400).json({ message: 'Invaild user data received' })
})
