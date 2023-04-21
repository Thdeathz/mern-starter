import { Response } from 'express'
import jwt from 'jsonwebtoken'

import User, { UserType } from '~/models/User.model'

/**
 * @desc Sign new refresh token
 * @param userData
 * @access Private
 */
export const signNewRefreshToken = (userData: UserType & { _id: string }): string => {
  return jwt.sign({ id: userData._id }, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: '7d'
  })
}

/**
 * @desc Sign new access token
 * @param userData
 * @access Private
 */
export const signNewAccessToken = (userData: UserType & { _id: string }): string => {
  return jwt.sign(
    {
      UserInfo: {
        id: userData._id,
        email: userData.email,
        roles: userData.roles
      }
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: '15m' }
  )
}

/**
 * @desc Send response with new access and refresh token
 * @param userData
 * @param cookies
 * @param res
 * @access Private
 */
export const sendResWithTokens = async (
  userData: UserType & { _id: string },
  cookies: any,
  res: Response
) => {
  // gen new token
  const accessToken: string = signNewAccessToken(userData)

  const refreshToken: string = signNewRefreshToken(userData)

  // remove unuse refresh token
  if (cookies?.jwt) {
    const oldRefreshToken = cookies.jwt
    const user = await User.findOne({ refreshToken: oldRefreshToken }).exec()

    if (user) await user.updateOne({ refreshToken: '' })

    res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'none' })
  }

  // saving refresh token with current user
  await userData.updateOne({ refreshToken })

  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 7 // match to refresh token expiration
  })

  res.json({ accessToken })
}
