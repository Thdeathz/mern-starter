import { RateLimitRequestHandler, rateLimit } from 'express-rate-limit'

const loginLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // limit each IP to 10 requests per windowMs
  message: {
    message: 'Too many accounts created from this IP, please try again after 1 minute'
  },
  handler: (req, res, next, options) => {
    res.status(options.statusCode).send(options.message)
  }
})

export default loginLimiter
