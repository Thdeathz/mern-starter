import { RequestHandler } from 'express'
import asyncHandler from 'express-async-handler'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { getAuth } from 'firebase-admin/auth'

import { UserData } from '~/@types'
import User from '~/models/User.model'
import { sendResWithTokens, signNewAccessToken, signNewRefreshToken } from '~/utils/jwtToken'

/**
 * @desc Login
 * @route POST /auth
 * @access Public
 */
export const login: RequestHandler = asyncHandler(async (req, res) => {
  const cookies = req.cookies
  const googleIdToken = req.body.googleIdToken
  const { email, password } = <UserData>req.body

  if (googleIdToken) {
    getAuth()
      .verifyIdToken(googleIdToken)
      .then(async decodedToken => {
        const { uid, email } = decodedToken
        const foundUser = await User.findOne({ email }).exec()
        if (!foundUser) {
          const user = await User.create({
            uid,
            email,
            roles: ['User'],
            password: 'login with google'
          })
          await sendResWithTokens(user, cookies, res)
          return
        }
        await sendResWithTokens(foundUser, cookies, res)
      })
      .catch(error => {
        res.status(400).json({ message: 'Unauthorized' })
      })
    return
  }

  if (!email || !password) {
    res.status(400).json({ message: 'Please provide all required fields' })
    return
  }

  const foundUser = await User.findOne({ email }).exec()
  if (!foundUser || !foundUser.active) {
    res.status(401).json({ message: 'Unauthorized/InvalidEmail' })
    return
  }

  const match: boolean = await bcrypt.compare(password, foundUser.password)
  if (!match) {
    res.status(401).json({ message: 'Unauthorized/InvalidPassword' })
    return
  }

  await sendResWithTokens(foundUser, cookies, res)
})

/**
 * @desc Refresh
 * @route POST /auth/refresh
 * @access Public
 */
export const refresh: RequestHandler = asyncHandler(async (req, res) => {
  const cookie = req.cookies

  if (!cookie.jwt) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  const refreshToken: string = cookie.jwt
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'none',
    secure: true
  })

  const user = await User.findOne({ refreshToken }).exec()
  // detected refresh token reuse
  if (!user || !user.active) {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string, async (err, decoded) => {
      const userData = decoded as UserData | undefined

      if (!err && userData) {
        const hackedUser = await User.findById(userData.id)
        await hackedUser?.updateOne({ refreshToken: '' })
      }
    })

    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  // gen new access and refresh token for this user
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string, async (err, decoded) => {
    const userData = decoded as (UserData & { _id: string }) | undefined

    if (err || !userData || user?._id.toString() !== userData.id) {
      await user?.updateOne({ refreshToken: '' })
      res.status(403).json({ message: 'Forbidden' })
      return
    }

    const newAccessToken: string = signNewAccessToken(user)
    const newRefreshToken: string = signNewRefreshToken(user)

    // save new refresh token to db
    await user.updateOne({ refreshToken: newRefreshToken })

    res.cookie('jwt', newRefreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7 // match to refresh token expiration
    })
    res.json({ accessToken: newAccessToken })
  })
})

/**
 * @desc Logout
 * @route POST /auth/logout
 * @access Public
 */
export const logout: RequestHandler = asyncHandler(async (req, res) => {
  const cookie = req.cookies

  if (!cookie.jwt) {
    res.status(204)
    return
  }

  // clear jwt cookie
  res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'none' })

  // check refresh token in db
  const user = await User.findOne({ refreshToken: cookie.jwt }).exec()
  if (!user) {
    res.sendStatus(403)
    return
  }

  // delete refresh token in db
  await user.updateOne({ refreshToken: '' })

  res.json({ message: 'Logged out. Cookie cleared ><!' })
})
