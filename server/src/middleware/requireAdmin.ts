import { RequestHandler } from 'express'

const requireAdmin: RequestHandler = (req, res, next) => {
  const roles = (req as any).roles

  if (!roles.includes('Admin')) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  next()
}

export default requireAdmin
