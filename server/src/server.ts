import express from 'express'
import dotenv from 'dotenv'
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'
import path from 'path'
import cookieParser from 'cookie-parser'
import mongoose, { Error } from 'mongoose'
import admin from 'firebase-admin'

import connectDB from '~/config/dbConnect'
import corsOptions from '~/config/corsOptions'
import serviceAccount from './config/firebase'
import { transporter } from './config/mailTransporter'
import errorHandler from '~/middleware/errorHandler'
import rootRoute from '~/routes/root.route'
import notFoundRoute from '~/routes/404.route'
import userRoutes from '~/routes/user.route'
import authRoutes from '~/routes/auth.route'
import resetPasswordRoutes from '~/routes/resetPassword.route'

dotenv.config()
const app = express()
const PORT: string | 3500 = process.env.PORT || 3500

console.log(process.env.NODE_ENV)
connectDB()

/* MIDDLEWARE */
app.use(morgan('dev'))
app.use(helmet())
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

/* CONFIG */
app.use('/api', express.static(path.join(__dirname, '../public')))
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

/* ROUTES */
// public routes
app.use('/api', rootRoute)
app.use('/api/auth', authRoutes)
app.use('/api/reset-password', resetPasswordRoutes)

// private routes
app.use('/api/users', userRoutes)
app.use('*', notFoundRoute)

app.use(errorHandler)

// mongodb connection testing
mongoose.connection.once('open', () => {
  console.log('Connected to database ><!')

  // nodemailer transporter testing
  transporter.verify((error, success) => {
    if (error) {
      console.log(error)
    } else {
      console.log('Server is ready to send emails')
    }
  })

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
})

mongoose.connection.on('error', (err: Error) => {
  console.log(err)
})
