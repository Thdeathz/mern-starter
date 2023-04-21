import express, { RequestHandler } from 'express'
import path from 'path'

const router = express.Router()

const handleNavigateToPageNotFound: RequestHandler = (req, res) => {
  res.status(404)

  if (req.accepts('html')) res.sendFile(path.join(__dirname, '../../views/404.html'))
  else if (req.accepts('json')) res.json({ error: '404 Not found' })
  else res.type('txt').send('Not found')
}

router.get('*', handleNavigateToPageNotFound)

export default router
