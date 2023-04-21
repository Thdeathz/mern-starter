import { RequestHandler } from 'express'
import asyncHandler from 'express-async-handler'
import { UserData } from '~/@types'
import User from '~/models/User.model'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const signNewRefreshToken = (userData: UserData & { _id: string }): string => {
  return jwt.sign({ id: userData._id }, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: '7d'
  })
}

export const signNewAccessToken = (userData: UserData & { _id: string }): string => {
  return jwt.sign(
    {
      UserInfo: {
        id: userData._id,
        username: userData.username,
        roles: userData.roles
      }
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: '15m' }
  )
}

/**
 * @desc Login
 * @route POST /auth
 * @access Public
 */
export const login: RequestHandler = asyncHandler(async (req, res) => {
  const cookies = req.cookies
  const { username, password } = <UserData>req.body

  if (!username || !password) {
    res.status(400).json({ message: 'Please provide all required fields' })
    return
  }

  const foundUser = await User.findOne({ username }).exec()
  if (!foundUser || !foundUser.active) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  const match: boolean = await bcrypt.compare(password, foundUser.password)
  if (!match) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  // gen new token
  const accessToken: string = signNewAccessToken(foundUser)

  const refreshToken: string = signNewRefreshToken(foundUser)

  // remove unuse refresh token
  if (cookies?.jwt) {
    const oldRefreshToken = cookies.jwt
    const user = await User.findOne({ refreshToken: oldRefreshToken }).exec()

    if (user) await user.updateOne({ refreshToken: '' })

    res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'none' })
  }

  // saving refresh token with current user
  await foundUser.updateOne({ refreshToken })

  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 7 // match to refresh token expiration
  })

  res.json({ accessToken })
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
