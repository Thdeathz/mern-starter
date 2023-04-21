import express, { RequestHandler } from 'express'
import path from 'path'

const router = express.Router()

const handleNavigateToIndexPage: RequestHandler = (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/index.html'))
}

router.get('^/$|/index(.html)?', handleNavigateToIndexPage)

export default router
