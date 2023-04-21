import express from 'express'

import requestLimiter from '~/middleware/requestLimiter'
import {
  forgotPassword,
  resetPassword,
  verifyOTPToken
} from '~/controllers/resetPassword.controller'

const router = express.Router()

router.route('/').post(requestLimiter, resetPassword)

router.route('/request').post(requestLimiter, forgotPassword)

router.route('/verify').post(requestLimiter, verifyOTPToken)

export default router
