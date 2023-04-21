import express from 'express'
import { createNewUser, getAllUsers } from '~/controllers/users.controller'
import verifyJWT from '~/middleware/verifyJWT'

const router = express.Router()

router.route('/').get(verifyJWT, getAllUsers).post(createNewUser)

export default router
