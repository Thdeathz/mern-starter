import { RequestHandler } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'

const verifyJWT: RequestHandler = (req, res, next) => {
  const authHeader = (req.headers.authorization || req.headers.Authorization) as string | undefined

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  const token: string = authHeader.split(' ')[1]

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, decoded) => {
    const userData = decoded as JwtPayload | undefined

    if (err || !userData || !userData.UserInfo) {
      res.status(403).json({ message: 'Forbidden' })
      return
    }

    ;(req as any).user = userData.UserInfo.username
    ;(req as any).roles = userData.UserInfo.roles

    next()
  })
}

export default verifyJWT
