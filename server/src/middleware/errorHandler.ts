import { ErrorRequestHandler } from 'express'

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log(err.stack)
  const status: number = res.statusCode ?? 500

  res.status(status)

  res.json({
    message: err.message,
    isError: true
  })
}

export default errorHandler
